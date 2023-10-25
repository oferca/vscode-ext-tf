const vscode = require('vscode');

module.exports.style= context => `
#main-container{
  max-width: 200px;
  display: block;
}

#quicklaunch-menu{
    max-width: 300px;
    margin-top: 12px;
    width: 100%;
}
.tf-button.output1, #quicklaunch-menu{
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}
.tf-button.output1{
  position: absolute;
  top: 0px;
}
.explorer .tf-button.output1{
  position: inherit;
}
.tf-tf-button.output1.chat-gpt{
  top: 35px;
}
.button.output1.chat-gpt .disabled, .tf-button.output1 .disabled{
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
.tf-button {
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    transition: background-color 0.3s;
    letter-spacing: 0.5px;
    margin-block-start: 1em;
    box-sizing: border-box;
    display: flex;
    padding: 4px;
    margin: 1.8px 0;
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
    height: 26px;
    width: 200px;
  }

  .sidebar .button{
    margin-bottom: 4px;
  }
  body.sidebar{
    background: transparent;
    color: var(--vscode-button-foreground);
  }
  .sidebar .animated-button .spinner {
    width: 16px;
    margin-right: 4px;
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
    text-align: left;
    justify-content: center;
    align-items: center;
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
    justify-content: left;
    align-items: top;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .commands-title{
    position: absolute;
  }
  .commands-title.main{
    position: relative;
    display: block;
    margin: 0;
  }
  .tf-button:not(.disabled):hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
  
  .tf-button.command:not(.disabled):hover {
    background-color: var(--vscode-button-hoverBackground);
  }
  .tf-button.command{
    display: block;
    text-align: left;
    padding-left: 15px;
    margin-bottom: 4px;
  }
  .sidebar .tf-button.command.animated-tf-button .spinner{
    width: 12px;
    margin-right: 1px;
  }
  .sidebar .tf-button.command{
    padding-left: 21px !important;
    width: 120px !important;
    min-width: 97px !important;
  }
  .sidebar .tf-button.command.Explorer,
  .sidebar .tf-button.command.-var-file,
  .sidebar .tf-button.command.-upgrade,
  .sidebar .tf-button.command.Force-unlock,
  .sidebar .tf-button.command.-Target{
    text-align: center;
    padding-left: 0 !important;
    width: 135px !important;
  }
  .sidebar .tf-button.command.Explorer .spinner{
    display: none !important;

  }
  .sidebar .tf-button.command{
    padding-left: 31px;
  }
  body {
    font-family: Arial, sans-serif;
    text-align: center;
  }

  h2 {
    color: var(--vscode-foreground);
  }
  .animated-tf-button-text {
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

  #project-info li.path, #project-info li.workspace{
    text-align: left;
  }

  .explorer #main-tf-modal{
    text-align: left;
    background: var(--vscode-input-background);
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
  
  [role="progressbar1"] {
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
  
  [role="progressbar1"]::before {
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
  
  [role="progressbar1"]::after {
    counter-reset: percentage var(--value);
    content: counter(percentage) '%';
    font-family: Helvetica, Arial, sans-serif;
    font-size: calc(var(--size) / 5);
    color: var(--primary);
  }

  #tf-progress{
    margin-top: 5px;
    width: 97%;
    background: rgba(0, 0, 0, 0.25);
  }

  #output-file-fs{
    position: absolute;
    margin-top: -45px;
    margin-left: 24px;
    font-size: 48px;
    color: var(--vscode-button-background) transition: 0.5s opacity;
    opacity: 0.1;
    width: 95%;
    cursor: pointer;
    z-index: 99999;
  }
  #output-file-fs.shine{
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

#tf-modal-container{
  transition: 0.5s background;
}
.desc{
  font-size: 14px;
  margin-left: 5px;
  color: var(--vscode-editor-foreground);
}

.explorer .accordion {
  cursor: pointer;
  width: 100%;
  text-align: left;
  outline: none;
  color: rgb(255, 211, 226);
}
.explorer .accordion.parameters{
  margin-top: 15px;
}

.explorer .accordion::before{
  content: "► ";
  font-size: 11px;
}
.explorer .accordion.active::before{
  content: "▼ ";
  font-size: 11px;
}

.sidebar .accordion{
  display: none;
}

.explorer .tf-panel {
  overflow: hidden;
  height: 0px;
  transition: 0.25s all;
  text-align: left;
  align-items: flex-start;
  text-align: left;
  width: 100%;
}

.toggle-fullscreen{
  position: absolute;
  top: 4px;
  left: 45px; 
  font-size: 18px;
  text-shadow: var(--vscode-button-background) 1px 0px 10px;
  color: white;
}


/* Progress */

.container {
  width: 63vw;
  text-align: center;
}

.container .progress1 {
  margin: 0 auto;
  width: 62vw;
  text-align: left;
}

.progress1 {
  padding: 4px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
}

.progress-bar {
  height: 16px;
  border-radius: 4px;
	background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: -moz-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: -o-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  -webkit-transition: 0.4s linear;
  -moz-transition: 0.4s linear;
  -o-transition: 0.4s linear;
  transition: 0.4s linear;
  -webkit-transition-property: width, background-color;
  -moz-transition-property: width, background-color;
  -o-transition-property: width, background-color;
  transition-property: width, background-color;
  -webkit-box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
  width: 0%;
  text-align: right;
  padding-right: 5px;
  background-color: white !important;
  color: black !important;
}

/*
 * Note: using adjacent or general sibling selectors combined with
 *       pseudo classes doesn't work in Safari 5.0 and Chrome 12.
 *       See this article for more info and a potential fix:
 *       https://css-tricks.com/webkit-sibling-bug/
 */

#five:checked ~ .progress1 > .progress-bar {
  width: 5%;
  background-color: #f63a0f;
}

#twentyfive:checked ~ .progress1 > .progress-bar {
  width: 25%;
  background-color: #f27011;
}

#fifty:checked ~ .progress1 > .progress-bar {
  width: 50%;
  background-color: #f2b01e;
}

#seventyfive:checked ~ .progres1 > .progress-bar {
  width: 75%;
  background-color: #f2d31b;
}

#onehundred:checked ~ .progres1s > .progress-bar {
  width: 100%;
  background-color: #86e01e;
}

.btn.cmd {
  display: block;
  /*color: var(--vscode-button-foreground);*/
  font-size: 14px;
  min-width: 205px;
  margin: 8px 0px;
  text-align: left;
  position: relative;
}
.button-options{
  position: absolute;
  z-index: 999999999;
  width: 20px;
  opacity: 0;
  display: flex;
  text-align: right;
  flex-direction: column;
  margin-left: 176px;
  padding-left: 30px;
  margin-top: -6px;
  cursor: pointer;
  height: 45px;
}
.button-options .btn {
  min-width: 100px;
  max-width: 160px;
  margin: 3px 0;
  margin-top: 7px;
  visibility: hidden;
  transform: scale(0.1);
  opacity: 0;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.button-options:hover{
  width: 377px;
  opacity: 1;
  height: auto;
}
.button-options:hover .btn {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  opacity: 1;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: 185px;
  margin-left: 5px;
}
.btn.cmd i {
  opacity: 0.7;
}
.cmd-icon.right{
  z-index: 9999999;
  align-self: inherit;
  position: absolute;
  right: 8px;
  font-size: 14px;
  top: 10px;
}



.msg-icn {
  z-index: 9999;
  display: inline-block;
  position: fixed;
  padding: 10px 20px;
  color: #fff;
  box-sizing: border-box;
  max-width: 300px;
  min-width: 80px;
  min-height: 38px;
  bottom: 18px;
  left: 175px;
  background: #737373;
}
.msg-icn:before {
  z-index: 9999;
  color: orange;

  content: "";
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 1px solid #e5a002;
  border-radius: 2px;
  box-sizing: border-box;
  clip-path: polygon(0% 105%, 0% 0%, 105% 0%, 105% 105%, 43px 105%, 43px 80%, 21px 80%, 21px 105%);
}
.msg-icn:after {
  z-index: 9999;
  color: orange;
  content: "";
  position: absolute;
  display: block;
  width: 25px;
  height: 20px;
  background: #e5a002;
  top: calc(100% - 1px);
  left: 20px;
  box-sizing: border-box;
  clip-path: polygon(0 0, 0% 100%, 100% 0%, calc(100% - 2px) 0, 1px calc(100% - 2px), 1px 0);
}

`