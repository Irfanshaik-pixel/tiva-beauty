import { Product, Ingredient, JournalArticle } from "./types";
import sunscreenImage from "./assets/images/regenerated_image_1781346789571.webp";
import lipOilImage from "./assets/images/regenerated_image_1781364684011.webp";
import moisturizerImage from "./assets/images/regenerated_image_1781365633158.webp";
import serumImage from "./assets/images/regenerated_image_1781366235570.webp";
import cleanserImage from "./assets/images/regenerated_image_1781366630237.webp";
import extraImage1 from "./assets/images/regenerated_image_1781412242018.webp";
import extraImage2 from "./assets/images/regenerated_image_1781412245258.webp";
import shadeFaceImage from "./assets/images/regenerated_image_1781412908059.webp";
import shadeArmImage from "./assets/images/regenerated_image_1781412912168.webp";
import journalImage2 from "./assets/images/regenerated_image_1781450107551.webp";
import journalImage1 from "./assets/images/regenerated_image_1781450269431.webp";
import productBackImage from "./assets/images/regenerated_image_1781450951600.webp";

export const PRODUCTS: Product[] = [
  {
    id: "tiva-sunscreen",
    name: "TIVA Tinted Sunscreen SPF 50+",
    category: "essential",
    subtitle: "Breathable Broad-Spectrum Shield",
    price: 1299,
    salePrice: 799,
    volume: "50ml",
    ingredients: ["Non-nano Zinc Oxide (18%)", "Kashmiri Saffron", "Centella Asiatica", "Hyaluronic Acid"],
    description: "An ultra-lightweight, 100% mineral sunscreen formulated to glide seamlessly onto the dermis. Delivers a delicate warm-ivory satin finish while forming an active breathable shield against UV rays and urban microscopic pollutants.",
    benefits: [
      "Provides complete mineral SPF 50+ broad-spectrum protection",
      "Leaves zero white cast, melting into a sophisticated luminous glaze",
      "Calms environmental heat redness and skin stress instantly"
    ],
    usage: "Dispense a coordinate portion onto your fingertips as the final matinal skincare act. Press gently across your face, neck, and décolletage.",
    image: "https://i.postimg.cc/9QvNz53C/Chat-GPT-Image-Jun-10-2026-01-39-22-PM.webp", 
    images: ["https://i.postimg.cc/9QvNz53C/Chat-GPT-Image-Jun-10-2026-01-39-22-PM.webp", 
      "https://i.postimg.cc/FH2n15tv/Chat-GPT-Image-Jun-10-2026-01-59-59-PM.webp", 
      "https://i.postimg.cc/WpHmsmLM/Chat-GPT-Image-Jun-12-2026-12-44-02-PM.webp",
      "https://i.postimg.cc/RZsH4fYv/5895e97c-eb5a-4c70-98cf-6bdc0c9efb42.webp",
      "https://i.postimg.cc/cJSMVsyn/Chat-GPT-Image-Jun-10-2026-02-23-08-PM.webp"]
  },
  {
    id: "tiva-serum",
    name: "TIVA Glass Lip Oil | Mirror Shine Lip Treatment",
    category: "oil",
    subtitle: "A Mirror Shine. A Treatment Within.",
    price: 959,
    salePrice: 599,
    volume: "4ml",
    ingredients: ["Peptide Complex", "Vitamin E", "Jojoba Seed Oil", "Squalane", "Sunflower Seed Oil", "Shea Butter Extract"],
    description: "Experience the perfect balance of skincare and beauty with TIVA Glass Lip Oil—a luxurious daily treatment designed to deeply nourish while delivering a crystal-clear, mirror-like shine. Powered by a blend of botanical oils, peptides, and Vitamin E, its lightweight non-sticky formula glides effortlessly across the lips, instantly enhancing their natural beauty while providing lasting comfort and hydration. From morning rituals to evening touch-ups, every application leaves lips feeling softer, smoother, and visibly healthier with an elegant glass-like finish.",
    benefits: [
      "Mirror-like glossy finish",
      "Lightweight, non-sticky texture",
      "Long-lasting hydration",
      "Peptide enriched formula",
      "Vitamin E & botanical oils",
      "Smooths and softens lips",
      "Vegan & Cruelty Free",
      "Dermatologically Tested"
    ],
    usage: "Apply directly using the precision applicator. Wear alone for a naturally glossy look or layer over lipstick for enhanced shine and hydration. Reapply as desired throughout the day.",
    image: "https://i.postimg.cc/65DQ00Fp/Chat-GPT-Image-Jun-10-2026-03-50-58-PM.webp",
    images: [
      lipOilImage,
      "https://i.postimg.cc/9Q5WTfqy/Chat-GPT-Image-Jun-10-2026-03-51-09-PM.webp", 
      "https://i.postimg.cc/qRR00hWP/Chat-GPT-Image-Jun-10-2026-03-37-22-PM.webp",
      "https://i.postimg.cc/J4JsSvNT/Chat-GPT-Image-Jun-10-2026-03-51-27-PM.webp",
      "https://i.postimg.cc/65R8FgrL/Chat-GPT-Image-Jun-10-2026-03-51-34-PM.webp"
    ]
  },
  {
    id: "tiva-cleanser",
    name: "TIVA Barrier Cloud Moisturizer",
    category: "Moisturizer",
    subtitle: "Strength Begins at the Barrier",
    price: 899,
    salePrice: 450,
    volume: "50 g | 1.76 oz",
    ingredients: ["Ceramide NP", "Squalane", "Peptide Complex", "Panthenol (Vitamin B5)", "Sodium Hyaluronate"],
    description: "Healthy, radiant skin begins with a resilient barrier. TIVA Barrier Cloud Moisturizer is a luxurious daily treatment designed to replenish essential moisture while strengthening and comforting the skin with every application. Its cloud-light texture melts effortlessly into the skin, delivering deep hydration without heaviness. Powered by a carefully curated blend of Ceramide NP, Squalane, Peptides, Panthenol, and Hyaluronic Acid, the formula helps reinforce the skin barrier, reduce moisture loss, and leave the complexion visibly smoother, calmer, and naturally luminous.",
    benefits: [
      "Strengthens and supports the skin barrier",
      "Provides up to 24-hour lightweight hydration",
      "Softens and smooths rough, dehydrated skin",
      "Helps reduce the appearance of dryness and tightness",
      "Cloud-light texture with a velvety finish",
      "Suitable for all skin types, including sensitive skin",
      "Layers seamlessly under sunscreen and makeup"
    ],
    usage: "Scoop a small amount of moisturizer. Apply evenly to cleansed face and neck. Gently massage until fully absorbed.",
    image: "https://i.postimg.cc/MpvFW0Gr/Chat-GPT-Image-Jun-11-2026-12-31-23-PM.webp",
    images: [
      moisturizerImage,
      "https://i.postimg.cc/4xmSJv3W/Chat-GPT-Image-Jun-11-2026-12-31-55-PM.webp",
      "https://i.postimg.cc/QdHyXgMY/Chat-GPT-Image-Jun-11-2026-12-32-17-PM.webp",
      "https://i.postimg.cc/W1hH2m4X/Chat-GPT-Image-Jun-11-2026-12-32-25-PM.webp",
      "https://i.postimg.cc/wj7G65Bs/Chat-GPT-Image-Jun-11-2026-12-32-31-PM.webp"
    ]
  },
  {
    id: "tiva-oil",
    name: "TIVA Radiance C Serum",
    category: "serum",
    subtitle: "Illuminate Every Day.",
    price: 699,
    salePrice: 427,
    volume: "30 ml | 1.01 fl oz",
    ingredients: ["10% Ethyl Ascorbic Acid (Vitamin C)", "5% Niacinamide", "Ferulic Acid"],
    description: "Reveal naturally radiant skin with TIVA Radiance C Serum, a premium antioxidant treatment formulated to visibly brighten dull skin, improve uneven tone, and defend against everyday environmental stressors. Built on TIVA's philosophy of Use Minimum Ingredients. Premium Formulation., this lightweight fast-absorbing serum combines stabilized Vitamin C, Niacinamide, and Ferulic Acid to deliver powerful brightening benefits while supporting a healthy skin barrier. The silky golden formula melts effortlessly into the skin, leaving behind a luminous glow without stickiness or heaviness.",
    benefits: [
      "Brightens dull and tired-looking skin",
      "Helps reduce pigmentation and post-acne marks",
      "Improves skin texture and overall radiance",
      "Lightweight, fast-absorbing golden serum",
      "Non-sticky, non-greasy finish",
      "Suitable for all skin types",
      "Dermatologically tested"
    ],
    usage: "Lightweight silky serum with a natural golden tint that glides effortlessly across the skin and leaves a healthy luminous finish.",
    image: "https://i.postimg.cc/B6V8GG75/Chat-GPT-Image-Jun-11-2026-02-58-10-PM.webp",
    images: [
      serumImage,
      "https://i.postimg.cc/B6V8GG75/Chat-GPT-Image-Jun-11-2026-02-58-10-PM.webp",
      "https://i.postimg.cc/3JMXyg9Z/Chat-GPT-Image-Jun-14-2026-11-02-10-AM.webp",
      "https://i.postimg.cc/L6B1nGJH/Chat-GPT-Image-Jun-11-2026-02-59-37-PM.webp",
      "https://i.postimg.cc/J4WX7Rz7/Chat-GPT-Image-Jun-11-2026-03-12-02-PM.webp"
    ]
  },
  {
    id: "tiva-amino-silk-cleanser",
    name: "TIVA Amino Silk Cleanser",
    category: "cleanser",
    subtitle: "Cleanse Without Compromise.",
    price: 699,
    salePrice: 499,
    volume: "150 ml | 5.07 fl oz",
    ingredients: ["Amino Acids", "Ceramides", "Panthenol (Vitamin B5)"],
    description: "A gentle, pH-balanced gel cleanser that effortlessly removes sunscreen, excess oil, makeup residue, and daily impurities while respecting the skin's natural moisture barrier. Powered by Amino Acids, Ceramides, and Panthenol, its silky low-foam formula leaves skin feeling refreshed, hydrated, and comfortably clean—never stripped or tight. Inspired by TIVA's philosophy of Use Minimum Ingredients. Premium Formulation., every ingredient is intentionally selected to deliver effective cleansing while preserving the skin's natural balance.",
    benefits: [
      "Gently removes sunscreen, makeup & impurities",
      "Maintains the skin's natural moisture barrier",
      "Hydrates while cleansing without over-drying",
      "Low-foam amino acid formula",
      "Suitable for all skin types, including sensitive skin",
      "Leaves skin soft, balanced & refreshed"
    ],
    usage: "Crystal-clear silky gel that transforms into a soft, airy micro-foam upon contact with water for a luxurious cleansing experience.",
    image: "https://i.postimg.cc/SQ1PHtSh/Chat-GPT-Image-Jun-11-2026-01-43-44-PM.webp",
    images: [
      "https://i.postimg.cc/SQ1PHtSh/Chat-GPT-Image-Jun-11-2026-01-43-44-PM.webp", 
      "https://i.postimg.cc/zfPd4yNM/Chat-GPT-Image-Jun-14-2026-11-06-15-AM.webp", 
      "https://i.postimg.cc/d3RjQ3MM/Chat-GPT-Image-Jun-11-2026-01-44-40-PM.webp", 
      "https://i.postimg.cc/nrKGVzyy/Chat-GPT-Image-Jun-11-2026-01-44-54-PM.webp",
      "https://i.postimg.cc/rs29LWPB/Chat-GPT-Image-Jun-11-2026-01-45-20-PM.webp"
    ]
  }
];

