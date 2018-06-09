$(document).ready(() => {
  $('#new-game').click((e) => {
    e.preventDefault();
    $('#new-game-modal').modal({
      onApprove : function() {
        // TODO: Validation and call to server
        //... //Validate here, or pass validation to somewhere else
        return false; //Return false as to not close modal dialog
      }
    }).modal('show');
  });

  $('#start-game-submit').click((e) => {
    console.log('sending game info to server');
    $('#start-game-submit').removeClass('right labeled icon').addClass('loading');
    let postData = getPostData();
    setTimeout(sendToServer, 2000, postData);
  });

  $('#join-game').click((e) => {
    e.preventDefault();
    $('#join-game-modal').modal({
      onApprove : function() {
        // TODO: Validation and call to server
        //... //Validate here, or pass validation to somewhere else
        return false; //Return false as to not close modal dialog
      }
    }).modal('show');    
  });

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

function getPostData() {
  let data = {'positions': []};
  data.pin = null; // this will be changed by the server anyway
  data.groupName = $('#group-name').val();
  data.activePlayers = 1;
  data.status = 'waiting';
  let position = $('#position-type').html();
  data.positions.push(position === "Position Type" ? "Crafter" : position);
  let players = $('#num-players').val();
  data.maxPlayers = players > 6 ? 6 : players < 2 ? 2 : players;
  return JSON.stringify(data);
}