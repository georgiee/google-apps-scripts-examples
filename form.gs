/**
 FormsApp Documentation:
 https://developers.google.com/apps-script/reference/forms
 
 Your forms:
 https://docs.google.com/forms/u/0/
 
 Check this awesome form/spreadsheet/mail examples:
 https://developers.google.com/apps-script/quickstart/forms
 */

var DRIVE_FOLDER_NAME = 'putzparty';

var formActions = {
	listResponses: function(){
		listReponses_(getCurrentFormId());
	},
	
	setup: function(){
		createForm();
	},
	
	remove: function(){
		var form = FormApp.openById(getCurrentFormId());
		var file = DriveApp.getFileById(form.getId());
		file.setTrashed(true);
	},
	
	writeLatestResponse: function(){
		var form = FormApp.openById(getCurrentFormId());
		var responses = form.getResponses();
		var latest = responses[responses.length - 1];
		saveResponse(latest);
	},
	
	getResponseList: function(){
		var form = FormApp.openById(getCurrentFormId());
		return responsesToList(form);
	}
}

function getCurrentFormId(){
	var userProperties = PropertiesService.getUserProperties();
	return userProperties.getProperty('putzform_id');
}

function responsesToList(form){
	var responses = form.getResponses();
	var list = [];
	
	for (var i = 0; i < responses.length; i++) {
		var formResponse = responses[i];
		var answer = responseToAnswer(formResponse);
		list.push(answer);
	}
	
	return list;
}

function responseToAnswer(response){
	var answer = {};
	
	answer.email = response.getRespondentEmail();
	answer.cleaning = 'n/a';
	answer.birthday = 'n/a';
	answer.name = 'n/a';
	
	var itemResponses = response.getItemResponses();
	
	if(itemResponses[0]){
		answer.cleaning = itemResponses[0].getResponse().toString()
	}
	
	if(itemResponses[1]){
		answer.music = itemResponses[1].getResponse().toString();
	}
	
	if(itemResponses[2]){
		answer.birthday = itemResponses[2].getResponse().toString();
	}
	
	if(itemResponses[3]){
		answer.name = itemResponses[3].getResponse().toString();
	}
	
	return answer;
}

function saveResponse(formResponse){
	var answer = responseToAnswer(formResponse);
	var answers = [answer.email, answer.cleaning, answer.music, answer.birthday, answer.name];
	
	var sheet = getFormSheet();
	sheet.appendRow(answers);
}


function getFormSheet(){
	var document = sheetApi.findOrCreateSheet(DRIVE_FOLDER_NAME, 'putzparty');
	var sheet = document.getSheets()[0];
	
	return sheet;
}

// receives an event object. Form form: response & source field
// https://developers.google.com/apps-script/guides/triggers/events
// save the response to our spreadsheet and send a mail to the user/admin of this script.
function onFormSubmit(formEvent) {
	saveResponse(formEvent.response);
	sendMail();
}
//MailApp is the stripped down version of GmailApp. You don't have inbox access with this.
function sendMail(){
	var email = Session.getActiveUser().getEmail();
	MailApp.sendEmail(email, "Your Putzparty form was submitted!", "yeah!");
}

function listReponses_(form_id){
	var form = FormApp.openById(form_id);
	var formResponses = form.getResponses();
	
	for (var i = 0; i < formResponses.length; i++) {
		var formResponse = formResponses[i];
		var itemResponses = formResponse.getItemResponses();
		Logger.log('➡ Found Response ')
		for (var j = 0; j < itemResponses.length; j++) {
			var itemResponse = itemResponses[j];
			Logger.log('······ Response #%s to the question "%s" was "%s"',
				(i + 1).toString(),
				itemResponse.getItem().getTitle(),
				itemResponse.getResponse());
		}
	}
	
	if(formResponses.length == 0) {
		Logger.log('no data submitted with this form yet');
	}
}

function createForm() {
	// prepare the sheet, this is our database
	var sheet = getFormSheet();
	sheet.clear();
	sheet.appendRow(['E-Mail','Cleaning','Music','Birthday','Name' ]); //our title row
	
	// Now create the form
	var form = FormApp.create('Putzplan Party Registration');
	form.setCollectEmail(true);
	
	form.setDescription("Hello. So you're interested in our Putzparty?" +
		"If you don't know the concept, here a brief introdcution." +
		"We hate our houshold chores. So we want you to do the cleaning" +
		"But you will get some rewards from us if you to do so" +
		"And it's always a party. So all the people how are helping use are going to have a great party" +
		"Leaving us with a cleaned home" +
		"You can select one reward which you get after reachign a sum of reward points" +
		"The party is always the first rewards for everyvody helping us make our home clean again");
	
	var item = form.addCheckboxItem();
	item.setTitle('What do you want to clean?');
	
	item.setChoices([
		item.createChoice('Master the Hoover (2pt)'),
		item.createChoice('I\'m fine with the toilette (3pt)'),
		item.createChoice('Let me make your windows shine (5pt)'),
		item.createChoice('Is it okay to empty the dishwasher only? (1pt)')
	]);
	
	form.addMultipleChoiceItem()
		.setTitle('What music do you prefere (for the party!)?')
		.setChoiceValues(['HipHop','Disco', 'Classic','Pop'])
		.showOtherOption(true);
	
	form.addPageBreakItem()
		.setTitle('OK. Who are you')
		.setHelpText('We want you to recognize you');
	
	form.addDateItem()
		.setTitle('When were you born?');
	
	form.addTextItem()
		.setTitle('And your name?');
	
	ScriptApp.newTrigger('onFormSubmit').forForm(form).onFormSubmit().create();
	
	Logger.log('Putzplan Part form was created: %s', form.getId());
	Logger.log('Published URL: ' + form.getPublishedUrl());
	Logger.log('Editor URL: ' + form.getEditUrl());
	
	var userProperties = PropertiesService.getUserProperties();
	userProperties.setProperty('putzform_id', form.getId());
}
