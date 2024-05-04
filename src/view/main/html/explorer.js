const path = require('path');
const vscode = require('vscode');
const { capitalizeFirst, sortProjects } = require('../../../shared/methods');
const { createShellHandler } = require('../../../shared/methods-cycle');
const { disableShowOnStartupKey, tofuKey } = require('../../../shared/constants');

const folders = list => list && list.sort(sortProjects).map(
    project => {
        const { current, projectPath, projectPathRelative, name, regions, projectRoot, folderColor } = project,
          shellHandler = createShellHandler(vscode.window.activeTerminal),
          projectPathSynthesized = shellHandler.synthesizePath(projectPath),
          projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative),
          workspaceFolder = current ? "." : path.basename(projectRoot),
          regionsStr = current ? "": regions.length ? `Regions: ${regions.join(', ')}. ` : "", 
          details = current ? "Run commands in current folder" : `Path: ${projectPathRelative}<br>${regionsStr}Providers: ${project.providers.filter(p => p !== "").join(', ') || "none"}. Definitions: ${project.resources} resources, ${project.modules} modules, ${project.datasources} datasources`,
          title = details.replaceAll("<br>", ", ").replaceAll("<b>", "").replaceAll("\\\"", "'")
        return`
            <div class="card shadow button-pulse ${current ? "current" : ""}" onclick="\
               vscode.postMessage({ command: 'selected-project', projectPath: '${projectPathSynthesized}', isExplorer: IS_EXPLORER });\
               CURRENT_PATH='${projectPathSynthesized}';\
               appear('${name}', '${projectPathSynthesized}', '${projectPathRelativeSynthesized}', '${current ? "Active Terminal" : projectRoot}', '${current ? "Active Terminal" : path.basename(projectRoot)}', '${folderColor}');\
               " >
                <div class="card-header">
                ${current ? "Integrated Teminal" : capitalizeFirst(workspaceFolder)}
                </div>

                <div class="card-body">

                    <h5 class="card-title">${capitalizeFirst(name)}</h5>
                    <button type="button" class="btn btn-light dashboard">Project Dashboard</button>

                    <p title="${title}" class="card-text">${details}</p>
                </div>
            </div>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation, stateManager) => {
    const cmd = stateManager.getState(tofuKey) ? "tofu" : "terraform"
    const checked = !stateManager.getState(disableShowOnStartupKey) ? "checked" : ""
    return `
    <div class="input-group mb-3 show-startup">
    <div class="input-group-prepend">
      <div class="input-group-text">
        <input type="checkbox" id="myCheckbox" ${checked} aria-label="Show ib startup">
      </div>
    </div>
    Show on startup
  </div>

  <a target="_self" class="book-affiliate" href="https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=Infrastructure+Terraform+running&_sacat=0&_odkw=Infrastructure+Terraform&_osacat=0&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339057267&customid=&toolid=10001&mkevt=1">
    <img src="https://github.com/oferca/vscode-ext-tf/blob/main/assets/terraform-up-and-running.png?raw=true" alt="Terraform Up and Running"/>
  </a>

  <a target="_self" class="book-affiliate hashicorp" href="https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2332490.m570.l1313&_nkw=HashiCorp+Infrastructure+Automation+terraform&_sacat=0&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339057267&customid=&toolid=10001&mkevt=1">
    <img src="https://github.com/oferca/vscode-ext-tf/blob/main/assets/hashicorp-certificate.png?raw=true" alt="Terraform Up and Running"/>
  </a>

  <div class="btn-group btn-group-toggle" id="terraform-tofu" data-toggle="buttons">
    <label class="btn btn-secondary ${cmd === "terraform" ? "active" : ""}">
        <input type="radio" name="options" id="terraform-button" autocomplete="off"> Terraform
    </label>
    <label class="btn btn-secondary ${cmd === "tofu" ? "active" : ""}">
        <input type="radio" name="options" id="tofu-button" autocomplete="off"> Tofu
    </label>
</div>


  <script>
    // JavaScript code to handle the checkbox change event
    const checkbox = document.getElementById('myCheckbox');
    const terraformButton = document.getElementById('terraform-button');
    const tofuButton = document.getElementById('tofu-button');
    console.log(tofuButton)
    terraformButton.addEventListener("change", el => {
        console.log("terraform")
        vscode.postMessage({ command: 'terraform' })
        tofuButton.parentElement.classList.remove("active")
        terraformButton.parentElement.classList.add("active")
    });
    tofuButton.addEventListener("change", el => {
        console.log("tofu")
        vscode.postMessage({ command: 'tofu' });
        terraformButton.parentElement.classList.remove("active")
        tofuButton.parentElement.classList.add("active")
    });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setTimeout(() => {
        const checkbox = document.getElementById("topPixel")
        if (checkbox) checkbox.scrollIntoView({ behavior: "smooth" })
    })    

    checkbox.addEventListener('change', (event) => {
      if (event.target.checked) {
        vscode.postMessage({ command: 'show-on-startup' })
      } else {
        vscode.postMessage({ command: 'dont-show-on-startup' })
      }
    });
  </script>

      <div id="filemanager" >
       <div class="breadcrumbs header ${!completed && withAnimation ? 'anim-text': 'static'} "><span class="folderName">Terraform Projects</span>
      </div>
      <ul id="folders-list" class="data ${!completed && withAnimation ? 'animated': ''}" style="">
            ${folders(list, stateManager)}
        </ul>
	</div>
`}

module.exports.scripts = selectedProject => {
    const { name, projectPathRelative, projectRoot, folderColor } = selectedProject || {}
    const shellHandler = createShellHandler(vscode.window.activeTerminal),
    displayedWorkspace = projectRoot ? path.basename(projectRoot) : "Active Terminal",
    projectPathRelativeSynthesized = shellHandler.synthesizePath(projectPathRelative)
    if (selectedProject) selectedProject.alreadyNotified = true
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
        renderProjectInfo("${name}", "${projectPathRelativeSynthesized}", "${projectRoot || ""}", "${displayedWorkspace}", "${folderColor}")` : ""
    }
    function capitalizeFirst (str) {
        return  str.charAt(0).toUpperCase() + str.slice(1)
    }
    function renderProjectInfo(name, folder, workspace, displayedWorkspace, folderColor) {
        if (!name) return
        const projectTitle = name.charAt(0).toUpperCase() + name.slice(1) + " dashboard"
        const projectInfoEl = document.getElementById("project-info") || {}
        const commandsTitleEl = document.getElementById("commands-title") || {}
        const isCurrentTerminal = !workspace || workspace === "Active Terminal"
        const folderTitle = isCurrentTerminal ? "Current Terminal Path" : folder
        const currentStyle = isCurrentTerminal ? "margin-top: 10px;" : ""
        document.getElementById("commands-title").style.color = folderColor
        commandsTitleEl.innerHTML = \`\${(projectTitle).replace("Active Terminal", "Current Terminal")}\`
        projectInfoEl.innerHTML = \`
        <h5 style="\${currentStyle} color:\${folderColor};" title="\${name} project" class="display-6 title-section">
        Project metadata
        </h5>
        <ol>
             <li class="path" title="\${folder}">\${folderTitle}</li>
             <li style="\${currentStyle}" class="seperator"></li>
             <li style="\${currentStyle}" class="workspace" title="\${workspace}">\${workspace ? capitalizeFirst(displayedWorkspace) : ""}</li>
        </ol>
        \`
    }
    
    function addOverlay(){
        setTimeout(() => {
            const modalContainer = document.getElementById("tf-modal-container")
            modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.4)"
        })
    }

    function appear(name, folder, pathRelative, workspace, displayedWorkspace, folderColor) {
        renderProjectInfo(name, pathRelative, workspace, displayedWorkspace, folderColor)
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
        showInteractiveInstructions(name)
        document.getElementById("tf-modal-container").onclick = () => {document.querySelector(".msg-icn").style.display = "none";}

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