import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { login: string; password: string }) {
    return this.http.post(`${this.api}/login`, data);
  }

  register(data: { name?: string; login: string; password: string }) {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
