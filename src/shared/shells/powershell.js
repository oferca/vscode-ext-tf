const fs = require('fs');
const os = require('os');
const path = require('path');
const { ShellHandler } = require("./shell-prototype")
const { timeExt } = require("../constants")
const { successMessage, getBashFunctionInvocation, getTFCliCommand, sendTextShell, removeLastInstance, addOptionDef } = require("./helpers")

class PowershellHandler extends ShellHandler {
    paramName
    filePrefix
    async invokeWithCWD(cb) {
        const cwdFileName = `cwd-${this.stateManager.uniqueId}.txt`
        await sendTextShell(this.stateManager.activeTerminal, `Set-Content -Path (Join-Path -Path ${os.tmpdir()} -ChildPath "${cwdFileName}") -Value $PWD`);
        let counter = 0
        const waitForCWD = setInterval(() => {
            const cwdFilePath = path.join(os.tmpdir(), cwdFileName)
            const userCwd = fs.readFileSync(cwdFilePath, "utf-8").replace("\\r\\n", "").trim()
            counter++
            if (!userCwd && counter < 50) return
            clearInterval(waitForCWD)
            cb(null, userCwd, null)
        }, 100)
    }
    tfCommandDefinitions() {
        return `
        function line() { echo " --------------------------------------------------";};
        function finalize.${this.commandId}(){ param ([string]$p1, [string]$p2 )
        $endVscTfPlan = Get-Date -Format "yyyMMddHHmmssfff"; 
        echo ([Math]::Floor($($endVscTfPlan - $p2) / 1000)) > "$p1${"." + timeExt + "\";; \ "}
        ${this.redirect ? `;while ($true) {if (Test-Path "$p1${this.outputFileExt}") {Start-Sleep -Seconds 1; break;}Start-Sleep -Seconds 0.1;}; \
        $tf_output=$(cat "$p1${this.outputFileExt}"); ` : ``} \
        ${this.redirect ? `if ( $tf_output ){
            ${this.sendConsoleOutput !== false ? 'echo "$(cat "$p1")";' : ''} 
        };  ` : ""}\
        ${this.redirect ? `if ( $tf_output -and $tf_output.Contains("${successMessage(this.commandId)}") ){
            finalize.${this.commandId} -1 "$p1" "$startTSCommand"; 
        };  ` : ""}\
        ${this.redirect ? `
        echo \`n; line; echo "| Click here to view full output: ( Cmd + Click ): | "; line;
        echo "$p1${this.outputFileExt}"; echo \`n; ` : ``} \
        };
        function ${getBashFunctionInvocation(this.commandId)}(){
            param (
                [string] $p1,
                [string] $p2
            )
        
        clear; 
        $startTSCommand = Get-Date -Format "yyyMMddHHmmssfff"; 
        $expressionBase = "${this.cmd} ${getTFCliCommand(this.commandId, this.tfOption, this.par)} " + $p2;
        $expression = $expressionBase + ' ${this.redirect ? " > " + "\"$p1\"" : ""}';
        echo "Running: ${this.cmd} ${this.tfOption ? addOptionDef(this.commandId, this.tfOption) : this.commandId.replaceAll(".", " ") } \`nCli command: \`n "$expressionBase" \`n\`nAt path: $pwd"; ${this.redirect ? `echo \`n; echo "Click Hyperlink in notification for output logs."; echo \`n;` : ""} echo "Please wait..."; \
        Invoke-Expression $expression;
        finalize.${this.commandId} -p1 "$p1" "$startTSCommand"; 
        } `.replaceAll("\n", "")
    }
    handleDataPath(str) {
        return removeLastInstance(":", str)
    }

    synthesizePath(_path) {
        return _path ? _path.replaceAll("\\", "\\\\") : _path
    }
    getChangeFolderCmd() {
        let folder = this.stateManager.getUserFolder()
        if (!folder) return
        if (folder.charAt(0)=== "/") folder = folder.substring(1)
        return folder ? `cd "${folder}";` :""
    }
    getInitShellCommands() {
        return [this.getChangeFolderCmd()]
    }
    getCheckTFCommand () {
        return `if (@(Get-ChildItem -Depth 3 -Path . -Filter *.tf -Recurse -ErrorAction SilentlyContinue -Force ).length -ne "0") { echo \"${this.terminalNoticeText}\"; Start-Sleep -Seconds 0.2; echo \"\"; }`
    }
    async deleteTerminalCurrentLine () {
        const { activeTerminal } = this.stateManager
        await sendTextShell(activeTerminal, "<< Skip command line execution") // delibarate parse error
    }
    constructor(...args) {
        super(...args)
        this.paramName = "-p1 "
        this.filePrefix = ""
        this.terminalNoticeText = "* Click 'Terraform' in VSCode status bar below to run terminal commands."
    }
}

module.exports = { PowershellHandler }