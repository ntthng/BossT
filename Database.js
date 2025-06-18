import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, onValue, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB7h2xUySs_TT4QgYHuLOXfn-JQ0RULayA",
  authDomain: "boss-timing.firebaseapp.com",
  databaseURL: "https://boss-timing-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "boss-timing",
  storageBucket: "boss-timing.appspot.com",
  messagingSenderId: "624410729520",
  appId: "1:624410729520:web:50079b8cc0a5b1fc5421f5",
  measurementId: "G-4MN0YSEJ1W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === Function: Lưu thông tin tiêu diệt + tính lại nextRespawn + log lại lịch sử ===
export async function saveKilledTime(bossId, killedTime, clientId) {
  const bossRef = ref(db, `bosses/${bossId}`);
  const snapshot = await get(bossRef);
  if (!snapshot.exists()) return;

  const boss = snapshot.val();
  const respawnDuration = boss.respawn || 0;
  const level = parseInt((boss.level || "").replace("Lv.", ""));

  // Bonus logic 1.2: tính offset theo level
  let offsetMin = 0;
  if (level >= 40 && level <= 45) offsetMin = 5;
  else if (level >= 50 && level <= 55) offsetMin = 10;
  else if (level >= 60 && level <= 65) offsetMin = 20;
  else if (level >= 70) offsetMin = 30;

  const offsetMs = offsetMin * 60 * 1000;
  const nextRespawn = killedTime + respawnDuration * 60 * 60 * 1000;

  // Thêm vào log
  const newLog = {
    killedTime,
    nextRespawn,
    updatedAt: Date.now(),
    clientId: clientId || "unknown"
  };

  const updatedLogs = boss.logs ? [...boss.logs, newLog] : [newLog];

  await update(bossRef, {
    killedTime,
    nextRespawn,
    updatedAt: Date.now(),
    logs: updatedLogs
  });
}

// === Function: Đăng ký lắng nghe realtime data ===
export function subscribeToBossData(callback) {
  const bossesRef = ref(db, "bosses");
  onValue(bossesRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
}
