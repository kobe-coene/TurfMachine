import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDszg4tZEyZR-tyiz4h6McvnUhIlgTegLk",
    authDomain: "turfmachine-c0174.firebaseapp.com",
    projectId: "turfmachine-c0174",
    storageBucket: "turfmachine-c0174.appspot.com",
    messagingSenderId: "79585990175",
    appId: "1:79585990175:web:261f2619a9a504b5b7272a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const peopleList = document.getElementById('people-list');
const addUserForm = document.getElementById('add-user-form');

// Function to render people list
function renderList() {
    const peopleCollection = collection(db, 'people');
    onSnapshot(peopleCollection, (snapshot) => {
        peopleList.innerHTML = '';
        snapshot.forEach((doc) => {
            const person = doc.data();
            const personDiv = document.createElement('div');
            personDiv.classList.add('person');
            personDiv.innerHTML = `
                <span>${person.name}: ${person.drinks}</span>
                <div>
                    <button onclick="incrementDrink('${doc.id}', ${person.drinks})">+</button>
                    <button onclick="decrementDrink('${doc.id}', ${person.drinks})">-</button>
                </div>
            `;
            peopleList.appendChild(personDiv);
        });
    });
}

// Function to increment drink count
window.incrementDrink = async function(id, currentDrinks) {
    const personDoc = doc(db, 'people', id);
    await updateDoc(personDoc, {
        drinks: currentDrinks + 1
    });
}

// Function to decrement drink count
window.decrementDrink = async function(id, currentDrinks) {
    // Ensure drinks don't go below 0
    if (currentDrinks > 0) {
        const personDoc = doc(db, 'people', id);
        await updateDoc(personDoc, {
            drinks: currentDrinks - 1
        });
    }
}

// Function to add a new user
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();

    if (name) {
        await addDoc(collection(db, 'people'), {
            name: name,
            drinks: 0
        });
        nameInput.value = '';
    }
});

// Initial render
renderList();

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
