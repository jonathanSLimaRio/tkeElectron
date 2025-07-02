import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  localMovies: any[] = [];
  externalMovies: any[] = [];
  searchQuery: string = 'batman';
  favoriteIds: Set<string> = new Set();

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadLocalMovies();
    this.searchOmdb();
  }

  loadFavorites() {
    const stored = localStorage.getItem('favoriteMovies');
    this.localMovies = stored ? JSON.parse(stored) : [];
    this.favoriteIds = new Set(this.localMovies.map((m: any) => m.imdbID));
  }

  getFavoriteMovies(): any[] {
    const stored = localStorage.getItem('favoriteMovies');
    return stored ? JSON.parse(stored) : [];
  }

  toggleFavorite(imdbID: string) {
    const favorites = this.getFavoriteMovies();
    const alreadyFavorited = favorites.some((m: any) => m.imdbID === imdbID);

    let updatedFavorites;

    if (alreadyFavorited) {
      updatedFavorites = favorites.filter((m: any) => m.imdbID !== imdbID);
    } else {
      const movie =
        this.externalMovies.find((m) => m.imdbID === imdbID) ||
        this.localMovies.find((m) => m.imdbID === imdbID);

      if (!movie) return;

      updatedFavorites = [...favorites, movie];
    }

    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    this.loadFavorites();
  }

  isFavorite(imdbID: string): boolean {
    return this.favoriteIds.has(imdbID);
  }

  loadLocalMovies() {
    this.http.get<any[]>('http://localhost:3000/movies').subscribe({
      next: (data) => (this.localMovies = data),
      error: () => alert('Error loading saved movies'),
    });
  }

  searchOmdb() {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.http
      .get<any>(`http://localhost:3000/movies/omdb?s=${query}&plot=full`)
      .subscribe({
        next: (data) => {
          this.externalMovies = data.Search || [];
          this.searchQuery = '';
        },
        error: () => alert('Error loading external movies'),
      });
  }

  logout() {
    this.auth.logout();
  }
}
