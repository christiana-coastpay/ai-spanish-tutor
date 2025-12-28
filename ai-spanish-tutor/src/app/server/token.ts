"use server";

export async function getSessionToken() {
  try {
    const sessionConfig = {
      session: {
        type: "realtime",
        model: "gpt-realtime-mini-2025-12-15",
        audio: {
          output: { voice: "verse" },
        },
      },
    };

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionConfig),
    });

    const data = await response.json();
    console.log("Session created:", data);
    return data.value;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}
