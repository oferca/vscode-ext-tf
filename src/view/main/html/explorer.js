
const folders = list => list.map(
    project => `
    <li class="folders">
        <a title="${project.filePath}" class="folders">
            <span class="icon folder full"></span>
            <span class="name">${project.name}</span>
            <span class="details">${project.regions.join()}</span>
        </a>
    </li>
`
).join("")

module.exports.html = list => {
    return `
<html>
    <head>
    </head>
    <body>
    <div class="filemanager">

		<div class="search">
			<input type="search" placeholder="Find a file..">
		</div>

		<div class="breadcrumbs"><span class="folderName">files</span></div>

		<ul class="data animated" style="">
            ${folders(list)}
            <li class="folders"><a href="files/Important Documents" title="files/Important Documents" class="folders"><span class="icon folder full"></span><span class="name">Important Documents</span> <span class="details">2 items</span></a></li><li class="folders"><a href="files/Movies" title="files/Movies" class="folders"><span class="icon folder full"></span><span class="name">Movies</span> <span class="details">1 item</span></a></li><li class="folders"><a href="files/Music" title="files/Music" class="folders"><span class="icon folder full"></span><span class="name">Music</span> <span class="details">3 items</span></a></li><li class="folders"><a href="files/Nothing here" title="files/Nothing here" class="folders"><span class="icon folder"></span><span class="name">Nothing here</span> <span class="details">Empty</span></a></li><li class="folders"><a href="files/Photos" title="files/Photos" class="folders"><span class="icon folder full"></span><span class="name">Photos</span> <span class="details">5 items</span></a></li><li class="files"><a href="files/Readme.html" title="files/Readme.html" class="files"><span class="icon file f-html">.html</span><span class="name">Readme.html</span> <span class="details">344 Bytes</span></a></li>
        </ul>

		<div class="nothingfound" style="display: none;">
			<div class="nofiles"></div>
			<span>No files here.</span>
		</div>

	</div>
    </body>
</html>
`}