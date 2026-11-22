const toast = document.getElementById('toast');
const notificationButton = document.getElementById('notificationButton');

function showPageToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showPageToast.timer);
  showPageToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
}

if (notificationButton) {
  notificationButton.addEventListener('click', () => {
    showPageToast('You are all caught up. No new notifications.');
  });
}

/* Resource rows are intentionally clickable but do not navigate to another page. */
document.querySelectorAll('[data-resource-item]').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    item.classList.add('is-clicked');
    setTimeout(() => item.classList.remove('is-clicked'), 180);
    const label = item.textContent.trim().replace(/\s+/g, ' ');
    showPageToast(`${label} selected. No separate resource page is connected yet.`);
  });
});

/* The top-bar search filters the resource cards on this page without scrolling. */
const search = document.getElementById('globalSearch');
const status = document.querySelector('.resource-toolbar p');
const allItems = [...document.querySelectorAll('.page-resource-card [data-resource-item]')];
const totalText = `<strong>${allItems.length}</strong> available resources`;

const clearButton = document.createElement('button');
clearButton.type = 'button';
clearButton.className = 'search-clear';
clearButton.textContent = 'Clear search';
clearButton.hidden = true;
status?.after(clearButton);
status?.setAttribute('aria-live', 'polite');

const resourceGrid = document.querySelector('.page-resource-grid');

function filterResources(query) {
  const normalized = query.trim().toLowerCase();
  // Hold the grid at its full height while searching, so hiding cards doesn't shrink the page and pull the view up.
  if (resourceGrid) {
    if (normalized && !resourceGrid.style.minHeight) resourceGrid.style.minHeight = `${resourceGrid.offsetHeight}px`;
    if (!normalized) resourceGrid.style.minHeight = '';
  }
  let visibleItems = 0;
  document.querySelectorAll('.page-resource-card').forEach((card) => {
    // A match on the card's own title or description shows all of its links.
    const titleMatch = !normalized ||
      (card.querySelector('.resource-title')?.textContent.toLowerCase().includes(normalized) ?? false);
    let shown = 0;
    card.querySelectorAll('[data-resource-item]').forEach((item) => {
      item.hidden = !(titleMatch || item.textContent.toLowerCase().includes(normalized));
      if (!item.hidden) shown++;
    });
    card.hidden = shown === 0;
    visibleItems += shown;
  });
  if (!status) return;
  clearButton.hidden = !normalized;
  if (!normalized) status.innerHTML = totalText;
  else if (visibleItems === 0) status.textContent = `No resources match “${query.trim()}”. Try a shorter word, or clear the search.`;
  else status.textContent = `${visibleItems} of ${allItems.length} resources match “${query.trim()}”`;
}

if (search) {
  search.addEventListener('input', () => filterResources(search.value));
  clearButton.addEventListener('click', () => {
    search.value = '';
    filterResources('');
    search.focus();
  });
}
