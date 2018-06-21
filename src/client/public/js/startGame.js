let pin = -1;
let maxPlayers = -1;

$(document).ready(() => {
  initPage();
  initProgressAndButtons();
  getGameInfo();
});

/*window.onbeforeunload = closingCode;
function closingCode() {

  return null;
}*/

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
      case 'Assembler': location = '/builder/' + pin; break;
      case 'Customer': location = '/customer/' + pin; break;
      case 'Supplier': location = '/supplier/' + pin; break;
    }

    window.location.href = location;
  });

  $('#exit').click((e) => {
    $.ajax({
      type: 'GET',
      timeout: 5000,
      url: 'http://localhost:3000/startGame/removeActivePlayer/' + pin,
      success: (result) => window.location.href = '/',
      error: (error) => console.log(error)
    });
  });
}

function getGameInfo() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/startGame/getGameInfo/' + pin,
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

function applyGameInfo(result) {
  let title = 'Group Name: ';
  $('#name').html(title + result.groupName);
  $('#players').html(result.activePlayers);
  $('#example4').attr('data-total', result.maxPlayers);
  $('#example4').progress('set total', result.maxPlayers);
  $('#example4').progress('update progress', result.activePlayers);
}

// Create a pad function for the pin so that a pin like 12
// would show up as 0012
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}