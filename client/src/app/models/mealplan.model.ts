// client/src/app/models/mealplan.model.ts
import { Recipe } from './recipe.model';

export interface Meal {
  recipe: Recipe | string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface DayPlan {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meals: Meal[];
}

export interface MealPlan {
  _id?: string;
  user: string;
  startDate: Date;
  endDate: Date;
  days: DayPlan[];
  createdAt: Date;
  updatedAt: Date;
}