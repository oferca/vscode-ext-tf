
const folders = list => list.map(
    project => {
        const projectJSON = JSON.stringify(project).replaceAll("\"","\\\'")
        return`
            <li class="folders" onclick="vscode.postMessage({ command: 'selected-project', json: '${projectJSON}' }); CURRENT_PROJECT='${projectJSON}'; appear();" >
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
    return `
    <section>
        <button type="button" class="pop-btn">Click for pop-up</button>
    </section>
    <div class="filemanager">

		<div class="search">
			<input type="search" placeholder="Find a file..">
		</div>

		<div class="breadcrumbs"><span class="folderName">files</span></div>

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
    var parent = document.querySelector(".modal-parent"),
    btn = document.querySelector(".pop-btn"),
    X = document.querySelector(".x"),
    section = document.querySelector("section");
    btn.addEventListener("click", appear);
    X.addEventListener("click", disappearX);
    CURRENT_PROJECT="${currentProjectJSON}";
    renderProjectInfo()
    
    function renderProjectInfo() {
        document.getElementById("project-info").innerHTML = CURRENT_PROJECT
    }
    function appear() {
        renderProjectInfo()
        parent.style.display = "block";
        section.style.filter = "blur(10px)"
    }
    
    function disappearX() {
        parent.style.display = "none";
        section.style.filter = "blur(0px)"
        var modal = document.querySelector(".modal")
        modal.classList.add("animated")
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