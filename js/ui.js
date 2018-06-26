// Eventos
$(document).ready(mostrarCuadroLogin);
$('#btnIngresar').click(ingresar);
$('#btnCambiarClave').click(cambiarClave);
$('#btnCambiarMedico').click(cambiarMedico);
$('#btnAgregarHC').click(agregarHC);
$('#btnCancelarAgregarHC').click(function () {
    $('#divErrorAgregarHC').hide();
});
$("#datepicker").datepicker({
    maxDate: 0,
    dateFormat: "dd/mm/yy",
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
});

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

    $("#btnCerrarSesionM").on('click', function () {
        utilidades.cerrarSesion($('#vistaEscritorioMedico'))
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
        utilidades.resetearCampo($('#valorCampoFiltroHC'));

        //$('#valorCampoFiltroHC').val("");
        var fBusqueda = $(this).val();
        $("#tablaHCF").empty();
        if (fBusqueda !== '') {
            $('#valorCampoFiltroHC').attr('disabled', false);
            $('#btnBuscar').attr('disabled', false);
            if ($('#slcCampoFiltroHC').val() === 'nombre') {
                $('#modal-AHCn').prepend('<div class="form-group" id="divDoc"><label for="txtDoc">Documento</label><input type="text-area" class="form-control" name="txtDoc" id="txtDoc" onKeyDown = "if(event.keyCode==13) agregarHC();"></div>');
            } else {
                $('#divDoc').hide();
            }
        } else {
            $('#valorCampoFiltroHC').attr('disabled', true);
            $('#btnBuscar').attr('disabled', true);
        }


        $('#valorCampoFiltroHC').attr('placeholder', fBusqueda);
        $('#errorB').html("<span class='col'>No has buscado nada a&uacute;n</span>")
        $('#errorB').show();
    });

    // Handler de boton buscar
    $('#btnBuscar').click(function (e) {
        e.preventDefault();
        var vBusqueda = $('#valorCampoFiltroHC').val();
        if (vBusqueda !== '') {
            if ($('#slcCampoFiltroHC').val() === 'documento') {
                rellenarTablaHCB(Number(vBusqueda));
            } else if ($('#slcCampoFiltroHC').val() === 'nombre') {
                rellenarTablaHCB(vBusqueda);
            }
        } else {
            alert('Debes ingresar un valor para la búsqueda');
        }
    });

    $('#datepicker').change(rellenarTablaHCBD);
}

/**
 * Funciones controladoras de la interfaz gráfica
 */

