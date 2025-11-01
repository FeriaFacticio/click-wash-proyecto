/// ==================================================
// 1. DEFINICIÓN DE DATOS Y VARIABLES GLOBALES (SIN CAMBIOS)
// ==================================================
const serviciosData = {
    'docena': {
        title: 'Lavado por Docena',
        description: 'Ideal para tu ropa del día a día, cobrado por docena. Mínimo 1 docena.',
        price: 60,
        unit: 'docena',
        min: 1
    },
    'especiales': {
        title: 'Lavado de Prendas Delicadas',
        description: 'Servicio especial para trajes, vestidos y prendas que requieren cuidado extra, cobrado por pieza.',
        price: 75,
        unit: 'pieza',
        min: 1
    },
    'edredones': {
        title: 'Lavado de Edredones y Cobijas',
        description: 'Servicio para artículos grandes de cama, cobrado por pieza. (Ej: Edredón, Manta).',
        price: 90,
        unit: 'pieza',
        min: 1
    }
};

let currentService = null;
let quantity = 1;

// ==================================================
// 2. FUNCIONES DEL MODAL Y CANTIDAD (SIN CAMBIOS)
// ==================================================
function abrirModal(servicioKey) {
    currentService = serviciosData[servicioKey];
    if (!currentService) return;
    $('#modalTitle').text(currentService.title);
    $('#modalDescription').text(currentService.description);
    quantity = currentService.min || 1; 
    $('#quantityValue').text(quantity);
    $('#priceDisplay').html(`Precio por ${currentService.unit}: $${currentService.price.toFixed(2)}`);
    $('#solicitudModal').addClass('show'); 
}

function cerrarModal() {
    $('#solicitudModal').removeClass('show'); 
}

function actualizarCantidad(change) {
    const newQuantity = quantity + change;
    const min = currentService.min || 1;
    if (newQuantity >= min) {
        quantity = newQuantity;
        $('#quantityValue').text(quantity);
    } else if (newQuantity < min) {
        alert(`La cantidad mínima es ${min} ${currentService.unit}(s).`);
    }
}

// ==================================================
// 3. FUNCIONES DE VALIDACIÓN DE FORMULARIO (SIN CAMBIOS)
// ==================================================
function mostrarError($campo, mensaje) {
    let $errorDiv = $campo.next('.error-message');
    if (mensaje) {
        if ($errorDiv.length === 0) {
            $errorDiv = $('<div>').addClass('error-message');
            $campo.after($errorDiv);
        }
        $errorDiv.text(mensaje).show();
        $campo.addClass('input-error'); 
    } else {
        $errorDiv.hide();
        $campo.removeClass('input-error');
    }
}

function validarTelefono() {
    const $telefono = $('#telefono');
    const valor = $telefono.val().trim();
    const longitudRequerida = 10;
    const soloNumeros = /^\d{10}$/; 
    let error = '';

    if (valor !== '') {
        if (valor.length !== longitudRequerida) {
            error = `El teléfono debe tener exactamente ${longitudRequerida} dígitos.`;
        } else if (!soloNumeros.test(valor)) {
            error = 'Solo se permiten números.';
        }
    }
    mostrarError($telefono, error);
    return error === '';
}


// ==================================================
// 4. CONEXIONES JQUERY (Document Ready)
// ==================================================
$(document).ready(function() {

    // --- CONEXIONES DE MODAL Y LANDING (GENERAL) ---
    $('#service-docena, #service-especiales, #service-edredones').on('click', function() {
        const cardId = $(this).attr('id'); 
        const servicioKey = cardId.replace('service-', '');
        abrirModal(servicioKey);
    });

    $('#btnMinus').on('click', () => actualizarCantidad(-1));
    $('#btnPlus').on('click', () => actualizarCantidad(1));
    $('.close-btn').on('click', cerrarModal); 
    
    // Conexión para el botón 'Continuar' del MODAL
    $('#btnContinue').on('click', function() {
        const servicioKey = currentService ? Object.keys(serviciosData).find(key => serviciosData[key] === currentService) : 'docena';
        window.location.href = `recoleccion_form.html?servicio=${servicioKey}&cantidad=${quantity}`;
    });

    // --- LOGICA DE VALIDACION EN FORMULARIOS ---
    
    // Conexión de validación general del teléfono para ambos formularios (si existe el campo)
    $('#telefono').on('blur', validarTelefono);
    $('#telefono').on('keypress', function(e) {
        const charCode = (e.which) ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
    });


    // 🌟 BLOQUE 1: ENVÍO DEL FORMULARIO DE ENTREGA 🌟
    if ($('#formDatosEntrega').length) { // Corre en entrega.html
        $('#formDatosEntrega').on('submit', function(event) {
            event.preventDefault(); 
            
            const telefonoValido = validarTelefono();
            if (!telefonoValido || !this.checkValidity()) {
                alert('Por favor, completa y corrige los campos obligatorios antes de continuar.');
                return;
            }

            const datosEntrega = {
                nombre: $('#nombre').val(),
                calle: $('#calle').val(),
                colonia: $('#colonia').val(),
                municipio: $('#municipio').val(),
                telefono: $('#telefono').val(),
                numExt: $('#num_ext').val(),
                fechaHora: $('#fecha_hora').val(),
                pedidoNo: '230902',
            };

            const datosJSON = JSON.stringify(datosEntrega);
            // 🛑 REDIRECCIÓN CORRECTA: Va al resumen de entrega.
            window.location.href = 'resumen_entrega.html?data=' + encodeURIComponent(datosJSON);
        });
    }

    // 🌟 BLOQUE 2: ENVÍO DEL FORMULARIO DE RECOLECCIÓN 🌟
    // Usamos el selector de clase general (que es el formulario de recolección en recoleccion_form.html)
    if ($('.recoleccion-form').length && !$('#formDatosEntrega').length) { 
        $('.recoleccion-form').on('submit', function(event) {
            event.preventDefault(); 
            
            const telefonoValido = validarTelefono();
            const camposRequeridosLlenos = this.checkValidity();

            if (!telefonoValido || !camposRequeridosLlenos) {
                alert('Por favor, completa y corrige los campos obligatorios antes de confirmar.');
                return;
            }
            
            // Captura de datos (asumo que se requiere la misma estructura)
            const datosFormulario = {
                nombre: $('#nombre').val(),
                calle: $('#calle').val(),
                colonia: $('#colonia').val(),
                municipio: $('#municipio').val(),
                telefono: $('#telefono').val(),
                numExt: $('#num_ext').val(),
                fechaHora: $('#fecha_hora').val(),
                cantidad: 8, 
                precioUnitario: 60.00
            };
            
            const datosJSON = JSON.stringify(datosFormulario);
            // 🛑 REDIRECCIÓN CORRECTA: Va al resumen de recolección.
            const urlResumen = 'resumen_recoleccion.html?data=' + encodeURIComponent(datosJSON);
            
            window.location.href = urlResumen;
        });
    }
});