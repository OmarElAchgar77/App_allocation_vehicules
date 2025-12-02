
const themeColor = "#29476d";
export default function CarCard({ car }) {
  const styles = {
    card: {
      width: 420,
      borderRadius: 12,
      boxShadow: "0 6px 18px rgba(41,71,109,0.12)",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    top: {
      position: "relative",
      height: 260,
      background: "#f6f8fb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    img: {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "100%",
      height: "100%",
      display: "block",
      objectFit: "fill"
    },
    priceBadge: {
      position: "absolute",
      right: 12,
      top: 12,
      background: themeColor,
      color: "#fff",
      padding: "8px 12px",
      borderRadius: 8,
      fontWeight: 700,
      fontSize: 14,
      boxShadow: "0 4px 10px rgba(41,71,109,0.18)",
    },
    content: {
      padding: "12px 16px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 8,
    },
    name: {
      color: themeColor,
      fontSize: 18,
      fontWeight: 700,
      margin: 0,
    },
    make: {
      fontSize: 13,
      color: "#6b7280",
      margin: 0,
    },
    specs: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginTop: 6,
    },
    chip: {
      fontSize: 12,
      padding: "6px 8px",
      borderRadius: 999,
      background: "#f1f5f9",
      color: "#334155",
      border: `1px solid rgba(41,71,109,0.06)`,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    },
    actions: {
      display: "flex",
      gap: 8,
      marginTop: 12,
      alignItems: "center",
    },
    btnPrimary: {
      flex: 1,
      background: themeColor,
      color: "#fff",
      border: "none",
      padding: "10px 12px",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: "0 6px 14px rgba(41,71,109,0.14)",
    },
    btnGhost: {
      background: "transparent",
      color: themeColor,
      border: `1.5px solid ${themeColor}`,
      padding: "9px 12px",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 700,
      minWidth: 100,
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
      color: "#475569",
      fontSize: 13,
    },
  };

  return (
    <article style={styles.card} aria-labelledby={`car-${car.id}-title`}>
      <div style={styles.top}>
        {car.img ? (
          <img src={car.img} alt={`${car.make} ${car.name}`} style={styles.img} />
        ) : (
          <div style={{ textAlign: "center", color: "#94a3b8" }}>No image</div>
        )}

        <div style={styles.priceBadge}>
          ${car.price}
          <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 6 }}>/day</span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.titleRow}>
          <div>
            <h3 id={`car-${car.id}-title`} style={styles.name}>
              {car.name}
            </h3>
            <p style={styles.make}>{car.make}</p>
          </div>
        </div>

        <div style={styles.specs}>
          <span style={styles.chip}>🚪 {car.doors}</span>
          <span style={styles.chip}>⚙️ {car.transmission}</span>
          <span style={styles.chip}>⛽ {car.fuel}</span>
        </div>

        <div style={styles.actions}>
          <button
            style={styles.btnPrimary}
            onClick={() => console.log("Rent clicked", car.id)}
            aria-label={`Rent ${car.name}`}
          >
            Rent now
          </button>

          <button
            style={styles.btnGhost}
            onClick={() => console.log("Details clicked", car.id)}
            aria-label={`View details of ${car.name}`}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
