const form = document.querySelector("form");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
const inputs = form.querySelectorAll("input[required]");

// 📦 Toast flotante
function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-up z-50";
  toast.innerText = mensaje;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// 🔎 Crea y muestra un mensaje de error debajo del campo
function mostrarError(input, mensaje) {
  eliminarError(input);

  const error = document.createElement("p");
  error.className =
    "text-sm text-red-600 mt-1 animate-fade-in-up";
  error.innerText = mensaje;
  input.classList.add("ring-2", "ring-red-500");
  input.insertAdjacentElement("afterend", error);
}

// 💨 Elimina mensajes de error si ya existen
function eliminarError(input) {
  input.classList.remove("ring-2", "ring-red-500");
  const siguiente = input.nextElementSibling;
  if (siguiente && siguiente.classList.contains("text-red-600")) {
    siguiente.remove();
  }
}

// 🔐 Validaciones personalizadas
function validarFormulario() {
  let esValido = true;

  inputs.forEach((input) => {
    eliminarError(input);

    const valor = input.value.trim();
    const nombre = input.name;

    if (!valor) {
      mostrarError(input, "Este campo es obligatorio");
      esValido = false;
    } else if (nombre === "telefono" && !/^\d{6,15}$/.test(valor)) {
      mostrarError(input, "Teléfono inválido");
      esValido = false;
    } else if (nombre === "fecha_hora") {
      const fecha = new Date(valor);
      const ahora = new Date();
      if (fecha <= ahora) {
        mostrarError(input, "Elegí una fecha futura");
        esValido = false;
      }
    }
  });

  return esValido;
}

// ✅ Mensaje de éxito centrado + toast
function mostrarConfirmacion() {
  mensajeConfirmacion.innerHTML = `
    <div class="flex items-center justify-center gap-2 text-green-700">
      <svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      ¡Gracias! Recibirás la confirmación luego de realizar la seña.
    </div>
  `;
  mensajeConfirmacion.classList.remove("hidden", "opacity-0");
  mensajeConfirmacion.classList.add("transition-opacity", "duration-500", "opacity-100");

  mostrarToast("Reserva enviada con éxito");

  setTimeout(() => {
    mensajeConfirmacion.classList.add("opacity-0");
    setTimeout(() => {
      mensajeConfirmacion.classList.add("hidden");
      mensajeConfirmacion.innerHTML = "";
    }, 500);
  }, 5000);
}

// 📤 Envío final
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
  })
    .then(() => {
      mostrarConfirmacion();
      form.reset();
    })
    .catch((error) => {
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error. Por favor, intentá nuevamente.");
    });
});

