function getAllLiElement() {
  return document.querySelectorAll('ul#listView > li')
}

function isMatch(liElement, searchTerm) {
  if (searchTerm === '') return true
  const originalContent = liElement.querySelector('.todo__title').textContent
  return originalContent.toLowerCase().includes(searchTerm)
}

function searchTodo(searchTerm) {
  const liList = getAllLiElement();

  for (const li of liList) {
    const needToShow = isMatch(li, searchTerm)
    li.hidden = !needToShow
  }
}

function initSearchInput() {
  const inputType = document.querySelector('#searchTodo')
  inputType.addEventListener('input', (e) => {
    searchTodo(e.target.value)
  })
}

function filterTodo(status) {
  const liList = getAllLiElement();

  for (const li of liList) {
    const needToShow = li.dataset.status === 'all' || li.dataset.status === status;
    li.hidden = !needToShow
  }
}

function initFilterTodo() {
  const selectFilter = document.querySelector('#selectFilter')
  selectFilter.addEventListener('change', () => {
    filterTodo(selectFilter.value)
  })
}

// MAIN
(() => {
  initSearchInput()
  initFilterTodo()
})()