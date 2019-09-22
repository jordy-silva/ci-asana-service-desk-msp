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