// client/src/app/models/recipe.model.ts
export interface Recipe {
    edamamId: string;
    label: string;
    image: string;
    source: string;
    url: string;
    yield: number;
    calories: number;
    totalTime: number;
    ingredientLines: string[];
    dietLabels: string[];
    healthLabels: string[];
    cautions: string[];
    nutrients: NutrientInfo;
    cuisineType: string[];
    mealType: string[];
    dishType: string[];
    savedBy?: string[];
    createdAt?: Date;
  }
  
  export interface NutrientInfo {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  }
  
  export interface SearchResponse {
    from: number;
    to: number;
    count: number;
    _links: {
      next?: {
        href: string;
        title: string;
      };
    };
    hits: {
      recipe: Recipe;
      _links: {
        self: {
          href: string;
          title: string;
        };
      };
    }[];
  }