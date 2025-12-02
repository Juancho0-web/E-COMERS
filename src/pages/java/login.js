// Login - TechStore Pro (Frontend Corregido)

document.addEventListener('DOMContentLoaded', function () {

    const API_URL = "http://localhost:8081/api/login";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        const datos = {
            Correo: document.getElementById('email').value.trim(),
            Passwords: document.getElementById('password').value
        };

        // Validaciones
        if (!datos.Correo || !datos.Passwords) {
            errorMsg.textContent = 'Por favor completa todos los campos.';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (!emailRegex.test(datos.Correo)) {
            errorMsg.textContent = 'Formato de email inválido.';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (datos.Passwords.length < 6) {
            errorMsg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            errorDiv.classList.remove('hidden');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Iniciando Sesión...';

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos),
                signal: controller.signal
            });

            clearTimeout(timeout);
            const result = await response.json();

            if (response.ok) {
                //  Usar localStorage consistentemente
                localStorage.setItem("sesionActiva", "true");
                
                localStorage.setItem("usuario", JSON.stringify({
                    id: result.usuario.id,
                    Nombre: result.usuario.Nombre,
                    Apellido: result.usuario.Apellido,
                    email: result.usuario.email
                }));

                // Si el backend envía token en el futuro
                if (result.token) {
                    localStorage.setItem("authToken", result.token);
                }

                errorDiv.className = 'bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = 'Inicio de sesión correcto. Redirigiendo...';
                errorDiv.classList.remove('hidden');

                setTimeout(() => window.location.href = 'productos.html', 1500);

            } else {
                errorMsg.textContent = result.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Iniciar Sesión';
            }

        } catch (error) {
            clearTimeout(timeout);
            
            if (error.name === 'AbortError') {
                errorMsg.textContent = 'Tiempo de espera agotado. Intenta nuevamente.';
            } else {
                errorMsg.textContent = 'Error de conexión con el servidor';
            }
            
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Iniciar Sesión';
        }
    });

});