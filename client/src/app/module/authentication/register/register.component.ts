import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterInfo } from './../model/authentication'
import { AuthenticationService } from "../services/authentication.service"

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent {
    formModel: FormGroup;
    errorValue: string = '';

    constructor(private registerService: AuthenticationService) {
        const fb = new FormBuilder();
        this.formModel = fb.group({
        'username': '',
        'password': '',
        'phone': '',
        'email':''
        })
    }

    submit() {
        let checkCtrl = <HTMLInputElement>document.getElementById('conditionCheck');
        if (!checkCtrl.checked) {
            return;
        }


        // if password and confirm password is inconsistent
        let repassword = <HTMLInputElement>document.getElementById('repassword');
        let registerInfo = this.formModel.value;
        if (registerInfo.password != repassword.value) {
            this.errorValue = 'Password and Confirm Password inconsistent';
            return;
        }

        let regEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!regEmail.test(registerInfo.email)) {
            this.errorValue = 'Email invalid';
            return;
        }

        registerInfo.password = this.registerService.encode(registerInfo.username, registerInfo.password);
        this.registerService.register(registerInfo).subscribe( output => {
            if (output["error"] != undefined &&  output["error"] != "") {
                this.errorValue = output["error"];
            } else {
                location.href = "/#/login";
            }
        });
    }

    onInput() {
        if (this.errorValue != '') {
            this.errorValue = '';
        }
    }
}