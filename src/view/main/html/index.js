const vscode = require('vscode');

const { style } = require("../style")
const { style : explorerStyle } = require("../style/explorer")
const { animatedButtonStyle } = require("../style/animated-button")
const { html: getExplorerHTML } = require("./explorer")
const { scripts: explorerScripts } = require("./explorer")

module.exports.html = (preferences, actions, invalidate, planSucceded, tfCommand, completed, commandLaunched, explorerParams, selectedProjectJson = "") => {
  const isPlanCompleted = completed && tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1,
    disableLogsButton =  !tfCommand || (tfCommand.toLowerCase().indexOf("output") > -1 || tfCommand.toLowerCase().indexOf("apply") > -1 ),
    isExplorer = !!explorerParams,
    projectInfoStyle = `style="display: ${isExplorer ? 'block' : 'none'};"`,
    modalParentStyle = `style="${completed ? 'display: block;' : ''}"`,
    explorerHTML = isExplorer ? getExplorerHTML(explorerParams, completed) : '',
    modalAnimated = !completed ? 'animated' : '',
    warningHTML = preferences.showWarning ? '<br><br><div class="title prefs warning">Preferences Active</div>' : "",
    disableLogs = disableLogsButton ? "disabled" : "",
    disabledButtonLogs = disableLogsButton ? "disabled" : "animated-button-text",
    logsButtonText = tfCommand ? tfCommand.charAt(0).toUpperCase() + tfCommand.slice(1): "Watch",
    isChatGPTDisabled = isPlanCompleted && planSucceded ? "" : "disabled",
    chatGPTTitle = isPlanCompleted && planSucceded ? "Copy output to clipboard and open ChatGPT" : "To enable, click 'Plan' to run successful terraform plan.",
    chatGPTAnimation = isPlanCompleted && planSucceded ? "animated-button-text" : "disabled",
    credentials = isExplorer ? `<textarea id="credentials" name="credentials" rows="5" cols="40" placeholder="Enter credentials script. For example:\n\n$Env:AWS_ACCESS_KEY_ID=... ; \n$Env:AWS_SECRET_ACCESS_KEY=..."></textarea>` : ""
    x = isExplorer ? `<span class="x">&times;</span>` : ""
    return `
<html>
<head>
  <style>
    ${style}
    ${animatedButtonStyle}
    ${isExplorer && explorerStyle }
  </style>
</head>
<body class="${isExplorer ? "explorer" : '' }" >
${ explorerHTML }
  <div class="modal-parent" ${modalParentStyle}>
    <div id="main-modal" class="modal ${modalAnimated}"">
      <div id="project-info" ${projectInfoStyle}>
      </div>
      <div id="top-container" class="${invalidate}">
        <h2 id="intro" ><div class="content">Click To Run Terraform</div></h2>
        ${warningHTML}
        <div id="display-output-2" class="button-container" style="display:none;" >
            <button id="watch-logs-button" class="button output ${disableLogs} " onclick="postMessage(\'openOutputFile\', IS_EXPLORER)">
              <div id="watch-logs" class="${disabledButtonLogs}" onclick="this.classList.remove('animated-button-text')">${logsButtonText} Logs</div>
            </button>
            <button class="button output chat-gpt ${isChatGPTDisabled}" onclick="this.classList.remove('animated-button-text');postMessage(\'chat-gpt\', IS_EXPLORER)" title="${chatGPTTitle}">
              <div id="chat-gpt" class="${chatGPTAnimation}" onclick="this.classList.remove('animated-button-text')">ChatGPT Synopsis</div>
            </button>
        </div>
          ${x}
        </div>

        <div id="main-container">
          <div class="button-container">
          <div class="expandable">
          ${ actions.map(action => {
            if (action.menuOnly) return
            const type = action.label.indexOf("Apply") > -1 ? "warning" : ""
            if (action.handler) return (`
            <div
              href="#"
              class="button command"
              title="Run Terraform ${action.label.replace(" -", " with ")} in terminal"
              onclick="launchTFCommand('${action.label}', this)"
              >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            ${action.label}
            </div>
          
            `)
          if (action.kind === -1 ) return ('</div><div class="expandable"><h4 class="title">' + action.label + '</h4>' )
        }).join("")}
        </div>
        </div>
        </div>
      <div class="prefs">
            <div class="pref-container" ><div class="pref clear"><a class="pref-change" onclick="vscode.postMessage({ tfCommand: 'Clear preferences', isExplorer: IS_EXPLORER })"> Clear preferences </a></div></div>
            <div class="pref-container"><div class="pref select-folder">${preferences.folder ? "Folder selected." : ""}</div><a class="pref select-folder pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfFolder").label}', isExplorer: IS_EXPLORER})")> ${preferences.folder ? "change" : "Select folder"} </a></div>
            <div class="pref-container"><div class="pref credentials">${preferences.credentials ? "Credentials set." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfCredentials").label}', isExplorer: IS_EXPLORER })"> ${preferences.credentials ? "change" : "Enter credentials"} </a></div>
          </div>
          ${credentials}
        <br>
    </div>
  </div>
  <script>
  ${ commandLaunched ? "showLogsButton(\""+tfCommand+"\");" : ""}
  const vscode = acquireVsCodeApi();
  
    function getCredentials() {
      return document.getElementById("credentials").value
    }
    function postMessage(command) {
      const credentials = getCredentials() 
      vscode.postMessage({
        command,
        isExplorer: IS_EXPLORER,
        CURRENT_PROJECT,
        credentials
      });
    }
    function showLogsButton (tfCommand) {
      document.getElementById("intro").classList.add('no-animation');
      document.getElementById("display-output-2").style.display = "flex"
      
      const disableLogsButton =  !tfCommand || (tfCommand.toLowerCase().indexOf("output") > -1 || tfCommand.toLowerCase().indexOf("apply") > -1 )
      document.getElementById("watch-logs").classList.remove("disabled")
      document.getElementById("watch-logs-button").classList.remove("disabled")
      document.getElementById("watch-logs").classList.add(disableLogsButton ? "disabled" : "animated-button-text")

      if (tfCommand !== "undefined"){
        document.getElementById("watch-logs").innerHTML = 'Watch ' + tfCommand.charAt(0).toUpperCase() + tfCommand.slice(1) + ' Logs'
      }
    }
    function launchTFCommand(tfCommand, el) {
      const credentials = getCredentials()
      el.classList.add('animated-button');
      showLogsButton(tfCommand)
      vscode.postMessage({
        tfCommand,
        isExplorer: IS_EXPLORER,
        CURRENT_PROJECT,
        credentials});
    }
    ${isExplorer && explorerScripts(selectedProjectJson) }
  </script>
</body>
</html>
`
};