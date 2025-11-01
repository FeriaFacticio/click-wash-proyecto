document.addEventListener('DOMContentLoaded', () => {

    const optionButtons = document.querySelectorAll('.option-button');
    const confirmButton = document.querySelector('.confirm-button');
    let selectedOptionId = null; 

    confirmButton.disabled = true;

    function handleOptionSelection(event) {

        optionButtons.forEach(button => {
            button.classList.remove('selected');
        });

        const selectedButton = event.currentTarget;
        selectedButton.classList.add('selected');
        
        selectedOptionId = selectedButton.id;

        confirmButton.disabled = false;
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', handleOptionSelection);
    });

    confirmButton.addEventListener('click', () => {
        if (selectedOptionId) {
            let message = '';
            if (selectedOptionId === 'delivery-home') {
                message = 'Has confirmado la opción: Entrega a domicilio.';
            } else if (selectedOptionId === 'pickup-store') {
                message = 'Has confirmado la opción: Recoger en sucursal.';
            }

            alert(message + '\n(En un entorno real, aquí se enviarían los datos al servidor.)');

        } else {
            alert('Por favor, selecciona una opción de entrega antes de confirmar.');
        }
    });
});