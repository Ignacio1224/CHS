
$('#partner-tab a').on('click', function(e) {
    console.log(e.target.text);
    $('.breadcrumb-item.active').first().text(e.target.text);
});


function closeSession() {
    window.close();
    location.reload();
}

