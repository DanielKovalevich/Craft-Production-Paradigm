const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];
let pieceOrders = [];
let manufacturingPieces = [];
orderInformation = {};
currentOrder = {};

$(document).ready(() => {
  generateSupplyGrid();
  initArray();
  initButtons();
  $('#order').click(e => openModal());
  $('#request').click(e => openManufacturingModal());
  checkOrders();
});

// gets the pin from the url
function getPin() {
  return /(\d+)(?!.*\d)/g.exec(window.location.href)[0];
}

function initArray() {
  for (let i = 0; i < names.length; i++) pieceOrders[i] = 0;
}

function initButtons() {
  for (let i = 0; i < names.length; i++) {
    let num = '#' + i;
    $(num + '-plus').click(e => {
      let currentNum = parseInt($(num + '-value').html());
      $(num + '-value').html(currentNum < 10 ? ++currentNum : 10);
      pieceOrders[i] = currentNum;
    });
    $(num + '-minus').click(e => {
      let currentNum = parseInt($(num + '-value').html());
      $(num + '-value').html(currentNum == 0 ? 0 : --currentNum);
      pieceOrders[i] = currentNum;
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

  $('#send-supply-order').click(e => {
    sendSupplyOrder();
  });
}

function sendSupplyOrder() {
  let postData = {
    "id": currentOrder._id,
    "order": pieceOrders
  }

  $.ajax({
    type: 'POST',
    data: postData,
    url: 'http://localhost:3000/gameLogic/sendSupplyOrder/' + getPin(),
    success: () => {
      console.log('Order sent!');
      generateSupplyGrid();
    },
    error: (xhr, status, error) => {
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
      removeOrdersAtManuf(orderInformation);
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

function removeOrdersAtManuf(orders) {
  orders.forEach((elem, i) => {
    // don't want other stages to see orders when it is at manufacturer
    if (elem.stage == "Manufacturer")
      orders.splice(i, 1);
  });
  return orders;
}

/**
 * Because including other functions in es5 is shit,
 * I moved 3 functions to supplyGrid since the manufacturer.js also requires the same functions
 */

 function openManufacturingModal() {
  if (manufacturingPieces.length == 0) 
    $('#no-request').modal('toggle');
  else 
    $('#ready-request').modal('toggle');
 }