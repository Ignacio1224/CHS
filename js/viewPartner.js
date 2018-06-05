$(document).ready(loadTableHistory);

function loadTableHistory() {
    let st = getStory(7896541);
    $('#tableHistory').append("<td>" + st.date + "</td>");
    $('#tableHistory').append("<td>" + st.reason + "</td>");
    $('#tableHistory').append("<td>" + st.doctorNumber + "</td>");
    $('#tableHistory').append("<td>" + st.diagnostic + "</td>");
    $('#tableHistory').append("<td>" + st.prescription + "</td>");
    $('#tableHistory').append("<td> <a href='" + st.picture + "'> Imagen</a></td>");
}