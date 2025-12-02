document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    if (!contenedor) return;
    if (!sesionActiva) return;

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.email) return;

    let usuario = null;

    try {
        const res = await fetch("http://localhost:8081/api/perfil/obtener", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: perfil.email})
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || "No se pudo obtener el perfil");
        }
        
        usuario = data.usuario;

        // ✅ LLENAR LOS CAMPOS DEL FORMULARIO
        document.querySelectorAll('input')[0].value = usuario.Nombre;
        document.querySelectorAll('input')[1].value = usuario.Apellido;
        document.querySelectorAll('input')[2].value = usuario.email;
        document.querySelectorAll('input')[3].value = usuario.Telefono;

        // ✅ ACTUALIZAR ENCABEZADO
        document.querySelector('.text-2xl.font-bold').textContent = usuario.Nombre;
        document.querySelector('.text-gray-500').textContent = usuario.email;
        document.querySelector('.w-20.h-20').textContent = 
            `${usuario.Nombre[0]}${usuario.Apellido[0]}`.toUpperCase();
        
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    // ✅ Crear el menú del usuario
    contenedor.innerHTML = `
        <div class="relative">
            <button id="user-menu-btn"
                class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
                <span id="user-avatar"></span>
            </button>

            <div id="user-dropdown"
                class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 
                       transition-all duration-200 ease-out overflow-hidden transform origin-top scale-95 opacity-0">

                <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                    <p class="text-xs text-gray-500" id="user-email"></p>
                </div>

                <a href="../pages/perfil.html"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 
                           hover:bg-blue-50 hover:text-blue-700 
                           transition-all duration-150 cursor-pointer">
                    📋 Mi Perfil
                </a>

                <button id="logout-btn"
                    class="flex items-center w-full px-4 py-3 text-sm text-red-600
                           hover:bg-red-50 hover:text-red-700 
                           transition-all duration-150 cursor-pointer">
                    🚪 Cerrar sesión
                </button>
            </div>
        </div>
    `;

    document.getElementById("user-name").textContent = 
        `${usuario.Nombre} ${usuario.Apellido}`;
    document.getElementById("user-email").textContent = usuario.email;
    const avatar = `${usuario.Nombre[0]}${usuario.Apellido[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;

    
    // ✅ Animación abrir/cerrar dropdown
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");
            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);
        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");    
            setTimeout(() => {
                drop.classList.add("hidden");
            }, 150);
        }
    });

    // ✅ Cerrar dropdown al hacer clic fuera
    document.addEventListener("click", (e) => {
        const drop = document.getElementById("user-dropdown");
        const btn = document.getElementById("user-menu-btn");
        
        if (drop && !drop.contains(e.target) && !btn.contains(e.target)) {
            if (!drop.classList.contains("hidden")) {
                drop.classList.remove("opacity-100", "scale-100");
                drop.classList.add("opacity-0", "scale-95");
                setTimeout(() => {
                    drop.classList.add("hidden");
                }, 150);
            }
        }
    });
});

// ✅ Cerrar sesión
document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
        localStorage.clear();
        const toast = document.getElementById("logout-toast");
        
        if (toast) {
            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("opacity-100"), 20);
            setTimeout(() => {
                toast.classList.remove("opacity-100");
                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 500);
            }, 1800);
        } else {
            window.location.href = "../pages/login.html";
        }
    }
});

// ============= EDICIÓN DE PERFIL =============
const btnEditar = document.getElementById('editar-btn');
const btnGuardar = document.getElementById('guardar-btn');
const btnCancelar = document.getElementById('cancelar-btn');
const accionesEdicion = document.getElementById('acciones-edicion');
const inputs = document.querySelectorAll('input');

let valoresOriginales = {};

function guardarValoresOriginales() {
    inputs.forEach((input, index) => {
        valoresOriginales[index] = input.value;
    });
}

function habilitarEdicion() {
    guardarValoresOriginales();
    
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('bg-gray-100');
        input.classList.add('bg-white', 'border-blue-300');
    });
    
    btnEditar.classList.add('hidden');
    accionesEdicion.classList.remove('hidden');
    accionesEdicion.classList.add('flex');
}

function deshabilitarEdicion() {
    inputs.forEach(input => {
        input.setAttribute('readonly', 'readonly');
        input.classList.remove('bg-white', 'border-blue-300');
        input.classList.add('bg-gray-100');
    });
    
    btnEditar.classList.remove('hidden');
    accionesEdicion.classList.add('hidden');
    accionesEdicion.classList.remove('flex');
}

// ✅ FUNCIÓN CORREGIDA: Ahora envía datos al backend
async function guardarCambios() {
    const Nombre = inputs[0].value.trim();
    const Apellido = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const Telefono = inputs[3].value.trim();
    
    if (!Nombre || !Apellido || !email || !Telefono) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo válido');
        return;
    }

    try {
        // ✅ ENVIAR AL BACKEND
        const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                Nombre: Nombre,
                Apellido: Apellido,
                Telefono: Telefono
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Error al actualizar");
        }

        // ✅ ACTUALIZAR ENCABEZADO - VARIABLE CORREGIDA
        document.querySelector('.text-2xl.font-bold').textContent = Nombre;
        document.querySelector('.text-gray-500').textContent = email;
        document.querySelector('.w-20.h-20').textContent = 
            `${Nombre.charAt(0)}${Apellido.charAt(0)}`.toUpperCase();
        
        alert('Perfil actualizado correctamente');
        deshabilitarEdicion();

    } catch (error) {
        console.error("Error:", error);
        alert('Error al actualizar el perfil: ' + error.message);
    }
}

function cancelarCambios() {
    inputs.forEach((input, index) => {
        input.value = valoresOriginales[index];
    });
    deshabilitarEdicion();
}

btnEditar.addEventListener('click', habilitarEdicion);
btnGuardar.addEventListener('click', guardarCambios);
btnCancelar.addEventListener('click', cancelarCambios);

window.addEventListener('DOMContentLoaded', () => {
    inputs.forEach(input => {
        input.setAttribute('readonly', 'readonly');
    });
});