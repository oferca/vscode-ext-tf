const exec = require('child_process').exec;
const { ShellHandler } = require("./shell-prototype")
const { timeExt } = require("../constants")
const { successMessage, getBashFunctionInvocation, getTFCliCommand, sendTextShell, addOptionDef } = require("./helpers")

class BashHandler extends ShellHandler{
    paramName
    filePrefix
    async invokeWithCWD(cb){
        const processId = await this.stateManager.activeTerminal.processId
        exec(`lsof -p ${processId} | grep cwd`, cb)
    }
    
    tfCommandDefinitions () {
        return `
    function line() { echo " --------------------------------------------------";};
    finalize.${this.commandId}(){ 
    export endVscTfPlan=$(date +%s); 
    echo \`expr $endVscTfPlan - "$2"\`> "$1"${"." + timeExt + "; \ "}
    ${this.redirect ? `export tf_output=$(cat "$1${this.outputFileExt}";);  ` : ``}
    ${this.redirect && this.sendConsoleOutput !== false ? ` echo "$(cat "$1")"; ` : "" }
    ${this.redirect ? `
    echo; line; echo "| Click here to view full output: ( Cmd + Click ): | "; line;
    echo "$1${this.outputFileExt}"; echo; ` : ``} \
    };
    ${getBashFunctionInvocation(this.commandId)}(){ 
    clear; 
    export startTSCommand=$(date +%s); 
    export expressionBase="${this.cmd} ${getTFCliCommand(this.commandId, this.tfOption, this.par)} $2";
    export expression="$expressionBase ${this.redirect ? " > " + "$1": ""}";
    echo 'Running: ${this.cmd} ${this.tfOption ? addOptionDef(this.commandId, this.tfOption) : this.commandId.replaceAll("."," ") }' $(echo $2); echo; echo "At location:"; pwd; ${this.redirect ? `echo; echo "Click Hyperlink in notification for output logs."; echo;` : ""} echo "Please wait...";
    eval $expression; sleep 0.3; 
    finalize.${this.commandId} "$1" "$startTSCommand"; 
    } `.replaceAll("\n", "")
}
    handleDataPath(str) {
        return str 
    }
    getCheckTFCommand () {
        return `[[ $( find . -name "*.tf"  | wc -l ) -gt 0 ]] && (echo \"${this.terminalNoticeText}\"; echo \"\"; )`
    }
    
    getInitShellCommands() {
        return [this.getChangeFolderCmd()]
    }
    async deleteTerminalCurrentLine () {
        const { activeTerminal } = this.stateManager
        await sendTextShell(activeTerminal, "< < Skip command line execution") // delibarate parse error
    }

    constructor(...args){
        super(...args)
        this.paramName = ""
        this.filePrefix = "//"
        this.terminalNoticeText = `* Click 'Terraform Projects' in VSCode status bar below to run terminal commands.`
    }
}

module.exports = { BashHandler }