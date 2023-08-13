const vscode = require('vscode');
const { style } = require("../style")
const { style : explorerStyle } = require("../style/explorer")
const { animatedButtonStyle } = require("../style/animated-button")
const { html: getExplorerHTML } = require("./explorer")
const { scripts: explorerScripts } = require("./explorer");
const { capitalizeFirst } = require('../../../shared/methods');
const { additionalText } = require('../../../shared/constants');
const { createShellHandler } = require("../../../shared/methods-cycle");

module.exports.html = (preferences, actions, invalidate, planSucceded, tfCommand, completed, withAnimation, commandLaunched, explorerParams, selectedProject, context, stateManager, _outputFileContent, _missingCredentials) => {
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
    credentials = isExplorer ? `<br><textarea id="credentials" name="credentials" rows="5" cols="40" placeholder="[Optional] Enter credentials script. For example:\n\n$Env:AWS_ACCESS_KEY_ID=... ; \n$Env:AWS_SECRET_ACCESS_KEY=..."></textarea>` : "",
    last = `
    <div class="expandable" id="display-output-2" style="display:none;">
      <h4 class="title">Result</h4>
      <button id="watch-logs-button" class="command button output ${disableLogs} " onclick="postMessageFromWebview(\'openOutputFile\', IS_EXPLORER)">
        <div id="watch-logs" class="${disabledButtonLogs}" onclick="this.classList.remove('animated-button-text')">${logsButtonText} Logs</div>
      </button>
      <button class="command button output chat-gpt ${isChatGPTDisabled}" onclick="this.classList.remove('animated-button-text');postMessageFromWebview(\'chat-gpt\', IS_EXPLORER)" title="${chatGPTTitle}">
        <div id="chat-gpt" class="${chatGPTAnimation}" onclick="this.classList.remove('animated-button-text')">ChatGPT Synopsis</div>
      </button>
    </div>

    `,
    missingCredentials = credentials.length && _missingCredentials ? `setTimeout(() => {
      const credentials = document.getElementById("credentials")
      if (!credentials) return
      credentials.scrollIntoView({ behavior: "smooth" })
      credentials.classList.toggle("blinking-border")
      setTimeout(() => credentials.classList.toggle("blinking-border"), 5000)
    })` : ""
    outputContent = _outputFileContent ? _outputFileContent + (completed ? additionalText : "") : "",
    outputFileContent = isExplorer ? `<textarea disabled id="output-file" name="output-file" rows="7" >${completed ? outputContent : ""}</textarea><div onclick="postMessageFromWebview(\'openOutputFile\', IS_EXPLORER)" id="output-file-fs">&#x2922;</div>` : ""
    overlayClass = completed ? 'active' : ""
    overlayCall = completed && isExplorer ? "document.querySelector('.modal-parent').style.display == 'block' ? addOverlay() : removeOverlay()" : ""
    shellHandler = createShellHandler(vscode.window.activeTerminal),
    projectPathSynthesized = shellHandler.synthesizePath((selectedProject || {}).projectPath),
    circularPBStyle = "--size: 25px; --value: 0; display: none;" // "--value: 100;" + completed ? "" : "display: none;",
    seperator= isExplorer ? `<div class="seperator-container" ><div class="seperator" ></div></div>` : "",
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
<body class="${isExplorer ? "explorer" : "sidebar" } ${invalidate}" >
<div id="overlay" class="${overlayClass}"></div>

${ explorerHTML }
  <div class="modal-parent" id="modal-container" ${modalParentStyle}>
    <div id="main-modal" class="modal ${modalAnimated}"">
    <h1 id="project-title"></h1>
    ${outputFileContent}
    ${seperator}
      <div id="project-info" ${projectInfoStyle}>
      </div>
      ${seperator}

      <div id="circular-pb" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="${circularPBStyle}"></div>

        ${warningHTML}
        
          ${x}
        <div id="main-container">
          <div class="button-container">
            <div class="expandable">
            ${ actions.concat("last").map(action => {
              if (action === "last") return last
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
            if (action === "last") return last

          }).join("")}

      </div>
        </div>
        </div>
      <div class="prefs">
            <div class="pref-container" ><div class="pref clear"><a class="pref-change" onclick="vscode.postMessage({ tfCommand: 'Clear preferences', isExplorer: IS_EXPLORER })"> Clear preferences </a></div></div>
            <div class="pref-container"><div class="pref select-folder">${preferences.folder ? "Folder selected." : ""}</div><a class="pref select-folder pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfFolder").label}', isExplorer: IS_EXPLORER})")> ${preferences.folder ? "change" : "Select folder"} </a></div>
            <div class="pref-container"><div class="pref credentials">${preferences.credentials ? "Credentials set." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfCredentials").label}', isExplorer: IS_EXPLORER })"> ${preferences.credentials ? "change" : "Enter credentials"} </a></div>
          </div>
          ${seperator}
          ${credentials}
        <br>
    </div>
  </div>
  <script>
  // Handle the message inside the webview
  var currentScrollTop = 0
  var scrollInterval = undefined
  scrollOutputDown(false)
  setTimeout(() => {
    const checkbox = document.getElementById("myCheckbox")
    if (checkbox) checkbox.scrollIntoView({ behavior: "smooth" })}
    )
  ${missingCredentials}
  function scrollOutputDown(animated = true) {
    if (scrollInterval) return

    const content = document.getElementById("output-file")
    if (!content) return
    const animatedScroll = () => {
      currentScrollTop = currentScrollTop + 2;
      content.scrollTop = currentScrollTop
      if (currentScrollTop < content.scrollHeight) return
      clearInterval(scrollInterval)
      scrollInterval = undefined
    }

    if (animated) scrollInterval = setInterval(animatedScroll, 0.25)
    if (!animated) content.scrollTop = content.scrollHeight

    if (!content.value || content.value.length < 60) return
    content.style.backgroundImage = "none"
    content.style.opacity = "1"
    document.getElementById("project-title").style.opacity = "0"
  }

  let maxPercentage = 0

  function updateCompletionPercentage(completionPercentage) {
    if (completionPercentage < maxPercentage) return
    maxPercentage = completionPercentage
    const circularProgressBar = document.getElementById("circular-pb")
    circularProgressBar.style = "--value: "+Math.floor(completionPercentage)+"; display: auto;"
    circularProgressBar.setAttribute("aria-valuenow", completionPercentage)
  }

  window.addEventListener('message', event => {
    const { completionPercentage, outputFileContent } = event.data
    if (completionPercentage) setTimeout(() => updateCompletionPercentage(completionPercentage))
    if (!outputFileContent) return
    document.getElementById("project-title").style.opacity = "0"
    const content = document.getElementById("output-file")
    content.value = event.data.outputFileContent
    scrollOutputDown()
    content.style.backgroundImage = "none"
    content.style.opacity = "1"
  });
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
    function postMessageFromWebview(command) {
      const credentials = getExplorerCredentials()
 
      const message = {
        command,
        isExplorer: IS_EXPLORER,
        folder: CURRENT_PATH,
        credentials
      }
      vscode.postMessage(message);
    }
    function showLogsButton (tfCommand) {
      document.getElementById("display-output-2").style.display = "block"
      
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
      vscode.postMessage(message);

      let counter = 0
      const content = document.getElementById("output-file")
      content.value = ""
      const pleaseWaitInterval = setInterval(() => {
        const baseContent = "Initializing, please wait..."
        const outputStarted = content.value.indexOf(baseContent) === -1 && content.value.length > baseContent.length + 10
        if (outputStarted) return clearInterval(pleaseWaitInterval)
        let dots = counter == 1 ? "." : ( counter == 2 ? ".." : "")
        content.value = baseContent + dots
        if (counter > 2) counter = 0
        counter++
      }, 1000)

      content.style.backgroundImage = "none"
      document.getElementById("project-title").style.opacity = "0"
    }
    ${isExplorer && explorerScripts(selectedProject) }
  </script>

</body>
</html>
`
};