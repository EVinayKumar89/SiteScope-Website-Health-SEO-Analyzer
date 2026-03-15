/**
 * App.js
 * Root component. Manages global theme state and routing.
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import useAnalysis from "./hooks/useAnalysis";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("sitescope_theme") || "dark");
  const analysis = useAnalysis();

  // Apply theme to <html> so CSS vars cascade everywhere
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sitescope_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main id="main-content" className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAnalyze={analysis.runAnalysis}
                  loading={analysis.loading}
                  error={analysis.error}
                  progress={analysis.progress}
                  strategy={analysis.strategy}
                  onStrategyChange={analysis.setStrategy}
                  onClearError={analysis.clearError}
                  result={analysis.result}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  result={analysis.result}
                  strategy={analysis.strategy}
                  onReAnalyze={analysis.runAnalysis}
                  onReset={analysis.clearResult}
                  loading={analysis.loading}
                  progress={analysis.progress}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
