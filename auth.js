

  // auth.js
import { auth } from './firebase-config.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { db } from './firebase-config.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
console.log('loginForm:', document.querySelector('#login-form'));
console.log('signupForm:', document.querySelector('#signup-form'));
console.log('toggleBtn:', document.querySelector('#toggle-signup'));

const loginForm  = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const toggleBtn  = document.querySelector('#toggle-signup');

if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      location.href = 'index.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = signupForm.email.value;
    const password = signupForm.password.value;
    const businessName = signupForm.businessName.value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Guardar en Firestore como cliente
await setDoc(doc(db, 'clients', cred.user.uid), {
  uid: cred.user.uid,
  email: email,
  salonId: cred.user.uid, // Vincula al negocio que lo registró
  createdAt: new Date()
});

// Guardar el negocio del administrador
await setDoc(doc(db, 'salons', cred.user.uid), {
  ownerUid: cred.user.uid,
  email: email,
  name: businessName,
  type: 'peluquería', // Puedes modificar esto más adelante si lo hacés multi-rubro
  createdAt: new Date()
});


      // Guardar en Firestore como cliente
      location.href = 'index.html';
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        alert('Este correo ya está registrado. Usá el formulario de inicio de sesión.');
      } else {
        alert(err.message);
      }
    }
  });
} 


// Alternar visibilidad de los formularios
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.querySelector('#signup-container').classList.toggle('hidden');
  });
}

// Si ya está autenticado, redirige al índice
onAuthStateChanged(auth, user => {
  if (user && (location.pathname.endsWith('login.html'))) {
    location.href = 'index.html';
  }
});

