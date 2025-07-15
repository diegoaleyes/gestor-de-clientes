// calendar.js
// calendar.js
import { Calendar } from 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/main.esm.js';
import { db }       from './firebase-config.js';
// …resto de imports de Firestore…

document.addEventListener('DOMContentLoaded', async () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    // …tus opciones…
    events: await loadEvents()
  });
  calendar.render();
});

// 1. Importa Firebase y Firestore
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// 2. Ajusta aquí tu ID de salón (documento en 'salons')
const salonId = 'nxdigital-salon';

// 3. Función que carga disponibilidad y citas
async function loadEvents() {
  const availSnap = await getDocs(
    collection(db, 'salons', salonId, 'availability')
  );
  const apptSnap = await getDocs(
    query(
      collection(db, 'appointments'),
      where('salonId', '==', salonId)
    )
  );

  const avail = availSnap.docs.map(d => {
    const { date, startTime, endTime } = d.data();
    const base = date.toDate().toISOString().split('T')[0];
    return {
      title: 'Disponible',
      start: `${base}T${startTime}`,
      end:   `${base}T${endTime}`,
      rendering: 'background',
      classNames: ['fc-bg-event']
    };
  });

  const booked = apptSnap.docs.map(d => {
    const { start, end } = d.data();
    return {
      title: 'Reservado',
      start: start.toDate(),
      end:   end.toDate(),
      classNames: ['reserved']
    };
  });

  return [...avail, ...booked];
}

document.addEventListener('DOMContentLoaded', async () => {
  // 4. Inicializa el calendario
  const calendarEl = document.getElementById('calendar');
  const modal      = document.getElementById('modal-reserva');
  const form       = document.getElementById('reserva-form');
  const infoP      = document.getElementById('modal-info');
  let selectedRange;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'es',
    height: 'auto',
    allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    selectable: true,
    select: info => {
      selectedRange = info;
      infoP.textContent = `
        ${info.start.toLocaleDateString()} · 
        ${info.start.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
      `;
      form.datetime.value = info.start.toISOString();
      modal.classList.add('active');
    },
    events: await loadEvents()
  });

  calendar.render();

  // 5. Cerrar modal
  document.getElementById('modal-cancel').addEventListener('click', () =>
    modal.classList.remove('active')
  );
  document.getElementById('modal-close').addEventListener('click', () =>
    modal.classList.remove('active')
  );

  // 6. Envío de reserva
  form.addEventListener('submit', async e => {
    e.preventDefault();
    // aquí tu lógica para guardar la reserva en Firestore...
    modal.classList.remove('active');
  });
});
