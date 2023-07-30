const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { html } = require("./html");
const { getActions } = require('../../shared/actions');
const { changeFolderKey, credentialsKey, selectedProjectJsonKey } = require("../../shared/constants");
const { getProjectsCache } = require("../../shared/methods");
const { handleCommand, createCB } = require('./messages');

let tfProjectsCache = null

class WebViewManager {
  intro
  sideBarWebView
  commandLaunched
  outputFileContent
  webViewProviderScm
  webViewProviderExplorer

    async render(completed = false, tfCommand){

      // Parameter definitions
      const { fileHandler, shellHandler } = this.commandsLauncher.handler || {}
      const outputFileExists = this.commandsLauncher.handler && fileHandler && fileHandler.initialized
      const folder = this.stateManager.getState(changeFolderKey)
      const credentials = this.stateManager.getState(credentialsKey)
      let planSucceded = (tfCommand && tfCommand.toLowerCase().indexOf("plan") > -1); // planSuccessful(this.outputFileContent)
      const preferences = { folder, credentials, showWarning: folder || credentials}
      
      // Update output
      this.outputFileContent = outputFileExists ? fs.readFileSync( fileHandler.outputFileNoColor, shellHandler.fileEncoding) : undefined

      // Render
      const params = [
        preferences,
        getActions(this.stateManager),
        Math.random(),
        planSucceded,
        tfCommand,
        completed,
        this.commandLaunched
      ]
      if (this.sideBarWebView) this.sideBarWebView.html = html(...params)
     
      tfProjectsCache = await getProjectsCache(tfProjectsCache)
      
      tfProjectsCache.forEach(project => {
        project.credentials = this.stateManager.getState(credentialsKey + "_" + project.name) || ""
      })
      const paramsExplorer = [...params]
      paramsExplorer.push(tfProjectsCache)
      paramsExplorer.push(this.stateManager.getState(selectedProjectJsonKey).replaceAll("\"", "'"))
      if (this.projectExplorer) this.projectExplorer.html = html(...paramsExplorer)
      this.withAnimation = false
       
    }

    handlePreferences(message) {
      const oldPreferences = {
        userFolder: this.stateManager.getUserFolder(),
        credentials: this.stateManager.getState(credentialsKey)
      }
      const currentProjectOpt1 = JSON.parse(message.CURRENT_PROJECT ? message.CURRENT_PROJECT.replaceAll("'", "\"") : null)
      const currentProjectOpt2 = JSON.parse(message.json ? message.json.replaceAll("'", "\"") : null)
      const currentProject = currentProjectOpt1 || currentProjectOpt2
      if (!currentProject) return
      this.stateManager.updateState(credentialsKey + "_" + currentProject.name, message.credentials)
      const projectPath = currentProject ? currentProject.filePath + currentProject.name : null
      this.stateManager.setUserFolder(projectPath)
      if (message.credentials && message.credentials.length) this.stateManager.updateState(credentialsKey)
      return oldPreferences
    }
    async messageHandler (message) {
      if (!message) return;
      const oldPrefs = this.handlePreferences(message)
      const { tfCommand, command } = message
      const { handler, launch } = this.commandsLauncher
      const cb = createCB(message, handler, this.render, oldPrefs, this.stateManager)
      const res = handleCommand( tfCommand || command, this.logger, handler, launch, cb, this ) 
      return res
    }
  
    initSideBarView () {
      const sideBarWebView = {
        enableScripts: true,
          resolveWebviewView: webviewView => {
            this.sideBarWebView = webviewView.webview;
            this.sideBarWebView.options = { enableScripts: true };
            this.render()
            this.sideBarWebView.onDidReceiveMessage(this.messageHandler)
            webviewView.onDidDispose(() => {
              this.sideBarWebView && this.sideBarWebView.dispose();
            });
          }
        }
        this.sideBarWebViewProviderExplorer = vscode.window.registerWebviewViewProvider('terraform-button-view-explorer', sideBarWebView );
        this.sideBarWebViewProviderScm = vscode.window.registerWebviewViewProvider('terraform-button-view-scm', sideBarWebView );
        this.context.subscriptions.push(this.sideBarWebViewProvider);
    }

    async initProjectExplorer() {
      this.projectExplorer && this.projectExplorer.dispose()
      tfProjectsCache = await getProjectsCache(tfProjectsCache)
      const panel  = vscode.window.createWebviewPanel(
        'catCoding', // Identifies the type of the webview. Used internally
        'Cat Coding', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        { enableScripts: true } // Webview options. More on these later.
      );
      panel.onDidDispose(() => {
        this.projectExplorer.disposed = true
      });
      this.projectExplorer = panel.webview
      this.projectExplorer.onDidReceiveMessage(
        async (message) => {
          const res = await this.messageHandler(message);
          if (res === "render") this.render()
          const rawJson = message.json || message.CURRENT_PROJECT
          if (!rawJson) return res
          const parsed = JSON.parse(rawJson.replaceAll("'", "\""))
          const { credentials } = message
          parsed.credentials = credentials
          const json = JSON.stringify(parsed).replaceAll("\"", "'")
          const shouldUpdateProject = res == "selected-project" || json
          if (shouldUpdateProject) this.stateManager.updateState(selectedProjectJsonKey, json )
          return res
        },
        undefined,
        this.context.subscriptions
      )
      setTimeout(async () => { tfProjectsCache = await getProjectsCache(tfProjectsCache) })
      return panel
    }
    
    constructor(context, logger, stateManager, commandsLauncher){
        this.context = context
        this.logger = logger
        this.stateManager = stateManager
        this.commandsLauncher = commandsLauncher
        this.withAnimation = true
        this.commandLaunched = false
        this.render = this.render.bind(this)
        this.messageHandler = this.messageHandler.bind(this)
    }
}

module.exports = { WebViewManager }

const isEven = (item, idx) => (idx / 2 === Math.floor(idx / 2))
const isOdd = (item, idx) => !isEven(item, idx)

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

async function findFilesWithExtension (startPath, targetExtension, fileList) {
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

        const workspaceFolders = vscode.workspace.workspaceFolders;
        const roorFolderName = workspaceFolders[0].name
        fileList[projectName].filePath = filePath
          .split(projectName)[0]
          .split(roorFolderName)[1];

        const providers1 = content.split("required_providers{")
        const providers2 = providers1.length > 1 ? providers1[1].split("}}")[0] : []
        const providersArr = providers2.length ? providers2.split("={"): []
        fileList[projectName].providers = (fileList[projectName].providers || [])
        providersArr.length ? providersArr.filter(isEven).forEach(
          prov => {
            const provArr = prov.split("\"}")
            const provider = provArr.length > 1 ? provArr[1] : (provArr[0].length < 25 ? provArr[0] : "")
            if (provider.length) fileList[projectName].providers.push(provider)
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