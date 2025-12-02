// Función para mostrar/ocultar contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // URL de tu backend
    const API_URL = 'http://localhost:8081/api/Users/register';

    const form = document.getElementById('register-form');
    const btn = document.getElementById('register-button');
    const errorDiv = document.getElementById('register-error');
    const errorMsg = document.getElementById('register-error-message');
    

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Ocultar mensaje de error al inicio
        errorDiv.classList.add('hidden');
        errorMsg.textContent = '';

        // Obtener valores del formulario
        const Nombre = document.querySelector('input[name="Nombre"]').value.trim();
        const Apellido = document.querySelector('input[name="Apellido"]').value.trim();
        const Correo = document.querySelector('input[name="email"]').value.trim();
        const Telefono = document.querySelector('input[name="Telefono"]').value.trim();
        const Passwords = document.getElementById('password').value;
        const Confirm_password = document.getElementById('password-confirm').value;

        // Validaciones
        if (!Nombre || !Apellido || !Correo || !Telefono || !Passwords || !Confirm_password) {
            return showError('Por favor, complete todos los campos.');
        }

        if (!/^\d{10}$/.test(Telefono)) {
            return showError('El teléfono debe tener 10 dígitos.');
        }

        if (Passwords.length < 8) {
            return showError('La contraseña debe tener al menos 8 caracteres.');
        }

        if (Passwords !== Confirm_password) {
            return showError('Las contraseñas no coinciden.');
        }

        // Deshabilitar botón mientras se procesa
        btn.disabled = true;
        btn.textContent = 'Creando cuenta...';

        const datos = { Nombre, Apellido, Correo, Telefono, Passwords };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess('Usuario creado exitosamente. Redirigiendo al login...');
                form.reset();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                showError(result.message || 'Error al crear el usuario');
                btn.disabled = false;
                btn.textContent = 'Crear Cuenta';
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            showError('Error de conexión con el servidor');
            btn.disabled = false;
            btn.textContent = 'Crear Cuenta';
        }
    });

    // Funciones para mostrar mensajes
    function showError(msg) {
        errorDiv.classList.remove('hidden');
        errorDiv.style.backgroundColor = '#fdd';
        errorDiv.style.border = '1px solid #f00';
        errorMsg.textContent = msg;
    }

    function showSuccess(msg) {
        errorDiv.classList.remove('hidden');
        errorDiv.style.backgroundColor = '#dfd';
        errorDiv.style.border = '1px solid #0a0';
        errorMsg.textContent = msg;
    }
});
