'use strict';
/** Tart読み込み関係のクラス */
class LoadTart {
  static button;
  static firstLoadingFinished = false;
  static loadingTime;
  static init() {
    TartArticle.init();
    this.spinner = document.querySelector('.tart-load-spinner');
    this.statusParagraph = document.querySelector('.tart-status-message');
    this._load({
      time: 'new'
    });
    this.spinnerIsVisible = true;
    if (!TatterJsData.pageIsDetail) {
      LoadOldTart.init();
      LoadNewTart.init();
    }
  }
  /**
   * @param {Boolean} visible 可視性
   */
  static set spinnerIsVisible(visible) {
    if (visible) this.spinner.classList.remove('d-none');
    else this.spinner.classList.add('d-none');
  }
  /** 最新のTartの取得開始 */
  static loadNewTart() {
    LoadNewTart.loading = true;
    this.loadingTime = 'new';
    this._load('new');
  }
  /** 過去のTartの取得開始 */
  static loadOldTart() {
    if (this.loadingTime === null) {
      this.loadingTime = 'old';
      this._load('old');
    }
  }
  /** 
   * 詳細画面でない時：現在のTartリストが存在すればその中で一番新しいor古いTartのIDを取得し，それより新しいor古いTartのリストを取得。存在しなければ新しいTartのリストを取得 
   * 詳細画面なら当該Tartを取得
   */
  static _load(time) {
    const query = {};
    if (Tart.isOnTheList) {
      if (time === 'new') query.id_date__gt = Tart.newestTartId;
      else if (time === 'old') query.id_date__lt = Tart.oldestTartId;
    }
    if (TatterJsData.pageIsDetail) TartAjax.retrieveGet(TatterJsData.detailTartId, this._afterFetch.bind(this));
    else {
      if (TatterJsData.pageIsProfile) query.userUuid = TatterJsData.profileUser.uuid;
      query.mode = TatterJsData.mode;
      TartAjax.listGet(query, this._afterFetch.bind(this));
    }
  }
  /** Tartのリスト取得後の処理 */
  static _afterFetch(data) {
    if (data.status === 200) {
      if (TatterJsData.pageIsDetail) {
        Tart.createOrRenew(data.jsonBody);
      } else {
        for (const tartJson of data.jsonBody) {
          Tart.createOrRenew(tartJson);
        }
      }
      if (!this.firstLoadingFinished) this.afterFirstLoading(data);
      else if (this.loadingTime === 'old') {
        if (data.jsonBody.length === NUMBER_TO_LOAD_AT_A_TIME) {
          window.addEventListener('scroll', this.onReachBottom, false);
        } else {
          LoadOldTart.noMoreTart = true;
        }
      }
      LoadOldTart.loading = false;
      LoadNewTart.loading = false;
    } else if (data.status === 404) {
      this.statusParagraphText = 'Tartは存在しません。';
      this.spinnerIsVisible = false;
    } else console.log(`${data.status} ${data.statusText}`);
    this.loadingTime = null;
  }
  /** 初回自動ロードが終わった後の処理。取得ボタンを表示し，まだ古いTartがありそうなら下端に着いた時のロードトリガを設定する。 */
  static afterFirstLoading(data) {
    this.spinnerIsVisible = false;
    LoadNewTart.button.classList.remove('d-none');
    LoadOldTart.button.classList.remove('d-none');
    if (data.jsonBody.length === NUMBER_TO_LOAD_AT_A_TIME) window.addEventListener('scroll', this.onReachBottom, false);
    else LoadOldTart.noMoreTart = true;
    LoadNewTart.setUpdateCountGet();
    this.firstLoadingFinished = true;
  }
  /** 下端に到達したら，昔のTartを取得する */
  static onReachBottom(event) {
    if (LoadOldTart.button.getBoundingClientRect().top - window.innerHeight < 0) {
      LoadOldTart.onLoadOldTart(event);
    }
  }
  /**
   * @param {String} statusText 表示するメッセージのstring
   */
  static set statusParagraphText(statusText) {
    this.statusParagraph.classList.remove('d-none');
    this.statusParagraph.textContent = statusText;
  }
}

