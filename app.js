// app.js
import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const reservaForm = document.querySelector('#reserva-form');
const logoutBtn   = document.querySelector('#logout-btn');

// Protegemos acceso: si no hay usuario, lo mandamos a login.html
onAuthStateChanged(auth, user => {
  if (!user) {
    location.href = 'login.html';
  }
});

// Cerrar sesión
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    location.href = 'login.html';
  });
}

// Enviar reserva a Firestore
if (reservaForm) {
  reservaForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert('Debes iniciar sesión primero');

    const data = {
      userId: user.uid,
      name:   reservaForm.name.value,
      email:  reservaForm.email.value,
      phone:  reservaForm.phone.value,
      datetime: new Date(reservaForm.datetime.value),
      service: reservaForm.service.value,
      status:    'pending',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'appointments'), data);
      alert('¡Cita solicitada! Te confirmaremos pronto.');
      reservaForm.reset();
    } catch (err) {
      console.error(err);
      alert('Error al enviar la reserva');
    }
  });
}
const modal      = document.getElementById('modal-reserva');
const btnClose   = document.getElementById('modal-close');
const btnCancel  = document.getElementById('modal-cancel');

function openModal() {
  modal.classList.add('active');
}
function closeModal() {
  modal.classList.remove('active');
}

// Cuando el usuario hace “select” en el calendario
select: info => {
  // …
  openModal();
},

// Asociar botones
btnClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

// Al enviar el formulario, también cierra modal
reservaForm.addEventListener('submit', () => {
  closeModal();
});
