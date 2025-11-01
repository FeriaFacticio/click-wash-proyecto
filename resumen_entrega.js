$(document).ready(function() {
    
    // Función para obtener parámetros de la URL (sin cambios)
    function obtenerParametroUrl(nombre) {
        nombre = nombre.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + nombre + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const datosCodificados = obtenerParametroUrl('data');
    const $resumenContainer = $('#resumen-contenido-entrega'); 

    // Ocultar el contenedor del total estimado si existe en el HTML
    // Esto asegura que la parte del costo ($480) no se muestre en la página de entrega
    $('.total-title, #total-estimado').hide(); 

    if (datosCodificados) {
        try {
            const datos = JSON.parse(datosCodificados);
            
            // 1. Formateo de Datos de Entrega
            const fechaHoraObj = new Date(datos.fechaHora);
            const fecha = fechaHoraObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            const hora = fechaHoraObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            
            const direccionCompleta = `${datos.calle}, ${datos.colonia}, ${datos.municipio} (#${datos.numExt})`;

            // 2. Construir el HTML de RESUMEN DE ENTREGA
            const html = `
                <p><strong>Nombre:</strong> ${datos.nombre}</p>
                <p><strong>Fecha de Entrega:</strong> ${fecha}</p> 
                <p><strong>Hora de Entrega:</strong> ${hora}</p> 
                <hr style="border-color: #f39c12; margin: 15px 0;">
                
                <p><strong>Número de Pedido:</strong> ${datos.pedidoNo || '230902'}</p>
                <p><strong>Dirección de Entrega:</strong> ${direccionCompleta}</p> 
                <p><strong>Teléfono:</strong> ${datos.telefono}</p>
            `;

            $resumenContainer.html(html);

        } catch (e) {
            console.error("Error al parsear datos de entrega:", e);
            $resumenContainer.html('<p>Error al cargar el resumen de entrega. Intente de nuevo.</p>');
        }
    } else {
        $resumenContainer.html('<p>No se encontraron datos de entrega. Por favor, regrese y complete el formulario.</p>');
    }
    
    // 3. Conexión del botón "Finalizar Pedido" (regresar al índice)
    $('.btn-confirm').on('click', function() {
        alert('¡Entrega programada con éxito! Gracias por usar Click & Wash.');
        window.location.href = 'index.html'; 
    });
});