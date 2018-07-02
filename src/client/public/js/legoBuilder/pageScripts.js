orderInformation = {};

$(document).ready(() => {
  $('#order').click(e => {
    openModal();
  });
  checkOrders();
});

// gets the pin from the url
function getPin() {
  return /(\d+)(?!.*\d)/g.exec(window.location.href)[0];
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
  // Need to find the oldest order that hasn't been finished or canceled
  let i = 0;
  while(orderInformation[i].status != 'In Progress') i++;
  switch(orderInformation[i].modelType) {
    case 'super': $('#order-image').attr('src', '/../images/race.jpg');        break;
    case 'race': $('#order-image').attr('src', '/../images/lego_car.jpg');     break;
    case 'RC': $('#order-image').attr('src', '/../images/rc.jpg');             break;
    case 'yellow': $('#order-image').attr('src', '/../images/yellow_car.jpg'); break;
  }
  console.log(orderInformation[i]);
  let html = '<p>Date Ordered: ' + new Date(orderInformation[i].createDate).toString() + '</p>';
  html += '<p>Model Type: ' + orderInformation[i].modelType + '</p>';
  html += '<p>Status: ' + orderInformation[i].status + '</p><br>';
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
        updateOrder();
      }
    },
    error: (xhr, status, error) => {
      console.log('Error: ' + error);
    }
  });

  setTimeout(checkOrders, 3000);
}