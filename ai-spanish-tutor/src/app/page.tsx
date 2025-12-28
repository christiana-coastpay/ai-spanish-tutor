"use client";

import { useRef, useState } from "react";
import {
  RealtimeAgent,
  RealtimeItem,
  RealtimeSession,
} from "@openai/agents/realtime";
import { getSessionToken } from "./server/token";

const spanishTeacherAgent = new RealtimeAgent({
  name: "Spanish Teacher",
  instructions: `You are an encouraging Spanish teacher named Miguel from Mexico. 
    - Start by asking the student their Spanish level (beginner, intermediate, advanced)
    - Speak with a natural Mexican accent
    - Adapt your vocabulary and speaking speed to their level
    - Mix Spanish and English naturally - speak Spanish but explain grammar in English when needed
    - Always praise effort before correcting mistakes
    - Have natural, flowing conversations - avoid formal lesson structures
    - Don't ask "what do you want to learn next?" - just continue the conversation naturally
    - Build on what the student says rather than changing topics abruptly
    - Gently correct pronunciation and grammar in a supportive way
    - Keep the conversation going like you're chatting with a friend, not teaching a formal class
    - If there's a natural pause, share something interesting in Spanish or ask about the current topic`,
});

const agent = new RealtimeAgent({
  name: "Voice Agent",
  instructions: "You are a helpful assistant. Hand off to María the Spanish Teacher for language learning.",
  handoffs: [spanishTeacherAgent],
});

export default function Home() {
  const session = useRef<RealtimeSession | null>(null);
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState<RealtimeItem[]>([]);

  async function onConnect() {
    if (connected) {
      setConnected(false);
      await session.current?.close();
    } else {
      const token = await getSessionToken();
      session.current = new RealtimeSession(agent, {
        model: "gpt-realtime-mini-2025-12-15",
      });
      session.current.on("history_updated", (history) => {
        setHistory(history);
      });
      await session.current.connect({
        apiKey: token,
      });
      setConnected(true);
    }
  }

  const getTranscript = (item: RealtimeItem) => {
    if (item.type === "message" && Array.isArray(item.content)) {
      const audioContent = item.content.find(
        (c: any) => c.type === "input_audio" || c.type === "output_audio"
      );
      return audioContent?.transcript || "";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Habla Español 🇲🇽
          </h1>
          <p className="text-gray-600 text-lg">
            Practice Spanish conversation with Miguel, your AI tutor
          </p>
        </div>

        {/* Connection Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={onConnect}
            className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 ${
              connected
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            }`}
          >
            {connected ? "🔴 End Conversation" : "🎤 Start Conversation"}
          </button>
        </div>

        {/* Conversation History */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Conversation
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {history
                .filter((item) => item.type === "message")
                .map((item) => {
                  const transcript = getTranscript(item);
                  if (!transcript) return null;

                  return (
                    <div
                      key={item.itemId}
                      className={`flex ${
                        item.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                          item.role === "user"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1 opacity-70">
                          {item.role === "user" ? "You" : "María"}
                        </div>
                        <div className="text-base leading-relaxed">
                          {transcript}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!connected && history.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Ready to practice?
            </h3>
            <p className="text-gray-600 mb-4">
              Click "Start Conversation" and begin speaking with Miguel in Spanish!
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-6">
              <div>
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">Any Level</div>
                <div>Beginner to Advanced</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🗣️</div>
                <div className="font-semibold">Natural Speech</div>
                <div>Real conversations</div>
              </div>
              <div>
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Instant Feedback</div>
                <div>Learn as you speak</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}