module.exports.animatedButtonStyle = `
.tf-button .spinner, .btn .spinner{
  width: 0px;
  transition: 0.25s width;
  overflow: hidden;
  display: inline-flex;
}
.sidebar .fa-spinner {
  display: none;
}
.animated-button .spinner{
  width: 12px;
  transition: 0.25s width;
}
.explorer .animated-button .fa-spinner{
  display: inline-block;
}
.animated-button .cmd-icon:not(.no-spinner){
  display: none;
}
.explorer .fa-spinner{
  display: none;
}
  
  `