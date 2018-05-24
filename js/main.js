function createFields() {
    let lblHeader, lblDocument, lblPassword, lblDoctor, lblPartner;
    switch (document.getElementById("cmbLanguage").value) {
        case "english":
            lblHeader = "LogIn";
            lblDocument = "Document";
            lblPassword = "Password";
            lblDoctor = "Doctor";
            lblPartner = "Partner";
            error[0] = "The Document Field Can't Be Empty!";
            error[1] = "The Pasword Field Can't Be Empty!";
            error[2] = "The Document Field Is Invalid!";
            error[3] = "The Credentials Are Incorrect!";            
            break;
        case "spanish":
            lblHeader = "Ingreso";
            lblDocument = "Documento";
            lblPassword = "Contraseña";
            lblDoctor = "Doctor";
            lblPartner = "Socio";
            error[0] = "El Campo Documento No Puede Estar Vacío!";
            error[1] = "El Campo Contraseña No Puede Estar Vacío!";
            error[2] = "The Document Field Is Invalid!";
            error[3] = "Las Credenciales Son Incorrectas";
            break;
    }

    document.getElementById("lblTableHeader").innerHTML = lblHeader;
    document.getElementById("lblDocument").innerHTML = lblDocument;
    document.getElementById("lblPassword").innerHTML = lblPassword;
    document.getElementById("lblDoctor").innerHTML = lblDoctor;
    document.getElementById("lblPartner").innerHTML = lblPartner;
    document.getElementById("rdbttnDoctor").checked = true;
}

function empty(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function logIn() { 
    if (state) {
        let txtDocument = Number(document.getElementById("txtDocument").value);
        let txtPassword = document.getElementById("txtPassword").value;
        let rdbttnDoctor = document.getElementById("rdbttnDoctor").checked;
        let rdbttnPartner = document.getElementById("rdbttnPartner").checked;

        let _logIn = false;
        let divError = document.getElementById("divError");

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
            if (rdbttnDoctor) {
                // Doctor Access
                doctors.forEach(d => {
                    if (d.dNumber === txtDocument && d.password === txtPassword) {
                        _logIn = true;
                    }
                });
                if (_logIn) {
                    // ACCESS GRANTED
                    document.getElementById("txtDocument").value = "";
                    document.getElementById("txtPassword").value = "";
                    state = false;
                    window.open("doctor.html");
                } else {
                    // ACCESS DENIED 
                    divError.innerHTML += `<p>${error[3]}</p> ${br}`;                
                }
            }
            
            if(rdbttnPartner) {
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
                    state = false;                
                    window.open("partner.html");
                } else {
                    // ACCESS DENIED 
                    divError.innerHTML += `<p>${error[3]}</p> ${br}`;                
                }            
            }
        }
    }
}

