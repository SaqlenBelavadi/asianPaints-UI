import { environment } from 'src/environments/environment';

export const GalleryAPI = {
  getAllImagesUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Images`;
  },
  getImagesUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Image`;
  },
  getAllFeedbacksUrl(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Feedback/Gallery`;
  },
  publishOrUnpublishFeedback(): string {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Feedback/PublishOrUnpublish`;
  },
  deleteFeedbacksFromGalleryUrl() {
    return `${environment.rootUrl}${environment.apiPath}/Activity/Feedback/Gallery`;
  },
};
