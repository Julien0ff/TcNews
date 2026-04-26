import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing URL or Anon Key. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

/**
 * Fetch all articles from the database.
 * @returns {Promise<Array>}
 */
export const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error fetching articles:', error);
    return null;
  }
  return data;
};

/**
 * Save a new article.
 * @param {Object} article 
 */
export const saveArticle = async (article) => {
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        read_time: article.read_time || '5 min',
        images: article.images || [],
        featured: article.featured || false,
        date: article.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Update an existing article.
 * @param {string|number} id 
 * @param {Object} updates 
 */
export const updateArticle = async (id, updates) => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Delete an article.
 * @param {string|number} id 
 */
export const deleteArticle = async (id) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
