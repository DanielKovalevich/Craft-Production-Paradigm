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
    html = '<div class="row">';
    for (let j = 0; j < 4; j++) {
      if (i * 4 + j < names.length) {
        html += '<div class="four wide column">';
        html += '<p>' + names[i * 4 + j] + '</p>';
        // Start off each piece with an order of 0
        html += '<div class="row"><div class="ui statistic"><div id="' + (i * 4 + j) + '-value' + '"class="value">0</div></div></div>'
        // Adds the plus and minus buttons to each piece
        html += '<div class="row"><div class="ui icon buttons">' +
          '<button id="'+ (i * 4 + j) + '-minus' + '" class="ui button"><i class="minus icon"></i></button>' +
          '<button id="'+ (i * 4 + j) + '-plus' + '" class="ui button"><i class="plus icon"></i></button></div></div></div>';
      }
    }
    // I want there to be vertical lines between each cube so I need to add a blank space 
    if (i + 1 >= names.length / 4) html += '<div class="five wide column"></div>';
    html += '</div>';
    $('#supply-grid').append(html);
  }
}