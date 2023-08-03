module.exports.animatedButtonStyle = `

.animated-button {
    -webkit-transform: translate(0%, 0%);
            transform: translate(0%, 0%);
    overflow: hidden;
    text-align: center;
    text-decoration: none;
  }
  
  .animated-button::before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-transition: .2s opacity ease-in-out;
    transition: .2s opacity ease-in-out;
  }
  
  .animated-button::before {
    opacity: 0.2;
  }
  
  .animated-button span {
    position: absolute;
  }
  
  .animated-button span:nth-child(1) {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 2px;
    background: -webkit-gradient(linear, right top, left top, from(var(--vscode-button-background)), to(var(--vscode-editor-foreground)));
    background: linear-gradient(to left, var(--vscode-button-background), var(--vscode-editor-foreground));
    -webkit-animation: 2s animateTop linear infinite;
            animation: 2s animateTop linear infinite;
  }
  
  @-webkit-keyframes animateTop {
    0% {
      -webkit-transform: translateX(100%);
              transform: translateX(100%);
    }
    100% {
      -webkit-transform: translateX(-100%);
              transform: translateX(-100%);
    }
  }
  
  @keyframes animateTop {
    0% {
      -webkit-transform: translateX(100%);
              transform: translateX(100%);
    }
    100% {
      -webkit-transform: translateX(-100%);
              transform: translateX(-100%);
    }
  }
  
  .animated-button span:nth-child(2) {
    top: 0px;
    right: 0px;
    height: 100%;
    width: 2px;
    background: -webkit-gradient(linear, left bottom, left top, from(var(--vscode-button-background)), to(var(--vscode-editor-foreground)));
    background: linear-gradient(to top, var(--vscode-button-background), var(--vscode-editor-foreground));
    -webkit-animation: 2s animateRight linear -1s infinite;
            animation: 2s animateRight linear -1s infinite;
  }
  
  @-webkit-keyframes animateRight {
    0% {
      -webkit-transform: translateY(100%);
              transform: translateY(100%);
    }
    100% {
      -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
    }
  }
  
  @keyframes animateRight {
    0% {
      -webkit-transform: translateY(100%);
              transform: translateY(100%);
    }
    100% {
      -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
    }
  }
  
  .animated-button span:nth-child(3) {
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 2px;
    background: -webkit-gradient(linear, left top, right top, from(var(--vscode-button-background)), to(var(--vscode-editor-foreground)));
    background: linear-gradient(to right, var(--vscode-button-background), var(--vscode-editor-foreground));
    -webkit-animation: 2s animateBottom linear infinite;
            animation: 2s animateBottom linear infinite;
  }
  
  @-webkit-keyframes animateBottom {
    0% {
      -webkit-transform: translateX(-100%);
              transform: translateX(-100%);
    }
    100% {
      -webkit-transform: translateX(100%);
              transform: translateX(100%);
    }
  }
  
  @keyframes animateBottom {
    0% {
      -webkit-transform: translateX(-100%);
              transform: translateX(-100%);
    }
    100% {
      -webkit-transform: translateX(100%);
              transform: translateX(100%);
    }
  }
  
  .animated-button span:nth-child(4) {
    top: 0px;
    left: 0px;
    height: 100%;
    width: 2px;
    background: -webkit-gradient(linear, left top, left bottom, from(var(--vscode-button-background)), to(var(--vscode-editor-foreground)));
    background: linear-gradient(to bottom, var(--vscode-button-background), var(--vscode-editor-foreground));
    -webkit-animation: 2s animateLeft linear -1s infinite;
            animation: 2s animateLeft linear -1s infinite;
  }
  
  @-webkit-keyframes animateLeft {
    0% {
      -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
    }
    100% {
      -webkit-transform: translateY(100%);
              transform: translateY(100%);
    }
  }
  
  @keyframes animateLeft {
    0% {
      -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
    }
    100% {
      -webkit-transform: translateY(100%);
              transform: translateY(100%);
    }
  }
  
  `