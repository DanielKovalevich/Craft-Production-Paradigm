$(document).ready(() => {
  $('#new-game').click((e) => {
    e.preventDefault();
    $('#new-game-modal').modal({
      onApprove : function() {
        console.log('sending game info to server');
        $('#start-game-submit').removeClass('right labeled icon').addClass('loading');
        let postData = getPostData();
        setTimeout(sendToServer, 2000, postData);
        return false; //Return false as to not close modal dialog
      }
    }).modal('show');
  });

  $('#join-game').click((e) => {
    e.preventDefault();
    $('#join-game-modal').modal({
      onApprove : function() {
        $('#join-game-submit').removeClass('right labeled icon').addClass('loading');
        let joinPositionType = getJoinPosition();
        if (joinPositionType != undefined) {
          setTimeout(joinGame, 2000, $('#pin').val(), joinPositionType);
          $('.invalid-pin').addClass('hidden');
        }
        else {
          $('#join-game-submit').removeClass('loading').addClass('right labeled icon');
          $('.invalid-pin').removeClass('hidden');
          $('.invalid-pin').html('You must choose a position type!');
        }
        return false; //Return false as to not close modal dialog
      }
    }).modal('show');    
  });

  $('#pin').keypress((e) => setTimeout(checkIfPinIsValid, 1000));
  $('.ui.dropdown').dropdown();
});

function sendToServer(postData) {
  $.ajax({
    type: 'POST',
    data: postData,
    dataType: 'json',
    contentType: 'application/json',
    timeout: 5000,
    url: 'http://localhost:3000/startGame', 
    success: function(result) {
      window.location.href = '/startGame/' + result.pin;
    },
    error: function(xhr,status,error) {
      console.log(error);
      $('#start-game-submit').removeClass('loading').addClass('right labeled icon');
    }
  });
}

function checkIfPinIsValid() {
  let pin = $('#pin').val();
  $.ajax({
    type: 'GET',
    cache: false,
    url: 'http://localhost:3000/startGame/checkIfPinExists/' + pin,
    success: (result) => {
      if (result) {
        $('.invalid-pin').addClass('hidden');
        $('#join-dropdown').removeClass('disabled');
        getPossiblePositions(pin);
      }
      else {
        $('#join-dropdown').addClass('disabled');
        $('.invalid-pin').removeClass('hidden');
        $('.invalid-pin').html('That is not a valid pin!');
      }
    },
    error: (xhr,status,error) => {
      console.log(error);
      console.log(pin);
      $('.invalid-pin').removeClass('hidden');
      $('.invalid-pin').html('That is not a valid pin!');      
    }
  });
}

function getPossiblePositions(pin) {
  $.ajax({
    type: 'GET',
    cache: false,
    url: 'http://localhost:3000/startGame/getPossiblePositions/' + pin,
    success: (result) => {
      if (result.length == 0) {
        $('.invalid-pin').removeClass('hidden');
        $('.invalid-pin').html('Sorry. That game is already full.');   
      }
      result.forEach(element => {
        if ($('#join-menu').children().length < result.length)
          $('#join-menu').append('<div class="item">' + element + '</div>');
      });
    },
    error: (xhr, status, error) => {
      console.log(error);
    }
  });
}

function getPostData() {
  let data = {'positions': []};
  data.pin = null; // this will be changed by the server anyway
  let name = $('#group-name').val();
  data.groupName = name == null || name == "" ? "Default" : name;
  data.activePlayers = 1;
  data.status = 'waiting';
  let position = $('#position-type').html();
  data.positions.push(position === "Position Type" ? "Assembler" : position);
  let players = $('#num-players').val();
  data.maxPlayers = players > 3 ? 3 : players < 2 ? 2 : players;
  return JSON.stringify(data);
}

/**
 * I have to get the choice manually because stupid stuff is happening
 * when I try to just use $('#position-type').html()
 */
function getJoinPosition() {
  let children = $('#join-menu').children().toArray();
  let returnChild = null;
  children.forEach(child => {
    if ($(child).hasClass('active'))
      returnChild = child;
  });
  return $(returnChild).html();
}

function joinGame(pin, position) {
  let postData = {"position": position};
  $.ajax({
    type: 'POST',
    data: postData,
    url: 'http://localhost:3000/startGame/joinGame/' + pin,
    timeout: 5000,
    success: () => {
      updateActivePlayers(pin);
    },
    error: (xhr,status,error) => {
      console.log(error);
      $('#join-game-submit').removeClass('loading').addClass('right labeled icon');
    }
  });
}

function updateActivePlayers(pin) {
  $.ajax({
    type: 'GET',
    timeout: 5000,
    url: 'http://localhost:3000/startGame/addActivePlayer/' + pin,
    success: (result) => window.location.href = '/startGame/' + pin,
    error: (error) => console.log(error)
  });
}