const API_URL = 'http://localhost:8080/TasksAPI/api/task';

export let tasks = [];

async function checkResponse(response) {
  if (!response.ok) {
    const msg = await response.text().catch(() => response.statusText);
    throw new Error(`HTTP ${response.status}: ${msg}`);
  }
  return response;
}

export const fetchTasks = async () => {
  const response = await fetch(API_URL);
  await checkResponse(response);
  tasks = await response.json();
  return tasks;
};

/** post */
export const addTask = async (text) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false }),
  });
  await checkResponse(response);
  const newTask = await response.json();
  tasks.push(newTask);
  return tasks;
};

/** Delete*/
export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
  await checkResponse(response);
  tasks = tasks.filter(t => t.id !== id);
  return tasks;
};

/** Put */
export const toggleTask = async (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return tasks;
  const updatedTask = { ...task, completed: !task.completed };
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });
  await checkResponse(response);
  const saved = await response.json();
  task.completed = saved.completed;
  return tasks;
};

/** put */
export const editTask = async (id, newText) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return tasks;
  const updatedTask = { ...task, text: newText };
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });
  await checkResponse(response);
  const saved = await response.json();
  task.text = saved.text;
  return tasks;
};
