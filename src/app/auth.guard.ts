import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const toke = localStorage.getItem('token');
    if (toke) {
        return true;
    } else {
        const router = new Router();
        router.navigate(['/']);
        return false;
    }
};