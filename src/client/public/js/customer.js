let orderInformation = {};
let currentOrder = {};

$(document).ready(() => {
  checkOrders();
  initImages();
});

function initImages() {
  $('#1').click(e => {
    changeCarType(1);
    $('.ui.basic.modal').modal('show');
  });
  $('#2').click(e => {
    changeCarType(2);
    $('.ui.basic.modal').modal('show');
  });
  $('#3').click(e => {
    changeCarType(3);
    $('.ui.basic.modal').modal('show');
  });
  $('#4').click(e => {
    changeCarType(4);
    $('.ui.basic.modal').modal('show');
  });

  $('.ok.button').click((e) => {
    sendOrder();
  });
}

// gets the pin from the url
function getPin() {
  return /(\d+)(?!.*\d)/g.exec(window.location.href)[0];
}

function changeCarType(number) {
  let dom = $('#car-type');
  switch(number) {
    case 1: dom.html('super');  break;
    case 2: dom.html('race');   break;
    case 3: dom.html('RC');     break;
    case 4: dom.html('yellow'); break;
  }
}

function sendOrder() {
  let pin = getPin();
  let type = $('#car-type').html();
  let postData = {"pin": pin, "model": type};
  $.ajax({
    type: 'POST',
    data: postData,
    timeout: 5000,
    url: 'http://localhost:3000/gameLogic/sendOrder',
    success: function(result) {
      //window.location.href = '/startGame/' + result.pin;
      if ($('#order').hasClass('disabled')) {
        $('#order').removeClass('disabled');
      }
    },
    error: function(xhr,status,error) {
      console.log(error);
    } 
  });
}

/**
 * Function that runs constantly to update the orders
 */
function checkOrders() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/gameLogic/getOrders/' + getPin(),
    cache: false,
    timeout: 5000,
    success: (data) => {
      orderInformation = data;
      // Need to find the oldest order that hasn't been finished or canceled
      let i = 0;
      if (orderInformation.length != 0) {
        while(orderInformation[i].status != 'In Progress') {
          i++;
          if (i >= orderInformation.length) break;
        } 
        currentOrder = orderInformation[i] === undefined ? orderInformation[0] : orderInformation[i];
      }
    },
    error: (xhr, status, error) => {
      console.log('Error: ' + error);
    }
  });

  if ($('#order').hasClass('disabled') && orderInformation.length != 0) {
    $('#order').removeClass('disabled');
  }

  setTimeout(checkOrders, 3000);
}