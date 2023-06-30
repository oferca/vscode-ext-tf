const { style } = require("./style")
module.exports.html = (preferences, actions, intro = true) => `
<html>
<head>
  <style>${style}</style>
</head>
<body>
<div id="top-container">
  <h2 id=\"intro\" class=\"${intro ? "" : "no-animation"}\" >Scroll To Launch!</h2>
  <div class="button-container" style=\"${intro ? "display: none;" : ""}\">
    <button class="button output" onclick="postMessage(\'openOutputFile\')">Watch Logs</button>
    </div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    function postMessage(command) { 
      vscode.postMessage({ command });
    }
    function launchTFCommand(tfCommand) {
      vscode.postMessage({ tfCommand });
    }
  </script>
  <div class="prefs warning">${preferences.showWarning ? "NOTICE: Preferences Active" : ""}</div>
  <div class="button-container">
  ${ actions.map(action => {
    if (action.optional) return
    const type = action.label.indexOf("Apply") > -1 ? "warning" : ""
    if (action.handler) return (`<button
      class="button command ${type}"
      title="Run Terraform ${action.label.replace(" -", " with ")} in terminal"
      onclick="launchTFCommand('${action.label}')"
      >` + action.label +'</button>')
    if (action.kind === -1 ) return ('<h4 class="title">' + action.label + '</h4>' )
  }).join("")}
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
</body>
</html>
`;