/** Doctor Functions */

/**Getters */

function getDoctorName(_dNumber) {
    let name = "";
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].dNumber === _dNumber) {
            name = doctors[i].name;
            break;
        }
    }
    return name;
}