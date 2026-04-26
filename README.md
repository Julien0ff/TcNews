<div align="center">
  <img src="https://vafkpivadhwyrmcoonjo.supabase.co/storage/v1/object/public/assets/logo.png" alt="TCNews Logo" width="120" />
  <h1>🚆 TCNews — Transports Franciliens</h1>
  <p><i>Système d'information et de gestion du journal des transports en Île-de-France.</i></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
  </p>
</div>

---

## ✨ Fonctionnalités

### 📰 Le Journal
*   **Actualités en temps réel** : Flux d'articles sur les réseaux RATP, SNCF et Transilien.
*   **État du trafic** : Intégration des données Île-de-France Mobilités (IDFM).
*   **Design Premium** : Interface moderne, responsive et sombre (glassmorphism).

### 🔐 Panel Administration
*   **Accès Sécurisé** : Authentification via **Discord OAuth**.
*   **Restriction ID** : Accès limité aux administrateurs autorisés par leur ID Discord.
*   **Gestion complète** : Création, modification et suppression d'articles avec support multi-images.
*   **Aide IA** : Suggestion de titres et contenus via l'IA (Groq).

### 🤖 Bot Discord (TCNews Manager)
*   **Panel Interactif** : Commande `/panel` pour gérer le site depuis Discord.
*   **UI Moderne** : Utilisation des Boutons, Menus de sélection et Modales de Discord.
*   **Synchro instantanée** : Les modifications faites sur Discord apparaissent immédiatement sur le site.

---

## 🛠️ Installation

### Pré-requis
*   Node.js (v18+)
*   Un projet [Supabase](https://supabase.com)
*   Une application [Discord Developer Portal](https://discord.com/developers/applications)

### Setup Local

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/Julien0ff/TcNews.git
    cd TcNews
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Configurer le fichier `.env`** :
    Créez un fichier `.env` à la racine et remplissez-le :
    ```env
    VITE_SUPABASE_URL=votre_url
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    
    # Discord Bot
    DISCORD_BOT_TOKEN=votre_token
    DISCORD_CLIENT_ID=votre_client_id
    DISCORD_CLIENT_SECRET=votre_client_secret
    
    # Admin AI (Optionnel)
    VITE_GROQ_API_KEY=votre_cle_groq
    ```

4.  **Lancer le site** :
    ```bash
    npm run dev
    ```

5.  **Lancer le bot** :
    ```bash
    node register-commands.js # Une seule fois pour enregistrer les commandes (/)
    node bot.js
    ```

---

## 🚀 Déploiement

### Frontend (Vercel / Netlify)
Connectez votre dépôt GitHub à Vercel et ajoutez les variables d'environnement listées ci-dessus.

### Bot Discord
Le bot nécessite un environnement Node.js persistant (VPS, Railway, ou Render). 

---

<div align="center">
  <p>© 2026 TCNews — Développé avec ❤️ pour les voyageurs franciliens.</p>
</div>
