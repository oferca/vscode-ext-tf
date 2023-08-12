const vscode = require('vscode');
const path = require('path');

module.exports.style= context => `
#main-container{
  max-width: 200px;
  display: inline-flex;
}

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
.explorer .button.output{
  position: inherit;
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
    font-size: 14px;
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
    font-size: 14px;
    text-align: center;
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

  #project-info li.path{
    text-align: left;
  }

  .explorer #main-modal{
    text-align: left;
    background: var(--vscode-settings-focusedRowBackground)
  }

  #overlay {
    z-index: -1;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    transition: 0.3s background;
  }
  #overlay.active{
    background: rgba(16, 18, 18, 0.96);
    z-index: 999;
    transition: 0.3s background;
  }

  .sidebar .expandable {
    margin-bottom: 10px;
  }
  
  @keyframes blink {
    0%, 50%, 100% {
      border: 1px solid transparent;
    }
    25%, 75% {
      border: 2px solid var(--vscode-inputValidation-errorBorder);
    }
  }
  
  .blinking-border {
    border: 2px solid transparent;
    animation: blink 3s infinite;
  }

  

  @keyframes progress {
    0% { --percentage: 0; }
    100% { --percentage: var(--value); }
  }
  
  @property --percentage {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }
  
  [role="progressbar"] {
    --percentage: var(--value);
    --primary: var(--vscode-button-background);
    --secondary: var(--vscode-button-secondaryBackground);
    --size: 60px;
    animation: progress 0.5s 0.5s forwards;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
  }
  
  [role="progressbar"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: conic-gradient(var(--primary) calc(var(--percentage) * 1%), var(--secondary) 0);
    mask: radial-gradient(white 55%, transparent 0);
    mask-mode: alpha;
    -webkit-mask: radial-gradient(#0000 55%, #000 0);
    -webkit-mask-mode: alpha;
  }
  
  [role="progressbar"]::after {
    counter-reset: percentage var(--value);
    content: counter(percentage) '%';
    font-family: Helvetica, Arial, sans-serif;
    font-size: calc(var(--size) / 5);
    color: var(--primary);
  }


  #circular-pb{
    position: absolute;
    right: 6vw;
    top: 83px;
  }

  #output-file-fs{
    position: absolute;
    margin-top: -53px;
    margin-left: 5px;
    font-size: 55px;
    color: var(--vscode-button-foreground)
    transition: 0.5s opacity;
    opacity: 0.05;
    width: 30%;
    cursor: pointer;
  }
  #output-file-fs:hover{
    opacity: 1;
    transition: 0.5s opacity;

  }
 

  
`