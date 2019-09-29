// Set values of second dropdown dependent on first dropdown selection
function fetchOptions(event) {
    var hardwareOptions = ["What hardware do yo need?", "MacBook Air", "MacBook Pro", "iPad", "Iphone"];
    var softwareOptions = ["What software do yo need?", "LucidCharts", "Tableau Desktop", "Excel"];
    var selectedOption = $('#requestType').val();

    if (selectedOption == 'Hardware') {
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
// LOAD OPTIONS NOT HARDCODED BUT JSON FILE
// DOCUMENT IN README THAT THIS IS SPECIFIC FOR ONE QUEUE
// USE TOOLTIP TO PREFERENCES
// ADD 3RD DROPDOWN. SECOND CATEGORIES

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

// Calculate due date based on selected priority
function setDueDate(priority) {
    var date = new Date();
    if (priority == "High") {
        date.setDate(date.getDate() + 1);
    } else if (priority == "Medium") {
        date.setDate(date.getDate() + 10);
    } else {
        date.setDate(date.getDate() + 30);
    }
    date = date.toISOString().substr(0, 10);
    return date;
}

// Create Asana Task
function createAsanaTask() {
    var dueDate = setDueDate($('input[name=urgency]:checked').val());

    const client = Asana.Client.create().useAccessToken($('#pat').val());

    client.users.me().then(function (me) {
        var asanaWorkspace = me.workspaces[0].gid;

        var body = "<body><strong>Requester: </strong>" + $('#emailaddress').val()
            + "\n\n<strong>" + $('#requestType').find(":selected").val()
            + " requested: </strong>" + $('#whatIsNeeded').find(":selected").val()
            + "\n\n<strong>Urgency selected by requester: </strong>" + $('input[name=urgency]:checked').val() + "</body>";

        var newTask = {
            name: $('#requestType').find(":selected").val() + " request",
            projects: [$('#projectID').val()],
            html_notes: body,
            due_on: dueDate
        };

        client.tasks.createInWorkspace(asanaWorkspace, newTask).then(function (response) {
            alert('Submitted');
            $("#asanaForm").trigger("reset");
            $('#whatIsNeeded').empty();
        }, function (error) {
            console.log("Error " + error.status + " creating the Asana task");
            console.log(error.message);
            console.log(error);
        });
        
    }, function (error) {
        console.log("Error Connecting")
        console.log(error);
    });
    return false;
}