'use strict';
class LikeAjax extends Ajax {
  static create(tartId, handler) {
    return super.post(TatterJsData.likeCreateURL, {
      tartId: tartId,
    }).then(handler).catch(outputError);
  }
  static destroy(tartId, handler) {
    return super.delete(TatterJsData.getLikeDestroyURL(tartId)).then(handler).catch(outputError);
  }
}
