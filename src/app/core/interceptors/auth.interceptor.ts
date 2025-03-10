import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (req.url.includes('/auth/login')) {
        return next(req);
    }

    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('access_token');

        if (token) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next(cloned);
        }
    }

    return next(req);
};