const vscode = require('vscode');
const { style } = require("../style")
const { style : explorerStyle } = require("../style/explorer")
const { style : toastStyle } = require("../style/toast")
const { animatedButtonStyle } = require("../style/animated-button")
const { html: getExplorerHTML } = require("./explorer")
const { scripts: explorerScripts } = require("./explorer");
const { createShellHandler } = require("../../../shared/methods-cycle");
const { success, error, warning, info } = require('./feedback');
const { getCommandButtonsHTML } = require('./helpers')
const { getFunctions } = require("./functions")

module.exports.html = (preferences, actions, invalidate, planSucceded, tfCommand, completed, withAnimation, commandLaunched, explorerParams, selectedProject, context, stateManager, _outputFileContent, feedback) => {
  const isPlanCompleted = completed && tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1,
    isExplorer = !!explorerParams,
    modalParentStyle = `style="${completed ? 'display: block;' : ''}"`,
    explorerHTML = isExplorer ? getExplorerHTML(explorerParams, completed, withAnimation, stateManager) : '',
    modalAnimated = !completed ? 'animated' : '',
    warningHTML = preferences.showWarning && false ? '<div class="title prefs warning">Preferences Active</div>' : "",
    planSuccess = isPlanCompleted && planSucceded,
    commandsTitle = isExplorer ? `<h4 title="Terraform Commands" id="commands-title" class="commands-title display-4 main"></h4>` : ""
    outputContent = _outputFileContent ? _outputFileContent : "",
    outputFileContent = isExplorer ? `<textarea disabled class="${feedback ? feedback.type + " feedback" : "shine" }" id="output-file" name="output-file" rows="9" >${completed ? outputContent : `
    Select A Terraform Command`}</textarea><div onclick="postMessageFromWebview(\'openOutputFile\', IS_EXPLORER)" id="output-file-fs" class="${!feedback ? "shine" : "" }" >&#x2922;
    <div class="toggle-fullscreen">Full Screen</div></div>` : "",
    overlayClass = completed ? 'active' : "",
    overlayCall = completed && isExplorer ? "document.querySelector('.tf-modal-parent').style.display == 'block' ? addOverlay() : removeOverlay()" : "",
    shellHandler = createShellHandler(vscode.window.activeTerminal),
    projectPathSynthesized = shellHandler.synthesizePath((selectedProject || {}).projectPath),
    seperator= isExplorer ? `<div class="seperator-container" ><div class="seperator" ></div></div>` : "",
    feedbackScript = feedback ? (
      feedback.type === "success" && success(feedback.msg, planSuccess) ||
      feedback.type === "info" && info(feedback.msg, planSuccess) ||
      feedback.type === "warning" && warning(feedback.msg, planSuccess) ||
      feedback.type === "error" && error(feedback.msg)
    ): "",
    commandButtons = getCommandButtonsHTML(actions, isExplorer, outputFileContent, planSuccess)
    x = isExplorer ? `<span class="x">&times;</span>` : ""
    return `
<html>
<head>
  <style>
    ${style(isExplorer ? context : null)}
    ${animatedButtonStyle}
    ${isExplorer && explorerStyle }
    ${isExplorer && toastStyle }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <script>
      const vscode = acquireVsCodeApi();
    </script>
</head>
<body class="${isExplorer ? "explorer" : "sidebar" } ${invalidate}" >
<div id="overlay" class="${overlayClass}"></div>
${ explorerHTML }
  <div class="tf-modal-parent" id="tf-modal-container" ${modalParentStyle}>
  <div id="snackbar"></div>
    <div id="main-tf-modal" class="tf-modal ${modalAnimated}"">
        ${warningHTML}
          ${x}
        <div id="main-container" class="project-block">
        ${commandsTitle}
          <div class="button-container">
            <div class="expandable">
              ${ commandButtons }
            </div>
          </div>
        </div>
      </div>
          
        <br>
    </div>
  </div>
  <script>
    var currentScrollTop = 0
    var scrollInterval = undefined
    var demiElement = { value: {}, style: {}, classList: {add: () => {}, remove: () => {} } }
    scrollOutputDown(false)
    ${isExplorer ? `initAccordions()` : ""}
    
    setTimeout(scrollToCheckbox)    
    let maxPercentage = 0
    window.addEventListener('message', incomingMessageHandler);
    var IS_EXPLORER = null
    var CURRENT_PATH = "${projectPathSynthesized}"
    setTimeout(removeAnimation, 5000)
    
    ${overlayCall}
    ${isExplorer && explorerScripts(selectedProject) }
    ${feedbackScript}
    ${getFunctions(isExplorer)}
  </script>

</body>
</html>
`
};