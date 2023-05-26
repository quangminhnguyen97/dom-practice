function getAllLiElement() {
  return document.querySelectorAll('ul#listView > li')
}

function isMatchStatus(liElement, filterStatus) {
  return filterStatus === 'all' || liElement.dataset.status === filterStatus
}

function isMatchSearch(liElement, searchTerm) {
  if (searchTerm === '') return true
  const originalContent = liElement.querySelector('.todo__title')
  return originalContent.textContent.toLowerCase().includes(searchTerm.toLowerCase())
}


function isMatch(liElement, params) {
  if (!params) return
  return (isMatchSearch(liElement, params.get('searchTerm')) && isMatchStatus(liElement, params.get('status')))
}

function initSearchInput(searchParams) {
  const searchInput = document.querySelector('#searchTodo')
  if (searchParams.get('searchTerm')) {
    searchInput.value = searchParams.get('searchTerm')
  }

  searchInput.addEventListener('input', () => {
    handleFilterChange('searchTerm', searchInput.value)
  })
}

function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, "", url);

  const liList = getAllLiElement();

  for (const li of liList) {
    const needToShow = isMatch(li, url.searchParams)
    li.hidden = !needToShow
  }
}

function initFilterTodo(searchParams) {
  const selectFilter = document.querySelector('#selectFilter')

  if (searchParams.get('status')) {
    selectFilter.value = searchParams.get('status')
  }

  selectFilter.addEventListener('change', () => {
    handleFilterChange('status', selectFilter.value)
  })
}

// MAIN
(() => {
  const searchParams = new URLSearchParams(window.location.search);

  initSearchInput(searchParams)
  initFilterTodo(searchParams)
})()