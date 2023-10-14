const fs = require('fs');
const path = require('path');
const util = require('util');
const vscode = require('vscode');
const statAsync = util.promisify(fs.stat);

const {
  addProvider,
  getProviders,
  tfObjectCount,
  transformRegions,
  getRelativeFolderPath
} = require("../../shared/methods-cycle")

const isEven = (item, idx) => (idx / 2 === Math.floor(idx / 2))
const isOdd = (item, idx) => !isEven(item, idx)

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const isLegitFolder = (fileType, fileName) => {
  return fileType === vscode.FileType.Directory && fileName !== ".terraform" && fileName !== ".git"
}

async function findFilesWithExtension (startPath, targetExtension, fileList = {}, projectRoot) {
  const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(startPath));

  for (const item of items){

    const [fileName, fileType] = item,
      filePath = path.join(startPath, fileName),
      legit = isLegitFolder(fileType, fileName)

    if (legit) await findFilesWithExtension(filePath, targetExtension, fileList, projectRoot)
    if (path.extname(filePath) !== targetExtension) continue;

    const projectName = path.basename(path.dirname(filePath)),
      content = fs.readFileSync(filePath, 'utf8').replace(/\s/g, ''),
      stats = await statAsync(filePath),
      hasProviderBlock = content.indexOf("provider\"") > -1,
      fileIsTFState = filePath.indexOf("terraform.tfstate") > -1,
      folderIsTerraformProject = hasProviderBlock || fileIsTFState,
      { resources, modules, datasources, lastModifiedTimestamp, providers, regions } = fileList[projectName] || {}

    fileList[projectName] = fileList[projectName] || {}
    fileList[projectName].name = projectName
    fileList[projectName].lastModifiedTimestamp = Math.max(lastModifiedTimestamp || 0, stats.mtime.getTime());
    fileList[projectName].resources = tfObjectCount(content, resources, "resource\"")
    fileList[projectName].modules = tfObjectCount(content, modules, "module\"")
    fileList[projectName].datasources = tfObjectCount(content, datasources, "data\"")
    
    if(folderIsTerraformProject) {

      fileList[projectName].isProject = true
      fileList[projectName].projectPath = startPath;
      fileList[projectName].projectRoot = projectRoot;
      fileList[projectName].projectPathRelative = getRelativeFolderPath(startPath, projectRoot)
      fileList[projectName].providers = providers || []

      if (providers) getProviders(content).filter(isEven)
        .forEach(provider => addProvider(provider, providers))
    }

    const updatedProviders = fileList[projectName].providers
    if (updatedProviders) fileList[projectName].providers = updatedProviders.filter(onlyUnique)
    
    const oddRegions = content.split("region=\"").filter(isOdd)
    fileList[projectName].regions = regions || []
    fileList[projectName].regions
    oddRegions.forEach(region => transformRegions(region, fileList[projectName].regions))
    fileList[projectName].regions = fileList[projectName].regions.filter(region => region.length < 25).filter(onlyUnique)
  }
  return fileList;
}

module.exports.findFilesWithExtension = findFilesWithExtension