function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem('todo_list')) || []
  } catch (e) {
    return [];
  }
}

function createTodoElement(todo) {
  if (!todo) return null;
  // find template
  const templateTodo = document.getElementById('todoTemplate');
  if (!templateTodo) return null;

  // clone li element
  const todoElement = templateTodo.content.firstElementChild.cloneNode(true);
  todoElement.dataset.id = todo.id
  todoElement.dataset.status = todo.status

  // render todo status
  const containerLiElement = todoElement.querySelector('div.todo')
  if (!containerLiElement) return null;

  const currentClassName = todo.status === 'completed' ? 'alert-success' : 'alert-info'
  containerLiElement.classList.remove('alert-success', 'alert-info')
  containerLiElement.classList.add(currentClassName)

  // update content when needed
  const titleElement = todoElement.querySelector('.todo__title')
  if (titleElement) titleElement.textContent = todo.title

  // Attach event handlers
  // Finish Event
  const finishEventElement = todoElement.querySelector('button.mark-as-done')
  const currentBtnText = todo.status === 'completed' ? 'Finish' : 'Undo'
  finishEventElement.textContent = currentBtnText
  const currentBtnClass = todo.status === 'completed' ? 'btn-success' : 'btn-dark'
  finishEventElement.classList.remove('btn-success', 'btn-dark')
  finishEventElement.classList.add(currentBtnClass)

  if (finishEventElement) {
    finishEventElement.addEventListener('click', () => {
      const todoList = getTodoList();
      const currentStatus = todoElement.dataset.status
      // Container

      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      todoElement.dataset.status = newStatus
      const newClassName = currentStatus === 'completed' ? 'alert-info' : 'alert-success'
      containerLiElement.classList.remove('alert-success', 'alert-info')
      containerLiElement.classList.add(newClassName)

      // Button
      const newBtnClassName = currentStatus === 'pending' ? 'btn-success' : 'btn-dark'
      const newBtnText = currentStatus === 'completed' ? 'Undo' : 'Finish'
      finishEventElement.textContent = newBtnText
      finishEventElement.classList.remove('btn-dark', 'btn-success')
      finishEventElement.classList.add(newBtnClassName)

      // Set storage
      const newTodoList = todoList.map(t => {
        return t.id === todo.id ? { ...t, status: newStatus } : t
      })
      localStorage.setItem('todo_list', JSON.stringify(newTodoList))
    })
  }

  // Remove Event
  const removeEventElement = todoElement.querySelector('button.remove')
  if (removeEventElement) {
    removeEventElement.addEventListener('click', () => {
      const todoList = getTodoList();
      todoElement.remove()
      const newTodoList = todoList.filter(t => t.id !== todo.id)
      localStorage.setItem('todo_list', JSON.stringify(newTodoList))
    })
  }

  const editElement = todoElement.querySelector('button.edit')
  if (editElement) {
    editElement.addEventListener('click', () => {
      // find todo item
      const todoList = getTodoList();
      const lastedTodo = todoList.find(t => t.id === todo.id)
      if (lastedTodo) {
        populateTodoForm(todo)
      }
    })
  }

  return todoElement
}

function populateTodoForm(todo) {

  const formElement = document.getElementById('todoForm')
  if (!formElement) return;

  const checkboxElement = document.getElementById('checkbox')

  formElement.dataset.id = todo.id

  switch (todo.status) {
    case 'completed':
      checkboxElement.setAttribute("checked", "checked")
      break;
    case 'pending':
      checkboxElement.setAttribute("checked", "")
      checkboxElement.removeAttribute("checked", "")
      break;
    default:
      return
  }

  const inputText = document.getElementById('todoText')
  if (!inputText) return;
  inputText.value = todo.title

}

function renderTodoList(todoList, ulElementId) {
  const liList = document.getElementById(ulElementId)

  if (liList) {
    for (let todo of todoList) {
      const liElement = createTodoElement(todo)
      liList.appendChild(liElement)
    }
  }
}

function handleTodoFormSubmit(e) {
  e.preventDefault()
  const inputText = document.getElementById('todoText')
  if (!inputText) return

  const checkboxElement = document.getElementById('checkbox')
  const newStatus = checkboxElement.checked ? 'completed' : 'pending'


  // check add or edit
  const todoForm = document.querySelector('#todoForm')
  const isEdit = !!todoForm.dataset.id

  if (isEdit) {
    const todoList = getTodoList()
    const indexTodo = todoList.findIndex(todo => todo.id.toString() === todoForm.dataset.id)
    if (indexTodo < 0) return
    todoList[indexTodo].title = inputText.value
    todoList[indexTodo].status = newStatus

    localStorage.setItem('todo_list', JSON.stringify(todoList))

    const liElement = document.querySelector(`ul#listView > li[data-id='${todoForm.dataset.id}']`)
    if (liElement) {
      const titleElement = liElement.querySelector('.todo__title')
      titleElement.textContent = inputText.value

      // container
      const containerLiElement = liElement.querySelector('div.todo')
      const newClassName = newStatus === 'completed' ? 'alert-success' : 'alert-info'
      containerLiElement.classList.remove('alert-success', 'alert-info')
      containerLiElement.classList.add(newClassName)

      // btn
      const btnElement = liElement.querySelector('button.mark-as-done')
      const newBtnText = newStatus === 'completed' ? 'Finish' : 'Undo'
      const newBtnClassName = newStatus === 'pending' ? 'btn-dark' : 'btn-success'
      btnElement.textContent = newBtnText
      btnElement.classList.remove('btn-dark', 'btn-success')
      btnElement.classList.add(newBtnClassName)
    }
  } else {
    const newTodo = {
      id: Date.now(),
      title: inputText.value,
      status: newStatus
    }

    const todoList = getTodoList()
    todoList.push(newTodo)
    localStorage.setItem('todo_list', JSON.stringify(todoList))

    const newLiTodo = createTodoElement(newTodo)
    const liList = document.getElementById('listView')
    liList.appendChild(newLiTodo)
  }

  delete todoForm.dataset.id
  todoForm.reset()
  checkboxElement.setAttribute("checked", "")
  checkboxElement.removeAttribute("checked", "")
}

(() => {
  // const todoList = [
  //   {id: 1, title: 'Learn JS', status: 'pending'},
  //   {id: 2, title: 'Learn ReactJS', status: 'completed'},
  //   {id: 3, title: 'Learn NextJS', status: 'pending'},
  // ];
  // localStorage.setItem('todo_list', JSON.stringify(todoList))
  const todoList = getTodoList()
  renderTodoList(todoList, 'listView');

  const formSubmit = document.querySelector('#todoForm')
  if (formSubmit) {
    formSubmit.addEventListener('submit', handleTodoFormSubmit)
  }
})()


