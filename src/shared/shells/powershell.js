const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { ShellHandler } = require("./shell-prototype")
const { removeLastInstance, successMessage, addOptionDef, getBashTFCommand, getBashFunctionInvocation } = require("../methods")
const { noColorExt, timeExt } = require("../constants")

class PowershellHandler extends ShellHandler {
    paramName
    filePrefix
    fileEncoding
    async invokeWithCWD(cb) {
        const cwdFileName = `cwd-${this.lifecycleManager.uniqueId}.txt`
        await vscode.window.activeTerminal.sendText(`Set-Content -Path (Join-Path -Path ${os.tmpdir()} -ChildPath "${cwdFileName}") -Value $PWD`);
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
        function line() {echo " --------------------------------------------------";};
        function finalize.${this.commandId}(){ param ([string]$p1, [string]$p2 )
        $endVscTfPlan = Get-Date -Format "yyyMMddHHmmssfff"; 
        echo ([Math]::Floor($($endVscTfPlan - $p2) / 1000)) > "$p1${"." + timeExt + "\";; \ "}
        ${this.redirect ? `;while ($true) {if (Test-Path "$p1.${noColorExt}") {Start-Sleep -Seconds 1; break;}Start-Sleep -Seconds 0.1;}; \
        $tf_output=$(cat "$p1.${noColorExt}"); ` : ``} \
        ${this.redirect ? `if ( $tf_output -and $tf_output.Contains("${successMessage(this.commandId)}") ){
            echo "$(cat "$p1")"; 
            finalize.${this.commandId} -1 "$p1" "$startTSCommand"; 
        };  ` : ""}
        ${this.redirect ? `
        echo \`n; line; echo "| Click here to view full output: ( Cmd + Click ): | "; line;
        echo "$p1.${noColorExt}"; echo \`n; ` : ``} \
        };
        function ${getBashFunctionInvocation(this.commandId)}(){
        param ([string]$p1 )
        clear; 
        $startTSCommand = Get-Date -Format "yyyMMddHHmmssfff"; 
        echo "Running: terraform ${this.tfOption ? addOptionDef(this.commandId, this.tfOption) : this.commandId.replaceAll(".", " ") } \`n\`nAt path: $pwd"; ${this.redirect ? `echo \`n; echo "Click Hyperlink in notification for output logs."; echo \`n;` : ""} echo "Please wait..."; \
        terraform ${getBashTFCommand(this.commandId, this.tfOption)} ${this.redirect ? " > " + "\"$p1\"" : ""}; 
        finalize.${this.commandId} -p1 "$p1" -p2 "$startTSCommand"; 
        } `.replaceAll("\n", "")
    }
    handleDataPath(str) {
        return removeLastInstance(":", str)
    }
    constructor(...args) {
        super(...args)
        this.paramName = "-p1 "
        this.filePrefix = ""
        this.fileEncoding = "UTF-16LE"
    }
}

module.exports = { PowershellHandler }