// Cargar la tabla de historias clinicas de un paciente
function rellenarTablaHCB(valor) {
    $('#errorB').hide();
    $("#tablaHCF").html("");

    if (typeof (valor) === 'number') {
        $("#tablaBusquedaHistoriaClinica").html("<thead><tr><th>Fecha</th><th>Motivo</th><th>Diagn&oacute;stico</th><th>Prescripci&oacute;n</th><th>Imagen</th></tr></thead><tbody id='tablaHCF'></tbody>");
        if (validarCI(String(valor)) && String(valor).length >= 7 && String(valor).length <= 8) {
            if (accesoDatos.ObtenerNombrePaciente(valor) !== null) {
                let his = accesoDatos.ObtenerHistoria(valor);
                if (his.length > 0) {
                    for (let j = his[his.length - 1].historia - 1; j > -1; j--) {
                        fechan = his[j].fechaAtencion;
                        $('#tablaHCF').append(`<tr id='k${j}'></tr>`);
                        //$(`#k${j}`).append("<td>" + accesoDatos.ObtenerNombrePaciente(his[j].documento) + "</td>")
                        //$(`#k${j}`).append("<td>" + fechan[2] + "/" + fechan[1] + "/" + fechan[0] + "</td>");
                        $(`#k${j}`).append("<td>" + fechan + "</td>");
                        $(`#k${j}`).append("<td>" + his[j].motivo + "</td>");
                        $(`#k${j}`).append("<td>" + his[j].diagnostico + "</td>");
                        $(`#k${j}`).append("<td>" + his[j].prescripcion + "</td>");
                        if (his[j].imagen !== '') {
                            $(`#k${j}`).append("<td> <a href='#' data-toggle='modal'><img width='40px' height='40px' src='" + his[j].imagen + "'/></td>");
                        } else {
                            $(`#k${j}`).append("<td>No hay imagen para mostrar</td>");
                        }
                    }
                    $('#btnNuevaActuacion').attr('disabled', false);
                } else {
                    //$("#tablaHCF").html("<thead><tr><th>No hay consultas</th></thead>")
                    $("#tablaHCF").html("<tr><td colspan='6'>No hay consultas</td>")
                }
            } else {
                $('#errorB').html("<span class='col'>No existe un paciente con este documento</span>");
                $('#errorB').show();
                $('#btnNuevaActuacion').attr('disabled', true);
            }
        } else {
            $('#errorB').html("<span class='col'>Documento no v&aacute;llido</span>");
            $('#errorB').show();
            $('#btnNuevaActuacion').attr('disabled', true);
        }
    } else {
        if (accesoDatos.ObtenerDocumentos(valor).length > 0) {
            $("#tablaBusquedaHistoriaClinica").html("<thead><tr><th>Documento</th><th>Fecha</th><th>Motivo</th><th>Diagn&oacute;stico</th><th>Prescripci&oacute;n</th><th>Imagen</th></tr></thead><tbody id='tablaHCF'></tbody>");

            var cis = accesoDatos.ObtenerDocumentos(valor);

            cis.forEach((c, i) => {
                let his = accesoDatos.ObtenerHistoria(c);
                if (his.length > 0) {
                    for (let j = his[his.length - 1].historia - 1; j > -1; j--) {
                        $('#tablaHCF').append(`<tr id='l${i}${j}'></tr>`);

                        fechan = his[j].fechaAtencion;
                        $(`#l${i}${j}`).append("<td>" + his[j].documento + "</td>")
                        $(`#l${i}${j}`).append("<td>" + fechan + "</td>");
                        $(`#l${i}${j}`).append("<td>" + his[j].motivo + "</td>");
                        $(`#l${i}${j}`).append("<td>" + his[j].diagnostico + "</td>");
                        $(`#l${i}${j}`).append("<td>" + his[j].prescripcion + "</td>");
                        if (his[j].imagen !== '') {
                            $(`#l${i}${j}`).append("<td> <a href='#' data-toggle='modal'><img width='40px' height='40px' src='" + his[j].imagen + "'/></td>");
                        } else {
                            $(`#l${i}${j}`).append("<td>No hay imagen para mostrar</td>");
                        }
                    }
                } else {
                    $(`#tablaHCF`).append("<tr><td colspan='6'>No tiene actuaciones</td></tr>")
                }
            });
            $('#btnNuevaActuacion').attr('disabled', false);
        } else {
            $('#errorB').html("<span class='col'>No existe un usuario con este nombre</span>")
            $('#errorB').show()
            $('#btnNuevaActuacion').attr('disabled', true);
        }
    }

    $('#tablaHCF a').click(e => {
        e.preventDefault();
        let rutaAbsoluta = e.target.src;
        let nombreFoto = rutaAbsoluta.substr(rutaAbsoluta.lastIndexOf('/') + 1);
        $('#imgModalActuacion').attr('src', '../images/' + nombreFoto);
        $('#modalVerImagen').modal('show');
    });

}

