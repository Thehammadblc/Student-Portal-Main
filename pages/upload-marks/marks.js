// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection, getDocs, query, where, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB_Qm_-vCkN2xWKfgj2mEgxnU8BHqyND8c",
    authDomain: "repeatbatch-5da02.firebaseapp.com",
    databaseURL: "https://repeatbatch-5da02-default-rtdb.firebaseio.com",
    projectId: "repeatbatch-5da02",
    storageBucket: "repeatbatch-5da02.appspot.com",
    messagingSenderId: "613844999421",
    appId: "1:613844999421:web:57cc5956d761fb2f933294",
    measurementId: "G-K7XV76YH0E"
};

// Initialize Firestore
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

const form = document.getElementById('uploadMarksForm');
const loading = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  loading.classList.remove('hidden');

  // Get form values
  const cnic = document.getElementById('cnic').value;
  const course = document.getElementById('course').value;
  const marks = document.getElementById('marks').value;
  const totalMarks = document.getElementById('totalMarks').value;
  const grade = document.getElementById('grade').value;

  try {
      // Fetch student by CNIC
      const studentQuery = query(collection(db, 'users'), where('cnic', '==', cnic));
      const querySnapshot = await getDocs(studentQuery);

      // Check if student exists
      if (querySnapshot.empty) {
          alert('No student found with this CNIC');
          return;
      }

      // Get student document reference
      let studentDocRef;
      querySnapshot.forEach((doc) => {
          studentDocRef = doc.ref; // Reference to the student's document
      });

      // Create an object for the marks
      const marksData = {
          course: course,
          marks: parseInt(marks),
          totalMarks: parseInt(totalMarks),
          grade: grade,
          timestamp: serverTimestamp()  // Add timestamp for better tracking
      };

      // Add marks to Firestore under the student's document (subcollection "marks")
      await addDoc(collection(studentDocRef, 'marks'), marksData);

      // Show success message and redirect after 3 seconds
      setTimeout(() => {
          loading.classList.add('hidden');
          alert('Marks uploaded successfully!');
          window.location.href = "../admin-pannel/admin.html";
      }, 3000); // 3000 milliseconds = 3 seconds

  } catch (error) {
      console.error('Error uploading marks:', error.message);
      loading.classList.add('hidden'); // Hide loading state on error
  }
});