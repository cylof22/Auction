import { Injectable, Injector, InjectionToken } from '@angular/core';
import { Http,Response,RequestOptions,Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5'
import { User } from './../../user/user.model/user'
import { LoginInfo, RegisterInfo } from './../model/authentication'

export const AUTHETICATION_SERVICE_URL = new InjectionToken<string>('authentication-service-url');

@Injectable()
export class AuthenticationService {
    localKey: string;
    currentUser: User;
    private authenticationURL : string;

    constructor(private http: HttpClient, injector : Injector) {
        this.authenticationURL = injector.get(AUTHETICATION_SERVICE_URL);
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

        return this.http.post<User>(this.authenticationURL + "authenticate", body);
    }

    register(postedData : RegisterInfo) : Observable<string> {

        let body = postedData;

        return this.http.post<string>(this.authenticationURL + "register", body);
    }
}