// ============================================
// SOLICITAR CÓDIGO DE RECUPERACIÓN
// ============================================

document.getElementById('btn-enviar')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const btnEnviar = document.getElementById("btn-enviar");

    // Validaciones
    if (!email) {
        alert("⚠️ Por favor ingresa tu correo electrónico");
        return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return;
    }

    btnEnviar.textContent = "Enviando...";
    btnEnviar.disabled = true;

    try {
        const res = await fetch('http://localhost:8081/api/recuperar/solicitar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('mensaje-exito').classList.remove('hidden');
            
            // ✅ Pasar el email por URL en lugar de sessionStorage
            setTimeout(() => {
                window.location.href = `./nueva-contrasena.html?email=${encodeURIComponent(email)}`;
            }, 3000);
        } else {
            alert('❌ ' + data.message);
            btnEnviar.textContent = 'Enviar Código';
            btnEnviar.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al procesar la solicitud. Inténtalo de nuevo.');
        btnEnviar.textContent = 'Enviar Código';
        btnEnviar.disabled = false;
    }
});

document.getElementById('email')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-enviar').click();
    }
});