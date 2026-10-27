/* ---------------------------------------------------------------------
   Recipes — a second library, parallel to the activities one, for meal
   ideas. Seeded from saved Instagram recipe posts, organized by
   category, with fields for ingredient search, time, age suitability,
   and whether a toddler/kid can help cook it. Time/age/cook-with-kids
   are editorial estimates where the original caption didn't specify.
--------------------------------------------------------------------- */

export const RECIPE_CATEGORIES = [
  { id: "fastDinners", label: "Fast Family Dinners" },
  { id: "breakfastSnacks", label: "Breakfasts & Snacks" },
  { id: "mealPrep", label: "Meal Prep & Menu Ideas" },
  { id: "babyBLW", label: "Baby & BLW" },
  { id: "kidsCanCook", label: "Recipes Kids Can Cook" },
];
export const RECIPE_CATEGORY_MAP = Object.fromEntries(RECIPE_CATEGORIES.map((c) => [c.id, c.label]));

export const RECIPES = [
  {
    id: "r1", title: "Sunday Toddler Meal Prep", category: "mealPrep", ageBand: "toddler", time: "long", cookWithKids: true,
    ingredients: ["oats", "strawberries", "prawns", "tomato", "zucchini", "carrot", "minced meat"],
    summary: "Two recipes in one prep session: strawberry oat bars, plus a tomato-prawn sauce with minced meat, zucchini, carrot, and low-sodium seasonings.",
    source: { name: "@feed.the.blob", url: "https://www.instagram.com/reel/DcrvwIVBxCb/" }, favorite: false,
  },
  {
    id: "r2", title: "Dump-and-Bake Cheddar Broccoli Chicken Orzo", category: "fastDinners", ageBand: "toddler", time: "medium", cookWithKids: false,
    ingredients: ["chicken thighs", "broccoli", "cheddar", "orzo"],
    summary: "A one-dish family dinner built around chicken thighs, broccoli, cheddar, and orzo, with age-appropriate modifications for a toddler.",
    source: { name: "@soniamazri_", url: "https://www.instagram.com/reel/DcL_eW7RlTP/" }, favorite: false,
  },
  {
    id: "r3", title: "2-Minute Lentil Pasta Sauce", category: "fastDinners", ageBand: "firststeps", time: "quick", cookWithKids: false,
    ingredients: ["lentils", "pasta"],
    summary: "A quick lentil pasta sauce positioned as an iron- and protein-rich option for babies and toddlers.",
    source: { name: "@yummytoddlerfood", url: "https://www.instagram.com/reel/DcJrL2VpB9u/" }, favorite: false,
  },
  {
    id: "r4", title: "Cottage Cheese Pizza Dough", category: "fastDinners", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["cottage cheese", "flour"],
    summary: "A simple, budget-friendly pizza dough using cottage cheese for extra nutrition and protein — kneading and shaping is a great hands-on task for a toddler.",
    source: { name: "@yummytoddlerfood", url: "https://www.instagram.com/reel/DcB6LnMpOU-/" }, favorite: false,
  },
  {
    id: "r5", title: "German Pancakes", category: "breakfastSnacks", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["eggs", "flour", "milk", "vanilla", "butter", "salt"],
    summary: "Blend eggs, flour, milk, vanilla, and salt; pour over hot melted butter and bake 22–27 minutes at 425°F. Serve with powdered sugar or other toppings.",
    source: { name: "@two.and.twins.ak", url: "https://www.instagram.com/reel/Db9J4-myQ7U/" }, favorite: false,
  },
  {
    id: "r6", title: "Chicken Broccoli Pasta Bake", category: "fastDinners", ageBand: "toddler", time: "medium", cookWithKids: false,
    ingredients: ["chicken", "broccoli", "pasta", "cheese"],
    summary: "A dump-and-bake comfort meal combining protein, vegetables, carbohydrates, and cheese in one dish.",
    source: { name: "@kidfriendly.meals", url: "https://www.instagram.com/reel/Db3o45bxUHL/" }, favorite: false,
  },
  {
    id: "r7", title: "High-Iron Chickpea Cookies", category: "breakfastSnacks", ageBand: "cruising", time: "quick", cookWithKids: true,
    ingredients: ["chickpeas", "banana", "peanut butter", "baking powder"],
    summary: "Baby-friendly cookies made with chickpeas, banana, peanut butter, and baking powder, baked 15 minutes at 180°C. Honey is optional and should be left out under age one.",
    source: { name: "@eatwithluluclub", url: "https://www.instagram.com/reel/Dbaa7PBxYp1/" }, favorite: false,
  },
  {
    id: "r8", title: "Beef Brisket Noodle Soup", category: "fastDinners", ageBand: "toddler", time: "long", cookWithKids: false,
    ingredients: ["beef brisket", "radish", "ginger", "scallions", "onion", "noodles"],
    summary: "A toddler favorite made with beef brisket, radish, ginger, scallions, onion, bay leaves, peppercorns, noodles, and a seasoned broth.",
    source: { name: "@_mikoo", url: "https://www.instagram.com/reel/DbUtWBThh6Q/" }, favorite: false,
  },
  {
    id: "r9", title: "Sea Bass with Ginger-Scallion Rice", category: "fastDinners", ageBand: "toddler", time: "medium", cookWithKids: false,
    ingredients: ["sea bass", "rice", "mushrooms", "ginger", "scallion"],
    summary: "A one-pot family dinner with fragrant rice, caramelized mushrooms, and flaky sea bass.",
    source: { name: "@mr_agleooleo", url: "https://www.instagram.com/reel/Da-XrPXGp2N/" }, favorite: false,
  },
  {
    id: "r10", title: "Peach Oatmeal Bake", category: "breakfastSnacks", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["oats", "eggs", "milk", "honey", "peaches", "vanilla", "butter", "cinnamon"],
    summary: "A baked breakfast with oats, cinnamon, eggs, milk, honey, vanilla, butter, and peaches (or another fruit), baked 40 minutes at 375°F.",
    source: { name: "@two.and.twins.ak", url: "https://www.instagram.com/reel/DaoP43GyQ7C/" }, favorite: false,
  },
  {
    id: "r11", title: "Banana Chia Pudding", category: "breakfastSnacks", ageBand: "cruising", time: "quick", cookWithKids: true,
    ingredients: ["banana", "yogurt or cottage cheese", "chia seeds", "vanilla"],
    summary: "Blend bananas with cottage cheese or Greek-style yogurt, chia seeds, and vanilla; top with cereal, graham crackers, hemp hearts, or granola.",
    source: { name: "@toddlerdietitiantiff", url: "https://www.instagram.com/reel/DamIa8ft4BE/" }, favorite: false,
  },
  {
    id: "r12", title: "20-Minute Cheeseburger Pasta", category: "fastDinners", ageBand: "toddler", time: "quick", cookWithKids: false,
    ingredients: ["pasta", "ground beef", "cheese", "vegetables"],
    summary: "A quick toddler-friendly pasta with two vegetables mixed right into the sauce.",
    source: { name: "@yummytoddlerfood", url: "https://www.instagram.com/reel/DalOFyJRAMG/" }, favorite: false,
  },
  {
    id: "r13", title: "Travel Snacks for an 18-Month-Old", category: "mealPrep", ageBand: "onthemove", time: "medium", cookWithKids: true,
    ingredients: ["oats", "coconut", "black sesame", "rice", "prawns"],
    summary: "Three make-ahead travel ideas: \"chocolate\" coconut oat bars, black sesame rice-crispy treats, and prawn onigiri — the bars and onigiri are easy to assemble together.",
    source: { name: "@feed.the.blob", url: "https://www.instagram.com/reel/DaOvBTUTm3G/" }, favorite: false,
  },
  {
    id: "r14", title: "Creamy Veggie Orzo", category: "fastDinners", ageBand: "cruising", time: "quick", cookWithKids: false,
    ingredients: ["orzo", "broccoli", "onion", "carrot"],
    summary: "A fast one-pan orzo meal with broccoli, onion, and carrot that works for babies, toddlers, and adults alike.",
    source: { name: "@yummytoddlerfood", url: "https://www.instagram.com/reel/DZS0EndpOn_/" }, favorite: false,
  },
  {
    id: "r15", title: "No-Sugar-Added Toddler Snacks", category: "mealPrep", ageBand: "toddler", time: "quick", cookWithKids: true,
    ingredients: [],
    summary: "A carousel of the creator's toddler's favorite snacks made without added sugar.",
    source: { name: "@savannah__cohen", url: "https://www.instagram.com/p/DZSUq9qjlpQ/" }, favorite: false,
  },
  {
    id: "r16", title: "Blueberry Oat Bars", category: "breakfastSnacks", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["oats", "blueberries"],
    summary: "Homemade blueberry oat bars, a lower-cost alternative to packaged bars for breakfast or snack time.",
    source: { name: "@brooklynsbites", url: "https://www.instagram.com/reel/DYPnVMPuOfh/" }, favorite: false,
  },
  {
    id: "r17", title: "Frozen Yogurt Fruit Bars", category: "breakfastSnacks", ageBand: "cruising", time: "quick", cookWithKids: true,
    ingredients: ["yogurt", "soft fruit"],
    summary: "Spread yogurt in a lined dish, add mashed soft fruit, freeze until solid, then cut into pieces.",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/reel/DXrb5lFDQBZ/" }, favorite: false,
  },
  {
    id: "r18", title: "Toddler Meal and Breakfast Favorites", category: "mealPrep", ageBand: "toddler", time: "medium", cookWithKids: false,
    ingredients: [],
    summary: "A carousel collecting several of the creator's favorite toddler meals, foods, and breakfasts.",
    source: { name: "@two.and.twins.ak", url: "https://www.instagram.com/p/DXnH8R0EiEZ/" }, favorite: false,
  },
  {
    id: "r19", title: "Sheet-Pan Pancakes", category: "breakfastSnacks", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["pancake mix", "butter"],
    summary: "A batch breakfast made from pancake mix, baked on a buttered sheet pan and designed to reheat well through the week.",
    source: { name: "@two.and.twins.ak", url: "https://www.instagram.com/reel/DXU75fTkhQK/" }, favorite: false,
  },
  {
    id: "r20", title: "7-Month-Old Meal Prep: Purées and BLW", category: "babyBLW", ageBand: "sitting", time: "long", cookWithKids: false,
    ingredients: [],
    summary: "A weekly prep combining purées with baby-led weaning foods for a seven-month-old.",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/p/DXNY9cik9ju/" }, favorite: false,
  },
  {
    id: "r21", title: "Family Oxtail Soup", category: "fastDinners", ageBand: "toddler", time: "long", cookWithKids: false,
    ingredients: ["oxtail", "radish", "green onion", "onion", "garlic", "red dates", "ginger"],
    summary: "A cozy soup with oxtail, radish, green onion, onion, garlic, red dates, honey dates, and ginger.",
    source: { name: "@_mikoo", url: "https://www.instagram.com/reel/DV-HIzdkRxb/" }, favorite: false,
  },
  {
    id: "r22", title: "Baby-Led Weaning Chicken Nuggets", category: "babyBLW", ageBand: "sitting", time: "medium", cookWithKids: false,
    ingredients: ["chicken"],
    summary: "Soft, no-added-salt chicken nuggets, positioned as a high-protein finger food for ages six months and up.",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/p/DVwpsdnle-z/" }, favorite: false,
  },
  {
    id: "r23", title: "What a 12-Month-Old Ate in a Day", category: "mealPrep", ageBand: "firststeps", time: "medium", cookWithKids: false,
    ingredients: [],
    summary: "A day-of-eating post with breakfast, snacks, lunch, and dinner inspiration for a one-year-old.",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/p/DVjG2F3jh0d/" }, favorite: false,
  },
  {
    id: "r24", title: "Favorite Kid-Friendly Recipe Roundup", category: "mealPrep", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["greek yogurt", "eggs", "vegetables", "shredded cheese"],
    summary: "A roundup that opens with savory vegetable-and-cheese pancakes made from Greek yogurt, eggs, vegetables, and shredded cheese, plus more family recipe ideas.",
    source: { name: "@kimunjin", url: "https://www.instagram.com/reel/DUWlSRhgYA6/" }, favorite: false,
  },
  {
    id: "r25", title: "11-Month-Old Weekly Meal Prep", category: "mealPrep", ageBand: "cruising", time: "long", cookWithKids: false,
    ingredients: [],
    summary: "A make-ahead menu meant to introduce new flavors, foods, and textures — some items refrigerate well, others freeze.",
    source: { name: "@brooklynsbites", url: "https://www.instagram.com/reel/DTfw-lBjZiB/" }, favorite: false,
  },
  {
    id: "r26", title: "Salmon and Sweet Potato Patties", category: "babyBLW", ageBand: "cruising", time: "medium", cookWithKids: false,
    ingredients: ["salmon", "sweet potato"],
    summary: "Soft patties pairing salmon with sweet potato, sized for babies and toddlers to self-feed.",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/p/DUTQXO0jTt8/" }, favorite: false,
  },
  {
    id: "r27", title: "Easy Baby-Led Weaning Meal Prep", category: "babyBLW", ageBand: "sitting", time: "quick", cookWithKids: false,
    ingredients: [],
    summary: "A minimal-ingredient meal-prep idea for a six-month-old just beginning baby-led weaning.",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/p/DT-qHfYD79Z/" }, favorite: false,
  },
  {
    id: "r28", title: "9-Month-Old Meal Prep", category: "babyBLW", ageBand: "cruising", time: "long", cookWithKids: false,
    ingredients: ["eggs", "cottage cheese", "vegetables", "pumpkin", "oats"],
    summary: "A prep set including egg frittata with cottage cheese and vegetables, pumpkin oat bites, and other make-ahead foods that keep up to four days (or freeze).",
    source: { name: "@my.healthy_baby", url: "https://www.instagram.com/reel/DTcu4W7Ed7n/" }, favorite: false,
  },

  // ---- Recipes Kids Can Cook (toddler through teen) ----
  {
    id: "r29", title: "Smiley Face Quesadillas", category: "kidsCanCook", ageBand: "toddler", time: "quick", cookWithKids: true,
    ingredients: ["tortillas", "shredded cheese"],
    summary: "Let your toddler cut a face, shape, or design into the top tortilla with a plastic knife, then lay it over the cheese-topped tortilla to heat through — supervise closely.",
    source: { name: "Care.com", url: "https://www.care.com/c/?p=691" }, favorite: false,
  },
  {
    id: "r30", title: "One-Pan Cheesy Lemon Chicken Pasta", category: "kidsCanCook", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["chicken", "pasta", "lemon", "cheese"],
    summary: "A lighter take on mac and cheese — let your toddler help add the big handful of cheese before it all comes together in one pan.",
    source: { name: "Care.com", url: "https://www.care.com/c/?p=691" }, favorite: false,
  },
  {
    id: "r31", title: "Roasted Potatoes", category: "kidsCanCook", ageBand: "toddler", time: "medium", cookWithKids: true,
    ingredients: ["potatoes", "olive oil", "paprika", "garlic powder", "onion powder"],
    summary: "Have your toddler wash the potatoes in a bowl of water and dry them off, then help stir in oil and spices before roasting at 425°F for 15–20 minutes.",
    source: { name: "Atlanta Mom", url: "https://atlantamom.com/perspectives-in-parenting/cooking-with-my-toddler-4-easy-to-make-and-easy-to-clean-up-recipes/" }, favorite: false,
  },
  {
    id: "r32", title: "Pita Pizza Faces", category: "kidsCanCook", ageBand: "toddler", time: "quick", cookWithKids: true,
    ingredients: ["whole-wheat pita", "tomato sauce", "mozzarella", "vegetables for toppings"],
    summary: "Spread sauce and cheese on a pita base, then let your toddler make a face with toppings — olive slices for eyes, a pepper strip for a smile, shredded carrot for hair.",
    source: { name: "I'm the Chef Too", url: "https://www.imthecheftoo.com/blogs/cooking-with-kids/fun-and-healthy-easy-toddler-recipes-for-busy-families" }, favorite: false,
  },
  {
    id: "r33", title: "Chocolate Chip Banana Mini-Muffins", category: "kidsCanCook", ageBand: "preschool", time: "medium", cookWithKids: true,
    ingredients: ["bananas", "applesauce", "whole wheat flour", "mini chocolate chips"],
    summary: "Mash the bananas together and let your child help mix in the applesauce, flour, and chocolate chips, then spoon the batter into a mini muffin tin.",
    source: { name: "Atlanta Mom", url: "https://atlantamom.com/perspectives-in-parenting/cooking-with-my-toddler-4-easy-to-make-and-easy-to-clean-up-recipes/" }, favorite: false,
  },
  {
    id: "r34", title: "English Muffin \"Planet\" Pizzas", category: "kidsCanCook", ageBand: "preschool", time: "quick", cookWithKids: true,
    ingredients: ["english muffins", "tomato sauce", "shredded cheese", "toppings"],
    summary: "Split english muffins and let your child spread the sauce and \"decorate\" with cheese and veggie toppings — a fun way to talk about circles, halves, and fractions.",
    source: { name: "I'm the Chef Too", url: "https://www.imthecheftoo.com/blogs/cooking-with-kids/25-best-toddler-easy-recipes-for-fun-kitchen-learning" }, favorite: false,
  },
  {
    id: "r35", title: "Build-Your-Own Fruit & Yogurt Parfait", category: "kidsCanCook", ageBand: "bigkid", time: "quick", cookWithKids: true,
    ingredients: ["yogurt", "fruit", "granola"],
    summary: "Layer yogurt, fruit, and granola in a cup or jar — a no-cook recipe a big kid can fully build themselves.",
    source: { name: "Baketivity", url: "https://baketivity.com/blogs/news/quick-meals-kids-can-make-10-easy-no-cook-recipes" }, favorite: false,
  },
  {
    id: "r36", title: "Smoothie Bowl", category: "kidsCanCook", ageBand: "bigkid", time: "quick", cookWithKids: true,
    ingredients: ["frozen fruit", "yogurt or milk", "toppings (granola, seeds, fruit)"],
    summary: "Blend frozen fruit with yogurt or milk until thick, pour into a bowl, and let your kid arrange their own toppings.",
    source: { name: "Baketivity", url: "https://baketivity.com/blogs/news/quick-meals-kids-can-make-10-easy-no-cook-recipes" }, favorite: false,
  },
  {
    id: "r37", title: "Mac and Cheese Cups", category: "kidsCanCook", ageBand: "bigkid", time: "quick", cookWithKids: true,
    ingredients: ["pasta", "cheese", "milk"],
    summary: "A microwave-friendly single-serving mac and cheese a big kid can measure, mix, and heat mostly on their own.",
    source: { name: "Baketivity", url: "https://baketivity.com/blogs/news/quick-meals-kids-can-make-10-easy-no-cook-recipes" }, favorite: false,
  },
  {
    id: "r38", title: "Custom Trail Mix", category: "kidsCanCook", ageBand: "bigkid", time: "quick", cookWithKids: true,
    ingredients: ["nuts or seeds", "dried fruit", "cereal", "chocolate chips"],
    summary: "Set out a few bowls of mix-ins and let your kid measure and combine their own custom trail mix — good practice with portions.",
    source: { name: "Baketivity", url: "https://baketivity.com/blogs/news/quick-meals-kids-can-make-10-easy-no-cook-recipes" }, favorite: false,
  },
  {
    id: "r39", title: "Veggie Pita Pizza", category: "kidsCanCook", ageBand: "bigkid", time: "quick", cookWithKids: true,
    ingredients: ["pita bread", "sauce", "cheese", "vegetables"],
    summary: "Each kid builds their own pita pizza with sauce, cheese, and vegetable toppings before a quick bake — great for multiple kids at once.",
    source: { name: "Allrecipes", url: "https://www.allrecipes.com/gallery/easy-recipes-for-kids-to-make-by-themselves/" }, favorite: false,
  },
  {
    id: "r40", title: "Taco in a Bag", category: "kidsCanCook", ageBand: "tween", time: "quick", cookWithKids: true,
    ingredients: ["single-serve chip bag", "ground beef", "cheese", "lettuce", "salsa"],
    summary: "Split open a single-serve bag of chips and layer in seasoned ground beef, cheese, lettuce, and salsa, eaten right out of the bag.",
    source: { name: "Allrecipes", url: "https://www.allrecipes.com/gallery/easy-recipes-for-kids-to-make-by-themselves/" }, favorite: false,
  },
  {
    id: "r41", title: "Peanut Butter Banana Smoothie", category: "kidsCanCook", ageBand: "tween", time: "quick", cookWithKids: true,
    ingredients: ["banana", "peanut butter", "milk"],
    summary: "Just scooping and blending — a good first solo recipe for a tween to make for themselves.",
    source: { name: "Allrecipes", url: "https://www.allrecipes.com/gallery/easy-recipes-for-kids-to-make-by-themselves/" }, favorite: false,
  },
  {
    id: "r42", title: "Microwave Chocolate Mug Cake", category: "kidsCanCook", ageBand: "tween", time: "quick", cookWithKids: true,
    ingredients: ["flour", "cocoa powder", "sugar", "milk", "oil"],
    summary: "Mix the batter right in a mug and microwave for under two minutes for a single-serving chocolate cake.",
    source: { name: "Allrecipes", url: "https://www.allrecipes.com/gallery/easy-recipes-for-kids-to-make-by-themselves/" }, favorite: false,
  },
  {
    id: "r43", title: "Easy Guacamole", category: "kidsCanCook", ageBand: "tween", time: "quick", cookWithKids: true,
    ingredients: ["avocado", "lime", "salt", "onion", "tomato"],
    summary: "Mashing and chopping practice — let your tween mash the avocado and stir in lime, salt, and chopped onion and tomato.",
    source: { name: "Allrecipes", url: "https://www.allrecipes.com/gallery/easy-recipes-for-kids-to-make-by-themselves/" }, favorite: false,
  },
  {
    id: "r44", title: "Classic Spaghetti Bolognese", category: "kidsCanCook", ageBand: "teen", time: "medium", cookWithKids: true,
    ingredients: ["ground beef", "spaghetti", "tomato sauce", "onion", "garlic"],
    summary: "A five-ingredient bolognese that's a solid first from-scratch dinner for a teen to cook for the whole family.",
    source: { name: "The Organised Housewife", url: "https://theorganisedhousewife.com.au/?p=125288" }, favorite: false,
  },
  {
    id: "r45", title: "Tray-Baked Nachos", category: "kidsCanCook", ageBand: "teen", time: "quick", cookWithKids: true,
    ingredients: ["tortilla chips", "cheese", "salsa", "toppings of choice"],
    summary: "Layer chips, cheese, and toppings on a tray and bake until melty — an easy crowd-pleaser a teen can make solo.",
    source: { name: "The Organised Housewife", url: "https://theorganisedhousewife.com.au/?p=125288" }, favorite: false,
  },
  {
    id: "r46", title: "One-Pan Chicken Fajitas", category: "kidsCanCook", ageBand: "teen", time: "medium", cookWithKids: true,
    ingredients: ["chicken", "bell peppers", "onion", "tortillas", "fajita seasoning"],
    summary: "Everything cooks together in one pan — good practice for a teen learning to sauté and season.",
    source: { name: "Greenlight", url: "https://greenlight.com/learning-center/investing/easy-recipes-for-teens" }, favorite: false,
  },
  {
    id: "r47", title: "Avocado Toast with Fried Egg", category: "kidsCanCook", ageBand: "teen", time: "quick", cookWithKids: true,
    ingredients: ["bread", "avocado", "egg"],
    summary: "A simple first-egg recipe — toast the bread, mash the avocado on top, and practice frying an egg to finish it.",
    source: { name: "Greenlight", url: "https://greenlight.com/learning-center/investing/easy-recipes-for-teens" }, favorite: false,
  },
  {
    id: "r48", title: "Vegetable Stir-Fry with Noodles", category: "kidsCanCook", ageBand: "teen", time: "medium", cookWithKids: true,
    ingredients: ["noodles", "mixed vegetables", "soy sauce", "garlic"],
    summary: "A quick, healthy stir-fry using whatever vegetables are on hand — good practice with high-heat cooking and knife skills.",
    source: { name: "Salads4Lunch", url: "https://www.salads4lunch.com/recipes/easy-recipes-for-teens-to-cook/" }, favorite: false,
  },
];

