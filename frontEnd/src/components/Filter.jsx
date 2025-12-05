import React from "react";

const themeColor = "#29476d";

export default function Filter({ filters, setFilters }) {
  const inputStyle = {
    padding: "1rem 1rem",
    border: `2px solid ${themeColor}`,
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    flex: "2 2 220px",
    fontSize: "1.5rem",
  };


  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        margin: "2rem auto",
        maxWidth: "1200px",
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        placeholder="Search by name"
        value={filters.name}
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#ff8c00")}
        onBlur={(e) => (e.target.style.borderColor = themeColor)}
      />

      <input
        type="number"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        style={{ ...inputStyle, flex: "1 1 100px" }}
        onFocus={(e) => (e.target.style.borderColor = "#ff8c00")}
        onBlur={(e) => (e.target.style.borderColor = themeColor)}
      />

      <input
        type="number"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        style={{ ...inputStyle, flex: "1 1 100px" }}
        onFocus={(e) => (e.target.style.borderColor = "#ff8c00")}
        onBlur={(e) => (e.target.style.borderColor = themeColor)}
      />

      <input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        style={{ ...inputStyle, flex: "1 1 150px" }}
        onFocus={(e) => (e.target.style.borderColor = "#ff8c00")}
        onBlur={(e) => (e.target.style.borderColor = themeColor)}
      />
    </div>
  );
}
