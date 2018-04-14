import { Injectable } from '@angular/core'  
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';  
import { Observable } from 'rxjs/Observable';  
import 'rxjs/add/operator/do'; 
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {  
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        return next.handle(req)
            .map(resp => {   
                if (resp instanceof HttpResponse) {  
                    if (resp.status === 401) {
                        // JWT expired, go to login
                        alert("401")
                        this.router.navigate(['login']);
                       }   
                } 
  
                return resp;  
            });  
  
    }  
} 