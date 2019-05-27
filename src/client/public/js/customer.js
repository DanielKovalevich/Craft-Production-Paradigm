let orderInformation = {};
let currentOrder = {};
let generated = false;

$(document).ready(() => {
  checkOrders();
  initImages();
  initButtons();
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
}

function initButtons() {
  $('#view-model').click((e) => {
    if (!$('#view-model').hasClass('disabled'))
      window.location.href = '/viewer/' + getPin() + '/' + currentOrder._id;
  });

  $('.ok.button').click((e) => {
    sendOrder();
  });

  $('#generate').click(e => {
    generated = true;
    sendOrder();
  });

  $('#order').click((e) => {
    $('#ready-order').modal('toggle');
  });

  $('#left').click(e => {
    let index = orderInformation.indexOf(currentOrder);
    currentOrder = --index < 0 ? orderInformation[orderInformation.length - 1] : orderInformation[index];
    updateOrder();
  });

  $('#right').click(e => {
    let index = orderInformation.indexOf(currentOrder);
    currentOrder = ++index == orderInformation.length ? orderInformation[0] : orderInformation[index];
    updateOrder();
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
  let postData = {};
  if (generated) {
    let max = $('#num-orders').val();
    max = max > 10 ? 10 : max < 1 ? 1 : max;
    let skew = $('#skew').val();
    postData = {"pin": pin, "model": type, "generated": generated, "max": max, "skew": skew}
  }
  else postData = {"pin": pin, "model": type, "generated": generated};
  $.ajax({
    type: 'POST',
    data: postData,
    timeout: 5000,
    url: GameAPI.rootURL + '/gameLogic/sendOrder',
    success: function(result) {
      //window.location.href = '/startGame/' + result.pin;
      if ($('#order').hasClass('disabled')) {
        $('#order').removeClass('disabled');
      }
      generated = false;
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
    url: GameAPI.rootURL + '/gameLogic/getOrders/' + getPin(),
    cache: false,
    timeout: 5000,
    success: (data) => {
      orderInformation = data;
      if (orderInformation.length != 0) {
        if (currentOrder == null || jQuery.isEmptyObject(currentOrder))
          currentOrder = orderInformation[0];
        updateOrder();
        $('#order').removeClass('disabled');
      }
    },
    error: (xhr, status, error) => {
      console.log('Error: ' + error);
    }
  });

  

  setTimeout(checkOrders, 3000);
}

function updateOrder() {
  switch(currentOrder.modelType) {
    case 'super': $('#order-image').attr('src', '/../images/race.jpg');        break;
    case 'race': $('#order-image').attr('src', '/../images/lego_car.jpg');     break;
    case 'RC': $('#order-image').attr('src', '/../images/rc.jpg');             break;
    case 'yellow': $('#order-image').attr('src', '/../images/yellow_car.jpg'); break;
  }
  let html = '<p>Date Ordered: ' + new Date(currentOrder.createDate).toString() + '</p>';
  html += '<p>Last Modified: ' + new Date(currentOrder.lastModified).toString() + '</p>';
  if (currentOrder.status === 'Completed') {
    html += '<p>Finished: ' + new Date(currentOrder.finishedTime).toString() + '</p>';
    $('#view-model').removeClass('disabled');
  }
  else {
    $('#view-model').addClass('disabled');
  }
  html += '<p>Model Type: ' + currentOrder.modelType + '</p>';
  html += '<p>Stage: ' + currentOrder.stage + '</p>';
  html += '<p>Status: ' + currentOrder.status + '</p><br>';
  $('#order-info').html(html);
}