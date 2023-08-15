// Displaying All persons From the Database
$('#searchMain').on('input', function() {
    var personID = $('#searchMain').val();

    $('#personnelBtn').tab('show'); // Showing the Personnel tab when searching

    if (personID) {
        $.ajax({
            type: 'GET',
            url: 'lib/PHP/getPersonnelByID.php',
            data: {
                id: personID
            },
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {
                    displayPersonnel(response.data.personnel);
                } else {
                    displayAllPersonnel();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: " + textStatus + " - " + errorThrown);
            }
        });
    } else {
        displayAllPersonnel();
    }
});

// Display a table row of searched person
function displayPersonnel(personnel) {

    var personnelContainer = $('#personnel-tab-pane .row');
    personnelContainer.empty();  // Clear existing content
    

    $.each(personnel, function(index, person) {
        var cardId = 'collapseCard' + person.id;  // Unique ID for each collapsible card content

        var card = $(
            '<div class="col-md-4 mb-4">' +
            '<div class="card">' +
            '<div class="card-header" data-bs-toggle="collapse" data-bs-target="#' + cardId + '" aria-expanded="false" aria-controls="' + cardId + '">' +
            '<h5 class="card-title mb-0">' + person.firstName + ' ' + person.lastName + '</h5>' +
            '<p class="mb-0"><strong>ID:</strong> ' + person.id + '</p>' +
            '</div>' +
            '<div id="' + cardId + '" class="collapse">' +  // Collapsible card content
            '<div class="card-body">' +
            '<p class="card-text"><strong>Email:</strong> ' + person.email + '</p>' +
            '<p class="card-text"><strong>Job Title:</strong> ' + person.jobTitle + '</p>' +
            '<p class="card-text"><strong>Department:</strong> ' + (person.departmentName || 'N/A') + '</p>' +
            '<p class="card-text"><strong>Location:</strong> ' + (person.locationName || "N/A") + '</p>' +
            '<button type="button" class="btn btn-primary btn-sm me-1" data-bs-toggle="modal" data-id="' + person.id + '">' +
            '<i class="fa-solid fa-pencil fa-fw"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-primary btn-sm" data-id="' + person.id + '">' +
            '<i class="fa-solid fa-trash fa-fw"></i>' +
            '</button>' +
            '</div>' +
            '</div>' + 
            '</div>' +
            '</div>'
        );

        personnelContainer.append(card);

    });
}

// Display all persons
function displayAllPersonnel() {
    $.ajax({
        url: 'lib/PHP/getPersonnel.php',
        dataType: 'json',
        success: function(data) {
            var personnelContainer = $('#personnel-tab-pane .row');
            personnelContainer.empty();  // Clear any previous cards
            
            $.each(data, function(index, row) {
                var cardId = 'collapseCard' + row.id;

                var card = $(
                    '<div class="col-md-4 mb-4">' +
                    '<div class="card">' + 
                    '<div class="card-header" data-bs-toggle="collapse" data-bs-target="#' + cardId + '" aria-expanded="false" aria-controls="' + cardId + '">' +
                    '<h5 class="card-title mb-0">' + row.firstName + ' ' + row.lastName + '</h5>' +
                    '<p class="mb-0"><strong>ID:</strong> ' + row.id + '</p>' +
                    '</div>' +
                    '<div id="' + cardId + '" class="collapse">' +
                    '<div class="card-body">' +
                    '<p class="card-text"><strong>Email:</strong> ' + row.email + '</p>' +
                    '<p class="card-text"><strong>Job Title:</strong> ' + row.jobTitle + '</p>' +
                    '<p class="card-text"><strong>Department:</strong> ' + (row.departmentName || "N/A") + '</p>' +
                    '<p class="card-text"><strong>Location:</strong> ' + (row.locationName || "N/A") + '</p>' +
                    '<button type="button" class="cardEditBtn btn btn-primary btn-sm me-1 editPersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + row.id + '">' +
                    '<i class="fa-solid fa-pencil fa-fw"></i>' +
                    '</button>' +
                    '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="' + row.id + '">' +
                    '<i class="fa-solid fa-trash fa-fw"></i>' +
                    '</button>' +
                    '</div>' +
                    '</div>' + 
                    '</div>' +
                    '</div>'
                );
    
                personnelContainer.append(card);
            });
        }
    });
}

