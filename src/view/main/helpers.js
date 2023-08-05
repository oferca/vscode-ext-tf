const fs = require('fs');
const path = require('path');
const util = require('util');
const vscode = require('vscode');
const statAsync = util.promisify(fs.stat);
const {
  addProvider,
  getProviders,
  tfObjectCount,
  isLegitFolder,
  transformRegions,
  getRelativeFolderPath
} = require("../../shared/methods")

const workspaceFolders = vscode.workspace.workspaceFolders;
const projectRoot = workspaceFolders[0].uri.fsPath
const isEven = (item, idx) => (idx / 2 === Math.floor(idx / 2))
const isOdd = (item, idx) => !isEven(item, idx)

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

async function findFilesWithExtension (startPath, targetExtension, fileList) {
  fileList = fileList || {};
  const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(startPath));

  for (const item of items){

    const [fileName, fileType] = item,
      filePath = path.join(startPath, fileName),
      legit = isLegitFolder(fileType, fileName)

    if (legit) await findFilesWithExtension(filePath, targetExtension, fileList)
    if (path.extname(filePath) !== targetExtension) continue;

    const projectName = path.basename(path.dirname(filePath)),
      content = fs.readFileSync(filePath, 'utf8').replace(/\s/g, ''),
      stats = await statAsync(filePath),
      hasTerraformBlock = content.indexOf("terraform{") > -1,
      fileIsTFState = filePath.indexOf("terraform.tfstate") > -1,
      folderIsTerraformProject = hasTerraformBlock || fileIsTFState,
      { resources, modules, datasources, lastModifiedTimestamp, providers, regions } = fileList[projectName]

    fileList[projectName] = fileList[projectName] || {}
    fileList[projectName].name = projectName
    fileList[projectName].lastModifiedTimestamp = Math.max(lastModifiedTimestamp || 0, stats.mtime.getTime());
    fileList[projectName].resources = tfObjectCount(content, resources, "resource\"")
    fileList[projectName].modules = tfObjectCount(content, modules, "module\"")
    fileList[projectName].datasources = tfObjectCount(content, datasources, "data\"")
    
    if(folderIsTerraformProject) {

      fileList[projectName].isProject = true
      fileList[projectName].projectPath = startPath;
      fileList[projectName].projectPathRelative = getRelativeFolderPath(startPath, projectRoot)
      fileList[projectName].providers = providers || []

      getProviders(content).filter(isEven)
        .forEach(provider => addProvider(provider, providers))
    }

    if (providers) providers = fileList[projectName].providers.filter(onlyUnique)
    
    const regions = content.split("region=\"").filter(isOdd)
    fileList[projectName].regions = regions || []
    let oddRegions = fileList[projectName].regions
    oddRegions.forEach(region => transformRegions(region, oddRegions))
    oddRegions = oddRegions.filter(region => region.length < 25).filter(onlyUnique)
  }
  return fileList;
}

module.exports.findFilesWithExtension = findFilesWithExtension