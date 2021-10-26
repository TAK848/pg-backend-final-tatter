'use strict';
/**
 * 生の文字列をHTML形式にエスケープして返す
 * @param {String} rawString 変換まえの生の文字列
 * @returns {String} HTMLにエスケープした文字列
 */
function escapeStringToHtml(rawString) {
  const word_split_re = /([\s<>"']+)/gi;
  const urlRegex = /((?:https?:\/\/)(?:(?:[A-Za-z0-9\-.]+[.:])|(?:www\.|[-;:&=+$,\w]+@))(?:[A-Za-z0-9.-]+)(?:[/\-+=&;%@.\w_~()]*)(?:[.!/\\\w-?%#~&=+()]*))/g;
  const emailRegex = /(^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$)/g;
  let words = rawString.split(word_split_re);
  let escapedText = '';
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (urlRegex.test(word)) {
      escapedText += word.replace(urlRegex, '<a href="$1" rel="nofollow" target="_blank">$1</a>');
    } else if (emailRegex.test(word)) {
      escapedText += word.replace(emailRegex, '<a href="mailto:$1">$1</a>');
    } else {
      word = word.replace(/\r?\n/g, '\n');
      escapedText += word.replace(/[&'`"<>\s\n]/g, function (match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
          ' ': '&nbsp;',
          '\n': '<br>',
        } [match]
      });
    }
  }
  return escapedText;
}
/**
 * Dateを表示形式のStringにして返す
 * @param {Date} time 変換したい日時
 * @returns {String} yyyy年mm月dd日hh:mm:ssの形式で返す
 */
function jsTimeToString(time) {
  return `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日${time.getHours()}:${("0"+time.getMinutes()).slice(-2)}:${("0"+time.getSeconds()).slice(-2)}`;
}
/**
 * キーからCookieの値を取得する
 * @param {String} name 取得したいCookieのキー名
 * @returns {String} Cookieの値
 */
function getCookie(name) {
  if (document.cookie && document.cookie !== '') {
    for (let cookie of document.cookie.split(';')) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
  }
  return null;
}

function outputError(error) {
  console.log(error);
}

function required() {
  throw new Error('引数が不足しています');
}
