const getButtonHTML = (action, isExplorer) => `
    <div
        href="#"
        class="tf-button command ${action.label}"
        title="Run Terraform ${action.label.replace(" -", " with ")} in terminal"
        onclick="launchTFCommand('${action.label}', this)">
        <div class="spinner">
            <i class="fa fa-refresh fa-spin spinner"></i>
        </div>
        ${isExplorer ? "Terraform " : ""}${action.label}
    </div>       
    `
const strongSeperator = (action, isExplorer) => action.kind === -1 && (action.seperatorType !== "weak" || !isExplorer)

const weakSeperator = (action, isExplorer) => action.kind === -1 && action.seperatorType === "weak" && isExplorer

const progressBar = `<div class="progress-bar" id="progress-bar-bt" style="${tfPBStyle}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>`

const actionLabel = (action, isExplorer) => isExplorer ? action.label.replace("Terraform Actions"," ") : action.label

module.exports.getCommandButtonsHTML = (actions, isExplorer, outputFileContent) => {
    let firstSeperator
    const tfPBStyle = "visibility: hidden;"
    return actions.map(action => {
        if (action.menuOnly) return
        if (action.excludeExplorer && isExplorer) return
        if (action.handler) return (getButtonHTML(action, isExplorer))
        if (weakSeperator(action, isExplorer) ) return ('<h4 class="title">' + action.label + '</h4>' )
        if (strongSeperator(action, isExplorer)) {
            const seperatorClass = !firstSeperator ? "first" : ""
            firstSeperator = (firstSeperator || 0) + 1
            const terminal = isExplorer && (firstSeperator == 2) ? `
            <div class="expandable">
                ${outputFileContent}
            </div>
            <div class="progress" id="tf-progress">
                ${progressBar}
                <div class="accordion desc parameters project-block">Actions With Parameters</div>
                <div class="panel">
            ` : "" 
            return (`</div>
                <div class="expandable ${seperatorClass} seperator"></div>
                ${terminal}
                <div class="expandable">
                <h4 class="title">${actionLabel(action, isExplorer)}</h4>
            `)
        }
    }).join("")
}