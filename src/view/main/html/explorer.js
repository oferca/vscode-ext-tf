const vscode = require('vscode');
const { capitalizeFirst } = require('../../../shared/methods');

const folders = list => list && list.sort((a, b) => a.resources + a.modules > b.resources + b.modules ? -1 : 1).map(
    project => {
        const projectJSON =JSON.stringify(project).replaceAll("\"","\\\'")
        return`
            <li class="folders" onclick="vscode.postMessage({ command: 'selected-project', json: '${projectJSON}', isExplorer: IS_EXPLORER }); CURRENT_PROJECT='${projectJSON}'; appear();" >
                <a title="${project.projectPath}" class="folders">
                    <span class="icon folder full"></span>
                    <span class="name">${capitalizeFirst(project.name)}</span>
                    <span class="details">Regions: ${project.regions.join(', ')}.<br>Providers: ${project.providers.filter(p => p !== "").join(', ') || "none"}.<br>Definitions: ${project.resources} resources, ${project.modules} modules, ${project.datasources} datasources.</span>
                </a>
            </li>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const rootFolderName = capitalizeFirst(workspaceFolders[0].name)
    return `

    <div class="filemanager">

		<div class="breadcrumbs"><span class="folderName">${rootFolderName} Terraform Projects</span></div>

		<ul class="data ${!completed && withAnimation ? 'animated': ''}" style="">
            ${folders(list)}
        </ul>

		<div class="nothingfound" style="display: none;">
			<div class="nofiles"></div>
			<span>No files here.</span>
		</div>

	</div>
`}

module.exports.scripts = currentProjectJSON => `
    var parent = document.querySelector(".modal-parent")
    X = document.querySelector(".x")
    X.addEventListener("click", disappearX);
    CURRENT_PROJECT="${currentProjectJSON}";
    IS_EXPLORER=true
    let content
    renderProjectInfo()
   
    function renderProjectInfo() {
        if (!CURRENT_PROJECT) return
        const projectInfo = JSON.parse(CURRENT_PROJECT.replaceAll("'",'\"'))
        document.getElementById("project-info").innerHTML = \`
        <h4 title="\${projectInfo.name}">
        \${projectInfo.name.charAt(0).toUpperCase() + projectInfo.name.slice(1)}
        </h4>
        <ol>
            <li class="path" title="\${projectInfo.projectPath}">\${projectInfo.projectPath}</li>
        </ol>
        \`
        document.getElementById("credentials").innerHTML = projectInfo.credentials
    }

    function addOverlay(){
        console.log("addOverlay")
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.id = "overlay"
            overlay.style.height = document.body.clientHeight + "px"
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add("active"))
        })
    }

    function appear() {
        renderProjectInfo()
        parent.style.display = "block";
        addOverlay()
    }

    function removeOverlay(){
        overlay=document.getElementById("overlay")
        overlay.classList.remove("active")
        setTimeout(() => overlay.remove(), 600)
    }

    function disappearX() {
        parent.style.display = "none";
        var modal = document.querySelector(".modal")
        modal.classList.add("animated")
        document.getElementById("main-modal").classList.add("animated")
        vscode.postMessage({ command: 'render', isExplorer: IS_EXPLORER })
        removeOverlay()
    }

    parent.addEventListener("click", disappearParent)
    function disappearParent(e) {
        if (e.target.className == "modal-parent") {
            parent.style.display = "none";
        }
        removeOverlay()
    }
`