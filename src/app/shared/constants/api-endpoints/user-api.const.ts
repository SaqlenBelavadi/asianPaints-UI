import { environment } from "src/environments/environment";

export const UserAPI = {
    authenticateUserUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}/Login`;
    },
    aliveUserUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}api/Alive/isalive`;
    },
    refreshTokenUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}/RefreshToken`;
    },
    switchApinUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}/SwitchProfile`;
    }
}