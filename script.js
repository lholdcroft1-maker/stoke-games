import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// PASTE YOUR FIREBASE CONFIG HERE
// ==============================

const firebaseConfig = {

  apiKey: "AIzaSyB3ty5K8E7Q2XNqirSVCkz0FqExXT4H3iA",
  authDomain: "stoke-games-fc381.firebaseapp.com",
  projectId: "stoke-games-fc381",
  storageBucket: "stoke-games-fc381.firebasestorage.app",
  messagingSenderId: "461933076358",
  appId: "1:461933076358:web:868fd660e72d66b7bed607"

};


// ==============================
// START FIREBASE
// ==============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==============================
// STOKE HOME FIXTURES
// ==============================

const fixtures = [

["10 Jul 2026","Stoke City vs Sporting Braga"],
["28 Jul 2026","Stoke City vs Everton"],
["1 Aug 2026","Stoke City vs Valencia"],
["8 Aug 2026","Stoke City vs Oldham Athletic AFC"],
["15 Aug 2026","Stoke City vs Swansea City"],
["1 Sep 2026","Stoke City vs Norwich City"],
["5 Sep 2026","Stoke City vs Charlton Athletic"],
["19 Sep 2026","Stoke City vs Sheffield United"],
["13 Oct 2026","Stoke City vs Middlesbrough"],
["24 Oct 2026","Stoke City vs Bristol City FC"],
["31 Oct 2026","Stoke City vs Preston North End FC"],
["21 Nov 2026","Stoke City vs Birmingham City"],
["25 Nov 2026","Stoke City vs Millwall FC"],
["5 Dec 2026","Stoke City vs Queens Park Rangers"],
["12 Dec 2026","Stoke City vs West Bromwich Albion"],
["26 Dec 2026","Stoke City vs Wrexham AFC"],
["16 Jan 2027","Stoke City vs Derby County"],
["26 Jan 2027","Stoke City vs Blackburn Rovers"],
["30 Jan 2027","Stoke City vs Portsmouth FC"],
["13 Feb 2027","Stoke City vs Watford FC"],
["27 Feb 2027","Stoke City vs Bolton Wanderers FC"],
["3 Mar 2027","Stoke City vs Southampton"],
["13 Mar 2027","Stoke City vs West Ham United"],
["3 Apr 2027","Stoke City vs Burnley FC"],
["6 Apr 2027","Stoke City vs Cardiff City"],
["17 Apr 2027","Stoke City vs Wolverhampton Wanderers"],
["24 Apr 2027","Stoke City vs Lincoln City FC"]

];


// ==============================
// LOGIN
// ==============================

window.login = async function(){

const email = document.getElementById("email").value;

const password = document.getElementById("password").value;


try {

await signInWithEmailAndPassword(
auth,
email,
password
);

}

catch(error){

document.getElementById("loginMessage").innerText =
"Login failed";

}

};


// ==============================
// LOGOUT
// ==============================

window.logout = function(){

signOut(auth);

};


// ==============================
// CHECK LOGIN
// ==============================

onAuthStateChanged(auth,(user)=>{


if(user){

document.getElementById("loginBox").style.display="none";

document.getElementById("gamesBox").style.display="block";


document.getElementById("welcome").innerText =
"Logged in as " + user.email;


showFixtures(user);


}

else{

document.getElementById("loginBox").style.display="block";

document.getElementById("gamesBox").style.display="none";

}


});


// ==============================
// SHOW FIXTURES
// ==============================

async function showFixtures(user){

const box=document.getElementById("fixtures");

box.innerHTML="";


fixtures.forEach((game,index)=>{


const div=document.createElement("div");

div.className="fixture";


div.innerHTML=`

<h3>${game[1]}</h3>

<p>${game[0]}</p>

<button onclick="answer(${index},'Yes')">
✅ Yes
</button>

<button class="no" onclick="answer(${index},'No')">
❌ No
</button>

<div id="answer${index}" class="answer"></div>

`;


box.appendChild(div);


loadAnswer(index,user);


});


}


// ==============================
// SAVE ANSWER
// ==============================

window.answer = async function(index,value){

const user=auth.currentUser;

await setDoc(

doc(
db,
"responses",
user.uid + "_" + index
),

{

name:user.email,
game:index,
answer:value

}

);


showFixtures(user);


};


// ==============================
// LOAD ANSWERS
// ==============================

async function loadAnswer(index,user){

const q = query(
  collection(db,"responses"),
  where("game","==",index)
);

const snapshot = await getDocs(q);

let answers = "";

snapshot.forEach((doc)=>{

const data = doc.data();

answers += data.name + ": " + data.answer + "\n";

});


document.getElementById(
"answer"+index
).innerText = answers;

}
