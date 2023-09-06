const $mainCounter = $('.main-counter');
const $customColor = $('#colorPicker');
const $customBackground = $('#backgroundPicker');
const $mainBackground = $('#main-background');

const $userInputText = $('#userInputText');
const $userInputDate = $('#userInputDate');

const $chosenYear = $('#year');
const $daysInput = $('#counter-days');
const $hoursInput = $('#counter-hours') ;
const $minutesInput = $('#counter-minutes');
const $secondsInput = $('#counter-seconds');

let newYear = '1 Jan 2024';

$customColor.on('change', function() {
    $mainCounter.css('color', $(this).val());
});

$customBackground.on('change', function() {
    const file = $(this)[0].files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            $mainBackground.attr('src', e.target.result);
        };

        reader.readAsDataURL(file);
    }
});

function newYearCountDown() {
    const newYearDate = new Date(newYear);
    const currentYear = new Date();
    const totalSeconds = (newYearDate - currentYear) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    $daysInput.text(days);
    $hoursInput.text(hours);
    $minutesInput.text(minutes);
    $secondsInput.text(seconds);
}

newYearCountDown();

setInterval(newYearCountDown, 1000);


$(document).ready(function() {
    $('#user-form').on('submit', function(e) {
        e.preventDefault();


        userInputText = $('#userInputText').val();
        userInputDate = $('#userInputDate').val();

        if (userInputText) {
            $('#year').html(userInputText);
        } else {
            $('#year').html(userInputDate);
        }

        newYear = userInputDate;

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

$(document).on('click', '.data-link', function(e) {
    e.preventDefault(); // Prevent the default anchor action.
    
    let userText = $(this).data('text');
    let userDate = $(this).data('date');
    
    $('#userInputText').val(userText);
    $('#userInputDate').val(userDate);
});

$(document).ready(function() {
    
    $.ajax({
        url: 'lib/PHP/displayDates.php',
        type: 'GET', // default method for retrieval should be GET
        dataType: 'json',
        success: function(response) {
    
            if(response.status.code === "200") {
                let tableContent = '';
                
                response.data.forEach(function(row) {
                    tableContent += '<tr>' + 
                                        '<td>' + row.eventName + '</td>' +
                                        '<td>' + row.eventDate + '</td>' +
                                        '<td>' +
                                        '<button class="btn btn-secondary date-use-button mb-2" data-event-name="' + row.eventName + '" data-event-date="' + row.eventDate + '"><i class="fa-solid fa-arrow-left"></i></button>' +
                                            '<button class="btn btn-secondary date-delete-button" data-id="' + row.id + '"><i class="fa-solid fa-delete-left"></i></button>' +
                                        '</td>' +
                                    '</tr>';
                });
                
                $('#tableBodyDate').html(tableContent);

                // using the Date from the dates table
                $('.date-use-button').on('click', function() {

                    var eventName = $(this).data('event-name'); // buttons data by name
                    var eventDate = $(this).data('event-date');

                    $('#userInputText').val(eventName);
                    $('#userInputDate').val(eventDate);

                    // changing countdown info
                    $('#year').html(eventName);
                    newYear = eventDate;
                })

            } else {
                alert(response.status.description);
            }
        },        
        error: function(err) {
            alert('AJAX Error:', err);
        }
    });
});


$(document).on('click', '.date-delete-button', function(e) {
    e.preventDefault(); 
    e.stopPropagation();  // Stop any parent click handlers from executing.

    let dataId = $(this).data('id');

    if (confirm('Are you sure you want to delete this entry?')) {
        $.ajax({
            url: 'lib/PHP/deleteDates.php',
            type: 'POST',
            data: { id: dataId },
            success: function(response) {

                $(e.target).closest('tr').remove();
            },
            error: function(err) {
                alert('Deletion failed:', err);
            }
        });
    }
});

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
                                        `<td><input type="color" value="${row.fontColor}" id="displayedColor" disabled><span class="text-capitalize opacity-50"> ${row.fontColor.toUpperCase()}</span></td>` +
                                        '<td>' +
                                            '<button class="btn btn-secondary paint-use-button m-2"><i class="fa-solid fa-arrow-left"></i></button>' +
                                            '<button class="btn btn-secondary paint-delete-button" data-id="' + row.id + '"><i class="fa-solid fa-delete-left"></i></button>' +
                                        '</td>' +
                                    '</tr>';
                })

                $('#tableBodyPaint').html(tableContent);

                // using the color from the color table
                $('.paint-use-button').on('click', function() {
                    var pickedColor = $(this).closest('tr').find('#displayedColor').val();
                
                    $('#colorPicker').val(pickedColor);
                    $('.main-counter').css('color', pickedColor); // changing the main counter text color
                })
                

            } else {
                alert('Error ' + response.status.code);
            }
        },
        error: function(err) {
            alert('Error fetching data: ' + JSON.stringify(err));
        } 
    })
});

$(document).ready(function() {

    $('#addPaintBtn').on('click', function() {
        
        let fontColor = $('#colorPicker').val();
        let backgroundPath = $('#backgroundPicker').val();

        let data = {
            fontColor: fontColor,
            background_path: backgroundPath
        };

        $.ajax({
            type: 'POST',
            url: 'lib/PHP/addPaint.PHP',
            data: data,
            dataType: 'json',
            success: function(response) {
                if(response.status.code === "200") {
                    console.log("Data added successfully!");
                } else {
                    alert("Error adding data!");
                }
            },
            error: function() {
                alert("AJAX request failed!");
            }
        });

    });

});

$(document).on('click', '.paint-delete-button', function(e) {
    e.preventDefault();
    e.stopPropagation();

    let paintId = $(this).data('id');

    if(confirm('Are you sure you want to delete this entry?')) {
        $.ajax({
            url: 'lib/PHP/deletePaint.php',
            type: 'POST',
            data: { id: paintId },
            success: function(response) {
                $(e.target).closest('tr').remove();
            },
            error: function(err) {
                alert('Error: ', err);
            }
        })
    }
})