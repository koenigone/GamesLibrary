// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Refreshing the content
$('#refreshBtn').click(function() {
    refreshContent();
});

function refreshContent() {
    $('#preloader').show();

    var personnelPromise = displayAllPersonnel();
    var departmentPromise = loadDepartments();
    var locationPromise = loadLocations();

    $.when(personnelPromise, departmentPromise, locationPromise).done(function() {
        $('#preloader').hide();
    })
}

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

$(document).ready(function() {
    $("#filterOptionsBtn").click(function() {
        $("#filterEmployeesModal").modal('show');
    });
});

var departmentContainer = $('#departmentContainer');
var selectedDepartments = []; // Array to hold the selected departmentss

departmentContainer.on('click', '.department-item', function() {
    var departmentId = $(this).data('id');

    // Toggle selection
    if ($(this).hasClass('btn-outline-secondary')) {
        $(this).removeClass('btn-outline-secondary').addClass('btn-secondary');
        selectedDepartments.push(departmentId);
    } else {
        $(this).addClass('btn-outline-secondary').removeClass('btn-secondary');
        var index = selectedDepartments.indexOf(departmentId);
        if (index > -1) {
            selectedDepartments.splice(index, 1);
        }
    }
});

$("#filterBtn").click(function() {
    if (selectedDepartments.length === 0) {
        displayAllPersonnel();
    } else {
        displayPersonnelByDepartments(selectedDepartments);
    }
    $("#filterEmployeesModal").modal('hide');
});

function displayPersonnelByDepartments(departmentIds) {
    // Hide all cards
    $('#personnel-cards > div').hide();

    // If no departments are selected, show all cards
    if (departmentIds.length === 0) {
        $('#personnel-cards > div').show();
        return;
    }

    // Only show cards that match the selected departments
    departmentIds.forEach(function(id) {
        $('#personnel-cards > div[data-department-id=' + id + ']').show();
    });
}

// Closing modals/overlays function
function closeModal(modalID) {
    $('#' + modalID).modal('hide');
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

function notAllowedModalControl(string, elementID, callback) { // Deletion confirm function
    // Modal to confirm deletion
    $('#notAllowedMessageMessage').html(string);
    $('#notAllowedMessageModal').modal('show');

    $('#deleteElementBtn').off('click').click(function() {
        callback(elementID);
        
        $('#alertMessageModal').modal('hide');
        $(".modal-backdrop").remove();
    });    
}

// Changing the confirm message depending on the function
function confirmChangeString(string) {
    $('#confirmChangesElement').html(string);
    $('#confirmChangesModal').modal('show');
}

// Display all persons when opening the page
function displayAllPersonnel() {
    var cardResults = $('#personnel-cards');
    cardResults.empty(); // empying the cards for updating without having to reload

    $.ajax({
        url: 'lib/PHP/getPersonnel.php',
        dataType: 'json',
        success: function(data) {
            if (data.length > 0) {
                data.forEach(function(row) {
                    var card = createPersonnelCard(row);
                    cardResults.append(card);
                });
            } else {
                // Display an alert or message if no data is returned
                $('#no-user-found-alert').removeClass('d-none'); // show the alert
            }
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
        '<div class="col-md-3 mb-4" data-department-id="' + row.departmentID + '">' +
            '<div class="card border-0">' + 
            '<div class="card-header text-light" style="background-color: #464646;" data-bs-toggle="collapse" data-bs-target="#' + cardId + '" aria-expanded="false" aria-controls="' + cardId + '">' +
            '<h6 class="card-title mb-0">' + row.lastName + '</h6>' +
            '</div>' +
            '<div id="' + cardId + '" class="collapse">' +
            '<div class="card-body d-flex flex-column text-light" style="background-color: #666666;">' +
    
            // Div containing all the card details
            '<div class="flex-grow-1">' + 
            '<p class="card-text"><strong class="text-warning">Full Name:</strong> ' + row.firstName + ' ' + row.lastName + '</p>' +
            '<p class="card-text"><strong class="text-warning">Job Title:</strong> ' + row.jobTitle + '</p>' +
            '<p class="card-text"><strong class="text-warning">Email:</strong> ' + row.email + '</p>' +
            '<p class="card-text"><strong class="text-warning">Department:</strong> ' + (row.departmentName || "N/A") + '</p>' +
            '<p class="card-text"><strong class="text-warning">Location:</strong> ' + (row.locationName || "N/A") + '</p>' +
            '</div>' +
    
            // Div containing the buttons
            '<div class="d-flex justify-content-end mt-2">' + 
            '<button type="button" class="cardEditBtn btn btn-warning btn-sm me-1 editPersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + row.id + '">' +
            '<i class="fa-solid fa-pencil fa-fw"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-warning btn-sm deletePersonnelBtn" data-id="' + row.id + '">' +
            '<i class="fa-solid fa-trash fa-fw"></i>' +
            '</button>' +
            '</div>' +
    
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

$(document).ready(function() {
    displayAllPersonnel();
});


// Showing error message when user not found
function displayNoUserFound() {
    var personnelContainer = $('#personnel-tab-pane .row');
    personnelContainer.empty();
    $('#no-user-found-alert').removeClass('d-none');
}

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

                    closeModal('editPersonnelModal');
                    confirmChangeString('Person edited');
                    displayAllPersonnel();

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
                
                confirmChangeString('Person deleted');
                displayAllPersonnel();

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

                    closeModal('insertPersonnelModal');
                    $('#insertPersonnelFirstName').val('');
                    $('#insertPersonnelLastName').val('');
                    $('#insertPersonnelJobTitle').val('');
                    $('#insertPersonnelEmail').val('');
                    $('#insertPersonnelDepartment').val('');

                    confirmChangeString('Person added');
                    displayAllPersonnel();

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
function loadDepartments() {
    $.ajax({
        url: 'lib/PHP/getAllDepartments.php',
        dataType: 'json',
        success: function(data) {

            var departmentContainer = $('#departmentContainer');
            var editPersonDepartmentSelect = $('#editPersonnelDepartment');
            var insertPersonDepartmentSelect = $('#insertPersonnelDepartment');

            // Clearing previous data
            departmentContainer.empty();
            editPersonDepartmentSelect.empty();
            insertPersonDepartmentSelect.empty();
            $('#department-tab-pane tbody').empty();

            $.each(data.data, function(index, row) {
                var departmentItem = $('<button class="btn btn-outline-secondary m-2 department-item" data-id="' + row.id + '">' + row.name + '</button>');
                departmentContainer.append(departmentItem);

                var editOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                var insertOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                editPersonDepartmentSelect.append(editOption);
                insertPersonDepartmentSelect.append(insertOption);
            });

            var tableBody = $('#department-tab-pane tbody');

            tableBody.empty();

            $.each(data.data, function(index, row) {
                var tableRow = $('<tr data-id="' + row.id + '">' +
                '<td>' + row.name + '</td>' +
                '<td>' + row.locationName + '</td>' +
                '<td class="text-end">' +
                '<button type="button" class="btn btn-warning btn-sm me-1 editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + row.id + '">' +
                '<i class="fa-solid fa-pencil fa-fw"></i>' +
                '</button>' +
                '<button type="button" class="btn btn-warning btn-sm deleteDepartmentBtn" data-id="' + row.id + '">' +
                '<i class="fa-solid fa-trash fa-fw"></i>' +
                '</button>' +
                '</td>' +
                '</tr>');

                tableBody.append(tableRow);

                tableRow.find('.editDepartmentBtn').off('click').on('click', function() {
                    populateEditForm(row);
                });
            });
        }
    });
}

$(document).ready(function() {
    loadDepartments();
})

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
        e.preventDefault();

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
                    closeModal('editDepartmentModal');
                    confirmChangeString('Department edited');
                    loadDepartments();

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
    loadDepartments();
    var departmentID = $(this).data('id');

    $.ajax({
        url: 'lib/PHP/checkDepartmentDependencies.php',
        type: 'POST',
        data: { id: departmentID },
        dataType: 'json',
        success: function(response) {
            if (response.hasDependencies) {
                notAllowedModalControl('department', departmentID, deleteDepartment);
            } else {
                confirmDeleteModalControl('department', departmentID, deleteDepartment);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred while checking dependencies: ' + textStatus);
        }
    });
});

function deleteDepartment(id) {
    $.ajax({
        url: 'lib/PHP/deleteDepartmentByID.php',
        type: 'POST',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status.code == '200') {
                $('#department-tab-pane tbody tr[data-id="' + id + '"]').remove();
                confirmChangeString('Department deleted');
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

                    closeModal('insertDepartmentModal');
                    $('#insertDepartmentName').val('');
                    $('#insertDepartmentLocation').val('');

                    confirmChangeString('Department added');
                    loadDepartments(); // Load departments when the page is ready
                    
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
function loadLocations() {
    $.ajax({
        url: 'lib/PHP/getLocation.php',
        dataType: 'json',
        success: function(data) {
            
            var tableBody = $('#location-tab-pane tbody');

            var editDepartmentSelect = $('#editDepartmentLocation');
            var insertDepartmentSelect = $('#insertDepartmentLocation');

            tableBody.empty();
            editDepartmentSelect.empty();
            insertDepartmentSelect.empty();

            $.each(data.data, function(index, row) { // generating locations options for Edit & Insert department to show location by name
                var editOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                var insertOption = $('<option value="' + row.id + '">' + row.name + '</option>');
                
                editDepartmentSelect.append(editOption);
                insertDepartmentSelect.append(insertOption);
            });
    
            $.each(data.data, function(index, row) {
                var tableRow = $('<tr>' +
                    '<td>' + row.name + '</td>' +
                    '<td class="text-end">' +
                    '<button type="button" class="btn btn-warning btn-sm me-1 editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + row.id + '">' +
                    '<i class="fa-solid fa-pencil fa-fw"></i>' +
                    '</button>' +
                    '<button type="button" class="btn btn-warning btn-sm deleteLocationBtn" data-id="' + row.id + '">' +
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
}

$(document).ready(function() {
    loadLocations();
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
                    confirmChangeString('Location edited');
                    loadLocations();

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

    $.ajax({
        url: 'lib/PHP/checkLocationDependencies.php',
        type: 'POST',
        data: { id: locationID },
        dataType: 'json',
        success: function(response) {
            if (response.hasDependencies) {
                notAllowedModalControl('location', locationID, deleteLocation);
            } else {
                confirmDeleteModalControl('location', locationID, deleteLocation);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred while checking dependencies: ' + textStatus);
        }
    });
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

                confirmChangeString('Location deleted');
                loadLocations();
                
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

                    closeModal('insertLocationModal');
                    $('#insertLocationName').val('');
                    confirmChangeString('Location added');
                    loadLocations();
                    
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