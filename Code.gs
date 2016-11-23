/**
 Our home for this:
 https://sites.google.com/sinnerschrader.com/putzplan
 
 Documentation GAS:
 https://developers.google.com/apps-script/reference
 
 
 */
// 1. provide our calendar
function calendar() {
    putzplanAction.globalInfo();
    //putzplanAction.remove();
    //putzplanAction.create();/**
	Our home for this:
	https://sites.google.com/sinnerschrader.com/putzplan
		
		Documentation GAS:
		https://developers.google.com/apps-script/reference
			
			
			*/
// 1. provide our calendar
	function calendar() {
		putzplanAction.globalInfo();
		//putzplanAction.remove();
		//putzplanAction.create();
		//putzplanAction.populate();
	}

// 2. create our form, create a spreadsheet "database" & register a submit trigger
	function form(){
		//formActions.setup();
		//formActions.listResponses();
		//formActions.writeLatestResponse();
	}

// 2a. small drive example. see folder /putzparty after creation.
	function drive(){
		driveExamples.createSomeFiles();
	}


// 3. provide a web interface to the admin
// Necessary for web app rendering. Must be in Code.gs (just from observation)
	function doGet(request) {
		return HtmlService.createTemplateFromFile('index')
			.evaluate();
	}



// Just for me
	function reset() {
		putzplanAction.remove();
		formActions.remove();
	}
	
	function prepare() {
		putzplanAction.create();
		putzplanAction.populate();
		
		formActions.setup();
	}
	
	//putzplanAction.populate();
}

// 2. create our form, create a spreadsheet "database" & register a submit trigger
function form(){
    //formActions.setup();
    //formActions.listResponses();
    //formActions.writeLatestResponse();
}

// 2a. small drive example. see folder /putzparty after creation.
function drive(){
    driveExamples.createSomeFiles();
}


// 3. provide a web interface to the admin
// Necessary for web app rendering. Must be in Code.gs (just from observation)
function doGet(request) {
    return HtmlService.createTemplateFromFile('index')
        .evaluate();
}



// Just for me
function reset() {
    putzplanAction.remove();
    formActions.remove();
}

function prepare() {
    putzplanAction.create();
    putzplanAction.populate();
    
    formActions.setup();
}
