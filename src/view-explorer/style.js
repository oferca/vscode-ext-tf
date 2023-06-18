module.exports.style= `
#main-button{
    max-width: 300px;
    width: 100%;
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
}
#main-button:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
}

#main-button:active {
    background-color: --vscode-textLink-activeForeground;
}
#main-button.display{
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
.command:hover {
    background-color: var(--vscode-button-hoverBackground);
}
.command:active {
    background-color: --vscode-textLink-activeForeground;
}
.command.display{
    background-color: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
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
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .button:hover {
    background-color: #005A9E;
  }
`