$(document).ready(function() {
    displayAllPersonnel();
});

// Department Modal Show Button
$(document).on('click', '.editPersonnelBtn', function() {
    const personnelID = $(this).data('id');

    $('#editPersonnelID').val(personnelID);
    $('#editPersonnelModal').show();
});

// Updating Department Data
$(document).ready(function() {
    $("#editPersonnelForm").on("submit", function(e) {
        e.preventDefault(); // prevent default form submission

        let formData = {
            id: $("#editPersonnelID").val(),
            firstName: $("#editPersonnelFirstName").val(),
            lastName: $("#editPersonnelLastName").val(),
            jobTitle: $("#editPersonnelJobTitle").val(),
            email: $("#editPersonnelEmail").val(),
            departmentID: $("#editPersonnelDepartmentID").val()
        };

        $.ajax({
            url: 'lib/PHP/updatePersonnel.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {

                    // Closing the Modal & layout
                    $('#editPersonnelModal').hide();
                    $(".modal-backdrop").remove();

                } else {
                    alert("Update failed: " + response.status.description);
                }
            },
            error: function(error) {
                alert("An error occurred: " + error.statusText);
            }
        });
    });
});

// Personnel Delete Button
$(document).on('click', '.deletePersonnelBtn', function() {
    var personnelID = $(this).data('id');

    // Confirm the deletion
    if (confirm('Are you sure you want to delete this person?')) {
        deletePersonnel(personnelID);
    }
});

function deletePersonnel(id) {
    $.ajax({
        url: 'lib/PHP/deletePersonnel.php',
        type: 'POST',
        data: {
            id: id
        },
        dataType: 'json',
        success: function(response) {
            if (response.status.code == '200') {
                alert('Person deleted successfully');

                $('#personnel-tab-pane tbody tr[data-id="' + id + '"]').remove();

                location.reload();

            } else {
                alert('Error deleting person: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred: ' + textStatus);
        }
    });
}


// Display all persons
function displayAllDepartment() {
    $.ajax({
        url: 'lib/PHP/getAllDepartments.php',
        dataType: 'json',
        success: function(data) {
            var tableBody = $('#department-tab-pane tbody'); // directly select the tbody
    
            $.each(data.data, function(index, row) {
                var tableRow = $('<tr data-id="' + row.id + '">' +
                '<td>' + row.id + '</td>' + // Moved ID column to match the HTML structure
                '<td>' + row.name + '</td>' +
                '<td>' + row.locationID + '</td>' +
                '<td class="text-end">' +
                '<button type="button" class="btn btn-primary btn-sm me-1 editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + row.id + '">' +
                '<i class="fa-solid fa-pencil fa-fw"></i>' +
                '</button>' +
                '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + row.id + '">' +
                '<i class="fa-solid fa-trash fa-fw"></i>' +
                '</button>' +
                '</td>' +
                '</tr>');
    
                tableBody.append(tableRow);
            });
        }
    });
}

$(document).ready(function() {
    displayAllDepartment();
});

// Department Modal Show Button
$(document).on('click', '.editDepartmentBtn', function() {
    const departmentID = $(this).data('id');

    $('#editDepartmentID').val(departmentID);
    $('#editDepartmentModal').show();
});

// Updating Department Data
$(document).ready(function() {
    $("#editDepartmentForm").on("submit", function(e) {
        e.preventDefault(); // prevent default form submission

        let formData = {
            id: $("#editDepartmentID").val(),
            name: $("#editDepartmentName").val(),
            locationID: $("#editDepartmentLocationID").val()
        };

        $.ajax({
            url: 'lib/PHP/updateDepartment.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {

                    // Closing the Modal & layout
                    $('#editDepartmentModal').hide();
                    $(".modal-backdrop").remove();

                } else {
                    alert("Update failed: " + response.status.description);
                }
            },
            error: function(error) {
                alert("An error occurred: " + error.statusText);
            }
        });
    });
});

