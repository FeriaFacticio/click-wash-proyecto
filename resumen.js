$(document).ready(function() {
    


    $('.btn-confirm').on('click', function() {
        
        // Opcional: Puedes mostrar un mensaje de éxito final
        alert('¡Pedido confirmado! Recibirás un mensaje de recolección pronto.');
        
        
        window.location.href = 'index.html'; 
    });
    // Función para obtener parámetros de la URL
    function obtenerParametroUrl(nombre) {
        nombre = nombre.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + nombre + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Obtener los datos codificados del formulario
    const datosCodificados = obtenerParametroUrl('data');

    if (datosCodificados) {
        try {
            // Parsear la cadena JSON a un objeto JavaScript
            const datos = JSON.parse(datosCodificados);


            const fechaHora = new Date(datos.fechaHora);
            const fecha = fechaHora.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            const hora = fechaHora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            
            // 1. Calcular el total y formatear
            const total = datos.cantidad * datos.precioUnitario;
            const direccionCompleta = `${datos.calle}, ${datos.colonia}, ${datos.municipio}`;
            const precioFormateado = `$${datos.precioUnitario.toFixed(2)}`;
            const totalFormateado = `$${total.toFixed(2)}`;

            // 2. Construir el HTML de resumen
            const html = `
                <p><strong>Nombre:</strong> ${datos.nombre}</p> <p><strong>Fecha de Recolección:</strong> ${fecha}</p> <p><strong>Hora de Recolección:</strong> ${hora}</p> <hr style="border-color: #f39c12; margin: 15px 0;">
                <p><strong>Número de pedido:</strong> 230902</p>
                <p><strong>Docenas a recolectar:</strong> ${datos.cantidad}</p>
                <p><strong>Precio por docena:</strong> ${precioFormateado}</p>
                <p><strong>Dirección de recolección:</strong> ${direccionCompleta}</p>
                <p><strong>Teléfono:</strong> ${datos.telefono}</p>
            `;

            // 3. Mostrar los datos
            $('#resumen-contenido').html(html);
            $('#total-estimado').text(totalFormateado);

        } catch (e) {
            console.error("Error al parsear datos de resumen:", e);
            $('#resumen-contenido').html('<p>Error al cargar el resumen. Intente de nuevo.</p>');
        }
    } else {
        $('#resumen-contenido').html('<p>No se encontraron datos de recolección.</p>');
    }
});