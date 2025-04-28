// client/src/app/components/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { SearchResponse } from '../../models/recipe.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: SearchResponse | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Diet filters
  dietLabels: string[] = [
    'balanced', 'high-fiber', 'high-protein', 'low-carb', 'low-fat', 'low-sodium'
  ];
  
  // Health filters
  healthLabels: string[] = [
    'alcohol-free', 'dairy-free', 'egg-free', 'gluten-free', 
    'kosher', 'peanut-free', 'pescatarian', 'vegan', 'vegetarian'
  ];
  
  // Meal type filters
  mealTypes: string[] = [
    'breakfast', 'lunch', 'dinner', 'snack'
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      diet: [''],
      health: [''],
      mealType: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.searchForm.get('query')?.value) {
      this.errorMessage = 'Please enter a search term';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // Build filters object
    const filters: any = {};
    
    if (this.searchForm.get('diet')?.value) {
      filters.diet = this.searchForm.get('diet')?.value;
    }
    
    if (this.searchForm.get('health')?.value) {
      filters.health = this.searchForm.get('health')?.value;
    }
    
    if (this.searchForm.get('mealType')?.value) {
      filters.mealType = this.searchForm.get('mealType')?.value;
    }
    
    this.recipeService.searchRecipes(this.searchForm.get('query')?.value, filters)
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error.msg || 'Failed to search recipes';
          this.isLoading = false;
        }
      });
  }

  saveRecipe(recipeData: any): void {
    this.recipeService.saveRecipe(recipeData).subscribe({
      next: () => {
        // Show success message or update UI
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to save recipe';
      }
    });
  }
}