const path = require('path');
const vscode = require('vscode');
const { capitalizeFirst, getNamespacedCredentialsKey, sortProjects } = require('../../../shared/methods');
const { createShellHandler } = require('../../../shared/methods-cycle');
const { credentialsSetText, disableShowOnStartupKey } = require('../../../shared/constants');

const folders = (list, stateManager) => list && list.sort(sortProjects).map(
    project => {
        const { current, projectPath, projectPathRelative, name, regions, projectRoot } = project,
          namespacedCredentialsKey = getNamespacedCredentialsKey(projectPath),
          credentials = stateManager.getState(namespacedCredentialsKey),
          credentialsTxt = credentials && credentials.length ? credentialsSetText : "",
          shellHandler = createShellHandler(vscode.window.activeTerminal),
          projectPathSynthesized = shellHandler.synthesizePath(projectPath),
          projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative),
          workspaceFolder = current ? "." : path.basename(projectRoot),
          regionsStr = current ? "": regions.length ? `Regions: ${regions.join(', ')}. ` : "", 
          details = current ? "Run commands in current folder" : `Workspace: ${capitalizeFirst(workspaceFolder)}, Path: ${projectPathRelative}<br>${regionsStr}Providers: ${project.providers.filter(p => p !== "").join(', ') || "none"}<br>Definitions: ${project.resources} resources, ${project.modules} modules, ${project.datasources} datasources`,
          title = details.replaceAll("<br>", ", ").replaceAll("<b>", "")
        return`
            <li class="button-pulse folders ${current ? "current" : ""}" onclick="vscode.postMessage({ command: 'selected-project', projectPath: '${projectPathSynthesized}', isExplorer: IS_EXPLORER }); CURRENT_PATH='${projectPathSynthesized}'; appear('${name}', '${projectPathSynthesized}', '${projectPathRelativeSynthesized}', '${credentialsTxt}', '${current ? "Active Terminal" : projectRoot}', '${current ? "Active Terminal" : path.basename(projectRoot)}');" >
                <a title="${projectPathRelativeSynthesized}" class="folders project">
                    <span class="icon folder full"></span>
                    <span class="name">${capitalizeFirst(name)}</span>
                    <span class="details" title="${title}">${details}</span>
                    <span class="name cta-arrow">Select</span>
                </a>
            </li>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation, stateManager) => {
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
      <div class="breadcrumbs header ${!completed && withAnimation ? 'anim-text': 'static'} "><span class="folderName">One-Click Terraform Commands Runner </span></div>
      <br><br><div class="breadcrumbs"><span class="folderName">Select A Terraform Project</span></div>

      <ul id="folders-list" class="data ${!completed && withAnimation ? 'animated': ''}" style="">
            ${folders(list, stateManager)}
        </ul>
	</div>
`}

module.exports.scripts = selectedProject => {
    const { name, projectPathRelative, credentials, projectRoot } = selectedProject || {}
    const shellHandler = createShellHandler(vscode.window.activeTerminal),
    displayedWorkspace = projectRoot ? path.basename(projectRoot) : "Active Terminal",
    projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative)
    return `
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
        renderProjectInfo("${name}", "${projectPathRelativeSynthesized}", "${credentials}", "${projectRoot || ""}", "${displayedWorkspace}")` : ""
    }
    function capitalizeFirst (str) {
        return  str.charAt(0).toUpperCase() + str.slice(1)
    }
    function renderProjectInfo(name, folder, credentials, workspace, displayedWorkspace) {
        if (!name) return
        const projectTitle = name.charAt(0).toUpperCase() + name.slice(1)
        const projectInfoEl = document.getElementById("project-info") || {}
        const projectCredsEl = document.getElementById("credentials") || { style: {} }
        const isCurrentTerminal = !workspace || workspace === "Active Terminal"
        const folderTitle = isCurrentTerminal ? "Current Terminal Path" : folder
        const currentStyle = isCurrentTerminal ? "margin-top: 10px;" : ""
        projectInfoEl.innerHTML = \`
        <h4 style="\${currentStyle}" title="\${name} project" class="section-title">
        \${(projectTitle).replace("Active Terminal", "Current Terminal Folder")}
        </h4>
        <ol>
             <li class="path" title="\${folder}">\${folderTitle}</li>
             <li style="\${currentStyle}" class="seperator"></li>
             <li style="\${currentStyle}" class="workspace" title="\${workspace}">\${workspace ? capitalizeFirst(displayedWorkspace) : ""}</li>
        </ol>
        \`
        projectCredsEl.innerHTML = \`\${credentials || ''}\`
        projectCredsEl.onkeyup="this.style.color='inherit';this.style.fontWeight='normal';"

        if (credentials !== "${credentialsSetText}") return

        projectCredsEl.style.color = "var(--vscode-editorOverviewRuler-currentContentForeground)"
        projectCredsEl.style.fontWeight = "bold"
    }
    
    function addOverlay(){
        setTimeout(() => {
            const modalContainer = document.getElementById("modal-container")
            modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)"
        })
    }

    function appear(name, folder, pathRelative, credentials, workspace, displayedWorkspace) {
        renderProjectInfo(name, pathRelative, credentials, workspace, displayedWorkspace)
        parent.style.display = "block";
        const tfProgressBar1 = document.getElementById("tf-progress")
        if (tfProgressBar1 && workspace === "Active Terminal") {
          tfProgressBar1.classList.add("active-terminal")
        }else {
          tfProgressBar1.classList.remove("active-terminal")
        }
        addOverlay()
        scrollInterval = undefined
    }

    function removeOverlay(){
        
        setTimeout(() => {
            const modalContainer = document.getElementById("modal-container")
            modalContainer.style.backgroundColor = "#0e3858"
        }, 600)
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