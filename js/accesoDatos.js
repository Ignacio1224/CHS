/**
 * accesoDatos.js - módulo de acceso a datos basado en el patrón de 'Módulo Revelado' - 'Reveal Module Pattern'
 * -------------------------------
 */

 // Punto de entrada, función autoejecutable.
 var accesoDatos = (function() {
    
    // Miembros privados
    var usuarioLogueado = null;

    var medicos = [
        {
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

    var pacientes = [
        {
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

    // Recibe un objeto representando a un usuario y retorna el usuario correspondiente en base a su campo clave siempre que exista
    var obtenerUsuario = function(usuario) {
        var usuarioRetorno;
        switch(usuario._perfil) {
            case 'M':
                usuarioRetorno = obtenerMedico(usuario._identidad);
                break;
            case 'P':
                usuarioRetorno = obtenerPaciente(usuario._identidad);
                break;
            default: 
                usuarioRetorno = [];      
        }
        return usuarioRetorno;
    };

    // Establece el usuario logueado en el sistema actualmente
    var establecerUsuarioLogueado = function(_usuario) {
        usuarioLogueado = _usuario;
    };

    // Obtiene el usuario logueado en el sistema actualmente
    var obtenerUsuarioLogueado = function() {
        return usuarioLogueado;
    };

    // Obtiene un médico de la lista a partir de su número de identificación
    var obtenerMedico = function(_numero) {
        return medicos.filter(function(medico) {
            return medico.numero === _numero; 
        });
    };

    // Obtiene un paciente de la lista a partir de su documento de identidad
    var obtenerPaciente = function(_documento) {
        return pacientes.filter(function(paciente) {
            return paciente.documento === _documento; 
        });
    };

    // Interfaz pública
    return {
        EstablecerUsuarioLogueado: establecerUsuarioLogueado,
        ObtenerUsuarioLogueado: obtenerUsuarioLogueado,
        ObtenerUsuario: obtenerUsuario,
        ObtenerMedico: obtenerMedico,
        ObtenerPaciente: obtenerPaciente
    }

 })();
