const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { CommandHandlerPrototype } = require("../base")
const { lastSelectedProjectPathKey, noColorExt } = require("../../shared/constants");
const { capitalizeFirst } = require('../../shared/methods');

class TerraformPlanHistoryHandler extends CommandHandlerPrototype {

    async executeHook() {
        if (!this.fileHandler) this.initFileHandler()
        const dataFolder = this.fileHandler.dataFolder
        fs.readdir(dataFolder, async (err, files) => {
          const history = files
            .filter(fileName => fileName.indexOf(noColorExt) > -1)
            .map(filename => {
                return {
                    filename,
                    label: `${capitalizeFirst(filename.split(".")[0].replaceAll("-"," "))
                        }${filename.indexOf("target") ? ", with targeted resources" : ""
                        }, ${new Date(fs.statSync(path.resolve(dataFolder, filename)).mtimeMs).toLocaleString()}`
                    }})
        const selection = await vscode.window.showQuickPick(history, {
            placeHolder: "Select a history file",
            title: "Select a history file"
        });
        const document = await vscode.workspace.openTextDocument(path.resolve(dataFolder, selection.filename))
        vscode.window.showTextDocument(document)
        
        });
    }

    constructor(context, logger, stateManager) {
        super(context, logger, stateManager, "plan-history");
        this.skipTFCommand = true
        this.redirect = true
    }
}

module.exports = { TerraformPlanHistoryHandler }
