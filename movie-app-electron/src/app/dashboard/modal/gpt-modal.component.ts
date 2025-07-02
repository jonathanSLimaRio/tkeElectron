import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gpt-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Movie Summary</h2>
    <mat-dialog-content>
      <p *ngIf="!data.summary">Loading...</p>
      <p *ngIf="data.summary">{{ data.summary }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class GptModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { summary: string }) {}
}
