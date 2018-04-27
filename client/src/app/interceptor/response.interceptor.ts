import { Injectable } from '@angular/core'  
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponseBase, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';  
import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/do'; 
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { error } from 'protractor';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {  
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        return next.handle(req)
            .catch((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    // JWT expired, go to login
                    this.router.navigate(['login']);
                    location.reload(true);
                   } 
                return Observable.throw(err);
            });
    }  
} 