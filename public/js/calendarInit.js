$(document).ready(function() {
  var start, end;
  var calendar = $("#calendar");

  var writeFlag = false;

  calendar.fullCalendar({
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
      center: 'agendaDay,agendaTwoDay,addEventButton' // buttons for switching between views
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
    customButtons: {
      addEventButton: {
        text: '작성',
        click: function() {
          alert('시간을 선택해주세요(클릭 혹은 드래그)');
          writeFlag = true;
          // console.log(writeFlag);
          calendar.fullCalendar('option', 'selectable', true);
          // calendar.fullCalendar('option', 'unselectAuto', false);
          // console.log(calendar.fullCalendar({selectable: true}));
          // if (date.isValid()) {
          //   $('#calendar').fullCalendar('renderEvent', {
          //     title: 'dynamic event',
          //     start: date,
          //     allDay: true
          //   });
          //   alert('Great. Now, update your database...');
          // } else {
          //   alert('Invalid date.');
          // }
        }
      }
    },
    eventClick: function(event, element) {
      console.log(event);
      $('#eventBlockModal').on('shown.bs.modal', function () {
        var startDate = event.start.format('a h:mm');
        var endDate = event.end.format('a h:mm');
        $("#eventBlockModal .modal-title").text(startDate + ' - ' + endDate);
        $('#eventBlockModal #eventContent').text(event.title);
      });

      $("#eventBlockModal").modal();
      // event.title = "CLICKED!";
      //
      // $('#calendar').fullCalendar('updateEvent', event);

    },
    // dayClick: function(date, jsEvent, view) {
    //
    //   console.log('Clicked on: ' + date.format());
    //
    //   // change the day's background color just for fun
    //   // $(this).css('background-color', 'red');
    //
    // },
    // selectable: false,
    selectHelper: true,
    longPressDelay : 10,
    select: function( start, end ) {
      if(confirm('계속 진행하실까요?')){
        var startDate = start.format('a h:mm');
        var endDate = end.format('a h:mm');
        // calendar.fullCalendar('option', 'unselectAuto', true);

        $('#addBlockModal').on('shown.bs.modal', function () {
          $("#addBlockModal .modal-title").text(startDate + ' - ' + endDate);
          $('#addBlockModal #addContent').focus()
        });
        $("#addBlockModal").modal();
        console.log($("#myModal #addContent").val());
        $("#addBlockButton").click( function(e) {
          if( confirm('추가 하시겠습니까?') ){
              calendar.fullCalendar( 'renderEvent', {
                id: '01062610332',
                resourceId: '01062610332',
                title: $("#addContent").val(),
                start: moment(start),
                end: moment(end),
                allDay: false,
                color: getRandomColor(),
                textColor: 'black',
              }, true);
          }

          $("#addBlockButton").off('click');

          calendar.fullCalendar('option', 'selectable', false);
        });
      }
      else{
        calendar.fullCalendar('unselect');
      }

    },
    selectAllow: function(selectInfo) {
      console.log(selectInfo);
    },
  });

});

function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
