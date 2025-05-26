import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDa7ZFUAwbJtTlrUe0fSMmHr1iM-dyHZaQ",
  authDomain: "howarts-formulario.firebaseapp.com",
  projectId: "howarts-formulario",
  storageBucket: "howarts-formulario.firebasestorage.app",
  messagingSenderId: "897432828435",
  appId: "1:897432828435:web:c2922b0e9eb1de71cddde6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const level = params.get('level') || '';
  const points = params.get('points') || '';

  const levelInput = document.getElementById('level');
  const pointsInput = document.getElementById('points');

  if (levelInput) {
    levelInput.value = level;
    levelInput.readOnly = true;
  }
  if (pointsInput) {
    pointsInput.value = points;
    pointsInput.readOnly = true;
  }
});

document.getElementById('hogwarts-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim().toLowerCase();
  const classroom = document.getElementById('class').value.trim().toUpperCase();
  const level = document.getElementById('level').value;
  const points = document.getElementById('points').value;
  const numericPoints = parseInt(points);

  if (!name || !classroom) return alert('Please enter name and class.');

  try {
    const studentRef = doc(db, "students", `${classroom}_${name}`);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const data = studentSnap.data();
      if (data.levels?.includes(level)) {
        return alert('⚠️ That student has already submitted this level.');
      }

      const updatedLevels = [...(data.levels || []), level];
      const updatedPoints = (data.points || 0) + numericPoints;

      await updateDoc(studentRef, {
        levels: updatedLevels,
        points: updatedPoints
      });
    } else {
      await setDoc(studentRef, {
        name,
        classroom,
        levels: [level],
        points: numericPoints
      });
    }

    alert(`✅ Spellwork recorded for ${name} from ${classroom}! Returning to the main page...`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Error saving data:', error);
    alert('❌ There was an error recording your spellwork. Please try again.');
  }
});