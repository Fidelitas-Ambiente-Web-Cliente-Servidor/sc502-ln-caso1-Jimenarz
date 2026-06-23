// logica del menu y del formulario de reservas
 
// Array con los platillos del menu

const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',    precio: 4500,  categoria: 'Entrada'      },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'      },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',       precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',          precio: 5200,  categoria: 'Postre'       },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'       },
];

// se van guardando las reservas que el usuario agrega
const reservas = [];

// Elementos del DOM para reutilizar
const contenedorMenu = document.getElementById('contenedor-menu');
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const formReserva = document.getElementById('form-reserva');
const btnReservar = document.getElementById('btn-reservar');
const cuerpoTablaReservas = document.getElementById('cuerpo-tabla-reservas');
const resumenReservas = document.getElementById('resumen-reservas');
const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
 
// Campos del formulario
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputFecha = document.getElementById('fecha');
const selectHora = document.getElementById('hora');
const inputPersonas = document.getElementById('personas');
const textareaComentarios = document.getElementById('comentarios');

// Seccion 1: Menu del restaurante

// Muestra las cards del menu en el HTML
// Si no le paso nada, muestra todos los platillos

let categoriaActual = 'Todos';
function renderMenu() {

  const platillosAMostrar = categoriaActual === 'Todos' ? menu : menu.filter((platillo) => platillo.categoria === categoriaActual);

  platillosAMostrar.forEach((platillo) => {
    // Columna de Bootstrap para el grid
    const columna = document.createElement('div');
    columna.classList.add('col-12', 'col-md-6', 'col-lg-4');
 
    // Card del platillo
    const card = document.createElement('div');
    card.classList.add('card-plato');
 
    const categoria = document.createElement('span');
    categoria.classList.add('categoria');
    categoria.textContent = platillo.categoria;
 
    const nombre = document.createElement('h3');
    nombre.classList.add('nombre');
    nombre.textContent = platillo.nombre;
 
    const descripcion = document.createElement('p');
    descripcion.classList.add('descripcion');
    descripcion.textContent = platillo.descripcion;
 
    const precio = document.createElement('p');
    precio.classList.add('precio');
    // precio en colones
    precio.textContent = `₡${platillo.precio.toLocaleString('es-CR')}`;
 
    card.appendChild(categoria);
    card.appendChild(nombre);
    card.appendChild(descripcion);
    card.appendChild(precio);
 
    columna.appendChild(card);
    contenedorMenu.appendChild(columna);
  });

}

// Filtra el menu por categoria y vuelve a pintar las cards
// Tambien le pone la clase "activo" al boton que se eligio
function filtrarCategoria(categoria) {
  botonesFiltro.forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.categoria === categoria);
  });
 
  categoriaActual = categoria;
  renderMenu();
}

// Le pongo el evento click a cada boton de filtro
botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    filtrarCategoria(boton.dataset.categoria);
  });
});

// Seccion 2: Formulario de Reservas

// Pone o quita el mensaje de error debajo de un input
function mostrarError(idError, input, mensaje) {
  const contenedorError = document.getElementById(idError);
  contenedorError.textContent = mensaje;
  if (mensaje) {
    input.classList.add('invalido');
  } else {
    input.classList.remove('invalido');
  }
}

// Revisa todos los campos del formulario
// Devuelve true si todo esta bien, false si hay algun error

function validarFormulario() {
  let esValido = true;
  
  // Nombre: no puede estar vacio, minimo 5 letras, solo letras y espacios
  const nombre = inputNombre.value.trim();
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (nombre === '') {
    mostrarError('error-nombre', inputNombre, 'El nombre es obligatorio.');
    esValido = false;
  } else if (nombre.length < 5) {
    mostrarError('error-nombre', inputNombre, 'El nombre debe tener al menos 5 caracteres.');
    esValido = false;
  } else if (!regexNombre.test(nombre)) {
    mostrarError('error-nombre', inputNombre, 'El nombre solo puede contener letras y espacios.');
    esValido = false;
  } else {
    mostrarError('error-nombre', inputNombre, '');
  }

   // Correo: no puede estar vacio y tiene que tener formato valido
  const correo = inputCorreo.value.trim();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo === '') {
    mostrarError('error-correo', inputCorreo, 'El correo es obligatorio.');
    esValido = false;
  } else if (!regexCorreo.test(correo)) {
    mostrarError('error-correo', inputCorreo, 'Ingrese un correo electrónico válido.');
    esValido = false;
  } else {
    mostrarError('error-correo', inputCorreo, '');
  }

  // Fecha: no puede estar vacia ni ser una fecha que ya paso
  const fecha = inputFecha.value;
  if (fecha === '') {
    mostrarError('error-fecha', inputFecha, 'La fecha es obligatoria.');
    esValido = false;
  } else {
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      mostrarError('error-fecha', inputFecha, 'La fecha no puede ser anterior a hoy.');
      esValido = false;
    } else {
      mostrarError('error-fecha', inputFecha, '');
    }
  }

  // Personas: no puede estar vacio y tiene que estar entre 1 y 20
  const personas = inputPersonas.value;
  if (personas === '') {
    mostrarError('error-personas', inputPersonas, 'El número de personas es obligatorio.');
    esValido = false;
  } else if (Number(personas) < 1 || Number(personas) > 20) {
    mostrarError('error-personas', inputPersonas, 'Debe ser un número entre 1 y 20.');
    esValido = false;
  } else {
    mostrarError('error-personas', inputPersonas, '');
  }
 
  return esValido;
}

