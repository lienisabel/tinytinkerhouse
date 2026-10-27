import { TYPE_MAP } from "../data/options";
import { RECIPE_CATEGORY_MAP } from "../data/recipes";

/* ---------------------------------------------------------------------
   Small helpers
--------------------------------------------------------------------- */

export const uid = () => `a${Date.now()}${Math.floor(Math.random() * 10000)}`;

export function parseMaterialsInput(text) {
  return text.split(",").map((m) => m.trim()).filter(Boolean);
}

export function matchesSearch(activity, query) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const haystack = [activity.title, ...(activity.materials || []), activity.steps, TYPE_MAP[activity.type] || ""]
    .join(" ").toLowerCase();
  return haystack.includes(q);
}

export function matchesRecipeSearch(recipe, query) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const haystack = [recipe.title, ...(recipe.ingredients || []), recipe.summary, RECIPE_CATEGORY_MAP[recipe.category] || ""]
    .join(" ").toLowerCase();
  return haystack.includes(q);
}
