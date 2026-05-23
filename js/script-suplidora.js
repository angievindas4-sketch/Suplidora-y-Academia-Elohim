// ==========================
// Modal toggle con zoom
// ==========================
document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------
     M O D A L  I M A G E N
  ----------------------- */
  const modalContainer = document.getElementById('modalImagen');
  const modalImg = modalContainer ? modalContainer.querySelector('img') : null;
  let ultimaSrc = "";

  window.abrirModal = function(src) {
    if (!modalContainer || !modalImg) return;
    if (modalContainer.classList.contains('show') && ultimaSrc === src) {
      modalContainer.classList.remove('show');
      ultimaSrc = "";
    } else {
      modalImg.src = src;
      modalContainer.classList.add('show');
      ultimaSrc = src;
    }
  };

  if (modalImg) {
    modalImg.addEventListener('click', () => {
      modalContainer.classList.remove('show');
      ultimaSrc = "";
    });
  }

  /* -----------------------
     F O O T E R  A N I O
  ----------------------- */
  const anioEl = document.getElementById("anio");
  if (anioEl) anioEl.textContent = new Date().getFullYear();

  /* -----------------------
     C A R R I T O
  ----------------------- */
  const WA_NUMBER = "+50671256012";
  const SINPE_NUMBER = "89944774";
  const SINPE_NOMBRE = "Noelia Prado Hernandez";

  const panelCarrito = document.getElementById('panelCarrito');
  const btnCarrito = document.getElementById('btnCarrito');
  const cerrarCarrito = document.getElementById('cerrarCarrito');
  const listaCarritoEl = document.getElementById('listaCarrito');
  const totalCarritoEl = document.getElementById('totalCarrito');
  const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
  const enviarWhatsAppBtn = document.getElementById('enviarWhatsApp');
  const clienteNombreInput = document.getElementById('clienteNombre');
  const toast = document.getElementById('toastCarrito');

  if (!panelCarrito || !btnCarrito) return;

  // ✅ SIMPLE: solo display block/none, sin animaciones
  function abrirPanel() {
    panelCarrito.style.display = 'block';
  }

  function cerrarPanel() {
    panelCarrito.style.display = 'none';
  }

  // Iniciar cerrado
  cerrarPanel();

  btnCarrito.addEventListener('click', function(e) {
    e.stopPropagation();
    if (panelCarrito.style.display === 'block') {
      cerrarPanel();
    } else {
      abrirPanel();
    }
  });

  if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', function(e) {
      e.stopPropagation();
      cerrarPanel();
    });
  }

  // Toast notificaciones
  function showToast(msg, ms = 1400) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), ms);
  }

  // Sonido pop
  function playPop() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.0001;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      o.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  /* -----------------------
     L Ó G I C A  C A R R I T O
  ----------------------- */
  let carrito = [];

  try {
    const saved = localStorage.getItem('carrito_suplidora');
    carrito = saved ? JSON.parse(saved) : [];
  } catch (e) { carrito = []; }

  function guardar() {
    try { localStorage.setItem('carrito_suplidora', JSON.stringify(carrito)); } catch(e){}
  }

  function render() {
    if (!listaCarritoEl) return;
    listaCarritoEl.innerHTML = '';
    let total = 0;

    carrito.forEach((item, idx) => {
      total += item.price * item.qty;
      const li = document.createElement('li');
      li.className = 'item-carrito';

      const nombre = document.createElement('div');
      nombre.className = 'nombre';
      nombre.textContent = item.name;

      const precio = document.createElement('div');
      precio.className = 'precio';
      precio.textContent = `₡${(item.price * item.qty).toLocaleString()}`;

      const qtyWrapper = document.createElement('div');
      qtyWrapper.className = 'qty-control';

      const btnMinus = document.createElement('button');
      btnMinus.className = 'qty-btn';
      btnMinus.textContent = '-';
      btnMinus.onclick = function() { cambiarCantidad(idx, item.qty - 1); };

      const inputQty = document.createElement('input');
      inputQty.className = 'qty-input';
      inputQty.type = 'number';
      inputQty.min = '1';
      inputQty.value = item.qty;
      inputQty.onchange = function() {
        cambiarCantidad(idx, parseInt(this.value) || 1);
      };

      const btnPlus = document.createElement('button');
      btnPlus.className = 'qty-btn';
      btnPlus.textContent = '+';
      btnPlus.onclick = function() { cambiarCantidad(idx, item.qty + 1); };

      const btnRemove = document.createElement('button');
      btnRemove.className = 'qty-btn';
      btnRemove.textContent = 'X';
      btnRemove.onclick = function() { eliminarDelCarrito(idx); };

      qtyWrapper.appendChild(btnMinus);
      qtyWrapper.appendChild(inputQty);
      qtyWrapper.appendChild(btnPlus);
      qtyWrapper.appendChild(btnRemove);

      li.appendChild(nombre);
      li.appendChild(qtyWrapper);
      li.appendChild(precio);
      listaCarritoEl.appendChild(li);
    });

    if (totalCarritoEl) totalCarritoEl.textContent = `Total: ₡${total.toLocaleString()}`;
  }

  window.agregarAlCarrito = function(nombre, precio, marca = '', estilo = '', qty = 1) {
    if (!nombre || isNaN(Number(precio))) return;
    precio = Number(precio);
    const exist = carrito.find(it => it.name === nombre && it.brand === marca && it.style === estilo);
    if (exist) exist.qty += qty;
    else carrito.push({ name: nombre, price: precio, brand: marca, style: estilo, qty: qty });
    guardar();
    render();
    playPop();
    showToast(`✅ Agregado: ${nombre}`);
  };

  window.eliminarDelCarrito = function(index) {
    if (index >= 0 && index < carrito.length) {
      carrito.splice(index, 1);
      guardar();
      render();
    }
  };

  window.cambiarCantidad = function(index, qty) {
    qty = Number(qty) || 0;
    if (index >= 0 && index < carrito.length) {
      if (qty <= 0) carrito.splice(index, 1);
      else carrito[index].qty = qty;
      guardar();
      render();
    }
  };

  // ✅ VACIAR — onclick directo
  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.onclick = function() {
      carrito = [];
      guardar();
      render();
      showToast('🗑️ Lista vaciada');
    };
  }

  // ✅ WHATSAPP — onclick directo
  if (enviarWhatsAppBtn) {
    enviarWhatsAppBtn.onclick = function() {
      if (!carrito.length) {
        showToast('La lista está vacía.');
        return;
      }

      const nombreCliente = clienteNombreInput
        ? (clienteNombreInput.value.trim() || 'No indicado')
        : 'No indicado';

      const descripcion = document.getElementById('descripcionPedido')
        ? document.getElementById('descripcionPedido').value.trim()
        : '';

      let mensaje = `Hola, soy ${nombreCliente}.\nDeseo comprar:\n\n`;
      let total = 0;

      carrito.forEach(it => {
        mensaje += `• ${it.name} x${it.qty} - ₡${(it.price * it.qty).toLocaleString()}\n`;
        total += it.price * it.qty;
      });

      mensaje += `\nTotal: ₡${total.toLocaleString()}\n`;
      mensaje += `\n💳 SINPE Móvil: ${SINPE_NUMBER} (${SINPE_NOMBRE})\n`;

      if (descripcion !== '') {
        mensaje += `\n📝 Observaciones:\n${descripcion}\n`;
      }

      mensaje += `\nGracias.`;

      const url = `https://wa.me/${WA_NUMBER.replace(/^\+/, '')}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    };
  }

  // Render inicial
  render();

}); // fin DOMContentLoaded