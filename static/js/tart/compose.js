'use strict';
class ComposeTart {
  static composing = false;
  static init() {
    this.triggerSideButton = document.querySelector('button.tart-compose-side-button');
    this.triggerSideButton.addEventListener('click', this.openModal.bind(this), false);
    this.triggerMobileButton = document.querySelector('button.tart-compose-mobile-button');
    this.triggerMobileButton.addEventListener('click', this.openModal.bind(this), false);

    this.modal = document.getElementById('tartComposeModal');
    this.bsModal = bootstrap.Modal.getOrCreateInstance(this.modal);
    this.modal.addEventListener('shown.bs.modal', this.focusComposeTextarea.bind(this), false);
    this.inputTextarea = this.modal.querySelector('textarea.tart-compose-input');
    this.inputTextarea.addEventListener('input', this.onInput.bind(this), false);
    this.feedbackArea = this.modal.querySelector('div.tart-text-feedback');

    this.sendButton = this.modal.querySelector('.compose-tart-send');
    this.sendButtonSpinner = this.sendButton.querySelector('.tart-create-spinner');
    this.sendButton.addEventListener('click', this.onComposeTartSendClick.bind(this), false);
  }
  /**
   * Tart作成モーダルを表示
   */
  static openModal() {
    this.bsModal.show();
    this.onInput();
  }
  /**
   * @param {Boolean} disabled
   */
  static set triggerButtonDisabled(disabled) {
    this.triggerSideButton.disabled = disabled;
    this.triggerMobileButton.disabled = disabled;
  }

  static focusComposeTextarea(event) {
    this.inputTextarea.focus();
  }
  /**
   * 
   */
  static onInput() {
    const composedText = this.inputTextarea.value;
    if (composedText.trim() === '') {
      this.sendButton.disabled = true;
    } else {
      this.sendButton.disabled = false;
    }
  }

  static onComposeTartSendClick(event) {
    const composedText = this.inputTextarea.value;
    if (composedText) {
      this.sendButtonSpinner.classList.remove('d-none');
      this.sendButton.disabled = true;
      this.triggerButtonDisabled = true;
      TartAjax.composePost(composedText, ComposeTart.afterCompose.bind(this));
    }
  }
  /**
   * 投稿成功時はトップページへ，失敗時はアラート表示
   * @param {Object} response 
   */
  static afterCompose(response) {
    this.sendButtonSpinner.classList.add('d-none');
    this.sendButton.disabled = false;
    this.triggerButtonDisabled = false;
    this.composing = false;
    if (response.status === 201) {
      location.href = TatterJsData.indexURL;
    } else if (response.status === 400) {
      if (response.jsonBody.text) {
        this.inputTextarea.classList.add('is-invalid');
        this.feedbackArea.textContent = response.jsonBody.text.join('');
      } else alert('エラーが発生しました');
    } else alert('不明なエラー');
  }
}
