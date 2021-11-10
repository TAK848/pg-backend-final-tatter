'use strict';
/** Tartの実際のデータを管理するクラス */
class Tart {
  static list = [];
  static initialized = false;
  constructor(jsonData) {
    this.id = jsonData.id;
    this.text = jsonData.text;
    this.createdAt = jsonData.createdAt;
    this.wasEdited = jsonData.wasEdited;
    this.liked = jsonData.liked;
    this.likeCount = jsonData.likeCount;
    this.user = User.createOrGetUserInstance(jsonData.user);
    this.user.addTartToList(this);
    this.insertToStaticList();
    this.article = new TartArticle(this);
  }
  static createOrRenew(jsonData) {
    const instance = this.getInstanceFromTartId(jsonData.id);
    if (typeof instance === 'undefined') return new this(jsonData);
    else {
      instance.update(jsonData);
      return instance;
    }
  }
  /** Tartの日時順に並んだlist(静的プロパティ)の，適切な位置にTartインスタンスを挿入する */
  insertToStaticList() {
    if (Tart.list.length === 0) Tart.list.push(this);
    else {
      let flag = false;
      for (let i = 0; i < Tart.list.length; i++) {
        if (Tart.compareTartTime(this, Tart.list[i]) >= 0) {
          Tart.list.splice(i, 0, this);
          flag = true;
          break;
        }
      }
      if (!flag) Tart.list.push(this);
    }
  }

  /**
   * @type {Date} pythonから取得したcreatedAtをjavascriptのDateとして取得。ただし，ミリ秒までは残るがマイクロ秒は切り捨てられる
   */
  get jsCreatedAt() {
    return new Date(this.createdAt);
  }

  /**
   * @type {Number} Tartのlist(静的プロパティ)の何番目に位置するか
   */
  get tartListNo() {
    const that = this;
    return Tart.list.findIndex((value) => {
      return value === that;
    })
  }
  /**
   * IDからTartインスタンスを取得する
   * @param {String} id 取得したいTartのID
   * @returns {Tart} 取得できたTart
   */
  static getInstanceFromTartId(id) {
    return Tart.list.find((value) => {
      return value.id === id;
    });
  }
  /**
   * Tartの日時を比較し，前者が新しければ1を返し，古ければ-1を返す。万が一比較不能なら，idで比較する
   * @param {Tart} a  
   * @param {Tart} b 
   * @returns {Number}
   */
  static compareTartTime(a, b) {
    if (a.jsCreatedAt > b.jsCreatedAt) return 1;
    else if (a.jsCreatedAt < b.jsCreatedAt) return -1;
    else if (a.createdAt > b.createdAt) return 1;
    else if (a.createdAt < b.createdAt) return -1;
    else if (a.id > b.id) return 1;
    else if (a.id < b.id) return -1;
    else return 0;
  }
  /**
   * 取得したjsonからTartの中身を更新する
   * @param {Object} jsonData 取得したjsonデータ
   */
  update(jsonData) {
    this.text = jsonData.text;
    this.wasEdited = jsonData.wasEdited;
    this.article.update();
    this.liked = jsonData.liked;
    this.likeCount = jsonData.likeCount;
    this.article.like.updateDom();
  }
  /**
   * 当該Tartの表示・データを削除する
   */
  delete() {
    this.user.removeTartFromList(this);
    Tart.list.splice(Tart.list.indexOf(this), 1);
    this.article.remove();
    let instance = this;
    instance = null;
  }
  static get isOnTheList() {
    return this.list.length > 0;
  }
  static get newestTartId() {
    return this.list[0].id;
  }
  static get oldestTartId() {
    return this.list[this.list.length - 1].id;
  }
}

