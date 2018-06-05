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



/** Partner Functions */

/** Getters */


/** Get Medical Header, input his Document */
function getMedicalHeader(_document) {
    let doc;
    for (let i = 0, l = partners.length; i < l; i++) {
        if (partners[i].document === _document) {
            doc = partners[i].medicalHeader;
            break;
        }
    }
    return doc;
}

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



/** Story Functions */

/** Getters */


/** Get (obj)Story, input a partner document */
function getStory(_document) {
    let story = [];
    for (let i = 0, l = stories.length; i < l; i++) {
        if (stories[i].partnerDocument === _document) {
            story = stories[i];
            break;
        }
    }
    return story;
}


/** Setters */

/** Add a (obj)Story in (arr)Stories */
function addStory(pDocument, dNumber, reason, diagnostic, prescription = "", picture = "") {
    stories.push({
        "nStorie": getLastStorie() + 1,
        "partnerDocument": pDocument,
        "doctorNumber": dNumber,
        "date" : getDate(),
        "reason" : reason,
        "diagnostic" : diagnostic,
        "prescription" : prescription,
        "picture" : picture 
    });
}

/** Get Last Storie */
function getLastStorie() {
    return stories[stories.length - 1].nStorie;
}



/** Aditional Functions */

/** Get Date of Today */
function getDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + ' - ' + mm + ' - ' + dd;
    return today
}