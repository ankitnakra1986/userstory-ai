# UserStory.ai

Convert any PRD into sprint-ready user stories in 60 seconds.

An AI-powered tool that takes product requirement documents — PRDs, feature briefs, meeting notes, or any product description — and converts them into structured, INVEST-validated user stories with comprehensive acceptance criteria.

## What it does

- **INVEST-validated stories** — every story is checked for Independence, Negotiability, Value, Estimability, Size, and Testability
- **4-category acceptance criteria** — Functional, Accessibility, Performance, and Error Handling
- **Cross-cutting concerns** — automatically injects accessibility, security, performance, and error handling into relevant stories
- **Story point estimates** — Fibonacci or T-shirt sizing
- **Copy-to-clipboard** — individual stories or bulk copy, formatted as clean markdown ready for JIRA, Notion, or Confluence
- **BYOK (Bring Your Own Key)** — uses your Anthropic API key. Key stays in your browser, never stored on any server.

## Tech Stack

- **Next.js 15** — React framework
- **Tailwind CSS** — styling
- **Claude 3.5 Haiku** — AI model (via Anthropic API)
- **Vercel** — hosting

## Getting Started

### Prerequisites

- Node.js >= 18
- An [Anthropic API key](https://console.anthropic.com/)

### Install & Run

```bash
git clone https://github.com/ankitnakra/userstory-ai.git
cd userstory-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your Anthropic API key to start generating stories.

## How it works

1. **Paste** any product description — PRD, feature brief, or meeting notes
2. **Configure** detail level, story point scale, and which cross-cutting concerns to include
3. **Generate** — Claude AI converts your input into structured user stories
4. **Copy** individual stories or all at once — clean markdown format, ready for JIRA

## Architecture

```
Input (PRD text) → Next.js API Route → Claude 3.5 Haiku → Structured JSON → UI Cards
```

The intelligence lives in the system prompt (`src/lib/prompt.ts`), which encodes PM best practices:
- INVEST framework enforcement
- Structured acceptance criteria template (functional, accessibility, performance, error handling)
- Cross-cutting concern injection based on user configuration
- Story sizing and complexity flagging

## Why I built this

I spent 4 hours converting a PRD into JIRA stories last week. Not writing the PRD — just the mechanical decomposition. Every PM does this. The hardest parts:

1. Making sure nothing falls through the cracks (accessibility, error handling, edge cases)
2. Writing acceptance criteria that developers can actually build from
3. Keeping stories small enough to estimate but complete enough to be useful

This tool automates the tedious part so PMs can focus on the thinking part.

## Built by

**Ankit Nakra** — Product & AI Leader
- [LinkedIn](https://linkedin.com/in/ankitnakra)
- [GitHub](https://github.com/ankitnakra)
