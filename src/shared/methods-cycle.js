const { BashHandler } = require("./shells/bash")
const { PowershellHandler } = require("./shells/powershell")

module.exports.createShellHandler = terminal => (new (isPowershell(terminal) ? PowershellHandler: BashHandler))

module.exports.addProvider = (prov, providersArr) => {
    const provArr = prov.split("\"}")
    providersArr.push(provArr.length > 1 ? provArr[1] : (provArr[0].length < 25 ? provArr[0] : ""))
}

module.exports.getProviders = content => {
    const requiredProviders1 = content.split("required_providers{")
    const requiredProviders2 = requiredProviders1.length > 1 ? requiredProviders1[1].split("}}")[0] : []
    return requiredProviders2.length ? requiredProviders2.split("={"): []
}

module.exports.tfObjectCount = (content, total = 0, pattern) => total + (content.match(new RegExp(pattern, 'g')) || "").length

module.exports.getRelativeFolderPath = (startPath, projectRoot) => {
    let projectPath = startPath.replace(projectRoot, "");
    if (projectPath.charAt(0)=== "/") projectPath = projectPath.substring(1)
    return projectPath
}

module.exports.transformRegions = (section, regions) => {
    try{
      const parts = section.split("\"")
      if (parts.length < 2) return
      const region = parts[0]
      regions.push(region.replaceAll("\""))
    }catch(e){}
  }


const isPowershell = terminal =>
    terminal && (
        terminal.name === '' && !terminal.creationOptions.shellPath && isWindows ||
        terminal.name.toLowerCase().indexOf("pwsh") > -1 ||
        terminal.name.toLowerCase().indexOf("powershell") > -1 ||
        terminal.creationOptions.shellPath &&
        (
            terminal.creationOptions.shellPath.toLowerCase().indexOf("pwsh") > -1 ||
            terminal.creationOptions.shellPath.toLowerCase().indexOf("powershell") > -1
        )
    )
module.exports.isPowershell = isPowershell