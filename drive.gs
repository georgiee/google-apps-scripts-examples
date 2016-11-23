/**
 Documentation:
 https://developers.google.com/apps-script/reference/drive/
 
 */

var EXAMPLE_FOLDER_NAME = 'putzparty';

var driveExamples = {
	createSomeFiles: createFiles_,
	deleteThoseFiles: deleteEverything_
}

var driveApi = {
	findOrCreateFolder: findOrCreateFolder_
}

function createFiles_() {
	// Create a folder to work in
	var tempFolder = findOrCreateFolder_(EXAMPLE_FOLDER_NAME);
	Logger.log('found: ' + tempFolder.getName());
	
	// Download a remote file
	var fileToDownload = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png';
	var response = UrlFetchApp.fetch(fileToDownload);
	
	//Save that file
	tempFolder.createFile('anything',response.getBlob()); // use explicit name
	tempFolder.createFile(response.getBlob()); // use the name from the source
	
	// Or generate some data with another google service
	var mapBlob = Maps.newStaticMap().setCenter(' Schackstraße 3, 80539 München').getBlob();
	tempFolder.createFile(mapBlob);
	
	// or plain text
	tempFolder.createFile('hello.md', '# Hello, world!');
	
}

// move all files from the fodler into the trash
function deleteEverything_(){
	var tempFolder = findOrCreateFolder_(EXAMPLE_FOLDER_NAME);
	
	var files = tempFolder.getFiles();
	while (files.hasNext()) {
		var file = files.next();
		file.setTrashed(true);
	}
}

// Custom helper function to find OR crate a folder.
// Multiple creates woudl result in multiple folders with the same name
function findOrCreateFolder_(folderName, folderIterator){
	Logger.log('hasFolderWithName', folderName);
	
	if(!folderIterator) {
		folderIterator = DriveApp.getFolders();
	}
	
	while (folderIterator.hasNext()) {
		var folder = folderIterator.next();
		Logger.log(folder.getName());
		
		if(folder.getName() == folderName) {
			return folder;
		}
		
	}
	
	// no folder found, create it
	return DriveApp.createFolder(folderName);
}