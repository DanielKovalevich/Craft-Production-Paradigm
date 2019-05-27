const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];
let pieceOrders = [];
let manufacturingPieces = [];
let orderInformation = {};
let currentOrder = {};
let colors = [];

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
  for (let i = 0; i < names.length; i++) {
    pieceOrders[i] = 0; 
    colors[i] = '#d0d3d4';
  }
}

function initButtons() {
  initGridButtons();
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
    if (checkSupplyMatchesManufacturer()) {
      $('#error-message').addClass('hidden');
      sendSupplyOrder();
    }
    else {
      $('#error-message').removeClass('hidden');
    }
  });
}

/**
 * Refreshes the buttons when the supply grid gets regenerated
 */
function initGridButtons() {
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

    $('.' + i + '-picker').spectrum({
      change: color => {
        colors[i] = color.toHexString();;
      }
    });
  }
}

// the supply order needs to match (it can have more pieces) the manufacturer order
function checkSupplyMatchesManufacturer() {
  for (let i = 0; i < manufacturingPieces.length; i++) {
    if (pieceOrders[i] < manufacturingPieces[i]) return false;
  }
  return true;
}

function sendSupplyOrder() {
  let postData = {
    "id": currentOrder._id,
    "order": pieceOrders,
    "colors": colors
  }

  $.ajax({
    type: 'POST',
    data: postData,
    url: GameAPI.rootURL + '/gameLogic/sendSupplyOrder/' + getPin(),
    success: (data) => {
      console.log('Order sent!');
      $('#ready-order').modal('toggle');
      generateSupplyGrid();
      initGridButtons();
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
    url: GameAPI.rootURL + '/gameLogic/getOrders/' + getPin(),
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

  checkRequestedPieces();
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
 * I ended up needing to change the function for the supplier.js lol 
 * i still stand by my point that es5 sucks
 */

function openManufacturingModal() {
  if (manufacturingPieces.length == 0) 
    $('#no-request').modal('toggle');
  else 
    $('#ready-request').modal('toggle');
}

function checkRequestedPieces() {
  $.ajax({
  type: 'GET',
  url: GameAPI.rootURL + '/gameLogic/getManufacturerRequest/' + getPin() + '/' + currentOrder._id,
  success: (data) => {
    if (data.length != 0) {
      manufacturingPieces = data;
      populateRequestData(manufacturingPieces);
    }
  },
  error: (xhr, status, error) => {
    console.log(error);
  }
  });
}

function populateRequestData(data) {
  let html = "";
  data.forEach((elem, i) => {
    if (elem != 0) {
      html += '<div class="item">' + elem + ' - ' + names[i] + '</div>';
    }
  });
  $('#requested-pieces').html(html);
}

 function openModal() {
  if (jQuery.isEmptyObject(orderInformation)) {
    $('#no-orders').modal('show');
  }
  else {
    $('#ready-order').modal('show');
  }
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
  if (currentOrder.status === 'Completed')
    html += '<p>Finished: ' + new Date(currentOrder.finishedTime).toString() + '</p>';
  html += '<p>Model Type: ' + currentOrder.modelType + '</p>';
  html += '<p>Stage: ' + currentOrder.stage + '</p>';
  html += '<p>Status: ' + currentOrder.status + '</p><br>';
  $('#order-info').html(html);
}

/**
 * Dynamically generate all the squares to add to a supply order
 * This would have been terrible to do by hand
 */
function generateSupplyGrid() {
  let html = "";
  for (let i = 0; i < names.length / 4; i++) {
    html += '<div class="row">';
    for (let j = 0; j < 4; j++) {
      if (i * 4 + j < names.length) {
        html += '<div class="four wide column">';
        html += '<p>' + names[i * 4 + j] + '</p>';
        // Start off each piece with an order of 0
        html += '<div class="row"><div class="ui statistic"><div id="' + (i * 4 + j) + '-value' + '"class="value">0</div></div></div>'
        // add a color picker to each item
        html += '<div class="row picker"><input type="text" class="' + (i * 4 + j) + '-picker" value="#d0d3d4"/></div>'
        // Adds the plus and minus buttons to each piece
        html += '<div class="row"><div class="ui icon buttons">' +
          '<button id="'+ (i * 4 + j) + '-minus' + '" class="ui button"><i class="minus icon"></i></button>' +
          '<button id="'+ (i * 4 + j) + '-plus' + '" class="ui button"><i class="plus icon"></i></button></div></div></div>';
      }
    }
    // I want there to be vertical lines between each cube so I need to add a blank space 
    if (i + 1 >= names.length / 4) html += '<div class="five wide column"></div>';
    html += '</div>';
  }

  $('#supply-grid').html(html);
}