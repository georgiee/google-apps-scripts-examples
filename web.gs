// Interface called from the client
function loadSpreadsheetData(){
	var list = formActions.getResponseList();
	return list;
}

// helper function to include html partials
function include(filename) {
	var html = HtmlService.createTemplateFromFile(filename);
	return html.evaluate().getContent();
}
