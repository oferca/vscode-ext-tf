const { style } = require("../style")
const { style : explorerStyle } = require("../style/explorer")
const { animatedButtonStyle } = require("../style/animated-button")
const { html: explorerHTML } = require("./explorer")

module.exports.html = (preferences, actions, invalidate, planSucceded, tfCommand, completed, commandLaunched, explorerParams) => {
  const isPlanCompleted = completed && tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1
  const disableLogsButton =  !tfCommand || (tfCommand.toLowerCase().indexOf("output") > -1 || tfCommand.toLowerCase().indexOf("apply") > -1 )
  return `
<html>
<head>
  <style>
    ${style}
    ${animatedButtonStyle}
    ${explorerParams && explorerStyle }
  </style>
  <script>
    const vscode = acquireVsCodeApi();
    function postMessage(command) { 
      vscode.postMessage({ command });
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
      el.classList.add('animated-button');
      showLogsButton(tfCommand)
      vscode.postMessage({ tfCommand });
    }
  </script>
</head>
<body>
${explorerParams ? explorerHTML(explorerParams) : '' }
<div id="top-container" class="${invalidate}">
  <h2 id="intro" >Click To Run Terraform</h2>
  ${preferences.showWarning ? '<br><br><div class="title prefs warning">Preferences Active</div>' : ""}

  <div id="display-output-2" class="button-container" style="display:none;" >
    <button id="watch-logs-button" class="button output ${disableLogsButton ? "disabled" : ""} " onclick="postMessage(\'openOutputFile\')">
      <div id="watch-logs" class="${disableLogsButton ? "disabled" : "animated-button-text"}" onclick="this.classList.remove('animated-button-text')">${tfCommand ? tfCommand.charAt(0).toUpperCase() + tfCommand.slice(1): "Watch"} Logs</div>
    </button>
    <button class="button output chat-gpt ${isPlanCompleted && planSucceded ? "" : "disabled"}" onclick="this.classList.remove('animated-button-text');postMessage(\'chat-gpt\')" title="${isPlanCompleted && planSucceded ? "Copy output to clipboard and open ChatGPT" : "To enable, click 'Plan' to run successful terraform plan."}">
      <div id="chat-gpt" class="${isPlanCompleted && planSucceded ? "animated-button-text" : "disabled"}" onclick="this.classList.remove('animated-button-text')">ChatGPT Synopsis</div>
    </button>

    </div>
   
  </div>

  <div id="main-container">
    <div class="button-container">

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
    if (action.kind === -1 ) return ('<h4 class="title">' + action.label + '</h4>' )
  }).join("")}
  </div>
  </div>
 <div class="prefs">
      <div class="pref-container" ><div class="pref"><a class="pref-change" onclick="vscode.postMessage({ tfCommand: 'Clear preferences' })"> Clear preferences </a></div></div>
      <div class="pref-container"><div class="pref">${preferences.folder ? "Folder selected." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfFolder").label}' })")> ${preferences.folder ? "change" : "Select folder"} </a></div>
      <div class="pref-container"><div class="pref">${preferences.credentials ? "Credentials set." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfCredentials").label}' })"> ${preferences.credentials ? "change" : "Enter credentials"} </a></div>
    </div>
  <br>
  <script>
  ${ commandLaunched ? "showLogsButton(\""+tfCommand+"\");" : ""}
  </script>
</body>
</html>
`
};