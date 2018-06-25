$(document).ready(function() {
  console.log(new Date().getHours()-1+':'+Math.floor(new Date().getMinutes()/10)*10+':'+new Date().getSeconds());
  var start, end;
  var calendar = $("#calendar, #calendar-nextday");

  var writeFlag = false;

  calendar.fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    themeSystem: 'standard',
    defaultView: 'agenda',
    groupByResource: true,
    resources: [
      { id: '01062610332', title: '정용석' },
    ],
    allDaySlot: false,
    slotDuration: '00:10:00',
    slotLabelFormat: 'a h:mm',
    nowIndicator: true,
    scrollTime: new Date().getHours()-1+':'+Math.floor(new Date().getMinutes()/10)*10+':'+new Date().getSeconds(),
    // height: '1000',
    height: 'parent',
    aspectRatio: 1,
    dragScroll : true,
    header: {
      // center: 'oneday,twoday,addEventButton',
      right: '',
    },
    header: false,
    viewRender: function(view) {
        var title = view.title;
        $("#title").html(title);
  	},
    views: {
      oneday: {
        type: 'agenda',
        duration: { days: 1 },
        buttonText: '1일',
      },
      twoday: {
        type: 'agenda',
        duration: { days: 2 },
        buttonText: '2일'
      }
    },
    customButtons: {
      // onedayButton: {
      //   text: '1일',
      //   click: function() {
      //     $("#calendar-nextday").hide();
      //   }
      // },
      //
      // twodayButton: {
      //   text: '2일',
      //   click: function() {
      //     $("#calendar-nextday").show();
      //   }
      // },

      addEventButton: {
        text: '작성',
        click: function() {
          alert('시간을 선택해주세요(클릭 혹은 드래그)');
          writeFlag = true;
          calendar.fullCalendar('option', 'selectable', true);
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

    },
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

  $("#dayDisplay").click( function(e) {
    if($(this).attr('data-type') === 'twoday'){
      calendar.fullCalendar('changeView', 'twoday');
      $(this).attr('data-type', 'oneday');
      $(this).text('1일');
    }
    else{
      calendar.fullCalendar('changeView', 'oneday');
      $(this).attr('data-type', 'twoday');
      $(this).text('2일');
    }

  });

  $("#addButton").click( function(e) {
    console.log('add button click');
    alert('시간을 선택해주세요(클릭 혹은 드래그)');
    writeFlag = true;
    calendar.fullCalendar('option', 'selectable', true);
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
