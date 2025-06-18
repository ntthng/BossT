// firebase.js - KHÔNG dùng import, chạy tốt trên Netlify

const firebaseConfig = {
  databaseURL: "https://boss-timing-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.getBossList = function(callback) {
  db.ref("bosses").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
};

window.saveKilledTime = function(id, data) {
  db.ref("history/" + id).set(data);
};

window.subscribeToBossData = function(callback) {
  db.ref("history").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
};
