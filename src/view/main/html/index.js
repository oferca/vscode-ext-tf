const vscode = require('vscode');
const { style } = require("../style")
const { style : explorerStyle } = require("../style/explorer")
const { animatedButtonStyle } = require("../style/animated-button")
const { html: getExplorerHTML } = require("./explorer")
const { scripts: explorerScripts } = require("./explorer");
const { capitalizeFirst } = require('../../../shared/methods');
const { createShellHandler } = require("../../../shared/methods-cycle");

module.exports.html = (preferences, actions, invalidate, planSucceded, tfCommand, completed, withAnimation, commandLaunched, explorerParams, selectedProject, context, stateManager) => {
  const isPlanCompleted = completed && tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1,
    disableLogsButton =  !tfCommand || (tfCommand.toLowerCase().indexOf("output") > -1 || tfCommand.toLowerCase().indexOf("apply") > -1 ),
    isExplorer = !!explorerParams,
    projectInfoStyle = `style="display: ${isExplorer ? 'block' : 'none'};"`,
    modalParentStyle = `style="${completed ? 'display: block;' : ''}"`,
    explorerHTML = isExplorer ? getExplorerHTML(explorerParams, completed, withAnimation, stateManager) : '',
    modalAnimated = !completed ? 'animated' : '',
    warningHTML = preferences.showWarning ? '<div class="title prefs warning">Preferences Active</div>' : "",
    disableLogs = disableLogsButton ? "disabled" : "",
    disabledButtonLogs = disableLogsButton ? "disabled" : "animated-button-text",
    logsButtonText = tfCommand ? capitalizeFirst(tfCommand): "Watch",
    isChatGPTDisabled = isPlanCompleted && planSucceded ? "" : "disabled",
    chatGPTTitle = isPlanCompleted && planSucceded ? "Copy output to clipboard and open ChatGPT" : "To enable, click 'Plan' to run successful terraform plan.",
    chatGPTAnimation = isPlanCompleted && planSucceded ? "animated-button-text" : "disabled",
    credentials = isExplorer ? `<br><textarea id="credentials" name="credentials" rows="5" cols="40" placeholder="[Optional] Enter credentials script. For example:\n\n$Env:AWS_ACCESS_KEY_ID=... ; \n$Env:AWS_SECRET_ACCESS_KEY=..."></textarea>` : ""
    overlayClass = completed ? 'active' : ""
    overlayCall = completed && isExplorer ? "document.querySelector('.modal-parent').style.display == 'block' ? addOverlay() : removeOverlay()" : ""
    shellHandler = createShellHandler(vscode.window.activeTerminal),
    projectPathSynthesized = shellHandler.synthesizePath((selectedProject || {}).projectPath),
    x = isExplorer ? `<span class="x">&times;</span>` : ""
    return `
<html>
<head>
  <style>
    ${style(isExplorer ? context : null)}
    ${animatedButtonStyle}
    ${isExplorer && explorerStyle }
  </style>
  <script>
    const vscode = acquireVsCodeApi();
  </script>
</head>
<body class="${isExplorer ? "explorer" : "sidebar" } " >
<div id="overlay" class="${overlayClass}"></div>

${ explorerHTML }
  <div class="modal-parent" id="modal-container" ${modalParentStyle}>
    <div id="main-modal" class="modal ${modalAnimated}"">
      <div id="project-info" ${projectInfoStyle}>
      </div>
      <div id="top-container" class="${invalidate}">
        <h2 id="intro" ><div class="content">Click Terraform Command</div></h2>
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
            if (action.excludeExplorer && isExplorer) return
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
          const strongSeperator = action.kind === -1 && (action.seperatorType !== "weak" || !isExplorer)
          const weakSeperator = action.kind === -1 && action.seperatorType === "weak" && isExplorer
          if (strongSeperator) return ('</div><div class="expandable"><h4 class="title">' + action.label + '</h4>' )
          if (weakSeperator) return ('<h4 class="title">' + action.label + '</h4>' )
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
    var IS_EXPLORER = null
    var CURRENT_PATH = "${projectPathSynthesized}"
    setTimeout(() => {
      const foldersList = document.getElementById("folders-list")
      if (!foldersList) return
      foldersList.classList.remove("animated")
      foldersList.style.animation = "none"
  }, 5000)
    function getExplorerCredentials() {
      const explorerCredentials = document.getElementById("credentials")
      if (!explorerCredentials) return
      return document.getElementById("credentials").value
    }
    ${overlayCall}
    function postMessage(command) {
      const credentials = getExplorerCredentials()
 
      const message = {
        command,
        isExplorer: IS_EXPLORER,
        folder: CURRENT_PATH,
        credentials
      }
      console.log("POSTING", message)
      vscode.postMessage(message);
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
      const credentials = getExplorerCredentials()
      el.classList.add('animated-button');
      showLogsButton(tfCommand)
      const message = {
        tfCommand,
        isExplorer: IS_EXPLORER,
        folder: CURRENT_PATH,
        credentials
      }
      console.log("POSTING", message)
      vscode.postMessage(message);
    }
    ${isExplorer && explorerScripts(selectedProject) }
  </script>

</body>
</html>
`
};