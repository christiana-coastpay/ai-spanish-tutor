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

const spanishNewsAgent = new RealtimeAgent({
  name: "Spanish News Reader",
  instructions: `You are Miguel, a Spanish pronunciation tutor helping students read articles.
  
  CRITICAL RULES:
  - DO NOT introduce or summarize the article
  - DO NOT explain what the article is about unless asked
  - Stay COMPLETELY SILENT 95% of the time while the student reads
  - Let the student make mistakes - only correct significant pronunciation errors
  
  ONLY speak when:
  1. The student makes a MAJOR pronunciation mistake on an important word (not every small error)
  2. The student explicitly asks a question about vocabulary or grammar
  3. The student asks what something means
  
  PRONUNCIATION CORRECTIONS:
  - Correct at most 1-2 words per paragraph
  - Only correct if the word is mispronounced badly enough to change meaning
  - Ignore minor accent issues or slight mispronunciations
  - Never correct the same type of error twice in one session
  - Format: Just say the word correctly once, don't explain unless asked
  
  Your role is to be nearly invisible - like a tutor who only speaks up for important corrections.
  Keep everything under 5 words. Most of the time, say nothing at all.
  
  Never ask comprehension questions. Never give encouragement like "muy bien" unless the student explicitly asks for feedback.`,
});

const agent = new RealtimeAgent({
  name: "Voice Agent",
  instructions: "You are a helpful assistant. Hand off to Miguel the Spanish Teacher for language learning or Spanish News Reader for article reading practice.",
  handoffs: [spanishTeacherAgent, spanishNewsAgent],
});

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  publishedAt: string;
  country: string;
}

type Mode = "select" | "conversation" | "news";

export default function Home() {
  const session = useRef<RealtimeSession | null>(null);
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState<RealtimeItem[]>([]);
  const [mode, setMode] = useState<Mode>("select");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchSpanishNews() {
    setLoading(true);
    try {
      // Call your server-side API route
      const response = await fetch('/api/spanish-news');
      const data = await response.json();
      
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setLoading(false);
  }

  async function startConversation() {
    const token = await getSessionToken();
    
    session.current = new RealtimeSession(spanishTeacherAgent, {
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

    async function startNewsSession(article: NewsArticle) {
    setSelectedArticle(article);
    
    const token = await getSessionToken();
    
    session.current = new RealtimeSession(spanishNewsAgent, {
      model: "gpt-realtime-mini-2025-12-15",
    });
    
    session.current.on("history_updated", (history) => {
      setHistory(history);
    });
    
    await session.current.connect({
      apiKey: token,
    });
    
    setConnected(true);
    
    // Fetch full article content by ID
    fetch(`/api/retrieve-article?id=${article.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setSelectedArticle(prev => prev ? { ...prev, content: data.content } : null);
        }
      })
      .catch(err => console.error('Failed to fetch full article:', err));
  } 

  async function endSession() {
    setConnected(false);
    await session.current?.close();
    setSelectedArticle(null);
    setHistory([]);
    setMode("select");
  }

  function selectConversationMode() {
    setMode("conversation");
  }

  async function selectNewsMode() {
    setMode("news");
    await fetchSpanishNews();
  }

  function backToModeSelect() {
    setMode("select");
    setArticles([]);
    setSelectedArticle(null);
  }

  const getTranscript = (item: RealtimeItem) => {
    if (item.type === "message" && Array.isArray(item.content)) {
      const audioContent = item.content.find(
        (c: any) => c.type === "input_audio" || c.type === "output_audio"
      );
      
      if (audioContent && 'transcript' in audioContent) {
        return audioContent.transcript || "";
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Habla Español
            </span>
            {" "}🇲🇽
          </h1>
          <p className="text-gray-600 text-lg">
            Practice Spanish conversation or read the news with Miguel
          </p>
        </div>

        {/* Mode Selection Screen */}
        {mode === "select" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                Choose your learning mode
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Conversation Card */}
                <button
                  onClick={selectConversationMode}
                  className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 hover:border-orange-400 transition-all transform hover:scale-105"
                >
                  <div className="text-5xl mb-4">💬</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Free Conversation
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Chat naturally with Miguel about any topic
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div>✓ Natural dialogue</div>
                    <div>✓ Any level</div>
                    <div>✓ Instant feedback</div>
                  </div>
                </button>

                {/* News Reading Card */}
                <button
                  onClick={selectNewsMode}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all transform hover:scale-105"
                >
                  <div className="text-5xl mb-4">📰</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Read the News
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Practice reading real Spanish articles
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div>✓ Real articles</div>
                    <div>✓ Pronunciation help</div>
                    <div>✓ Vocabulary support</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Free Conversation Mode */}
        {mode === "conversation" && !connected && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={backToModeSelect}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back to mode selection
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Ready to practice?
              </h3>
              <p className="text-gray-600 mb-6">
                Click start to begin speaking with Miguel in Spanish!
              </p>
              <button
                onClick={startConversation}
                className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                🎤 Start Conversation
              </button>
            </div>
          </div>
        )}

        {/* News Selection Mode */}
        {mode === "news" && !connected && (
          <div>
            <button
              onClick={backToModeSelect}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back to mode selection
            </button>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-between">
                Noticias en Español
                <button
                  onClick={fetchSpanishNews}
                  disabled={loading}
                  className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Refresh"}
                </button>
              </h2>
              
              {loading && (
                <div className="text-center py-8 text-gray-500">
                  Cargando noticias...
                </div>
              )}
              
              {articles.length > 0 && (
                <div className="space-y-4">
                  {articles.map((article, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-all cursor-pointer hover:shadow-md"
                      onClick={() => startNewsSession(article)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-800 flex-1">
                          {article.title}
                        </h3>
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
                          {article.country === 'mx' && '🇲🇽 México'}
                          {article.country === 'ar' && '🇦🇷 Argentina'}
                          {article.country === 'co' && '🇨🇴 Colombia'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.source}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && articles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Click refresh to load articles
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Session View */}
        {connected && (
          <div>
            <div className="flex justify-center mb-6">
              <button
                onClick={endSession}
                className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 bg-red-500 hover:bg-red-600 text-white"
              >
                🔴 End Session
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Article Display (only in news mode) */}
              {selectedArticle && (
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {selectedArticle.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-4 mb-4">
                    {selectedArticle.content.split('. ').map((sentence, idx) => (
                      <p key={idx} className="text-lg">
                        {sentence}{sentence.endsWith('.') ? '' : '.'}
                      </p>
                    ))}
                  </div>
                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Read full article →
                  </a>
                </div>
              )}

              {/* Conversation History */}
              <div className={`bg-white rounded-2xl shadow-xl p-6 ${selectedArticle ? 'lg:col-span-1' : 'lg:col-span-3 max-w-3xl mx-auto'}`}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Conversation
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {history.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Start speaking to see your conversation...
                    </div>
                  )}
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
                            className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                              item.role === "user"
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="text-xs font-semibold mb-1 opacity-70">
                              {item.role === "user" ? "You" : "Miguel"}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}