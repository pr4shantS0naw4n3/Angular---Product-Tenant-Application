import { BuyImageDialogComponent } from './profile/buy-image-dialog/buy-image-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { RssoLoginComponent } from './login/rsso-login/rsso-login.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        MatDialogModule,
        MatTabsModule,
        FormsModule,
        MatTableModule
    ],
    declarations: [
        LandingComponent,
        SignupComponent,
        ProfileComponent,
        LoginComponent,
        BuyImageDialogComponent,
        RssoLoginComponent
    ],
    providers: [
        CookieService
    ],
    entryComponents: [BuyImageDialogComponent]
})
export class ExamplesModule { }
