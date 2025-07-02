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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GptModalComponent } from './modal/gpt-modal.component';

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
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  localMovies: any[] = [];
  externalMovies: any[] = [];
  searchQuery: string = 'batman';
  favoriteIds: Set<string> = new Set();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

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

  openWikipedia(title: string) {
    const formatted = title.replace(/\s+/g, '_');
    const url = `https://en.wikipedia.org/wiki/${formatted}`;
    console.log('Opening Wikipedia:', url);

    const isElectron = !!(window as any).electronAPI;

    if (isElectron) {
      (window as any).electronAPI.openWikipedia(url);
    } else {
      window.open(url, '_blank');
    }
  }

  resumeByGPT(title: string, imdbID: string) {
    const dialogRef = this.dialog.open(GptModalComponent, {
      data: { summary: '' },
    });

    const token = this.auth.getToken();

    this.http
      .post<{ summary: string }>(
        'http://localhost:3000/chatgpt/resume',
        { title, imdbID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe({
        next: (res) => {
          dialogRef.componentInstance.data.summary = res.summary;
        },
        error: () => {
          dialogRef.componentInstance.data.summary =
            'Failed to load summary from GPT.';
        },
      });
  }

  logout() {
    this.auth.logout();
  }
}