// Cada vez que escribo en un campo, valido todo de nuevo asi el error sale al momento y el boton se habilita o no
[inputNombre, inputCorreo, inputFecha, inputPersonas].forEach((campo) => {
  campo.addEventListener('input', () => {
    btnReservar.disabled = !validarFormulario();
  });
});

// Guarda la reserva, la pone en la tabla y limpia el formulario
function agregarReserva() {
  const nuevaReserva = {
    nombre: inputNombre.value.trim(),
    correo: inputCorreo.value.trim(),
    fecha: inputFecha.value,
    hora: selectHora.value,
    personas: Number(inputPersonas.value),
    comentarios: textareaComentarios.value.trim(),
  };
 
  reservas.push(nuevaReserva);

  // Creo la fila de la tabla
  const fila = document.createElement('tr');
  fila.classList.add('fila-reserva');

  // Si son 6 o mas personas, le pongo el color distinto
  if (nuevaReserva.personas >= 6) {
    fila.classList.add('grupo-grande');
  }

  const celdaNombre = document.createElement('td');
  celdaNombre.textContent = nuevaReserva.nombre;
 
  const celdaCorreo = document.createElement('td');
  celdaCorreo.textContent = nuevaReserva.correo;
 
  const celdaFecha = document.createElement('td');
  celdaFecha.textContent = nuevaReserva.fecha;
 
  const celdaHora = document.createElement('td');
  celdaHora.textContent = nuevaReserva.hora;
 
  const celdaPersonas = document.createElement('td');
  celdaPersonas.textContent = nuevaReserva.personas;
 
  fila.appendChild(celdaNombre);
  fila.appendChild(celdaCorreo);
  fila.appendChild(celdaFecha);
  fila.appendChild(celdaHora);
  fila.appendChild(celdaPersonas);
 
  cuerpoTablaReservas.appendChild(fila);

  // Mensaje de confirmacion (sin usar alert)
  mensajeConfirmacion.textContent = `Reserva de ${nuevaReserva.nombre} agregada correctamente.`;
  setTimeout(() => {
    mensajeConfirmacion.textContent = '';
  }, 3000);
 
  // Limpia el formulario despues de agregar la reserva
  formReserva.reset();
  btnReservar.disabled = true;
 
  actualizarResumen();

}

// Calcula y muestra el resumen de todas las reservas
function actualizarResumen() {
  resumenReservas.innerHTML = '';
 
  const titulo = document.createElement('h4');
  titulo.textContent = 'Resumen de Reservas';
  resumenReservas.appendChild(titulo);
 
  const grid = document.createElement('div');
  grid.classList.add('resumen-grid');
 
  // Total de reservas registradas
  const totalReservas = reservas.length;
 
  // Suma las personas de todas las reservas
  const totalPersonas = reservas.reduce((acumulado, reserva) => acumulado + reserva.personas, 0);
 
  // Busca cual reserva tiene mas personas
  let reservaMayor = null;
  if (reservas.length > 0) {
    reservaMayor = reservas.reduce((mayor, actual) =>
      actual.personas > mayor.personas ? actual : mayor
    );
  }
 
  const datos = [
    { etiqueta: 'Reservas registradas', valor: totalReservas },
    { etiqueta: 'Personas esperadas', valor: totalPersonas },
    {
      etiqueta: 'Reserva más grande',
      valor: reservaMayor ? `${reservaMayor.nombre} (${reservaMayor.personas})` : 'N/A',
    },
  ];
 
  datos.forEach((dato) => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('resumen-dato');
 
    const valor = document.createElement('span');
    valor.classList.add('valor');
    valor.textContent = dato.valor;
 
    const etiqueta = document.createElement('span');
    etiqueta.classList.add('etiqueta');
    etiqueta.textContent = dato.etiqueta;
 
    tarjeta.appendChild(valor);
    tarjeta.appendChild(etiqueta);
    grid.appendChild(tarjeta);
  });
 
  resumenReservas.appendChild(grid);

}

// Eventos principales
document.addEventListener('DOMContentLoaded', function () {
  // Cuando carga la pagina, muestra todo el menu con el filtro "Todos" activo
  filtrarCategoria('Todos');
  actualizarResumen();
});


formReserva.addEventListener('submit', function (e) {
  e.preventDefault(); // Evitar que la pagina se recargue
 
  if (validarFormulario()) {
    agregarReserva();
  }
});
