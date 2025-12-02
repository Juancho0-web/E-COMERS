// ============================================
// CAMBIAR CONTRASEÑA CON CÓDIGO
// ============================================

// Verificar que haya un email guardado
window.addEventListener('DOMContentLoaded', () => {
    const emailRecuperacion = sessionStorage.getItem('emailRecuperacion');
    
    if (!emailRecuperacion) {
        alert('⚠️ No hay una solicitud de recuperación activa');
        window.location.href = './recuperar.html';
    }
});

// Toggle para mostrar/ocultar contraseña
document.getElementById('toggle-password')?.addEventListener('click', () => {
    const passwordInput = document.getElementById('nueva-password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        `;
    }
});

// Validar solo números en el código
document.getElementById('codigo')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Enviar formulario
document.getElementById('btn-cambiar')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const codigo = document.getElementById('codigo').value.trim();
    const nuevaPassword = document.getElementById('nueva-password').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;
    const btnCambiar = document.getElementById('btn-cambiar');
    const email = sessionStorage.getItem('emailRecuperacion');

    // Validaciones
    if (!codigo || !nuevaPassword || !confirmarPassword) {
        alert('⚠️ Por favor completa todos los campos');
        return;
    }

    if (codigo.length !== 6) {
        alert('⚠️ El código debe tener 6 dígitos');
        return;
    }

    if (nuevaPassword.length < 6) {
        alert('⚠️ La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (nuevaPassword !== confirmarPassword) {
        alert('⚠️ Las contraseñas no coinciden');
        return;
    }

    // Deshabilitar botón y mostrar loading
    btnCambiar.textContent = 'Cambiando...';
    btnCambiar.disabled = true;

    try {
        const res = await fetch('http://localhost:8081/api/recuperar/cambiar-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                codigo,
                nuevaPassword
            })
        });

        const data = await res.json();

        if (res.ok) {
            // Ocultar formulario y mostrar mensaje de éxito
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('mensaje-exito').classList.remove('hidden');
            
            // Limpiar sessionStorage
            sessionStorage.removeItem('emailRecuperacion');
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                window.location.href = './login.html';
            }, 3000);
        } else {
            alert('❌ ' + data.message);
            btnCambiar.textContent = 'Cambiar Contraseña';
            btnCambiar.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al procesar la solicitud. Inténtalo de nuevo.');
        btnCambiar.textContent = 'Cambiar Contraseña';
        btnCambiar.disabled = false;
    }
});

// Permitir enviar con Enter
document.getElementById('confirmar-password')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-cambiar').click();
    }
});