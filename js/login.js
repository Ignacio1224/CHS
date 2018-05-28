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

// function hideFields() {
//     if (document.getElementById("option1").checked === true) {
        
//     } else {
//         document.getElementById("lblDocument").style.display = "block";        
//         document.getElementById("txtDocument").style.display = "block";
//     }
//     if (document.getElementById("option2").checked === true) {
//         document.getElementById("lblNumber").style.display = "none";        
//         document.getElementById("txtNumber").style.display = "none";
//     } else {
//         document.getElementById("lblNumber").style.display = "block";
//         document.getElementById("txtNumber").style.display = "block";        
//     }
// }