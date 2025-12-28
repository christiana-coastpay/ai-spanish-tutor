# Spanish Tutor Voice Agent

Voice-based Spanish language learning app built with OpenAI's Realtime API and Agents SDK.

## What is this?

A conversational Spanish tutor that uses voice-to-voice AI to help you practice Spanish. Talk naturally with Miguel, your AI Spanish teacher, who adapts to your level and provides real-time feedback.

## Requirements

- Node.js 22 or newer with npm installed
- An OpenAI account with an OpenAI API key

## Setup

Clone this repository:
```bash
git clone git@github.com:dkundel-openai/aie-voice-agents-workshop.git
cd aie-voice-agents-workshop
npm install
```

This will automatically install the [OpenAI Agents SDK](https://openai.github.io/openai-agents-js), [`zod`](https://zod.dev) and TypeScript.

### Environment Variables

Create a `.env.local` file in the `02-voice` directory:
```bash
cd 02-voice
echo "OPENAI_API_KEY=your-api-key-here" > .env.local
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

## Running the App

### Development

Start the Next.js development server:
```bash
npm run start:02
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add `OPENAI_API_KEY` to Vercel's environment variables
4. Deploy!

The app works on mobile browsers too - just visit the deployed URL on your phone.

## How it Works

The app uses:
- **OpenAI Realtime API** for low-latency voice-to-voice conversations
- **WebRTC** for browser-based audio streaming
- **Agents SDK** for managing the conversation flow and voice agent logic
- **Server-side token generation** to keep your API key secure

## Project Structure

- `01-basic/` - Simple text-based agent example (learn the SDK basics)
- `02-voice/` - Spanish tutor voice agent (Next.js app)
  - `app/page.tsx` - Main UI and voice agent logic
  - `app/server/token.ts` - Server-side session token generation

## Resources

- [Agents SDK Quickstart](https://openai.github.io/openai-agents-js/guides/quickstart)
- [Agents SDK Voice Quickstart](https://openai.github.io/openai-agents-js/guides/voice-agents/quickstart/)
- [Agents SDK Examples](https://github.com/openai/openai-agents-js/tree/main/examples)
- [Voice Agents Guide on OpenAI Docs](https://platform.openai.com/docs/guides/voice-agents)
- [Realtime API Documentation](https://platform.openai.com/docs/api-reference/realtime)