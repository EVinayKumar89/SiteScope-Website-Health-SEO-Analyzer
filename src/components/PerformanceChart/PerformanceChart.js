import React, { useRef, useEffect } from "react";
import { getScoreColor } from "../../utils/helpers";
import "./PerformanceChart.css";

const PerformanceChart = ({ vitals }) => {
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const barInstanceRef = useRef(null);
  const radarInstanceRef = useRef(null);

  const vitalsArray = Object.values(vitals);

  useEffect(() => {
    if (!window.Chart || !barChartRef.current || !radarChartRef.current) return;

    // Destroy previous instances
    barInstanceRef.current?.destroy();
    radarInstanceRef.current?.destroy();

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const textColor = isDark ? "#8ba0bc" : "#4a6080";
    const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    const labels = vitalsArray.map((v) => v.label);
    const scores = vitalsArray.map((v) => v.score);
    const bgColors = scores.map((s) => getScoreColor(s).hex + "cc");
    const borderColors = scores.map((s) => getScoreColor(s).hex);

    // ---- Bar Chart (Core Web Vitals scores) ----
    barInstanceRef.current = new window.Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Score",
            data: scores,
            backgroundColor: bgColors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: "easeInOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "#1a2640" : "#fff",
            titleColor: isDark ? "#f0f6ff" : "#0d1b2e",
            bodyColor: textColor,
            borderColor: isDark ? "#1e2d45" : "#dde5f0",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const vital = vitalsArray[ctx.dataIndex];
                return [`Score: ${ctx.raw}/100`, `Value: ${vital.value}`];
              },
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 11, family: fontFamily },
              stepSize: 25,
            },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { size: 10, family: fontFamily },
              maxRotation: 30,
            },
            border: { display: false },
          },
        },
      },
    });

    // ---- Radar Chart ----
    radarInstanceRef.current = new window.Chart(radarChartRef.current, {
      type: "radar",
      data: {
        labels: vitalsArray.map((v) => v.label.split(" ").slice(0, 2).join(" ")),
        datasets: [
          {
            label: "Performance",
            data: scores,
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            borderColor: "#3b82f6",
            borderWidth: 2,
            pointBackgroundColor: borderColors,
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "#1a2640" : "#fff",
            titleColor: isDark ? "#f0f6ff" : "#0d1b2e",
            bodyColor: textColor,
            borderColor: isDark ? "#1e2d45" : "#dde5f0",
            borderWidth: 1,
            cornerRadius: 8,
            padding: 10,
          },
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            ticks: {
              display: false,
              stepSize: 25,
            },
            pointLabels: {
              color: textColor,
              font: { size: 10, family: fontFamily },
            },
          },
        },
      },
    });

    return () => {
      barInstanceRef.current?.destroy();
      radarInstanceRef.current?.destroy();
    };
    // eslint-disable-next-line
  }, [vitals]);

  return (
    <div className="perf-chart-section">
      <div className="row g-4">
        {/* Bar Chart */}
        <div className="col-lg-7">
          <div className="chart-card card-glass">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="bi bi-bar-chart-fill" aria-hidden="true"></i>
                Core Web Vitals — Scores
              </h3>
              <span className="chart-badge">
                <i className="bi bi-info-circle" aria-hidden="true"></i>
                Higher is better
              </span>
            </div>
            <div className="chart-canvas-wrap" style={{ height: 240 }}>
              <canvas
                ref={barChartRef}
                role="img"
                aria-label="Bar chart showing Core Web Vitals scores"
              ></canvas>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="col-lg-5">
          <div className="chart-card card-glass">
            <div className="chart-header">
              <h3 className="chart-title">
                <i className="bi bi-pentagon" aria-hidden="true"></i>
                Performance Radar
              </h3>
            </div>
            <div className="chart-canvas-wrap" style={{ height: 240 }}>
              <canvas
                ref={radarChartRef}
                role="img"
                aria-label="Radar chart showing performance metrics overview"
              ></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Detail Cards */}
      <div className="vitals-grid">
        {vitalsArray.map((vital) => {
          const { hex, label: statusLabel } = getScoreColor(vital.score);
          return (
            <div key={vital.label} className="vital-card card-glass">
              <div className="vital-value" style={{ color: hex }}>
                {vital.value}
              </div>
              <div className="vital-label">{vital.label}</div>
              <div className="vital-status" style={{ color: hex }}>
                {statusLabel}
              </div>
              <div
                className="vital-bar"
                role="progressbar"
                aria-valuenow={vital.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${vital.label} score: ${vital.score}`}
              >
                <div
                  className="vital-bar-fill"
                  style={{ width: `${vital.score}%`, background: hex }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceChart;
