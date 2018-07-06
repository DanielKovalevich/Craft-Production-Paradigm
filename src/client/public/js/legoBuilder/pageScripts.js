const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];
let pieces = [];
let orderInformation = {};
let currentOrder = {};

$(document).ready(() => {
  initButtons();
  checkOrders();
  setTimeout(checkPieces, 3000);
});

// gets the pin from the url
function getPin() {
  return /(\d+)(?!.*\d)/g.exec(window.location.href)[0];
}

function initButtons() {
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

  $('#order').click(e => {
    openModal();
  });

  $('#pieces').click(e => {
    $('#pieces-modal').modal('show');
  });
}

function cycle() {
  let index = allModels.indexOf(currentObj);
  currentObj = ++index == allModels.length ? allModels[0] : allModels[index];
  loadRollOverMesh();
}

function getModel(name) {
  allModels.forEach((element) => {
  if (element.name == name) currentObj = element;
  });
  loadRollOverMesh();
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
  html += '<p>Model Type: ' + currentOrder.modelType + '</p>';
  html += '<p>Status: ' + currentOrder.status + '</p><br>';
  $('#order-info').html(html);
}

function checkOrders() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/gameLogic/getOrders/' + getPin(),
    timeout: 5000,
    success: (data) => {
      if (orderInformation.length != data.length) {
        orderInformation = data;
        // Need to find the oldest order that hasn't been finished or canceled
        let i = 0;
        while(orderInformation[i].status != 'In Progress') i++;
        currentOrder = orderInformation[i];
        updateOrder();
      }
    },
    error: (xhr, status, error) => {
      console.log('Error: ' + error);
    }
  });

  setTimeout(checkOrders, 3000);
}

function checkPieces() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/gameLogic/getSupplyOrder/' + getPin() + '/' + currentOrder._id,
    timeout: 5000,
    success: (data) => {
      console.log(data);
    },
    error: (xhr, status, error) => {
      console.log(error);
    }
  });
}