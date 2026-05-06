const taskList      = document.getElementById('taskList');
const emptyState    = document.getElementById('empty-state');
const taskCount     = document.getElementById('task-count');
const validationMsg = document.getElementById('validation-msg');
const globalLoader  = document.getElementById('global-loader');
const loaderText    = document.getElementById('loader-text');
const apiStatus     = document.getElementById('api-status');


export const render = (tasks) => {
  taskList.innerHTML = '';
  tasks.forEach(task => taskList.appendChild(buildNode(task)));
  updateCounters(tasks);
};

function buildNode(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const check = document.createElement('button');
  check.className = 'task-check';
  check.setAttribute('aria-label', 'Completar');

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  const itemLoader = document.createElement('div');
  itemLoader.className = 'item-loader';
  const itemSpinner = document.createElement('div');
  itemSpinner.className = 'item-spinner';
  itemLoader.appendChild(itemSpinner);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-action edit';
  editBtn.dataset.action = 'edit';
  editBtn.setAttribute('aria-label', 'Editar');
  editBtn.textContent = '✎';

  const delBtn = document.createElement('button');
  delBtn.className = 'btn-action delete';
  delBtn.dataset.action = 'delete';
  delBtn.setAttribute('aria-label', 'Eliminar');
  delBtn.textContent = '✕';

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(check);
  li.appendChild(span);
  li.appendChild(itemLoader);
  li.appendChild(actions);

  return li;
}


export const setLoading = (visible, msg = 'Procesando…') => {
  loaderText.textContent = msg;
  globalLoader.classList.toggle('visible', visible);
};

export const setStatus = (state) => {
  apiStatus.className = `api-status api-status--${state}`;
  const labels = { ok: 'API conectada', error: 'API sin conexión', loading: 'conectando…' };
  apiStatus.textContent = labels[state] ?? state;
};

export const showError = (msg) => {
  validationMsg.textContent = msg;
  validationMsg.classList.add('show');
  clearTimeout(showError._t);
  showError._t = setTimeout(() => validationMsg.classList.remove('show'), 3000);
};

export const setItemLoading = (li, loading) => {
  li.classList.toggle('item-loading', loading);
};

function updateCounters(tasks) {
  taskCount.textContent = tasks.length;
  emptyState.classList.toggle('hidden', tasks.length > 0);
}
