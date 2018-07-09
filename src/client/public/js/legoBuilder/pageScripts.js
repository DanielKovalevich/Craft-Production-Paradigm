const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];
let pieces = null;
let pieceIndex = -1; // used to modify the supply of the piece type
let orderInformation = {};
let currentOrder = {};

$(document).ready(() => {
  initButtons();
  checkOrders();
  setTimeout(checkPieces, 2000);
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

  $('#order').click(e => {openModal()});
  $('#pieces').click(e => {openSupplyModal()});
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
  if (jQuery.isEmptyObject(orderInformation))
    $('#no-orders').modal('show');
  else
    $('#ready-order').modal('show');
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
      if (orderInformation.length != data.length && data != undefined) {
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
      if (data != null && data != undefined && data != "") {
        if (getNumOfPieceTypes(data) != 0 && !samePieces(data, pieces)) {
          pieces = data;
          generatePiecesGrid();
        }
      }
    },
    error: (xhr, status, error) => {
      console.log(error);
    }
  });

  setTimeout(checkPieces, 3000);
}

function openSupplyModal() {
  updatePieces();
  if (pieces == null)
    $('#no-pieces').modal('show');
  else
    $('#pieces-modal').modal('show');
}

// finds how many actual types of pieces there are
function getNumOfPieceTypes(pieceArray) {
  let num = 0;
  pieceArray.forEach(elem => {num += elem == 0 ? 0 : 1});
  return num;
}

function samePieces(array1, array2) {
  if (array1 == null || array2 == null) return false
  if (array1.length != array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i]) return false;
  }
  return true;
}

function updatePieces() {
  let postData = {'pieces': pieces};
  if (pieces != [] && pieces != null && pieces != undefined) {
    $.ajax({
      type: 'POST',
      data: postData,
      url: 'http://localhost:3000/gameLogic/updatePieces/' + getPin() + '/' + currentOrder._id,
      success: (data) => {
        //console.log(data);
      },
      error: (xhr, status, error) => {
        console.log(error);
      }
    });
  }
}

function generatePiecesGrid() {
  let html = "";
  let i = 0;
  let num = getNumOfPieceTypes(pieces);
  for (let row = 0; row < num / 4; row++) {
    html = '<div class="row">';
    for (let col = 0; col < 4; col++) {
      while(pieces[i] == 0 && i < pieces.length) i++;
      if (row * 4 + col < num) {
        html += '<div class="four wide text-center column">';
        html += '<p id=' + row * 4 + col + '-name">' + names[i] + '</p>';
        html += '<div class="row"><div class="ui statistic"><div id="' + i + '-value';
        html += '"class="value">' + pieces[i] + '</div></div></div>';
        html += '<button class="ui button" id="' + row * 4 + col + '-value">Place</button></div>';
        i++;
      }
    }
    // I want there to be vertical lines between each cube so I need to add a blank space 
    if (num % 4 != 0 && row + 1 > num / 4) {
      let size = "";
      switch(row % 4) {
        case 1: size = 'twelve'; break;
        case 2: size = 'eight'; break;
        case 3: size = 'four'; break;
      }
      html += '<div class="' + size + ' wide column"></div>'
    };
    html += '</div>';
    $('#supply-grid').append(html);
  }
}