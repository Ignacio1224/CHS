$(document).ready(loadAll);

function loadAll() {
    loadTableHistory();
    loadActualDoctor();
}

function loadTableHistory() {
    let st = accesoDatos.ObtenerHistoria();
    let fecha = st.fecha.split(" - ");
    $('#tableHistory').append("<td>" + fecha[2] + " - " + fecha[1] + " - " + fecha[0] + "</td>");
    $('#tableHistory').append("<td>" + st.motivo + "</td>");
    $('#tableHistory').append("<td>" + st.numero + "</td>");
    $('#tableHistory').append("<td>" + st.diagnostico + "</td>");
    $('#tableHistory').append("<td>" + st.prescripcion + "</td>");
    $('#tableHistory').append("<td> <a href='" + st.imagen + "'> Imagen</a></td>");
}

function loadActualDoctor() {
    $("#ddiAM").append(getDoctorName(getMedicalHeader((loggedUser === null || loggedUser === undefined) ? 4927439 : loggedUser))); // Cambiar a loggedUser, se usa de prueba 4927439
}