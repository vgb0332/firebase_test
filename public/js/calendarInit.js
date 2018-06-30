$(document).ready(function() {
  console.log(new Date().getHours()-1+':'+Math.floor(new Date().getMinutes()/10)*10+':'+new Date().getSeconds());
  var start, end;
  var calendar = $("#calendar, #calendar-nextday");
  var currentEvent;
  calendar.fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    themeSystem: 'standard',
    defaultView: 'agenda',
    groupByResource: true,
    visibleRange: {
      start: '2018-06-30',
      end: moment().add('1', 'day'),
    },
    resources: [
      { id: '01062610332', title: '정용석' },
    ],
    // events: [
    //   {
    //     // id: '01062610332',
    //     resourceId: '01062610332',
    //     title  : 'event1',
    //     content: {
    //       emotion : 'emotion',
    //       location : 'location',
    //     },
    //     start  : moment(),
    //     end: moment().add(30, 'minutes'),
    //     allDay: false,
    //     color: getRandomColor(),
    //     textColor: '#333',
    //     overlap: false,
    //     // allDay : false // will make the time show
    //   },
    //   {
    //     // id: '01062610332',
    //     resourceId: '01062610332',
    //     title  : 'event2',
    //     content: {
    //       emotion : 'emotion2',
    //       location : 'location2',
    //     },
    //     start  : moment().add(30, 'minutes'),
    //     end: moment().add(60, 'minutes'),
    //     allDay: false,
    //     color: getRandomColor(),
    //     textColor: '#333',
    //     overlap: false,
    //     // allDay : false // will make the time show
    //   },
    // ],
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
    defaultDate: moment(),
    viewRender: function(view) {
        var title = view.title;
        $("#title").html( title );
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
    eventBorderColor: '#333',
    eventClick: function(event, element) {
      if(calendar.fullCalendar('option', 'selectable')) return false;
      $('#eventBlockModal').on('show.bs.modal', function () {
        var startDate = event.start.format('a h:mm');
        var endDate = event.end.format('a h:mm');
        $("#eventBlockModal .modal-title").text(startDate + ' - ' + endDate);
        $('#eventBlockModal #eventContent').text(event.title);
        $('#eventBlockModal #emotionContent').text(event.content.emotion);
        $('#eventBlockModal #locationContent').text(event.content.location);
      });

      $("#eventBlockModal").modal();
      currentEvent = event;

    },
    selectHelper: true,
    longPressDelay : 10,
    selectOverlap: false,
    select: function( start, end ) {
      var startDate = start.format('a h:mm');
      var endDate = end.format('a h:mm');
      if(confirm('시간: ' + startDate + ' ~ ' + endDate + '\n계속 진행하시겠습니까?')){
        // var startDate = start.format('a h:mm');
        // var endDate = end.format('a h:mm');
        // calendar.fullCalendar('option', 'unselectAuto', true);

        $('#addBlockModal').on('show.bs.modal', function () {
          $("#addBlockModal .modal-title").text(startDate + ' - ' + endDate);
          $('#addBlockModal #addContent').focus()
        });
        $("#addBlockModal").modal();

        $("#cancelAddBlockButton").click(function(e) {
          console.log('cancel clicked');
          $("#cancelAddBlockButton, #addBlockButton").off('click');
          calendar.fullCalendar('option', 'selectable', false);
        });

        $("#addBlockButton").click( function(e) {
          var emotion = $("#addBlockModal #emotionSel").val();
          var location = $("#addBlockModal #locationSel").val();
          var title = $("#addContent").val();

          if(emotion === '감정'){
            alert('감정을 선택해주세요!');
            return false;
          }
          if(location === '장소'){
            alert('장소를 선택해주세요!');
            return false;
          }

          if( confirm('추가 하시겠습니까?') ){
              calendar.fullCalendar( 'renderEvent', {
                // id: '01062610332',
                resourceId: '01062610332',
                title: title,
                content: {
                  emotion : emotion,
                  location : location,
                },
                start: moment(start),
                end: moment(end),
                allDay: false,
                color: getRandomColor(),
                textColor: '#333',
                overlap: false,
              }, true);
          }

          console.log(calendar.fullCalendar( 'clientEvents' ))
          $("#cancelAddBlockButton, #addBlockButton").off('click');
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
    snapDuration: "00:10:00",
  });

  $('#emotionSel').mobileSelect({
    title: '감정 수준',
    buttonSave: '확인',
    buttonCancel: '취소',
    animation: 'scale',
    animationSpeed: 400,
    onClose: function(){
        $("#emotionContent").html($(this).val());
    },
  });

  $('#locationSel').mobileSelect({
    title: '장소',
    buttonSave: '확인',
    buttonCancel: '취소',
    animation: 'scale',
    animationSpeed: 100,
    onClose: function(){
        $("#locationContent").html($(this).val());
    },
  });

  $("#dayDisplay").click( function(e) {
    calendar.fullCalendar('changeView', 'oneday');
    calendar.fullCalendar( 'gotoDate', moment('2018-06-27') );
  });

  $("#nextdayDisplay").click( function(e) {
    calendar.fullCalendar('changeView', 'oneday');
    calendar.fullCalendar( 'gotoDate', moment('2018-06-28') );
  });

  $("#bothdayDisplay").click( function(e) {
    calendar.fullCalendar('changeView', 'twoday');
    calendar.fullCalendar( 'gotoDate', moment('2018-06-27') );
  });

  $("#addButton").click( function(e) {
    console.log('add button click');
    alert('시간을 선택해주세요(클릭 혹은 드래그)');
    calendar.fullCalendar('option', 'selectable', true);
  });

  $("#currentButton").click( function(e) {
    console.log($('.fc-now-indicator').position().top);
    console.log($(window).height() / 2);
    // $(".fc-scroller.fc-time-grid-container").scrollTop($('.fc-now-indicator').position().top - $(window).height() / 2);
    $(".fc-scroller.fc-time-grid-container").animate({
      scrollTop: $('.fc-now-indicator').position().top - $(window).height() / 2
    });
  });

  //initialize current time for the title
  $("#time").html( moment().format("a h:mm") );
  setInterval(function(){
    console.log('rendering every minute');
    var time = moment().format("a h:mm");
    $("#time").html( time );
  },60000);

  $("#contentEditButton").click( function(e) {
    $("#eventContent").attr('contenteditable', true).focus();
  });

  $("#emotionEditButton").click( function(e) {
    $('#emotionSel').mobileSelect('show');
  });

  $("#locationEditButton").click( function(e) {
    $('#locationSel').mobileSelect('show');
  });

  $("#updateBlockButton").click ( function(e) {
    if( confirm('수정하시겠습니까?')) {
      var emotion = $("#emotionContent").text();
      var location = $("#locationContent").text();
      var content = $("#eventContent").text();

      currentEvent.title = content;
      currentEvent.content.emotion = emotion;
      currentEvent.content.location = location;

      console.log(emotion, location, content, currentEvent);
      calendar.fullCalendar( 'updateEvent', currentEvent );

      $("#eventBlockModal").modal('hide');
    }
  });

  $("#deleteBlockButton").click( function(e) {
    console.log(currentEvent);
    console.log(currentEvent._id);
    if(confirm('삭제하시겠습니까?')) {
      calendar.fullCalendar('removeEvents', function(event) {
        return (event._id === currentEvent._id);
      });

      console.log(calendar.fullCalendar( 'clientEvents' ))
      $("#eventBlockModal").modal("hide");
    }
  });
  console.log(calendar.fullCalendar( 'clientEvents' ))

});



function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
