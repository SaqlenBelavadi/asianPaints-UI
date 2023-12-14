import { environment } from "src/environments/environment";
 
export const LandingPageAPI = {
    getLandingPageDetailsUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}/LandingPageDetails`;
    },
    uploadBannerImagesUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}/Upload/Images/Banner`;
    },
    uploadLeadersTalksUrl(): string {
        return `${environment.rootUrl}${environment.apiPath}/Upload/LeadersTalk`;
    },
    uploadLogoPartner(): string {
        return `${environment.rootUrl}${environment.apiPath}/Upload/Logo/Partner`;
    },
    uploadTestimonialData(): string {
        return `${environment.rootUrl}${environment.apiPath}/Upload/TestimonialData`;
    },
    uploadVideo(): string {
        return `${environment.rootUrl}${environment.apiPath}/Upload/Video`;
    },
    uploadVoiceOfChange(): string {
        return `${environment.rootUrl}${environment.apiPath}/Upload/VoiceOfChange`;
    },
    getUniqueActivity(): string {
        return `${environment.rootUrl}${environment.apiPath}/LocationWise`;
    },
    deleteBannerImages(): string {
        return `${environment.rootUrl}${environment.apiPath}/Delete/BannerImages`;
    },
    deleteLeadersTalkData(): string {
        return `${environment.rootUrl}${environment.apiPath}/Delete/LeadersTalkData`;
    },
    deleteVoiceOfChangeData(): string {
        return `${environment.rootUrl}${environment.apiPath}/Delete/VoiceOfChangeData`;
    },
    deleteVideo(): string {
        return `${environment.rootUrl}${environment.apiPath}/Delete/Video`;
    },
    deleteTestimonialData(): string {
        return `${environment.rootUrl}${environment.apiPath}/Delete/TestimonialData`;
    },
    deletePartnersLogo(): string {
        return `${environment.rootUrl}${environment.apiPath}/Delete/PartnersLogo`;
    }
}