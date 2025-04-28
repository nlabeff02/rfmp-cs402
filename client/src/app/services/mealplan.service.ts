// client/src/app/services/mealplan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MealPlan } from '../models/mealplan.model';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private apiUrl = 'http://localhost:3000/api/mealplans';
  
  constructor(private http: HttpClient) {}
  
  // Create a meal plan
  createMealPlan(mealPlanData: Partial<MealPlan>): Observable<MealPlan> {
    return this.http.post<MealPlan>(this.apiUrl, mealPlanData)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Get current meal plan
  getCurrentMealPlan(): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/current`)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Get all meal plans
  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(this.apiUrl)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Get meal plan by ID
  getMealPlanById(id: string): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Update meal plan
  updateMealPlan(id: string, mealPlanData: Partial<MealPlan>): Observable<MealPlan> {
    return this.http.put<MealPlan>(`${this.apiUrl}/${id}`, mealPlanData)
      .pipe(catchError(error => throwError(() => error)));
  }
  
  // Delete meal plan
  deleteMealPlan(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => throwError(() => error)));
  }
}