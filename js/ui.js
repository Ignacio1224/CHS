// Eventos
$(document).ready(mostrarCuadroLogin);
$('#btnIngresar').click(ingresar);
$('#btnCambiarClave').click(cambiarClave);
$('#btnCambiarMedico').click(cambiarMedico);
$('#btnAgregarHC').click(agregarHC);


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
    var docV = true;

    if (perfil === 'M') {
        identidad = Number($('#txtNumero').val());
    } else {
        docV = validarCI($('#txtDocumento').val());
        if (docV) {
            identidad = Number($('#txtDocumento').val());
        }
    }

    /**
     *  Si la clave no es vacía y tanto el número (en caso de médico) o el documento (en caso de paciente) es valido,
     *  son valores numéricos distintos de 0 buscaremos el usuario en los arrays correspondientes
     *  consultando al módulo de acceso a datos.
     */
    if (clave !== "" && !isNaN(identidad) && identidad !== 0 && docV) {
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

        } else {
            $('#divError').html('<span>No existe el usuario</span>');
            $('#divError').show();
        }
    } else {
        $('#divError').html('<span>Los datos de acceso son incorrectos</span>');
        $('#divError').show();
    }
}

/**
 * Punto de entrada para la vista del escritorio del perfil médico.
 */
function vistaEscritorioMedico() {
    $('#navbarDropdownMedico').html(accesoDatos.ObtenerUsuarioLogueado().nombre);
    $("#btnCerrarSesionM").click(function () {
        $('#vistaEscritorioMedico').hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
    });

    // Rellenar la tabla de agenda de médicos
    var propiedadFiltro;
    var agendaMedicos = accesoDatos.ObtenerMedicos();
    var pacientesTratados = accesoDatos.ObtenerPacientesTratados(accesoDatos.ObtenerUsuarioLogueado().numero);
    rellenarTablaAgendaDeMedicos(agendaMedicos);
    rellenarTablaPacientesTratados(pacientesTratados);

    $('#slcCampoFiltro').change(function () {
        propiedadFiltro = $(this).val();
        if (propiedadFiltro !== '') {
            $('#valorCampoFiltro').attr('disabled', false);
        } else {
            $('#valorCampoFiltro').attr('disabled', true);
        }
        $('#valorCampoFiltro').attr('placeholder', $(this).val());
    });

    // Se aplica el filtro a los datos obtenidos de la agenda de médicos
    $('#valorCampoFiltro').keyup(function () {
        var valor = $(this).val();

        if (valor !== '') {
            var agendaMedicosFiltro = agendaMedicos.filter(medico => medico[propiedadFiltro].startsWith($(this).val()));
            rellenarTablaAgendaDeMedicos(agendaMedicosFiltro);
        } else {
            rellenarTablaAgendaDeMedicos(agendaMedicos);
        }
    });

    /** Rellenar tabla de busqueda de historia clinica */

    $('#slcCampoFiltroHC').change(function () {
        $('#valorCampoFiltroHC').val("");
        var fBusqueda = $(this).val();
        $("#tHCF").empty();
        if (fBusqueda !== '') {
            $('#valorCampoFiltroHC').attr('disabled', false);
        } else {
            $('#valorCampoFiltroHC').attr('disabled', true);
        }
        $('#valorCampoFiltroHC').attr('placeholder', fBusqueda);
        $('#errorB').html("<span class='col'>No has buscado nada ah&uacute;n</span>")
        $('#errorB').show()
        $('#btnAgregar').attr('disabled', true);
    });

    var vBusqueda;
    $('#valorCampoFiltroHC').keyup(function () {
        vBusqueda = $(this).val();
        if (vBusqueda !== '') {
            if ($('#slcCampoFiltroHC').val() === 'documento') {
                rellenarTablaHCB(Number(vBusqueda));
            } else if ($('#slcCampoFiltroHC').val() === 'nombre') {
                rellenarTablaHCB(vBusqueda);
            }
        }
    });

}

/**
 * Funciones controladoras de la interfaz gráfica
 */

