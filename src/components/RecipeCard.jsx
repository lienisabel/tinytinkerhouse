import { Star, Clock, Users, Link as LinkIcon } from "lucide-react";
import { BAND_MAP } from "../data/ageBands";
import { RECIPE_CATEGORY_MAP } from "../data/recipes";
import { TIME_MAP } from "../data/options";
import { styles } from "../styles";

export default function RecipeCard({ recipe, onToggleFavorite }) {
  const band = BAND_MAP[recipe.ageBand];
  return (
    <div style={{ ...styles.card, boxShadow: `0 -4px 0 0 ${band?.color || "#ccc"}, 0 2px 10px rgba(34,48,58,0.06)` }}>
      <div style={styles.cardTop}>
        <div style={styles.cardBandGroup}>
          <span style={{ ...styles.cardBandTag, color: band?.color || "#666", borderColor: band?.color || "#ccc" }}>
            {band?.label} +
          </span>
        </div>
        <button onClick={onToggleFavorite} style={styles.starBtn} aria-label="Toggle favorite">
          <Star size={17} fill={recipe.favorite ? "#F5B942" : "none"} color={recipe.favorite ? "#F5B942" : "#C7D2CE"} />
        </button>
      </div>

      <h3 style={styles.cardTitle}>{recipe.title}</h3>

      <div style={styles.cardMeta}>
        <span style={styles.metaItem}>{RECIPE_CATEGORY_MAP[recipe.category]}</span>
        <span style={styles.metaDot}>·</span>
        <span style={styles.metaItem}>
          <Clock size={12} style={{ marginRight: 3, position: "relative", top: 1 }} />
          {TIME_MAP[recipe.time]}
        </span>
        {recipe.cookWithKids && (
          <>
            <span style={styles.metaDot}>·</span>
            <span style={{ ...styles.metaItem, color: "#2F7A6D", fontWeight: 800 }}>
              <Users size={12} style={{ marginRight: 3, position: "relative", top: 1 }} />
              Cook together
            </span>
          </>
        )}
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={styles.materialsRow}>
          {recipe.ingredients.map((m, i) => (
            <span key={i} style={styles.materialTag}>{m}</span>
          ))}
        </div>
      )}

      {recipe.summary && <p style={styles.cardSteps}>{recipe.summary}</p>}

      <div style={styles.cardFooter}>
        {recipe.source?.url ? (
          <a href={recipe.source.url} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>
            <LinkIcon size={12} />
            {recipe.source.name || "Source"}
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
