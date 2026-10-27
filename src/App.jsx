import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Blocks,
  Plus,
  X,
  Sparkles,
  Loader2,
  Wand2,
  ChevronDown,
  Check,
  Menu,
  Lightbulb,
  ChefHat,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import {
  AGE_BANDS,
  BAND_MAP,
  AGE_GROUPS,
  BAND_ICONS,
  COLLAGE_TILES_DESKTOP,
  COLLAGE_TILES_MOBILE,
  LEGACY_BAND_MIGRATION,
} from "./data/ageBands";
import { RECIPE_CATEGORIES, RECIPES } from "./data/recipes";
import { TYPES, TYPE_MAP, TIME_OPTIONS, TIME_MAP, EMPTY_FORM } from "./data/options";
import { SEED_ACTIVITIES } from "./data/seedActivities";
import { uid, parseMaterialsInput, matchesSearch, matchesRecipeSearch } from "./lib/helpers";
import { storage } from "./lib/storage";
import { askClaude } from "./lib/claude";
import { styles } from "./styles";
import HeroLogo from "./components/HeroLogo";
import CollageTile from "./components/CollageTile";
import RecipeCard from "./components/RecipeCard";
import ActivityCard from "./components/ActivityCard";

/* ---------------------------------------------------------------------
   Main App
--------------------------------------------------------------------- */

const STORAGE_KEY = "activities_v2";
const LEGACY_STORAGE_KEY = "activities";
const RECIPES_STORAGE_KEY = "recipes_v1";

