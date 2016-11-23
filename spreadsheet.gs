/**
 Documentation:
 https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
 */

var sheetApi = {
	findOrCreateSheet: function(foldername, filename){
		// we are using the drive api to create the spreadsheet in a folder.
		// SpreadsheetApp.create will create a file always in the root.
		var folder = driveApi.findOrCreateFolder(foldername);
		var spreadsheetDocument = findOrCreateSpreadsheet_(filename, folder);
		
		return spreadsheetDocument;
	}
}

function findOrCreateSpreadsheet_(filename, folder){
	var file;
	if(false === (file = folderHasSpritesheetFile_(folder, filename))){
		file = createSpreadsheetFile(filename, folder)
	}
	
	return SpreadsheetApp.open(file);
}

function folderHasSpritesheetFile_(folder, filename){
	var files = folder.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '" and title contains "'+ filename +'"' );
	if (files.hasNext()) {
		return files.next();
	}
	return false;
}

function createSpreadsheetFile(filename, folder) {
	var spreadsheet = SpreadsheetApp.create(filename);// create the file in the r
	var spreadsheetFile = DriveApp.getFileById(spreadsheet.getId()); //retrieve the correspondin file object
	var currentFolder = spreadsheetFile.getParents().next();// retrieve the root folder (a file can have multiple parents so we have to use the iterator
	
	// Move to a folder if given
	if(folder){
		folder.addFile(spreadsheetFile); //no copy, just additional parent
		currentFolder.removeFile(spreadsheetFile);// therefore delete old parent (aka old folder)
	}
	
	
	return spreadsheetFile;
}