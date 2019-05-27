/**
 * author: Daniel Kovalevich
 * dateModified: Last time I felt like it
 */

$(document).ready(() => {
  initButtons();
});

function initButtons() {
  $('#new-game').click((e) => {
    e.preventDefault();
    $('#new-game-modal').modal({onApprove : onApproveNewGame}).modal('show');
  });

  $('#join-game').click((e) => {
    e.preventDefault();
    $('#join-game-modal').modal({onApprove : onApproveJoin}).modal('show');    
  });

  $('#pin').keypress((e) => setTimeout(checkIfPinIsValid, 1000));
  $('.ui.dropdown').dropdown();
}

// Handles the modal approve
// I wanted to separate the functions from the initalization itself
function onApproveNewGame() {
  console.log('sending game info to server');
  $('#start-game-submit').removeClass('right labeled icon').addClass('loading');
  let postData = getPostData();
  setTimeout(sendToServer, 2000, postData);
  return false; //Return false as to not close modal dialog
}

// Handles the modal approve
// I wanted to separate the functions from the initalization itself
function onApproveJoin() {
  $('#join-game-submit').removeClass('right labeled icon').addClass('loading');
  let joinPositionType = getJoinPosition();
  // if the user doesn't choice a position type
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

/**
 * Takes postData and sends to server to add to database
 * @param {Object} postData 
 */
function sendToServer(postData) {
  $.ajax({
    type: 'POST',
    data: postData,
    dataType: 'json',
    contentType: 'application/json',
    timeout: 5000,
    url: GameAPI.rootURL + '/startGame',
    success: function(result) {
      window.location.href = '/startGame/' + result.pin;
    },
    error: function(xhr,status,error) {
      console.log(error);
      $('#start-game-submit').removeClass('loading').addClass('right labeled icon');
    }
  });
}

// Does what the name implies
function checkIfPinIsValid() {
  let pin = $('#pin').val();
  $.ajax({
    type: 'GET',
    cache: false,
    url: GameAPI.rootURL + '/startGame/checkIfPinExists/' + pin,
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

/**
 * Database holds currently taken positions
 * Makes sure to return ones that aren't already taken
 * @param {number} pin 
 */
function getPossiblePositions(pin) {
  $.ajax({
    type: 'GET',
    cache: false,
    url: GameAPI.rootURL + '/startGame/getPossiblePositions/' + pin,
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

/**
 * Gets all of the field data for the post request
 */
function getPostData() {
  let data = {'positions': []};
  data.pin = null; // this will be changed by the server anyway
  let name = $('#group-name').val();
  data.groupName = name == null || name == '' ? 'Default' : name;
  data.activePlayers = 1;
  data.status = 'waiting';
  let gameType = $('#game-type').html();
  data.gameType = gameType == 'Game Type' ? 'Craft Production' : gameType;
  let position = $("#position-dropdown").dropdown('get value');
  position = position === '' ? 'Assembler' : position;
  sessionStorage.position = position;
  data.positions.push(position);
  let players = $('#num-players').val();
  data.maxPlayers = players > 4 ? 4 : players < 2 ? 2 : players;
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

/**
 * Joins a game by pin and position (obviously)
 * @param {number} pin 
 * @param {string} position 
 */
function joinGame(pin, position) {
  let postData = {"position": position};
  $.ajax({
    type: 'POST',
    data: postData,
    url: GameAPI.rootURL + '/startGame/joinGame/' + pin,
    timeout: 5000,
    success: () => {
      sessionStorage.position = position;
      updateActivePlayers(pin);
    },
    error: (xhr,status,error) => {
      console.log(error);
      $('#join-game-submit').removeClass('loading').addClass('right labeled icon');
    }
  });
}

/**
 * Just increments the activePlayers value in the database
 * @param {number} pin 
 */
function updateActivePlayers(pin) {
  $.ajax({
    type: 'GET',
    timeout: 5000,
    url: GameAPI.rootURL + '/startGame/addActivePlayer/' + pin,
    success: (result) => window.location.href = '/startGame/' + pin,
    error: (error) => console.log(error)
  });
}