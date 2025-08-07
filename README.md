# 🪙 Crypto Dashboard

A modern, performant, and responsive React + TypeScript application that displays real-time cryptocurrency market data using the [CoinGecko API](https://www.coingecko.com/en/api/documentation).

Built with **Material UI**, it features a highly polished UI with curved corners, gradients, dark/light theming, proper memory leak prevention, and efficient React patterns.

---

## 🚀 Features

✅ Modern UI with Material UI and responsive layout  
✅ Cryptocurrency table with sorting, search, and gradients  
✅ Detail page with dynamic data, trends, and transaction actions  
✅ API integration with Axios + AbortController  
✅ Memory leak prevention in async hooks  
✅ Modular and scalable folder structure  
✅ TypeScript strict typing for safety  
✅ Ready for deployment on platforms like Vercel

---

## 📁 Project Structure

coingecko/
├── public/
├── src/
│ ├── components/
│ │ ├── CryptoTable/
│ │ ├── CryptoDetail/
│ │ ├── layout/
│ ├── hooks/
│ ├── pages/
│ ├── services/
│ ├── types/
│ ├── utils/
│ ├── tests/
│ └── App.tsx
└── README.md

---

## 🧩 Technologies Used

| Tech                    | Purpose                    |
| ----------------------- | -------------------------- |
| React + TypeScript      | UI & type safety           |
| Material UI             | Components & styled system |
| Axios + AbortController | API requests with cleanup  |
| React Router            | Routing for pages          |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/sarbraj/coingecko.git
cd coingecko
```

### 2. Install Dependencies

```
npm install
```

### 3. Start the Application (Development)

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🎯 Available Scripts

| Script                  | Purpose                           |
| ----------------------- | --------------------------------- |
| `npm start`             | Start development server          |
| `npm run build`         | Create optimized production build |
| `npm test`              | Run unit tests                    |
| `npm run test:coverage` | Run tests with coverage report    |

---

## 📦 API - CoinGecko

This app fetches real-time data using CoinGecko's free API:

- `/coins/markets` – List of cryptocurrencies
- `/coins/{id}` – Individual coin details

No API key required.

API Documentation: [https://www.coingecko.com/en/api/documentation](https://www.coingecko.com/en/api/documentation)

---

## 🧠 Optimizations

- ✅ `useRef` and `AbortController` to prevent memory leaks in hooks
- ✅ `React.memo`, `useCallback`, `useMemo` to reduce re-renders
- ✅ Lazy loading for data fetching
- ✅ Responsive layout using MUI and Flex/Grid
- ✅ Handles loading, error, and empty states gracefully

---

## 🌐 Deployment (Optional)

This app is deployment-ready and works well on:

- **Vercel**
- **GitHub Pages** (with small tweaks)

### Steps:

1. Push your repo to GitHub:

```
   git remote add origin https://github.com/sarbraj/coingecko.git
   git push -u origin main
```

2. Go to [Vercel](https://vercel.com), import your project, and deploy!

---

## 🙌 Credits

- 🤝 [CoinGecko](https://coingecko.com) for their free and open API
- ✨ Material UI for the beautiful component system
- 💻 Made with ❤️ by Sarbraj Dulai with the help of OpenAI

---

## 📝 TODO (Optional Enhancements)

- [ ] Add authentication / saved portfolios
- [ ] Add real-time socket updates
- [ ] Allow adding favorites
- [ ] Dark Mode Toggle
- [ ] Data/chart visualizations

---
