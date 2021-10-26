'use strict';
class TartAjax extends Ajax {
  static listGet(params = {}, handler) {
    return super.get(TatterJsData.listURL, params).then(handler).catch(outputError);
  }
  static retrieveGet(tartId, handler) {
    return super.get(TatterJsData.getRetrieveURL(tartId), {}).then(handler).catch(outputError);
  }
  static checkUpdateGet(params = {}, handler) {
    return super.get(TatterJsData.checkUpdateURL, params).then(handler).catch(outputError);
  }
  static composePost(tartText, handler) {
    return super.post(TatterJsData.composeURL, {
      text: tartText,
    }).then(handler).catch(outputError);
  }
  static delete(tartId, handler) {
    return super.delete(TatterJsData.getDeleteURL(tartId)).then(handler).catch(outputError);
  }
  static edit(tartId, text, handler) {
    return super.patch(TatterJsData.getEditURL(tartId), {
      text: text,
    }).then(handler).catch(outputError);
  }
}
