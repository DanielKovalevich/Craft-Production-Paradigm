let pin = -1;
let maxPlayers = -1;

$(document).ready(() => {
  initPage();
  initProgressAndButtons();
  getGameInfo();
});

/* 
// I can't seem to get this to work well
// It is because is removes active players on refresh
window.onbeforeunload = closingCode;
function closingCode() {
  $.ajax({
    type: 'GET',
    timeout: 5000,
    url: 'http://psu-research-api:3000/startGame/removeActivePlayer/' + pin,
    error: (error) => console.log(error)
  });
  return "Are you sure you want to close?";
}*/

// gets the pin from the url
function getPin() {
  return /(\d+)(?!.*\d)/g.exec(window.location.href)[0];
}

function initPage() {
  pin = getPin();
  $('#pin').html(Number(pin).pad(4));
}

function initProgressAndButtons() {
  $('#example4').progress({
    text: {
      active  : 'Getting game ready',
      success : 'Game is ready. Hit start to begin!'
    }
  });

  $('#start-game').click((e) => {
    let location = '/';
    switch(sessionStorage.position) {
      case 'Assembler':    location = '/builder/' + pin;      break;
      case 'Customer':     location = '/customer/' + pin;     break;
      case 'Supplier':     location = '/supplier/' + pin;     break;
      case 'Manufacturer': location = '/manufacturer/' + pin; break;
    }
    window.location.href = location;
  });

  $('#exit').click((e) => {
    $.ajax({
      type: 'GET',
      timeout: 5000,
      url: GameAPI.rootURL + '/startGame/removeActivePlayer/' + pin + '/' + sessionStorage.position,
      success: (result) => window.location.href = '/',
      error: (error) => console.log(error)
    });
  });
}


function getGameInfo() {
  $.ajax({
    type: 'GET',
    url: GameAPI.rootURL + '/startGame/getGameInfo/' + pin,
    timeout: 5000,
    success: (result) => {
      applyGameInfo(result[0]);
      setTimeout(getGameInfo, 5000);
      if (result[0].activePlayers == result[0].maxPlayers)
        $('#start-game').removeClass('disabled');
    },
    error: (xhr,status,error) => {
      console.log(error);
    }
  });
}

/**
 * Refreshes the game information on the page so that as people join
 * the page will update with that information
 */
function applyGameInfo(result) {
  try {
    let title = 'Group Name: ';
    let gameType = 'Game Type: ';
    $('#name').html(title + result.groupName);
    $('#game-type').html(gameType + result.gameType);
    $('#players').html(result.activePlayers);
    $('#example4').attr('data-total', result.maxPlayers);
    $('#example4').progress('set total', result.maxPlayers);
    $('#example4').progress('update progress', result.activePlayers);
  } catch (e) {
    console.log('You may need to wait a second');
    console.log(e);
  }
  
}

// Create a pad function for the pin so that a pin like 12
// would show up as 0012
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}