import { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  EmbedBuilder,
  Events
} from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const AUTHORIZED_ID = '1064801165201641592';

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot prêt ! Connecté en tant que ${c.user.tag}`);
});

// Helper to fetch articles
async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

client.on(Events.InteractionCreate, async (interaction) => {
  // Check authorization
  if (interaction.user.id !== AUTHORIZED_ID) {
    return interaction.reply({ content: "❌ Vous n'avez pas l'autorisation d'utiliser ce panel.", ephemeral: true });
  }

  // Handle Slash Commands
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'panel') {
      await showPanel(interaction);
    }
  }

  // Handle Buttons
  if (interaction.isButton()) {
    if (interaction.customId === 'create_article') {
      await showCreateModal(interaction);
    } else if (interaction.customId === 'refresh_panel') {
      await showPanel(interaction, true);
    }
  }

  // Handle Select Menu
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'manage_article') {
      const articleId = interaction.values[0];
      await showArticleOptions(interaction, articleId);
    } else if (interaction.customId.startsWith('action_')) {
      const [action, id] = interaction.customId.split('_').slice(1);
      const articleId = interaction.values[0] === 'delete' ? id : null;
      
      if (interaction.values[0] === 'delete') {
        await deleteArticle(interaction, id);
      } else if (interaction.values[0] === 'edit') {
        await showEditModal(interaction, id);
      }
    }
  }

  // Handle Modals
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'create_article_modal') {
      await handleCreateSubmit(interaction);
    } else if (interaction.customId.startsWith('edit_article_modal_')) {
      const id = interaction.customId.split('_').pop();
      await handleEditSubmit(interaction, id);
    }
  }
});

async function showPanel(interaction, isUpdate = false) {
  const articles = await getArticles();
  
  const embed = new EmbedBuilder()
    .setTitle('🚆 TCNews Admin Panel')
    .setDescription(`Bienvenue dans le centre de gestion des actualités.\nArticles publiés : **${articles.length}**`)
    .setColor('#5865F2')
    .setTimestamp();

  if (articles.length > 0) {
    const list = articles.slice(0, 5).map(a => `• **${a.title}** (${a.category})`).join('\n');
    embed.addFields({ name: 'Derniers articles', value: list + (articles.length > 5 ? '\n...' : '') });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_article')
      .setLabel('Créer un article')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📝'),
    new ButtonBuilder()
      .setCustomId('refresh_panel')
      .setLabel('Actualiser')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🔄')
  );

  const rows = [row];

  if (articles.length > 0) {
    const select = new StringSelectMenuBuilder()
      .setCustomId('manage_article')
      .setPlaceholder('Gérer un article...')
      .addOptions(
        articles.slice(0, 25).map(a => ({
          label: a.title.slice(0, 100),
          description: `Catégorie: ${a.category}`,
          value: a.id.toString(),
        }))
      );
    rows.push(new ActionRowBuilder().addComponents(select));
  }

  if (isUpdate) {
    await interaction.update({ embeds: [embed], components: rows });
  } else {
    await interaction.reply({ embeds: [embed], components: rows, ephemeral: true });
  }
}

async function showArticleOptions(interaction, articleId) {
  const { data: article } = await supabase.from('articles').select('*').eq('id', articleId).single();
  
  const embed = new EmbedBuilder()
    .setTitle(`Gestion : ${article.title}`)
    .setDescription(`Que souhaitez-vous faire avec cet article ?`)
    .addFields(
      { name: 'Catégorie', value: article.category, inline: true },
      { name: 'Date', value: article.date, inline: true }
    )
    .setColor('#FEE75C');

  const select = new StringSelectMenuBuilder()
    .setCustomId(`action_article_${articleId}`)
    .setPlaceholder('Choisir une action...')
    .addOptions([
      { label: 'Modifier', value: 'edit', emoji: '✏️' },
      { label: 'Supprimer', value: 'delete', emoji: '🗑️' },
    ]);

  const row = new ActionRowBuilder().addComponents(select);
  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function showCreateModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('create_article_modal')
    .setTitle('Créer un nouvel article');

  const titleInput = new TextInputBuilder()
    .setCustomId('title')
    .setLabel('Titre')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const catInput = new TextInputBuilder()
    .setCustomId('category')
    .setLabel('Catégorie (Réseau, Innovation, etc.)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const excerptInput = new TextInputBuilder()
    .setCustomId('excerpt')
    .setLabel('Résumé')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const contentInput = new TextInputBuilder()
    .setCustomId('content')
    .setLabel('Contenu complet')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(titleInput),
    new ActionRowBuilder().addComponents(catInput),
    new ActionRowBuilder().addComponents(excerptInput),
    new ActionRowBuilder().addComponents(contentInput)
  );

  await interaction.showModal(modal);
}

async function showEditModal(interaction, id) {
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
  
  const modal = new ModalBuilder()
    .setCustomId(`edit_article_modal_${id}`)
    .setTitle('Modifier l\'article');

  modal.addComponents(
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Titre').setStyle(TextInputStyle.Short).setValue(article.title).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('category').setLabel('Catégorie').setStyle(TextInputStyle.Short).setValue(article.category).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('excerpt').setLabel('Résumé').setStyle(TextInputStyle.Paragraph).setValue(article.excerpt).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('content').setLabel('Contenu').setStyle(TextInputStyle.Paragraph).setValue(article.content || '').setRequired(true))
  );

  await interaction.showModal(modal);
}

async function handleCreateSubmit(interaction) {
  const title = interaction.fields.getTextInputValue('title');
  const category = interaction.fields.getTextInputValue('category');
  const excerpt = interaction.fields.getTextInputValue('excerpt');
  const content = interaction.fields.getTextInputValue('content');

  try {
    const { error } = await supabase.from('articles').insert([{
      title, category, excerpt, content,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      read_time: '3 min'
    }]);

    if (error) throw error;
    await interaction.reply({ content: '✅ Article créé avec succès !', ephemeral: true });
  } catch (err) {
    await interaction.reply({ content: `❌ Erreur : ${err.message}`, ephemeral: true });
  }
}

async function handleEditSubmit(interaction, id) {
  const title = interaction.fields.getTextInputValue('title');
  const category = interaction.fields.getTextInputValue('category');
  const excerpt = interaction.fields.getTextInputValue('excerpt');
  const content = interaction.fields.getTextInputValue('content');

  try {
    const { error } = await supabase.from('articles').update({
      title, category, excerpt, content,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ' (Modifié)'
    }).eq('id', id);

    if (error) throw error;
    await interaction.reply({ content: '✅ Article mis à jour !', ephemeral: true });
  } catch (err) {
    await interaction.reply({ content: `❌ Erreur : ${err.message}`, ephemeral: true });
  }
}

async function deleteArticle(interaction, id) {
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
    await interaction.reply({ content: '🗑️ Article supprimé.', ephemeral: true });
  } catch (err) {
    await interaction.reply({ content: `❌ Erreur : ${err.message}`, ephemeral: true });
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);
