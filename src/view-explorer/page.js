const { style } = require("./style")
module.exports.html = (preferences, actions) => `
<html>
<head>
  <style>${style}</style>
</head>
<body>
  <p>Open quick launcher ('⌘⇧T')</p> 
  <button class="button" id="main-button" onclick="openTFLauncher()">Terraform Launcher</button>
  <script>
    const vscode = acquireVsCodeApi();
    function openTFLauncher() { 
      vscode.postMessage({ command: 'openTFLauncher' });
    }
  </script>
  <div class="button-container">
  <div class="prefs">
    <div class="pref-container" ><div class="pref"><a class="pref-change" > Clear preferences </a></div></div>
    <div class="pref-container"><div class="pref">${preferences.folder ? "Folder selected." : ""}</div><a class="pref-change" > ${preferences.folder ? "change" : "Select folder"} </a></div>
    <div class="pref-container"><div class="pref">${preferences.credentials ? "Credentials set." : ""}</div><a class="pref-change" > ${preferences.credentials ? "change" : "Enter credentials"} </a></div>
  </div>
  </div>
  <p>Run in terminal:</p>
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