row.innerHTML = `
  <td>${data.name || '(sin nombre)'}</td>
  <td>${data.email}</td>
  <td>${new Date(data.createdAt.toDate()).toLocaleDateString()}</td>
  <td>
    <button class="edit-btn" data-id="${doc.id}">✏️ Editar</button>
    <button class="delete-btn" data-id="${doc.id}">🗑️ Eliminar</button>
  </td>
`;
