import { NextRequest, NextResponse } from 'next/server';

// Vercel serverless timeout — AI generation takes 20-30s
export const maxDuration = 60;
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt';
import { GenerationConfig } from '@/lib/types';
import { hasMinQuality, tryParseStories } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prd, config, apiKey: userKey } = body as {
      prd: string;
      config: GenerationConfig;
      apiKey?: string;
    };

    // Use user's key or fall back to server key (free tier)
    const apiKey = userKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key available. Please add your Anthropic key in Settings.' },
        { status: 400 }
      );
    }

    if (!prd || prd.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide at least 50 characters of product requirements.' },
        { status: 400 }
      );
    }

    if (prd.length > 15000) {
      return NextResponse.json(
        { error: 'Text too long. Please keep it under 15,000 characters.' },
        { status: 400 }
      );
    }

    if (!hasMinQuality(prd)) {
      return NextResponse.json(
        { error: "Your input doesn't look like product requirements. Try pasting a PRD, feature description, or meeting notes with enough context." },
        { status: 400 }
      );
    }

    // Rate limiting for free tier (server key) — check cookie
    if (!userKey) {
      const usageCount = parseInt(request.cookies.get('userstory-usage')?.value || '0');
      if (usageCount >= 3) {
        return NextResponse.json(
          { error: 'Free tries used up. Add your own API key in Settings to continue — it\'s free to create.', needsKey: true },
          { status: 429 }
        );
      }
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 4096,
      messages: [{ role: 'user', content: buildUserPrompt(prd) }],
      system: buildSystemPrompt(config),
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response. Please try again.' }, { status: 500 });
    }

    let parsed = tryParseStories(content.text);

    // Retry once if parse failed
    if (!parsed) {
      const retry = await client.messages.create({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: buildUserPrompt(prd) },
          { role: 'assistant', content: content.text },
          { role: 'user', content: 'Not valid JSON. Respond ONLY with a JSON object matching the schema. No explanation.' },
        ],
        system: buildSystemPrompt(config),
      });
      const rc = retry.content[0];
      if (rc.type === 'text') parsed = tryParseStories(rc.text);
    }

    if (!parsed) {
      return NextResponse.json(
        { error: "Couldn't generate stories from this input. Try adding more detail about the feature." },
        { status: 422 }
      );
    }

    if (!parsed.stories || !Array.isArray(parsed.stories) || parsed.stories.length === 0) {
      return NextResponse.json(
        { error: 'No stories generated. Add more detail about the feature or product.' },
        { status: 422 }
      );
    }

    // Increment usage counter for free tier
    const response = NextResponse.json(parsed);
    if (!userKey) {
      const currentUsage = parseInt(request.cookies.get('userstory-usage')?.value || '0');
      response.cookies.set('userstory-usage', String(currentUsage + 1), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';

    if (msg.includes('401') || msg.includes('authentication') || msg.includes('invalid x-api-key')) {
      return NextResponse.json({ error: 'Invalid API key. Check your key and try again.' }, { status: 401 });
    }
    if (msg.includes('credit balance') || msg.includes('billing')) {
      return NextResponse.json({ error: 'API credit balance is too low. Please add credits at console.anthropic.com/settings/billing' }, { status: 402 });
    }
    if (msg.includes('429') || msg.includes('rate')) {
      return NextResponse.json({ error: 'Rate limit hit. Wait a moment and try again.' }, { status: 429 });
    }
    if (msg.includes('overloaded') || msg.includes('529')) {
      return NextResponse.json({ error: 'AI service is busy. Please try again in a few seconds.' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
