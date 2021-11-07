'use strict';
class FollowAjax extends Ajax {
  static create(followerUuid, handler) {
    return super.post(TatterJsData.followCreateURL, {
      follower: followerUuid,
    }).then(handler).catch(outputError);
  }
  static destroy(followerUuid, handler) {
    return super.delete(TatterJsData.getFollowDestroyURL(followerUuid)).then(handler).catch(outputError);
  }
}
