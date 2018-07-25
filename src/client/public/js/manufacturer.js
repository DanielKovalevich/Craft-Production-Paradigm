const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];
let pieceOrder = [];
orderInformation = {};
currentOrder = {};

$(document).ready(() => {
  generateSupplyGrid();
  initArray();
  initButtons();
  $('#order').click(e => {
    openModal();
  });
  checkOrders();
});

// gets the pin from the url
function getPin() {
  return /(\d+)(?!.*\d)/g.exec(window.location.href)[0];
}

function initArray() {
  for (let i = 0; i < names.length; i++) pieceOrder[i] = 0;
}

function initButtons() {
  for (let i = 0; i < names.length; i++) {
    let num = '#' + i;
    $(num + '-plus').click(e => {
      let currentNum = parseInt($(num + '-value').html());
      $(num + '-value').html(currentNum < 10 ? ++currentNum : 10);
      pieceOrder[i] = currentNum;
    });
    $(num + '-minus').click(e => {
      let currentNum = parseInt($(num + '-value').html());
      $(num + '-value').html(currentNum == 0 ? 0 : --currentNum);
      pieceOrder[i] = currentNum;
    });
  }

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

  $('#send-manufacturing-order').click(e => {
    sendPiecesOrder();
  });
}

/**
 * Function that runs constantly to update the orders
 */
function checkOrders() {
  $.ajax({
    type: 'GET',
    url: 'https://psu-research-api.herokuapp.com/gameLogic/getOrders/' + getPin(),
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
      updateOrder();
    },
    error: (xhr, status, error) => {
      console.log('Error: ' + error);
    }
  });

  setTimeout(checkOrders, 3000);
}

function sendPiecesOrder() {
  let postData = {'request': pieceOrder};
  $.ajax({
    type: 'POST',
    data: postData,
    url: 'https://psu-research-api.herokuapp.com/gameLogic/updateManufacturerRequest/' + getPin() + '/' + currentOrder._id,
    success: (data) => {
      console.log(data);
    },
    error: (xhr, status, error) => {
      console.log(error);
    }
  });
}

/**
 * Because including other functions in es5 is shit,
 * I moved 3 functions to supplyGrid since the supplier.js also requires the same functions
 */