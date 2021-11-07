'use strict';
/** フォロー管理用クラス */
class Follow {
  static unfollowingInstance;
  static init() {
    if (document.querySelector('.profile-edit-button')) return;
    if (TatterJsData.pageIsProfile) {
      new Follow(document.querySelector('.user-follow-button'));
    } else if (TatterJsData.pageIsUserList) {
      this.userlistItems = document.querySelectorAll('.user-list .user-list-item');
      for (let i = 0, length = this.userlistItems.length; i < length; i++) {
        const userListIrem = this.userlistItems.item(i);
        userListIrem.style.cursor = 'pointer';
        userListIrem.addEventListener('click', () => {
          location.href = TatterJsData.getProfileURL(userListIrem.dataset['displayusername']);
        })
        const userFollowButton = userListIrem.querySelector('.user-follow-button')
        if (userFollowButton) new Follow(userFollowButton);
      }
    }
    if (TatterJsData.pageIsProfile || TatterJsData.pageIsUserList) {
      this.unfollowConfirmModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('unfollowConfirmModal'));
      const unfollowConfirmBtn = document.querySelector('.unfollow-submit');
      unfollowConfirmBtn.addEventListener('click', this.onFollowDestroyConfirmButtonClicked, false);
    }
  }
  constructor(followButton) {
    this.sending = false;
    this.followButton = followButton;
    if (TatterJsData.pageIsProfile) {
      this.followerUuid = TatterJsData.profileUser.uuid;
      this.followerDisplayUsername = TatterJsData.profileUser.displayUsername;
      this.followerCount = document.querySelector('.follower-count-number');
    } else if (TatterJsData.pageIsUserList) {
      this.followerUuid = this.followButton.dataset['useruuid'];
      this.followerDisplayUsername = this.followButton.dataset['userdisplayusername'];
    }
    if (this.followButton.classList.contains('follow')) {
      this.followButton.textContent = 'フォロー';
    } else if (this.followButton.classList.contains('unfollow')) {
      this.followButton.textContent = 'フォロー中';
    }
    this.followButton.addEventListener('click', this.onFollowButtonClicked.bind(this), true);
    this.followButton.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.followButton.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
  /** フォロー切り替えボタンが押された時の処理 */
  onFollowButtonClicked(event) {
    event.stopPropagation();
    if (!this.sending) {
      if (this.followButton.classList.contains('follow')) {
        this.sending = true;
        FollowAjax.create(this.followerUuid, this.afterFollow.bind(this));
      } else if (this.followButton.classList.contains('unfollow')) {
        Follow.unfollowingInstance = this;
        Follow.unfollowConfirmModal.show();
        document.querySelector('.unfollow-confirm-username').textContent = this.followerDisplayUsername;
      }
    }
  }
  /** フォロー解除確認モーダルのフォロー解除が実行された時 */
  static onFollowDestroyConfirmButtonClicked() {
    const instance = Follow.unfollowingInstance;
    if (!instance.sending) {
      instance.sending = true;
      FollowAjax.destroy(instance.followerUuid, instance.afterUnfollow.bind(instance));
    }
  }
  /** フォローした後のボタンなどの処理 */
  afterFollow(data) {
    if (data.status === 201) {
      if (TatterJsData.pageIsProfile) this.followerCount.textContent = data.jsonBody.followerCount;
      this.followButton.classList.add('unfollow');
      this.followButton.classList.add('btn-outline-dark');
      this.followButton.classList.remove('follow');
      this.followButton.classList.remove('btn-dark');
      this.followButton.textContent = 'フォロー中';
    } else if (data.status === 400 || data.status === 409) {
      alert(data.detail);
    } else alert(`不明なエラー\nステータスコード:${data.status}`);
    this.sending = false;
  }
  /** フォロー解除後のボタンなどの処理 */
  afterUnfollow(data) {
    if (data.status === 204) {
      if (TatterJsData.pageIsProfile) this.followerCount.textContent = Number(this.followerCount.textContent) - 1;
      Follow.unfollowConfirmModal.hide();
      this.followButton.classList.remove('unfollow');
      this.followButton.classList.remove('btn-outline-dark');
      this.followButton.classList.remove('btn-outline-danger');
      this.followButton.classList.add('follow');
      this.followButton.classList.add('btn-dark');
      this.followButton.textContent = 'フォロー';
    } else if (data.status === 404) {
      alert('フォローを解除できませんでした');
    } else alert(`不明なエラー\nステータスコード:${data.status}`);
    this.sending = false;
  }
  /** フォロー中にマウスカーソルを乗せるとフォロー解除表示をする */
  onMouseEnter() {
    if (this.followButton.classList.contains('unfollow')) {
      this.followButton.textContent = 'フォロー解除';
      this.followButton.classList.add('btn-outline-danger');
      this.followButton.classList.remove('btn-outline-dark');
    }
  }
  /** マウスカーソルが離れたらフォロー解除表示をフォロー中に戻す */
  onMouseLeave() {
    if (this.followButton.classList.contains('unfollow')) {
      this.followButton.textContent = 'フォロー中';
      this.followButton.classList.remove('btn-outline-danger');
      this.followButton.classList.add('btn-outline-dark');
    }
  }
}
