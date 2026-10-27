import { Star, Clock, Pencil, Trash2, Link as LinkIcon } from "lucide-react";
import { BAND_MAP, BAND_ICONS } from "../data/ageBands";
import { TYPE_MAP, TIME_MAP } from "../data/options";
import { styles } from "../styles";

export default function ActivityCard({ activity, onEdit, onDelete, onToggleFavorite }) {
  const band = BAND_MAP[activity.ageBand];
  const BandIcon = BAND_ICONS[activity.ageBand];
  const bandColor = band?.color || "#ccc";
  return (
    <div style={{ ...styles.card, boxShadow: `0 -4px 0 0 ${bandColor}, 0 2px 10px rgba(34,48,58,0.06)` }}>
      <div style={styles.cardTop}>
        <div style={styles.cardBandGroup}>
          <span style={{ ...styles.cardIconBadge, background: band?.color || "#999" }}>
            {BandIcon && <BandIcon size={13} color="#fff" strokeWidth={2.6} />}
          </span>
          <span style={{ ...styles.cardBandTag, color: band?.color || "#666", borderColor: band?.color || "#ccc" }}>
            {band?.label}
          </span>
        </div>
        <button onClick={onToggleFavorite} style={styles.starBtn} aria-label="Toggle favorite">
          <Star size={17} fill={activity.favorite ? "#F5B942" : "none"} color={activity.favorite ? "#F5B942" : "#C7D2CE"} />
        </button>
      </div>

      <h3 style={styles.cardTitle}>{activity.title}</h3>

      <div style={styles.cardMeta}>
        <span style={styles.metaItem}>{TYPE_MAP[activity.type]}</span>
        <span style={styles.metaDot}>·</span>
        <span style={styles.metaItem}>
          <Clock size={12} style={{ marginRight: 3, position: "relative", top: 1 }} />
          {TIME_MAP[activity.time]}
        </span>
      </div>

      {activity.materials && activity.materials.length > 0 && (
        <div style={styles.materialsRow}>
          {activity.materials.map((m, i) => (
            <span key={i} style={styles.materialTag}>{m}</span>
          ))}
        </div>
      )}

      {activity.steps && <p style={styles.cardSteps}>{activity.steps}</p>}

      <div style={styles.cardFooter}>
        {activity.source?.url ? (
          <a href={activity.source.url} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>
            <LinkIcon size={12} />
            {activity.source.name || "Source"}
          </a>
        ) : (
          <span />
        )}
        <div style={styles.cardActions}>
          <button onClick={onEdit} style={styles.iconBtnPlain} aria-label="Edit"><Pencil size={14} /></button>
          <button onClick={onDelete} style={styles.iconBtnPlain} aria-label="Delete"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}
