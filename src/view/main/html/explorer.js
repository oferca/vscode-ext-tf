const vscode = require('vscode');
const { capitalizeFirst, getNamespacedCredentialsKey, sortProjects } = require('../../../shared/methods');
const { createShellHandler } = require('../../../shared/methods-cycle');
const { credentialsSetText, disableShowOnStartupKey } = require('../../../shared/constants');

const folders = (list, stateManager) => list && list.sort(sortProjects).map(
    project => {
        const { projectPath, projectPathRelative, name, regions } = project,
          namespacedCredentialsKey = getNamespacedCredentialsKey(projectPath),
          credentials = stateManager.getState(namespacedCredentialsKey),
          credentialsTxt = credentials && credentials.length ? credentialsSetText : "",
          shellHandler = createShellHandler(vscode.window.activeTerminal),
          projectPathSynthesized = shellHandler.synthesizePath(projectPath),
          projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative)
        return`
            <li class="folders" onclick="vscode.postMessage({ command: 'selected-project', projectPath: '${projectPathSynthesized}', isExplorer: IS_EXPLORER }); CURRENT_PATH='${projectPathSynthesized}'; appear('${name}', '${projectPathSynthesized}', '${projectPathRelativeSynthesized}', '${credentialsTxt}');" >
                <a title="${projectPathRelativeSynthesized}" class="folders project">
                    <span class="icon folder full"></span>
                    <span class="name">${capitalizeFirst(name)}</span>
                    <span class="details">Path: ${projectPathRelative}<br>Regions: ${regions.join(', ')}<br>Providers: ${project.providers.filter(p => p !== "").join(', ') || "none"}<br>Definitions: ${project.resources} resources, ${project.modules} modules, ${project.datasources} datasources</span>
                </a>
            </li>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation, stateManager) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const rootFolderName = capitalizeFirst(workspaceFolders[0].name)
    const checked = !stateManager.getState(disableShowOnStartupKey) ? "checked" : ""
    return `
    <label class="checkbox-label">
        <input type="checkbox" id="myCheckbox" ${checked}>
        <span class="checkmark"></span>
        Show on startup
      </label>

  <script>
    // JavaScript code to handle the checkbox change event
    const checkbox = document.getElementById('myCheckbox');

    checkbox.addEventListener('change', (event) => {
      if (event.target.checked) {
        vscode.postMessage({ command: 'show-on-startup' })
      } else {
        vscode.postMessage({ command: 'dont-show-on-startup' })
      }
    });
  </script>

      <div id="filemanager" >
		<div class="breadcrumbs"><span class="folderName">${rootFolderName} Terraform Projects</span></div>
		<ul id="folders-list" class="data ${!completed && withAnimation ? 'animated': ''}" style="">
            ${folders(list, stateManager)}
        </ul>
		<div class="nothingfound" style="display: none;">
			<div class="nofiles"></div>
			<span>No files here.</span>
		</div>
	</div>
`}

module.exports.scripts = selectedProject => {
    const { name, projectPathRelative, credentials } = selectedProject || {}
    shellHandler = createShellHandler(vscode.window.activeTerminal)
    const projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative)
    return `
    // Handle the message inside the webview
        window.addEventListener('message', event => {
            document.getElementById("output-file").value = event.data.outputFileContent
        });
    var parent = document.querySelector(".modal-parent")
    X = document.querySelector(".x")
    X.addEventListener("click", disappearX);
    IS_EXPLORER=true
    let content
    setTimeout(() => {
        const foldersList = document.getElementById("folders-list")
        if (!foldersList) return
        foldersList.classList.remove("animated")
        foldersList.style.animation = "none"
    }, 5000)
    ${selectedProject ? `
        renderProjectInfo("${name}", "${projectPathRelativeSynthesized}", "${credentials}")` :""
    }
    function renderProjectInfo(name, folder, credentials) {
        if (!name) return
        document.getElementById("project-info").innerHTML = \`
        <h4 title="\${name}">
        \${name.charAt(0).toUpperCase() + name.slice(1)}
        </h4>
        <ol>
            <li class="path" title="\${folder}">\${folder}</li>
        </ol>
        \`
        document.getElementById("credentials").innerHTML = \`\${credentials || ''}\`
        document.getElementById("credentials").onkeyup="this.style.color='inherit';this.style.fontWeight='normal';"

        if (credentials !== "${credentialsSetText}") return

        document.getElementById("credentials").style.color = "var(--vscode-editorOverviewRuler-currentContentForeground)"
        document.getElementById("credentials").style.fontWeight = "bold"
    }
    let overlay
    function addOverlay(){
        setTimeout(() => {
            overlay = document.createElement('div');
            overlay.id = "overlay"
            overlay.style.height = document.body.clientHeight + "px"
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add("active"))
        })
    }

    function appear(name, folder, pathRelative, credentials) {
        renderProjectInfo(name, pathRelative, credentials)
        parent.style.display = "block";
        addOverlay()
    }

    function removeOverlay(){
        overlay.classList.remove("active")
        overlay.style.height = 0
        setTimeout(overlay.remove, 600)
    }

    function disappearX() {
        parent.style.display = "none";
        var modal = document.querySelector(".modal")
        modal.classList.add("animated")
        document.getElementById("main-modal").classList.add("animated")
        vscode.postMessage({ command: 'unselected-project', isExplorer: IS_EXPLORER });
        vscode.postMessage({ command: 'render', isExplorer: IS_EXPLORER })
        removeOverlay()
    }

    parent.addEventListener("click", disappearParent)
    
    function disappearParent(e) {
        if (e.target.className == "modal-parent") {
            parent.style.display = "none";
            var modal = document.querySelector(".modal")
            modal.classList.add("animated")
            document.getElementById("main-modal").classList.add("animated")
            vscode.postMessage({ command: 'unselected-project', isExplorer: IS_EXPLORER });
            vscode.postMessage({ command: 'render', isExplorer: IS_EXPLORER })
            removeOverlay()
        }
        
    }
`}