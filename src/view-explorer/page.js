const { style } = require("./style")
module.exports.html = (preferences, actions) => `
<html>
<head>
  <style>${style}</style>
</head>
<body>
<div class="quick-launch">
<br>
<div>Open quick launcher ('⌘⇧T')</div>
<div> <button class="button" id="main-button" onclick="openTFLauncher()">Terraform Launcher</button></div>
 </div>
  <script>
    const vscode = acquireVsCodeApi();
    function openTFLauncher() { 
      vscode.postMessage({ command: 'openTFLauncher' });
    }
  </script>
  <div class="button-container">
  <div class="prefs warning">${preferences.showWarning ? "NOTICE: Preferences Active" : ""}</div>
  <div class="prefs">
    <div class="pref-container" ><div class="pref"><a class="pref-change" onclick="vscode.postMessage({ tfCommand: 'Clear preferences' })"> Clear preferences </a></div></div>
    <div class="pref-container"><div class="pref">${preferences.folder ? "Folder selected." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfFolder").label}' })")> ${preferences.folder ? "change" : "Select folder"} </a></div>
    <div class="pref-container"><div class="pref">${preferences.credentials ? "Credentials set." : ""}</div><a class="pref-change" onclick="vscode.postMessage({ tfCommand: '${actions.find(action => action.id === "tfCredentials").label}' })"> ${preferences.credentials ? "change" : "Enter credentials"} </a></div>
  </div>
  </div>
  <div class="button-container">
  ${ actions.map(action => {
    if (action.optional) return
    const type = action.label.indexOf("Apply") > -1 ? "warning" : ""
    if (action.handler) return (`<button
      class="button command ${type}"
      title="Run Terraform ${action.label.replace(" -", " with ")} in terminal"
      onclick="vscode.postMessage({ tfCommand: '${action.label}' })"
      >` + action.label +'</button>')
    if (action.kind === -1 ) return ('<div class="category">' + action.label + '</div>' )
  }).join("")}
  </div>
  <br>
</body>
</html>
`;