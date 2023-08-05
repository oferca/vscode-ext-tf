const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const util = require('util');
const statAsync = util.promisify(fs.stat);

const workspaceFolders = vscode.workspace.workspaceFolders;
const projectRoot = workspaceFolders ? workspaceFolders[0].uri.fsPath : null
const isEven = (item, idx) => (idx / 2 === Math.floor(idx / 2))
const isOdd = (item, idx) => !isEven(item, idx)

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

async function findFilesWithExtension (startPath, targetExtension, fileList) {
  if (!projectRoot) return []
  fileList = fileList || {};
  const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(startPath));

  for (const item of items){
    const [fileName, fileType] = item;
    const filePath = path.join(startPath, fileName);

    if (fileType === vscode.FileType.Directory && fileName !== ".terraform" && fileName !== ".git") {
      // Recursively search directories
      await findFilesWithExtension(filePath, targetExtension, fileList);
    } else if (path.extname(filePath) === targetExtension) {
      const projectName = path.basename(path.dirname(filePath))
      fileList[projectName] = fileList[projectName] || {}
      fileList[projectName].name = projectName
      const content = fs.readFileSync(filePath, 'utf8').replace(/\s/g, '');

      const stats = await statAsync(filePath)
      fileList[projectName].lastModifiedTimestamp = Math.max(fileList[projectName].lastModifiedTimestamp || 0, stats.mtime.getTime());

      const resourcesRegex = new RegExp("resource\"", 'g');
      const resourcesMatches = content.match(resourcesRegex);
      fileList[projectName].resources = (fileList[projectName].resources || 0) + (resourcesMatches || []).length;

      const modulesRegex = new RegExp("module\"", 'g');
      const modulesMatches = content.match(modulesRegex);
      fileList[projectName].modules = (fileList[projectName].modules || 0) + (modulesMatches || []).length;

      const datasourcesRegex = new RegExp("data\"", 'g');
      const datasourcesMatches = content.match(datasourcesRegex);
      fileList[projectName].datasources = (fileList[projectName].datasources || 0) + (datasourcesMatches || []).length;

      if(content.indexOf("terraform{") > -1) {
        fileList[projectName].isProject = true
        fileList[projectName].projectPath = startPath;

        let projectPath = startPath.replace(projectRoot, "");
        if (projectPath.charAt(0)=== "/") projectPath = projectPath.substring(1)
        fileList[projectName].projectPathRelative = projectPath
        
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

module.exports.findFilesWithExtension = findFilesWithExtension