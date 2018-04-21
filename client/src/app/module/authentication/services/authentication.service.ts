import { Injectable, Inject, OpaqueToken } from "@angular/core";
import { Http,Response,RequestOptions,Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Md5 } from 'ts-md5/dist/md5'
import { LoginInfo, RegisterInfo, User } from "./../../user/user.model/user"
export const API_AUTHENTICATION_SERVICE_URL = new OpaqueToken("api-products-url");

@Injectable()
export class AuthenticationService {
    localKey: string;
    currentUser: User;

    constructor(private http: Http,
        @Inject(API_AUTHENTICATION_SERVICE_URL) private authURL : string) {
        this.localKey = 'currentTLUser';
        this.currentUser = this.loadUserAuthentication();
    }

    encode(name: string, password: string) : string {
        let res = Md5.hashStr(name + Md5.hashStr(password).toString());
        return res.toString();
    }

    saveUserAuthentication(input: string) {
        localStorage.setItem(this.localKey, input);
        this.currentUser = this.loadUserAuthentication();
    }

    loadUserAuthentication() : User {
        let currentUser = JSON.parse(localStorage.getItem(this.localKey));
        return currentUser;
    }

    logout() {
        localStorage.removeItem(this.localKey);
        this.currentUser = new User("", "", "");
    }

    login(loginInfo: LoginInfo) : Observable<User> {
        let body = loginInfo;

        return this.http.post(this.authURL + "authenticate", body)
        .map(response => response.json());
    }

    register(postedData : RegisterInfo) : Observable<string> {

        let body = postedData;

        return this.http.post(this.authURL + "register", body)
        .map(response => response.json());
    }
}