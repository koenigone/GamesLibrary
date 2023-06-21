// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Submit Buttons Section
// Country Code Submit Button
$('#CCsubmit').on('click', function() {
    $('#CountryCodeResults').css('display', 'block');

    $.ajax({
        url: "lib/PHP/CountryCode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCodeLat: $('#countryCodeLat').val(),
            countryCodeLng: $('#countryCodeLng').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $('#txtLanguages').val(result['data']['languages']);
                $('#txtDistance').val(result['data']['distance']);
                $('#txtCountryCode').val(result['data']['countryCode']);
                $('#txtCountryName').val(result['data']['countryName']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handling the error
            console.log('Error:', textStatus, errorThrown);
            $('#error-div').html('<span>Error: ' + textStatus + ', ' + errorThrown + '</span>');
        }
    }); 
    
    $('#CCtableClearBtn').on('click', function() {
        $('#CountryCodeResults').css('display', 'none');
    });
});

// Timezone Submit Button
$('#TZsubmit').on('click', function() {
    $('#TimeZoneResults').css('display', 'block');

    $.ajax({
        url: 'lib/PHP/Timezone.php',
        type: 'POST',
        dataType: 'json',
        data: {
            timezoneLat: $('#timeZoneLat').val(),
            timezoneLng: $('#timeZoneLng').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtSunrise').val(result['data']['sunrise']);
                $('#txtTimeCountryCode').val(result['data']['countryCode']);
                $('#txtSunset').val(result['data']['sunset']);
                $('#txtTimezoneId').val(result['data']['timezoneId']);
                $('#txtTimeCountryName').val(result['data']['countryName']);
                $('#txtTime').val(result['data']['time']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handling the error
            console.log('Error:', textStatus, errorThrown);
            $('#error-div').html('<span>Error: ' + textStatus + ', ' + errorThrown + '</span>');
        }
    }); 
});

// Oceans Submit Button
$('#PCsubmit').on('click', function() {
    $('#PostalCodeResults').css('display', 'block');

    $.ajax({
        url: 'lib/PHP/PostalCode.php',
        type: 'POST',
        dataType: 'json',
        data: {
            postalCode: $('#postalCode').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $('#txtPostalCountryCode').val(result['data'][0]['countryCode']);
                $('#txtPostalPostalCode').val(result['data'][0]['postalCode']);
                $('#txtPostalPlaceName').val(result['data'][0]['placeName']);
                $('#txtPostalLatitude').val(result['data'][0]['lat']);
                $('#txtPostalLongitude').val(result['data'][0]['lng']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handling the error
            console.log('Error:', textStatus, errorThrown);
            $('#error-div').html('<span>Error: ' + textStatus + ', ' + errorThrown + '</span>');
        }
    }); 
});

// Clearing Results Button
$('#clearBtn').on('click', function() {
    $('#CountryCodeResults').css('display', 'none');
    $('#TimeZoneResults').css('display', 'none');
    $('#PostalCodeResults').css('display', 'none');
});
