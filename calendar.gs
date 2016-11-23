/**
 CalendarApp Documentation:
 https://developers.google.com/apps-script/reference/calendar/
 
 This script can:
 + Create a calendar
 + Find an existing calendar
 + Clear a calendar of all existing events
 +
 + Delete a calendar
 + Populate a calendar with events
 */
var PUTZPLAN_CALENDAR_NAME = 'Putzplan';

var putzplanAction = {
    create: function(){
        var calendar = findOrCreateCalendar_(PUTZPLAN_CALENDAR_NAME);
        Logger.log('Create or found calendar %s', calendar.getName());
    },
    
    remove: function(){
        deleteCalendar_(PUTZPLAN_CALENDAR_NAME)
        Logger.log('Putzplan was deleted');
    },
    
    populate: function() {
        populate_();
        Logger.log('Putzplan was cleared and filled again.');
    },
    
    globalInfo: function(){
        var startTime = new Date('12/01/2016')
        var endTime = new Date('01/01/2017');
        
        listCalendars_(startTime, endTime);
    }
}

function populate_(){
    var event;
    var SCHEDULE_VALID_IN_WEEKS = 6;
    putzplan = findOrCreateCalendar_(PUTZPLAN_CALENDAR_NAME);
    clearCalendarOfAllEvents_(putzplan);
    
    //march equinox
    var dateSpring = new Date('03/30/2017 12:00');
    
    // start by cleaning the whole flat together
    putzplan.createAllDayEvent('Frühjahrsputz', dateSpring);
    
    //the actual schedule will start a week later.
    var startCleaningSchedule = getDaysLater(dateSpring, 7);
    var startPutzplan = putzplan.createAllDayEvent('Start Putzplan!', startCleaningSchedule);
    
    // Somebody has to clean the toilette & bath every saturday
    var upcomingSaturday = getFollowingWeekday(startCleaningSchedule, 'saturday');
    var thenEverySaturday = CalendarApp.newRecurrence().addWeeklyRule().onlyOnWeekday(CalendarApp.Weekday.SATURDAY).times(SCHEDULE_VALID_IN_WEEKS);
    event = putzplan.createAllDayEventSeries('Toilette & Bad', upcomingSaturday, thenEverySaturday);
    event.addGuest('bath-cleaners@example.com');
    
    // event.setColor(CalendarApp.Color.YELLOW)
    // you can only set a color in the extended Calendar Service (enable via Resources > Advanced, separate syntax)
    // https://developers.google.com/apps-script/guides/services/advanced
    
    // And another one has to clean the kitchen
    var upcomingSunday = getFollowingWeekday(startCleaningSchedule, 'sunday');
    var thenEverySunday = CalendarApp.newRecurrence().addWeeklyRule().onlyOnWeekday(CalendarApp.Weekday.SUNDAY).times(SCHEDULE_VALID_IN_WEEKS);
    event = putzplan.createAllDayEventSeries('Küche', upcomingSunday, thenEverySunday);
    event.addGuest('kitchen-crew@example.com');
    
    // And there is a lucky one who has work ony every two weeks: The stairs of the house. But it must be in the morning
    var upcomingThursdayStart = getFollowingWeekday(startCleaningSchedule, 'thursday');
    upcomingThursdayStart.setHours(8);
    var upcomingThursdayEnd = new Date(upcomingThursdayStart);
    upcomingThursdayEnd.setHours(12);
    
    var thenEverySecondThursday = CalendarApp.newRecurrence().addWeeklyRule().onlyOnWeekday(CalendarApp.Weekday.THURSDAY).times(parseInt(SCHEDULE_VALID_IN_WEEKS/2));
    event = putzplan.createEventSeries('Kehrwoche', upcomingThursdayStart, upcomingThursdayEnd, thenEverySecondThursday);
    event.addGuest('stairmanager@example.com');
}

function listCalendars_(startTime, endTime) {
    var calendars = CalendarApp.getAllOwnedCalendars();
    
    for(var i = 0, l = calendars.length; i<l; i++){
        var calendar = calendars[i];
        
        
        var eventsUntilThen = calendar.getEvents(startTime, endTime);
        Logger.log('➡ Found calendar %s with %s events.', calendar.getName(), eventsUntilThen.length );
        
        for(var j = 0, eventCount = eventsUntilThen.length; j < eventCount; j++ ){
            var event = eventsUntilThen[j];
            Logger.log('······it includes event %s with %s gueests.', event.getTitle(), event.getGuestList().length);
        }
    }
}

function findOrCreateCalendar_(name) {
    var calendars = CalendarApp.getAllOwnedCalendars();
    
    for(var i = 0, l = calendars.length; i<l; i++){
        var calendar = calendars[i];
        if(calendar.getName() === name){
            return calendar;
        }
    }
    
    // Nothing found, create one
    var calendar = CalendarApp.createCalendar(name, {
        summary: 'A household chores agenda.',
        color: CalendarApp.Color.LIME
    });
    
    return calendar;
}

function clearCalendarOfAllEvents_(calendar) {
    var now = new Date();
    var untilEndOfTime = new Date('01/01/2050');
    var events = calendar.getEvents(now, untilEndOfTime);
    
    while(events.length){
        var event = events.pop();
        event.deleteEvent();
    }
}

function deleteCalendar_(name){
    // Yeah this would first create then immediately delete a non-existing calendar :-)
    var putzplan = findOrCreateCalendar_(name);
    putzplan.deleteCalendar();
}

// given a base date we want to know which date has the first following weekday [MON, TUE, ..]
// this nice snippet is from here: https://productforums.google.com/forum/#!topic/docs/R11TUALj_ow

function getFollowingWeekday(baseDate, weekDay){
    var date = baseDate;
    var awd = {"sunday":1, "monday":2, "tuesday":3, "wednesday":4, "thursday":5, "friday":6, "saturday":7}
    var offset = awd[  weekDay.toLowerCase() ]  ;
    date.setDate( date.getDate()-date.getDay()+6+offset ) ;
    return offset ? date : (weekDay + ': not a valid weekday name')  ;
}

// returns new date n days after the given base date
function getDaysLater(baseDate, daysLater) {
    var msPerDay = 24 * 60 * 60 * 1000;
    return new Date(baseDate.getTime() + (msPerDay) * daysLater );
}

