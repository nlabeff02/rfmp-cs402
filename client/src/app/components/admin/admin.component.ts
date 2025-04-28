// client/src/app/components/admin/admin.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  editUserForm: FormGroup;
  selectedUser: User | null = null;
  
  // Filter and sort properties
  searchTerm: string = '';
  sortField: string = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  selectUserForEdit(user: User): void {
    this.selectedUser = user;
    this.editUserForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  }

  updateUser(): void {
    if (this.editUserForm.invalid || !this.selectedUser) {
      return;
    }

    this.userService.updateUser(this.selectedUser.id, this.editUserForm.value).subscribe({
      next: (updatedUser) => {
        // Update user in the list
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.selectedUser = null;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to update user';
      }
    });
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.editUserForm.reset();
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (result) => {
        // Update user status in the list
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index].isActive = result.isActive;
        }
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to toggle user status';
      }
    });
  }

  setUserRole(user: User, role: 'user' | 'admin'): void {
    this.userService.setUserRole(user.id, role).subscribe({
      next: (result) => {
        // Update user role in the list
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index].role = result.role as 'user' | 'admin';
        }
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.msg || 'Failed to set user role';
      }
    });
  }

  // Filter users based on search term
  get filteredUsers(): User[] {
    if (!this.searchTerm) {
      return this.sortUsers(this.users);
    }
    
    const filtered = this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    
    return this.sortUsers(filtered);
  }

  // Sort users based on sort field and direction
  sortUsers(users: User[]): User[] {
    return [...users].sort((a, b) => {
      let comparison = 0;
      
      if (this.sortField === 'username') {
        comparison = a.username.localeCompare(b.username);
      } else if (this.sortField === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (this.sortField === 'role') {
        comparison = a.role.localeCompare(b.role);
      } else if (this.sortField === 'status') {
        comparison = Number(a.isActive) - Number(b.isActive);
      } else if (this.sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Set sorting
  setSorting(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
}