// client/src/app/models/user.model.ts
export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    dietaryPreferences: string[];
    allergies: string[];
    isActive: boolean;
    createdAt: Date;
  }