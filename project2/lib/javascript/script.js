// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Buttons to show modals that add data to the database
$(document).ready(function() {

    $('#openPersonnelModal').on('click', function(e) {
        e.preventDefault();
        $('#insertPersonnelModal').modal('show');
    });

    $('#openDepartmentModal').on('click', function(e) {
        e.preventDefault();
        $('#insertDepartmentModal').modal('show');
    });

    $('#openLocationModal').on('click', function(e) {
        e.preventDefault();
        $('#insertLocationModal').modal('show');
    });
});

// Filter control
$('#departmentFilter').on('change', function() {
    var selectedDepartment = $(this).val();

    $('#personnelBtn').tab('show');

    // Show all cards if no department is selected (value is empty)
    if (!selectedDepartment) {
        $('#personnel-tab-pane .row > div').show();
    } else {
        // Hide all cards
        $('#personnel-tab-pane .row > div').hide();

        // Only show cards that match the selected department
        $('#personnel-tab-pane .row > div[data-department-id=' + selectedDepartment + ']').show();
    }
});

// Empting the value to display all departments
$('.showAllBtn').on('click', function() {
    $('#departmentFilter').val('').change();
});

// Closing modals/overlays function
function closeModal(modalID) {
    $('#' + modalID).hide();
    $(".modal-backdrop").remove();
}

function confirmDeleteModalControl(string, elementID, callback) { // Deletion confirm function
    // Modal to confirm deletion
    $('#deleteElementMessage').html(string);
    $('#alertMessageModal').modal('show');

    $('#deleteElementBtn').off('click').click(function() {
        callback(elementID);
        
        $('#alertMessageModal').modal('hide');
        $(".modal-backdrop").remove();
    });    
}

// Display all persons when opening the page
function displayAllPersonnel() {
    $.ajax({
        url: 'lib/PHP/getPersonnel.php',
        dataType: 'json',
        success: function(data) {
            displayPersonnel(data);
        }
    });
}

