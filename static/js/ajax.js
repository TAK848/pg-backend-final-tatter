'use strict';
class Ajax {
  static request(url, method, {
    body = null,
    headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    credentials = 'same-origin',
  }) {
    const context = {
      method: method,
      credentials: credentials,
      headers: headers,
    }
    if (body) {
      context['body'] = JSON.stringify(body);
      context.headers['Content-Type'] = 'application/json';
    }
    return fetch(url, context);
  }
  static get(url, params = {}) {
    const query = new URLSearchParams(params);
    const fetchUrl = `${url}?${query}`
    return Ajax.request(fetchUrl, 'GET', {}).then(Ajax.returnStatusAndJsonBody);
  }
  static post(url, data) {
    return Ajax.request(url, 'POST', {
      body: data
    }).then(Ajax.returnStatusAndJsonBody);
  }
  static delete(url) {
    return Ajax.request(url, 'DELETE', {});
  }
  static patch(url, data) {
    return Ajax.request(url, 'PATCH', {
      body: data
    }).then(Ajax.returnStatusAndJsonBody);
  }

  static returnStatusAndJsonBody(response) {
    return response.json().then(data => ({
      status: response.status,
      statusText: response.statusText,
      jsonBody: data,
    }))
  }
}
