import {
  Moon,
  Waves,
  Blocks,
  Footprints,
  PersonStanding,
  Rabbit,
  Palette,
  Pencil,
  BookOpen,
  Star,
  GraduationCap,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Reference data
--------------------------------------------------------------------- */

export const AGE_BANDS = [
  { id: "newborn", label: "Newborn", range: "0–3 mo", color: "#EF6F6C" },
  { id: "rolling", label: "Rolling & Reaching", range: "3–6 mo", color: "#F4914A" },
  { id: "sitting", label: "Sitting & Crawling", range: "6–9 mo", color: "#F0B429" },
  { id: "cruising", label: "Cruising", range: "9–12 mo", color: "#A0C445" },
  { id: "firststeps", label: "First Steps", range: "12–18 mo", color: "#4FBF8B" },
  { id: "onthemove", label: "On the Move", range: "18–24 mo", color: "#2FA9C7" },
  { id: "toddler", label: "Toddler", range: "2–3 yr", color: "#4A90D9" },
  { id: "preschool", label: "Preschooler", range: "3–5 yr", color: "#7B7FE0" },
  { id: "bigkid", label: "Big Kid", range: "5–8 yr", color: "#9B72CB" },
  { id: "tween", label: "Tween", range: "9–12 yr", color: "#C874C7" },
  { id: "teen", label: "Teen", range: "13–18 yr", color: "#5B6470" },
];

export const BAND_MAP = Object.fromEntries(AGE_BANDS.map((b) => [b.id, b]));

// Groups the 11 stages into four life-stage clusters for the sidebar list,
// so "which age bands are near each other" is scannable at a glance
// instead of one flat list of eleven.
export const AGE_GROUPS = [
  { label: "Baby", ids: ["newborn", "rolling", "sitting", "cruising"] },
  { label: "Toddler", ids: ["firststeps", "onthemove", "toddler"] },
  { label: "Kid", ids: ["preschool", "bigkid", "tween"] },
  { label: "Teen", ids: ["teen"] },
];

export const BAND_ICONS = {
  newborn: Moon,
  rolling: Waves,
  sitting: Blocks,
  cruising: Footprints,
  firststeps: PersonStanding,
  onthemove: Rabbit,
  toddler: Palette,
  preschool: Pencil,
  bigkid: BookOpen,
  tween: Star,
  teen: GraduationCap,
};

/* ---------------------------------------------------------------------
   Hero collage design tokens — per the "icon collage" hero concept.
   Tile tint background per band, plus a contrast-safe icon color
   override for the two bands whose base hue reads too light/washed
   out as a large icon on its own tint.
--------------------------------------------------------------------- */

export const BAND_TILE_TINT = {
  newborn: "#FDECEB",
  rolling: "#FDF0E4",
  sitting: "#FDF4E1",
  cruising: "#F3F8E6",
  firststeps: "#E8F8F0",
  onthemove: "#E6F5FA",
  toddler: "#E9F1FC",
  preschool: "#EDEDFB",
  bigkid: "#F2EBF9",
  tween: "#FAECFA",
  teen: "#EDEFF1",
};

export const BAND_TILE_ICON_OVERRIDE = {
  cruising: "#8AAE33",
  firststeps: "#35A874",
};

// Desktop collage layout (11 tiles). "depth" controls which parallax
// layer a tile belongs to; "tier" controls responsive drop-off order
// (outer tiles stay until the smallest breakpoint, inner tiles drop
// first around ~1100px).
export const COLLAGE_TILES_DESKTOP = [
  { bandId: "newborn", pos: { left: 52, top: 44 }, size: 56, iconSize: 26, rotate: -8, tier: "outer", depth: "far" },
  { bandId: "rolling", pos: { left: 146, top: 150 }, size: 48, iconSize: 22, rotate: 10, tier: "outer", depth: "far" },
  { bandId: "sitting", pos: { left: 56, top: 232 }, size: 60, iconSize: 28, rotate: -12, tier: "outer", depth: "far" },
  { bandId: "cruising", pos: { left: 216, top: 60 }, size: 50, iconSize: 23, rotate: 6, tier: "inner", depth: "near" },
  { bandId: "firststeps", pos: { left: 238, top: 262 }, size: 46, iconSize: 21, rotate: -14, tier: "inner", depth: "near" },
  { bandId: "teen", pos: { left: 152, top: -6 }, size: 64, iconSize: 30, rotate: 9, tier: "inner", depth: "near" },
  { bandId: "onthemove", pos: { right: 52, top: 48 }, size: 58, iconSize: 27, rotate: -9, tier: "outer", depth: "far" },
  { bandId: "toddler", pos: { right: 160, top: 132 }, size: 52, iconSize: 24, rotate: 13, tier: "inner", depth: "near" },
  { bandId: "preschool", pos: { right: 64, top: 226 }, size: 46, iconSize: 21, rotate: -7, tier: "outer", depth: "far" },
  { bandId: "bigkid", pos: { right: 224, top: 44 }, size: 62, iconSize: 29, rotate: 8, tier: "outer", depth: "far" },
  { bandId: "tween", pos: { right: 246, top: 266 }, size: 50, iconSize: 23, rotate: -11, tier: "outer", depth: "far" },
];

// Mobile collage layout — just four tiles, one near each corner.
export const COLLAGE_TILES_MOBILE = [
  { bandId: "newborn", pos: { left: -10, top: 8 }, size: 42, iconSize: 19, rotate: -9 },
  { bandId: "onthemove", pos: { right: -8, top: -6 }, size: 44, iconSize: 20, rotate: 8 },
  { bandId: "preschool", pos: { right: 10, bottom: -4 }, size: 40, iconSize: 18, rotate: -11 },
  { bandId: "sitting", pos: { left: 8, bottom: -8 }, size: 42, iconSize: 19, rotate: 10 },
];

// Old (pre-milestone-breakdown) schema used just 3 buckets for babies/toddlers.
// Anything still tagged with those ids gets remapped once, on first load.
export const LEGACY_BAND_MIGRATION = {
  newborn: "newborn",
  infant: "sitting",
  toddler: "onthemove",
  preschool: "preschool",
  bigkid: "bigkid",
  tween: "tween",
  teen: "teen",
};

