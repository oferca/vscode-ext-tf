const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { mainCommandId, changeFolderKey, credentialsKey } = require("../shared/constants")
const { html } = require("./page");
const { getActions } = require('../shared/actions');

class ProjectViewer {
  tfFolders

    render(handler, completed = false, tfCommand){
    }
    init () {
       // Define the glob pattern to search for ".tf" files
    const filePattern = '**/*.tf';

    // Find all files matching the pattern in the workspace
    vscode.workspace.findFiles(filePattern).then((fileUris) => {
        // fileUris is an array of URIs representing the matching files
        fileUris.forEach((fileUri) => {
            // Do something with each file URI (e.g., display its path)
            console.log(fileUri.fsPath);
            const folderPath = path.dirname(fileUri.fsPath);
            this.tfFolders[folderPath] = {
              projectName: path.basename(folderPath)
            }
        });
    });
    console.log('tfFolers:', this.tfFolders);
    
    }
    
    constructor(context, logger, stateManager, commandsLauncher){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
        this.commandsLauncher = commandsLauncher
        this.tfFolders = {}
        this.render = this.render.bind(this)
    }
}
module.exports = { ProjectViewer }