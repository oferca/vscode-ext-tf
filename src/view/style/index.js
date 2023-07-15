module.exports.style= `
#quicklaunch-menu{
    max-width: 300px;
    margin-top: 12px;
    width: 100%;
}
.button.output, #quicklaunch-menu{
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}
.button.output{
  position: absolute;
  top: 0px;
}
.button.output.chat-gpt{
  top: 35px;
}
.button.output.chat-gpt .disabled, .button.output .disabled{
  color: var(--vscode-button-foreground);
  opacity: 0.5;
}


h4.output{
  position: absolute;
  top: 0px;
  margin: 15px;
}
#quicklaunch-menu:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
}

#quicklaunch-menu:active {
    background-color: --vscode-textLink-activeForeground;
}
#quicklaunch-menu.display{
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
}

.command.warning {
    background-color: var(--vscode-inputValidation-infoBackground);
    color: var(--vscode-badge-foreground);
}
.command {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
}
.command:not(.disabled):hover {
    background-color: var(--vscode-button-hoverBackground);
}
.command:active {
    background-color: --vscode-textLink-activeForeground;
}
.command.display{
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
}
.warning {
  color: red;
  font-weight: bold;
  top: 57px;
    display: block;
    position: absolute;
    width: 100%;
    left: 0px;
}
a.command:hover, a.command, a.command:focus {
  color: var(--vscode-button-foreground);
  text-decoration: none;
  outline: none;
}
.button {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    transition: background-color 0.3s;
    letter-spacing: 0.5px;
    margin-block-start: 1em;
    box-sizing: border-box;
    display: flex;
    padding: 4px;
    margin: 3px 5px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--vscode-button-border,transparent);
    line-height: 18px;
    min-width: 140px;
  }
  .pref-change{
    margin: 3px 5px;
    cursor: pointer;
  }
  .pref{
    width: 80%;
    text-overflow: ellipsis;
  }
  .pref-container{
    text-align: left;
    width: 100%;
  }
  .category{
    width: 80%;
    text-align: center;
    border-bottom: 0.5px solid var(--vscode-selection-background);
    margin-block-start: 1em;
    margin-block-end: 0.5em;
    margin: 12px auto 5px;
    padding: 3px;

  }
  .prefs a, .pref{
    display: inline;
  }
  .prefs a{
    font-style:italic;
  }
  .prefs{
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }
  p{
    text-align: center;
    justify-content: center;
    align-items: center;
    max-width: 300px;
  }
  .quick-launch{
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .quick-launch > *{
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .button:not(.disabled):hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
  
  .button.command:not(.disabled):hover {
    background-color: var(--vscode-button-hoverBackground);
  }
  

  body {
    font-family: Arial, sans-serif;
    text-align: center;
  }

  h2 {
    color: var(--vscode-foreground);
  }
  .animated-button-text {
    color: var(--vscode-button-foreground);
  }
  h2, .animated-button-text {
    animation: callToActionAnim 2s infinite;
    margin-bottom: 0px;
  }

  h2.no-animation{
    animation: none;
    opacity: 0;
  }

  h4.title:first-child{
    margin-top: 5px;
  }

  #top-container{
    height: 60px;
  }

  h4.title{
    width: 100%;
  }

  @keyframes callToActionAnim {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`
