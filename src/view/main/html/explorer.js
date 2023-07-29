const vscode = require('vscode');

const folders = list => list.map(
    project => {
        const projectJSON = JSON.stringify(project).replaceAll("\"","\\\'")
        return`
            <li class="folders" onclick="console.log('***1***', vscode);vscode.postMessage({ command: 'selected-project', json: '${projectJSON}' }); CURRENT_PROJECT='${projectJSON}'; appear();" >
                <a title="${project.filePath}" class="folders">
                    <span class="icon folder full"></span>
                    <span class="name">${project.name}</span>
                    <span class="details">${project.regions.join()}</span>
                </a>
            </li>
        `
    }
).join("")

module.exports.html = (list, completed, withAnimation) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const roorFolderName = workspaceFolders[0].name
    return `

    <div class="filemanager">

		<div class="search">
			<input type="search" placeholder="Find a file..">
		</div>

		<div class="breadcrumbs"><span class="folderName">Terraform projects in ${roorFolderName} workspace</span></div>

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
    renderProjectInfo()
    
    function renderProjectInfo() {
        if (!CURRENT_PROJECT) return
        const projectInfo = JSON.parse(CURRENT_PROJECT.replaceAll("'",'\"'))
        document.getElementById("project-info").innerHTML = \`
        <h4 title="\${projectInfo.name}">
        Project \${projectInfo.name.charAt(0).toUpperCase() + projectInfo.name.slice(1)}
        </h4>
        <ol>
            <li class="path" title="\${projectInfo.filePath}">\${projectInfo.filePath}</li>
            <li class="regions" title="\${projectInfo.regions.join(', ')}"}>\${projectInfo.regions.join()}</li>
            <li class="providers" title="\${projectInfo.providers.join(', ')}"}>\${projectInfo.providers.join()}</li>
            <li class="definitions" title="\${projectInfo.resources}">\${projectInfo.resources} resources, \${projectInfo.modules} modules, \${projectInfo.datasources} datasources</li>
        </ol>
        \`
    }
    function appear() {
        renderProjectInfo()
        parent.style.display = "block";
    }
    
    function disappearX() {
        parent.style.display = "none";
        section.style.filter = "blur(0px)"
        var modal = document.querySelector(".modal")
        modal.classList.add("animated")
        document.getElementById("main-modal").classList.add("animated")
        console.log('***2***', vscode)
        vscode.postMessage({ command: 'render' })
    }

    parent.addEventListener("click", disappearParent)
    function disappearParent(e) {
        if (e.target.className == "modal-parent") {
            parent.style.display = "none";
            section.style.filter = "blur(0px)"
        }
    }
`