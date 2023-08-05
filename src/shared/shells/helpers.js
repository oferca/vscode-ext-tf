const { tfTargetPostix, tfPlanCommandId, planSuccessMessage1, planSuccessMessage2, tfValidateCommandId, validateSuccessMessage, tfInitCommandId, initSuccessMessage } = require("../constants")

module.exports.successMessage = commandId =>{
    const rawCommand = commandId.replace(tfTargetPostix, "")
    return rawCommand === tfPlanCommandId && planSuccessMessage1 ||
        rawCommand === tfPlanCommandId && planSuccessMessage2 ||
        rawCommand === tfValidateCommandId && validateSuccessMessage ||
        rawCommand === tfInitCommandId && initSuccessMessage
}

const getBashFunctionInvocation = cmdId => "terraform." + cmdId

module.exports.getBashFunctionInvocation = getBashFunctionInvocation

module.exports.getBashTFCommand = (commandId, tfOption) => {
    return tfOption ? `${getRawCommand(commandId)} -${getOptionKey(commandId)}="${tfOption}"` : commandId
}
