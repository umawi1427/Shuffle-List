const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
const randomBtn = document.getElementById('random-btn');
const randomDisplay = document.getElementById('random-display'); // Added this line
const modal = document.getElementById('myModal');
const modalMessage = document.getElementById('modal-message');
const deleteBtn = document.getElementById('delete-btn');
const keepBtn = document.getElementById('keep-btn');
let isEditMode = false;
let currentRandomItem = '';

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  console.log('Form submitted, new item:', newItem); // Debug log

  if (newItem === '') {
    showToast('Please add an item');
    return;
  }
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      showToast('That item already exists!');
      return;
    }
  }
  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
}

function addItemToDOM(item) {
  console.log('Adding item to DOM:', item); // Debug log
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  console.log('Adding item to storage:', item); // Debug log
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  itemList.innerHTML = '';
  localStorage.removeItem('items');
  showToast('All items cleared!');
  checkUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('li').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(text) ? 'flex' : 'none';
  });
}

function generateRandomItem() {
  const items = getItemsFromStorage();
  if (items.length === 0) {
    showToast('No items available to select');
    return;
  }

  currentRandomItem = items[Math.floor(Math.random() * items.length)];

  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  randomDisplay.innerHTML = ''; // Clear the display area
  randomDisplay.appendChild(spinner); // Show the spinner

  // Simulate a delay before showing the random item
  setTimeout(() => {
    spinner.remove(); // Remove the spinner
    randomDisplay.textContent = `Random Item: ${currentRandomItem}`; // Display the picked item
  }, 1500); // Spin for 1.5 seconds
}

function checkUI() {
  const items = itemList.querySelectorAll('li');
  clearBtn.style.display = items.length ? 'block' : 'none';
  itemFilter.style.display = items.length ? 'block' : 'none';
  resetForm();
}

function resetForm() {
  itemInput.value = '';
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

deleteBtn.addEventListener('click', () => {
  removeItemFromStorage(currentRandomItem);
  displayItems();
  modal.style.display = 'none';
  generateRandomItem();
});

keepBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  generateRandomItem();
});

function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  randomBtn.addEventListener('click', generateRandomItem);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();