// client/src/app/components/meal-plan/mealplan.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MealPlanService } from '../../services/mealplan.service';
import { RecipeService } from '../../services/recipe.service';
import { MealPlan, DayPlan, Meal } from '../../models/mealplan.model';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-mealplan',
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css']
})
export class MealPlanComponent implements OnInit {
  currentMealPlan: MealPlan | null = null;
  savedRecipes: Recipe[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  mealTypes = ['breakfast', 'lunch', 'dinner'];
  
  mealPlanForm: FormGroup;

  constructor(
    private mealPlanService: MealPlanService,
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) {
    this.mealPlanForm = this.fb.group({
      startDate: [new Date(), Validators.required],
      endDate: [this.getNextWeekDate(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentMealPlan();
    this.loadSavedRecipes();
  }

  loadCurrentMealPlan(): void {
    this.isLoading = true;
    this.mealPlanService.getCurrentMealPlan().subscribe({
      next: (mealPlan) => {
        this.currentMealPlan = mealPlan;
        this.isLoading = false;
      },
      error: (error) => {
        // If error is 404, it means no active meal plan
        if (error.status === 404) {
          this.currentMealPlan = null;
        } else {
          this.errorMessage = error.error.msg || 'Failed to load meal plan';
        }
        this.isLoading = false;
      }
    });
  }

  loadSavedRecipes(): void {
    this.recipeService.getSavedRecipes().subscribe({
      next: (recipes) => {
        this.savedRecipes = recipes;
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to load saved recipes';
      }
    });
  }

  createMealPlan(): void {
    if (this.mealPlanForm.invalid) {
      return;
    }

    const { startDate, endDate } = this.mealPlanForm.value;
    
    // Create empty days for the meal plan
    const days: DayPlan[] = this.daysOfWeek.map(day => ({
      dayOfWeek: day,
      meals: []
    }));
    
    const mealPlanData = {
      startDate,
      endDate,
      days
    };
    
    this.mealPlanService.createMealPlan(mealPlanData).subscribe({
      next: (mealPlan) => {
        this.currentMealPlan = mealPlan;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to create meal plan';
      }
    });
  }

  getNextWeekDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  }

  addMealToPlan(day: string, mealType: string, recipeId: string): void {
    if (!this.currentMealPlan) return;
    
    // Find the day in the current meal plan
    const dayPlan = this.currentMealPlan.days.find(d => d.dayOfWeek === day);
    if (!dayPlan) return;
    
    // Check if meal type already exists for this day
    const existingMealIndex = dayPlan.meals.findIndex(m => m.mealType === mealType);
    
    if (existingMealIndex !== -1) {
      // Update existing meal
      dayPlan.meals[existingMealIndex].recipe = recipeId;
    } else {
      // Add new meal
      dayPlan.meals.push({
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
        recipe: recipeId
      });
    }
    
    this.updateMealPlan();
  }

  removeMealFromPlan(day: string, mealType: string): void {
    if (!this.currentMealPlan) return;
    
    // Find the day in the current meal plan
    const dayPlan = this.currentMealPlan.days.find(d => d.dayOfWeek === day);
    if (!dayPlan) return;
    
    // Remove the meal
    dayPlan.meals = dayPlan.meals.filter(m => m.mealType !== mealType);
    
    this.updateMealPlan();
  }

  updateMealPlan(): void {
    if (!this.currentMealPlan) return;
    
    this.mealPlanService.updateMealPlan(this.currentMealPlan._id!, {
      days: this.currentMealPlan.days
    }).subscribe({
      next: (mealPlan) => {
        this.currentMealPlan = mealPlan;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to update meal plan';
        // Reload current meal plan to reset state
        this.loadCurrentMealPlan();
      }
    });
  }

  getMealForDay(day: string, mealType: string): any {
    if (!this.currentMealPlan) return null;
    
    const dayPlan = this.currentMealPlan.days.find(d => d.dayOfWeek === day);
    if (!dayPlan) return null;
    
    const meal = dayPlan.meals.find(m => m.mealType === mealType);
    if (!meal) return null;
    
    // If the recipe is a string (ID), find the recipe object
    if (typeof meal.recipe === 'string') {
      const recipe = this.savedRecipes.find(r => r._id === meal.recipe || r.edamamId === meal.recipe);
      return recipe || null;
    }
    
    return meal.recipe;
  }
}