const names = ["1x1", "2x2", "2x3x2", "1x2 Pin", 
              "2x2 Pin", "2x2x2 Pin", "2x2 Double", "Tire 1",
              "Tire 2", "Tire 3", "Rim 1", "Rim 2",
              "Rim 3", "1x2", "1x4", "1x2 Plate",
              "4x6 Plate", "6x8 Plate", "2x10 Plate", "Windshield",
              "Steering Wheel", "Lego Man"];

$(document).ready(() => {
  generateSupplyGrid();
  
});

function generateSupplyGrid() {
  let html = "";
  for (let i = 0; i < names.length / 4; i++) {
    html = '<div class="row">';
    for (let j = 0; j < 4; j++) {
      if (i * 4 + j < names.length) {
        html += '<div class="four wide column">';
        html += '<p>' + names[i * 4 + j] + '</p>';
        html += '<div class="row">'
        html += '<div class="ui icon buttons">]' +
          '<button class="ui button"><i class="pause icon"></i></button>' +
          '<button class="ui button"><i class="shuffle icon"></i></button></div></div></div>';
      }
    }
    if (i + 1 >= names.length / 4) html += '<div class="five wide column"></div>';
    html += '</div>';
    $('#supply-grid').append(html);
  }
}