// Cargar la tabla de historias clinicas de un paciente
function rellenarTablaHCB(valor) {
    $('#errorB').hide();
    $("#tHCF").empty();

    if (typeof (valor) === 'number') {
        if (validarCI(String(valor)) && String(valor).length >= 7 && String(valor).length <= 8) {
            if (accesoDatos.ObtenerNombrePaciente(valor) !== null) {
                $("#tHCF").html("<thead><tr><th>Nombre</th><th>Fecha</th><th>Motivo</th><th>Diagn&oacute;stico</th><th>Prescripci&oacute;n</th><th>Imagen</th></tr></thead><tbody id='tablaHCF'></tbody>");

                let his = accesoDatos.ObtenerHistoria(valor);
                for (let j = his[his.length - 1].historia - 1; j > -1; j--) {
                    fechan = his[j].fecha.split(" - ");
                    $('#tablaHCF').append(`<tr id='k${j}'></tr>`);
                    $(`#k${j}`).append("<td>" + accesoDatos.ObtenerNombrePaciente(his[j].documento) + "</td>")
                    $(`#k${j}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
                    $(`#k${j}`).append("<td>" + his[j].motivo + "</td>");
                    $(`#k${j}`).append("<td>" + his[j].diagnostico + "</td>");
                    $(`#k${j}`).append("<td>" + his[j].prescripcion + "</td>");
                    $(`#k${j}`).append("<td> <a href='#' data-toggle='modal'><img width='40px' height='40px' src='" + his[j].imagen + "'/></td>");
                }
                $('#btnAgregar').attr('disabled', false);
                $('#btnAgregar').css('margin-left', '1em');
            } else {
                $('#errorB').html("No existe un paciente con este documento")
                $('#errorB').show()
                $('#btnAgregar').attr('disabled', true);
            }
        } else {
            $('#errorB').html("Documento no v&aacute;llido")
            $('#errorB').show()
            $('#btnAgregar').attr('disabled', true);
        }
    } else {
        if (accesoDatos.ObtenerDocumentos(valor).length > 0) {
            $("#tHCF").html("<thead><tr><th>Documento</th><th>Fecha</th><th>Motivo</th><th>Diagn&oacute;stico</th><th>Prescripci&oacute;n</th><th>Imagen</th></tr></thead><tbody id='tablaHCF'></tbody>");

            var cis = accesoDatos.ObtenerDocumentos(valor);

            cis.forEach((c, i) => {
                let his = accesoDatos.ObtenerHistoria(c);
                for (let j = his[his.length - 1].historia - 1; j > -1; j--) {
                    $('#tablaHCF').append(`<tr id='l${i}${j}'></tr>`);

                    fechan = his[j].fecha.split(" - ");
                    $(`#l${i}${j}`).append("<td>" + his[j].documento + "</td>")
                    $(`#l${i}${j}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
                    $(`#l${i}${j}`).append("<td>" + his[j].motivo + "</td>");
                    $(`#l${i}${j}`).append("<td>" + his[j].diagnostico + "</td>");
                    $(`#l${i}${j}`).append("<td>" + his[j].prescripcion + "</td>");
                    $(`#l${i}${j}`).append("<td> <a href='#' data-toggle='modal'><img width='40px' height='40px' src='" + his[j].imagen + "'/></td>");
                }
            });
                $('#btnAgregar').attr('disabled', false);
                $('#btnAgregar').css('margin-left', '1em');
        } else {
            $('#errorB').html("No existe un usuario con este nombre")
            $('#errorB').show()
            $('#btnAgregar').attr('disabled', true);
        }
    }

    $('#tHCF a').click(e => {
        e.preventDefault();
        let rutaAbsoluta = e.target.src;
        let nombreFoto = rutaAbsoluta.substr(rutaAbsoluta.lastIndexOf('/') + 1);
        $('#imgModalActuacion').attr('src', '../images/' + nombreFoto);
        $('#modalVerImagen').modal('show');
    });

}

// Carga la tabla de agenda de medicos 
function rellenarTablaAgendaDeMedicos(dataSetMedicos) {
    $('#tablaAgenda').empty();
    if (dataSetMedicos.length > 0) {
        dataSetMedicos.forEach((medico) => {
            $('#tablaAgenda').append('<tr><td>' + medico.numero + '</td><td>' + medico.nombre + '</td><td>' + medico.especialidad + '</td></tr>');
        });
    } else {
        $('#tablaAgenda').append("<tr><td colspan='3'><p style='text-align: center;'>No hay médicos que concuerden con el criterio de búsqueda</p></td></tr>");
    }
}

// Carga la tabla de pacientes tratados por un medico
function rellenarTablaPacientesTratados(dataSetPacientes) {
    $('#tablaPacientesTratados').empty();
    if (dataSetPacientes.length > 0) {
        dataSetPacientes.forEach((paciente) => {
            $('#tablaPacientesTratados').append('<tr><td>' + paciente.fechaAtencion + '</td><td>' + paciente.nombre + '</td><td>' + paciente.motivoConsulta + '</td></tr>');
        });
    } else {
        $('#tablaPacientesTratados').append("<tr><td colspan='3'><p style='text-align: center;'>No has tratado a ningún paciente hasta el momento</p></td></tr>");
    }
}

/**
 * Punto de entrada para la vista del escritorio del perfil socio.
 */
function vistaEscritorioSocio() {
    $('#navTextSocio').html("Historia Cl&iacute;nica");

    $('#nav-ch-tab').click(function () {
        $('#navTextSocio').html("Historia Cl&iacute;nica");
    });

    $('#nav-medicalHistory-tab').click(function () {
        $('#navTextSocio').html("Historial de M&eacute;dicos Consultados");
    });

    $('#nav-images-tab').click(function () {
        $('#navTextSocio').html("Im&aacute;genes");
    });

    $('#ddiAM').html(accesoDatos.ObtenerNombreMedico(accesoDatos.ObtenerUsuarioLogueado().medicocabecera));
    $('#modalCambiarMedico').ready(cargarCmbMedico);
    $('#navbarDropdown').html(accesoDatos.ObtenerUsuarioLogueado().nombre);
    $("#btnCerrarSesion").click(function () {
        $('#vistaEscritorioSocio').hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
    })

    let st = []
    for (let i = 0, l = accesoDatos.ObtenerHistoria(accesoDatos.ObtenerUsuarioLogueado().documento).length; i < l; i++) {
        st[i] = accesoDatos.ObtenerHistoria(accesoDatos.ObtenerUsuarioLogueado().documento)[i];
    }

    $('#tablaHistorias').html('');
    $('#tablaMedicosConsultados').html('');

    let fechan;
    for (let j = st[st.length - 1].historia - 1; j > -1; j--) {
        fechan = st[j].fecha.split(" - ");
        $('#tablaHistorias').append(`<tr id='t${j}'></tr>`);
        $(`#t${j}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
        $(`#t${j}`).append("<td>" + accesoDatos.ObtenerNombreMedico(st[j].numero) + "</td>");
        $(`#t${j}`).append("<td>" + st[j].motivo + "</td>");
        $(`#t${j}`).append("<td>" + st[j].diagnostico + "</td>");
        $(`#t${j}`).append("<td>" + st[j].prescripcion + "</td>");
        $(`#t${j}`).append("<td> <a href='#' data-toggle='modal'><img width='40px' height='40px' src='" + st[j].imagen + "'/></td>");
    }

    // Conectar eventos en cada miniatura de imagen de actuación al popup con la imagen correspondiente ampliada.
    $('#tablaHistorias a').click(e => {
        e.preventDefault();
        let rutaAbsoluta = e.target.src;
        let nombreFoto = rutaAbsoluta.substr(rutaAbsoluta.lastIndexOf('/') + 1);
        $('#imgModalActuacion').attr('src', '../images/' + nombreFoto);
        $('#modalVerImagen').modal('show');
    });

    for (let h = st[st.length - 1].historia - 1; h > -1; h--) {
        fechan = st[h].fecha.split(" - ");
        $('#tablaMedicosConsultados').append(`<tr id='h${h}'></tr>`);
        $(`#h${h}`).append("<td>" + fechan[2] + " - " + fechan[1] + " - " + fechan[0] + "</td>");
        $(`#h${h}`).append("<td>" + accesoDatos.ObtenerNombreMedico(st[h].numero) + "</td>");
        $(`#h${h}`).append("<td>" + accesoDatos.ObtenerEspecialidad(st[h].numero) + "</td>");
    }

    let im = 0;
    let j;
    $('#gallery').empty();
    for (let k = st[st.length - 1].historia - 1; k > -1; k--) {
        if (im % 5 === 0) {
            j = im;
            $('#gallery').append(`<div class="card-deck" id="${j}">`);
        }

        fechan = st[k].fecha.split(" - ");
        $(`#${j}`).append(`<div class="card"><img src='${st[k].imagen}'><div class="card-body"><h5 class="card-title">Fecha: ${fechan[2] + ' - ' + fechan[1] + ' - ' + fechan[0]}</h5><p class="card-text">Diagn&oacute;stico: ${st[k].diagnostico}</p></div>`);

        im++;
    }
}

/*
	invertirTexto [Devuelve un string de _text leido de derecha a izquierda]
	Input:
		_text: String
	Output:
		_aux: String
*/
function invertirTexto(_text) {
    let _aux = ""
    for (let i = _text.length; i > -1; i--) {
        _aux += _text.charAt(i);
    }

    return _aux;
}

/*
	validarCI [Devuelve un booleano si CI es correcta o no]
	Input:
		_text: String
	Output:
    boolean
  Note:
    Esta funcion de pende de ivertirTexto
*/

function validarCI(ci) {
    let dv = Number(ci.charAt(ci.length - 1));
    let digits = ci.slice(0, -1);
    digits = invertirTexto(digits);
    let sum = 0;
    let verifiers = "4367892";
    let dvf = 0;
    if (digits.length == 6 || digits.length === 7) {
        for (let i = 0; i < digits.length; i++) {
            sum += Number(digits.charAt(i)) * Number(verifiers.charAt(i));
        }
    }
    while (sum % 10 !== 0) {
        sum++;
        dvf++;
    }
    return dvf === dv;
}

function cambiarClave() {
    var clave = $('input[name=txtClave]').val();
    var claveVerificacion = $('input[name=txtClaveVerificada]').val();

    if (clave !== '' && claveVerificacion !== '') {
        if (clave !== claveVerificacion) {
            $('#divErrorCambiarClave').html('<span>Las claves que has ingresado deben coincidir</span>');
            $('#divErrorCambiarClave').show();
        } else if (clave.length < 8) {
            $('#divErrorCambiarClave').html('<span>La clave debe ser mayor a 8 caracteres</span>');
            $('#divErrorCambiarClave').show();
        } else {
            accesoDatos.ObtenerUsuarioLogueado().clave = clave;
            $('#modalCambiarClave').modal('hide');
            $('input[name=txtClave]').val("");
            $('input[name=txtClaveVerificada]').val("");

            $("#modalSuccess").fadeTo(2000, 500).slideUp(500, function () {
                $("#modalSuccess").slideUp(500);
            });
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
        if (med[i].numero !== accesoDatos.ObtenerUsuarioLogueado().medicocabecera && med[i].especialidad === "Medicina General") {
            $('#sCambiarMedico').append(`<option value='${med[i].numero}'>${med[i].nombre}</option>`);
        }
    }
}

function cambiarMedico() {
    var medico = $('select[name=cmbCambiarMedico]').val();
    accesoDatos.ObtenerUsuarioLogueado().medicocabecera = Number(medico);
    $('#ddiAM').html(accesoDatos.ObtenerNombreMedico(accesoDatos.ObtenerUsuarioLogueado().medicocabecera));
    $('#modalCambiarMedico').modal('hide');
    $('#modalCambiarMedico').on('hidden.bs.modal', cargarCmbMedico());
}

function agregarHC() {
    let motivo = $('#txtMotivo').val();
    let diagnostico = $('#txtDiagnostico').val();
    let prescripcion = $('#txtPrescripcion').val();
    let img = $('#fileImagen').val();

    if (motivo !== "" && diagnostico !== "" && prescripcion !== "" && img !== "") {
        if (img.substr(img.length - 4, img.length - 1) === ".jpg") {
            $('#divErrorAgregarHC').hide();
            accesoDatos.AgregarHistoria($('#valorCampoFiltroHC').val(), accesoDatos.ObtenerUsuarioLogueado().numero, motivo, diagnostico, prescripcion, img);
            
        } else {
            $('#divErrorAgregarHC').html("<span>No has ingresado una imagen</span>");
            $('#divErrorAgregarHC').show();
        }
    } else {
        $('#divErrorAgregarHC').html("<span>No pueden quedar campos vac&iacute;os</span>");
        $('#divErrorAgregarHC').show();
    }
}