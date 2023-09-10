let newYear = '1 Jan 2024'; // Main Date

function newYearCountDown() { // Main Countdown Function
    const newYearDate = new Date(newYear);
    const currentYear = new Date();
    const totalSeconds = (newYearDate - currentYear) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    $('#counter-days').text(days);
    $('#counter-hours').text(hours);
    $('#counter-minutes').text(minutes);
    $('#counter-seconds').text(seconds);
}

newYearCountDown();
setInterval(newYearCountDown, 1000); // Update every second

// Changing Font Color
$('#colorPicker').on('change', function() {
  let selectedColor = $(this).val();
  
  $('.main-counter').css('color', selectedColor);
  localStorage.setItem('fontColor', selectedColor);
});

// Keeping Changed Color After Refreshing
$(document).ready(function() {
  let storedColor = localStorage.getItem('fontColor');

  if (storedColor) {
      $('.main-counter').css('color', storedColor);
      $('#colorPicker').val(storedColor);
  }
});

$('#restartBtn').on('click', function() {
  newYear = '1 Jan 2024';

  $('#year').text('2024')
  $('.main-counter').css('color', 'rgba(255, 255, 255, 0.705)');

  // Resetting local storage values
  localStorage.removeItem('eventName');
  localStorage.removeItem('eventDate');
  localStorage.removeItem('fontColor');
})



// AJAX CALLS TO INTERACT WITH DATABASE --------------------



// Displaying dates From the Database
$(document).ready(function() {

    $.ajax({
        url: 'lib/PHP/displayDates.php',
        type: 'GET', // default method for retrieval should be GET
        dataType: 'json',
        success: function(response) {

            if (response.status.code === "200") {
                let tableContent = '';

                response.data.forEach(function(row) { // For each Data, Create a Table tow
                    tableContent += '<tr>' +
                        '<td>' + row.eventName + '</td>' +
                        '<td>' + row.eventDate + '</td>' +
                        '<td>' +
                        '<button class="btn btn-secondary m-1 date-use-button" data-event-name="' + row.eventName + '" data-event-date="' + row.eventDate + '"><i class="fa-solid fa-arrow-left"></i></button>' +
                        '<button class="btn btn-secondary date-delete-button" data-id="' + row.id + '"><i class="fa-solid fa-delete-left"></i></button>' +
                        '</td>' +
                        '</tr>';
                });

                $('#tableBodyDate').html(tableContent);

                // using the Date from the dates table
                $('.date-use-button').on('click', function() {
                  var eventName = $(this).data('event-name'); // buttons data by name
                  var eventDate = $(this).data('event-date');
          
                  // Changing countdown info
                  $('#year').html(eventName);
                  newYear = eventDate;
          
                  // Storing info to keep after refreshing
                  localStorage.setItem('eventName', eventName);
                  localStorage.setItem('eventDate', eventDate);
              });
          
              let storedEventName = localStorage.getItem('eventName');
              let storedEventDate = localStorage.getItem('eventDate');

              // if stored then use
              if (storedEventName && storedEventDate) {
                  $('#year').html(storedEventName);
                  newYear = storedEventDate;
              }

            } else { // show error if response status doesn't equel '200'
                alert(response.status.description);
            }
        },
        error: function(err) { // Error if AJAX failed     
            alert('AJAX Error:', err);
        }
    });
});

// Adding new Dates
$(document).ready(function() {
    $('#user-form').on('submit', function(e) {
        e.preventDefault();

        userInputText = $('#userInputText').val();
        userInputDate = $('#userInputDate').val();

        if (userInputText) { // If user added title, then change the text
            $('#year').html(userInputText);
        } else {
            $('#year').html(userInputDate); // Add date as title if user didn't add a title
        }

        newYear = userInputDate; // Change Date to chosen Date

        let userData = {
            text: userInputText,
            date: userInputDate
        };

        $.ajax({
            url: 'lib/PHP/addDates.php',
            type: 'POST',
            data: userData,
            success: function(response) {

            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('AJAX Error: ' + textStatus + ': ' + errorThrown);
            }
        });
    });
});

// Deleting Dates
$(document).on('click', '.date-delete-button', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Stop any parent click handlers from executing.

    let dataId = $(this).data('id');

    if (confirm('Are you sure you want to delete this entry?')) {
        $.ajax({
            url: 'lib/PHP/deleteDates.php',
            type: 'POST',
            data: {
                id: dataId
            },
            success: function(response) {
                $(e.target).closest('tr').remove();
            },
            error: function(err) {
                alert('Deletion failed:', err);
            }
        });
    }
});


// Displaying Font colors From Database
$(document).ready(function() {
    $.ajax({
        url: 'lib/PHP/displayPaint.php',
        type: 'GET',
        dataType: 'JSON',
        success: function(response) {
            if (response.status.code === '200') {
                var tableContent = '';


                response.data.forEach(function(row) {

                    tableContent += '<tr>' +
                        `<td><input type="color" value="${row.fontColor}" id="displayedColor" disabled><span class="text-capitalize opacity-50"> ${(row.fontColor ? row.fontColor.toUpperCase() : 'N/A')}</span></td>` +
                        '<td>' +
                        '<button class="btn btn-secondary paint-use-button m-2" data-bgpath="' + row.background_path + '"><i class="fa-solid fa-arrow-left"></i></button>' +
                        '<button class="btn btn-secondary paint-delete-button" data-id="' + row.id + '"><i class="fa-solid fa-delete-left"></i></button>' +
                        '</td>' +
                        '</tr>';
                })

                $('#tableBodyPaint').append(tableContent);

                // using the color from the color table
                $('.paint-use-button').on('click', function() {
                    var pickedColor = $(this).closest('tr').find('#displayedColor').val();

                    $('#colorPicker').val(pickedColor);
                    $('.main-counter').css('color', pickedColor);

                    // Sotring the color
                    localStorage.setItem('fontColor', pickedColor);
                });

                let storedColor = localStorage.getItem('fontColor');

                // If there's a stored color, apply it
                if (storedColor) {
                  $('.main-counter').css('color', storedColor);
                  $('#colorPicker').val(storedColor); // Set the value of color picker to the stored color
                }


            } else {
                alert('Error ' + response.status.code);
            }
        },
        error: function(err) {
            alert('Error fetching data: ' + JSON.stringify(err));
        }
    })
});

// Adding Font Colors
$(document).ready(function() {

    $('#addPaintBtn').on('click', function() {

        let fontColor = $('#colorPicker').val();

        let data = {
            fontColor: fontColor,
        };

        $.ajax({
            type: 'POST',
            url: 'lib/PHP/addPaint.php',
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {
                    // event if succeed
                } else {
                    alert("Error adding data!");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('AJAX Error: ' + textStatus + ': ' + errorThrown);
            }
        });
    });
});

// Deleting Font Colors
$(document).on('click', '.paint-delete-button', function(e) {
    e.preventDefault();
    e.stopPropagation();

    let paintId = $(this).data('id');

    if (confirm('Are you sure you want to delete this entry?')) {
        $.ajax({
            url: 'lib/PHP/deletePaint.php',
            type: 'POST',
            data: {
                id: paintId
            },
            success: function(response) {
                $(e.target).closest('tr').remove();
            },
            error: function(err) {
                alert('Error: ', err);
            }
        })
    }
})