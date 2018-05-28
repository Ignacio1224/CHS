// hook up events
$(document).ready(initLogin);
$('#slcProfile').change(updateAccessFields);

function initLogin() {
    $('#loginBox').fadeIn('slow');
    updateAccessFields();
}

function updateAccessFields() {
    if ($('#slcProfile').val() == 'M') {
        $("#ctlGroupDocument").hide();
        $("#ctlGroupNumber").show();
    } else {
        $("#ctlGroupNumber").hide();
        $("#ctlGroupDocument").show();
    }
}