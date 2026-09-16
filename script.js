// ⚠️ เปลี่ยน URL ด้านล่างเป็น Web App URL ที่ได้จาก Apps Script ของคุณ
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwye1MY1R2dK2PyLoqz73s_va4oNbwpSUnsfxxq0E5L0Kg1CIvZkVobImw-wMWqw6bz/exec";

// บันทึกการเลือกสินค้า
function selectProduct(id) {
    localStorage.setItem('selectedProductId', id);
    window.location.href = 'product.html';
}

// คำนวณราคาสดในหน้า product.html
function updatePrice() {
    const basePrice = parseInt(document.getElementById('basePrice').value || 0);
    const toppingPrice = parseInt(document.getElementById('topping').value || 0);
    const total = basePrice + toppingPrice;
    document.getElementById('totalPriceDisplay').innerText = total + ' บาท';
    return total;
}

// ส่งข้อมูลสั่งซื้อ
async function submitOrder(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "กำลังส่งข้อมูล...";
    submitBtn.disabled = true;

    const orderData = {
        customerName: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        orderDetails: localStorage.getItem('currentOrderDetails'),
        totalPrice: localStorage.getItem('currentTotalPrice'),
        notes: document.getElementById('notes').value
    };

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        window.location.href = 'thankyou.html';
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
        submitBtn.disabled = false;
        submitBtn.innerText = "ยืนยันการสั่งซื้อ";
    }
}