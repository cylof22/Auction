import { Injectable } from '@angular/core'  
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';  
import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/do';  

export class HeaderInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentTLUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}