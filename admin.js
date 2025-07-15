// admin.js
import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const logoutBtn     = document.getElementById('logout-btn');
const listContainer = document.getElementById('appointments-list');
const filterBtns    = document.querySelectorAll('.filter-btn');
let currentFilter   = 'all';

// 1. Protege la ruta
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = 'login.html';
});

// 2. Cerrar sesión
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'login.html';
});

// 3. Cambio de filtro
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Quitamos la clase active de todos y la ponemos en el pulsado
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    // Re-renderizamos con el filter actualizado
    if (window.lastData) renderCards(window.lastData);
  });
});

// 4. Escucha real-time en Firestore
const apptRef = collection(db, 'appointments');
onSnapshot(apptRef, snap => {
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Guardamos los datos para poder re-filtrar sin pedir de nuevo a Firestore
  window.lastData = data;
  renderCards(data);
});

// 5. Función de renderizado con tus tarjetas
function renderCards(appointments) {
  listContainer.innerHTML = '';

  appointments
    .filter(a => currentFilter === 'all' || a.status === currentFilter)
    .sort((a, b) => a.datetime.toDate() - b.datetime.toDate())
    .forEach(a => {
      const card = document.createElement('div');
      card.classList.add('appointment-card');
      card.innerHTML = `
        <div class="card-header">
          <h3>${a.name}</h3>
          <span class="status-badge status-${a.status}">${a.status}</span>
        </div>
        <div class="card-body">
          <p><strong>Servicio:</strong> ${a.service}</p>
          <p><strong>Fecha:</strong> ${a.datetime.toDate().toLocaleString()}</p>
        </div>
        <div class="card-actions">
          ${a.status === 'pending'
            ? `<button data-id="${a.id}" data-action="confirm" class="action-btn btn-confirm">Confirmar</button>`
            : ''}
          <button data-id="${a.id}" data-action="cancel" class="action-btn btn-cancel">Cancelar</button>
        </div>
      `;
      listContainer.appendChild(card);

      // Asignamos eventos a los botones de la card
      card.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', async () => {
          const action = btn.dataset.action;
          const docRef = doc(db, 'appointments', btn.dataset.id);
          await updateDoc(docRef, {
            status: action === 'confirm' ? 'confirmed' : 'cancelled'
          });
        });
      });
    });
}