export default function App() {
  const [viewMode, setViewMode] = useState("activities"); // 'activities' | 'recipes'

  const [activities, setActivities] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  const [selectedBands, setSelectedBands] = useState([]); // empty = all ages
  const [collapsedBands, setCollapsedBands] = useState({});
  const [collapsedAgeGroups, setCollapsedAgeGroups] = useState({});

  function toggleAgeGroupCollapse(label) {
    setCollapsedAgeGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function toggleBandCollapse(id) {
    setCollapsedBands((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  const [searchText, setSearchText] = useState("");
  const [activeTypes, setActiveTypes] = useState([]);
  const [activeTime, setActiveTime] = useState("all");

  function toggleBand(id) {
    setSelectedBands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }

  // ---- Recipes: separate state, storage, and filters (mirrors the
  // activities setup above but with its own search/time/age/cook-with-kids
  // filters and its own persisted key). ----
  const [recipes, setRecipes] = useState([]);
  const [recipesLoaded, setRecipesLoaded] = useState(false);
  const [recipeSearchText, setRecipeSearchText] = useState("");
  const [recipeAgeBands, setRecipeAgeBands] = useState([]); // empty = all ages
  const [recipeTime, setRecipeTime] = useState("all");
  const [recipeCategories, setRecipeCategories] = useState([]); // empty = all categories
  const [cookWithKidsOnly, setCookWithKidsOnly] = useState(false);
  const [collapsedRecipeCategories, setCollapsedRecipeCategories] = useState({});

  function toggleRecipeCategoryCollapse(id) {
    setCollapsedRecipeCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function toggleRecipeAgeBand(id) {
    setRecipeAgeBands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }
  function toggleRecipeCategory(id) {
    setRecipeCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  useEffect(() => {
    (async () => {
      try {
        const stored = await storage.get(RECIPES_STORAGE_KEY);
        if (stored && stored.value) {
          const parsed = JSON.parse(stored.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecipes(parsed);
            setRecipesLoaded(true);
            return;
          }
        }
        setRecipes(RECIPES);
        await storage.set(RECIPES_STORAGE_KEY, JSON.stringify(RECIPES), false);
      } catch (err) {
        setRecipes(RECIPES);
      }
      setRecipesLoaded(true);
    })();
  }, []);

  async function persistRecipes(next) {
    setRecipes(next);
    try {
      await storage.set(RECIPES_STORAGE_KEY, JSON.stringify(next), false);
    } catch (err) {
      /* best effort — recipes still update in memory even if storage fails */
    }
  }

  function toggleRecipeFavorite(id) {
    persistRecipes(recipes.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
  }

  // Subtle scroll parallax for the collage hero tiles — two depth layers
  // drift at slightly different rates while the hero is in view. Skips
  // entirely for prefers-reduced-motion.
  const farLayerRef = useRef(null);
  const nearLayerRef = useRef(null);
  const mainContentRef = useRef(null);
  const collageCardRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    function applyParallax() {
      const y = Math.min(window.scrollY, 500);
      if (farLayerRef.current) farLayerRef.current.style.transform = `translateY(${y * 0.03}px)`;
      if (nearLayerRef.current) nearLayerRef.current.style.transform = `translateY(${y * 0.07}px)`;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "Shy tiles" — each tile dodges away from the cursor as it gets close,
  // swinging out along the line from cursor to tile center, then rubber-
  // bands back to rest (via the bouncy transition on .al-collage-tile-inner)
  // once the cursor moves off. Continuous proximity, not a discrete hover
  // toggle, so it reads as evasive rather than a snap on/off.
  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const AVOID_RADIUS = 95;
    const MAX_PUSH = 26;
    let ticking = false;
    let lastEvent = null;

    function applyAvoidance() {
      const card = collageCardRef.current;
      ticking = false;
      if (!card) return;
      const tiles = card.querySelectorAll(".al-collage-tile-inner");
      const mx = lastEvent ? lastEvent.clientX : null;
      const my = lastEvent ? lastEvent.clientY : null;
      tiles.forEach((el) => {
        if (mx === null) {
          el.style.transform = "translate(0px, 0px) rotate(0deg)";
          return;
        }
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < AVOID_RADIUS) {
          const strength = (1 - dist / AVOID_RADIUS) * MAX_PUSH;
          const pushX = (dx / dist) * strength;
          const pushY = (dy / dist) * strength;
          const swing = Math.max(-14, Math.min(14, pushX * 0.4));
          el.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${swing}deg)`;
        } else {
          el.style.transform = "translate(0px, 0px) rotate(0deg)";
        }
      });
    }
    function requestApply() {
      if (!ticking) {
        window.requestAnimationFrame(applyAvoidance);
        ticking = true;
      }
    }
    function onMouseMove(e) {
      lastEvent = e;
      requestApply();
    }
    function onMouseLeave() {
      lastEvent = null;
      requestApply();
    }

    const card = collageCardRef.current;
    if (card) {
      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, []);

  function scrollToMain() {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [pasteText, setPasteText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [parseSourceUrl, setParseSourceUrl] = useState("");

  // "Generate with AI" — find a matching activity already in the library,
  // or invent a brand new one, based on materials/time/age the person types in.
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [genMaterials, setGenMaterials] = useState("");
  const [genTime, setGenTime] = useState("any");
  const [genAgeBand, setGenAgeBand] = useState("any");
  const [genNotes, setGenNotes] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState("");
  const [genResult, setGenResult] = useState(null); // { mode: 'existing'|'new', activity, reason }

  useEffect(() => {
    (async () => {
      try {
        const v2 = await storage.get(STORAGE_KEY);
        if (v2 && v2.value) {
          const parsed = JSON.parse(v2.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActivities(parsed);
            setLoaded(true);
            return;
          }
        }
      } catch (err) {
        /* v2 key not found yet — fall through to legacy check */
      }

      // No v2 data yet — check for legacy (pre-milestone-breakdown) data to migrate
      let migrated = null;
      try {
        const legacy = await storage.get(LEGACY_STORAGE_KEY);
        if (legacy && legacy.value) {
          const parsedLegacy = JSON.parse(legacy.value);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            migrated = parsedLegacy.map((a) => ({
              ...a,
              ageBand: LEGACY_BAND_MIGRATION[a.ageBand] || a.ageBand,
            }));
          }
        }
      } catch (err) {
        /* no legacy data either */
      }

      const next = migrated || SEED_ACTIVITIES;
      setActivities(next);
      try {
        await storage.set(STORAGE_KEY, JSON.stringify(next), false);
      } catch (err) {
        setStorageOk(false);
      }
      setLoaded(true);
    })();
  }, []);

  async function persist(next) {
    setActivities(next);
    try {
      const result = await storage.set(STORAGE_KEY, JSON.stringify(next), false);
      if (!result) setStorageOk(false);
    } catch (err) {
      setStorageOk(false);
    }
  }

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setPasteText("");
    setParseError("");
    setFormOpen(true);
  }

  function openEditForm(activity) {
    setForm({
      title: activity.title,
      ageBand: activity.ageBand,
      type: activity.type,
      time: activity.time,
      materials: (activity.materials || []).join(", "),
      steps: activity.steps || "",
      sourceName: activity.source?.name || "",
      sourceUrl: activity.source?.url || "",
    });
    setEditingId(activity.id);
    setPasteText("");
    setParseError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const record = {
      id: editingId || uid(),
      title: form.title.trim(),
      ageBand: form.ageBand,
      type: form.type,
      time: form.time,
      materials: parseMaterialsInput(form.materials),
      steps: form.steps.trim(),
      source: form.sourceName.trim() || form.sourceUrl.trim()
        ? { name: form.sourceName.trim() || form.sourceUrl.trim(), url: form.sourceUrl.trim() }
        : null,
      favorite: editingId ? activities.find((a) => a.id === editingId)?.favorite || false : false,
    };

    let next;
    if (editingId) {
      next = activities.map((a) => (a.id === editingId ? record : a));
    } else {
      next = [record, ...activities];
    }
    persist(next);
    closeForm();
  }

  function handleDelete(id) {
    persist(activities.filter((a) => a.id !== id));
  }

  function toggleFavorite(id) {
    persist(activities.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a)));
  }

  function toggleTypeFilter(typeId) {
    setActiveTypes((prev) => (prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]));
  }

  async function handleParse() {
    if (!pasteText.trim()) return;
    setParsing(true);
    setParseError("");
    try {
      const bandList = AGE_BANDS.map((b) => `${b.id} (${b.range})`).join(", ");
      const typeList = TYPES.map((t) => t.id).join(", ");
      const systemPrompt = `You extract structured data about a kids' activity idea from a caption or pasted text. Respond with ONLY a JSON object, no preamble, no markdown fences. Shape:
{"title": string, "ageBand": one of [${AGE_BANDS.map((b) => b.id).join(", ")}], "type": one of [${typeList}], "time": one of [quick, medium, long], "materials": [string, ...], "steps": string}
Age bands correspond to: ${bandList}. Pick the closest single ageBand and type even if the text is ambiguous, matching the activity to the most specific developmental stage it fits rather than a broad range. "time" should be your best estimate of how long the activity takes (quick <15 min, medium 15-45 min, long 45+ min). "steps" should be a short 1-3 sentence instruction in your own words, not copied verbatim from the input. If materials aren't mentioned, infer a reasonable short list from the description.`;

      const text = await askClaude({ system: systemPrompt, prompt: pasteText, maxTokens: 1000 });
      const cleaned = text.replace(/```json|```/g, "").trim();
      const extracted = JSON.parse(cleaned);

      setForm({
        title: extracted.title || "",
        ageBand: AGE_BANDS.some((b) => b.id === extracted.ageBand) ? extracted.ageBand : "toddler",
        type: TYPES.some((t) => t.id === extracted.type) ? extracted.type : "sensory",
        time: TIME_OPTIONS.some((t) => t.id === extracted.time) ? extracted.time : "quick",
        materials: Array.isArray(extracted.materials) ? extracted.materials.join(", ") : "",
        steps: extracted.steps || "",
        sourceName: "",
        sourceUrl: parseSourceUrl.trim(),
      });
    } catch (err) {
      setParseError("Couldn't parse that automatically — feel free to fill in the fields below by hand.");
    } finally {
      setParsing(false);
    }
  }

  function openGenerator() {
    setGenMaterials("");
    setGenTime("any");
    setGenAgeBand("any");
    setGenNotes("");
    setGenError("");
    setGenResult(null);
    setGeneratorOpen(true);
  }

  function closeGenerator() {
    setGeneratorOpen(false);
  }

  async function handleGenerate() {
    if (!genMaterials.trim() && !genNotes.trim()) return;
    setGenLoading(true);
    setGenError("");
    setGenResult(null);
    try {
      const bandIds = AGE_BANDS.map((b) => b.id);
      const typeIds = TYPES.map((t) => t.id);

      // Compact existing-library listing so the model can spot a real match
      // instead of always inventing something new.
      const libraryListing = activities
        .map((a) => `${a.id} | ${a.title} | age:${a.ageBand} | type:${a.type} | time:${a.time} | materials: ${(a.materials || []).join(", ") || "none"}`)
        .join("\n");

      const systemPrompt = `You help a parent find or create a kids' activity idea for their personal activity library app.

First, check the EXISTING ACTIVITIES list below for a strong match to what the parent is asking for (materials on hand, time available, child's age/stage, and any notes). "Strong match" means the materials and time genuinely fit, not just a loose theme.

If a strong match exists, respond with ONLY this JSON shape (no markdown fences, no preamble):
{"mode": "existing", "id": "<the matching activity's id>", "reason": "<one short sentence on why this fits what they asked for>"}

If nothing in the list is a good fit, invent one brand-new activity idea tailored exactly to their materials/time/age, and respond with ONLY this JSON shape:
{"mode": "new", "activity": {"title": string, "ageBand": one of [${bandIds.join(", ")}], "type": one of [${typeIds.join(", ")}], "time": one of [quick, medium, long], "materials": [string, ...], "steps": string}, "reason": "<one short sentence on what makes this a good fit>"}

"time" values: quick = under 15 min, medium = 15-45 min, long = 45+ min. "steps" should be 1-3 concise sentences a parent could follow immediately. If the parent didn't specify an age, default to whichever stage best fits their materials/notes. If they didn't specify materials, favor items commonly found around a house.

EXISTING ACTIVITIES (id | title | age | type | time | materials):
${libraryListing || "(library is currently empty)"}`;

      const userParts = [];
      if (genMaterials.trim()) userParts.push(`Materials on hand: ${genMaterials.trim()}`);
      if (genTime !== "any") userParts.push(`Time available: ${TIME_MAP[genTime] || genTime}`);
      if (genAgeBand !== "any") userParts.push(`Child's age/stage: ${BAND_MAP[genAgeBand]?.label} (${BAND_MAP[genAgeBand]?.range})`);
      if (genNotes.trim()) userParts.push(`Notes: ${genNotes.trim()}`);
      const userMessage = userParts.join("\n") || "Surprise me with something doable right now.";

      const text = await askClaude({ system: systemPrompt, prompt: userMessage, maxTokens: 1200 });
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.mode === "existing") {
        const match = activities.find((a) => a.id === parsed.id);
        if (!match) throw new Error("Matched id not found");
        setGenResult({ mode: "existing", activity: match, reason: parsed.reason || "" });
      } else if (parsed.mode === "new" && parsed.activity) {
        const a = parsed.activity;
        const newActivity = {
          id: uid(),
          title: a.title || "Untitled idea",
          ageBand: bandIds.includes(a.ageBand) ? a.ageBand : "toddler",
          type: typeIds.includes(a.type) ? a.type : "learning",
          time: TIME_OPTIONS.some((t) => t.id === a.time) ? a.time : "quick",
          materials: Array.isArray(a.materials) ? a.materials : [],
          steps: a.steps || "",
          source: null,
          favorite: false,
        };
        setGenResult({ mode: "new", activity: newActivity, reason: parsed.reason || "" });
      } else {
        throw new Error("Unrecognized response shape");
      }
    } catch (err) {
      setGenError("Couldn't come up with something just now — mind trying again?");
    } finally {
      setGenLoading(false);
    }
  }

  function handleAddGenerated() {
    if (!genResult || genResult.mode !== "new") return;
    persist([genResult.activity, ...activities]);
    closeGenerator();
  }

  function handleViewExisting() {
    if (!genResult || genResult.mode !== "existing") return;
    setSelectedBands([genResult.activity.ageBand]);
    setSearchText(genResult.activity.title);
    closeGenerator();
    scrollToMain();
  }

  const filtered = useMemo(() => {
    return activities
      .filter((a) => selectedBands.length === 0 || selectedBands.includes(a.ageBand))
      .filter((a) => matchesSearch(a, searchText))
      .filter((a) => activeTypes.length === 0 || activeTypes.includes(a.type))
      .filter((a) => activeTime === "all" || a.time === activeTime)
      .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  }, [activities, selectedBands, searchText, activeTypes, activeTime]);

  const showGrouped = selectedBands.length !== 1;

  const groupedByBand = useMemo(() => {
    if (!showGrouped) return null;
    const groups = {};
    for (const band of AGE_BANDS) groups[band.id] = [];
    for (const a of filtered) {
      if (groups[a.ageBand]) groups[a.ageBand].push(a);
    }
    return groups;
  }, [filtered, showGrouped]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => recipeAgeBands.length === 0 || recipeAgeBands.includes(r.ageBand))
      .filter((r) => matchesRecipeSearch(r, recipeSearchText))
      .filter((r) => recipeTime === "all" || r.time === recipeTime)
      .filter((r) => recipeCategories.length === 0 || recipeCategories.includes(r.category))
      .filter((r) => !cookWithKidsOnly || r.cookWithKids)
      .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  }, [recipes, recipeAgeBands, recipeSearchText, recipeTime, recipeCategories, cookWithKidsOnly]);

  const groupedRecipesByCategory = useMemo(() => {
    const groups = {};
    for (const cat of RECIPE_CATEGORIES) groups[cat.id] = [];
    for (const r of filteredRecipes) {
      if (groups[r.category]) groups[r.category].push(r);
    }
    return groups;
  }, [filteredRecipes]);

  return (
    <div style={styles.page}>

      <header style={styles.header}>
        <div style={styles.heroTopBar}>
          <div style={styles.heroBrand}>
            <HeroLogo size={26} />
            <span style={styles.heroWordmark}>Tiny Tinker House</span>
          </div>
          <nav className="al-hero-nav" style={styles.heroNav}>
            <button className="al-hero-nav-item" style={styles.heroNavItem} onClick={scrollToMain}>
              <span className="al-nav-word-wrap">
                Browse
                <svg className="al-nav-squiggle" viewBox="0 0 60 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M1,6 Q8,1 15,6 T29,6 T43,6 T57,6" stroke="#1E2A2A" strokeWidth="2" strokeLinecap="round" fill="none" pathLength="1" />
                </svg>
              </span>
            </button>
            <button className="al-hero-nav-item" style={styles.heroNavItem} onClick={scrollToMain}>
              <span className="al-nav-word-wrap">
                Favorites
                <svg className="al-nav-squiggle" viewBox="0 0 60 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M1,6 Q8,1 15,6 T29,6 T43,6 T57,6" stroke="#1E2A2A" strokeWidth="2" strokeLinecap="round" fill="none" pathLength="1" />
                </svg>
              </span>
            </button>
            {/* AI features disabled for now (needs ANTHROPIC_API_KEY + api/claude.js).
            <button className="al-hero-generate-btn" style={styles.heroGenerateBtn} onClick={openGenerator}>
              <Sparkles size={14} />
              Generate with AI
            </button>
            */}
            <button className="al-hero-cta" style={styles.heroCTA} onClick={openAddForm}>
              <span className="al-cta-icon-swap" aria-hidden="true">
                <span className="al-cta-glow" />
                <span className="al-cta-spark" style={{ "--sx": "-11px", "--sy": "-8px", "--sdelay": "0.15s" }} />
                <span className="al-cta-spark" style={{ "--sx": "10px", "--sy": "-9px", "--sdelay": "0.22s" }} />
                <span className="al-cta-spark" style={{ "--sx": "0px", "--sy": "-14px", "--sdelay": "0.18s" }} />
                <span className="al-cta-spark" style={{ "--sx": "9px", "--sy": "7px", "--sdelay": "0.28s" }} />
                <Plus className="al-cta-icon-plus" size={15} strokeWidth={3} />
                <Lightbulb className="al-cta-icon-bulb" size={15} strokeWidth={2.5} />
              </span>
              Add an idea
            </button>
          </nav>
          <button className="al-hero-menu-btn" style={styles.heroMenuBtn} onClick={scrollToMain} aria-label="Browse activities">
            <Menu size={22} color="#4A5A58" />
          </button>
        </div>

        {!storageOk && (
          <p style={styles.storageWarning}>
            Heads up — this session couldn't save to persistent storage, so new changes may not stick around after you leave.
          </p>
        )}

        <div ref={collageCardRef} className="al-collage-card" style={styles.collageCard}>
          <div style={styles.collageTextStack}>
            <h1 className="al-collage-h1" style={styles.collageH1}>Tiny Tinker House</h1>
            <p className="al-collage-tagline" style={styles.collageTagline}>
              Everything you saved, ready for time together with your little one.
            </p>
          </div>

          <div ref={farLayerRef} className="al-collage-layer al-collage-desktop">
            {COLLAGE_TILES_DESKTOP.filter((t) => t.depth === "far").map((tile, i) => (
              <CollageTile key={tile.bandId} tile={tile} index={i} />
            ))}
          </div>
          <div ref={nearLayerRef} className="al-collage-layer al-collage-desktop al-collage-inner-layer">
            {COLLAGE_TILES_DESKTOP.filter((t) => t.depth === "near").map((tile, i) => (
              <CollageTile key={tile.bandId} tile={tile} index={i + 6} />
            ))}
          </div>

          <div className="al-collage-layer al-collage-mobile">
            {COLLAGE_TILES_MOBILE.map((tile, i) => (
              <CollageTile key={tile.bandId} tile={tile} index={i} />
            ))}
          </div>
        </div>

        <button className="al-mobile-cta" style={styles.mobileCTA} onClick={openAddForm}>
          <Plus size={18} strokeWidth={3} />
          Add an idea
        </button>
        {/* AI features disabled for now (needs ANTHROPIC_API_KEY + api/claude.js).
        <button className="al-mobile-generate-btn" style={styles.mobileGenerateBtn} onClick={openGenerator}>
          <Sparkles size={17} />
          Generate with AI
        </button>
        */}
      </header>

      <div style={styles.viewTabsRow}>
        <button
          className={`view-tab-btn ${viewMode === "activities" ? "active" : ""}`}
          style={{
            ...styles.viewTabBtn,
            ...(viewMode === "activities" ? { ...styles.viewTabBtnActive, borderBottomColor: "#2F7A6D" } : {}),
          }}
          onClick={() => setViewMode("activities")}
        >
          <Blocks size={16} />
          Activities
        </button>
        <button
          className={`view-tab-btn ${viewMode === "recipes" ? "active" : ""}`}
          style={{
            ...styles.viewTabBtn,
            ...(viewMode === "recipes" ? { ...styles.viewTabBtnActive, borderBottomColor: "#F0B429" } : {}),
          }}
          onClick={() => setViewMode("recipes")}
        >
          <ChefHat size={16} />
          Recipes
        </button>
      </div>

      {viewMode === "activities" ? (
      <div className="al-layout-row" style={styles.layoutRow}>
        <aside className="al-sidebar" style={styles.sidebar}>
          <div style={styles.searchBox}>
            <Search size={16} color="#7C8CA0" />
            <input
              placeholder="Search by material, keyword, or idea…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
            {searchText && (
              <button onClick={() => setSearchText("")} style={styles.clearBtn}>
                <X size={14} />
              </button>
            )}
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span style={styles.sidebarSectionTitle}>Age &amp; stage</span>
              <div style={styles.sidebarHeaderLinks}>
                <button onClick={() => setSelectedBands([])} style={styles.dropdownHeaderLink} disabled={selectedBands.length === 0}>
                  Clear
                </button>
                <button onClick={() => setSelectedBands(AGE_BANDS.map((b) => b.id))} style={styles.dropdownHeaderLink}>
                  All
                </button>
              </div>
            </div>

            {AGE_GROUPS.map((group) => {
              const groupCollapsed = !!collapsedAgeGroups[group.label];
              return (
                <div key={group.label} style={styles.ageGroup}>
                  <button
                    className="age-group-label-btn"
                    style={styles.ageGroupLabelBtn}
                    onClick={() => toggleAgeGroupCollapse(group.label)}
                    aria-expanded={!groupCollapsed}
                  >
                    <span style={styles.ageGroupLabel}>{group.label}</span>
                    <ChevronDown
                      size={13}
                      style={{ transform: groupCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s", color: "#9CA8A6" }}
                    />
                  </button>
                  {!groupCollapsed &&
                    group.ids.map((bandId) => {
                      const band = BAND_MAP[bandId];
                      const checked = selectedBands.includes(bandId);
                      return (
                        <label key={bandId} className="dropdown-row" style={styles.dropdownRow}>
                          <span style={{ ...styles.checkbox, ...(checked ? { background: band.color, borderColor: band.color } : { borderColor: band.color }) }}>
                            {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBand(bandId)}
                            style={styles.hiddenCheckbox}
                          />
                          <span style={styles.dropdownRowLabel}>
                            {band.label}
                            <span style={styles.dropdownRowRange}> · {band.range}</span>
                          </span>
                        </label>
                      );
                    })}
                </div>
              );
            })}
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span style={styles.sidebarSectionTitle}>Type</span>
            </div>
            <div style={styles.typeChipsRow}>
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTypeFilter(t.id)}
                  style={{ ...styles.typeChip, ...(activeTypes.includes(t.id) ? styles.typeChipActive : {}) }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span style={styles.sidebarSectionTitle}>Time</span>
            </div>
            <select value={activeTime} onChange={(e) => setActiveTime(e.target.value)} style={styles.select}>
              <option value="all">Any length</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </aside>

        <main ref={mainContentRef} style={styles.main}>
          {!loaded ? (
            <p style={styles.emptyText}>Loading your library…</p>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No ideas match those filters yet.</p>
              <p style={styles.emptySub}>Try clearing a filter, or add a new idea of your own.</p>
            </div>
          ) : showGrouped ? (
            AGE_BANDS.map((band) => {
              const list = groupedByBand[band.id];
              if (!list || list.length === 0) return null;
              const isCollapsed = !!collapsedBands[band.id];
              const BandIcon = BAND_ICONS[band.id];
              return (
                <section key={band.id} style={styles.section}>
                  <button
                    onClick={() => toggleBandCollapse(band.id)}
                    style={styles.sectionHeader}
                    className="section-header-btn"
                    aria-expanded={!isCollapsed}
                  >
                    <span style={{ ...styles.sectionIconBadge, background: band.color }}>
                      {BandIcon && <BandIcon size={16} color="#fff" strokeWidth={2.4} />}
                    </span>
                    <h2 style={styles.sectionTitle}>{band.label}</h2>
                    <span style={styles.sectionRange}>{band.range} ({list.length})</span>
                    <ChevronDown
                      size={17}
                      style={{ marginLeft: "auto", transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s", color: "#7C8CA0" }}
                    />
                  </button>
                  {!isCollapsed && (
                    <div className="al-grid" style={styles.grid}>
                      {list.map((a) => (
                        <ActivityCard
                          key={a.id}
                          activity={a}
                          onEdit={() => openEditForm(a)}
                          onDelete={() => handleDelete(a.id)}
                          onToggleFavorite={() => toggleFavorite(a.id)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          ) : (
            <div className="al-grid" style={styles.grid}>
              {filtered.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  onEdit={() => openEditForm(a)}
                  onDelete={() => handleDelete(a.id)}
                  onToggleFavorite={() => toggleFavorite(a.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      ) : (
      <div className="al-layout-row" style={styles.layoutRow}>
        <aside className="al-sidebar" style={styles.sidebar}>
          <div style={styles.searchBox}>
            <Search size={16} color="#7C8CA0" />
            <input
              placeholder="Search by ingredient, keyword, or recipe…"
              value={recipeSearchText}
              onChange={(e) => setRecipeSearchText(e.target.value)}
              style={styles.searchInput}
            />
            {recipeSearchText && (
              <button onClick={() => setRecipeSearchText("")} style={styles.clearBtn}>
                <X size={14} />
              </button>
            )}
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span style={styles.sidebarSectionTitle}>Age &amp; stage</span>
              <div style={styles.sidebarHeaderLinks}>
                <button onClick={() => setRecipeAgeBands([])} style={styles.dropdownHeaderLink} disabled={recipeAgeBands.length === 0}>
                  Clear
                </button>
                <button onClick={() => setRecipeAgeBands(AGE_BANDS.map((b) => b.id))} style={styles.dropdownHeaderLink}>
                  All
                </button>
              </div>
            </div>
            {AGE_GROUPS.map((group) => (
              <div key={group.label} style={styles.ageGroup}>
                <div style={styles.ageGroupLabelBtn}>
                  <span style={styles.ageGroupLabel}>{group.label}</span>
                </div>
                {group.ids.map((bandId) => {
                  const band = BAND_MAP[bandId];
                  const checked = recipeAgeBands.includes(bandId);
                  return (
                    <label key={bandId} className="dropdown-row" style={styles.dropdownRow}>
                      <span style={{ ...styles.checkbox, ...(checked ? { background: band.color, borderColor: band.color } : { borderColor: band.color }) }}>
                        {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRecipeAgeBand(bandId)}
                        style={styles.hiddenCheckbox}
                      />
                      <span style={styles.dropdownRowLabel}>
                        {band.label}
                        <span style={styles.dropdownRowRange}> · {band.range}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span style={styles.sidebarSectionTitle}>Category</span>
            </div>
            <div style={styles.typeChipsRow}>
              {RECIPE_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleRecipeCategory(c.id)}
                  style={{ ...styles.typeChip, ...(recipeCategories.includes(c.id) ? styles.typeChipActive : {}) }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <div style={styles.sidebarSectionHeader}>
              <span style={styles.sidebarSectionTitle}>Time</span>
            </div>
            <select value={recipeTime} onChange={(e) => setRecipeTime(e.target.value)} style={styles.select}>
              <option value="all">Any length</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <label className="dropdown-row" style={styles.cookWithKidsToggle}>
            <span style={{ ...styles.checkbox, ...(cookWithKidsOnly ? { background: "#2F7A6D", borderColor: "#2F7A6D" } : { borderColor: "#2F7A6D" }) }}>
              {cookWithKidsOnly && <Check size={12} color="#fff" strokeWidth={3} />}
            </span>
            <input
              type="checkbox"
              checked={cookWithKidsOnly}
              onChange={() => setCookWithKidsOnly((v) => !v)}
              style={styles.hiddenCheckbox}
            />
            <Users size={15} color="#2F7A6D" />
            <span style={styles.dropdownRowLabel}>Can cook with kids</span>
          </label>
        </aside>

        <main style={styles.main}>
          {!recipesLoaded ? (
            <p style={styles.emptyText}>Loading your recipes…</p>
          ) : filteredRecipes.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No recipes match those filters yet.</p>
              <p style={styles.emptySub}>Try clearing a filter — there are 28 saved recipe ideas in here.</p>
            </div>
          ) : (
            RECIPE_CATEGORIES.map((cat) => {
              const list = groupedRecipesByCategory[cat.id];
              if (!list || list.length === 0) return null;
              const isCollapsed = !!collapsedRecipeCategories[cat.id];
              return (
                <section key={cat.id} style={styles.section}>
                  <button
                    onClick={() => toggleRecipeCategoryCollapse(cat.id)}
                    style={styles.sectionHeader}
                    className="section-header-btn"
                    aria-expanded={!isCollapsed}
                  >
                    <span style={{ ...styles.sectionIconBadge, background: "#2F7A6D" }}>
                      <UtensilsCrossed size={16} color="#fff" strokeWidth={2.4} />
                    </span>
                    <h2 style={styles.sectionTitle}>{cat.label}</h2>
                    <span style={styles.sectionRange}>({list.length})</span>
                    <ChevronDown
                      size={17}
                      style={{ marginLeft: "auto", transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s", color: "#7C8CA0" }}
                    />
                  </button>
                  {!isCollapsed && (
                    <div className="al-grid" style={styles.grid}>
                      {list.map((r) => (
                        <RecipeCard key={r.id} recipe={r} onToggleFavorite={() => toggleRecipeFavorite(r.id)} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </main>
      </div>
      )}

      {formOpen && (
        <div style={styles.overlay} onClick={closeForm}>
          <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>{editingId ? "Edit idea" : "Add a new idea"}</h3>
              <button onClick={closeForm} style={styles.iconBtnPlain}>
                <X size={18} />
              </button>
            </div>

            {/* AI features disabled for now (needs ANTHROPIC_API_KEY + api/claude.js).
            {!editingId && (
              <div style={styles.pasteBox}>
                <div style={styles.pasteLabel}>
                  <Wand2 size={15} />
                  Paste a caption or description to auto-fill the form
                </div>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste the reel caption, blog snippet, or your own quick notes here…"
                  style={styles.pasteTextarea}
                  rows={3}
                />
                <input
                  value={parseSourceUrl}
                  onChange={(e) => setParseSourceUrl(e.target.value)}
                  placeholder="Link to the original post (optional)"
                  style={styles.input}
                />
                <button
                  onClick={handleParse}
                  disabled={parsing || !pasteText.trim()}
                  style={{ ...styles.parseBtn, opacity: parsing || !pasteText.trim() ? 0.6 : 1 }}
                >
                  {parsing ? (
                    <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Reading it…</>
                  ) : (
                    <><Sparkles size={15} /> Extract details</>
                  )}
                </button>
                {parseError && <p style={styles.parseError}>{parseError}</p>}
                <div style={styles.divider} />
                <p style={styles.orManual}>Or just fill in the details yourself below:</p>
              </div>
            )}
            */}

            <form onSubmit={handleSave} style={styles.form}>
              <label style={styles.label}>
                Title
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. Sensory bin with leaves & hidden animals"
                />
              </label>

              <div style={styles.formRow}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Age / stage
                  <select value={form.ageBand} onChange={(e) => setForm({ ...form, ageBand: e.target.value })} style={styles.input}>
                    {AGE_BANDS.map((b) => (
                      <option key={b.id} value={b.id}>{b.label} ({b.range})</option>
                    ))}
                  </select>
                </label>
                <label style={{ ...styles.label, flex: 1 }}>
                  Type
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={styles.input}>
                    {TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ ...styles.label, flex: 1 }}>
                  Time
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={styles.input}>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label style={styles.label}>
                Materials <span style={styles.labelHint}>(comma-separated)</span>
                <input
                  value={form.materials}
                  onChange={(e) => setForm({ ...form, materials: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. dried leaves, small animal toys, plastic bin"
                />
              </label>

              <label style={styles.label}>
                Steps / notes
                <textarea
                  value={form.steps}
                  onChange={(e) => setForm({ ...form, steps: e.target.value })}
                  style={{ ...styles.input, resize: "vertical" }}
                  rows={3}
                  placeholder="How it works, what to say, any tips…"
                />
              </label>

              <div style={styles.formRow}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Source name <span style={styles.labelHint}>(optional)</span>
                  <input
                    value={form.sourceName}
                    onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                    style={styles.input}
                    placeholder="e.g. @username or blog name"
                  />
                </label>
                <label style={{ ...styles.label, flex: 1 }}>
                  Source link <span style={styles.labelHint}>(optional)</span>
                  <input
                    value={form.sourceUrl}
                    onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                    style={styles.input}
                    placeholder="https://…"
                  />
                </label>
              </div>

              <div style={styles.formActions}>
                <button type="button" onClick={closeForm} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>{editingId ? "Save changes" : "Save idea"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {generatorOpen && (
        <div style={styles.overlay} onClick={closeGenerator}>
          <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Generate an idea</h3>
              <button onClick={closeGenerator} style={styles.iconBtnPlain}>
                <X size={18} />
              </button>
            </div>

            <p style={styles.generatorIntro}>
              Tell me what you've got and how much time you have — I'll find something from your library, or make up something new that fits.
            </p>

            <div style={styles.form}>
              <label style={styles.label}>
                Materials on hand <span style={styles.labelHint}>(optional)</span>
                <input
                  value={genMaterials}
                  onChange={(e) => setGenMaterials(e.target.value)}
                  style={styles.input}
                  placeholder="e.g. paper plates, tape, a few crayons"
                />
              </label>

              <div style={styles.formRow}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Time available
                  <select value={genTime} onChange={(e) => setGenTime(e.target.value)} style={styles.input}>
                    <option value="any">Any length</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ ...styles.label, flex: 1 }}>
                  Age / stage
                  <select value={genAgeBand} onChange={(e) => setGenAgeBand(e.target.value)} style={styles.input}>
                    <option value="any">Any / not sure</option>
                    {AGE_BANDS.map((b) => (
                      <option key={b.id} value={b.id}>{b.label} ({b.range})</option>
                    ))}
                  </select>
                </label>
              </div>

              <label style={styles.label}>
                Anything else? <span style={styles.labelHint}>(optional)</span>
                <textarea
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  style={{ ...styles.input, resize: "vertical" }}
                  rows={2}
                  placeholder="e.g. needs to be quiet, or something to burn off energy before nap"
                />
              </label>

              <button
                onClick={handleGenerate}
                disabled={genLoading || (!genMaterials.trim() && !genNotes.trim())}
                style={{ ...styles.generateSubmitBtn, opacity: genLoading || (!genMaterials.trim() && !genNotes.trim()) ? 0.6 : 1 }}
              >
                {genLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Thinking…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Find or create an idea
                  </>
                )}
              </button>
              {genError && <p style={styles.parseError}>{genError}</p>}

              {genResult && (
                <div style={styles.generatorResult}>
                  <div style={styles.generatorResultBadge}>
                    {genResult.mode === "existing" ? "Already in your library" : "New idea"}
                  </div>
                  <h4 style={styles.generatorResultTitle}>{genResult.activity.title}</h4>
                  <p style={styles.generatorResultMeta}>
                    {BAND_MAP[genResult.activity.ageBand]?.label} · {TYPE_MAP[genResult.activity.type]} · {TIME_MAP[genResult.activity.time]}
                  </p>
                  {genResult.activity.materials?.length > 0 && (
                    <div style={styles.materialsRow}>
                      {genResult.activity.materials.map((m, i) => (
                        <span key={i} style={styles.materialTag}>{m}</span>
                      ))}
                    </div>
                  )}
                  <p style={styles.cardSteps}>{genResult.activity.steps}</p>
                  {genResult.reason && <p style={styles.generatorReason}>{genResult.reason}</p>}
                  <div style={styles.formActions}>
                    {genResult.mode === "existing" ? (
                      <button onClick={handleViewExisting} style={styles.saveBtn}>View in library</button>
                    ) : (
                      <button onClick={handleAddGenerated} style={styles.saveBtn}>Add to my library</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
