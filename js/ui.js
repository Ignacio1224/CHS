// Eventos
$(document).ready(mostrarCuadroLogin);
$('#btnIngresar').click(ingresar);

/**
 * Muestra el cuadro de login en pantalla con un efecto de fundido.
 */
function mostrarCuadroLogin() {
    $('#slcPerfil').change(actualizarCampos);
    $('#cuadroLogin').fadeIn('slow');
    actualizarCampos();
}

/**
 * Actualiza los campos de acceso de usuario dependiendo de la opción seleccionada en la lista de perfiles.
 */
function actualizarCampos() {
    if ($('#slcPerfil').val() == 'M') {
        $("#ctlGroupDocumento").hide();
        $("#ctlGroupNumero").show();
    } else {
        $("#ctlGroupNumero").hide();
        $("#ctlGroupDocumento").show();
    }
}

/**
 * Acceso al sistema, se encarga de validar los datos de entrada y armar la interfaz gráfica de acuerdo al perfil de acceso.
 */
function ingresar() {
    $('#divError').empty();
    var perfil = $('#slcPerfil').val();
    var identidad;
    var clave = $('#txtClave').val();

    if (perfil === 'M') {
        identidad = Number($('#txtNumero').val());
    } else {
        identidad = Number($('#txtDocumento').val());
    }

    /**
     *  Si la clave no es vacía y tanto el número (en caso de médico) o el documento (en caso de paciente)
     *  son valores numéricos distintos de 0 buscaremos el usuario en los arrays correspondientes
     *  consultando al módulo de acceso a datos.
     */
    if (clave !== "" && !isNaN(identidad) && identidad !== 0) {
        var usuario = accesoDatos.ObtenerUsuario({
            _perfil: perfil,
            _identidad: identidad,
            _clave: clave
        });

        // Chequear si el usuario existe en el sistema.
        if (usuario.length > 0) {
            accesoDatos.EstablecerUsuarioLogueado(usuario[0]);
            $('#txtNumero').val('');
            $('#txtDocumento').val('');
            $('#txtClave').val('');

            $('#divError').hide();
            $('#vistaLogin').hide();

            if (usuario[0].hasOwnProperty('especialidad')) {
                $('#vistaEscritorioMedico').show(vistaEscritorioMedico);
                $('#vistaEscritorioSocio').hide();
            } else {
                $('#vistaEscritorioMedico').hide();
                $('#vistaEscritorioSocio').show(vistaEscritorioSocio);
            }

            //console.log(accesoDatos.ObtenerUsuarioLogueado());
        } else {
            $('#divError').html('<span>No existe el usuario</span>');
            $('#divError').show();
        }
    } else {
        $('#divError').html('<span>Los datos de acceso son incorrectos</span>');
        $('#divError').show();
    }
}

function vistaEscritorioSocio() {
    $('#ddiAM').html(accesoDatos.ObtenerNombreMedico(accesoDatos.ObtenerUsuarioLogueado().medicocabecera));
    $('#navbarDropdown').html(accesoDatos.ObtenerUsuarioLogueado().nombre);
    $("#btnCerrarSesion").click(function () {
        $('#vistaEscritorioSocio').hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
    });

    $('#btnCambiarClave').click(function () {

    });

    let st = []
    for (let i = 0, l = accesoDatos.ObtenerHistoria(accesoDatos.ObtenerUsuarioLogueado().documento).length; i < l; i++) {
        st[i] = accesoDatos.ObtenerHistoria(accesoDatos.ObtenerUsuarioLogueado().documento)[i];
    }

    $('#tablaHistorias').html('');
    $('#tablaMedicosConsultados').html('');
    
    for (let j = st[st.length - 1].historia - 1; j > -1; j--) {
        let fechan = st[j].fecha.split(" - ");
        $('#tablaHistorias').append(`<tr id='t${j}'></tr>`);
        $(`#t${j}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
        $(`#t${j}`).append("<td>" + st[j].motivo + "</td>");
        $(`#t${j}`).append("<td>" + st[j].numero + "</td>");
        $(`#t${j}`).append("<td>" + st[j].diagnostico + "</td>");
        $(`#t${j}`).append("<td>" + st[j].prescripcion + "</td>");
        $(`#t${j}`).append("<td> <a href='" + st[j].imagen + "'> Imagen</a></td>");
    }

    for (let h = st[st.length - 1].historia - 1; h > -1; h--) {
        let fechan = st[h].fecha.split(" - ");
        $('#tablaMedicosConsultados').append(`<tr id='h${h}'></tr>`);
        $(`#h${h}`).append("<td>" + accesoDatos.ObtenerNombreMedico(st[h].numero) + "</td>");
        $(`#h${h}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
    }
}

function vistaEscritorioMedico() {
    console.log("Soy Medico");
}