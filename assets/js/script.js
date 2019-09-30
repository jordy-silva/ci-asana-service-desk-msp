// Set values of second dropdown dependent on first dropdown selection
function fetchOptions(event) {
    if (event.target.id == "requestType") {
        if ($('#requestType').val() == 'Hardware') {
            options = Object.keys(config.options.hardware);
        } else {
            options = Object.keys(config.options.software);
        }
        var target = '#requestCategory';
        $('#whatIsNeeded').empty()
        selectString = 'category';
    } else {
        if ($('#requestType').val() == 'Hardware') {
            options = config.options.hardware[$('#' + event.target.id).val()];
        } else {
            options = config.options.software[$('#' + event.target.id).val()];
        }
        var target = '#whatIsNeeded';
        selectString = 'product';
    }

    $(target).empty();

    $.each(options, function (i, p) {
        if (i == 0) {
            $(target).append($('<option value disabled selected>Please select a ' + selectString + '</option>'));
            $(target).append($('<option></option>').val(p).html(p));
        } else {
            $(target).append($('<option></option>').val(p).html(p));
        }
    });
}

// Check if Web Storage is supported and fetch previously stored values if any
if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("pat")) {
        $('#pat').val(localStorage.getItem("pat"));
    } else {
        alert(config.alertStrings.noPreferences);
        var errorAlerted = true;
    }

    if (localStorage.getItem("projectID")) {
        $('#projectID').val(localStorage.getItem("projectID"));
    } else if (!errorAlerted) {
        alert(config.alertStrings.noPreferences);
    }
} else {
    alert(config.alertStrings.noWebStorage);
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

        var body = config.bodyStrings[0] + $('#emailaddress').val()
            + config.bodyStrings[1] + $('#requestType').find(":selected").val()
            + config.bodyStrings[2] + $('#whatIsNeeded').find(":selected").val()
            + config.bodyStrings[3] + $('input[name=urgency]:checked').val() + config.bodyStrings[4];

        var newTask = {
            name: $('#requestType').find(":selected").val() + config.task.nameString,
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