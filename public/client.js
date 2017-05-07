// client-side js
// run by the browser each time your view template is loaded

// protip: you can rename this to use .coffee if you prefer

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
  
  $.get('/favthings', function(favthings) {
    favthings.forEach(function(favthing) {
      $('<li></li>').text(favthing).appendTo('ul#favthings');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var favthing = $('input').val();
    $.post('/favthings?' + $.param({favthing: favthing}), function() {
      $('<li></li>').text(favthing).appendTo('ul#favthings');
      $('input').val('');
      $('input').focus();
    });
  });

});
