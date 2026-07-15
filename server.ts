import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!ai });
  });

  // Endpoints: generate insights using historical logs
  app.post("/api/insights/generate", async (req, res) => {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured. Please add your GEMINI_API_KEY in Settings." });
    }

    try {
      const { logs, profile } = req.body;

      const prompt = `
        You are VEYA, an elegant AI-powered hormonal and menstrual wellness companion.
        Based on the user's menstrual logs and profile, generate exactly 3 beautiful, highly personalized insights.

        User Profile:
        ${JSON.stringify(profile, null, 2)}

        Menstrual & Daily Logs:
        ${JSON.stringify(logs, null, 2)}

        Rules for insights:
        1. Always be supportive, non-clinical, empathetic, and calming.
        2. Strictly follow the language guidelines:
           - Use terms like "We noticed...", "Your logs suggest...", "You may wish to consider...", "Many people find..."
           - NEVER diagnose, prescribe, or use alarmist language (e.g. do not say "You have a disorder", "This indicates disease", "You are at risk of").
        3. Provide 3 cards, each in a separate category chosen from: 'rhythm', 'symptoms', 'sleep', 'energy', 'reflection'.
        4. Do not offer clinical diagnostics. Offer lifestyle, mindfulness, nutritional, or scheduling guidance.

        Return a valid JSON array of objects fitting the following structure:
        [
          {
            "id": "unique-id-string",
            "title": "Short, beautiful title (e.g. 'Embracing Follicular Vitality' or 'Sleep Synergy')",
            "category": "rhythm" | "symptoms" | "sleep" | "energy" | "reflection",
            "observation": "What we noticed in the logs (e.g., 'We noticed your sleep duration drops slightly during your luteal phase')",
            "context": "Empathetic, gentle explanation of why this happens hormonally or behaviorally",
            "suggestion": "A supportive action or practice (e.g., 'To prepare, you might enjoy wind-down teas or a slow yoga flow 30 minutes before sleep')",
            "timestamp": "Today"
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                observation: { type: Type.STRING },
                context: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                timestamp: { type: Type.STRING }
              },
              required: ["id", "title", "category", "observation", "context", "suggestion", "timestamp"]
            }
          }
        }
      });

      const insights = JSON.parse(response.text || "[]");
      res.json(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ error: "Failed to generate premium VEYA insights." });
    }
  });

  // Endpoints: AI Chat using historical logs and profile context
  app.post("/api/chat", async (req, res) => {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured. Please add your GEMINI_API_KEY in Settings." });
    }

    try {
      const { messages, logs, profile, currentPhase } = req.body;

      const systemInstruction = `
        You are VEYA, a calm, supportive, emotionally intelligent hormonal and menstrual wellness companion.
        Your tone is peaceful, warm, sophisticated, and empathetic. Avoid clinical coldness, childishness, or alarmist declarations.

        You are speaking with a user who tracks their menstrual cycle. Use their data to ground your responses but never diagnose or claim medical certainty.

        Active Phase Context:
        The user is currently in their: ${currentPhase || 'unknown'} phase.

        User Profile:
        ${JSON.stringify(profile, null, 2)}

        Recent Logs Context:
        ${JSON.stringify(logs, null, 2)}

        Mandatory VEYA Guidelines:
        - Maintain absolute safety: Never diagnose diseases (like PCOS, Endometriosis, PMDD) or prescribe medication. Frame everything as "educational guidance" and "body-awareness tracking".
        - Do not say: "You are experiencing...", "This confirms that you have...".
        - Instead say: "We notice that your logs suggest...", "Many individuals experience...", "It can be supportive to explore...", "You might consider talking to your healthcare provider about..."
        - Ground answers directly in their logs. For example, if they ask "Why am I tired today?", check if they logged poor sleep or if they are in their luteal/menstrual phase, and connect it gently.
        - Answer warmly, succinctly, and with elegant spacing.
      `;

      // Build chat prompt history
      const formattedContents = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Error in VEYA chat:", error);
      res.status(500).json({ error: "Failed to communicate with VEYA companion." });
    }
  });

  // Endpoints: Reports summary compilation
  app.post("/api/reports/summary", async (req, res) => {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured." });
    }

    try {
      const { logs, profile } = req.body;

      const prompt = `
        You are VEYA, a premium clinical-communication AI. Generate a structured clinical reflection report based on the user's menstrual logs.
        This summary is specifically designed to facilitate conversations with their healthcare provider or doctor.

        User Profile:
        ${JSON.stringify(profile, null, 2)}

        Menstrual & daily logs:
        ${JSON.stringify(logs, null, 2)}

        Format the report in structured markdown sections. Write it using highly respectful, clear, objective, but empathetic vocabulary.
        Ensure it contains the following exactly:
        1. "Cycle Characteristics Summary" (Average cycle length, period duration, variability noticed)
        2. "Symptom & Pain Patterns" (Most frequent symptoms, their temporal correlation with cycle phases, and severe pain events logged)
        3. "Lifestyle & Daily Well-being Correlations" (How sleep and energy align with different phases)
        4. "AI Wellness Observation" (A calm, high-level structural summary of their logs)
        5. "Doctor Conversation Guide" (3 specific, beautifully phrased questions the user can print out to ask their gynecologist or healthcare practitioner)
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ reportMarkdown: response.text });
    } catch (error) {
      console.error("Error compiling report summary:", error);
      res.status(500).json({ error: "Failed to compile the professional wellness report." });
    }
  });

  // Vite Integration Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VEYA custom Express server running on port ${PORT}`);
  });
}

startServer();
