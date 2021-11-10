'use strict';
/** いいね管理クラス */
class Like {
  constructor(article) {
    this.sending = false;
    this.article = article;
    this.likeButton = this.article.dom.querySelector('.tart-like');
    this.likeButton.style.cursor = 'pointer';
    this.counter = this.likeButton.querySelector('.tart-like-count');
    this.detailCounter = this.article.dom.querySelector('.tart-like-detail-count');
    this.icon = this.likeButton.querySelector('.tart-like-icon');
    this.iconFill = this.likeButton.querySelector('.tart-like-icon-fill');
    this.likeButton.addEventListener('click', this.onLikeClicked.bind(this));
    this.updateDom();
  }
  /** Tartクラスのインスタンスの最新値に更新する */
  updateDom() {
    this.liked = this.article.tart.liked;
    this.displayCount = this.article.tart.likeCount;
  }
  set liked(liked) {
    if (liked) {
      this.likeButton.classList.add('text-danger');
      this.icon.classList.add('d-none');
      this.iconFill.classList.remove('d-none');
      this.likeButton.classList.remove('text-muted');
    } else {
      this.likeButton.classList.remove('text-danger');
      this.icon.classList.remove('d-none');
      this.iconFill.classList.add('d-none');
      this.likeButton.classList.add('text-muted');
    }
  }
  onLikeClicked(event) {
    if (this.sending) return;
    this.sending = true;
    if (this.article.tart.liked) {
      LikeAjax.destroy(this.article.tart.id, this.afterUnliked.bind(this));
      this.liked = false;
      this.displayCount = this.article.tart.likeCount - 1;
    } else {
      LikeAjax.create(this.article.tart.id, this.afterLiked.bind(this));
      this.liked = true;
      this.displayCount = this.article.tart.likeCount + 1;
    }
  }
  set displayCount(count) {
    this.counter.textContent = count;
    this.detailCounter.textContent = count;
  }
  afterLiked(data) {
    if (data.status === 201) {
      this.article.tart.liked = true;
      this.article.tart.likeCount = data.jsonBody.tartLikeCount;
      this.updateDom();
    } else if (data.status === 400 || data.status === 409) {
      alert(data.detail);
    } else if (data.status === 404) {
      alert('いいねできませんでした');
    } else alert(`不明なエラー\nステータスコード:${data.status}`);
    this.sending = false;

  }
  afterUnliked(data) {
    if (data.status === 204) {
      this.article.tart.liked = false;
      this.article.tart.likeCount--;
      this.updateDom();
    } else if (data.status === 404) {
      alert('いいねを解除できませんでした');
    } else alert(`不明なエラー\nステータスコード:${data.status}`);
    this.sending = false;

  }
}
