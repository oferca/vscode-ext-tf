const { actions } = require("../../../shared/actions")
const { isWindows } = require("../../../shared/constants")

const getButtonHTML = (action, isExplorer, actionParent) => {
    const title =  `Run Terraform ${action.label.replace(" -", " with ")} in terminal`
    const onclick = `launchTFCommand('${action.label}', this)`
    const spinner = `<i class="fas fa-solid fa-spinner fa-spin"></i>`
    const isVarButton = action.label.toLowerCase().indexOf("var-file") > -1
    const isTargetButton = action.label.toLowerCase().indexOf("target") > -1
    const isHistoryButton = action.label.toLowerCase().indexOf("history") > -1
    const isUpgradeButton = action.label.toLowerCase().indexOf("upgrade") > -1
    const buttonText = isExplorer && isVarButton && "With Var File" ||
        isExplorer && isTargetButton && "With Target" ||
        isExplorer && isUpgradeButton && "Init and Upgrade" ||
        isExplorer && isHistoryButton && "History" ||
        (`${isExplorer ? "Terraform " : ""}${action.label}`
        .replace("Terraform ChatGPT", "ChatGPT"))
    const label = action.label.toLowerCase()
    const addSpinner = label.indexOf("chatgpt") === -1
    const buttonIconType = label.indexOf("init") > -1 && "download" ||
        label.indexOf("validate") > -1 && "check" ||
        label.indexOf("output") > -1 && "clipboard-list" ||
        label.indexOf("plan") > -1 && "paper-plane" ||
        label.indexOf("chatgpt") > -1 && "globe" ||
        label.indexOf("apply") > -1 && "upload"
    
    const modernTheme = action.topLevel && isExplorer || actionParent
    const isChild = actionParent
    const options = !isChild ? getOptions(action) : ""
    if (!action.topLevel && isExplorer && !actionParent && !action.misc) return ""
    return modernTheme ? `
       ${options}
        <button type="button"
            class="btn cmd button-pulse btn-${action.bType || actionParent.bType}"
            title="${title}"
            onclick="${onclick}">
            ${addSpinner ? spinner : ""}
            <i class="cmd-icon ${addSpinner ? "" : "no-spinner"} fas fa-${buttonIconType}"></i> &nbsp&nbsp&nbsp ${buttonText}
            ${options ? '<i class="cmd-icon right fas fa-list-ul"></i>' : ""}
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

const getOptions = _action => {
    if (!_action.isParent) return ""
    const buttons = actions
        .filter(action => action.parent === _action.label)
        .map(action => getButtonHTML(action, true, _action)).join("")
    return buttons ? `
    <div class="button-options expandable">
        ${buttons}
    </div>
    ` : ""
}

const strongSeperator = (action, isExplorer) => action.kind === -1 && (action.seperatorType !== "weak" || !isExplorer)

const weakSeperator = (action, isExplorer) => action.kind === -1 && action.seperatorType === "weak" && isExplorer

const progressBar = `<div class="progress-bar" id="progress-bar-bt" style="visibility: hidden;" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>`

const actionLabel = (action, isExplorer) => isExplorer ? action.label.replace("Terraform Actions"," ") : action.label

module.exports.getCommandButtonsHTML = (actions, isExplorer, outputFileContent, planSuccess) => {
    let firstSeperator
    const projectInfoStyle = `style="display: ${isExplorer ? 'block' : 'none'}; margin-top: 20px;"`
    const script = isWindows ?
    "$Env:AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE;\n$Env:AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY;" : 
    "export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE;\nexport AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY;"

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
                ${outputFileContent}
            <div class="progress" id="tf-progress">
                ${progressBar}

                ${seperator}
                <div id="project-info" class="project-block" ${projectInfoStyle}>
                </div>
                <div class="accordion desc parameters project-block">More commands</div>
                <div class="tf-panel">
            ` : `<div class="expandable ${seperatorClass} seperator"></div>` 
            return (`</div>
                ${terminal}
                <div class="expandable">
                <h4 class="title">${actionLabel(action, isExplorer)}</h4>
            `)
        }
    }).join("")
}