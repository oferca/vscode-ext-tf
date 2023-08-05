const exec = require('child_process').exec;
const { ShellHandler } = require("./shell-prototype")

const {
    addOptionDef
} = require("../methods")

const { noColorExt, timeExt } = require("../constants")
const { successMessage, getBashFunctionInvocation, getBashTFCommand } = require("./helpers")

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
    ${this.redirect ? `export tf_output=$(cat "$1.${noColorExt}";);  ` : ``}
    ${this.redirect ? `if [[ "$tf_output" == *"${successMessage(this.commandId)}"* ]]; then 
        echo "$(cat "$1")"; 
    fi;  ` : "" }
    ${this.redirect ? `
    echo; line; echo "| Click here to view full output: ( Cmd + Click ): | "; line;
    echo "$1.${noColorExt}"; echo; ` : ``} \
    };
    ${getBashFunctionInvocation(this.commandId)}(){ 
    clear; 
    export startTSCommand=$(date +%s); 
    echo 'Running: terraform ${this.tfOption ? addOptionDef(this.commandId, this.tfOption) : this.commandId.replaceAll("."," ") }'; echo; echo "At location:"; pwd; ${this.redirect ? `echo; echo "Click Hyperlink in notification for output logs."; echo;` : ""} echo "Please wait...";
    terraform ${getBashTFCommand(this.commandId, this.tfOption)} ${this.redirect ? " > " + "$1": ""};sleep 0.3; 
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
        return [this.getChangeFolderCmd()].concat(this.getCredentialsSetter() + ";")
    }
    deleteTerminalCurrentLine () {
        const { activeTerminal } = this.stateManager
        activeTerminal.sendText("< < Skip command line execution") // delibarate parse error
    }

    constructor(...args){
        super(...args)
        this.paramName = ""
        this.filePrefix = "//"
        this.terminalNoticeText = `* Click 'Terraform' in VSCode status bar below to run terminal commands.`
    }
}

module.exports = { BashHandler }