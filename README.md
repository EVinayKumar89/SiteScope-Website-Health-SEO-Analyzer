# SiteScope — Website Health & SEO Analyzer

A production-ready web application that analyzes any website's SEO, performance, accessibility, and best practices using the **Google PageSpeed Insights API (free)** — then visualizes the results in a clean, responsive dashboard.

![SiteScope Dashboard](https://img.shields.io/badge/React-18.2-61DAFB?logo=react) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap) ![API](https://img.shields.io/badge/API-Google%20PageSpeed-4285F4?logo=google) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Live Demo

> Deploy on Vercel with one click:
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Features

- **Real-time analysis** via Google PageSpeed Insights API
- **4 score categories**: Performance, SEO, Accessibility, Best Practices
- **Core Web Vitals** with Chart.js bar + radar visualizations
- **Issues table** with category filter, search, sort, and expandable details
- **Analysis history** persisted in localStorage (simulated SQL schema)
- **Desktop / Mobile strategy** toggle
- **Dark / Light** theme with system preference detection
- **Fully responsive** — mobile, tablet, desktop
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, focus management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (Hooks, Custom Hooks, React Router v6) |
| Styling | CSS Custom Properties + Bootstrap 5 + Flexbox + Grid |
| Charts | Chart.js 4 (Bar, Radar) |
| API | Google PageSpeed Insights v5 (free, 25,000 req/day) |
| Storage | localStorage (SQL schema simulation) |
| Icons | Bootstrap Icons |
| Deployment | Vercel (recommended) |

---

## Architecture

```
src/
├── components/
│   ├── Navbar/         # Sticky nav, theme toggle, mobile menu
│   ├── URLInput/       # Validated URL input, strategy toggle, quick URLs
│   ├── ScoreCard/      # Animated SVG ring, score + label
│   ├── PerformanceChart/ # Chart.js bar + radar, vitals detail cards
│   ├── IssueTable/     # Filterable, searchable, sortable issues list
│   ├── HistoryPanel/   # localStorage-backed analysis history
│   └── Footer/         # Links, tech badges
├── pages/
│   ├── Home/           # Hero, URL input, feature grid, how-it-works
│   └── Dashboard/      # Full report: scores, charts, issues, share
├── services/
│   ├── api.js          # Google PageSpeed Insights API integration
│   └── db.js           # localStorage SQL-simulation (INSERT, SELECT, DELETE)
├── hooks/
│   └── useAnalysis.js  # Business logic: analysis flow, progress, errors
└── utils/
    └── helpers.js      # URL validation, color scoring, date formatting
```

---

## SQL Schema (simulated with localStorage)

```sql
CREATE TABLE analysis_history (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  website_url          VARCHAR(500) NOT NULL,
  performance_score    INTEGER,
  seo_score            INTEGER,
  accessibility_score  INTEGER,
  best_practices_score INTEGER,
  strategy             VARCHAR(10) DEFAULT 'desktop',
  issue_count          INTEGER DEFAULT 0,
  analysis_date        DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Getting Started

### Prerequisites
- Node.js 16+
- Free Google PageSpeed API key (optional but recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/EVinayKumar89/sitescope.git
cd sitescope

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API key (see instructions below)

# 4. Start development server
npm start
```

### Get a Free API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **"PageSpeed Insights API"**
3. APIs & Services → Credentials → **Create API Key**
4. Restrict key to PageSpeed Insights API (security best practice)
5. Add to `.env`: `REACT_APP_PAGESPEED_API_KEY=your_key_here`

> Without an API key: works but limited to ~1 request every 2 minutes per IP.

---

## Git Workflow

This project follows a professional Git workflow:

```
main          ← stable production branch
├── feature/url-validation
├── feature/score-cards
├── feature/chart-integration
├── feature/issue-table
├── feature/history-panel
└── feature/dark-mode
```

Each feature was developed in isolation and merged via pull request with a descriptive commit history.

---

## Skills Demonstrated

| Skill | Where |
|---|---|
| React.js (Hooks, Custom Hooks) | `useAnalysis.js`, all components |
| HTML5 Semantic Structure | `index.html`, all JSX |
| CSS3 + Custom Properties | `App.css`, component CSS files |
| Bootstrap 5 + Grid/Flexbox | All layout components |
| JavaScript ES6+ | Async/await, destructuring, useMemo |
| REST API Integration | `services/api.js` — PageSpeed API |
| HTTP Methods (GET) | `analyzeWebsite()` fetch call |
| SQL (simulated) | `services/db.js` localStorage schema |
| Accessibility (WCAG) | ARIA labels, focus management, roles |
| SEO Basics | `index.html` meta, OG tags, semantic HTML |
| Cross-Browser Compatibility | CSS resets, autoprefixer, tested on Chrome/Firefox/Safari |
| Responsive Design | Mobile-first, Bootstrap grid, CSS media queries |
| Performance | Lazy loading, debounce, efficient re-renders |
| Git / GitHub | Feature branches, PRs, conventional commits |

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variable in Vercel dashboard:
# REACT_APP_PAGESPEED_API_KEY = your_key
```

---

## Author

**Edulakanti Vinay Kumar**
- GitHub: [@EVinayKumar89](https://github.com/EVinayKumar89)
- LinkedIn: [edulakanti-vinay-kumar](https://www.linkedin.com/in/edulakanti-vinay-kumar-45b78a310/)

---

## License

MIT © Edulakanti Vinay Kumar
