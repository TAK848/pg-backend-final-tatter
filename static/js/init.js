'use strict';
window.addEventListener("DOMContentLoaded", () => {
  TatterJsData.init();
  if (TatterJsData.pageIsTartListOrDetail) LoadTart.init();
  ComposeTart.init();
  Follow.init();
  window.addEventListener('pageshow', (event) => {
    if (performance.getEntriesByType("navigation")[0].type === 'back_forward' || event.persisted) location.reload();
  });
}, false);
