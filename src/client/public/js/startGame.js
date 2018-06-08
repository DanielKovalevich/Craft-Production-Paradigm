$(document).ready(() => {
  $('#example4').progress({
    text: {
      active  : 'Getting game ready',
      success : 'Game is ready. Hit start to begin!'
    }
  });

  $('#start-game').click((e) => {
    $('#example4').progress('increment');
    e.preventDefault();
  });

  $('#exit').click((e) => {
    window.location.href = '/';
  });

});