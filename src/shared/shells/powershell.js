const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { ShellHandler } = require("./shell-prototype")
const { removeLastInstance, successMessage, addOptionDef, getBashTFCommand, getBashFunctionInvocation } = require("../methods")
const { noColorExt, timeExt } = require("../constants")

class PowershellHandler extends ShellHandler {
    async invokeWithCWD(cb){
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
    tfCommandDefinitions () {
        return `
        function line() {echo " --------------------------------------------------";};
        finalize.${this.commandId}(){ param ([string]$1, [string]$2 )
        $endVscTfPlan = Get-Date -Format "yyyyMMddHHmmssfffffff"; 
        $timeSpan = New-TimeSpan -Start $endVscTfPlan -End $2
        echo $($timeSpan.Seconds) > "$1"${"." + timeExt + "; \ "}
        ${this.redirect ? `$tf_output=$(cat "$1.${noColorExt}";);  ` : ``}
        ${this.redirect ? `if ( $tf_output.Contains("${successMessage(this.commandId)}"); ){
            echo "$(cat "$1")"; 
        };  ` : "" }
        ${this.redirect ? `
        echo; line; echo "| Click here to view full output: ( Cmd + Click ): | "; line;
        echo "$1.${noColorExt}"; echo; ` : ``} \
        };
        ${getBashFunctionInvocation(this.commandId)}(){
        param ([string]$1, [string]$2 )
        clear; 
        $startTSCommand = Get-Date -Format "yyyyMMddHHmmssfffffff"; 
        echo 'Running: terraform ${this.tfOption ? addOptionDef(this.commandId, this.tfOption) : this.commandId.replaceAll("."," ") }'; echo; echo "At location:"; pwd; ${this.redirect ? `echo; echo "Click Hyperlink in notification for output logs."; echo;` : ""} echo "Please wait...";
        terraform ${getBashTFCommand(this.commandId, this.tfOption)} ${this.redirect ? " > " + "$1": ""};sleep 0.1; 
        finalize.${this.commandId} -1 "$1" "$startTSCommand"; 
        } `.replaceAll("\n", "")
    }
    handleDataPath(str) {
        return removeLastInstance(":", str )
    }
}

module.exports = { PowershellHandler }