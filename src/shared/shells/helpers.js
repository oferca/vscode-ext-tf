const { tfTargetPostix, tfVarsPostix, tfUpgradePostix, tfForceUnlockPostix, tfPlanCommandId, planSuccessMessage1, planSuccessMessage2, tfValidateCommandId, validateSuccessMessage, tfInitCommandId, initSuccessMessage, tfStateListCommandId } = require("../constants")

module.exports.successMessage = commandId => {
    const rawCommand = commandId.replace(tfTargetPostix, "")
    return rawCommand === tfPlanCommandId && planSuccessMessage1 ||
        rawCommand === tfPlanCommandId && planSuccessMessage2 ||
        rawCommand === tfValidateCommandId && validateSuccessMessage ||
        rawCommand === tfInitCommandId && initSuccessMessage ||
        rawCommand === tfStateListCommandId && "."
}

const getBashFunctionInvocation = cmdId => "terraform." + cmdId

module.exports.getBashFunctionInvocation = getBashFunctionInvocation

const getOptionKey = commandId =>
    commandId.indexOf(tfTargetPostix) > -1 && "target" ||
    commandId.indexOf(tfVarsPostix) > -1 && "var-file" ||
    commandId.indexOf(tfUpgradePostix) > -1 && "upgrade" ||
    commandId.indexOf(tfForceUnlockPostix) > -1 && ""

const getRawCommand = commandId => commandId.
    replace(tfTargetPostix, "").
    replace(tfVarsPostix, "").
    replace(tfUpgradePostix, "").
    replace(tfForceUnlockPostix, "")

module.exports.getTFCliCommand = (commandId, tfOption) => {
    const rawCommand = getRawCommand(commandId)
    const optionKey = getOptionKey(commandId)
    return (tfOption ? `${rawCommand} -${optionKey}="${tfOption}"` : commandId)
        .replace("init.upgrade", "init -upgrade")
        .replace("plan.target", "plan")
        .replace("apply.target", "plan")
        .replace(".", " ")
}

const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

module.exports.sendTextShell = async (terminal, text) => {
    if (terminal.isDisposed) return
    await terminal.sendText(text)
    await sleep(300)
}

module.exports.removeLastInstance = (badtext, str) => {
    var charpos = str.lastIndexOf(badtext);
    if (charpos<0) return str;
    ptone = str.substring(0,charpos);
    pttwo = str.substring(charpos+(badtext.length));
    return (ptone+pttwo);
}

const addOptionDef = (commandId, tfOption) => commandId.
    replace(tfTargetPostix, ` -${getOptionKey(commandId)}="${tfOption}" `).
    replace(tfVarsPostix, ` -${getOptionKey(commandId)}="${tfOption}" `)

module.exports.addOptionDef = addOptionDef
