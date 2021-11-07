'use strict';
/** 削除関係機能 */
class TartDelete {
  static deleting = false;
  static deletingInstance = null;
  /**
   * 渡されたTartArticleから，削除関係の機能のインスタンスを作成
   * @param {TartArticle} article 設定対象のArticleのインスタンス
   */
  constructor(article) {
    this.article = article;
    this.article.dom.querySelector('.tart-delete-a').addEventListener('click', this.onDeleteClicked, false);
  }
  /**
   * 渡されたarticle内のElementから，対象のTartDeleteのインスタンスを取得し返す。
   * @param {HTMLElement} component 
   * @returns {TartDelete}
   */
  static getInstanceFromComponent(component) {
    return TartArticle.getInstanceFromComponent(component).delete;
  }
  /** 削除ボタンがクリックされたら，確認モーダルを表示し，確認ボタンにリスナを設定 */
  onDeleteClicked(event) {
    const instance = TartDelete.getInstanceFromComponent(event.target);
    TartDelete.deletingInstance = instance;
    const deleteConfirmModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal'));
    deleteConfirmModal.show();
    const deleteConfirmBtn = document.querySelector('.tart-delete-submit');
    deleteConfirmBtn.addEventListener('click', instance.onDeleteSubmitClicked, false);
    console.log('aaa');
  }
  /** 削除確認モーダルで削除ボタンが押されたら削除を実行（削除中は操作不能にするスピナーモーダルを表示） */
  onDeleteSubmitClicked(event) {
    const instance = TartDelete.deletingInstance;
    TartDelete.deleting = true;
    const modal = document.getElementById('deleteConfirmModal');
    const deleteConfirmModal = bootstrap.Modal.getInstance(modal);
    deleteConfirmModal.hide();
    SpinnerModal.show();
    TartAjax.delete(instance.article.tart.id, instance.afterDelete);
  }
  /** 削除後の処理。詳細画面の時はトップのタイムラインに戻る。 */
  afterDelete(response) {
    if (response.status === 204) {
      const instance = TartDelete.deletingInstance;
      instance.article.tart.delete();
      document.querySelector('.tart-delete-submit').removeEventListener('click', instance.onDeleteClicked, false);
      TartDelete.deletingInstance = null;
      TartDelete.deleting = false;
      if (TatterJsData.pageIsDetail) {
        location.href = TatterJsData.indexURL;
        alert('正常に削除されました。ホームに戻ります。');
      }
    } else if (response.status === 403) {
      response.json().then(parsedJson => {
        alert(parsedJson.detail);
      }).catch(outputError);
    } else alert(`不明なエラー\nステータスコード:${response.status}`);
    SpinnerModal.hide();
  }
}