// Department Delete Button
$(document).on('click', '.deleteDepartmentBtn', function() {
    var departmentID = $(this).data('id');

    // Confirm the deletion
    if (confirm('Are you sure you want to delete this department?')) {
        deleteDepartment(departmentID);
    }
});

function deleteDepartment(id) {
    $.ajax({
        url: 'libs/php/deleteDepartmentByID.php',
        type: 'POST',
        data: {
            id: id
        },
        dataType: 'json',
        success: function(response) {
            if (response.status.code == '200') {
                alert('Department deleted successfully');

                $('#department-tab-pane tbody tr[data-id="' + id + '"]').remove();

                location.reload();

            } else {
                alert('Error deleting department: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred: ' + textStatus);
        }
    });
}



// Displaying All Locations From the Database
function displayAllLocation() {
    $.ajax({
        url: 'lib/PHP/getLocation.php',
        dataType: 'json',
        success: function(data) {
            var tableBody = $('#location-tab-pane tbody'); // directly select the tbody
    
            $.each(data.data, function(index, row) {
                var tableRow = $('<tr>' +
                    '<td>' + row.id + '</td>' + // Moved ID column to match the HTML structure
                    '<td>' + row.name + '</td>' +
                    '<td class="text-end">' +
                    '<button type="button" class="btn btn-primary btn-sm me-1 editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + row.id + '">' +
                    '<i class="fa-solid fa-pencil fa-fw"></i>' +
                    '</button>' +
                    '<button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="' + row.id + '">' +
                    '<i class="fa-solid fa-trash fa-fw"></i>' +
                    '</button>' +
                    '</td>' +
                    '</tr>');
    
                tableBody.append(tableRow);
            });
        }
    });
}

$(document).ready(function() {
    displayAllLocation();
});


// Location Modal Show Button
$(document).on('click', '.editLocationBtn', function() {
    const locationID = $(this).data('id');

    $('#editLocationID').val(locationID); // setting the location ID
    $('#editLocationModal').show();
});


// Updating Location Data
$(document).ready(function() {
    $("#editLocationForm").on("submit", function(e) {
        e.preventDefault(); // prevent default form submission

        let formData = {
            id: $("#editLocationID").val(),
            locationName: $("#editLocationName").val(),
        };
        
        $.ajax({
            url: 'lib/PHP/updateLocation.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {

                    // Closing the Modal & layout
                    $('#editLocationModal').hide();
                    $(".modal-backdrop").remove();

                } else {
                    alert("Update failed: " + response.status.description);
                }
            },
            error: function(error) {
                alert("An error occurred: " + error.statusText);
            }
        });
    });
});

// Location Delete Button
$(document).on('click', '.deleteLocationBtn', function() {
    var locationID = $(this).data('id');

    // Confirm the deletion
    if (confirm('Are you sure you want to delete this location?')) {
        deleteLocation(locationID);
    }
});

function deleteLocation(id) {
    $.ajax({
        url: 'lib/PHP/deleteLocationByID.php',
        type: 'POST',
        data: {
            id: id
        },
        dataType: 'json',
        success: function(response) {
            if (response.status.code == '200') {
                alert('Location deleted successfully');

                $('#location-tab-pane tbody tr[data-id="' + id + '"]').remove();

                location.reload();
                
            } else {
                alert('Error deleting location: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred: ' + textStatus);
        }
    });
}
