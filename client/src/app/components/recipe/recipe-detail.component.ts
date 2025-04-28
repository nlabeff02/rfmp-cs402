// client/src/app/components/recipe/recipe-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  isSaved: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = params['id'];
      if (recipeId) {
        this.loadRecipe(recipeId);
      }
    });
  }

  loadRecipe(recipeId: string): void {
    this.isLoading = true;
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (data) => {
        this.recipe = data.recipe || data;
        this.isLoading = false;
        
        // Check if recipe is saved
        if (this.recipe.savedBy) {
          this.isSaved = true;
        }
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to load recipe details';
        this.isLoading = false;
      }
    });
  }

  saveRecipe(): void {
    if (!this.recipe) return;
    
    this.recipeService.saveRecipe(this.recipe).subscribe({
      next: () => {
        this.isSaved = true;
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to save recipe';
      }
    });
  }

  unsaveRecipe(): void {
    if (!this.recipe) return;
    
    this.recipeService.unsaveRecipe(this.recipe.edamamId || this.recipe.uri.split('#recipe_')[1]).subscribe({
      next: () => {
        this.isSaved = false;
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to remove recipe';
      }
    });
  }

  // Helper function to get a nutrient value
  getNutrientValue(nutrientKey: string): string {
    if (!this.recipe || !this.recipe.totalNutrients || !this.recipe.totalNutrients[nutrientKey]) {
      return 'N/A';
    }
    
    const nutrient = this.recipe.totalNutrients[nutrientKey];
    return `${Math.round(nutrient.quantity)} ${nutrient.unit}`;
  }
}