/** Tartの表示部分を担当するクラス。TartクラスとOneToOneFieldのように相互に接続している。 */
class TartArticle {
  static initialized = false;
  static init() {
    this.initialized = true;
    this.template = document.getElementById('tartTemplate');
    this.section = document.getElementById('tartList');
  }
  /**
   * Tartの描画機能を担当するインスタンスを作成
   * @param {Tart} tart 元となるTartインスタンス
   */
  constructor(tart) {
    if (!TartArticle.initialized) TartArticle.init();
    this.tart = tart;
    this.id = `tart-${this.tart.id}`;
    this.insert();

  }
  /** Tartのリストと同じ位置に，ArticleのDOMを挿入する（時系列が一致する） */
  insert() {
    TartArticle.section.insertBefore(this.createDom(), TartArticle.all.item(this.tart.tartListNo));
  }
  /** Tartのtextと編集済みかどうかをupdateする */
  update() {
    this.dom.querySelector('div.tart-body p.tart-text').innerHTML = escapeStringToHtml(this.tart.text);
    if (this.tart.wasEdited) this.dom.querySelector('.tart-edited').classList.remove('d-none');
  }
  /** TartのリストからArticleのDOMを削除し，instanceもnullにする */
  remove() {
    TartArticle.section.removeChild(this.dom);
    let instance = this;
    instance = null;
  }
  /**
   * @type {NodeList} タイムラインの全てのTartのDOMリスト
   */
  static get all() {
    return this.section.querySelectorAll('article.tart');
  }
  /** Tartのtemplateから，実際のDOMをTartのインスタンスに合わせて生成する */
  createDom() {
    const cloneArticle = TartArticle.template.content.cloneNode(true);
    this.dom = cloneArticle.querySelector('article');
    this.dom.id = this.id;
    this.tartBodyDom = this.dom.querySelector('div.tart-body');
    // 本文の設定
    const tartTextContentArea = this.dom.querySelector('div.tart-body p.tart-text');
    tartTextContentArea.innerHTML = escapeStringToHtml(this.tart.text);
    tartTextContentArea.setAttribute('data-tart-text', this.tart.text);
    // 投稿時間の設定
    const timeArea = this.dom.querySelector('div.tart-body time');
    timeArea.setAttribute('datetime', this.tart.createdAt);
    timeArea.textContent = jsTimeToString(this.tart.jsCreatedAt);
    // ユーザー情報の設定
    this.dom.querySelector('p.tart-handle-name').textContent = this.tart.user.handleName;
    this.dom.querySelector('p.tart-display-username').textContent = `@${this.tart.user.displayUsername}`;
    const tartUserUrl = TatterJsData.getProfileURL(this.tart.user.displayUsername);
    this.dom.querySelector('a.tart-user-link').href = tartUserUrl;
    // 編集済情報の設定
    if (this.tart.wasEdited) this.dom.querySelector('.tart-edited').classList.remove('d-none');
    // 本人のTartでなければ削除・編集メニューを削除
    if (this.tart.user.isRequestedUser) {
      this.delete = new TartDelete(this);
      this.edit = new TartEdit(this);
    } else {
      this.delete = null;
      this.edit = null;
      this.dom.querySelector('li.tart-delete').remove();
      this.dom.querySelector('li.tart-edit').remove();
    }
    // いいね機能
    this.like = new Like(this);
    // タイムライン表示の時は詳細情報リストを削除
    if (!TatterJsData.pageIsDetail) {
      this.dom.removeChild(this.dom.querySelector('ul.tart-detail-list'));
      this.setDetailPageListener();
    }
    return cloneArticle;
  }
  /** Tartクリック時の詳細ページへの移動の検知開始（テキスト選択と区別） */
  setDetailPageListener() {
    this.tartBodyDom.addEventListener('mousedown', this.onMouseDown, false);
    this.tartBodyDom.style.cursor = 'pointer';
  }
  /** Tartクリック時の詳細ページへの移動の検知解除（Tart編集時など） */
  resetDetailPageListener() {
    this.tartBodyDom.removeEventListener('mousedown', this.onMouseDown, false);
    this.tartBodyDom.style.cursor = 'auto';
  }
  /** マウスのボタンが押された時，クリックとマウスを動かした時のリスナをつけて文字選択を判別する */
  onMouseDown() {
    const instance = TartArticle.getInstanceFromComponent(event.target);
    instance.tartBodyDom.addEventListener('mousemove', instance.onTartBodyMouseMove, false);
    instance.tartBodyDom.addEventListener('click', instance.onTartBodyClick, false);
  }
  /** マウスのボタンを押した後，クリックもしくはマウスを動かしたらそれぞれのリスナを削除 */
  removeOnMouseDownListener() {
    this.tartBodyDom.removeEventListener('mousemove', this.onTartBodyMouseMove, false);
    this.tartBodyDom.removeEventListener('click', this.onTartBodyClick, false);
  }
  /** マウスを動かしたときは，文字選択と見做してクリック判定を無くす */
  onTartBodyMouseMove(event) {
    const instance = TartArticle.getInstanceFromComponent(event.target);
    instance.removeOnMouseDownListener();
  }
  /** クリック時に当該Tartの詳細ページへ移動 */
  onTartBodyClick(event) {
    const instance = TartArticle.getInstanceFromComponent(event.target);
    instance.removeOnMouseDownListener();
    location.href = TatterJsData.getDetailURL(instance.tart.id);
  }
  /**
   * TartのIDに一致するTartArticleのインスタンスを返す
   * @param {String} id 
   * @returns {TartArticle}
   */
  static getInstanceFromTartId(id) {
    return Tart.getInstanceFromTartId(id).article;
  }
  /** tart-付きのarticleについたIDをTart自体のIDにして（tart-を削除し）返す */
  static getTartIdFromArticleId(id) {
    if (id.indexOf('tart-') == 0) return id.slice(5);
    else return null;
  }
  /** TartのArticleのDOMからインスタンスを取得 */
  static getInstanceFromArticle(article) {
    return this.getInstanceFromTartId(this.getTartIdFromArticleId(article.id));
  }
  /** TartのArticle内の部品のDOMをもとにArticle全体のDOMを取得 */
  static getArticleFromComponent(element) {
    try {
      return element.closest('article');
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  /** TartのArticle内の部品のDOMをもとにTartインスタンスを取得 */
  static getInstanceFromComponent(component) {
    return this.getInstanceFromArticle(this.getArticleFromComponent(component));
  }
}
