// Eventos
$(document).ready(mostrarCuadroLogin);
$('#btnIngresar').click(ingresar);
$('#btnCambiarClave').click(cambiarClave);
$('#btnCambiarMedico').click(cambiarMedico);


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

function vistaEscritorioMedico() {
    $('#navbarDropdownMedico').html(accesoDatos.ObtenerUsuarioLogueado().nombre);
    $("#btnCerrarSesionM").click(function () {
        $('#vistaEscritorioMedico').hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
    });
}

function vistaEscritorioSocio() {
    $('#navText').html("Historia Cl&iacute;nica");
    $('#nav-ch-tab').click(function () {
        $('#navText').html("Historia Cl&iacute;nica");
    });

    $('#nav-medicalHistory-tab').click(function () {
        $('#navText').html("Historial de M&eacute;dicos Consultados");
    });

    $('#nav-images-tab').click(function () {
        $('#navText').html("Im&aacute;genes");
    });
    $('#ddiAM').html(accesoDatos.ObtenerNombreMedico(accesoDatos.ObtenerUsuarioLogueado().medicocabecera));
    $('#modalCambiarMedico').ready(cargarCmbMedico);
    $('#navbarDropdown').html(accesoDatos.ObtenerUsuarioLogueado().nombre);
    $("#btnCerrarSesion").click(function () {
        $('#vistaEscritorioSocio').hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
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
        $(`#t${j}`).append("<td>" + accesoDatos.ObtenerNombreMedico(st[j].numero) + "</td>");
        $(`#t${j}`).append("<td>" + st[j].motivo + "</td>");
        $(`#t${j}`).append("<td>" + st[j].diagnostico + "</td>");
        $(`#t${j}`).append("<td>" + st[j].prescripcion + "</td>");
        $(`#t${j}`).append("<td> <img width='40px' height='40px' src='" + st[j].imagen + "'/></td>");
    }

    for (let h = st[st.length - 1].historia - 1; h > -1; h--) {
        let fechan = st[h].fecha.split(" - ");
        $('#tablaMedicosConsultados').append(`<tr id='h${h}'></tr>`);
        $(`#h${h}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
        $(`#h${h}`).append("<td>" + accesoDatos.ObtenerNombreMedico(st[h].numero) + "</td>");
        $(`#h${h}`).append("<td>" + accesoDatos.ObtenerEspecialidad(st[h].numero) + "</td>");
    }

    $('#galery').html('');
    for (let k = st[st.length - 1].historia - 1; k > -1; k--) {
        let fechan = st[k].fecha.split(" - ");
        $('#galery').append(`<div class='row'><div class='col-md-4'><div class='thumbnail'><a href='${st[k].imagen}'target='_blank'><img src='${st[k].imagen}' style='width:100%'><div class='caption'><p>Fecha: ${fechan[2] + ' - ' + fechan[1] + ' - ' + fechan[0]}</p><p>Diagn&oacute;stico: ${st[k].diagnostico}</p></div></a></div></div></div>`);
    }
}


function cambiarClave() {
    var clave = $('input[name=txtClave]').val();
    var claveVerificacion = $('input[name=txtClaveVerificada]').val();

    if (clave !== '' && claveVerificacion !== '') {
        if (clave !== claveVerificacion) {
            $('#divErrorCambiarClave').html('<span>Las claves que has ingresado deben coincidir</span>');
            $('#divErrorCambiarClave').show();
        } else {
            accesoDatos.ObtenerUsuarioLogueado().clave = clave;
            console.log(accesoDatos.ObtenerUsuarioLogueado());
            $('#modalCambiarClave').modal('hide');
        }
    } else {
        $('#divErrorCambiarClave').html('<span>Los campos son obligatorios</span>');
        $('#divErrorCambiarClave').show();
    }
}

function cargarCmbMedico() {
    let med = accesoDatos.ObtenerMedicos();
    $('#sCambiarMedico').html("");
    for (let i = 0, l = med.length; i < l; i++) {
        if (med[i].numero !== accesoDatos.ObtenerUsuarioLogueado().medicocabecera && accesoDatos.ObtenerEspecialidad(accesoDatos.ObtenerUsuarioLogueado().medicocabecera) === "Medicina General") {
            $('#sCambiarMedico').append(`<option value='${med[i].numero}'>${med[i].nombre}</option>`);
        }
    }
}

function cambiarMedico() {
    var medico = $('select[name=cmbCambiarMedico]').val();
    accesoDatos.ObtenerUsuarioLogueado().medicocabecera = Number(medico);
    console.log(accesoDatos.ObtenerUsuarioLogueado());
    $('#ddiAM').html(accesoDatos.ObtenerNombreMedico(accesoDatos.ObtenerUsuarioLogueado().medicocabecera));
    $('#modalCambiarMedico').modal('hide');
    $('#modalCambiarMedico').on('hidden.bs.modal', cargarCmbMedico());
}