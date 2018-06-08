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