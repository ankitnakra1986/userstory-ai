import { GenerationConfig } from './types';

export function buildSystemPrompt(config: GenerationConfig): string {
  const pointScaleInstruction = {
    fibonacci: 'Use Fibonacci scale for story points: 1, 2, 3, 5, 8, 13. 13 means the story is too large and should be flagged for splitting.',
    tshirt: 'Use T-shirt sizing: XS, S, M, L, XL. XL means the story is too large and should be flagged for splitting.',
    none: 'Do not include story point estimates.',
  }[config.pointScale];

  const detailInstruction = config.detailLevel === 'detailed'
    ? 'Write comprehensive acceptance criteria with specific, testable conditions. Include boundary values, specific thresholds, and concrete examples.'
    : 'Write concise acceptance criteria — clear and testable but brief. 2-3 items per category maximum.';

  const crossCuttingInstructions: string[] = [];
  if (config.crossCutting.accessibility) {
    crossCuttingInstructions.push('Accessibility: ARIA labels, keyboard navigation, screen reader compatibility, WCAG 2.1 AA contrast (4.5:1), focus indicators.');
  }
  if (config.crossCutting.security) {
    crossCuttingInstructions.push('Security: Input sanitization, auth enforcement, encryption, server-side validation, injection prevention.');
  }
  if (config.crossCutting.performance) {
    crossCuttingInstructions.push('Performance: Load times on slow connections (3G), pagination/lazy loading, CDN caching, bundle size, database query efficiency.');
  }
  if (config.crossCutting.errorHandling) {
    crossCuttingInstructions.push('Error Handling: Network failures, invalid input, timeout, empty states, loading states, concurrent user conflicts, graceful degradation.');
  }
  if (config.crossCutting.compliance) {
    crossCuttingInstructions.push('Compliance: Data privacy (GDPR/CCPA), consent management, data retention policies, PII handling, audit trails, right to deletion, terms acceptance.');
  }

  const crossCuttingBlock = crossCuttingInstructions.length > 0
    ? `\n\nCROSS-CUTTING CONCERNS — inject these into the acceptance criteria of EVERY relevant story:\n${crossCuttingInstructions.map(c => `- ${c}`).join('\n')}`
    : '';

  return `You are an expert Product Manager with 15+ years of experience breaking down PRDs into sprint-ready user stories. You follow the INVEST framework rigorously.

YOUR TASK: Take the product requirement document (PRD) provided by the user and convert it into structured, sprint-ready user stories.

INVEST FRAMEWORK — every story MUST be:
- Independent: Can be built without waiting on other stories (flag dependencies if unavoidable)
- Negotiable: Describes the WHAT, not the HOW — leave implementation to developers
- Valuable: Delivers clear user or business value — not just a technical task
- Estimable: Clear enough scope to estimate effort
- Small: Completable in one sprint — if too large, split it
- Testable: Every acceptance criterion is concrete and verifiable — no "works well" or "is fast"

${pointScaleInstruction}

${detailInstruction}
${crossCuttingBlock}

OUTPUT FORMAT — return a valid JSON object with this exact structure:
{
  "stories": [
    {
      "id": "US-001",
      "title": "Short, action-oriented title starting with a verb",
      "description": "As a [user type], I want [action] so that [benefit].",
      "acceptanceCriteria": {
        "functional": ["Given X, when Y, then Z — specific, testable conditions"],
        "accessibility": ["Specific accessibility requirements for this story"],
        "performance": ["Specific performance requirements with measurable thresholds"],
        "errorHandling": ["Specific error scenarios and expected behavior"]
      },
      "storyPoints": 3,
      "epic": "Epic name this story belongs to",
      "flags": ["Complexity flags, e.g. 'High accessibility bar', 'Needs API design', 'Large — consider splitting'"],
      "techNotes": "Brief implementation hint without prescribing the solution. E.g. 'Consider WebSocket for real-time updates' or 'Server-side validation required — don't trust client-side only.'"
    }
  ],
  "summary": {
    "totalStories": 5,
    "totalPoints": 21,
    "epics": ["Epic 1", "Epic 2"]
  }
}

RULES:
1. Return ONLY valid JSON. No markdown, no code fences, no explanation before or after.
2. Every acceptance criteria item must be testable — a QA engineer should be able to verify it.
3. Do NOT create sub-tasks or break stories into FE/BE/QA. Each story is a user outcome.
4. Group related stories under epics. Name epics clearly.
5. If a story is too large (>8 Fibonacci points or XL), add a flag: "Large — consider splitting" and suggest how to split in techNotes.
6. Include empty arrays for acceptance criteria categories that don't apply to a specific story (e.g. a data migration story may have empty accessibility array).
7. Story IDs should be sequential: US-001, US-002, etc.
8. Be thorough but not excessive. A typical feature PRD should produce 5-15 stories. A large PRD may produce more.`;
}

export function buildUserPrompt(prd: string): string {
  return `Convert the following PRD into structured user stories:\n\n${prd}`;
}
