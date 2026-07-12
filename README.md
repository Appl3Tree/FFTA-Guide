# Final Fantasy Tactics Advance Guide

A comprehensive, fan-made reference for **Final Fantasy Tactics Advance (FFTA)** — designed to help completionists, collectors, and anyone trying to keep track of *missables*, *recruitment events*, and *quest progress*.  

🕹️ **Live Site:** [appl3tree.github.io/FFTA-Guide](https://appl3tree.github.io/FFTA-Guide/)

---

## 🌟 About the Project

This project started as a personal “handbook” while replaying *Final Fantasy Tactics Advance*. The game has a lot of easy-to-miss details, obscure mechanics, and limited-time opportunities — and flipping between multiple tabs, wikis, and forum threads was getting messy.

So I built a single, organized guide that combines information from multiple sources (community guides, the FFTA wiki, and archived forum posts) into one place.  

It’s built with **React**, and it also happens to be my **first real web development project** — I learned the basics as I went, using AI assistance and lots of trial and error. The result is a simple, functional site that lets you browse, track progress, and dig into FFTA’s hidden details without spoilers unless you choose to expand sections.

---

## 🧭 Features

- ✅ Organized compilation of game information from multiple trusted sources  
- 📘 Collapsible panels to reduce spoilers (story quest details are hidden by default)  
- 🗺️ Dedicated sections for:
  - Missables
  - Blue Magic
  - Capturable Monsters
  - Quest progression
- 📊 Progress tracking with visual indicators
- 🔐 Optional Firebase sign-in with cloud progress sync
- 💬 Notes and strategy snippets for main story quests

---

## 🧱 Built With

- **React** (first-time use!)
- **Firebase Auth + Firestore** for optional signed-in sync
- **GitHub Pages** for hosting through GitHub Actions
- Basic **JavaScript**, **HTML**, and **CSS**

---

## 🔐 Firebase Progress Sync

Unsigned-in progress is stored locally in the browser. If Firebase Vite env vars are present, users can sign in with Email/Password or Google and sync checked progress to:

`users/{uid}/guides/ffta`

Create a local `.env.local` from `.env.example` for development. Do not commit `.env.local` or real Firebase values. Firebase web config is public after build; security must come from Firebase Auth, Firestore security rules, authorized domains, API key restrictions, and optionally App Check.

Publish the rules in [firestore.rules](./firestore.rules) to Firebase before enabling production sync. Also restrict the Firebase API key in Google Cloud Console by HTTP referrer for the deployed GitHub Pages site and local dev domains, verify Firebase Auth authorized domains, and consider enabling Firebase App Check for Firestore to reduce scripted abuse.

## 🚀 Deployment

This repo deploys to GitHub Pages through `.github/workflows/deploy.yml`.

Required repository secrets:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

`VITE_GUIDE_SLUG` is set to `ffta` in the workflow.

---

## 🚧 Work in Progress

This is still an evolving project. Planned improvements include:

- Better mobile layout (especially for progress bar & toggle buttons)
- Improved readability in the *Missables* section
- Integrating recruit/missable notes directly into quest entries
- Cleaning up text parsing and formatting issues in the large quest list

---

## 💡 Feedback

I’d love any feedback — whether it’s about layout, accuracy, or feature ideas.  
This is a fan project made purely for fun and learning, with no monetization or social links attached.

If you notice something missing or incorrect, feel free to **open an issue** or **submit a pull request**!

---

## ⚠️ Spoiler Notice

The guide includes:
- Character names
- Quest details
- Some light strategy notes

All spoiler-prone panels are **collapsed by default**, so you can browse safely unless you choose to expand them.

---

## 🎮 Acknowledgments

This project wouldn’t exist without:
- The **FFTA community** for preserving so much detailed info over the years  
- Various **guides, wikis, and forum threads** that inspired and informed this compilation  
- The patience and creativity of the **Final Fantasy Tactics Advance** fandom  

---

## 📖 License

This is a **fan-made project**.  
All content related to *Final Fantasy Tactics Advance* is © Square Enix.  
This guide is intended for **educational and personal use only**.
