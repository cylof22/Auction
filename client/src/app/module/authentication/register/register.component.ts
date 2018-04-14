import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterInfo } from "../../user/user.model/user"
import { AuthenticationService } from "../services/authentication.service"

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent {
    errorInfo = {error:""}
    formModel: FormGroup;

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
        let registerInfo = this.formModel.value;

        registerInfo.password = this.registerService.encode(registerInfo.username, registerInfo.password);
        this.registerService.register(registerInfo).subscribe( output => {
            if (output["error"] != undefined &&  output["error"] != "") {
                alert(JSON.stringify(output["error"]));
            } else {
                location.href = "/#/login";
            }
        });
    }
}