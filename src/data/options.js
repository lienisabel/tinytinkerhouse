export const TYPES = [
  { id: "sensory", label: "Sensory" },
  { id: "art", label: "Art & craft" },
  { id: "movement", label: "Movement" },
  { id: "outdoor", label: "Outdoor" },
  { id: "learning", label: "Learning" },
  { id: "pretend", label: "Pretend play" },
  { id: "game", label: "Game" },
  { id: "cooking", label: "Cooking" },
];

export const TYPE_MAP = Object.fromEntries(TYPES.map((t) => [t.id, t.label]));

export const TIME_OPTIONS = [
  { id: "quick", label: "Quick (<15 min)" },
  { id: "medium", label: "Medium (15–45 min)" },
  { id: "long", label: "Long (45+ min)" },
];

export const TIME_MAP = Object.fromEntries(TIME_OPTIONS.map((t) => [t.id, t.label]));

export const EMPTY_FORM = {
  title: "",
  ageBand: "toddler",
  type: "sensory",
  time: "quick",
  materials: "",
  steps: "",
  sourceName: "",
  sourceUrl: "",
};

