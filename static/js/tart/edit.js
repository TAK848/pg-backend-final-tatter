'use strict';
/** 編集機能関係の機能 */
class TartEdit {
  static editingInstance = null;
  static editSubmitting = false;
  /**
   * 渡されたTartArticleから，編集関係の機能のインスタンスを作成
   * @param {TartArticle} article 設定対象のArticleのインスタンス
   */
  constructor(article) {
    this.article = article;
    this.article.dom.querySelector('.tart-edit-a').addEventListener('click', this.onEditClicked, false);
    this.dom = new TartEditDom(this);
  }
  /**
   * 渡されたarticle内のElementから，対象のTartEditのインスタンスを取得し返す。
   * @param {HTMLElement} component 
   * @returns {TartEdit}
   */
  static getInstanceFromComponent(component) {
    return TartArticle.getInstanceFromComponent(component).edit;
  }

  /**
   * 編集ボタンが押された時の処理。編集モードに移行する。
   * @param {Event} event 発生したイベントの内容（編集ボタンを押した時想定）
   */
  onEditClicked(event) {
    const instance = TartEdit.getInstanceFromComponent(event.target);
    instance.setEditMode();
  }
  /** インスタンスのTartを編集モードの表示にする。文字列に変更があるか無いかの入力ごとのチェック・キャンセルボタン・送信ボタンのイベントリスナを設定する。 */
  setEditMode() {
    if (!TartEdit.editSubmitting) {
      if (TartEdit.editingInstance !== null) TartEdit.editingInstance.finishEditMode();
      TartEdit.editingInstance = this;
      const text = this.article.tart.text;
      this.dom.editMode(text);
      this.dom.editBox.addEventListener('input', this._onInput, false);
      this.dom.submitButton.addEventListener('click', this._onSubmit, false);
      this.dom.cancelButton.addEventListener('click', this._onCancel, false);
    }
  }
  /**
   * 入力がされるたびに，今までと同じ値の場合は送信ボタンを無効に，変わっていれば有効にする設定をする
   * @param {Event} event 発生したイベントの内容（テキストエリアの入力時想定）
   */
  _onInput(event) {
    const instance = TartEdit.getInstanceFromComponent(event.target);
    let editbox = instance.article.dom.querySelector('div.tart-body textarea.tart-edit-textarea');
    instance.dom.canSubmit = !(instance.article.tart.text === editbox.value.trim());
  }
  /**
   * 送信ボタンを押した時に実行。文字数チェックをし，編集内容を送信する
   * @param {Event} event 発生したイベントの内容（送信ボタンを押した時想定）
   */
  _onSubmit(event) {
    const instance = TartEdit.getInstanceFromComponent(event.target);
    const text = instance.dom.editBox.value.trim();
    if (text.length >= TART_MAX_LENGTH) {
      instance.dom.validationError(`${text.length}文字になっています。${TART_MAX_LENGTH}字以内で入力してください。`);
    } else {
      TartEdit.editSubmitting = true;
      instance.dom.submitting();
      TartAjax.edit(instance.article.tart.id, instance.dom.editBox.value.trim(), instance._afterEdit);
    }
  }
  /**
   * キャンセルボタンを押した時に実行。
   * @param {Event} event 発生したイベントの内容（キャンセルボタンを押した時想定）
   */
  _onCancel(event) {
    const instance = TartEdit.getInstanceFromComponent(event.target);
    instance.dom.finishEditMode();
    TartEdit.editingInstance = null;
  }
  /**
   * 編集情報送信後，結果が返ってきた後の処理内容。
   * @param {Object} response 
   */
  _afterEdit(response) {
    const data = response.jsonBody;
    const instance = TartEdit.editingInstance;
    if (response.status === 200) instance.article.tart.update(data);
    else if (response.status === 400) instance.dom.validationError(data.text.join(''));
    else if (response.status === 403) alert(data.detail);
    else alert('不明なエラーが発生しました');
    instance.finishEditMode();
    instance.dom.submitButton.removeEventListener('click', instance.onSubmit, false);
    instance.dom.cancelButton.removeEventListener('click', instance.onSubmit, false);
    TartEdit.editingInstance = null;
  }
  /** 編集モードを終了 */
  finishEditMode() {
    TartEdit.editSubmitting = false;
    this.dom.finishEditMode();
  }
}

/** 編集機能の描画関係 */
class TartEditDom {
  /**
   * TartEdit Classから編集機能関連の描画機能のインスタンスを作成
   * @param {TartEdit} tartEdit 
   */
  constructor(tartEdit) {
    this.tartArticle = tartEdit.article;
    this.detailLink = tartEdit.article.dom.querySelector('div.tart-body a.tart-detail-link');
    this.tartTextP = tartEdit.article.dom.querySelector('div.tart-body p.tart-text');
    this.editBox = tartEdit.article.dom.querySelector('div.tart-body textarea.tart-edit-textarea');
    this.editInvalidFeedback = tartEdit.article.dom.querySelector('div.tart-body div.tart-edit-textarea-feedback');
    this.actionButtons = tartEdit.article.dom.querySelector('div.tart-body div.tart-edit-action');
    this.cancelButton = this.actionButtons.querySelector('button.tart-edit-cancel');
    this.submitButton = this.actionButtons.querySelector('button.tart-edit-confirm');
    this.submitSpinner = this.submitButton.querySelector('span.tart-edit-confirm-spinner');
  }
  /** 編集ボタンの入力可否を設定するsetter */
  set canSubmit(canSubmit) {
    this.submitButton.disabled = !canSubmit;
  }
  /**
   * 編集用テキストエリアやボタンなどを表示させる
   * @param {String} text 編集前のtext
   */
  editMode(text) {
    if (this.editBox.value.trim()) {
      this.canSubmit = !(text.trim() === this.editBox.value.trim());
    } else {
      this.canSubmit = false;
      this.editBox.value = text.trim();
    }
    this.tartTextP.classList.add('d-none');
    this.editBox.classList.remove('d-none');
    this.editBox.disabled = false;
    this.editBox.focus();
    this.actionButtons.classList.remove('d-none');
    if (!TatterJsData.pageIsDetail) this.tartArticle.resetDetailPageListener();
  }
  /** 送信中の表示設定。ボタンやテキストボックスを入力不可にする */
  submitting() {
    this.editBox.disabled = true;
    this.editBox.classList.remove('is-invalid');
    this.submitSpinner.classList.remove('d-none');
    this.cancelButton.disabled = true;
    this.submitButton.disabled = true;
  }
  /** 編集用テキストエリアを非表示にする */
  finishEditMode() {
    this.tartTextP.classList.remove('d-none');
    this.editBox.classList.add('d-none');
    this.editBox.classList.remove('is-invalid');
    this.actionButtons.classList.add('d-none');
    this.cancelButton.disabled = false;
    this.submitSpinner.classList.add('d-none');
    if (!TatterJsData.pageIsDetail) this.tartArticle.setDetailPageListener();
  }
  /**
   * Tartの文字数制限にかかった場合などの最低限のバリデーション失敗時のエラー表示設定
   * @param {String} errorMessage 
   */
  validationError(errorMessage) {
    this.editInvalidFeedback.textContent = errorMessage;
    this.editBox.classList.add('is-invalid');
  }
}
