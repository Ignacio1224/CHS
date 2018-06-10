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
        }
    ];

    var pacientes = [{
            documento: 7896541,
            nombre: 'Mariano Ramos',
            medicocabecera: 123456,
            clave: 'MR1234'
        },
        {
            documento: 3421345,
            nombre: 'Susana Garrido',
            medicocabecera: 234567,
            clave: 'SG1234'
        }
    ];

    var historias = [{
            "historia": 1,
            "documento": 7896541,
            "numero": 123456,
            "fecha": "2018 - 02 - 20", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/chsLogo.png"
        },
        {
            "historia": 2,
            "documento": 7896541,
            "numero": 234567,
            "fecha": "2018 - 08 - 03", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/chsLogo.png"
        },
        {
            "historia": 1,
            "documento": 3421345,
            "numero": 123456,
            "fecha": "2018 - 09 - 07", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/chsLogo.png"
        },
        {
            "historia": 2,
            "documento": 3421345,
            "numero": 234567,
            "fecha": "2018 - 12 - 24", // YYYY - MM - DD
            "motivo": "Texto del motivo de la consulta…",
            "diagnostico": "Texto del diagnóstico del médico….",
            "prescripcion": "Texto de la prescripción del médico...",
            "imagen": "../images/chsLogo.png"
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

    // Obtiene un paciente de la lista a partir de su documento de identidad
    var obtenerPaciente = function (_documento, _clave) {
        return pacientes.filter(function (paciente) {
            return paciente.documento === _documento && paciente.clave === _clave;
        });
    };

    // Obtiene un nombre de paciente de la lista a partir de su documento de identidad
    var obtenerNombrePaciente = function (_documento) {
        for (let i = 0, l = medicos.length; i < l; i++) {
            if (pacientes[i].documento === _documento) {
                return pacientes[i].nombre;
            }
        }
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

    // Interfaz pública
    return {
        EstablecerUsuarioLogueado: establecerUsuarioLogueado,
        ObtenerUsuarioLogueado: obtenerUsuarioLogueado,
        ObtenerUsuario: obtenerUsuario,
        ObtenerMedico: obtenerMedico,
        ObtenerNombreMedico: obtenerNombreMedico,
        ObtenerPaciente: obtenerPaciente,
        ObtenerNombrePaciente: obtenerNombrePaciente,
        ObtenerHistoria: obtenerHistoria
    }

})();