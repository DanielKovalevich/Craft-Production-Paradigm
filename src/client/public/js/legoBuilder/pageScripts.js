$(document).ready(() => {
  $('#order').click(e => {
    checkOrders();
    //$('#no-orders').modal('show');
    $('#ready-order').modal('show');
  });
});

/**
 * ================================================================
 *                    HTML BUTTOM FUNCTIONS
 * ================================================================
 */

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

function checkOrders() {

}