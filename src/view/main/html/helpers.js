const getButtonHTML = (action, isExplorer) => {
    const title =  `Run Terraform ${action.label.replace(" -", " with ")} in terminal`
    const onclick = `launchTFCommand('${action.label}', this)`
    const spinner = `<i class="fas fa-solid fa-spinner fa-spin"></i>`
    const buttonText = `${isExplorer ? "Terraform " : ""}${action.label}`.replace("Terraform ChatGPT", "ChatGPT")
    const label = action.label.toLowerCase()
    const addSpinner = label.indexOf("chatgpt") === -1
    const buttonIconType = label.indexOf("init") > -1 && "download" ||
        label.indexOf("validate") > -1 && "check" ||
        label.indexOf("output") > -1 && "list" ||
        label.indexOf("plan") > -1 && "paper-plane" ||
        label.indexOf("chatgpt") > -1 && "globe" ||
        label.indexOf("apply") > -1 && "upload"

    return action.topLevel ? `
        <button type="button"
            class="btn cmd btn-${action.bType}"
            title="${title}"
            onclick="${onclick}">
            ${addSpinner ? spinner : ""}
            <i class="cmd-icon ${addSpinner ? "" : "no-spinner"} fas fa-${buttonIconType}"></i> &nbsp ${buttonText}
        </button>
        ` : `
        <div
            href="#"
            class="tf-button command ${action.label}"
            title="${title}"
            onclick="${onclick}">
            ${spinner}
            ${buttonText}
        </div>       
    `
}
const strongSeperator = (action, isExplorer) => action.kind === -1 && (action.seperatorType !== "weak" || !isExplorer)

const weakSeperator = (action, isExplorer) => action.kind === -1 && action.seperatorType === "weak" && isExplorer

const progressBar = `<div class="progress-bar" id="progress-bar-bt" style="visibility: hidden;" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>`

const actionLabel = (action, isExplorer) => isExplorer ? action.label.replace("Terraform Actions"," ") : action.label

module.exports.getCommandButtonsHTML = (actions, isExplorer, outputFileContent, planSuccess) => {
    let firstSeperator
    const projectInfoStyle = `style="display: ${isExplorer ? 'block' : 'none'}; margin-top: 20px;"`

    return actions.map(action => {
        if (action.menuOnly) return
        if (action.onPlanSuccess && !planSuccess) return
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
                <div id="project-info" class="project-block" ${projectInfoStyle}>
                </div>
                <div class="accordion desc parameters project-block">Actions With Parameters</div>
                <div class="tf-panel">
            ` : `<div class="expandable ${seperatorClass} seperator"></div>` 
            return (`</div>
                ${terminal}<br>
                <div class="expandable">
                <h4 class="title">${actionLabel(action, isExplorer)}</h4>
            `)
        }
    }).join("")
}