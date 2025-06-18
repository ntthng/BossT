// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Cấu hình Firebase (chỉ cần databaseURL là đủ nếu bạn không dùng auth hay storage)
const firebaseConfig = {
  databaseURL: "https://boss-timing-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🟢 Lấy danh sách boss từ node 'bosses' (danh sách gốc, không phải lịch sử)
export function getBossList(callback) {
  const listRef = ref(db, "bosses"); // ĐÃ SỬA node đúng theo Firebase bạn
  onValue(listRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}

// 🟡 Lưu thời gian tiêu diệt + respawn (nếu có dùng thêm realtime)
export function saveKilledTime(id, data) {
  set(ref(db, "history/" + id), data); // Lưu riêng vào 'history', KHÔNG đè lên 'bosses'
}

// 🔵 Lắng nghe realtime các thay đổi từ node 'history' (nếu cần theo dõi auto update)
export function subscribeToBossData(callback) {
  const bossRef = ref(db, "history");
  onValue(bossRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}
