// client/src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  savedRecipes: Recipe[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.loadSavedRecipes();
  }

  loadSavedRecipes(): void {
    this.isLoading = true;
    this.recipeService.getSavedRecipes().subscribe({
      next: (recipes) => {
        this.savedRecipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to load saved recipes';
        this.isLoading = false;
      }
    });
  }

  unsaveRecipe(recipeId: string): void {
    this.recipeService.unsaveRecipe(recipeId).subscribe({
      next: () => {
        this.savedRecipes = this.savedRecipes.filter(recipe => recipe.edamamId !== recipeId);
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to remove recipe';
      }
    });
  }
}