import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  localMovies: any[] = [];
  externalMovies: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadLocalMovies();
    this.loadOmdbMovies();
  }

  loadLocalMovies() {
    this.http.get<any[]>('http://localhost:3000/movies').subscribe({
      next: (data) => (this.localMovies = data),
      error: () => alert('Error loading saved movies'),
    });
  }

  loadOmdbMovies() {
    const query = 'batman';
    this.http
      .get<any>(`http://localhost:3000/movies/omdb?s=${query}&plot=full`)
      .subscribe({
        next: (data) => (this.externalMovies = data.Search || []),
        error: () => alert('Error loading external movies'),
      });
  }

  logout() {
    this.auth.logout();
  }
}
