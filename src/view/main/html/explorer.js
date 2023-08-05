const vscode = require('vscode');
const { capitalizeFirst, getNamespacedCredentialsKey } = require('../../../shared/methods');
const { credentialsSetText } = require('../../../shared/constants');

const folders = (list, stateManager) => list && list.sort((a, b) => a.lastModifiedTimestamp > b.lastModifiedTimestamp ? -1 : 1).map(
    project => {
        const { projectPath, projectPathRelative, name, regions } = project,
          namespacedCredentialsKey = getNamespacedCredentialsKey(projectPath),
          credentials = stateManager.getState(namespacedCredentialsKey),
          credentialsTxt = credentials && credentials.length ? credentialsSetText : "" 
        return`
            <li class="folders" onclick="vscode.postMessage({ command: 'selected-project', projectPath: '${projectPath}', isExplorer: IS_EXPLORER }); CURRENT_PATH='${projectPath}'; appear('${name}', '${projectPath}', '${projectPathRelative}', '${credentialsTxt}');" >
                <a title="${projectPathRelative}" class="folders project">
                    <span class="icon folder full"></span>
                    <span class="name">${capitalizeFirst(name)}</span>
                    <span class="details">Regions: ${regions.join(', ')}.<br>Providers: ${project.providers.filter(p => p !== "").join(', ') || "none"}.<br>Definitions: ${project.resources} resources, ${project.modules} modules, ${project.datasources} datasources.</span>
                </a>
            </li>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation, stateManager) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const rootFolderName = capitalizeFirst(workspaceFolders[0].name)
    return `
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

module.exports.scripts = selectedProject => `
    var parent = document.querySelector(".modal-parent")
    X = document.querySelector(".x")
    X.addEventListener("click", disappearX);
    IS_EXPLORER=true
    let content
    setTimeout(() => {
        document.getElementById("folders-list").classList.remove("animated")
        document.getElementById("folders-list").style.animation = "none"
        animation
    }, 5000)
    ${selectedProject ? `
        renderProjectInfo("${selectedProject.name}", "${selectedProject.projectPathRelative}", "${selectedProject.credentials}")` :""
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
`