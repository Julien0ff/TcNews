const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;

/**
 * Generates an article suggestion based on transport news trends using Google Gemini.
 * @returns {Promise<{ title: string, excerpt: string, category: string, image: string }|null>}
 */
export const generateArticleSuggestion = async () => {
  if (!GOOGLE_AI_API_KEY) {
    console.error('[Gemini] VITE_GOOGLE_AI_API_KEY is missing in .env');
    return null;
  }

  const currentDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const prompt = `Génère un article de journal professionnel et FACTUEL pour TCNews, un média spécialisé dans les mobilités et l'innovation ferroviaire.
  
  CONTEXTE: Nous sommes le ${currentDate}. 
  SUJET: Génère une actualité RÉELLE et RÉCENTE concernant les transports ou des innovations majeures internationales validées.
  
  Format de réponse STRICTEMENT JSON:
  {
    "title": "Un titre journalistique percutant",
    "excerpt": "Un résumé factuel de 2 à 3 phrases pour la carte",
    "content": "Le corps complet de l'article avec des détails techniques et contextuels, environ 3 à 4 paragraphes structurés.",
    "category": "Choisir exclusivement parmi: Innovation, Réseau, Politique, International",
    "images": []
  }
  
  IMPORTANT: Ne pas inventer de faits absurdes. Baser l'article sur des tendances ou des projets réels connus.
  Langue: Français.
  RETOURNE UNIQUEMENT LE JSON SANS CODE BLOCKS.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Remove markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const content = JSON.parse(text);

    return {
      title: content.title || '',
      excerpt: content.excerpt || '',
      content: content.content || '',
      category: content.category || 'Innovation',
      images: content.images || [],
      read_time: content.read_time || '3 min'
    };
  } catch (error) {
    console.error('[Gemini] Error generating article:', error);
    return null;
  }
};

