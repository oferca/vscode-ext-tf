const { style } = require("./style")
const { animatedButtonStyle } = require("./style/animated-button")

module.exports.html = (preferences, actions, invalidate, intro, tfCommand, completed) => `
<html>
<head>
  <style>
    ${style}
    ${animatedButtonStyle}
  </style>
  <script>
    const vscode = acquireVsCodeApi();
    function postMessage(command) { 
      vscode.postMessage({ command });
    }
    function showLogsButton (tfCommand) {
      document.getElementById("intro").classList.add('no-animation');
      document.getElementById("display-output-2").style.display = "flex"

      document.getElementById("watch-logs").classList.add("animated-button-text")
      setTimeout(() => document.getElementById("watch-logs").classList.remove("animated-button-text"), 300000)

      if (tfCommand !== "undefined"){
        document.getElementById("watch-logs").innerHTML = tfCommand.charAt(0).toUpperCase() + tfCommand.slice(1) + ' Logs'
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
<div id="top-container" class="${invalidate}">
  <h2 id="intro" >Click To Run Terraform</h2>
  ${preferences.showWarning ? '<br><br><div class="title prefs warning">Preferences Active</div>' : ""}

  <div id="display-output-2" class="button-container" style="display:none;" >
    <button class="button output" onclick="postMessage(\'openOutputFile\')">
      <div id="watch-logs" class="animated-button-text" onclick="this.classList.remove('animated-button-text')">Watch Logs</div>
    </button>
    <button class="button output chat-gpt ${completed && (tfCommand.toLowerCase().indexOf("plan") > -1) ? "animated-button-text" : "disabled"}" onclick="this.classList.remove('animated-button-text');postMessage(\'chat-gpt\')" title="Ask ChatGPT, terraform plan only">
      <div id="chat-gpt" class="${completed && (tfCommand.toLowerCase().indexOf("plan") > -1) ? "animated-button-text" : "disabled"}" onclick="this.classList.remove('animated-button-text')">Ask ChatGPT</div>
    </button>

    </div>
   
  </div>

  <div id="main-container">
    <div class="button-container">

    ${ actions.map(action => {
      if (action.optional) return
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
  <div class="quick-launch">
    <br>
    <div>Open quick launcher ('⌘⇧T')</div>
    <div> <button class="button" id="quicklaunch-menu" onclick="postMessage('openTFLauncher')">Terraform Launcher</button></div>
 </div>
 <div class="prefs">
      <div class="pref-container" ><div class="pref"><a class="pref-change" onclick="vscode.postMessage({ tfCommand: 'Clear preferences' })"> Clear preferences </a></div></div>
      <div class="pref-container"><div class="pref">${preferences.folder ? "Folder selected." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfFolder").label}' })")> ${preferences.folder ? "change" : "Select folder"} </a></div>
      <div class="pref-container"><div class="pref">${preferences.credentials ? "Credentials set." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfCredentials").label}' })"> ${preferences.credentials ? "change" : "Enter credentials"} </a></div>
    </div>
  <br>
  <script>
  ${ !intro ? "showLogsButton(\""+tfCommand+"\");" : ""}
  </script>
</body>
</html>
`;