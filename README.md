# Jotform Frontend Challenge Project

## User Information
Please fill in your information after forking this repository:

- **Name**: Enes Güneş

## Project Description
This repository contains a frontend application built for the Jotform 2026 Frontend Challenge.

The app is a Next.js (App Router) TypeScript project that demonstrates a dashboard-style interface for investigating records and people. It focuses on a compact, component-driven UI and includes features such as:

- Interactive dashboard with record feed and statistics
- Map view for locating records and people
- Person and record detail pages with linked data
- Filtering and timeline panels for investigation workflows
- A simple local store and hooks for fetching and linking records

Key folders:

- `app/` — Next.js application entry and routes
- `app/components/` — UI components organized by feature (dashboard, map, people, records, ui)
- `hooks/` — custom hooks (e.g., `useRecords`)
- `lib/` — utility modules (API helpers, scoring/linking logic)
- `store/` — types and lightweight investigation store

Run locally from the `podo` directory:

```bash
cd podo
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Getting Started

1. **Navigate to the project directory**
   ```bash
   cd podo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the `podo` directory and add your Jotform API key:
   ```env
   API_KEY=your_jotform_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

# 🚀 Challenge Duyurusu

## 📅 Tarih ve Saat
Cumartesi günü başlama saatinden itibaren üç saattir.

## 🎯 Challenge Konsepti
Bu challenge'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Challenge başlangıcında senaryo detayları paylaşılacaktır.Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu
Challenge için kullanılacak repo: https://github.com/cemjotform/2026-frontend-challenge-ankara

## 🛠️ Hazırlık Süreci
1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar
- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler
