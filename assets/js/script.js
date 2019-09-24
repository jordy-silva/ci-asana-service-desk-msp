// Set values of second dropdown dependent on first dropdown selection
function fetchOptions(event) {
    var hardwareOptions = ["What hardware do yo need?", "MacBook Air", "MacBook Pro", "iPad", "Iphone"];
    var softwareOptions = ["What software do yo need?", "LucidCharts", "Tableau Desktop", "Excel"];
    var selectedOption = $('#requestType').val();

    if (selectedOption == 'hardware') {
        options = hardwareOptions;
    } else {
        options = softwareOptions;
    }

    $('#whatIsNeeded').empty();

    $.each(options, function (i, p) {
        if (i == 0) {
            $('#whatIsNeeded').append($('<option disabled selected></option>').val('').html(p));
        } else {
            $('#whatIsNeeded').append($('<option></option>').val(p).html(p));
        }
    });
}

// Check if Web Storage is supported and fetch previously stored values if any
if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("pat")) {
        $('#pat').val(localStorage.getItem("pat"));
    } else {
        alert('Before using this app you need to set your preferences');
        var errorAlerted = true;
    }

    if (localStorage.getItem("projectID")) {
        $('#projectID').val(localStorage.getItem("projectID"));
    } else if (!errorAlerted) {
        alert('Before using this app you need to set your preferences');
    }
} else {
    alert('Your browser is not supported');
}

// Save preferences in Web Storage when changed
function savePreferences(event) {
    var formField = event.target.id;
    localStorage.setItem(formField, $('#' + formField).val());
}