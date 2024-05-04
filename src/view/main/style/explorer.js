const terraformUpAndRunning = "https://github.com/oferca/vscode-ext-tf/blob/main/assets/terraform-up-and-running.png?raw=true"

module.exports.style = `
.explorer .book-affiliate{
	position: absolute;
	top: 90px;
	z-index: 9999999;
}
.explorer .book-affiliate.hashicorp{
	right: 35px;
}
.explorer .book-affiliate img{
	height: 145px;
    opacity: 0; /* Start with transparency */
    animation: fadeIn 3s ease-in-out 5s forwards; /* Animation name, duration, timing function, delay, and fill mode */
}

@keyframes fadeIn {
    from {
        opacity: 0; /* Start from fully transparent */
    }
    to {
        opacity: 1; /* End with full opacity */
    }
}
.explorer #folders-list{
	margin-top: 110px;
}
.explorer .prefs{
  display: none;
}

.explorer .pref, .pref-change{
	font-size: 11px;
	position: absolute;
    top: 205px;
}

@charset "utf-8";

.explorer #main-container{
  max-width: 100%
}

/*-------------------------
	Simple reset
--------------------------*/

*{
	margin:0;
	padding:0;
}


/*-------------------------
	Demo page
-------------------------*/

body {
	background-color: #0e3858;
	font: 14px normal Arial, Helvetica, sans-serif;
	z-index: -4;
}


/*-------------------------
	File manager
-------------------------*/


#filemanager {
	width: 95%;
	max-width:1340px;
	position: relative;
  text-align: left;
  padding-top: 60px;
}

@media all and (max-width: 965px) {
	#filemanager {
		padding: 1px;
	}
}

/*-------------------------
	Breadcrumps
-------------------------*/



#filemanager .breadcrumbs.header {
    background:  linear-gradient(to right,  #343a40, var(--vscode-textLink-foreground), var(--vscode-textLink-foreground), #343a40, #343a40);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    background-position: 150% center;
    background-repeat: no-repeat;
	text-align: center;
	font-size: 30px;
}
#filemanager .breadcrumbs.header.anim-text {
	margin-top: 130px;
	animation: h1anim 8s linear forwards;
}
#filemanager .breadcrumbs.header.static {
	margin-top: 80px;
	animation: h1animstatic 8s linear forwards;
	font-size: auto;
}
@keyframes h1anim {
    from {
        background-position: 150% center;
    }
    to {
        background-position: 0 center;
      }
}
@keyframes h1animstatic {
    from {
        background-position: 100% center;
    }
    to {
        background-position: 0 center;
      }
}

#filemanager .breadcrumbs {
	color: #e7e7e9;
	margin-left:20px;
	font-size: 22px;
	font-weight: 700;
	line-height: 35px;
	text-align: left;
}

#filemanager .breadcrumbs a:link, .breadcrumbs a:visited {
	color: #e7e7e9;
	text-decoration: none;
}

#filemanager .breadcrumbs a:hover {
	text-decoration: underline;
}

#filemanager .breadcrumbs .arrow {
	color:  #6a6a72;
	font-size: 24px;
	font-weight: 700;
	line-height: 20px;
}




/*-------------------------
	Content area
-------------------------*/

#filemanager .data {
	margin-top: 80px;
	z-index: -3;
}

#filemanager .data.animated {
	-webkit-animation: showSlowlyElement 700ms; /* Chrome, Safari, Opera */
	animation: showSlowlyElement 700ms; /* Standard syntax */
}

#filemanager .data li {
	border-radius: 3px;
	/* background-color: #4a7da5; */
	background-color: #375f7f;
	width: 307px;
	height: 118px;
	list-style-type: none;
	margin: 10px;
	display: inline-block;
	position: relative;
	overflow: hidden;
	padding: 0.3em;
	z-index: 1;
	cursor: pointer;
	box-sizing: border-box;
	transition: 0.3s background-color;
}

#filemanager .data li:hover {
	background-color: #42424E;
}

#filemanager .data li a {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

#filemanager .data li .name {
	color: #ffffff;
	font-size: 17px;
	font-weight: 545;
	line-height: 20px;
	width: -webkit-fill-available;
	white-space: nowrap;
	display: inline-block;
	position: absolute;
	overflow: hidden;
	text-overflow: ellipsis;
	top: 40px;
}

#filemanager .data li .details {
	color: #b6c1c9;
    font-size: 10px;
    font-weight: 400;
    width: -webkit-fill-available;
    height: 10px;
    top: 64px;
    white-space: nowrap;
    position: absolute;
    display: inline-block;
    line-height: 15px;
	opacity: 0.65;
}

#filemanager .nothingfound {
	background-color: #373743;
	width: 23em;
	height: 21em;
	margin: 0 auto;
	display: none;
	font-family: Arial;
	-webkit-animation: showSlowlyElement 700ms; /* Chrome, Safari, Opera */
	animation: showSlowlyElement 700ms; /* Standard syntax */
}

#filemanager .nothingfound .nofiles {
	margin: 30px auto;
	top: 3em;
	border-radius: 50%;
	position:relative;
	background-color: #d72f6e;
	width: 11em;
	height: 11em;
	line-height: 11.4em;
}
#filemanager .nothingfound .nofiles:after {
	content: '×';
	position: absolute;
	color: #ffffff;
	font-size: 14em;
	margin-right: 0.092em;
	right: 0;
}

#filemanager .nothingfound span {
	margin: 0 auto auto 6.8em;
	color: #ffffff;
	font-size: 16px;
	font-weight: 700;
	line-height: 20px;
	height: 13px;
	position: relative;
	top: 2em;
}

@media all and (max-width:965px) {

	#filemanager .data li {
		width: 100%;
		margin: 5px 0;
		margin-top: 95px;
	}
	#filemanager .data{
		margin-top: 95px;
	}

}

/* Chrome, Safari, Opera */
@-webkit-keyframes showSlowlyElement {
	100%   	{ transform: scale(1); opacity: 1; }
	0% 		{ transform: scale(1.2); opacity: 0; }
}

/* Standard syntax */
@keyframes showSlowlyElement {
	100%   	{ transform: scale(1); opacity: 1; }
	0% 		{ transform: scale(1.2); opacity: 0; }
}


/*-------------------------
		Icons
-------------------------*/

.icon {
	font-size: 23px;
}
.icon.folder {
	display: inline-block;
	margin: 1em;
	background-color: transparent;
	overflow: hidden;
}
.icon.folder:before {
	content: '';
	float: left;
	background-color: #7ba1ad;

	width: 1.5em;
	height: 0.45em;

	margin-left: 0.07em;
	margin-bottom: -0.07em;

	border-top-left-radius: 0.1em;
	border-top-right-radius: 0.1em;

	box-shadow: 1.25em 0.25em 0 0em #7ba1ad;
}
.icon.folder:after {
	content: '';
	float: left;
	clear: left;
    background-color: var(--folder-color);
	/*background-color: #a0d4e4;*/
	width: 3em;
	height: 2.25em;

	border-radius: 0.1em;
}
.icon.folder.full:before {
	height: 0.55em;
}
.icon.folder.full:after {
	height: 2.15em;
	box-shadow: 0 -0.12em 0 0 #ffffff;
}

.icon.file {
	width: 2.5em;
	height: 3em;
	line-height: 3em;
	text-align: center;
	border-radius: 0.25em;
	color: #FFF;
	display: inline-block;
	margin: 0.9em 1.2em 0.8em 1.3em;
	position: relative;
	overflow: hidden;
	box-shadow: 1.74em -2.1em 0 0 #A4A7AC inset;
}
.icon.file:first-line {
	font-size: 13px;
	font-weight: 700;
}
.icon.file:after {
	content: '';
	position: absolute;
	z-index: -1;
	border-width: 0;
	border-bottom: 2.6em solid #DADDE1;
	border-right: 2.22em solid rgba(0, 0, 0, 0);
	top: -34.5px;
	right: -4px;
}

.icon.file.f-avi,
.icon.file.f-flv,
.icon.file.f-mkv,
.icon.file.f-mov,
.icon.file.f-mpeg,
.icon.file.f-mpg,
.icon.file.f-mp4,
.icon.file.f-m4v,
.icon.file.f-wmv {
	box-shadow: 1.74em -2.1em 0 0 #7e70ee inset;
}
.icon.file.f-avi:after,
.icon.file.f-flv:after,
.icon.file.f-mkv:after,
.icon.file.f-mov:after,
.icon.file.f-mpeg:after,
.icon.file.f-mpg:after,
.icon.file.f-mp4:after,
.icon.file.f-m4v:after,
.icon.file.f-wmv:after {
	border-bottom-color: #5649c1;
}

.icon.file.f-mp2,
.icon.file.f-mp3,
.icon.file.f-m3u,
.icon.file.f-wma,
.icon.file.f-xls,
.icon.file.f-xlsx {
	box-shadow: 1.74em -2.1em 0 0 #5bab6e inset;
}
.icon.file.f-mp2:after,
.icon.file.f-mp3:after,
.icon.file.f-m3u:after,
.icon.file.f-wma:after,
.icon.file.f-xls:after,
.icon.file.f-xlsx:after {
	border-bottom-color: #448353;
}

.icon.file.f-doc,
.icon.file.f-docx,
.icon.file.f-psd{
	box-shadow: 1.74em -2.1em 0 0 #03689b inset;
}

.icon.file.f-doc:after,
.icon.file.f-docx:after,
.icon.file.f-psd:after {
	border-bottom-color: #2980b9;
}

.icon.file.f-gif,
.icon.file.f-jpg,
.icon.file.f-jpeg,
.icon.file.f-pdf,
.icon.file.f-png {
	box-shadow: 1.74em -2.1em 0 0 #e15955 inset;
}
.icon.file.f-gif:after,
.icon.file.f-jpg:after,
.icon.file.f-jpeg:after,
.icon.file.f-pdf:after,
.icon.file.f-png:after {
	border-bottom-color: #c6393f;
}

.icon.file.f-deb,
.icon.file.f-dmg,
.icon.file.f-gz,
.icon.file.f-rar,
.icon.file.f-zip,
.icon.file.f-7z {
	box-shadow: 1.74em -2.1em 0 0 #867c75 inset;
}
.icon.file.f-deb:after,
.icon.file.f-dmg:after,
.icon.file.f-gz:after,
.icon.file.f-rar:after,
.icon.file.f-zip:after,
.icon.file.f-7z:after {
	border-bottom-color: #685f58;
}

.icon.file.f-html,
.icon.file.f-rtf,
.icon.file.f-xml,
.icon.file.f-xhtml {
	box-shadow: 1.74em -2.1em 0 0 #a94bb7 inset;
}
.icon.file.f-html:after,
.icon.file.f-rtf:after,
.icon.file.f-xml:after,
.icon.file.f-xhtml:after {
	border-bottom-color: #d65de8;
}

.icon.file.f-js {
	box-shadow: 1.74em -2.1em 0 0 #d0c54d inset;
}
.icon.file.f-js:after {
	border-bottom-color: #a69f4e;
}

.icon.file.f-css,
.icon.file.f-saas,
.icon.file.f-scss {
	box-shadow: 1.74em -2.1em 0 0 #44afa6 inset;
}
.icon.file.f-css:after,
.icon.file.f-saas:after,
.icon.file.f-scss:after {
	border-bottom-color: #30837c;
}


/*----------------------------
	The Demo Footer
-----------------------------*/


footer {

	width: 770px;
	font: normal 16px Arial, Helvetica, sans-serif;
	padding: 15px 35px;
	position: fixed;
	bottom: 0;
	left: 50%;
	margin-left: -420px;

	background-color:#1f1f1f;
	background-image:linear-gradient(to bottom, #1f1f1f, #101010);

	border-radius:2px 2px 0 0;
	box-shadow: 0 -1px 4px rgba(0,0,0,0.4);
	z-index:1;
}

footer a.tz{
	font-weight:normal;
	font-size:16px !important;
	text-decoration:none !important;
	display:block;
	margin-right: 300px;
	text-overflow:ellipsis;
	white-space: nowrap;
	color:#bfbfbf !important;
	z-index:1;
}

footer a.tz:before{
	content: '';
	background: url('http://cdn.tutorialzine.com/misc/enhance/v2_footer_bg.png') no-repeat 0 -53px;
	width: 138px;
	height: 20px;
	display: inline-block;
	position: relative;
	bottom: -3px;
}

footer .close{
	position: absolute;
	cursor: pointer;
	width: 8px;
	height: 8px;
	background: url('http://cdn.tutorialzine.com/misc/enhance/v2_footer_bg.png') no-repeat 0 0px;
	top:10px;
	right:10px;
	z-index: 3;
}

footer #tzine-actions{
	position: absolute;
	top: 8px;
	width: 500px;
	right: 50%;
	margin-right: -650px;
	text-align: right;
	z-index: 2;
}

footer #tzine-actions iframe{
	display: inline-block;
	height: 21px;
	width: 95px;
	position: relative;
	float: left;
	margin-top: 11px;
}

@media (max-width: 1024px) {
	#bsaHolder, footer{ display:none;}
}


/*

POPUP
*/

.tf-modal-parent {
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100%;
  display: none;
  z-index: 1000;
}

.tf-modal {
  background: var( --vscode-editor-background);
  width: 85%;
  max-width: 800px;
  padding: 30px;
  position: absolute;
  inset: 50%;
  transform: translate(-50%, -50%);
  font-size: large;
  line-height: 2rem;
  letter-spacing: 0.5px;
  position: relative;
  max-height: 85vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.tf-modal.animated{
  animation: 1s drop;
}

@keyframes drop {
  0% {
      top: -100px;
  }

  100% {
      top: 50%;
  }
}

.x {
    position: absolute;
    inset: 0px 8px auto auto;
    font-size: 32px;
    cursor: pointer;
    color: white;
}

@media only screen and (max-width: 600px) {

  .tf-modal,
  .center {
      width: 80%;
      padding: 1rem;
      z-index: 1000;
  }

}

#project-info li{
  font-size: 14px;
  text-align: left;
  line-height: 25px;
  overflow: hidden;
  white-space: nowrap;
  color: var(--vscode-descriptionForeground);
  display: inline-table;
}
#project-info li:first-child{
	margin-right: 20px;
}
#project-info li:nth-child(3){
	/*margin-left: -10px;*/
}
#project-info li.seperator{
	position: relative;
    border-right: 1px solid var(--vscode-notifications-border);
    height: 35px;
    top: 6px;
    width: 0px;
    border-bottom: none;
    right: 7px;
}
#project-info li:first-child::after{
	height: 20px;
	border-right: 1px solid var(--vscode-descriptionForeground);
}
#project-info ol {
  list-style: none;
  counter-reset: my-awesome-counter;
}
#project-info li {
  counter-increment: my-awesome-counter;
  margin: 19px 0.25rem 0;
  color: var(--vscode-descriptionForeground);
}
#project-info li::before {
    width: auto;
    height: 1.2rem;
    line-height: 1.2rem;
    color: white;
    text-align: center;
    padding: 0;
	color: var(--vscode-button-foreground);
}

#project-info li.project-name::before {
  content: "Project";
}
#project-info li.path::before, #project-info li.workspace::before {
    color: var(--vscode-button-foreground);
    position: absolute;
    margin-top: -16px;
}
#project-info li.path::before {
	content: "Path";
	opacity: 0.8;
}
#project-info li.workspace::before {
	content: "Workspace";
	opacity: 0.8;
}

#project-info ol ol li::before {
  background: #DE51FF;
}
#project-info ol ol ol li::before {
  background: #EE9EFF;
}

.explorer .tf-button-container{
  justify-content: left;
  margin: 42px auto 0px;
}

.explorer #display-output-21{
  justify-content: left;
}

.explorer #display-output-21 tf-button{
  margin-top: 25px;
  justify-content: center;
}

.explorer #intro .content{
  position: absolute;
  width: 100%;
  font-size: 15px;
}

.explorer h4.main{
	font-size: 1.6rem;
    overflow-wrap: break-word;
    color: whitesmoke;
    margin-top: 12px;
}
.explorer h4:not(.main):not(.title-section) {
  color: var(--vscode-editor-foreground);
  word-spacing: normal;
  font-size: 14px;
}
.explorer .expandable{
}
.explorer .expandable h4.title{
    text-align: left;
    margin-left: 10px;
    font-weight: 540;
    line-height: 24px;
	min-height: 10px;
}
.explorer h4.section-title{
    color: var(--vscode-editor-foreground);
    word-spacing: normal;
    font-size: 14px;
    background: var(--vscode-panelSectionHeader-background);
    margin-top: -12px;
    padding: 5px;
    width: 62vw;
	border-bottom: 1px var(--vscode-notifications-border) solid;
}
.explorer .expandable.seperator{
	border-right: 1px solid var(--vscode-notifications-border);
    margin: 0px 8px;
    margin-top: 36px;
    width: 0px;
}
.explorer .expandable.seperator.first{
	display: none;
}
.explorer h1 {
  font-size: 28px;
}

#output-file{
	width: 65%;
    height: 204px;
    padding: 3px;
    margin-top: 22px;
    border-radius: 8px;
    opacity: 1;
    transition: 0.5s border, 0.5s background-image, 0.8s background-color;
    z-index: 9999;
    position: relative;
    box-shadow: 0.5px 0.5px 1px var(--vscode-notifications-border);
    font-size: 13px;
    margin-left: 19px;
    line-height: 16px;
	background: var(--vscode-scrollbar-shadow);
	color: var(--vscode-foreground);
}

.fa-download:before {
    color: #318ca9;
}
.fa-check:before {
    color: green;
}
.fa-clipboard-list:before {
    color: darkblue;
}
.fa-paper-plane:before {
    color: darkorange;
}
.fa-upload:before {
    color: darkred;
}

@media all and (max-width: 860px) {
	#output-file{
		width: 55%;
	}
}

@media all and (max-width: 820px) {
	#outp1ut-file{
		width: 44vw;
	}
}

@media all and (max-width: 665px) {
	#output-file{
		width: 35%;
	}
}

#output-file.shine{
    transition: 0.5s border, 0.5s background-image, 0.8s background-color;
	color: #fff;
	background: linear-gradient(to right, #4d4d4d 0, #fff 10%, #636161 20%);
	background-position: 0;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: shine 7s infinite linear;
	animation-fill-mode: forwards;
	-webkit-text-size-adjust: none;
	font-weight: 600;
	font-size: 30px;
	text-decoration: none;
	white-space: pre-line;
	line-height: 50px;
	word-wrap: break-word;
	text-align: center;
	padding-top: 50px;
	opacity: 0.4;
}


@media all and (max-width:965px) {

	#output-file.shine{
		line-height: 43px;
		font-size: 32px;
	}

}
@-moz-keyframes shine {
	0% {
	  background-position: -30px;
	}
	30% {
	  background-position: 180px;
	}
	60% {
	  background-position: 360px;
	}
	100% {
		background-position: 360px;
	  }
  }
  @-webkit-keyframes shine {
	0% {
	  background-position: -30px;
	}
	30% {
	  background-position: 180px;
	}
	100% {
	  background-position: 360px;
	}
	100% {
		background-position: 360px;
	  }
  }
  @-o-keyframes shine {
	0% {
	  background-position: -30px;
	}
	30% {
	  background-position: 180px;
	}
	60% {
	  background-position: 360px;
	}
	100% {
		background-position: 360px;
	  }
  }
  @keyframes shine {
	0% {
	  background-position: -30px;
	}
	30% {
	  background-position: 180px;
	}
	60% {
	  background-position: 360px;
	}
	100% {
		background-position: 360px;
	  }
  }
  

#output-file.running{
	--angle: 0deg;
	border: 1px solid;
	border-image: linear-gradient(var(--angle),  var(--vscode-button-background), var(--vscode-button-secondaryBackground)) 1;
	animation: 10s rotate linear infinite;
	transition: 0.5s border, 0.5 background-image;
}

@keyframes rotate {
	to {
		--angle: 360deg;
	}
}

@property --angle {
	syntax: '<angle>';
	initial-value: 0deg;
	inherits: false;
}	


#output-file.feedback:not(.running){
	border-image: none;
}

#output-file.error{
    border: 2px solid var(--vscode-editorMarkerNavigationError-background);
}

#output-file.success{
    border: 2px solid var(--vscode-terminalCommandDecoration-successBackground);
}

#output-file.warning{
    border: 2px solid var(--vscode-statusBarItem-warningBackground);
}

#output-file.info{
    border: 2px solid var(--vscode-editorMarkerNavigationInfo-background); 
}


.project {
	overflow-x: scroll;
	overflow-y: clip;
}

  
  /* Custom style for the checkbox */
  .checkbox-label {
    display: block;
    position: relative;
    padding-left: 20px;
    cursor: pointer;
    position: absolute;
    right: 0px;
    margin-right: 40px;
    top: 10px;
    font-size: 11px;
    color: #a7b0da;
    line-height: 15px;
}
  
  /* Hide the default checkbox */
  .checkbox-label input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
  }
  
  /* Create a custom checkmark */
  .checkmark {
	position: absolute;
    top: 0;
    left: 0;
    height: 8px;
    width: 8px;
    background-color: transparent;
    border: 2px solid #a7b0da;
  }
  
  /* Style the checkmark when the checkbox is checked */
  .checkbox-label input:checked ~ .checkmark {
	background-color: background-color: transparent;; /* Replace with your desired checkmark color */
	border-color: #476c89; /* Replace with your desired checkmark color */
  }
  
  /* Adjust the size and position of the checkmark (optional) */
  .checkmark:after {
	content: "";
	position: absolute;
	display: none;
  }
  
  /* Show the checkmark when the checkbox is checked */
  .checkbox-label input:checked ~ .checkmark:after {
	display: block;
  }
  
  /* Customize the checkmark appearance (optional) */
  .checkbox-label .checkmark:after {
	left: 2px;
    top: 0px;
    width: 3px;
    height: 5px;
    border: solid #c0bfd2;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
  }
  
  #filemanager .data li.folders::before{
	content: var(--folder-letter);
    position: absolute;
    top: 45px;
    left: 51px;
    color: white;
    z-index: 9999;
    font-size: 22px;
  }
  #filemanager .data li.folders.current::before{
	transform: scaleY(1.5);
	top: 42px;
  }
  .button-pulse {
	animation: pulse infinite cubic-bezier(0.25, 0, 0, 1);
	animation-duration: 11s;
	animation-delay: 3s;
  }
  @keyframes pulse {
	0%, 18.0001%, 100%{
		box-shadow: 0 0 0 0 white;
	}
	18%{
		box-shadow: 0 0 0 7px rgba(255, 255, 255, 0); 
	}
  }



  .cta-arrow:hover::before {
	background-position-x: calc(100% - var(--shift-distance) * 3.5);
	left: calc(var(--shift-distance) * -4);
	transition: left 0.3s cubic-bezier(0.4, 1.7, 0.7, 0.8), right 0.3s ease,
	  background-position 0.3s ease;
  }

  .cta-arrow:hover {
    transform: translateX(var(--shift-distance));
	padding-left: 15px;
  }
  .cta-arrow::before {
	content: "";
	display: block;
	position: absolute;
	top: 0.25rem;
	right: 0.25rem;
	left: calc(100% - 2rem);
	border-radius: 2rem;
	height: 1.8rem;
	z-index: -1;
	background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'%3E%3Ctitle%3EArrow Forward%3C/title%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M268 112l144 144-144 144M392 256H100'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position-x: calc(100% - 0.4375rem);
	background-position-y: center;
	background-size: 1.125rem;
	background-color: var(--folder-color);
	transition: left 0.3s cubic-bezier(0.34, 1.2, 0.64, 1), right 0.3s ease,
		background-position 0.3s ease;
	min-width: 30px;
	opacity: 0.8;
	}
	

  .cta-arrow {
	color: #b6c1c9; !important;
    --shift-distance: 0.25rem;
    display: inline-block;
    font-weight: 400;
    line-height: 2rem;
    height: 2rem;
	width: 40px !important;
    color: whitesmoke !important;
    text-decoration: none;
    position: absolute !important;
	right: 0px !important;
	left: auto !important;
    padding-right: 2.25rem;
    transform: translateX(0);
    z-index: 1;
    transition: color 0.15s ease-in-out, transform 0.3s ease, -webkit-transform 0.3s ease;
    border-radius: 2em;
	line-height: 37px !important;
    height: 37px;
	top: 0em !important;
    right: 0.25rem !important;
	cursor: pointer;
	font-size: 13px !important;
	font-style: italic !important;;
}
.card{
	margin-bottom: 30px;
    height: 156px;
    cursor: pointer;
    transition: 0.25s all;
	overflow: hidden;
}
.card p {
	overflow: hidden;
    height: 60px;
}
.card:hover {
	background-color: #343a40!important;
	color: #fff;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
.card:not(:hover) .btn.dashboard{
	background-color: #343a40;
	color: #fff;
}
.btn.dashboard{
	position: absolute;
    right: 13px;
    top: 49px;
}
.card-text{
	color: gray;
	font-size: 0.84rem;

}
.card-header {
    padding: 0.45rem 1.25rem !important;
	font-size: 0.91rem !important;
}
.card-body {
	padding: 1rem 1.25rem 1.25rem;
}
.card-title {
    margin-bottom: 0.7rem;
	font-size: 1.1rem !important;
}
.h5, h5 {
    font-size: 1.15rem !important;
}
body.explorer {
	background: lightgray;
}
.folderName{
	color: #343a40;
}
.show-startup{
    text-align: right;
    display: block !important;
	position: absolute !important;
	right: 50px;
    width: auto !important;
	height: 20px;
    line-height: 30px;
	background-color: transparent !important;
	font-size: 20px;
	margin-bottom: none !important;
	margin-top: 20px;
	cursor: pointer;

}
.show-startup .input-group-text{
   background: transparent !important;
   margin-top: 25px;
   cursor: pointer;
}
.show-startup .input-group-prepend{
	position: absolute;
    right: 143px;
	margin-top: -22px;
	cursor: pointer;
}
.folderName{
	margin-top: 0px;
}

#terraform-tofu *{
	cursor: pointer;
}
#terraform-tofu{
	position: absolute;
    left: 34px;
	margin-top: 20px;
	z-index: 999;
	cursor: pointer;
}
`
