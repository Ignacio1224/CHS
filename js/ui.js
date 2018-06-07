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

            $('#divError').hide();
            $('#vistaLogin').hide();

            if (usuario.hasOwnProperty('especialidad')) {
                $('#vistaEscritorioMedico').show(vistaEscritorioMedico);
                $('#vistaEscritorioSocio').hide();
            } else {
                $('#vistaEscritorioMedico').hide();
                $('#vistaEscritorioSocio').show(vistaEscritorioSocio);
            }

            /*if ($('#vistaEscritorioSocio').is(':visible')) {
                vistaEscritorioSocio();
            } else if ($('#vistaEscritorioMedico').is(':visible')) {
                vistaEscritorioMedico();
            }*/

            console.log(accesoDatos.ObtenerUsuarioLogueado());
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
    console.log("Soy Socio");
}

function vistaEscritorioMedico() {
    console.log("Soy Medico");
}