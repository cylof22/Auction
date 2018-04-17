import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service"
import { LoginInfo, User } from "../../user/user.model/user"
import { $$ } from 'protractor';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    formModel: FormGroup;
    autoLoginFlag: boolean;

    constructor(private loginService: AuthenticationService) {
        // clear local data firstly
        this.autoLoginFlag = false;
        this.loginService.logout();

        const fb = new FormBuilder();
        this.formModel = fb.group({
        'username': '',
        'password': '',
        'temporary':false
        })
    }

    login() {
        let loginData = this.formModel.value;
        loginData.password = this.loginService.encode(loginData.username, loginData.password);
        loginData.temporary = !this.autoLoginFlag;

        this.loginService.login(loginData).subscribe( user => {
            if (user["error"] != undefined &&  user["error"] != "") {
                alert(user["error"])
            } else {
                if (user && user.token) {
                    this.loginService.saveUserAuthentication(JSON.stringify(user))
                }

                location.href = "/#";
                location.reload(true);
            }
        });

        this.formModel.reset();
    }
}