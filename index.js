import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import firebaseConfig from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const peopleList = document.getElementById('people-list');
const addUserForm = document.getElementById('add-user-form');

// Define global arrays to store all users and filtered users
let allUsers = [];
let filteredUsers = [];

// Function to render filtered users
function renderFilteredUsers() {
    peopleList.innerHTML = '';
    filteredUsers.forEach((person) => {
        const personRow = document.createElement('tr');
        personRow.innerHTML = `
            <td>${person.name}</td>
            <td>${person.drinks}</td>
            <td>€ ${(person.drinks * 0.7).toFixed(2)}</td>
            <td class="actions">
                <button class="increment-btn" data-id="${person.id}">+</button>
                <button class="decrement-btn" data-id="${person.id}">-</button>
            </td>
        `;
        peopleList.appendChild(personRow);
    });
}

// Function to update filtered users based on search input
function updateFilteredUsers(searchInput) {
    filteredUsers = allUsers.filter((person) =>
        person.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    renderFilteredUsers();
}

// Function to handle search input
function handleSearchInput() {
    const searchInput = document.getElementById('search-input').value;
    updateFilteredUsers(searchInput);
}

// Event listener for search input
document.getElementById('search-input').addEventListener('input', handleSearchInput);

// Function to increment drink count
async function incrementDrink(id) {
    const userDocRef = doc(db, 'people', id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedDrinks = userData.drinks + 1;
        await updateDoc(userDocRef, { drinks: updatedDrinks });
    }
}

// Function to decrement drink count
async function decrementDrink(id) {
    const userDocRef = doc(db, 'people', id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedDrinks = Math.max(userData.drinks - 1, 0);
        await updateDoc(userDocRef, { drinks: updatedDrinks });
    }
}

// Function to add a new user
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();

    if (name) {
        const newUserRef = await addDoc(collection(db, 'people'), {
            name: name,
            drinks: 0
        });
        const newUser = { id: newUserRef.id, name: name, drinks: 0 };
        allUsers.push(newUser);
        updateFilteredUsers(document.getElementById('search-input').value);
        nameInput.value = '';
    }
});

// Initial rendering
onSnapshot(collection(db, 'people'), (snapshot) => {
    allUsers = [];
    snapshot.forEach((doc) => {
        const userData = doc.data();
        allUsers.push({ id: doc.id, ...userData });
    });
    updateFilteredUsers(document.getElementById('search-input').value);
});

// Event listener for increment and decrement buttons using event delegation
document.getElementById('people-list').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('increment-btn')) {
        const id = target.getAttribute('data-id');
        incrementDrink(id);
    } else if (target.classList.contains('decrement-btn')) {
        const id = target.getAttribute('data-id');
        decrementDrink(id);
    }
});

// Initial render
renderFilteredUsers();

// Get the modal element
const modal = document.getElementById('modal');

// Get the button that opens the modal
const openModalBtn = document.getElementById('add-user-btn');

// Get the <span> element that closes the modal
const closeBtn = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
openModalBtn.onclick = function() {
    modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}