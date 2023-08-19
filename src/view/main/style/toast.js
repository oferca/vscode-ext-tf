module.exports.style = `
#snackbar {
    visibility: hidden;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 7px;
    position: fixed;
    top: 0px;
    width: auto;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
    max-height: 16px;
    display: table;
    font-weight: normal;
}
#snackbar.error{
    background-color: var(--vscode-editorMarkerNavigationError-background);
}
#snackbar.success{
    background-color: var(--vscode-terminalCommandDecoration-successBackground);
}
#snackbar.warning{
    background-color: var(--vscode-statusBarItem-warningBackground);
}
#snackbar.info{
    background-color: var(--vscode-editorMarkerNavigationInfo-background); 
}

#snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s;
  animation: fadein 0.5s;
}
#snackbar.show.completed{
    -webkit-animation: none;
  animation: none;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
`