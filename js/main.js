function empty(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function logIn() { 
    let txtNumber = Number(document.getElementById("txtNumber").value);
    let txtDocument = Number(document.getElementById("txtDocument").value);
    let txtPassword = document.getElementById("txtPassword").value;
    let op = $('#slcProfile').val();

    let _logIn = false;
    let divError = document.getElementById("divError");

    error[0] = "El Campo Documento No Puede Estar Vacío!";
    error[1] = "El Campo Contraseña No Puede Estar Vacío!";
    error[2] = "The Document Field Is Invalid!";
    error[3] = "Las Credenciales Son Incorrectas";

    empty(divError);

    // Control Nulls Inputs && Number(txtDocument)
    if (txtDocument === "") {
        divError.innerHTML += `<p>${error[0]}</p> ${br}`;
        _logIn = false;
    } else if (isNaN(txtDocument)) {
        divError.innerHTML += `<p>${error[2]}</p> ${br}`;
        _logIn = false;
    } else { 
        _logIn = true;
    }
    if (txtPassword === "") {
        divError.innerHTML += `<p>${error[1]}</p> ${br}`;
        _logIn = false;
    } else if (_logIn){
        _logIn = true;
    }

    // Control Who Access to the System
    if (_logIn) {
    empty(divError);        
        _logIn = false;
        if (op == "M") {
            // Doctor Access
            doctors.forEach(d => {
                if (d.dNumber === txtNumber && d.password === txtPassword) {
                    _logIn = true;
                }
            });
            if (_logIn) {
                // ACCESS GRANTED
                document.getElementById("txtNumber").value = "";
                document.getElementById("txtPassword").value = "";
                window.open("doctor.html");
            } else {
                // ACCESS DENIED 
                divError.innerHTML += `<p>${error[3]}</p> ${br}`;                
            }
        }
            
        if(op == "P") {
            // Partner Access
            partners.forEach(p => {
                if (p.document === txtDocument && p.password === txtPassword) {
                    _logIn = true;
                }
            });
            if (_logIn) {
                // ACCESS GRANTED
                document.getElementById("txtDocument").value = "";
                document.getElementById("txtPassword").value = "";             
                window.open("partner.html");
            } else {
                // ACCESS DENIED 
                divError.innerHTML += `<p>${error[3]}</p> ${br}`;                
            }            
        }
    }
}
