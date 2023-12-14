import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivateChild {

  constructor(
    public router: Router,
    private authService: AuthService
  ) { }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    const userRoles = this.authService.getProfile().roles as string[];
   
    const rolesRequired = route.data.roles;
 

    const hasAccess = rolesRequired.length === 0 || rolesRequired.some((y: string) => userRoles.some(i => i === y));
    if (!hasAccess) {
      this.authService.logout()
      // this.router.navigate(['/no-access']);
    }

    return hasAccess;
  }
}
