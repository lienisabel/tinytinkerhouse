import { BAND_MAP, BAND_ICONS, BAND_TILE_TINT, BAND_TILE_ICON_OVERRIDE } from "../data/ageBands";

/* ---------------------------------------------------------------------
   Collage tile — one age-band icon chip in the hero collage. Purely
   decorative (aria-hidden). The outer div handles entrance + idle float
   (staggered CSS keyframes) and the whole layer's scroll drift; the
   inner ".al-collage-tile-inner" div is what the "shy tile" cursor-
   avoidance effect nudges (see the mousemove handler in the App
   component) so the two transforms never fight on one element.
--------------------------------------------------------------------- */


export default function CollageTile({ tile, index }) {
  const band = BAND_MAP[tile.bandId];
  const BandIcon = BAND_ICONS[tile.bandId];
  const tint = BAND_TILE_TINT[tile.bandId] || "#F1F5F4";
  const iconColor = BAND_TILE_ICON_OVERRIDE[tile.bandId] || band?.color || "#4A5A58";

  const posStyle = {};
  if (tile.pos.left !== undefined) posStyle.left = tile.pos.left;
  if (tile.pos.right !== undefined) posStyle.right = tile.pos.right;
  if (tile.pos.top !== undefined) posStyle.top = tile.pos.top;
  if (tile.pos.bottom !== undefined) posStyle.bottom = tile.pos.bottom;

  const delay = index * 55;

  return (
    <div
      className="al-collage-tile"
      aria-hidden="true"
      title={band?.label}
      style={{
        position: "absolute",
        width: tile.size,
        height: tile.size,
        pointerEvents: "auto",
        "--rot": `${tile.rotate}deg`,
        animation: `tileEnter 0.5s ease-out ${delay}ms backwards, tileFloat 4s ease-in-out ${delay + 500}ms infinite`,
        ...posStyle,
      }}
    >
      <div
        className="al-collage-tile-inner"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: Math.round(tile.size * 0.3),
          background: tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 2px rgba(30,42,42,.12)",
        }}
      >
        {BandIcon && <BandIcon size={tile.iconSize} color={iconColor} strokeWidth={2.2} />}
      </div>
    </div>
  );
}
