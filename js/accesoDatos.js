/**
 * accesoDatos.js - módulo de acceso a datos basado en el patrón de 'Módulo Revelado' - 'Reveal Module Pattern'
 * -------------------------------
 */

// Punto de entrada, función autoejecutable.
var accesoDatos = (function () {

    // Miembros privados
    var usuarioLogueado = null;

    /** JUEGO DE DATOS */
    var medicos = [
        {
            numero: 123456,
            nombre: "Matias Schmid",
            especialidad: "Medicina General",
            clave: "MSPass32"
        },
        {
            numero: 234567,
            nombre: "Ignacio Cabrera",
            especialidad: "Medicina General",
            clave: "ICPass32"
        },
        {
            numero: 891011,
            nombre: "Marcelo Medina",
            especialidad: "Cardiología",
            clave: "MMPass32"
        },
        {
            numero: 654321,
            nombre: "Elisa Alvez",
            especialidad: "Medicina General",
            clave: "aaaaa"
          },
          {
            numero: 111111,
            nombre: "Laura Tiscornia",
            especialidad: "Medicina General",
            clave: "eer32"
          },
          {
            numero: 664422,
            nombre: "Jose Maria Perez",
            especialidad: "Oftalmología",
            clave: "aaabb"
          },
          {
            numero: 245124,
            nombre: "Jorge Perez",
            especialidad: "Pediatría",
            clave: "jpere"
          },
          {
            numero: 224455,
            nombre: "Juan Pedro Perez",
            especialidad: "Pediatría",
            clave: "qqqqq"
          },
          {
            numero: 887548,
            nombre: "Maria Gutierrez",
            especialidad: "Neurología",
            clave: "qqqqq"
          }
    ];

    var pacientes = [
        {
            documento: 49274397,
            nombre: "Mariano Ramos",
            medicocabecera: 123456,
            clave: "MR1234"
        },
        {
            documento: 51619074,
            nombre: "Susana Garrido",
            medicocabecera: 234567,
            clave: "SG1234"
        },
        {
            documento: 2354875,
            nombre: "Ana Gonzalez",
            medicocabecera: 123456,
            clave: "b23va"
        },
        {
            documento: 6542157,
            nombre: "Jorge Perez",
            medicocabecera: 111111,
            clave: "123ab"
        },
        {
            documento: 3587458,
            nombre: "Luis Rodriguez",
            medicocabecera: 123456,
            clave: "aaaaa"
        },
        {
            documento: 3254125,
            nombre: "Pedro Rodriguez",
            medicocabecera: 654321,
            clave: "Aa111"
        },
        {
            documento: 2653214,
            nombre: "Cecilia Demaria",
            medicocabecera: 111111,
            clave: "bbb22"
        },
        {
            documento: 3625487,
            nombre: "Elena Jimenez",
            medicocabecera: 123456,
            clave: "elena"
        }
    ];

    var historias = [{
            historia: 1,
            documento: 49274397,
            numero: 123456,
            fecha: new Date("2018/02/20"),
            motivo: "Texto del motivo de la consulta…",
            diagnostico: "Texto del diagnóstico del médico….",
            prescripcion: "Texto de la prescripción del médico...",
            imagen: "../images/placa2.jpg"
        },
        {
            historia: 2,
            documento: 49274397,
            numero: 234567,
            fecha: new Date("2018/06/03"),
            motivo: "Texto del motivo de la consulta…",
            diagnostico: "Texto del diagnóstico del médico….",
            prescripcion: "Texto de la prescripción del médico...",
            imagen: "../images/placa1.jpg"
        },
        {
            historia: 1,
            documento: 51619074,
            numero: 123456,
            fecha: new Date("2018/09/07"),
            motivo: "Texto del motivo de la consulta…",
            diagnostico: "Texto del diagnóstico del médico….",
            prescripcion: "Texto de la prescripción del médico...",
            imagen: "../images/placa1.jpg"
        },
        {
            historia: 2,
            documento: 51619074,
            numero: 234567,
            fecha: new Date("2018/01/24"),
            motivo: "Texto del motivo de la consulta…",
            diagnostico: "Texto del diagnóstico del médico….",
            prescripcion: "Texto de la prescripción del médico...",
            imagen: "../images/placa2.jpg"
        }
    ];

    // Formatea una fecha y retorna su representación textual como DD/MM/YYYY
    var formatearFecha = function(fecha) {
        if (fecha !== null) {
            /*var fecha = new Date(fechaString);
            var fechaFormateada = '';
            var dd = fecha.getDate();
            var mm = fecha.getMonth() + 1;
            var yyyy = fecha.getFullYear();
            
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            fechaFormateada = dd + '/' + mm + '/' + yyyy;*/

            //return fechaFormateada;
            return fecha.toLocaleDateString();
        }
    };

    // Recibe un objeto representando a un usuario y retorna el usuario correspondiente en base a su campo clave siempre que exista
    var obtenerUsuario = function (usuario) {
        var usuarioRetorno;
        switch (usuario._perfil) {
            case 'M':
                usuarioRetorno = obtenerMedico(usuario._identidad, usuario._clave);
                break;
            case 'P':
                usuarioRetorno = obtenerPaciente(usuario._identidad, usuario._clave);
                break;
            default:
                usuarioRetorno = [];
        }
        return usuarioRetorno;
    };

    // Establece el usuario logueado en el sistema actualmente
    var establecerUsuarioLogueado = function (_usuario) {
        usuarioLogueado = _usuario;
    };

    // Obtiene el usuario logueado en el sistema actualmente
    var obtenerUsuarioLogueado = function () {
        return usuarioLogueado;
    };

    // Obtiene un médico de la lista a partir de su número de identificación
    var obtenerMedico = function (_numero, _clave) {
        return medicos.filter(function (medico) {
            return medico.numero === _numero && medico.clave === _clave;
        });
    };

    // Obtiene un nombre de médico de la lista a partir de su número de identificación
    var obtenerNombreMedico = function (_numero) {
        for (let i = 0, l = medicos.length; i < l; i++) {
            if (medicos[i].numero === _numero) {
                return medicos[i].nombre;
            }
        }
    };

    // Obtiene todos los medicos de la lista
    var obtenerMedicos = function () {
        return medicos;
    };

    // Obtiene la especialidad del medico de la lista por su numero
    var obtenerEspecialidad = function (_numero) {
        for (let i = 0, l = medicos.length; i < l; i++) {
            if (medicos[i].numero === _numero) {
                return medicos[i].especialidad;
            }
        }
    };

    // Obtiene un paciente de la lista a partir de su documento de identidad
    var obtenerPaciente = function (_documento, _clave) {
        return pacientes.filter(function (paciente) {
            return paciente.documento === _documento && paciente.clave === _clave;
        });
    };

    // Obtiene un nombre de paciente de la lista a partir de su documento de identidad
    var obtenerNombrePaciente = function (_documento) {
        var aux = false;
        for (let i = 0, l = pacientes.length; i < l; i++) {
            if (pacientes[i].documento === _documento) {
                return pacientes[i].nombre;
            } else {
                aux = true;
            }
        }

        if (aux) {
            return null;
        }
    };

    // Obtiene documentos de pacientes de la lista a partir de su nombre, como el nombre no es CP se devuelve un array con todas las CI con ese nombre
    var obtenerDocumentos = function (_nombre) {
        var cis = [];
        for (let i = 0, l = pacientes.length; i < l; i++) {
            if (pacientes[i].nombre === _nombre) {
                cis.push(pacientes[i].documento);
            }
        }
        return cis;
    };

    // Obtiene una historia de paciente de la lista a partir de su documento de identidad
    var obtenerHistoria = function (_documento) {
        var hist = [];
        var diag, pres, im, mot;
        for (let i = 0, l = historias.length; i < l; i++) {
            if (historias[i].documento === _documento) {
                if (historias[i].diagnostico === ""){
                    diag = "Sin diagnóstico";
                } else {
                    diag = historias[i].diagnostico;
                }
                
                if (historias[i].prescripcion === "") {
                    pres = "Sin prescripción";
                } else {
                    pres = historias[i].prescripcion;
                }
                
                if (historias[i].motivo === "") {
                    mot = "Sin motivo";
                } else {
                    mot = historias[i].motivo;
                }

                hist.push({
                    "historia": historias[i].historia,
                    "documento": historias[i].documento,
                    "numero": historias[i].numero,
                    "fechaAtencion": formatearFecha(historias[i].fecha),
                    "motivo": mot,
                    "diagnostico": diag,
                    "prescripcion": pres,
                    "imagen": historias[i].imagen
                });
            }
        }
        return hist;
    };

    // Agrega una historia del paciente
    var agregarHistoria = function (_documento, _numero, _motivo, _diagnostico, _prescripcion, _imagen) {
        let _date = new Date();        
        let _historia = accesoDatos.ObtenerHistoria(_documento)[accesoDatos.ObtenerHistoria(_documento).length - 1].historia + 1;
        try {
            historias.push({
                'historia': _historia,
                'documento': _documento,
                'numero': _numero,
                'fecha': _date,
                'motivo': _motivo,
                'diagnostico': _diagnostico,
                'prescripcion': _prescripcion,
                'imagen': _imagen
            });
            return true;
        } catch (error) {
            return false;
        }
    };

    // Obtiene la lista de pacientes tratados por un medico
    var obtenerPacientesTratados = function (_numero) {
        if (_numero !== '' && !isNaN(_numero)) {
            var consultas = historias.filter(consulta => consulta.numero === _numero);
            consultas.sort((a,b) => a.fecha > b.fecha ? -1 : 1);
            var pacientesTratados = [];
            consultas.forEach(c => {
                pacientesTratados.push({
                    fechaAtencion: formatearFecha(c.fecha),
                    nombre: pacientes.filter(p => p.documento === c.documento)[0].nombre,
                    motivoConsulta: c.motivo,
                    documento: c.documento
                });
            });
            return pacientesTratados;
        } else {
            return [];
        }
    };

    // Obtiene un array con el/los paciente/s cuyo médico de cabecera es el que se especifica
    var obtenerPacientesDeMedico = function(_numero) {
        if (_numero !== '' && !isNaN(_numero)) {
            let pacientesDeMedico = pacientes.filter(p => p.medicocabecera === _numero);
            return pacientesDeMedico;
        } else {
            return [];
        }
    };

    // Interfaz pública
    return {
        AgregarHistoria: agregarHistoria,
        EstablecerUsuarioLogueado: establecerUsuarioLogueado,
        ObtenerUsuarioLogueado: obtenerUsuarioLogueado,
        ObtenerUsuario: obtenerUsuario,
        ObtenerMedico: obtenerMedico,
        ObtenerMedicos: obtenerMedicos,
        ObtenerNombreMedico: obtenerNombreMedico,
        ObtenerEspecialidad: obtenerEspecialidad,
        ObtenerPaciente: obtenerPaciente,
        ObtenerNombrePaciente: obtenerNombrePaciente,
        ObtenerDocumentos: obtenerDocumentos,
        ObtenerHistoria: obtenerHistoria,
        ObtenerPacientesTratados: obtenerPacientesTratados
    }
})();