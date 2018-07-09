$(document).ready(function() {
  console.log(new Date().getHours()-1+':'+Math.floor(new Date().getMinutes()/10)*10+':'+new Date().getSeconds());
  var start, end;
  var calendar = $("#calendar, #calendar-nextday");
  var currentEvent;
  var isAdd = false;
  calendar.fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    themeSystem: 'standard',
    defaultView: 'firstday',
    groupByResource: true,

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
    height: function() {
      return $(window).outerHeight() - $(".fixed-top").height() - 10;
    },
    header: false,
    defaultDate: moment(),
    viewRender: function(view) {
        var title = view.title;
        $("#title").html( title );
        // console.log(calendar.fullCalendar( 'getView' ));
        var view = calendar.fullCalendar('getView');
        var curDate = view.start.format('DD');
        var type = view.type;
        var events = calendar.fullCalendar( 'clientEvents' );
        var totTime = {
          total: 0,
        };
        $.each(events, function( index, event ) {
          var diff = moment.duration( event.end.diff(event.start) ).asMinutes();
          var date = event.start.format('DD');
          //if no key, initialize by 0
          if( !(date in totTime) ) totTime[date] = 0;
          totTime[date] += diff;
          totTime['total'] += diff;
        });
        console.log(totTime);
        console.log(events);
        if(!events.length) {
          $("#spent-time-hm").html('-');
        }
        else {
          var curHour = Math.floor(totTime[curDate] / 60).toFixed(0);
          var curMin = (totTime[curDate]) % 60;

          curHour = isNaN(curHour) ? 0 : curHour;
          curMin = isNaN(curMin) ? 0 : curMin;

          var totHour = Math.floor(totTime['total'] / 60).toFixed(0);
          var totMin =  totTime['total'] % 60;

          totHour = isNaN(totHour) ? 0 : totHour;
          totMin = isNaN(totMin) ? 0 : totMin;
          $("#spent-time-hm").html(
            type !== 'bothday' ? curHour  + '시간 ' + curMin + '분' :
                                totHour + '시간 ' + totMin + '분'
          );
        }


        $("#remaining-time").html (
          type !== 'bothday' ? '/ 24시간' : '/ 48시간'
        );
  	},
    views: {
      firstday: {
        type: 'agenda',
        duration: { days: 1 },
        buttonText: '1일',
      },
      secondday: {
        type: 'agenda',
        duration: { days: 1 },
        buttonText: '1일',
      },
      bothday: {
        type: 'agenda',
        duration: { days: 2 },
        buttonText: '2일'
      }
    },
    eventBorderColor: '#333',
    eventClick: function(event, element) {
      if(isAdd) return false;
      $('#eventBlockModal').on('show.bs.modal', function () {
        $('#startTime').timepicker('remove');
        $('#endTime').timepicker('remove');

        var startDate = event.start.format('a h:mm');
        var endDate = event.end.format('a h:mm');
        $("#timeEditButton, #contentEditButton, #locationEditButton, #emotionEditButton").removeClass('active');

        $("#eventContent").attr('contenteditable', false);
        $('#locationContent input[type=radio]').prop('disabled', true);
        $('#happyContent input[type=radio]').prop('disabled', true);
        $('#satisfactionContent input[type=radio]').prop('disabled', true);
        $('#depressionContent input[type=radio]').prop('disabled', true);
        $('#anxietyContent input[type=radio]').prop('disabled', true);
        $('#angerContent input[type=radio]').prop('disabled', true);
        $('#fatigueContent input[type=radio]').prop('disabled', true);

        // $("#eventBlockModal .modal-title").text(startDate + ' - ' + endDate);
        $("#eventBlockModal .modal-title .start-time").text(startDate);
        $("#eventBlockModal .modal-title .end-time").text(endDate);
        $('#eventBlockModal #eventContent').text(event.title);

        $('#eventBlockModal #locationContent input[type=radio][value=' + event.content.location + ']').attr("checked", true);
        $('#eventBlockModal #happyContent input[type=radio][value=' + event.content.happy + ']').attr("checked", true);
        $('#eventBlockModal #satisfactionContent input[type=radio][value=' + event.content.satisfaction + ']').attr("checked", true);
        $('#eventBlockModal #depressionContent input[type=radio][value=' + event.content.depression + ']').attr("checked", true);
        $('#eventBlockModal #anxietyContent input[type=radio][value=' + event.content.anxiety + ']').attr("checked", true);
        $('#eventBlockModal #angerContent input[type=radio][value=' + event.content.anger + ']').attr("checked", true);
        $('#eventBlockModal #fatigueContent input[type=radio][value=' + event.content.fatigue + ']').attr("checked", true);
      });

      $("#eventBlockModal").modal();
      currentEvent = event;

    },
    selectHelper: true,
    // longPressDelay : 10,
    selectOverlap: false,
    eventOverlap: false,
    // select: function( start, end ) {
    //   var startDate = start.format('a h:mm');
    //   var endDate = end.format('a h:mm');
    //   if(confirm('시간: ' + startDate + ' ~ ' + endDate + '\n계속 진행하시겠습니까?')){
    //     // var startDate = start.format('a h:mm');
    //     // var endDate = end.format('a h:mm');
    //     // calendar.fullCalendar('option', 'unselectAuto', true);
    //
    //     $('#addBlockModal').on('show.bs.modal', function () {
    //       $("#addBlockModal .modal-title").text(startDate + ' - ' + endDate);
    //       $('#addBlockModal #addContent').focus()
    //     });
    //     $("#addBlockModal").modal();
    //
    //     $("#cancelAddBlockButton").click(function(e) {
    //       console.log('cancel clicked');
    //       $("#cancelAddBlockButton, #addBlockButton").off('click');
    //       $("#addButton").removeClass('active');
    //       calendar.fullCalendar('option', 'selectable', false);
    //     });
    //
    //     $("#addBlockButton").click( function(e) {
    //       var location = $("#addBlockModal #locationSel input[type=radio]:checked").val();
    //       var title = $("#addContent").val();
    //       var happy = $("#addBlockModal #happySel input[type=radio]:checked").val();
    //       var satisfaction = $("#addBlockModal #satisfactionSel input[type=radio]:checked").val();
    //       var depression = $("#addBlockModal #depressionSel input[type=radio]:checked").val();
    //       var anxiety = $("#addBlockModal #anxietySel input[type=radio]:checked").val();
    //       var anger = $("#addBlockModal #angerSel input[type=radio]:checked").val();
    //       var fatigue = $("#addBlockModal #fatigueSel input[type=radio]:checked").val();
    //
    //       if( confirm('추가 하시겠습니까?') ){
    //           calendar.fullCalendar( 'renderEvent', {
    //             // id: '01062610332',
    //             resourceId: '01062610332',
    //             title: title,
    //             content: {
    //               title: title,
    //               location : location,
    //               happy: happy,
    //               satisfaction: satisfaction,
    //               depression : depression,
    //               anxiety: anxiety,
    //               anger: anger,
    //               fatigue: fatigue,
    //             },
    //             start: moment(start),
    //             end: moment(end),
    //             allDay: false,
    //             color: getRandomColor(),
    //             textColor: '#333',
    //             overlap: false,
    //           }, true);
    //       }
    //
    //       console.log(calendar.fullCalendar( 'clientEvents' ))
    //       $("#cancelAddBlockButton, #addBlockButton").off('click');
    //       calendar.fullCalendar('option', 'selectable', false);
    //       $("#addButton").removeClass('active');
    //     });
    //   }
    //   else{
    //     calendar.fullCalendar('unselect');
    //   }
    //
    // },
    dayClick : function(date, jsEvent, view) {
      if(!isAdd) return false;
      console.log('dayclick', date, jsEvent, view);
      if(!start) {
        start = date;
        $("#startMessage").slideUp();
        $(jsEvent.target).css('background-color', getRandomColor());
        var time = date.format('hh:mm:ss');
        $("#endMessage").slideDown();
        return false;
      }

      if(!end) {
        if( date < start ) { alert('시작 시간 보다 끝 시간이 더 빠를 수 없습니다\n다시 선택해 주세요'); return false; }

        var events = calendar.fullCalendar( 'clientEvents' );
        var isInclude = false;
        $.each( events, function(index, event) {
          console.log(event);
          var e_start = moment(event.start);
          var e_end = moment(event.end);
          console.log(date);
          if( start < e_start && date > e_end ) { alert('중복된 이벤트를 기입할 수 없습니다!\n다시 선택해 주세요'); isInclude = true; return false;}
          isInclude = false;
        });
        console.log(isInclude);
        if(isInclude) return false;
        end = date;

        $("#endMessage").slideUp();
        $(jsEvent.target).css('background-color', getRandomColor());
        $(".fc-widget-content").css('background-color', '');
        calendar.fullCalendar( 'select', moment(start), moment(end).add(10, 'minutes') );
        var startDate = moment(start).format('a hh:mm');
        var endDate = moment(end).add(10, 'minutes').format('a hh:mm');
        setTimeout( function() {
          if(confirm('시간: ' + startDate + ' ~ ' + endDate + '\n계속 진행하시겠습니까?')){
            // calendar.fullCalendar('option', 'unselectAuto', true);

            $('#addBlockModal').on('show.bs.modal', function () {
              $("#addBlockModal .modal-title").text(moment(start).format('a hh:mm') + ' - ' + moment(end).add(10, 'minutes').format('a hh:mm'));
              $('#addBlockModal #addContent').focus()
            });

            $('#addBlockModal').on('hidden.bs.modal', function () {
              console.log('bye');
              $("#locationSel input[type=radio]").removeAttr("checked");
              $(".button-wrap input[type=radio]").removeAttr("checked");

              $("#addContent").val("");
              $("#locationSel label:first").trigger('click');
              $("#happySel label:first").trigger('click');
              $("#satisfactionSel label:first").trigger('click');
              $("#depressionSel label:first").trigger('click');
              $("#anxietySel label:first").trigger('click');
              $("#angerSel label:first").trigger('click');
              $("#fatigueSel label:first").trigger('click');

            });

            $("#addBlockModal").modal();

            $("#cancelAddBlockButton").click(function(e) {
              console.log('cancel clicked');
              $("#cancelAddBlockButton, #addBlockButton").off('click');
              $("#addButton").removeClass('active');
              isAdd = false;
              // calendar.fullCalendar('option', 'selectable', false);
            });

            $("#addBlockButton").click( function(e) {
              var location = $("#addBlockModal #locationSel input[type=radio]:checked").val();
              var title = $("#addContent").val();
              var happy = $("#addBlockModal #happySel input[type=radio]:checked").val();
              var satisfaction = $("#addBlockModal #satisfactionSel input[type=radio]:checked").val();
              var depression = $("#addBlockModal #depressionSel input[type=radio]:checked").val();
              var anxiety = $("#addBlockModal #anxietySel input[type=radio]:checked").val();
              var anger = $("#addBlockModal #angerSel input[type=radio]:checked").val();
              var fatigue = $("#addBlockModal #fatigueSel input[type=radio]:checked").val();

              if( confirm('추가 하시겠습니까?') ){
                  calendar.fullCalendar( 'renderEvent', {
                    // id: '01062610332',
                    resourceId: '01062610332',
                    title: title,
                    content: {
                      title: title,
                      location : location,
                      happy: happy,
                      satisfaction: satisfaction,
                      depression : depression,
                      anxiety: anxiety,
                      anger: anger,
                      fatigue: fatigue,
                    },
                    start: moment(start),
                    end: moment(end).add(10, 'minutes'),
                    allDay: false,
                    color: getRandomColor(),
                    textColor: '#333',
                    overlap: false,
                  }, true);
              }

              console.log(calendar.fullCalendar( 'clientEvents' ))
              $("#cancelAddBlockButton, #addBlockButton").off('click');
              calendar.fullCalendar('option', 'selectable', false);
              $("#addButton").removeClass('active');
            });
          }
          else{
            calendar.fullCalendar('unselect');
          }
          isAdd= false;
          $("#addButton").removeClass('active');
        }, 500);
      }
    },
    snapDuration: "00:10:00",
  });

  $("#dayDisplay").click( function(e) {
    calendar.fullCalendar('changeView', 'firstday');
    calendar.fullCalendar( 'gotoDate', moment() );
  });

  $("#nextdayDisplay").click( function(e) {
    calendar.fullCalendar('changeView', 'secondday');
    calendar.fullCalendar( 'gotoDate', moment().add('1', 'day') );
  });

  $("#bothdayDisplay").click( function(e) {
    calendar.fullCalendar('changeView', 'bothday');
    calendar.fullCalendar( 'gotoDate', moment() );
  });

  $("#addButton").click( function(e) {
    console.log('add button click');

    if($(this).hasClass('active')){
      $(this).removeClass('active');
      // calendar.fullCalendar('option', 'selectable', false);
      isAdd = false;
      $("#endMessage, #startMessage").slideUp();
    }
    else{
      $(this).addClass('active');
      // calendar.fucontentEditButtonllCalendar('option', 'selectable', true);
      isAdd = true;
      $("#startMessage").slideDown();
      start = null; end = null;
    }
  });

  $("#currentButton").click( function(e) {
    // $(".fc-scroller.fc-time-grid-container").scrollTop($('.fc-now-indicator').position().top - $(window).height() / 2);
    $(".fc-scroller.fc-time-grid-container").animate({
      scrollTop: $('.fc-now-indicator').position().top - $("#calendar").height() / 2
    });
  });

  //initialize current time for the title
  $("#time").html( moment().format("a h:mm") );

  setInterval(function(){
    console.log('rendering every minute');
    var time = moment().format("a h:mm");
    $("#time").html( time );
  },60000);

  $("#timeEditButton").click( function(e) {
    console.log('please edit time');
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      $('#startTime').timepicker('remove');
      $('#endTime').timepicker('remove');
    }
    else {
      $(this).addClass('active');
      var options = {
        timeFormat: 'a h:i',
        step: 10,
        lang: {am: '오전', pm: '오후'},
        useSelect: true,
      };
      // $('.modal-title .start-time, .end-time').css('border', '1px solid grey');
      console.log(moment(currentEvent.start).format('a h:mm'));
      var events = calendar.fullCalendar( 'clientEvents' );
      //find the next closest event start time;
      events.sort(function(a,b) {return a.start - b.start});
      var target_index = -1;
      $.each( events, function( index, event ) {
        if(moment(event.start).isSame(moment(currentEvent.start))){
          target_index = index;
        }
      })

      if(events.length === 0) {
        options.minTime = moment(event.start).startOf('day').toDate();
        options.maxTime = moment(event.start).endOf('day').toDate();
      }
      else if(events.length === 1){
        options.minTime = moment(event.start).startOf('day').toDate();
        options.maxTime = moment(event.start).endOf('day').toDate();
      }
      // else if(events.length === 2){
      //   options.minTime = events[target_index-1] ? moment(events[target_index-1].start).format('a h:mm') : undefined;
      //   options.maxTime = events[target_index+1] ? moment(events[target_index+1].start).format('a h:mm') : undefined;
      // }
      else {
        options.minTime = events[target_index-1] ? moment(events[target_index-1].end).format('a h:mm') : undefined;
        options.maxTime = events[target_index+1] ? moment(events[target_index+1].start).format('a h:mm') : undefined;
      }

      $('#startTime').val(moment(currentEvent.start).format('a h:mm'));
      $('#endTime').val(moment(currentEvent.end).format('a h:mm'));

      $('#startTime').timepicker(options);
      $('#endTime').timepicker(options);

      $('#endTime').timepicker('option', 'minTime', moment(currentEvent.start).format('a h:mm'));

      $('#startTime').on('selectTime', function(e) {
        var s_time = $('#startTime').timepicker('getTime');
        var e_time = $('#endTime').timepicker('getTime');
        console.log(s_time, e_time);
        $('#startTime').text(moment(s_time).format('a h:mm'));
        $('#startTime').val(s_time);

        $('#endTime').text(moment(e_time).format('a h:mm'));
        $('#endTime').val(e_time);

        if(moment(s_time).isAfter(moment(e_time)) || moment(s_time).isSame(moment(e_time))){
          console.log('after');
          $("#endTime").text(moment(s_time).add(10, 'minutes').format('a h:mm'));
          $("#endTime").val(moment(s_time).add(10, 'minutes').toDate());
        }
        $('#endTime').timepicker('option', 'minTime', moment(s_time).add(10, 'minutes').format('a h:mm'));

      })

      $('#endTime').on('selectTime', function(e) {
        var s_time = $('#startTime').timepicker('getTime');
        var e_time = $('#endTime').timepicker('getTime');
        $('#startTime').text(moment(s_time).format('a h:mm'));
        $('#startTime').val(s_time);

        $('#endTime').text(moment(e_time).format('a h:mm'));
        $('#endTime').val(e_time);
      })
    }

  });

  $("#contentEditButton").click( function(e) {
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      $("#eventContent").attr('contenteditable', false);
    }
    else {
      $(this).addClass('active');
      $("#eventContent").attr('contenteditable', true).focus();
    }

  });

  $("#emotionEditButton").click( function(e) {
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      $('#happyContent input[type=radio]').prop('disabled', true);
      $('#satisfactionContent input[type=radio]').prop('disabled', true);
      $('#depressionContent input[type=radio]').prop('disabled', true);
      $('#anxietyContent input[type=radio]').prop('disabled', true);
      $('#angerContent input[type=radio]').prop('disabled', true);
      $('#fatigueContent input[type=radio]').prop('disabled', true);
    }
    else {
      $(this).addClass('active');
      $('#happyContent input[type=radio]').prop('disabled', false);
      $('#satisfactionContent input[type=radio]').prop('disabled', false);
      $('#depressionContent input[type=radio]').prop('disabled', false);
      $('#anxietyContent input[type=radio]').prop('disabled', false);
      $('#angerContent input[type=radio]').prop('disabled', false);
      $('#fatigueContent input[type=radio]').prop('disabled', false);
    }

  });

  $("#locationEditButton").click( function(e) {
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      $('#locationContent input[type=radio]').prop('disabled', true);
    }
    else {
      $(this).addClass('active');
      $('#locationContent input[type=radio]').prop('disabled', false);
    }
  });

  $("#updateBlockButton").click ( function(e) {
    if( confirm('수정하시겠습니까?')) {
      var view = calendar.fullCalendar('getView');
      console.log(view);
      var start_time = $("#startTime").val();
      var end_time = $("#endTime").val();
      var location = $("#addBlockModal #locationSel input[type=radio]:checked").val();
      var title = $("#eventContent").text();
      var happy = $("#addBlockModal #happySel input[type=radio]:checked").val();
      var satisfaction = $("#addBlockModal #satisfactionSel input[type=radio]:checked").val();
      var depression = $("#addBlockModal #depressionSel input[type=radio]:checked").val();
      var anxiety = $("#addBlockModal #anxietySel input[type=radio]:checked").val();
      var anger = $("#addBlockModal #angerSel input[type=radio]:checked").val();
      var fatigue = $("#addBlockModal #fatigueSel input[type=radio]:checked").val();

      currentEvent.start = view.type === 'secondday' ? moment(start_time).add(1,'days') : moment(start_time);
      currentEvent.end = view.type === 'secondday' ? moment(end_time).add(1,'days') : moment(end_time);
      currentEvent.title = title;
      currentEvent.content.title = title;
      currentEvent.content.location = location;
      currentEvent.content.happy = happy;
      currentEvent.content.satisfaction = satisfaction;
      currentEvent.content.depression = depression;
      currentEvent.content.anxiety = anxiety;
      currentEvent.content.anger = anger;
      currentEvent.content.fatigue = fatigue;

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
});



function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
