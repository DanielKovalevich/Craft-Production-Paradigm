$(document).ready(() => {
  initImages();
  //$('#message').transition('fade');
});

function initImages() {
  $('#1').click(e => {
    changeCarType(1);
    $('.ui.basic.modal').modal('show');
  });
  $('#2').click(e => {
    changeCarType(2);
    $('.ui.basic.modal').modal('show');
  });
  $('#3').click(e => {
    changeCarType(3);
    $('.ui.basic.modal').modal('show');
  });
  $('#4').click(e => {
    changeCarType(4);
    $('.ui.basic.modal').modal('show');
  });
}

function changeCarType(number) {
  let dom = $('#car-type');
  switch(number) {
    case 1: dom.html('super');  break;
    case 2: dom.html('race');   break;
    case 3: dom.html('RC');     break;
    case 4: dom.html('yellow'); break;
  }
}