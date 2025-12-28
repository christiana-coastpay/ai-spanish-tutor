# AI Spanish Tutor 🇲🇽

Voice-based Spanish language learning app built with OpenAI's Realtime API and Agents SDK.

## What is this?

A conversational Spanish tutor that uses voice-to-voice AI to help you practice Spanish. Talk naturally with Miguel, your AI Spanish teacher, who adapts to your level and provides real-time feedback.

## Requirements

- Node.js 22 or newer with npm installed
- An OpenAI account with an OpenAI API key

## Setup

Clone this repository:
```bash
git clone https://github.com/christiana-coastpay/ai-spanish-tutor.git
cd ai-spanish-tutor
npm install
```

This will automatically install the [OpenAI Agents SDK](https://openai.github.io/openai-agents-js), Next.js, and all dependencies.

### Environment Variables

Create a `.env.local` file in the `ai-spanish-tutor` directory:
```bash
cd ai-spanish-tutor
echo "OPENAI_API_KEY=your-api-key-here" > .env.local
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

## Running the App

### Development

From the root directory, start the Next.js development server:
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

Deploy to Vercel:

1. Push your code to GitHub ✓
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set **Root Directory** to `ai-spanish-tutor`
4. Add environment variable: `OPENAI_API_KEY` = your OpenAI API key
5. Click Deploy!

The app works on mobile browsers too - just visit the deployed URL on your phone.

## How it Works

The app uses:
- **OpenAI Realtime API** (`gpt-realtime-mini-2025-12-15`) for low-latency voice-to-voice conversations
- **WebRTC** for browser-based audio streaming  
- **Agents SDK** for managing the conversation flow and voice agent logic
- **Server-side token generation** to keep your API key secure

## Features

- 🗣️ **Natural conversation** - Speak Spanish naturally, get real-time responses
- 🎯 **Adaptive learning** - Miguel adapts to your level (beginner to advanced)
- 🇲🇽 **Mexican accent** - Authentic Spanish pronunciation
- ✨ **Instant feedback** - Gentle corrections and encouragement
- 💬 **Chat history** - See transcripts of your conversation

## Project Structure
```
ai-spanish-tutor/
├── ai-spanish-tutor/          # Next.js app
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx       # Main UI and voice agent logic
│   │       └── server/
│   │           └── token.ts   # Server-side session token generation
│   ├── .env.local             # Environment variables (not committed)
│   └── package.json
├── package.json               # Root package with scripts
└── README.md
```

## Resources

- [Agents SDK Documentation](https://openai.github.io/openai-agents-js/)
- [Agents SDK Voice Quickstart](https://openai.github.io/openai-agents-js/guides/voice-agents/quickstart/)
- [Realtime API Guide](https://platform.openai.com/docs/guides/realtime)
- [Voice Agents Guide](https://platform.openai.com/docs/guides/voice-agents)