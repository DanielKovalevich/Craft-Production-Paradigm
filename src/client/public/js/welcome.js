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
    console.log('test');
    $('#start-game-submit').removeClass('right labeled icon').addClass('loading');
    setTimeout(function(){
      $.ajax({
        url: "http://localhost:3000/startGame", 
        success: function(result) {
          window.location.href = '/startGame/0';
        },
        error: function(xhr,status,error) {
          console.log(error);
        }
    });
      
    }, 2000);
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