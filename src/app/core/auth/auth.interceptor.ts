import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    let newReq = req;
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
        });
    }

    return next(newReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        const retryReq = req.clone({
                            headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
                        });
                        return next(retryReq);
                    }),
                    catchError(() => {
                        authService.signOut();
                        location.reload();
                        return throwError(error);
                    })
                );
            }
            return throwError(error);
        }),
    );
};