// Main search element, only searches for persons
$('#searchMain').on('input', function() {
    var personID = $('#searchMain').val();

    $('#personnelBtn').tab('show'); // redirecting the user to personnel tab when searching

    if (personID) {
        $.ajax({
            type: 'GET',
            url: 'lib/PHP/getPersonnelByID.php',
            data: {
                id: personID
            },
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200" && response.data.personnel.length > 0) {
                    displayPersonnel(response.data.personnel);
                } else {
                    displayNoUserFound();
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

// Creating Card for both personnel functions
function createPersonnelCard(row) {
    var cardId = 'collapseCard' + row.id;
    var card = $(
        '<div class="col-md-4 mb-4" data-department-id="' + row.departmentID + '">' +
            '<div class="card">' + 
            '<div class="card-header" data-bs-toggle="collapse" data-bs-target="#' + cardId + '" aria-expanded="false" aria-controls="' + cardId + '">' +
            '<h5 class="card-title mb-0">' + row.firstName + ' ' + row.lastName + '</h5>' +
            '<p class="mb-0"><strong>ID:</strong> ' + row.id + '</p>' +
            '</div>' +
            '<div id="' + cardId + '" class="collapse">' +
            '<div class="card-body">' +
            '<p class="card-text"><strong>Job Title:</strong> ' + row.jobTitle + '</p>' +
            '<p class="card-text"><strong>Email:</strong> ' + row.email + '</p>' +
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

    card.find('.editPersonnelBtn').on('click', function() {
        populatePersonnelForm(row);
    });

    return card;
}

// Display one person by ID
function displayPersonnel(personnel) {
    $('#no-user-found-alert').addClass('d-none');  // Hide the error message
    var personnelContainer = $('#personnel-tab-pane .row');
    personnelContainer.empty();

    $.each(personnel, function(index, row) {
        var card = createPersonnelCard(row);
        personnelContainer.append(card);
    });
}

// Showing error message when user not found
function displayNoUserFound() {
    var personnelContainer = $('#personnel-tab-pane .row');
    personnelContainer.empty();
    $('#no-user-found-alert').removeClass('d-none');
}

// Showing all persons again if the search input was deleted
$(document).ready(function() {
    displayAllPersonnel();
});

// Filling the edit form with existing info for easy editing
function populatePersonnelForm(row) {
    $('#editPersonnelFirstName').val(row.firstName);
    $('#editPersonnelLastName').val(row.lastName);
    $('#editPersonnelJobTitle').val(row.jobTitle);
    $('#editPersonnelEmail').val(row.email);
    $('#editPersonnelDepartmentID').val(row.departmentID);
}

// Edit personnel Modal
$(document).on('click', '.editPersonnelBtn', function() {
    const personnelID = $(this).data('id');

    $('#editPersonnelID').val(personnelID);
    $('#editPersonnelModal').show();
});

// Updating personnel Data
$(document).ready(function() {
    $("#editPersonnelForm").on("submit", function(e) {
        e.preventDefault(); // prevent default form submission

        let formData = {
            id: $("#editPersonnelID").val(),
            firstName: $("#editPersonnelFirstName").val(),
            lastName: $("#editPersonnelLastName").val(),
            jobTitle: $("#editPersonnelJobTitle").val(),
            email: $("#editPersonnelEmail").val(),
            departmentID: $("#editPersonnelDepartment").val()
        };

        $.ajax({
            url: 'lib/PHP/updatePersonnel.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {

                    // Closing the Modal & layout
                    closeModal('editPersonnelModal');

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

    confirmDeleteModalControl('person', personnelID, deletePersonnel);
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

// Adding new person to the database
$(document).ready(function() {
    $('#insertPersonnelForm').submit(function(e) {
        e.preventDefault(); // Prevent default form submission

        var formData = {
            firstName: $('#insertPersonnelFirstName').val(),
            lastName: $('#insertPersonnelLastName').val(),
            jobTitle: $('#insertPersonnelJobTitle').val(),
            email: $('#insertPersonnelEmail').val(),
            departmentID: $('#insertPersonnelDepartment').val()
        };

        $.ajax({
            url: 'lib/PHP/insertPersonnel.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if(response.status.code === "200") {
                    alert('Person added successfully!');

                    closeModal('insertPersonnelModal');

                    location.reload();

                } else {
                    alert('Error: ' + response.status.description);
                }
            },
            error: function(xhr, status, error) {
                alert('AJAX Error:', error);
            }
        });
    });
});

// Display all departments on the department tab when opening the webpage
$(document).ready(function() {
    $.ajax({
        url: 'lib/PHP/getAllDepartments.php',
        dataType: 'json',
        success: function(data) {

            var departmentFilterSelect = $('#departmentFilter');

            $.each(data.data, function(index, row) { // generating options for the filter dropdown
                var filterOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                departmentFilterSelect.append(filterOption);
            });

            var editPersonDepartmentSelect = $('#editPersonnelDepartment');
            var insertPersonDepartmentSelect = $('#insertPersonnelDepartment');

            $.each(data.data, function(index, row) { // generating options for Edit & Insert forms to display department names instead of ID
                var editOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                var insertOption = $('<option value="' + row.id + '">' + row.name + '</option>');

                editPersonDepartmentSelect.append(editOption);
                insertPersonDepartmentSelect.append(insertOption);
            });

            var tableBody = $('#department-tab-pane tbody');

            $.each(data.data, function(index, row) {
                var tableRow = $('<tr data-id="' + row.id + '">' +
                '<td>' + row.id + '</td>' +
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

                tableRow.find('.editDepartmentBtn').on('click', function() {
                    populateEditForm(row);
                });
            });
        }
    });
});

// Setting existing data as default form values for easy editing
function populateEditForm(row) {
    $('#editDepartmentName').val(row.name);
    $('#editDepartmentLocationID').val(row.locationID);
}

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
            locationID: $("#editDepartmentLocation").val()
        };

        $.ajax({
            url: 'lib/PHP/updateDepartment.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {

                    closeModal('editDepartmentModal')

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

    // Modal to confirm deletion
    confirmDeleteModalControl('department', departmentID, deleteDepartment);
});

function deleteDepartment(id) {
    $.ajax({
        url: 'lib/PHP/deleteDepartmentByID.php',
        type: 'POST',
        data: {
            id: id
        },
        dataType: 'json',
        success: function(response) {
            if (response.status.code == '200') {

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

// Adding departments
$(document).ready(function() {
    $('#insertDepartmentForm').submit(function(e) {
        e.preventDefault();

        var departmentName = $('#insertDepartmentName').val();
        var locationID = $('#insertDepartmentLocation').val();

        $.ajax({
            url: 'lib/PHP/insertDepartment.php',
            method: 'POST',
            data: {
                name: departmentName,
                locationID: locationID
            },
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {
                    alert('Department added successfully!');

                    closeModal('insertDepartmentModal')
                    
                } else {
                    alert('Error: ' + response.status.description);
                }
            },
            error: function(error) {
                alert('There was an error processing your request.');
            }
        });
    });
});

// Displaying All Locations From the Database
$(document).ready(function() {
    $.ajax({
        url: 'lib/PHP/getLocation.php',
        dataType: 'json',
        success: function(data) {

            var editDepartmentSelect = $('#editDepartmentLocation');
            var insertDepartmentSelect = $('#insertDepartmentLocation'); 

            $.each(data.data, function(index, row) { // generating locations options for Edit & Insert department to show location by name
                var editOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                var insertOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                
                editDepartmentSelect.append(editOption);
                insertDepartmentSelect.append(insertOption);
            });

            var tableBody = $('#location-tab-pane tbody');
    
            $.each(data.data, function(index, row) {
                var tableRow = $('<tr>' +
                    '<td>' + row.id + '</td>' +
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

                tableRow.find('.editLocationBtn').on('click', function() {
                    populateLocationForm(row);
                });
            });
        }
    });
});

// Setting existing value as default for easy editing
function populateLocationForm(row) {
    $('#editLocationName').val(row.name);
}

// Edit location Modal
$(document).on('click', '.editLocationBtn', function() {
    const locationID = $(this).data('id');

    $('#editLocationID').val(locationID);
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

                    closeModal('editLocationModal');

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

    confirmDeleteModalControl('location', locationID, deleteLocation);
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

// Adding a new location
$(document).ready(function() {
    $('#insertLocationForm').on('submit', function(e) {
        e.preventDefault();

        let locationName = $('#insertLocationName').val();

        $.ajax({
            type: "POST",
            url: 'lib/PHP/insertLocation.php',
            data: {
                name: locationName
            },
            dataType: 'json',
            success: function(response) {
                if (response.status.code === '200') {
                    alert('Location added successfully!');

                    closeModal('insertLocationModal');
                    
                } else {
                    alert('Failed to add location: ' + response.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Error occurred: ' + textStatus);
            }
        });
    });
});