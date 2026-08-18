function getDateTimeString() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 จึงต้อง +1
  const day = String(now.getDate()).padStart(2, '0');
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // ผลลัพธ์ที่ได้: 2026-08-13_15:30:00
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// ส่งออกฟังก์ชันเพื่อให้ไฟล์อื่นเรียกใช้ได้
module.exports = { getDateTimeString };