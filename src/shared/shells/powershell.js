const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { ShellHandler } = require("./shell-prototype")

class PowershellHandler extends ShellHandler {
    async invokeWithCWD(cb){
        const cwdFileName = `cwd-${this.lifecycleManager.uniqueId}.txt`
        await vscode.window.activeTerminal.sendText(`Set-Content -Path (Join-Path -Path ${os.tmpdir()} -ChildPath "${cwdFileName}") -Value $PWD`);
        setTimeout(() => {
            const cwdFilePath = path.join(os.tmpdir(), cwdFileName)
            const userCwd = fs.readFileSync(cwdFilePath, "utf-8").replace("\\r\\n", "").trim()
            cb(null, userCwd, null)
        })
    }
    tfCommandDefinitions () {
    }
}

module.exports = { PowershellHandler }