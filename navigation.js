/* eslint-disable require-jsdoc */
gNumTyped = '';
gMaxNum=0;
gLastKeyPress = Date.now();

function highlightListItems() {
  try {
    document.getElementById('listitem'+gNumTyped).style.background =
        'lightgrey';
  } catch { }
  try {
    for (i=1; i<100; i++) {
      if (i != gNumTyped ) {
        document.getElementById('listitem'+i).style.background = 'transparent';
      }
    }
  } catch { }
}

// eslint-disable-next-line no-unused-vars
function addKeyListener() {
  document.addEventListener('keydown', function() {
    if (document.activeElement.tagName == 'INPUT' ||
        document.activeElement.tagName == 'TEXTAREA') {
      return;
    }

    if (event.ctrlKey) {
      return;
    }
    switch (event.code) {
      case 'Slash':
        window.location.assign('https://mjnurse.github.io/Search/index.html');
        break;
      case 'Backspace':
      case 'Delete':
        gNumTyped = gNumTyped.slice(0, -1);
        highlightListItems();
        break;
      case 'Escape':
        gNumTyped = '';
        highlightListItems();
        break;
      case 'Enter':
        if (gNumTyped != '') {
          window.location.assign(
              document.getElementById('listitem'+gNumTyped).href );
        }
        break;
      case 'KeyH':
        window.location.assign( '/index.html' );
        break;
      case 'KeyU':
        window.history.back();
        break;
      case 'ArrowDown':
        if (gNumTyped == '') {
          gNumTyped = '1';
        } else {
          if (parseInt(gNumTyped) < gMaxNum) {
            const tmpNum = parseInt(gNumTyped) + 1;
            gNumTyped = tmpNum.toString();
          }
        }
        highlightListItems();
        break;
      case 'ArrowUp':
        if (gNumTyped != '' && gNumTyped != '1') {
          const tmpNum = parseInt(gNumTyped) - 1;
          gNumTyped = tmpNum.toString();
        }
        if (gNumTyped == '0') {
          gNumTyped = '';
        }
        highlightListItems();
        break;
      // ### NAV KEY MAPPINGS ###
    }

    if (event.key >= '0' && event.key <= '9') {
      if ( (Date.now() - gLastKeyPress) > 500 ) {
        gNumTyped = event.key;
      } else {
        gNumTyped += event.key;
      }
      if (gNumTyped == '0') {
        gNumTyped = '';
      }
      gLastKeyPress = Date.now();
      highlightListItems();
    }
  });
}