export const INGREDIENTS: Ingredient[] = [
  {
    name: "Ceramide NP",
    scientificName: "Ceramide 3",
    role: "Barrier Fortifier",
    description: "A skin-identical lipid that makes up a significant portion of the skin's healthy protective barrier. Crucial for locking in moisture, preventing transepidermal water loss, and defending against environmental irritants.",
    origin: "Bio-fermented plant sources.",
    synergy: "Works exceptionally well alongside Panthenol and Peptides to rapidly rebuild compromised skin barriers.",
    skinTypeCompatibility: "All skin types. Especially beneficial for sensitive, dry, and compromised skin.",
    benefitTags: ["Barrier Defense", "Moisture Retention", "Skin Smoothing"]
  },
  {
    name: "Peptide Complex",
    scientificName: "Palmitoyl Tripeptide-1 & Tetrapeptide-7",
    role: "Collagen Booster",
    description: "Short chains of amino acids that act as messengers in the skin, signaling cells to produce more collagen and elastin. They significantly improve skin texture, firmness, and the appearance of fine lines without causing irritation.",
    origin: "Synthesized in a laboratory for high purity and efficacy.",
    synergy: "Enhances the plumping effects of Hyaluronic Acid and the protective effects of Ceramides.",
    skinTypeCompatibility: "All skin types, including sensitive and aging skin.",
    benefitTags: ["Firming", "Texture Refinement", "Plumping"]
  },
  {
    name: "Vitamin C (Ethyl Ascorbic Acid)",
    scientificName: "3-O-Ethyl Ascorbic Acid",
    role: "Radiance Enhancer",
    description: "A highly stable, next-generation derivative of Vitamin C. It delivers profound antioxidant protection while visibly brightening uneven skin tone, fading dark spots, and stimulating natural collagen synthesis.",
    origin: "Synthesized for maximum stability and skin penetration.",
    synergy: "Pairs synergistically with Ferulic Acid and Vitamin E to boost its antioxidant network and efficacy.",
    skinTypeCompatibility: "Most skin types. Gentle enough for daily use compared to traditional L-Ascorbic Acid.",
    benefitTags: ["Brightening", "Antioxidant", "Tone Correction"]
  },
  {
    name: "Squalane",
    scientificName: "Squalane",
    role: "Weightless Hydrator",
    description: "A biomimetic, non-comedogenic oil that mimics the skin's natural sebum. It provides deep, weightless hydration, instantly softening the skin's surface without a greasy finish.",
    origin: "Derived from renewable, sustainable plant sources such as olives or sugarcane.",
    synergy: "An excellent delivery system for oil-soluble active ingredients like Vitamin E in our lip and barrier formulas.",
    skinTypeCompatibility: "Universally compatible. Ideal for all skin types, including acne-prone skin.",
    benefitTags: ["Non-Greasy Moisture", "Skin Softening", "Biomimetic"]
  },
  {
    name: "Niacinamide (Vitamin B3)",
    scientificName: "Niacinamide",
    role: "Pore Refiner & Barrier Support",
    description: "A highly versatile humectant and antioxidant that visibly minimizes enlarged pores, improves uneven skin tone, softens fine lines, and strengthens a weakened surface.",
    origin: "Synthetically derived bio-ferment.",
    synergy: "Combines perfectly with Hyaluronic Acid to replenish cellular volume and cement the moisture barrier simultaneously.",
    skinTypeCompatibility: "Exceptional for oily, combination, hyperpigmented, and delicate barrier skin.",
    benefitTags: ["Pore Refinement", "Ceramide Booster", "Dark Spot Defense"]
  },
  {
    name: "Panthenol (Vitamin B5)",
    scientificName: "D-Panthenol",
    role: "Soothing Hydrator",
    description: "A deeply soothing and restorative humectant that attracts and holds moisture. It quickly reduces redness, calms irritation, and accelerates natural skin healing processes.",
    origin: "Synthesized for high purity.",
    synergy: "Works beautifully alongside Amino Acids and Ceramides in gentle cleansing and moisturizing formulas.",
    skinTypeCompatibility: "All skin types, especially sensitive, reactive, or over-exfoliated skin.",
    benefitTags: ["Calming", "Deep Hydration", "Wound Healing"]
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "art-1",
    title: "How to Repair a Damaged Skin Barrier: The Ultimate Guide for 2026",
    category: "Skincare Science",
    readTime: "5 min read",
    excerpt: "Struggling with redness, breakouts, or tight skin? You might have a compromised skin barrier. Learn how ceramides, amino acids, and the right moisturizer can restore your skin's health.",
    content: "Your skin barrier is your first line of defense against environmental stressors. When it's compromised by over-exfoliation or harsh weather, you experience dehydration, irritation, and accelerated aging. To fix a damaged skin barrier, you must adopt a 'less is more' approach—the core of TIVA's formulation philosophy. \n\nStep 1: Ditch harsh, stripping cleansers. Opt for pH-balanced formulas like the TIVA Amino Silk Cleanser, which uses pure amino acids to cleanse without stripping essential lipids. \n\nStep 2: Rebuild with Ceramides. Ceramides are the 'glue' holding your skin cells together. The TIVA Barrier Cloud Moisturizer is engineered with Ceramide NP and Peptides to instantly comfort and fortify the skin, restoring up to 24 hours of hydration weightlessly. \n\nReady to transform your skin? Start your barrier-repair journey today with formulations that prioritize premium, necessary ingredients over fluff.",
    date: "June 12, 2026",
    image: journalImage1
  },
  {
    id: "art-2",
    title: "Why Vitamin C and SPF Are the Ultimate Anti-Aging Power Couple",
    category: "Expert Advice",
    readTime: "6 min read",
    excerpt: "Discover why combining a stabilized Vitamin C serum with a broad-spectrum SPF 50 sunscreen is the most effective dermatologist-recommended strategy for glowing, even-toned skin.",
    content: "If you want to maximize your morning skincare routine, pairing antioxidants with UV protection is non-negotiable. While sunscreen blocks damaging UV rays, no SPF blocks 100% of free radicals. That's where Vitamin C steps in. \n\nApplying the TIVA Radiance C Serum (formulated with 10% Ethyl Ascorbic Acid, Niacinamide, and Ferulic Acid) before your sunscreen acts as a secondary shield, neutralizing free radicals that slip past your SPF. It actively fades pigmentation and boosts collagen synthesis over time. \n\nFollow it up with the TIVA Tinted Sunscreen SPF 50 PA++++. Not only does it provide iron-clad broad-spectrum protection, but its tinted formula ensures zero white cast for all skin tones while delivering a natural, blurring glow. Incorporate this duo into your daily regimen to protect against premature aging and watch your skin's luminosity multiply.",
    date: "June 05, 2026",
    image: journalImage2
  },
  {
    id: "art-3",
    title: "Lip Oil vs. Lip Balm: Why Peptide Lip Treatments Are Taking Over",
    category: "Beauty Trends",
    readTime: "4 min read",
    excerpt: "Say goodbye to waxy, temporary fixes. Find out how peptide-infused lip oils provide lasting hydration and a mirror-like shine without the stickiness of traditional glosses.",
    content: "For decades, we've relied on wax-heavy lip balms that sit on the surface, requiring constant reapplication throughout the day. The modern solution? Advanced lip treatments that merge cosmetic elegance with deep tissue hydration. \n\nThe TIVA Glass Lip Oil is setting a new standard for luxury lip care. Unlike traditional balms, this hybrid formula uses Squalane and Jojoba Seed Oil to penetrate the lipid barrier, while a potent Peptide Complex stimulates collagen production for naturally softer, smoother lips. The result is a high-shine, glass-like finish that actually improves your lip health over time, without any sticky residue. \n\nStop settling for temporary relief. Upgrade your beauty arsenal with a treatment that nourishes, protects, and enhances all at once. Discover the TIVA Glass Lip Oil today.",
    date: "May 20, 2026",
    image: lipOilImage
  }
];
