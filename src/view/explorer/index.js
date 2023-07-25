const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { html } = require("./html");

class ProjectExplorer {
  tfFolders

    render(completed = false, tfCommand){
    }
    async init () {
      const workspacePath = vscode.workspace.rootPath;

      if (!workspacePath) {
        vscode.window.showErrorMessage('No workspace is opened.');
        return;
      }
  
      const targetExtension = '.tf';
      const fileList = [];
      const list1 = (await findFilesWithExtension(workspacePath, targetExtension, fileList))
      const list2 = Object.keys(list1).filter(x => list1[x].isProject).map(x => list1[x]);
      console.log('tfFolers:', this.tfFolders);
       // Create and show a new webview
      const panel = vscode.window.createWebviewPanel(
        'catCoding', // Identifies the type of the webview. Used internally
        'Cat Coding', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later.
      );

      // And set its HTML content
      panel.webview.html = html(list2)
    
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
module.exports = { ProjectExplorer }

const isEven = (item, idx) => (idx / 2 === Math.floor(idx / 2))
const isOdd = (item, idx) => !isEven(item, idx)

async function findFilesWithExtension(startPath, targetExtension, fileList) {
  fileList = fileList || {};
  const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(startPath));

  for (const item of items){
    const [fileName, fileType] = item;
    const filePath = path.join(startPath, fileName);

    if (fileType === vscode.FileType.Directory && fileName !== ".terraform" && fileName !== "modules") {
      // Recursively search directories
      await findFilesWithExtension(filePath, targetExtension, fileList);
    } else if (path.extname(filePath) === targetExtension) {
      const projectName = path.basename(path.dirname(filePath))
      fileList[projectName] = fileList[projectName] || {}
      fileList[projectName].name = projectName
      const content = fs.readFileSync(filePath, 'utf8').replace(/\s/g, '');

      const resourcesRegex = new RegExp("resource\"", 'g');
      const resourcesMatches = content.match(resourcesRegex);
      fileList[projectName].resources = (fileList[projectName].resources || 0) + (resourcesMatches || []).length;

      const modulesRegex = new RegExp("module\"", 'g');
      const modulesMatches = content.match(modulesRegex);
      fileList[projectName].modules = (fileList[projectName].modules || 0) + (modulesMatches || []).length;

      const datasourcesRegex = new RegExp("resource\"", 'g');
      const datasourcesMatches = content.match(datasourcesRegex);
      fileList[projectName].datasources = (fileList[projectName].datasources || 0) + (datasourcesMatches || []).length;

      if(content.indexOf("terraform{") > -1) {
        fileList[projectName].isProject = true
        fileList[projectName].filePath = filePath;

        const providers1 = content.split("required_providers{")
        const providers2 = providers1.length > 1 ? providers1[1].split("}}")[0] : []
        const providersArr = providers2.length ? providers2.split("={"): []
        fileList[projectName].providers = (fileList[projectName].providers || [])
        providersArr.length ? providersArr.filter(isEven).forEach(
          prov => {
            const provArr = prov.split("\"}")
            fileList[projectName].providers.push(provArr.length > 1 ? provArr[1] : (provArr[0].length < 25 ? provArr[0] : ""))
          }
        ) : []
      }
      if (fileList[projectName].providers) {
        fileList[projectName].providers = fileList[projectName].providers.filter(onlyUnique)
      }
      const regions = content.split("region=\"").filter(isOdd)
      fileList[projectName].regions = (fileList[projectName].regions || [])
      regions.length && regions.forEach(section => {
        try{
          const parts = section.split("\"")
          if (parts.length < 2) return
          const region = parts[0]
          fileList[projectName].regions.push(region.replaceAll("\""))
        }catch(e){}
      })
      fileList[projectName].regions = fileList[projectName].regions.filter(region => region.length < 25).filter(onlyUnique)
    }
  }
  return fileList;
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
