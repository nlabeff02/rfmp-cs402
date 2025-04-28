# Recipe Finder and Meal Planner

A single-page web application that allows users to search for recipes, save favorites, and plan meals for the week.

## Features

- User authentication (login/register)
- Two user roles: User and Admin
- Recipe search with filtering options
- Save favorite recipes
- Create weekly meal plans
- Admin user management

## Technologies Used

### Frontend
- Angular 16
- Bootstrap 5
- RxJS
- TypeScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### External API
- Edamam Recipe Search API

## Project Structure

The project is divided into two main parts:

1. **client/** - Angular frontend
2. **server/** - Node.js/Express backend

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas)
- Angular CLI

### Server Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/recipe-planner
   JWT_SECRET=your-secret-key
   EDAMAM_APP_ID=your-edamam-app-id
   EDAMAM_APP_KEY=your-edamam-app-key
   ```

4. Seed the database with initial data:
   ```
   npm run seed
   ```

5. Start the server:
   ```
   npm run dev
   ```

### Client Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Angular development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/status` - Toggle user active status
- `PATCH /api/users/:id/role` - Set user role

### Recipes
- `GET /api/recipes/search` - Search recipes from Edamam API
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes/save` - Save recipe to favorites
- `DELETE /api/recipes/:id` - Remove recipe from favorites
- `GET /api/recipes/user/saved` - Get user's saved recipes

### Meal Plans
- `POST /api/mealplans` - Create a meal plan
- `GET /api/mealplans/current` - Get current meal plan
- `GET /api/mealplans` - Get all meal plans for a user
- `GET /api/mealplans/:id` - Get meal plan by ID
- `PUT /api/mealplans/:id` - Update meal plan
- `DELETE /api/mealplans/:id` - Delete meal plan

## Default Admin Account
- Username: admin
- Email: admin@example.com
- Password: admin123
