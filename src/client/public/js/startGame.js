let pin = -1;
let maxPlayers = -1;

$(document).ready(() => {
  initPage();
  initProgressAndButtons();
  getGameInfo();
});

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
    $('#example4').progress('increment');
    e.preventDefault();
  });

  $('#exit').click((e) => {
    window.location.href = '/';
  });
}

function getGameInfo() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/startGame/getGameInfo/' + pin,
    timeout: 5000,
    success: (result) => {
      applyGameInfo(result[0]);
    },
    error: (xhr,status,error) => {
      console.log(error);
    }
  })
}

function applyGameInfo(result) {
  let title = $('#name').html();
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