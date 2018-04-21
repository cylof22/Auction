import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component';
import { AuthenticationService, AUTHETICATION_SERVICE_URL } from "./services/authentication.service"
import { environment } from '../../../environments/environment';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
    ],

    exports: [
        LoginComponent,
        RegisterComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild([
            {path: 'login', component: LoginComponent },
            {path: 'register', component: RegisterComponent}
        ])
    ],

    providers:[
        AuthenticationService,
        { provide: AUTHETICATION_SERVICE_URL, useValue: environment.productionURL + "/api/" },
    ],
})


export class AuthenticationModule { }