function addScriptTriggerTimeBAsed() {
	ScriptApp.newTrigger('myFunction')
		.timeBased()
		.onWeekDay(ScriptApp.WeekDay.MONDAY)
		.atHour(9)
		.create();
}
