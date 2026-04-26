const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Generates an article suggestion based on transport news trends.
 * @returns {Promise<{ title: string, excerpt: string, category: string, image: string }|null>}
 */
export const generateArticleSuggestion = async () => {
  if (!GROQ_API_KEY) {
    console.error('[Groq] VITE_GROQ_API_KEY is missing in .env');
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
  
  IMPORTANT: Ne pas inventer de faits absurdes. Baser l'article sur des tendances ou des projets réels connus jusqu'à ta date de connaissance, en les présentant comme d'actualité pour ce ${currentDate}.
  Langue: Français.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      title: content.title || '',
      excerpt: content.excerpt || '',
      content: content.content || '',
      category: content.category || 'Innovation',
      images: content.images || [],
      read_time: content.read_time || '3 min'
    };
  } catch (error) {
    console.error('[Groq] Error generating article:', error);
    return null;
  }
};
