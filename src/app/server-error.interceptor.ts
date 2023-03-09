import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpRequest, HttpHandler,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {

                switch (error.status) {
                    case 400:
                    case 403:
                    case 404:
                    case 402:
                        return throwError(error.error);
                    case 401:
                        this.router.navigate(['/login']);
                        return throwError(error.error);

                    default:
                        let err = Error('Algo inesperado aconteceu, tente mais tarde.')
                        return throwError(err);
                }
            })
        );
    }
}