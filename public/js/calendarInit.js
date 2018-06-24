$(document).ready(function() {

  $('#calendar').fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    themeSystem: 'standard',
    defaultView: 'agendaDay',
    groupByResource: true,
    resources: [
      { id: '01062610332', title: '정용석' },
    ],
    allDaySlot: false,
    slotDuration: '00:10:00',
    slotLabelFormat: 'a h:mm',
    nowIndicator: true,
    height: 'auto',
    aspectRatio: 1,
    header: {
      center: 'agendaDay,agendaTwoDay' // buttons for switching between views
    },
    views: {
      agendaDay: {
        type: 'agenda',
        duraction: { days: 1 },
        buttonText: '1일',
      },
      agendaTwoDay: {
        type: 'agenda',
        duration: { days: 2 },
        buttonText: '2일'
      }
    },
    eventClick: function(event, element) {

      event.title = "CLICKED!";

      $('#calendar').fullCalendar('updateEvent', event);

    },
    dayClick: function(date, jsEvent, view) {

      console.log('Clicked on: ' + date.format());

      // change the day's background color just for fun
      // $(this).css('background-color', 'red');

    },
    selectable: true,
    selectHelper: true,
    select: function( start, end ) {
      console.log('selecting?');
      console.log(start, end);
    }
  });

});
