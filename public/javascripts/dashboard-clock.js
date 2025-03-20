// Script cập nhật thời gian thực cho Dashboard
console.log("Dashboard clock script loaded");

// Hàm định dạng thời gian (thêm số 0 ở đầu nếu cần)
function padZero(num) {
    return (num < 10) ? "0" + num : num;
}

// Hàm để lấy ngày trong tháng với hậu tố (1st, 2nd, 3rd, 4th...)
function getDayWithSuffix(day) {
    if (day >= 11 && day <= 13) {
        return day + "th";
    }
    switch (day % 10) {
        case 1: return day + "st";
        case 2: return day + "nd";
        case 3: return day + "rd";
        default: return day + "th";
    }
}

// Hàm cập nhật thời gian
function updateClock() {
    console.log("Updating dashboard clock...");
    
    // Kiểm tra xem DOM đã sẵn sàng chưa
    if (!document.getElementById("currentDay") || 
        !document.getElementById("formattedDate") || 
        !document.getElementById("currentMonthYear")) {
        console.log("Clock elements not found, retrying in 500ms...");
        setTimeout(updateClock, 500);
        return;
    }
    
    const now = new Date();
    
    // Lấy các thành phần của thời gian
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const day = now.getDate();
    const dayOfWeek = dayNames[now.getDay()];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());
    
    // Xác định AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // Định dạng giờ
    const displayHours = padZero(hours);
    
    // Chuỗi thời gian đầy đủ
    const timeString = getDayWithSuffix(day) + " of " + month + " " + year + " " + 
                      displayHours + ":" + minutes + ":" + seconds + " " + ampm;
    
    // Cập nhật thời gian vào DOM
    document.getElementById("currentDay").textContent = dayOfWeek;
    document.getElementById("formattedDate").textContent = timeString;
    document.getElementById("currentMonthYear").textContent = month + ", " + year;
    
    // Cập nhật tất cả các năm trong dropdown
    const yearSpans = document.getElementsByClassName("year-span");
    for (let i = 0; i < yearSpans.length; i++) {
        yearSpans[i].textContent = year;
    }
    
    // Gọi lại hàm này sau 1 giây
    setTimeout(updateClock, 1000);
}

// Đảm bảo DOM đã load trước khi chạy script
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("DOM loaded, starting dashboard clock...");
        updateClock();
    });
} else {
    console.log("DOM already loaded, starting dashboard clock immediately...");
    updateClock();
} 