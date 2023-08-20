const vscode = require('vscode');

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
.button.output1, #quicklaunch-menu{
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}
.button.output1{
  position: absolute;
  top: 0px;
}
.explorer .button.output1{
  position: inherit;
}
.button.output1.chat-gpt{
  top: 35px;
}
.button.output1.chat-gpt .disabled, .button.output1 .disabled{
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
#snackbar.warning-disabled {
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
    margin: 3px 7px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--vscode-button-border,transparent);
    line-height: 18px;
    font-size: 14px;
    min-width: 147px;
    box-shadow: 0.5px 0.5px 1px var(--vscode-button-separator);
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
    align-items: top;
    flex-wrap: wrap;
    margin: 42px auto 20px;
  }
  .commands-title{
    position: absolute;
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
  h4.title.env-vars{
    text-align: left;
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

  #project-title{
    position: absolute;
    margin-top: 51px;
    left: 45px;
    opacity: 0.9;
    transition: 0.5s all;
    z-index: 99;
  }

  #project-info li.path, #project-info li.workspace{
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
    --size: 50px;
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
    right: 9vw;
    margin-top: 20px;
  }

  #output-file-fs{
    position: absolute;
    margin-top: -53px;
    margin-left: 5px;
    font-size: 55px;
    color: var(--vscode-button-background)
    transition: 0.5s opacity;
    opacity: 0.05;
    width: 95%;
    cursor: pointer;
  }
  #output-file-fs.matrix{
    display: none;
  }
  #output-file-fs:hover{
    opacity: 1;
    transition: 0.5s opacity;

  }
 
  .seperator{
    width: 63vw;
    border-bottom: 1px var(--vscode-notifications-border) solid;
    height: 3px;
    margin: 12px 0px;
  }
  .seperator-container {
    display: flex;
    justify-content: left;
  }
  





.wrapper {
  display: inline-flex;
  list-style: none;
}

.wrapper .icon {
  position: absolute;
  background: transparent;
  border-radius: 50%;
  padding: 15px;
  margin: 10px;
  width: 50px;
  height: 50px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  margin-top: -250px;
  margin-left: -225px;
}

.wrapper .tooltip {
  position: absolute;
  top: 0;
  font-size: 14px;
  background: #ffffff;
  color: #ffffff;
  padding: 5px 8px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .tooltip::before {
  position: absolute;
  content: "";
  height: 8px;
  width: 8px;
  background: #ffffff;
  bottom: -3px;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.wrapper .icon.activated .tooltip {
  top: -45px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.wrapper .icon.activated span,
.wrapper .icon.activated .tooltip {
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}


.wrapper .instagram.activated .tooltip,
.wrapper .instagram.activated .tooltip::before {
  background: #E4405F;
  color: #ffffff;
}
.wrapper .instagram:hover, .wrapper .icon:hover span{
  background: transparent;
}

.wrapper .intro.activated .tooltip,
.wrapper .intro.activated .tooltip::before {
  background: #3ad959;
  color: black;
}

.wrapper .intro:hover, .wrapper .icon:hover span{
  background: transparent;
}

u.logs{
  cursor: pointer;
  font-weight: 500;
}

`