import { environment } from 'src/environments/environment';

export const ActivityAPI = {
  lovUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/lov`;
  },
  tagLovUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/lov/tags`;
  },
  ActivityUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity`;
  },
  getActivityUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity`;
  },
  activtyNameByTagUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Tags`;
  },

  createActivtyTagUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Tags`;
  },
  getParticipantsUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/ParticipantDetails`;
  },
  uploadImagesUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Upload/Images`;
  },
  imagesUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Images`;
  },
  activityEnrollOrParticipateUrl() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/EnrollOrParticipate`;
  },
  activityFinancialUrl() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/ActivityFinancials`;
  },
  activityApprovrOrRejectUrl() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/ApproveOrReject`;
  },
  activityDetailsFeedbackUrl() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Feedback`;
  },
  activityPromotionListing() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Promotion/Listing`;
  },
  addPromotionUrl() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Promotion`;
  },
  uploadParticipantsUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Upload/ParticipantDetails`;
  },
  generateActivityIdUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/ActivityId`;
  },
  uploadFeedbackToGalleryUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Feedback/UploadToGallery`;
  },
};
