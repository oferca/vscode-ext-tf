const vscode = require('vscode');
const { style } = require("../style")
const { style : explorerStyle } = require("../style/explorer")
const { style : toastStyle } = require("../style/toast")
const { animatedButtonStyle } = require("../style/animated-button")
const { html: getExplorerHTML } = require("./explorer")
const { scripts: explorerScripts } = require("./explorer");
const { createShellHandler } = require("../../../shared/methods-cycle");
const { success, error, warning, info } = require('./feedback');

module.exports.html = (preferences, actions, invalidate, planSucceded, tfCommand, completed, withAnimation, commandLaunched, explorerParams, selectedProject, context, stateManager, _outputFileContent, _missingCredentials, feedback) => {
  const isPlanCompleted = completed && tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1,
    isExplorer = !!explorerParams,
    projectInfoStyle = `style="display: ${isExplorer ? 'block' : 'none'}; margin-top: 20px;"`,
    modalParentStyle = `style="${completed ? 'display: block;' : ''}"`,
    explorerHTML = isExplorer ? getExplorerHTML(explorerParams, completed, withAnimation, stateManager) : '',
    modalAnimated = !completed ? 'animated' : '',
    warningHTML = preferences.showWarning && false ? '<div class="title prefs warning">Preferences Active</div>' : "",
    planSuccess = isPlanCompleted && planSucceded,
    credentials = isExplorer ? `<h4 class="title env-vars section-title">Environment Variables Script</h4><div class="desc">Set required variables here or in terminal.</div><br><textarea id="credentials" name="credentials" rows="5" cols="40" placeholder="Example script:\n\n$Env:AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE;\n$Env:AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY;\n..."></textarea>` : "",
    commandsTitle = isExplorer ? `<h4 title="Terraform Commands" id="commands-title" class="commands-title section-title">Run Commands</h4>` : ""
    isMissingCredentials = credentials.length && _missingCredentials && feedback && feedback.type === "error",
    missingCredentials = isMissingCredentials ? `setTimeout(() => {
      const credentials = document.getElementById("credentials")
      if (!credentials) return
      credentials.scrollIntoView({ behavior: "smooth" })
      credentials.classList.toggle("blinking-border")
      setTimeout(() => credentials.classList.toggle("blinking-border"), 5000)
    }, 1000)` : "",
    outputContent = _outputFileContent ? _outputFileContent : "",
    outputFileContent = isExplorer ? `<textarea disabled class="${feedback ? feedback.type + " feedback" : "matrix" }" id="output-file" name="output-file" rows="9" >${completed ? outputContent : ""}</textarea><div onclick="postMessageFromWebview(\'openOutputFile\', IS_EXPLORER)" id="output-file-fs" class="${!feedback ? "matrix" : "" }" >&#x2922;
    <div class="toggle-fullscreen">Full Screen</div></div>` : "",
    overlayClass = completed ? 'active' : "",
    overlayCall = completed && isExplorer ? "document.querySelector('.modal-parent').style.display == 'block' ? addOverlay() : removeOverlay()" : "",
    shellHandler = createShellHandler(vscode.window.activeTerminal),
    projectPathSynthesized = shellHandler.synthesizePath((selectedProject || {}).projectPath),
    tfPBStyle = "visibility: hidden;",
    seperator= isExplorer ? `<div class="seperator-container" ><div class="seperator" ></div></div>` : "",
    feedbackScript = feedback ? (
      feedback.type === "success" && success(feedback.msg, planSuccess) ||
      feedback.type === "info" && info(feedback.msg) ||
      feedback.type === "warning" && warning(feedback.msg) ||
      feedback.type === "error" && error(feedback.msg)
    ): "",
    x = isExplorer ? `<span class="x">&times;</span>` : ""
    let firstSeperator
    return `
<html>
<head>
  <style>
    ${style(isExplorer ? context : null)}
    ${animatedButtonStyle}
    ${isExplorer && explorerStyle }
    ${isExplorer && toastStyle }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script>
    const vscode = acquireVsCodeApi();
  </script>
</head>
<body class="${isExplorer ? "explorer" : "sidebar" } ${invalidate}" >
<div id="overlay" class="${overlayClass}"></div>

${ explorerHTML }
  <div class="modal-parent" id="modal-container" ${modalParentStyle}>
  <div id="snackbar"></div>
    <div id="main-modal" class="modal ${modalAnimated}"">
      <div id="project-info" class="project-block" ${projectInfoStyle}>
      </div>
      ${seperator}
        ${warningHTML}
          ${x}
        <div id="main-container" class="project-block">
        ${commandsTitle}
          <div class="button-container">
            <div class="expandable">
            ${ actions.map(action => {
              if (action.menuOnly) return
              if (action.excludeExplorer && isExplorer) return
              const type = action.label.indexOf("Apply") > -1 ? "warning" : ""
              if (action.handler) return (`
              <div
                href="#"
                class="button command ${action.label}"
                title="Run Terraform ${action.label.replace(" -", " with ")} in terminal"
                onclick="launchTFCommand('${action.label}', this)"
                >
                <div class="spinner">
                  <i class="fa fa-refresh fa-spin spinner"></i>
                </div>
              ${isExplorer ? "Terraform " : ""}${action.label}
              </div>          
              `)
            const strongSeperator = action.kind === -1 && (action.seperatorType !== "weak" || !isExplorer)
            const weakSeperator = action.kind === -1 && action.seperatorType === "weak" && isExplorer
            if (strongSeperator) {
              const seperatorClass = !firstSeperator ? "first" : ""
              firstSeperator = (firstSeperator || 0) + 1
              const terminal = isExplorer && (firstSeperator == 2) ? `<div class="expandable">${outputFileContent}</div>
              <div id="tf-progress" style="${tfPBStyle}" class="container">
                <div class="progress">
                  <div class="progress-bar" id="progress-bar" style="background-color: red;"></div>
                </div>
              </div>

              <div class="accordion desc parameters project-block">Actions With Parameters</div>
                <div class="panel">
              ` : "" 
              const actionLabel = isExplorer ? action.label.replace("Terraform Actions"," ") : action.label
              return (`</div><div class="expandable ${seperatorClass} seperator"></div>${terminal}<div class="expandable"><h4 class="title">` + actionLabel + '</h4>' )
            }
            if (weakSeperator) return ('<h4 class="title">' + action.label + '</h4>' )
          }).join("")}

          </div>
          </div>
        </div>
        </div>
          ${seperator}
          <div class="accordion desc project-block">Set Credentials</div>
            <div class="panel">
            <br>

              ${credentials}
          </div>
        <br>
    </div>
  </div>
  <script>
  // Handle the message inside the webview
  var currentScrollTop = 0
  var scrollInterval = undefined
  var demiElement = { value: {}, style: {}, classList: {add: () => {}, remove: () => {} } }
  scrollOutputDown(false)
  ${isExplorer ? `
    var acc = document.getElementsByClassName("accordion");
  var i;
  
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.height === "200px") {
        panel.style.height = "0px"
      } else {
        panel.style.height = "200px"
      }
    });
  }

  ` : ""}
  
  ${isMissingCredentials ? `
    const mouseoverEvent = new Event('mouseover');
    const credsTooltip = document.getElementById("creds-tooltip")
    credsTooltip && credsTooltip.classList.add("activated")
    document.body.onclick = () => credsTooltip && credsTooltip.remove()
  ` : ""}


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
  }

  let maxPercentage = 0

  function updateCompletionPercentage(completionPercentage) {
    if (completionPercentage < maxPercentage) return
    ${!isExplorer ? "return" : ""}
    maxPercentage = completionPercentage
    const tfProgressBar = document.getElementById("tf-progress")
    tfProgressBar.style = "display: auto;"
    const perc = Math.floor(completionPercentage)
    const progressBar = document.getElementById("progress-bar")
    let backgroundColor = "#86e01e"
    if (perc > 5) backgroundColor = "#f63a0f" 
    if (perc > 18) backgroundColor = "#f27011" 
    if (perc > 35) backgroundColor = "#f2b01e" 
    if (perc > 50) backgroundColor = "#f2d31bf" 
    if (perc > 65) backgroundColor = "#86e01e" 
    progressBar.style = "width: "+perc+"%;background-color:" + backgroundColor + ";"
  }

  window.addEventListener('message', event => {
    const { completionPercentage, outputFileContent } = event.data
    if (completionPercentage) setTimeout(() => updateCompletionPercentage(completionPercentage))
    if (!outputFileContent) return
    const content = document.getElementById("output-file")
    content.value = event.data.outputFileContent
    content.classList.remove("matrix")
    scrollOutputDown()
    content.style.backgroundImage = "none"
    content.style.opacity = "1"
  });
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
    function launchTFCommand(tfCommand, el) {
      setTimeout(() => {
        const outputArea = document.getElementById("output-file") || demiElement
        const outputAreaFS = document.getElementById("output-file-fs") || demiElement
        if (outputArea.classList.length) outputArea.classList.remove(...outputArea.classList);
        outputAreaFS.classList.remove("matrix");
        outputArea.classList.add("running")
        const mainModal = document.getElementById("main-modal")
      })
      const credentials = getExplorerCredentials()
      el.classList.add('animated-button');

      const message = {
        tfCommand,
        isExplorer: IS_EXPLORER,
        folder: CURRENT_PATH,
        credentials
      }
      vscode.postMessage(message);

      let counter = 0
      const content = document.getElementById("output-file") || demiElement
      content.value = ""
      const pleaseWaitInterval = setInterval(() => {
        const baseContent = "Initializing, please wait..."
        const outputStarted = content.value.indexOf(baseContent) === -1 && content.value.length > baseContent.length + 10
        if (outputStarted) return clearInterval(pleaseWaitInterval)
        let dots = counter == 1 ? "." : ( counter == 2 ? ".." : "")
        content.value = baseContent + dots
        if (counter > 2) counter = 0
        counter++
      }, 600)

      content.style.backgroundImage = "none"
    }
    ${isExplorer && explorerScripts(selectedProject) }

    ${feedbackScript}
  </script>

</body>
</html>
`
};