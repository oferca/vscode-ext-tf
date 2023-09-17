const path = require('path');
const vscode = require('vscode');
const { capitalizeFirst, getNamespacedCredentialsKey, sortProjects } = require('../../../shared/methods');
const { createShellHandler } = require('../../../shared/methods-cycle');
const { credentialsSetText, disableShowOnStartupKey } = require('../../../shared/constants');

const folders = (list, stateManager) => list && list.sort(sortProjects).map(
    project => {
        const { current, projectPath, projectPathRelative, name, regions, projectRoot, folderColor } = project,
          namespacedCredentialsKey = getNamespacedCredentialsKey(projectPath),
          credentials = stateManager.getState(namespacedCredentialsKey),
          credentialsTxt = credentials && credentials.length ? credentialsSetText : "",
          shellHandler = createShellHandler(vscode.window.activeTerminal),
          projectPathSynthesized = shellHandler.synthesizePath(projectPath),
          projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative),
          workspaceFolder = current ? "." : path.basename(projectRoot),
          regionsStr = current ? "": regions.length ? `Regions: ${regions.join(', ')}. ` : "", 
          details = current ? "Run commands in current folder" : `Path: ${projectPathRelative}<br>${regionsStr}Providers: ${project.providers.filter(p => p !== "").join(', ') || "none"}. Definitions: ${project.resources} resources, ${project.modules} modules, ${project.datasources} datasources`,
          title = details.replaceAll("<br>", ", ").replaceAll("<b>", ""),
          folderLetter = current ? "\\3E" : capitalizeFirst(name).substr(0,1)
        return`
            <div class="card shadow button-pulse ${current ? "current" : ""}" onclick="vscode.postMessage({ command: 'selected-project', projectPath: '${projectPathSynthesized}', isExplorer: IS_EXPLORER }); CURRENT_PATH='${projectPathSynthesized}'; appear('${name}', '${projectPathSynthesized}', '${projectPathRelativeSynthesized}', '${credentialsTxt}', '${current ? "Active Terminal" : projectRoot}', '${current ? "Active Terminal" : path.basename(projectRoot)}', '${folderColor}');" >
                <div class="card-header">
                ${current ? "Integrated Teminal" : capitalizeFirst(workspaceFolder)}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${capitalizeFirst(name)}</h5>
                    <p title="${title}" class="card-text">${details}</p>
                </div>
            </div>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation, stateManager) => {
    const checked = !stateManager.getState(disableShowOnStartupKey) ? "checked" : ""
    return `
    

    <div class="input-group mb-3 show-startup">
    <div class="input-group-prepend">
      <div class="input-group-text">
        <input type="checkbox" id="myCheckbox" ${checked} aria-label="Checkbox for following text input">
      </div>
    </div>
    Always open on startup
  </div>

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
      <div class="breadcrumbs header ${!completed && withAnimation ? 'anim-text': 'static'} "><span class="folderName">One-Click Terraform Commands Runner </span>
      <br><br><div class="breadcrumbs"><span class="folderName ${!completed && withAnimation ? 'anim-text': 'static'}">Select A Terraform Project</span></div>
      </div>
      <ul id="folders-list" class="data ${!completed && withAnimation ? 'animated': ''}" style="">
            ${folders(list, stateManager)}
        </ul>
	</div>
`}

module.exports.scripts = selectedProject => {
    const { name, projectPathRelative, credentials, projectRoot, folderColor } = selectedProject || {}
    const shellHandler = createShellHandler(vscode.window.activeTerminal),
    displayedWorkspace = projectRoot ? path.basename(projectRoot) : "Active Terminal",
    projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative)
    return `
    var parent = document.querySelector(".tf-modal-parent")
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
        renderProjectInfo("${name}", "${projectPathRelativeSynthesized}", "${credentials}", "${projectRoot || ""}", "${displayedWorkspace}", "${folderColor}")` : ""
    }
    function capitalizeFirst (str) {
        return  str.charAt(0).toUpperCase() + str.slice(1)
    }
    function renderProjectInfo(name, folder, credentials, workspace, displayedWorkspace, folderColor) {
        if (!name) return
        const projectTitle = name.charAt(0).toUpperCase() + name.slice(1)
        const projectInfoEl = document.getElementById("project-info") || {}
        const commandsTitleEl = document.getElementById("commands-title") || {}
        const projectCredsEl = document.getElementById("credentials") || { style: {} }
        const isCurrentTerminal = !workspace || workspace === "Active Terminal"
        const folderTitle = isCurrentTerminal ? "Current Terminal Path" : folder
        const currentStyle = isCurrentTerminal ? "margin-top: 10px;" : ""
        document.getElementById("commands-title").style.color = folderColor
        commandsTitleEl.innerHTML = \`
        Run in \${(projectTitle).replace("Active Terminal", "Current Terminal Folder")}
        \`
        projectInfoEl.innerHTML = \`
        <h4 style="\${currentStyle} color:\${folderColor};" title="\${name} project" class="section-title">
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
            const modalContainer = document.getElementById("tf-modal-container")
            modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)"
        })
    }

    function appear(name, folder, pathRelative, credentials, workspace, displayedWorkspace, folderColor) {
        renderProjectInfo(name, pathRelative, credentials, workspace, displayedWorkspace, folderColor)
        parent.style.display = "block";
        const tfProgressBar1 = document.getElementById("tf-progress")
        if (tfProgressBar1){
          if(workspace === "Active Terminal") {
            tfProgressBar1.classList.add("active-terminal")
           }
           else {
            tfProgressBar1.classList.remove("active-terminal")
           }
        }
        addOverlay()
        scrollInterval = undefined
    }

    function removeOverlay(){
        
        setTimeout(() => {
            const modalContainer = document.getElementById("tf-modal-container")
            modalContainer.style.backgroundColor = "#0e3858"
        }, 600)
    }

    function disappearX() {
        parent.style.display = "none";
        var tfModal = document.querySelector(".tf-modal")
        tfModal.classList.add("animated")
        document.getElementById("main-tf-modal").classList.add("animated")
        vscode.postMessage({ command: 'unselected-project', isExplorer: IS_EXPLORER });
        vscode.postMessage({ command: 'render', isExplorer: IS_EXPLORER })
        removeOverlay()
    }

    parent.addEventListener("click", disappearParent)
    
    function disappearParent(e) {
        if (e.target.className == "tf-modal-parent") {
            parent.style.display = "none";
            var tfModal = document.querySelector(".tf-modal")
            tfModal.classList.add("animated")
            document.getElementById("main-tf-modal").classList.add("animated")
            vscode.postMessage({ command: 'unselected-project', isExplorer: IS_EXPLORER });
            vscode.postMessage({ command: 'render', isExplorer: IS_EXPLORER })
            removeOverlay()
        }
        
    }
`}