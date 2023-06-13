module.exports.html = `
<html>
<head>
  <style>
    .button {
      background-color: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      transition: background-color 0.3s;
      max-width: 300px;
      /*font-size: 13px;*/
      letter-spacing: 0.5px;
      margin-block-start: 1em;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      padding: 4px;
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--vscode-button-border,transparent);
      line-height: 18px;
    }

    .button:hover {
      background-color: var(--vscode-button-hoverBackground);
    }

    .button:active {
      background-color: --vscode-textLink-activeForeground;
    }
    button.display{
      background-color: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
  </style>
</head>
<body>
  <button class="button" id="button" onclick="openTFLauncher()">Open Terraform Launcher</button>
  <script>
    const vscode = acquireVsCodeApi();
    function openTFLauncher() { 
      vscode.postMessage({ command: 'openTFLauncher' });
    }
  </script>
</body>
</html>
`;