import React, { useState, useMemo } from "react";
import { getSeverityColor, truncate } from "../../utils/helpers";
import "./IssueTable.css";

const CATEGORIES = ["All", "SEO", "Accessibility", "Performance", "Best Practices"];

const IssueTable = ({ issues }) => {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("severity"); // severity | category | title
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...issues];

    if (filter !== "All") {
      list = list.filter((i) => i.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }

    const ORDER = { High: 0, Medium: 1, Low: 2 };
    if (sort === "severity") {
      list.sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
    } else if (sort === "category") {
      list.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [issues, filter, sort, search]);

  const counts = useMemo(() => {
    const c = { High: 0, Medium: 0, Low: 0 };
    issues.forEach((i) => c[i.severity]++);
    return c;
  }, [issues]);

  if (!issues.length) {
    return (
      <div className="no-issues card-glass">
        <i className="bi bi-check2-circle" aria-hidden="true"></i>
        <h3>No Issues Found</h3>
        <p>Great job! This website passes all tracked audits.</p>
      </div>
    );
  }

  return (
    <div className="issue-table-wrap">
      {/* Summary badges */}
      <div className="issue-summary" role="region" aria-label="Issue summary">
        <div className="issue-total">
          <span className="total-num">{issues.length}</span>
          <span className="total-lbl">Total Issues</span>
        </div>
        {[
          { key: "High", color: "#ef4444", bg: "#fef2f2" },
          { key: "Medium", color: "#f59e0b", bg: "#fffbeb" },
          { key: "Low", color: "#22c55e", bg: "#f0fdf4" },
        ].map(({ key, color, bg }) => (
          <div
            key={key}
            className="severity-badge"
            style={{ color, background: bg, border: `1px solid ${color}33` }}
          >
            <span className="sev-num">{counts[key]}</span>
            <span className="sev-lbl">{key}</span>
          </div>
        ))}
      </div>

      {/* Filters toolbar */}
      <div className="issue-toolbar">
        <div className="category-filters" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
            >
              {cat}
              {cat !== "All" && (
                <span className="cat-count">
                  {issues.filter((i) => i.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="issue-controls">
          <div className="issue-search">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search issues…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search issues"
            />
          </div>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort issues by"
          >
            <option value="severity">Sort: Severity</option>
            <option value="category">Sort: Category</option>
            <option value="title">Sort: A–Z</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="result-count" role="status" aria-live="polite">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {/* Table */}
      <div className="table-responsive" role="region" aria-label="Issues table" tabIndex={0}>
        <table className="issue-table" aria-rowcount={filtered.length}>
          <thead>
            <tr>
              <th scope="col">Issue</th>
              <th scope="col">Category</th>
              <th scope="col">Severity</th>
              <th scope="col" className="d-none d-md-table-cell">Fix</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-results">
                  No issues match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((issue) => {
                const sev = getSeverityColor(issue.severity);
                const isExpanded = expanded === issue.id;
                return (
                  <React.Fragment key={issue.id}>
                    <tr
                      className={`issue-row ${isExpanded ? "expanded" : ""}`}
                      onClick={() => setExpanded(isExpanded ? null : issue.id)}
                      aria-expanded={isExpanded}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setExpanded(isExpanded ? null : issue.id);
                        }
                      }}
                    >
                      <td className="issue-title-cell">
                        <i
                          className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"} expand-icon`}
                          aria-hidden="true"
                        ></i>
                        <span className="issue-title">{issue.title}</span>
                      </td>
                      <td>
                        <span className="category-tag">{issue.category}</span>
                      </td>
                      <td>
                        <span
                          className="severity-pill"
                          style={{
                            background: sev.bg,
                            color: sev.text,
                            border: `1px solid ${sev.border}`,
                          }}
                        >
                          {issue.severity}
                        </span>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <a
                          href={`https://web.dev/lighthouse-${issue.id}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fix-link"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Learn how to fix: ${issue.title}`}
                        >
                          How to fix
                          <i className="bi bi-arrow-up-right-square" aria-hidden="true"></i>
                        </a>
                      </td>
                    </tr>

                    {/* Expanded description row */}
                    {isExpanded && (
                      <tr className="description-row">
                        <td colSpan={4}>
                          <div className="issue-description">
                            <i className="bi bi-info-circle" aria-hidden="true"></i>
                            <span>
                              {issue.description
                                ? truncate(issue.description, 200)
                                : "No additional description available."}
                            </span>
                            <a
                              href={`https://web.dev/lighthouse-${issue.id}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="fix-link ms-2"
                            >
                              Learn more
                              <i className="bi bi-arrow-up-right-square" aria-hidden="true"></i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTable;
