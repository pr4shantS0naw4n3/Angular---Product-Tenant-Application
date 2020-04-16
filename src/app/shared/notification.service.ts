import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  snackBarConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['standard-snackbar']
  };

  pop(msg) {
    console.log(msg);
    if (msg === '' || msg === undefined || msg === null) {
      return;
    }
    this.snackBar.open(msg, '', this.snackBarConfig);
  }
}
