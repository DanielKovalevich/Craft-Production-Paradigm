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
let colors = [];

$(document).ready(() => {
  initButtons();
  checkOrders();
  for (let i = 0; i < names.length; i++) colors[i] = "#d0d3d4";
  setTimeout(checkPieces, 1000);
  setTimeout(getColors, 3000);
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

  $('#send-model').click(e => {
    if (!$.isEmptyObject(group)) {
      sendGroup();
    }
  });
}

function cycle() {
  let index = allModels.indexOf(currentObj);
  currentObj = ++index == allModels.length ? allModels[0] : allModels[index];
  loadRollOverMesh();
}

function getModel(name) {
  allModels.forEach((element, i) => {
    if (element.name == name) {
      currentObj = element;
      pieceIndex = names.indexOf(currentObj);
    }
  });
  loadRollOverMesh();
}

//======================================================================================================
//                                    Order Functions
//======================================================================================================

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
  html += '<p>Last Modified: ' + new Date(currentOrder.lastModified).toString() + '</p>';
  if (currentOrder.status === 'Completed')
    html += '<p>Finished: ' + new Date(currentOrder.finishedTime).toString() + '</p>';
  html += '<p>Model Type: ' + currentOrder.modelType + '</p>';
  html += '<p>Status: ' + currentOrder.status + '</p><br>';
  $('#order-info').html(html);
}

function checkOrders() {
  $.ajax({
    type: 'GET',
    url: GameAPI.rootURL + '/gameLogic/getOrders/' + getPin(),
    timeout: 30000,
    success: (data) => {
      orderInformation = data;
      // Need to find the oldest order that hasn't been finished or canceled
      removeOrdersAtManuf(orderInformation);
      let i = 0;
      if (orderInformation.length != 0) {
        while(orderInformation[i].status != 'In Progress') {
          i++;
          if (i >= orderInformation.length) break;
        }
        // if all the orders are complete, i just set the current as the first order
        currentOrder = orderInformation[i] === undefined ? orderInformation[0] : orderInformation[i];
      }
      updateOrder();
    },
    error: (xhr, status, error) => { 
      console.log('Error: ' + error);
    }
  });

  setTimeout(checkOrders, 10000);
}

function removeOrdersAtManuf(orders) {
  orders.forEach((elem, i) => {
    // don't want other stages to see orders when it is at manufacturer
    if (elem.stage == "Manufacturer")
      orders.splice(i, 1);
  });
  return orders;
}

function sendGroup() {
  let exporter = new THREE.GLTFExporter();
  let options = {
    onlyVisible: false
  }
  exporter.parse(objects, gltf => {
    console.log(gltf);
    let postData = {'model': JSON.stringify(gltf)};
    
    $.ajax({
      type: 'POST',
      data: postData,
      timeout: 10000,
      url: GameAPI.rootURL + '/gameLogic/sendAssembledModel/' + getPin() + '/' + currentOrder._id,
      success: (data) => {
        console.log(data);
        let elemsToRemove = []
        scene.children.forEach(elem => {
          if (elem.type == 'Mesh' && elem.name != 'plane')
            elemsToRemove.push(elem);
        });
      
        elemsToRemove.forEach(elem => {
          scene.remove(elem);
        })
      },
      error: (xhr, status, error) => {
        console.log('Group Error: ' + error);
      }
    });
  }, options);
}

//======================================================================================================
//                                    Supply Grid Stuff
//======================================================================================================

function checkPieces() {
  $.ajax({
    type: 'GET',
    cache: 'false',
    url: GameAPI.rootURL + '/gameLogic/getSupplyOrder/' + getPin() + '/' + currentOrder._id,
    timeout: 5000,
    success: (data) => {
      if (data != null && data != undefined && data != "") {
        if (getNumOfPieceTypes(data) != 0 && !samePieces(data, pieces)) {
          pieces = data;
          generatePiecesGrid();
          initSupplyButtons();
        }
      }
    },
    error: (xhr, status, error) => {
      console.log(error);
    }
  });
}

function openSupplyModal() {
  checkPieces();
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
  if (pieces != null && pieces != undefined) {
    $.ajax({
      type: 'POST',
      data: postData,
      url: GameAPI.rootURL + '/gameLogic/updatePieces/' + getPin() + '/' + currentOrder._id,
      success: (data) => {
        //console.log(data);
        checkPieces();
        generatePiecesGrid();
      },
      error: (xhr, status, error) => {
        console.log(error);
      }
    });
  }
}

function initSupplyButtons() {
  for (let i = 0; i < getNumOfPieceTypes(pieces); i++) {
    let num = '#' + i;
    $(num + '-button').click(e => {
      let modelName = $(num + '-name').html();
      $('#pieces-modal').modal('toggle');
      getModel(modelName);
    });
  }
}

function getColors() {
  $.ajax({
    type: 'GET',
    url: GameAPI.rootURL + '/gameLogic/colors/' + getPin() + '/' + currentOrder._id,
    success: data => {
      colors = data;
    },
    error: (xhr, status, error) => {
      console.log(status, error);
    }
  });
}

function generatePiecesGrid() {
  let html = "";
  // this is to ensure that I'm not appended to previous information
  $('#supply-grid').html(html);
  let i = 0;
  let num = getNumOfPieceTypes(pieces);
  for (let row = 0; row < num / 4; row++) {
    html = '<div class="row">';
    for (let col = 0; col < 4; col++) {
      while(pieces[i] == 0 && i < pieces.length) i++;
      if (row * 4 + col < num) {
        html += '<div class="four wide text-center column">';
        html += '<p id="' + (row * 4 + col) + '-name">' + names[i] + '</p>';
        html += '<div class="row"><div class="ui statistic"><div id="' + i + '-value';
        html += '"class="value">' + pieces[i] + '</div></div></div>';
        html += '<button class="ui button" id="' + (row * 4 + col) + '-button">Place</button></div>';
        i++;
      }
    }
    // I want there to be vertical lines between each cube so I need to add a blank space
    if (num % 4 != 0 && row + 1 > num / 4) {
      let size = "";
      switch(num % 4) {
        case 1: size = 'twelve'; break;
        case 2: size = 'eight'; break;
        case 3: size = 'four'; break;
      }
      html += '<div class="' + size + ' wide column"></div>'
    };
    html += '</div>';
    $('#supply-grid').append(html);
  }

  initSupplyButtons();
}