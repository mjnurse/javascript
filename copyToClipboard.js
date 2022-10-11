/* eslint-disable require-jsdoc */
// eslint-disable-next-line no-unused-vars
function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value =
    ('gvim C:/MJN/github/drive/mjnurse-github-io/' + text).replace(/\//g, '\\');
  alert(el.value + ' copied to clipboard');
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
function copyPageNameToClipboard(text) {
  const el = document.createElement('textarea');
  el.value =
    ('gvim C:/MJN/drive/github/mjnurse-github-io/' + text).replace(/\//g, '\\');
  alert(el.value + ' copied to clipboard');
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
