import * as state from './state.js';
import * as ui    from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {

  const input        = document.getElementById('taskInput');
  const addBtn       = document.getElementById('addBtn');
  const taskList     = document.getElementById('taskList');
  const clearDoneBtn = document.getElementById('clear-done-btn');

  ui.setLoading(true, 'Cargando tareas…');
  ui.setStatus('loading');

  try {
    const tasks = await state.fetchTasks();
    ui.render(tasks);
    ui.setStatus('ok');
  } catch (err) {
    console.error('[app] fetchTasks:', err);
    ui.setStatus('error');
    ui.showError('No se pudo conectar con la API. ¿Está el servidor corriendo?');
  } finally {
    ui.setLoading(false);
  }

  //Crear nodo
  async function handleCreate() {
    const text = input.value.trim();

    if (!text)           return ui.showError('El título no puede estar vacío.');
    if (text.length < 2) return ui.showError('Mínimo 2 caracteres.');

    addBtn.disabled  = true;
    input.disabled   = true;
    ui.setLoading(true, 'Creando tarea…');

    try {
      const tasks = await state.addTask(text);
      input.value = '';
      ui.render(tasks);
    } catch (err) {
      console.error('[app] addTask:', err);
      ui.showError('Error al crear la tarea. Intenta de nuevo.');
    } finally {
      addBtn.disabled = false;
      input.disabled  = false;
      ui.setLoading(false);
      input.focus();
    }
  }

  addBtn.addEventListener('click', handleCreate);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleCreate(); });

  taskList.addEventListener('click', async (e) => {
    const target = e.target;
    const li = target.closest('.task-item');
    if (!li) return;

    const id = parseInt(li.dataset.id, 10);
    if (isNaN(id)) return;

    if (target.classList.contains('task-check') ||
        target.classList.contains('task-text')) {
      ui.setItemLoading(li, true);
      try {
        const tasks = await state.toggleTask(id);
        ui.render(tasks);
      } catch (err) {
        console.error('[app] toggleTask:', err);
        ui.showError('No se pudo actualizar la tarea.');
        ui.setItemLoading(li, false);
      }
      return;
    }

    if (target.dataset.action === 'edit') {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return;

      const newText = prompt('Editar tarea:', task.text);
      if (newText === null) return;
      const trimmed = newText.trim();
      if (!trimmed) return ui.showError('El texto no puede estar vacío.');

      ui.setItemLoading(li, true);
      try {
        const tasks = await state.editTask(id, trimmed);
        ui.render(tasks);
      } catch (err) {
        console.error('[app] editTask:', err);
        ui.showError('No se pudo guardar el cambio.');
        ui.setItemLoading(li, false);
      }
      return;
    }

    if (target.dataset.action === 'delete') {
      li.classList.add('removing');
      await new Promise(r => li.addEventListener('animationend', r, { once: true }));

      try {
        const tasks = await state.deleteTask(id);
        ui.render(tasks);
      } catch (err) {
        console.error('[app] deleteTask:', err);
        li.classList.remove('removing');
        ui.showError('No se pudo eliminar la tarea.');
      }
    }
  });
  

  clearDoneBtn.addEventListener('click', async () => {
    const completed = state.tasks.filter(t => t.completed);
    if (!completed.length) return;

    const nodes = [...taskList.querySelectorAll('.task-item.completed')];
    nodes.forEach(li => li.classList.add('removing'));
    await Promise.all(
      nodes.map(li => new Promise(r => li.addEventListener('animationend', r, { once: true })))
    );

    ui.setLoading(true, `Eliminando ${completed.length} tarea(s)…`);
    try {
      await Promise.all(completed.map(t => state.deleteTask(t.id)));
      ui.render(state.tasks);
    } catch (err) {
      console.error('[app] clearDone:', err);
      ui.showError('Algunas tareas no pudieron eliminarse.');
      ui.render(state.tasks);
    } finally {
      ui.setLoading(false);
    }
  });
});
