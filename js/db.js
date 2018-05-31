/** Doctor Functions */

/** Getters */


/** Get Name, input his dNumber */
function getDoctorName(_dNumber) {
    let name = "";
    for (let i = 0, l = doctors.length; i < l; i++) {
        if (doctors[i].dNumber === _dNumber) {
            name = doctors[i].name;
            break;
        }
    }
    return name;
}

/** Get Speciality, imput his dNumber */
function getSpeciality(_dNumber) {
    let speciality = "";
    for (let i = 0, l = doctors.length; i < l; i++) {
        if (doctors[i].dNumber === _dNumber) {
            speciality = doctors[i].speciality;
            break;
        }
    }
    return speciality;
}

/** Get an array of dNumbers candidates with the name that was introduced in the function */
function getDoctorNumber(_name) {
    let numbers = [];
    let n = 0;
    for (let i = 0, l = doctors.length; i < l; i++) {
        if (doctors[i].name === _name) {
            numbers[n] = doctors[i].dNumber;
            n++;
        }
    }
    return numbers;
}


/** Partner Functions */

/** Getters */

/** Get Name, imput his Document */
function getPartnerName(_document) {
    let name = "";
    for (let i = 0, l = partners.length; i < l; i++) {
        if (partners[i].document === _document) {
            name = partners[i].name;
            break;
        }
    }
    return name;
}

/** Get Medical Header, input his Document */
function getMedicalHeader(_document) {
    let doc = "";
    for (let i = 0, l = partners.length; i < l; i++) {
        if (partners[i].document === _document) {
            doc = partners[i].medicalHeader;
            break;
        }
    }
    return doc;
}

/** Get Pasword, inputs his Document */
function getPartnerPassword(_document) {
    let passs = "";
    for (let i = 0, l = partners.length; i < l; i++) {
        if (partners[i].document === _document) {
            passs = partners[i].password;
            break;
        }
    }
    return passs;
}