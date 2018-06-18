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
          setTimeout(joinGame, 2000, $('#pin').val());
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
  console.log(pin);
  $.ajax({
    type: 'GET',
    cache: false,
    url: 'http://localhost:3000/startGame/checkIfPinExists/' + pin,
    success: (result) => {
      if (result) {
        $('.invalid-pin').addClass('hidden');
        $('#join-dropdown').removeClass('disabled');
        console.log('hur');
      }
      else {
        $('.invalid-pin').removeClass('hidden');
      }
    },
    error: (xhr,status,error) => {
      console.log(error);
      console.log(pin);
      $('.invalid-pin').removeClass('hidden');
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
  data.positions.push(position === "Position Type" ? "Crafter" : position);
  let players = $('#num-players').val();
  data.maxPlayers = players > 6 ? 6 : players < 2 ? 2 : players;
  return JSON.stringify(data);
}

function joinGame(pin) {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/startGame/getGameInfo/' + pin,
    timeout: 5000,
    success: (result) => {
      if (result == null) {
        $('#join-game-submit').removeClass('loading').addClass('right labeled icon');
        console.log('That game does not exist');
      }
      else {
        result = result[0];
        if (result.maxPlayers == result.activePlayers) {
          alert('Game is already full');
        } 
        else {
          updateActivePlayers(pin);
        }
      }
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