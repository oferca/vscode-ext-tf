const { isPowershell } = require("./methods")
const { BashHandler } = require("./shells/bash")
const { PowershellHandler } = require("./shells/powershell")

module.exports.createShellHandler = terminal => (new (isPowershell(terminal) ? PowershellHandler: BashHandler))
