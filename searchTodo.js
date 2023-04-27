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

// MAIN
(() => {
  initSearchInput()
})()