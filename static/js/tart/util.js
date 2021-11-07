'use strict';
// 一度にロードするTartの数
const NUMBER_TO_LOAD_AT_A_TIME = 10;
// Tartの文字数制限
const TART_MAX_LENGTH = 140;
// 新規Tartの数をチェックする周期
const CHECK_UPDATE_INTERVAL_MS = 60000;

/** 画面全体を覆い一時的に操作不能にするスピナー */
class SpinnerModal {
  static initialized = false;
  static init() {
    this._modal = new bootstrap.Modal(document.getElementById('spinner'), {
      backdrop: 'static',
      keyboard: false
    });
    this.initialized = true;
  }
  static show() {
    if (!this.initialized) this.init();
    this._modal.show();
  }
  static hide() {
    if (!this.initialized) this.init();
    this._modal.hide();
  }
}

/** Tatterの各ページやAPIのURLなどのパラメータや，タイムライン・詳細画面・プロフィールといった表示形態を取得するための，静的メソッド・プロパティのみのクラス */
class TatterJsData {
  /** Djangoのテンプレートに出力されたjs-dataのdiv内に記述された各データを取得し，静的プロパティに保存。 */
  static init() {
    this.jsDataDiv = document.querySelector('div.js-data');
    this.indexURL = this.getDataset('tatterIndexUrl');
    this.listURL = this.getDataset('tartListUrl');
    this.checkUpdateURL = this.getDataset('tartCheckUpdateUrl');
    this.composeURL = this.getDataset('tartComposeUrl');
    this._detailURLWithPk = this.getDataset('tartDetailPkUrl');
    this._profileURLWithUsername = this.getDataset('userProfileUsernameUrl');
    this._deleteURLWithPk = this.getDataset('tartDeletePkUrl');
    this._editURLWithPk = this.getDataset('tartUpdatePkUrl');
    this._retrieveURLWithPk = this.getDataset('tartRetrievePkUrl');
    this.followCreateURL = this.getDataset('followCreateUrl');
    this._followDestroyURLWithUuid = this.getDataset('followDestroyUuidUrl');
    this.requestedUser = User.createOrGetUserInstance({
      uuid: this.getDataset('requestedUserUuid'),
      displayUsername: this.getDataset('requestedUserDisplayUsername'),
      handleName: this.getDataset('requestedUserHandleName'),
    });
    this.mode = this.jsDataDiv.dataset.pagemode;
    if (this.mode === 'home');
    else if (this.mode === 'global');
    else if (this.mode === 'detail') this.detailTartId = this.getDataset('tartDetailId');
    else if (this.mode === 'profile') {
      this.profileUser = User.createOrGetUserInstance({
        uuid: this.getDataset('profileUserUuid'),
        displayUsername: this.getDataset('profileUserDisplayUsername'),
        handleName: this.getDataset('profileUserHandleName'),
      });
    }
    this.jsDataDiv.parentNode.removeChild(this.jsDataDiv);
    this.jsDataDiv = undefined;
  }
  /**
   * クラス名から，各divに書かれたパラメータを取得
   * @param {String} className 欲しいデータに付与されているクラス名
   * @returns {String}
   */
  static getDataset(className) {
    return this.jsDataDiv.dataset[className.toLowerCase()];
  }
  /**
   * 削除対象のTartのIDからURLを取得
   * @param {String} tartId 削除対象のTartのID
   * @returns {String} 削除用URL
   */
  static getDeleteURL(tartId = required()) {
    return this._deleteURLWithPk.replace('pk', tartId);
  }
  /**
   * 編集対象のTartのIDからURLを取得
   * @param {String} tartId 編集対象のTartのID
   * @returns {String} 編集用URL
   */
  static getEditURL(tartId = required()) {
    return this._editURLWithPk.replace('pk', tartId);
  }
  /**
   * TartのIDからTart詳細ページへのURLを取得
   * @param {String} tartId TartのID
   * @returns {String} 詳細ページのURL
   */
  static getDetailURL(tartId = required()) {
    return this._detailURLWithPk.replace('pk', tartId);
  }
  /**
   * 特定のTartのデータを取得するURL
   * @param {String} tartId 取得対象のTartのID
   * @returns {String} 取得用URL
   */
  static getRetrieveURL(tartId = required()) {
    return this._retrieveURLWithPk.replace('pk', tartId);
  }
  /**
   * 表示ユーザー名からプロフィールのURLを取得
   * @param {String} displayUsername ユーザー名
   * @returns {String} プロフィールURL
   */
  static getProfileURL(displayUsername = required()) {
    return this._profileURLWithUsername.replace('username', displayUsername);
  }
  /**
   * フォロー解除したいユーザーのUuidから解除用URLを取得
   * @param {String} followerUuid フォロー解除したいユーザーのUuid
   * @returns {String} フォロー解除用URL
   */
  static getFollowDestroyURL(followerUuid = required()) {
    return this._followDestroyURLWithUuid.replace('00000000-0000-0000-0000-000000000000', followerUuid);
  }
  /**
   * @type {Boolean} ユーザーprofileページかどうか
   */
  static get pageIsProfile() {
    return this.mode === 'profile';
  }
  /**
   * @type {Boolean} ユーザーリスト表示ページかどうか
   */
  static get pageIsUserList() {
    return this.mode === 'userlist';
  }
  /**
   * @type {Boolean} Tart詳細ページかどうか
   */
  static get pageIsDetail() {
    return this.mode === 'detail';
  }
  /**
   * @type {Boolean} Tartをリスト表示または詳細ページする部分があるかどうか
   */
  static get pageIsTartListOrDetail() {
    return this.pageIsDetail || this.pageIsProfile || this.mode === 'home' || this.mode === 'global'
  }
}
