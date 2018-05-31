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