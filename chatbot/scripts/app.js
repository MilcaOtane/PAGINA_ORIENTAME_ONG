const input = document.getElementById("inputmensaje");
const boton1 = document.getElementById("botonEnviar");
const cuerpo = document.getElementById("cuerpoChat");
const productos = {
  "001": {
    id: "001",
    nombre: "Asesoría vocacional",
    descripcion:
      "La orientación vocacional es un conjunto de actividades y procesos diseñados para ayudar a los individuos a tomar decisiones informadas sobre su futuro profesional. ",
    precio: 0,
    stock: 10,
    oferta: 0,
  },

  "002": {
    id: "002",
    nombre: "Metodología de estudio",
    descripcion:
      "Es el conjunto de métodos que se aplican con el objetivo de resolver un enigma científico, un problema técnico o simplemente generar conocimiento sobre un fenómeno en particular.",
    precio: 0,
    stock: 50,
    oferta: 0,
  },
};

input.addEventListener("input", () => {
  const activo = input.value.trim() !== "";
  boton1.disabled = !activo;
  boton1.style.opacity = activo ? "1" : "0.6";
  boton1.style.opacity = activo ? "pointer" : "not-allowed";
});

boton1.addEventListener("click", enviarMensaje);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enviarMensaje();
});

function enviarMensaje() {
  const texto = input.value.trim();
  if (texto === "") return;

  agregarMensaje("usuario", texto);
  input.value = "";
  input.dispatchEvent(new Event("input"));
  setTimeout(() => {
    procesarRespuesta(texto);
  }, 500);
}

function agregarMensaje(tipo, contenidoHTML) {
  const mensaje = document.createElement("div");
  mensaje.className = "mensaje" + tipo;
  mensaje.innerHTML = contenidoHTML;
  cuerpo.appendChild(mensaje);
  cuerpo.scrollTop = cuerpo.scrollHeight;
}
// Procesa el contenido del mensaje para generar la respuesta
function procesarRespuesta(texto) {
  const mensaje = texto.toLowerCase(); // Convierte a minúsculas para comparar

  // Caso especial: comando "/listar"
  if (mensaje === "/listar") {
    let respuesta = "<strong>Productos disponibles:</strong><br>";
    for (const id in productos) {
      const p = productos[id];
      respuesta += `
          <br>
          <img src="producto.png" alt="img" style="width:40px;vertical-align:middle;margin-right:8px;">
          <strong>${p.nombre}</strong> (ID: ${p.id}) - $${p.precio.toFixed(
        2
      )}<br>
        `;
    }
    respuesta += `<br><em>Escribe el nombre o ID de un producto para ver más detalles.</em>`;
    agregarMensaje("bot", respuesta);
    return;
  }

  // Buscar un producto que coincida por nombre parcial o ID
  let encontrado = null;
  for (const id in productos) {
    const p = productos[id];
    if (
      mensaje.includes(p.nombre.toLowerCase()) || // Coincidencia por nombre
      mensaje.includes(p.id) // Coincidencia por ID
    ) {
      encontrado = p;
      break;
    }
  }

  // Si se encuentra un producto, mostrar sus datos completos
  if (encontrado) {
    const p = encontrado;
    const respuesta = `
        <img src="producto.png" alt="img" style="width:50px;vertical-align:middle;margin-bottom:6px;"><br>
        <strong>${p.nombre}</strong><br>
        <strong>ID:</strong> ${p.id}<br>
        <strong>Categoría:</strong> ${p.categoria}<br>
        <strong>Descripción:</strong> ${p.descripcion}<br>
        <strong>Precio:</strong> $${p.precio.toFixed(2)}<br>
        <strong>Stock:</strong> ${p.stock} unidades<br>
        <strong>Oferta:</strong> ${p.oferta}
      `;
    agregarMensaje("bot", respuesta);

    // Mostrar sugerencias de otros productos
    const otros = Object.values(productos)
      .filter((prod) => prod.id !== p.id) // Excluir el producto actual
      .map((prod) => `<code>${prod.id}</code> (${prod.nombre})`) // Formato: ID + nombre
      .join(", ");

    const sugerencia = `
        ¿Deseas ver otro producto? Puedes consultar alguno de estos: ${otros}
      `;
    setTimeout(() => agregarMensaje("bot", sugerencia), 600);
    return;
  }

  // Si no es comando ni producto: respuesta genérica simulada
  agregarMensaje("bot", generarRespuestaSimulada(mensaje));
}

// Respuestas básicas automáticas del bot
function generarRespuestaSimulada(mensaje) {
  if (mensaje.includes("hola") || mensaje.includes("buenas")) {
    return '¡Hola! Estoy aquí para ayudarte. Puedes escribir "/listar" para ver nuestros productos.';
  } else if (mensaje.includes("precio") || mensaje.includes("costo")) {
    return "Por favor, indica el nombre o ID del producto para darte su precio.";
  } else if (mensaje.includes("gracias")) {
    return "¡Con gusto! Si tienes más dudas, estoy disponible.";
  } else {
    return 'Lo siento, aún estoy en entrenamiento. Puedes escribir "/listar" o preguntar por un producto específico.';
  }
}
