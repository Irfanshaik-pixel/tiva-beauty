export interface Product {
  id: string;
  name: string;
  category: "essential" | "serum" | "cleanser" | "oil" | "Moisturizer";
  subtitle: string;
  price: number;
  salePrice?: number;
  ingredients: string[];
  volume: string;
  description: string;
  benefits: string[];
  usage: string;
  image: string;
  images?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Ingredient {
  name: string;
  scientificName: string;
  role: string;
  description: string;
  origin: string;
  synergy: string;
  skinTypeCompatibility: string;
  benefitTags: string[];
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}
