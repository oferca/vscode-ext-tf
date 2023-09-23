
const { errorToken, planToken, titleToken, warningToken, forcesReplacementToken, chatGPTFirstLine, changedToken, addedToken, removedToken } = require("../../shared/constants");
const accountIDReplacements = new Map();

module.exports.optimize = outputFileContent => {
    const tokens = [warningToken, errorToken, titleToken, planToken, forcesReplacementToken, changedToken];
    const lines = outputFileContent.split("\n");
    let lastToken
    const filtered = lines.reduce((query, lineParam) => {
        const line = lineParam.replace("│", "").replace("╵", "").replace("╷", "")
        let hasToken = tokens.reduce((accumulator, token) => {
            if (line.indexOf("──────") > -1) lastToken = null
            if (line.indexOf(token) === -1) return accumulator;
            beforeLast = lastToken
            lastToken = token
            return true;
          }, false);
        if(lastToken === warningToken) return (query + "\n" + line)
        if(lastToken === errorToken) return (query + "\n" + line)
        if(lastToken === addedToken && lastToken !== addedToken) return (query + "\n" + line)
        if(lastToken === removedToken && lastToken !== removedToken) return (query + "\n" + line)
        if(lastToken === addedToken) return query
        if(lastToken === removedToken ) return query

        if (!hasToken) return query;
        if (line.indexOf("# (") > -1) return query;//  '(10 unchanged attributes hidden)'
        if (line.indexOf("Reading...") > -1) return query;
        if (line.indexOf("read during apply") > -1) return query;
        if (line.indexOf("(depends on a ") > -1) return query;
        if (line.indexOf("(config refers to") > -1) return query;
        if (line.indexOf("has changed") > -1) return query;
        return (query + "\n" + replaceTokens(line))
    }, "")

    const summary = chatGPTFirstLine + filtered
    const rest = outputFileContent.substr(0, 3600 * 4 - (summary.length))

    return summary + rest
}

// Function to replace account IDs with unique replacements
function replaceTokens(input) {
  const regex = /\b\d{5,}\b/g; // Match numbers with 5 or more digits

  // Replace each matched account ID with a unique replacement
  let replacementCounter = 1;
  const replacedString = input.replace(regex, (match) => {
    if (!accountIDReplacements.has(match)) {
      // Generate a unique replacement for the account ID
      const replacement = `Token${replacementCounter}`;
      accountIDReplacements.set(match, replacement);
      replacementCounter++;
    }
    return accountIDReplacements.get(match);
  });

  return replacedString;
}
