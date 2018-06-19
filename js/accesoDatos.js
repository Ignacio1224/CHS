/**
 * accesoDatos.js - módulo de acceso a datos basado en el patrón de 'Módulo Revelado' - 'Reveal Module Pattern'
 * -------------------------------
 */

// Punto de entrada, función autoejecutable.
var accesoDatos = (function () {

    // Miembros privados
    var usuarioLogueado = null;

    /** JUEGO DE DATOS */
    var medicos = [{
            numero: 123456,
            nombre: 'Matias Schmid',
            especialidad: 'Medicina General',
            clave: 'MSPass32'
        },
        {
            numero: 234567,
            nombre: 'Ignacio Cabrera',
            especialidad: 'Medicina General',
            clave: 'ICPass32'
        },
        {
            numero: 891011,
            nombre: 'Marcelo Medina',
            especialidad: 'Cardiología',
            clave: 'MMPass32'
        }
    ];

    var pacientes = [{
            documento: 49274397,
            nombre: 'Mariano Ramos',
            medicocabecera: 123456,
            clave: 'MR1234'
        },
        {
            documento: 51619074,
            nombre: 'Susana Garrido',
            medicocabecera: 234567,
            clave: 'SG1234'
        }
    ];

    var historias = [{
            "historia": 1,
            "documento": 49274397,
            "numero": 123456,
            "fecha": "2018 - 02 - 20", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/placa2.jpg"
        },
        {
            "historia": 2,
            "documento": 49274397,
            "numero": 234567,
            "fecha": "2018 - 08 - 03", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/placa1.jpg"
        },
        {
            "historia": 1,
            "documento": 51619074,
            "numero": 123456,
            "fecha": "2018 - 09 - 07", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/placa1.jpg"
        },
        {
            "historia": 2,
            "documento": 51619074,
            "numero": 234567,
            "fecha": "2018 - 12 - 24", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/placa2.jpg"
        }
    ];

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
        let hist = [];
        let ind = 0;
        for (let i = 0, l = historias.length; i < l; i++) {
            if (historias[i].documento === _documento) {
                hist[ind] = historias[i];
                ind++;
            }
        }
        return hist;
    };

    // Agrega una historia del paciente
    var agregarHistoria = function (_documento, _numero, _motivo, _diagnostico, _prescripcion, _imagen) {
        let _date = new Date();
        let _fecha = _date.getFullYear() + " - " + (_date.getMonth() + 1) + " - " + _date.getDate();
        let _historia = accesoDatos.ObtenerHistoria(_documento)[accesoDatos.ObtenerHistoria(_documento).length - 1].historia + 1;
        try {
            historias.push({
                'historia': _historia,
                'documento': _documento,
                'numero': _numero,
                'fecha': _fecha,
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
        if (!isNaN(_numero)) {
            var consultas = historias.filter(consulta => consulta.numero === _numero);
            var pacientesTratados = [];
            consultas.forEach(c => {
                pacientesTratados.push({
                    fechaAtencion: c.fecha,
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

    // Interfaz pública
    return {
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
        AgregarHistoria: agregarHistoria,
        ObtenerPacientesTratados: obtenerPacientesTratados
    }

})();