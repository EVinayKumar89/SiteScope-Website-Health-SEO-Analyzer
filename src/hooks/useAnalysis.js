/**
 * hooks/useAnalysis.js
 * Custom hook encapsulating all website analysis logic.
 * Separates business logic from UI components.
 */

import { useState, useCallback } from "react";
import { analyzeWebsite } from "../services/api";
import { insertAnalysis } from "../services/db";
import { validateURL } from "../utils/helpers";

const initialState = {
  result: null,
  loading: false,
  error: null,
  strategy: "desktop",
  progress: 0,
};

const useAnalysis = () => {
  const [state, setState] = useState(initialState);

  const setStrategy = useCallback((strategy) => {
    setState((prev) => ({ ...prev, strategy }));
  }, []);

  /**
   * Run website analysis
   * @param {string} rawURL - Raw URL string from input
   * @returns {Object|null} result or null on error
   */
  const runAnalysis = useCallback(
    async (rawURL) => {
      // Validate URL
      const { valid, error: validationError, normalizedURL } = validateURL(rawURL);
      if (!valid) {
        setState((prev) => ({ ...prev, error: validationError }));
        return null;
      }

      // Start loading with simulated progress
      setState((prev) => ({ ...prev, loading: true, error: null, result: null, progress: 0 }));

      // Simulate progress ticks while API runs (API can take 5–15s)
      const progressInterval = simulateProgress((p) =>
        setState((prev) => ({ ...prev, progress: p }))
      );

      try {
        const result = await analyzeWebsite(normalizedURL, state.strategy);

        clearInterval(progressInterval);
        setState((prev) => ({
          ...prev,
          loading: false,
          result,
          progress: 100,
          error: null,
        }));

        // Persist to localStorage (SQL-simulated)
        insertAnalysis(result);
        return result;
      } catch (err) {
        clearInterval(progressInterval);
        let message = err.message || "Analysis failed. Please try again.";

        // Friendly error messages for common cases
        if (message.includes("400") || message.includes("Invalid URL")) {
          message = "Invalid URL or the website could not be reached.";
        } else if (message.includes("403")) {
          message = "API key error. Check your REACT_APP_PAGESPEED_API_KEY in .env";
        } else if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
          message = "Network error. Check your internet connection.";
        }

        setState((prev) => ({ ...prev, loading: false, error: message, progress: 0 }));
        return null;
      }
    },
    [state.strategy]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearResult = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    runAnalysis,
    setStrategy,
    clearError,
    clearResult,
  };
};

/**
 * Simulate a realistic progress bar (0 → 85, then waits for real data)
 */
const simulateProgress = (onProgress) => {
  let progress = 0;
  const steps = [
    { target: 15, delay: 200 },
    { target: 30, delay: 600 },
    { target: 50, delay: 1200 },
    { target: 70, delay: 2000 },
    { target: 82, delay: 3500 },
  ];

  let stepIndex = 0;
  const interval = setInterval(() => {
    if (stepIndex < steps.length) {
      const { target } = steps[stepIndex];
      if (progress < target) {
        progress = Math.min(progress + 3, target);
        onProgress(progress);
      } else {
        stepIndex++;
      }
    }
  }, 200);

  return interval;
};

export default useAnalysis;