/** 過去のTartを読み込むクラス */
class LoadOldTart {
  static canLoadMore = true;
  static init() {
    this.button = document.querySelector('.tart-load-old');
    this.spinner = document.querySelector('.tart-load-old-spinner');
    this.statusParagraph = document.querySelector('p.tart-old-status');
    this.button.addEventListener('click', this.onLoadOldTart.bind(this), false);
  }
  /**
   * 過去のTartの読み込み中の設定
   * @param {Boolean} loadingStatus 過去のTartを読み込み中かどうか
   */
  static set loading(loadingStatus) {
    if (loadingStatus) {
      this.button.classList.add('disabled');
      this.spinner.classList.remove('d-none');
    } else {
      this.button.classList.remove('disabled');
      this.spinner.classList.add('d-none');
      this.button.blur();
    }
  }
  /** 下のロードボタンが見えたor押された時に発動する，古いTartロード用イベント */
  static onLoadOldTart() {
    if (LoadTart.loadingTime === null) {
      this.loading = true;
      LoadTart.loadOldTart();
      window.removeEventListener('scroll', LoadTart.onReachBottom, false);
    }
  }
  /**
   * @param {Boolean} noMoreTart これ以上古いTartがないならtrue
   */
  static set noMoreTart(noMoreTart) {
    if (noMoreTart) {
      this.button.classList.add('d-none');
      if (Tart.list.length !== 0) this.statusParagraphText = 'これ以上昔のTartはありません。';
      else this.statusParagraphText = 'まだTartが投稿されていません。';
    }
  }
  /**
   * @param {String} statusText 下端に表示するString
   */
  static set statusParagraphText(statusText) {
    this.statusParagraph.classList.remove('d-none');
    this.statusParagraph.textContent = statusText;
  }
}

/** 新規Tartを読み込むクラス */
class LoadNewTart {
  static init() {
    this.button = document.querySelector('.tart-load-new');
    this.spinner = document.querySelector('.tart-load-new-spinner');
    this.badge = document.querySelector('.tart-load-new-badge');
    this.button.addEventListener('click', this.onLoadNewTart.bind(this), false);
  }
  /** 
   * 新規Tartの読み込み中の設定
   * @param {Boolean} loadingStatus 新規Tartを読み込み中かどうか
   */
  static set loading(loadingStatus) {
    if (loadingStatus) {
      this.button.classList.add('disabled');
      this.spinner.classList.remove('d-none');
      LoadNewTart.updateBadge(0);
    } else {
      this.button.classList.remove('disabled');
      this.spinner.classList.add('d-none');
    }
    this._loading = loadingStatus;
  }
  /** 現在新規Tartをロード中かどうか */
  static get loading() {
    return this._loading;
  }
  /** 新しいTartをeventから取得する */
  static onLoadNewTart() {
    if (LoadTart.loadingTime === null) {
      LoadTart.loadNewTart();
    }
  }
  /** 新規Tartがcount件以上あることを示すバッジをつける */
  static updateBadge(count) {
    if (count === 0) {
      this.badge.classList.add('invisible');
    } else if (!this.loading) {
      this.badge.classList.remove('invisible');
      this.badge.textContent = `${count}+`;
    }
  }
  /** 周期的に新規Tartの件数のみをapiから取得するトリガを設定 */
  static setUpdateCountGet() {
    this.updateCountTimeout = setTimeout(this.updateCountGet, CHECK_UPDATE_INTERVAL_MS);
  }
  /** 新規Tartの件数を取得 */
  static updateCountGet() {
    const params = {
      id_date__gt: Tart.newestTartId,
    };
    if (TatterJsData.pageIsProfile) params['userUuid'] = TatterJsData.profileUser.uuid;
    params['mode'] = TatterJsData.mode;
    TartAjax.checkUpdateGet(params, LoadNewTart.onUpdateCountGet);
  }
  /** 新規Tartの件数取得apiにアクセス後 */
  static onUpdateCountGet(data) {
    if (data.status === 200) {
      LoadNewTart.updateBadge(data.jsonBody.count);
      setTimeout(LoadNewTart.updateCountGet, CHECK_UPDATE_INTERVAL_MS);
    } else console.log(`${data.status} ${data.statusText}`);
  }
}
