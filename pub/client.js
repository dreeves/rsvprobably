// client-side js
// run by the browser each time your view template is loaded

// protip: you can rename this to use .coffee if you prefer

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {  
  $.get('/rsvps', function(rsvps) {
    rsvps.forEach(function(rsvp) {
      $('<li></li>').text(rsvp).appendTo('ol#rsvps')
    })
  });
  
  $.get('/min', function(x) { document.getElementById('mincount').innerHTML = x });
  $.get('/max', function(x) { document.getElementById('maxcount').innerHTML = x });

  $('form').submit(function(event) {
    event.preventDefault();
    var rsvp = $('input').val();
    $.post('/rsvps?' + $.param({rsvp: rsvp}), function() {
      $('<li></li>').text(rsvp).appendTo('ol#rsvps');
      $('input').val('');
      $('input').focus()
    })
  })

})
