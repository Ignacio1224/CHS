$(document).ready(loadAll);

function loadAll() {
    loadTableHistory();
    loadActualDoctor();
}

function loadTableHistory() {
    let st = getStory(loggedUser);
    let date = [];
    date = st.date.split(" - ");
    $('#tableHistory').append("<td>" + date[2] + " - " + date[1] + " - " + date[0] + "</td>");
    $('#tableHistory').append("<td>" + st.reason + "</td>");
    $('#tableHistory').append("<td>" + st.doctorNumber + "</td>");
    $('#tableHistory').append("<td>" + st.diagnostic + "</td>");
    $('#tableHistory').append("<td>" + st.prescription + "</td>");
    $('#tableHistory').append("<td> <a href='" + st.picture + "'> Imagen</a></td>");
}

function loadActualDoctor() {
    document.getElementById("ddiAM").innerHTML = getDoctorName(getMedicalHeader(loggedUser));
}