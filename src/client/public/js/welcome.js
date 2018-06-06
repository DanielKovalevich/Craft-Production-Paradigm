$(document).ready(() => {
  $('#new-game').click((e) => {
    e.preventDefault();
    $('#new-game-modal').modal('show');    
  });

  $('#join-game').click((e) => {
    e.preventDefault();
    $('#join-game-modal').modal('show');
  });
});