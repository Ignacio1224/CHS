/**
 * utilidades.js
 * ---------------------------------
 * Archivo de metodos utilitarios
 */

var utilidades = {
    resetearCampo : function(campo) {
        campo.val('');
        campo.focus();
    },

    cerrarSesion: function(panel) {
        panel.hide();
        $('#vistaLogin').show();
        accesoDatos.EstablecerUsuarioLogueado(null);
    }
};