// Carga la tabla de pacientes por dia de atencion
function rellenarTablaHCBD() {
    if ($(this).val() !== '') {
        $('#tbPTD').html('');
        let fecha = $(this).val();
        let pacientes = accesoDatos.ObtenerPacientesTratados(accesoDatos.ObtenerUsuarioLogueado().numero);
        if (pacientes.length > 0) {
            let pacientesFiltrados = pacientes.filter((p) => p.fechaAtencion === fecha);
            console.log(pacientesFiltrados);

            if (pacientesFiltrados.length > 0) {
                for (let i = 0, lp = pacientesFiltrados.length; i < lp; i++) {
                    $('#tbPTD').append(`<tr id='${i}'></tr>`);
                    $(`#${i}`).append(`<td>${pacientesFiltrados[i].documento}</td>`);
                    $(`#${i}`).append(`<td>${accesoDatos.ObtenerNombrePaciente(pacientesFiltrados[i].documento)}</td>`);
                }
            }

            $('#tbPTD tr').click((e) => {
                e.preventDefault();
                var docum;

                if ((e.target.innerText.length === 8 || e.target.innerText.length === 7) && !isNaN(e.target.innerText)) {
                    docum = Number(e.target.innerText);
                    $('#slcCampoFiltroHC').val("documento");
                    $('#divDoc').remove();
                } else {
                    docum = e.target.innerText;
                    $('#slcCampoFiltroHC').val("nombre");
                    $('#divDoc').remove('#divDoc');
                    $('#modal-AHCn').prepend('<div class="form-group" id="divDoc"><label for="txtDoc">Documento</label><input type="text" class="form-control" name="txtDoc" id="txtDoc" onKeyDown = "if(event.keyCode==13) agregarHC();"></div>');
                }
                $('#txtDoc').val(accesoDatos.ObtenerDocumentos(docum)[0]);
                $('#valorCampoFiltroHC').val(docum);
                rellenarTablaHCB(docum);
                $('.nav-tabs a[href="#nav-clinic-search"]').tab('show');
            });
        }
    }
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
    $("#btnCerrarSesionP").click(function () {
        utilidades.cerrarSesion($('#vistaEscritorioSocio'));
    });

    /*$("#btnCerrarSesion").click(function () {
        $('#vistaEscritorioSocio').hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
    });*/

    let st = [] //historias del usuario logueado
    for (let i = 0, l = accesoDatos.ObtenerHistoria(accesoDatos.ObtenerUsuarioLogueado().documento).length; i < l; i++) {
        st[i] = accesoDatos.ObtenerHistoria(accesoDatos.ObtenerUsuarioLogueado().documento)[i];
    }

    $('#tH').html('');
    $('#tMC').html('');
    $('#tablaHistorias').html('');
    $('#tablaMedicosConsultados').html('');
    if (st.length > 0) {
        $('#tH').html('<thead><tr><th style="width: 12%">Fecha</th><th>M&eacute;dico</th><th>Motivo</th><th>Diagn&oacute;stico</th><th>Prescripci&oacute;n</th><th>Imagen</th></tr></thead><tbody id="tablaHistorias"></tbody>');
        let fechan;
        for (let j = st[st.length - 1].historia - 1; j > -1; j--) {
            fechan = st[j].fecha.split("-");
            $('#tablaHistorias').append(`<tr id='t${j}'></tr>`);
            $(`#t${j}`).append("<td>" + fechan[2] + "/" + fechan[1] + "/" + fechan[0] + "</td>");
            $(`#t${j}`).append("<td>" + accesoDatos.ObtenerNombreMedico(st[j].numero) + "</td>");
            $(`#t${j}`).append("<td>" + st[j].motivo + "</td>");
            $(`#t${j}`).append("<td>" + st[j].diagnostico + "</td>");
            $(`#t${j}`).append("<td>" + st[j].prescripcion + "</td>");
            if (st[j].imagen !== '') {
                $(`#t${j}`).append("<td> <a href='#' data-toggle='modal'><img width='40px' height='40px' src='" + st[j].imagen + "'/></td>");
            } else {
                $(`#t${j}`).append("<td>No hay imagen para mostrar</td>");
            }
        }


        // Conectar eventos en cada miniatura de imagen de actuación al popup con la imagen correspondiente ampliada.
        $('#tablaHistorias a').click(e => {
            e.preventDefault();
            let rutaAbsoluta = e.target.src;
            let nombreFoto = rutaAbsoluta.substr(rutaAbsoluta.lastIndexOf('/') + 1);
            $('#imgModalActuacion').attr('src', '../images/' + nombreFoto);
            $('#modalVerImagen').modal('show');
        });
        $('#tMC').html('<thead><tr><th style="width: 24%">Fecha de consulta</th><th>M&eacute;dico</th><th>Especialidad</th></tr></thead><tbody id="tablaMedicosConsultados"></tbody>');
        for (let h = st[st.length - 1].historia - 1; h > -1; h--) {
            fechan = st[h].fecha.split("-");
            $('#tablaMedicosConsultados').append(`<tr id='h${h}'></tr>`);
            $(`#h${h}`).append("<td>" + fechan[2] + "/" + fechan[1] + "/" + fechan[0] + "</td>");
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

            fechan = st[k].fecha.split("-");
            if (st[k].imagen !== '') {
                $(`#${j}`).append(`<div class="card"><img src='${st[k].imagen}'><div class="card-body"><h5 class="card-title">Fecha: ${fechan[2] + '/' + fechan[1] + '/' + fechan[0]}</h5><p class="card-text">Diagn&oacute;stico: ${st[k].diagnostico}</p></div>`);
            }

            im++;
        }
    } else {
        $('#tH').html(`<thead><tr><th>No tienes actuaciones</th></tr></thead>`);
        $('#tMC').html(`<thead><tr><th>No tienes m&eacute;dicos consultados</th></tr></thead>`);
        $('#gallery').html("<span>No hay im&aacute;genes para mostrar</span>");
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
    Esta funcion depende de ivertirTexto
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
    let aux = false;
    $('#sCambiarMedico').html("");
    for (let i = 0, l = med.length; i < l; i++) {
        if (med[i].numero !== accesoDatos.ObtenerUsuarioLogueado().medicocabecera && med[i].especialidad === "Medicina General") {
            $('#sCambiarMedico').append(`<option value='${med[i].numero}'>${med[i].nombre}</option>`);
            aux = true;
        }
    }

    if (!aux) {
        $('#lblmr').html(`No hay medicos disponibles`);
        $('#sCambiarMedico').attr('disabled', true);
        $('#btnCambiarMedico').attr('disabled', true);
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
    let doc;
    let val;
    let motivo = $('#txtMotivo').val();;
    let diagnostico = $('#txtDiagnostico').val();
    let prescripcion = $('#txtPrescripcion').val();
    let img = $('#fileImagen').val();

    if ($('#slcCampoFiltroHC').val() === 'nombre') {
        doc = Number($('#txtDoc').val());
        console.log(doc);
    } else {
        doc = Number($('#valorCampoFiltroHC').val());
    }

    if (motivo !== "" && diagnostico !== "" && prescripcion !== "") {
        if (img.substr(img.length - 4, img.length - 1) === ".jpg" || img.substr(img.length - 4, img.length - 1) === ".png") {
            $('#divErrorAgregarHC').hide();
            img = "../images/" + img.substr(img.lastIndexOf('\\') + 1);
        } else {
            $('#divErrorAgregarHC').html("<span>No has ingresado una imagen</span>");
            $('#divErrorAgregarHC').show();
        }
        var validation = accesoDatos.AgregarHistoria(doc, accesoDatos.ObtenerUsuarioLogueado().numero, motivo, diagnostico, prescripcion, img);
        val = true;
    } else {
        val = false;
        $('#divErrorAgregarHC').html("<span>Todos los campos son obligatorios</span>");
        $('#divErrorAgregarHC').show();
    }
    if (validation && val) {
        $('#txtDoc').val("");
        $('#txtMotivo').val("");
        $('#txtDiagnostico').val("");
        $('#txtPrescripcion').val("");
        $('#fileImagen').val("");
        $('#btnAgregarHC').attr('data-dismiss', "modal");
        $('#divErrorAgregarHC').hide();
        $('#modalSuccessHC').fadeTo(2000, 500).slideUp(500, function () {
            $('#modalSuccessHC').slideUp(500);
        });
        rellenarTablaHCB(doc);
    }
}