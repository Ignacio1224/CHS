$(document).ready(initLogin);

function initLogin() {
    $('#loginBox').fadeIn('slow');
    hideFields();
}

function hideFields() {
    if (document.getElementById("option1").checked === true) {
        document.getElementById("lblDocument").style.display = "none";
        document.getElementById("txtDocument").style.display = "none";
    } else {
        document.getElementById("lblDocument").style.display = "block";        
        document.getElementById("txtDocument").style.display = "block";
    }
    if (document.getElementById("option2").checked === true) {
        document.getElementById("lblNumber").style.display = "none";        
        document.getElementById("txtNumber").style.display = "none";
    } else {
        document.getElementById("lblNumber").style.display = "block";
        document.getElementById("txtNumber").style.display = "block";        
    }
}