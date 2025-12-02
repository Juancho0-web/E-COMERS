// Función de visibilidad del primer campo (Nueva Contraseña)
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('nueva-password'); // ID corregido
    const eyeOpen = document.getElementById('eye-icon-open');
    const eyeClosed = document.getElementById('eye-icon-closed');

    // Verificar si la contraseña está oculta
    const isHidden = passwordInput.type === 'password';

    // Cambiar del password a texto
    passwordInput.type = isHidden ? 'text' : 'password';

    // Alternar iconos según el estado
    eyeOpen.classList.toggle('hidden', !isHidden);
    eyeClosed.classList.toggle('hidden', isHidden);
});

// Función de visibilidad del segundo campo (Confirmar Contraseña)
document.getElementById('toggle-password1').addEventListener('click', function() {
    const passwordInput1 = document.getElementById('confirmar-password'); // ID corregido
    const eyeOpen1 = document.getElementById('eye-icon-open1');
    const eyeClosed1 = document.getElementById('eye-icon-closed1');

    // Verificar si la contraseña está oculta
    const isHidden = passwordInput1.type === 'password';

    // Cambiar del password a texto
    passwordInput1.type = isHidden ? 'text' : 'password';

    // Alternar iconos según el estado
    eyeOpen1.classList.toggle('hidden', !isHidden);
    eyeClosed1.classList.toggle('hidden', isHidden);
});