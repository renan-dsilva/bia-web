import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Security } from '../utils/security.util';
import { UserProvider } from 'app/pages/user/user.provider';

@Injectable()
export class AuthService implements CanActivate {

    constructor(
        private router: Router,
        private userProvider: UserProvider
    ) { }

    canActivate(): boolean {
        // TODO: Returning true while MVP phase
        return true;

        const token = Security.getToken();
        if (!token) {
            this.router.navigate(['/login']);
        } else {
            this
                .userProvider
                .refreshToken()
                .subscribe(
                    (response: any) => {
                        Security.set(response.data, response.data.token);
                    },
                    (err) => {
                        Security.clear();
                        this.router.navigate(['/login']);
                    }
                );


            return true;
        }

        return false;
    }
}