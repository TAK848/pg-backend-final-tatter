'use strict'

/** 取得したユーザー情報を管理するクラス */
class User {
  static userMap = new Map();
  constructor(userJsonData) {
    this.displayUsername = userJsonData.displayUsername;
    this.handleName = userJsonData.handleName;
    this.uuid = userJsonData.uuid;
    this.tartList = [];
  }
  /**
   * jsonDataのユーザーデータから，一致するものがあればインスタンスを取得し，なければ作成して返す
   * @param {Object} jsonData ユーザーのjsonデータ
   * @returns {User} 
   */
  static createOrGetUserInstance(jsonData) {
    if (this.userMap.has(jsonData.uuid)) {
      const instance = this.userMap.get(jsonData.uuid);
      if (instance.hasUpdate(jsonData)) instance.update(jsonData);
      return instance
    } else {
      const instance = new User(jsonData);
      this.userMap.set(jsonData.uuid, instance);
      return instance;
    }
  }
  /**
   * ユーザーのtartList（Array）にTartを追加する
   * @param {Tart} tart 追加したいTartインスタンス
   */
  addTartToList(tart) {
    this.tartList.push(tart);
  }
  /**
   * ユーザーのtartList（Array）からTartを削除する
   * @param {Tart} tart 削除したいTartインスタンス
   */
  removeTartFromList(tart) {
    this.tartList.splice(this.tartList.indexOf(tart), 1);
  }
  /**
   * ユーザー名とハンドル名に更新がないか確認する
   * @param {Object} checkUserJsonData ユーザーのjsonデータ
   * @returns {Boolean} 更新があるかないか
   */
  hasUpdate(checkUserJsonData) {
    return !(checkUserJsonData.displayUsername === this.displayUsername && checkUserJsonData.handleName === this.handleName);
  }
  /**
   * ユーザーの名前とハンドル名を，取得したjsonから取得し，UserデータとTartの表示を更新する
   * @param {Object} userJsonData ユーザーのjsonデータ
   */
  update(userJsonData) {
    this.displayUsername = userJsonData.displayUsername;
    this.handleName = userJsonData.handleName;
    for (const tart of this.tartList) {
      tart.article.dom.querySelector('.tart-handle-name').textContent = this.handleName;
      tart.article.dom.querySelector('.tart-display-username').textContent = this.displayUsername;
    }
  }
  /**
   * ログイン中のユーザーと一致しているか
   */
  get isRequestedUser() {
    return TatterJsData.requestedUser === this;
  }
}
