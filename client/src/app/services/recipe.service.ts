// client/src/app/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recipe, SearchResponse } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api/recipes';
  
  constructor(private http: HttpClient) {}
  
  // Search recipes from Edamam API
  searchRecipes(query: string, filters: any = {}): Observable<SearchResponse> {
    let params = new HttpParams().set('query', query);
    
    // Add filters to params if they exist
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    
    return this.http.get<SearchResponse>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Get recipe by ID
  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Save recipe to favorites
  saveRecipe(recipeData: any): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/save`, { recipeData })
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Unsave recipe from favorites
  unsaveRecipe(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Get user's saved recipes
  getSavedRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/user/saved`)
      .pipe(catchError(error => throwError(() => error)));
  }
}