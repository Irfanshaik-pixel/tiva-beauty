import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let __filename: string;
let __dirname: string;
try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch {
  // Fallback for CJS bundle where import.meta.url is undefined
  __dirname = typeof globalThis.__dirname !== 'undefined' ? globalThis.__dirname : process.cwd();
  __filename = path.join(__dirname, 'server.cjs');
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API Route for Skincare Consultation proxying Gemini safely
  app.post("/api/consultation", async (req, res) => {
    try {
      const { skinType, concern, climate, additions } = req.body;

      if (!skinType || !concern || !climate) {
        return res.status(400).json({ error: "Required fields are missing: skinType, concern, climate" });
      }

      // Check for Gemini API key and handle gracefully
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(403).json({
          error: "API_KEY_MISSING",
          message: "Please configure your GEMINI_API_KEY in the Secrets panel (Settings > Secrets) to enable AI diagnostic consultation. Your key is kept secure server-side."
        });
      }

      // Lazy initialization of Gemini Client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const userInputPrompt = `
        Skin Profile:
        - Skin Type: ${skinType}
        - Primary Aesthetic Concern: ${concern}
        - Environmental Climate: ${climate}
        - Additional Details/Preferences: ${additions || "None specified"}
      `;

      const systemInstruction = `
        You are the Chief Scientist and Organic Alchemist for TIVA Beauty & Wellness. 
        Your tone is poetic, scientific, calm, and expensive. Speak with quiet confidence. 
        Never use cheap marketing jargon, exclamation marks, or pushy sales words. Use elegant, structured formatting.
        
        Using TIVA's minimal ingredients philosophy, formulate a bespoke ritual card for this profile.
        
        Address the user respectfully and organize your analysis into these beautiful markdown headers:
        
        ### I. THE ECO-PHYSIOLOGICAL ANALYSIS
        (A deeply scientific yet poetic exposition of how their skin type interacts with their specified climate and primary concerns. Explain the trans-epidermal water loss or sebum behavior under these exact conditions.)
        
        ### II. THE MATINAL RITUAL (MORNING)
        (Walk through a precise, 2-to-3 step morning ritual using minimal TIVA products. Highlight active botanical synergisms.)
        
        ### III. THE NOCTURNAL RITUAL (EVENING)
        (A restorative nightly routine focusing on cellular repair, lipid replenishment, and calming sensory alignment.)
        
        ### IV. MOLECULAR INGREDIENT SYNERGY
        (Select 2 key ingredients from Niacinamide, Saffron Extract, Centella, Sea Buckthorn, and Rosehip Seed Oil. Explain their dermatological synergy at a cellular level for this specific skin profile).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userInputPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const diagnosticText = response.text || "Unable to formulate your routine at this moment. Please try again.";
      return res.json({ success: true, text: diagnosticText });

    } catch (err: any) {
      console.error("Gemini Consultation Error:", err);
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: err.message || "An error occurred during formulation generation."
      });
    }
  });

  // API Route for Real-Time Face Scan Analysis via base64 imagery with Gemini
  app.post("/api/analyze-scan", async (req, res) => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: "Missing 'image' parameter in request body." });
      }

      // Check for Gemini API key and handle gracefully with fallback simulation
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        console.warn("GEMINI_API_KEY is not configured. Falling back to high-fidelity simulated response.");
        return res.json({
          success: true,
          mocked: true,
          message: "Please configure your GEMINI_API_KEY in Settings > Secrets to unlock real visual scanning with deep epidermal mapping. Currently showing high-fidelity simulation analysis.",
          score: 84,
          metrics: {
            hydration: 72,
            barrier: 78,
            brightness: 69,
            oilBalance: 81,
            texture: 76,
            sensitivity: 38,
            futureRisk: 42
          },
          pinpoints: {
            tZone: { top: "21%", left: "50%" },
            leftCheek: { top: "46%", left: "33%" },
            rightCheek: { top: "51%", left: "67%" },
            mouth: { top: "71%", left: "50%" }
          },
          diagnosis: "TIVA Bio-Metric Simulation: Regional mapping indicates structural dehydration lines within the stratum spinosum layer and moderate sebum pooling in the nasal fossa. Skin elasticity is evaluated at 1.4 mN/mm with mild reactivity indicators.",
          morningRoutine: [
            { id: "m1", name: "TIVA Silk Amino Cleanser", purpose: "pH hydration wash" },
            { id: "m2", name: "TIVA Glacial Infusion Hydrator", purpose: "Cellular water binding" },
            { id: "m3", name: "TIVA Saffron Antioxidant Shield", purpose: "Photo-oxidative protection" },
            { id: "m4", name: "TIVA Adaptive Liquid Tint SPF 50", purpose: "Mineral photoprotective shield" }
          ],
          nightRoutine: [
            { id: "n1", name: "TIVA Botanical Oil Pre-Purifier", purpose: "Micro-lipid makeup cleanser" },
            { id: "n2", name: "TIVA Silk Amino Cleanser", purpose: "Dermal depth wash" },
            { id: "n3", name: "TIVA Barrier Cloud Cream", purpose: "Corneocyte brick structure rebuild" },
            { id: "n4", name: "TIVA Ceramide overnight Elixir", purpose: "Mitotic repair accelerant" }
          ]
        });
      }

      // Extract raw base64 data and mimeType from data URI
      let mimeType = "image/jpeg";
      let base64Data = image;
      if (image.startsWith("data:")) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }

      // Lazy initialization of Gemini Client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `
        You are the Senior Research AI Dermatologist for TIVA Cellular Skincare Laboratoires.
        Your tone is elite, purely scientific, clinical, and reassuring. Speak with luxurious authority.
        
        Analyze the uploaded skin portrait image (focusing on facial areas) to measure epidermal health, redness, pore integrity, sebum layers, and moisture tension.
        
        Locate the main face structure in the uploaded image to track where landmarks sit inside the portrait boundaries. You MUST generate approximate, accurate percentage coordinate strings ('top' and 'left' values between '0%' and '100%') for:
        - tZone: Centered forehead/glabella region (usually top: 15%-30%, left: 45%-55%)
        - leftCheek: The cheek bone/mid-cheek area on the left side of the image (usually top: 40%-55%, left: 25%-40%)
        - rightCheek: The cheek bone/mid-cheek area on the right side of the image (usually top: 40%-55%, left: 60%-75%)
        - mouth: The lower perioral/chin/mouth region (usually top: 65%-80%, left: 45%-55%)

        Ensure these percentage points are aligned exactly with the face in the user's specific uploaded image so they sit perfectly over the features, rather than being centered.
        
        Provide the response strictly conforming to the requested JSON schema. Optimize indicators based on real visual patterns (surface shine -> sebum, dullness -> dehydration, redness -> sensitivity):
        - score: An overall skin health coefficient out of 100.
        - metrics: Breakdown values (0-100) for hydration, barrier, brightness, oilBalance, texture, sensitivity, futureRisk.
        - pinpoints: Exact top/left coordinates computed for the detected face regions.
        - diagnosis: Highly personalized clinical summary under 120 words.
        - morningRoutine: A custom structured sequence of exactly 3 or 4 minimal morning TIVA products (include descriptive name and specific botanical or biochemical purpose).
        - nightRoutine: A custom structured sequence of exactly 3 or 4 nocturnal repair or micro-peel formulas.
      `;

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        }
      };

      const textPart = {
        text: "Perform face landmark localization and high-precision skin diagnostic mapping on this portrait."
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, textPart],
        config: {
          systemInstruction,
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  hydration: { type: Type.INTEGER },
                  barrier: { type: Type.INTEGER },
                  brightness: { type: Type.INTEGER },
                  oilBalance: { type: Type.INTEGER },
                  texture: { type: Type.INTEGER },
                  sensitivity: { type: Type.INTEGER },
                  futureRisk: { type: Type.INTEGER }
                },
                required: ["hydration", "barrier", "brightness", "oilBalance", "texture", "sensitivity", "futureRisk"]
              },
              pinpoints: {
                type: Type.OBJECT,
                properties: {
                  tZone: {
                    type: Type.OBJECT,
                    properties: {
                      top: { type: Type.STRING },
                      left: { type: Type.STRING }
                    },
                    required: ["top", "left"]
                  },
                  leftCheek: {
                    type: Type.OBJECT,
                    properties: {
                      top: { type: Type.STRING },
                      left: { type: Type.STRING }
                    },
                    required: ["top", "left"]
                  },
                  rightCheek: {
                    type: Type.OBJECT,
                    properties: {
                      top: { type: Type.STRING },
                      left: { type: Type.STRING }
                    },
                    required: ["top", "left"]
                  },
                  mouth: {
                    type: Type.OBJECT,
                    properties: {
                      top: { type: Type.STRING },
                      left: { type: Type.STRING }
                    },
                    required: ["top", "left"]
                  }
                },
                required: ["tZone", "leftCheek", "rightCheek", "mouth"]
              },
              diagnosis: { type: Type.STRING },
              morningRoutine: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING }
                  },
                  required: ["id", "name", "purpose"]
                }
              },
              nightRoutine: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING }
                  },
                  required: ["id", "name", "purpose"]
                }
              }
            },
            required: ["score", "metrics", "pinpoints", "diagnosis", "morningRoutine", "nightRoutine"]
          }
        },
      });

      const responseText = response.text || "{}";
      const resultObj = JSON.parse(responseText);

      return res.json({
        success: true,
        mocked: false,
        ...resultObj
      });

    } catch (err: any) {
      console.error("Gemini Scan Error:", err);
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: err.message || "An error occurred during live face scan analysis."
      });
    }
  });

  // Vite development middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully initiated on port ${PORT} [Mode: ${process.env.NODE_ENV || "development"}]`);
  });
}

startServer();
