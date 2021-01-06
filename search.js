/* eslint-disable require-jsdoc */
// eslint-disable-next-line no-unused-vars
function search() {
  const searchTextBox = document.getElementById('searchInput');

  if (event.key == 'ArrowUp' ||
      event.key == 'ArrowDown' ||
      event.key == 'Escape' ||
      event.key == 'Enter' ) {
    searchTextBox.blur();
    gNumTyped = '1';
    highlightListItems();
  } else {
    const searchTerm = searchTextBox.value;
    const words = searchTerm.split(' ');
    const firstWord = words[0];
    const resultsJsonArray = index.search(searchTerm);
    let resultsHTML = '';
    for (let i = 0; i < resultsJsonArray.length; i++) {
      const obj = resultsJsonArray[i].doc;
      const body = obj.body.toUpperCase();
      const startPos = (
        ( body.indexOf(searchTerm.toUpperCase()) > 0 ) ?
        body.indexOf(searchTerm.toUpperCase()) :
        body.indexOf(firstWord.toUpperCase()) );
      let resultStr = obj.body.substr(startPos, 300);

      // eslint-disable-next-line guard-for-in
      for (w in words) {
        if (words[w].length > 1) {
          let word = words[w].charAt(0).toUpperCase() + words[w].substr(1);
          resultStr = resultStr.replace(word, '<b>'+word+'</b>');
          word = words[w].toUpperCase();
          resultStr = resultStr.replace(word, '<b>'+word+'</b>');
          word = words[w].toLowerCase();
          resultStr = resultStr.replace(word, '<b>'+word+'</b>');
        }
      }

      resultsHTML +=
          '<p><span style="color: grey">' + (i+1) +
          '</span>    <a id="listitem' + (i+1) +
          '" href="https://mjnurse.github.io/' + obj.url +
          '">' + obj.title +'</a></p>\n<p style="font-size: 90%">'+
          resultStr +
          '</p>\n';
    }
    document.getElementById('results').innerHTML = resultsHTML;
    gMaxNum = resultsJsonArray.length;
  }
}
