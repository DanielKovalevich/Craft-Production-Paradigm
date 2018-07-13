const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];
let pieceOrders = [];
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
 * Because including other functions in es5 is shit,
 * I moved 4 functions to supplyGrid since the manufacturer.js also requires the same functions
 */