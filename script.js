// เปลี่ยน URL ด้านล่างเป็น Web App URL ที่ได้จาก Apps Script ของคุณ
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwye1MY1R2dK2PyLoqz73s_va4oNbwpSUnsfxxq0E5L0Kg1CIvZkVobImw-wMWqw6bz/exec";

// -------------------------------------------------------------
// 🔹 ตั้งค่า Telegram Bot Token และ Chat ID
// -------------------------------------------------------------
const TELEGRAM_BOT_TOKEN = '8697164836:AAHdcDPE0v-gOIJNU-I22-ptAxUBW_F-Ez4';
const TELEGRAM_CHAT_ID = '-1004323225951';

// บันทึกการเลือกสินค้า
function selectProduct(id) {
    localStorage.setItem('selectedProductId', id);
    window.location.href = 'product.html';
}

// คำนวณราคาสดในหน้า product.html
function updatePrice() {
    const basePrice = parseInt(document.getElementById('basePrice')?.value || 0);
    const toppingPrice = parseInt(document.getElementById('topping')?.value || 0);
    const total = basePrice + toppingPrice;
    
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    if (totalPriceDisplay) {
        totalPriceDisplay.innerText = total + ' บาท';
    }
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

    // 1. ส่งข้อความแจ้งเตือนเข้า Telegram
    if (TELEGRAM_BOT_TOKEN !== 'ใส่_BOT_TOKEN_ของคุณตรงนี้' && TELEGRAM_CHAT_ID !== 'ใส่_CHAT_ID_ของคุณตรงนี้') {
        const telegramMessage = 
            `🛍️ <b>มีรายการสั่งซื้อใหม่!</b>\n` +
            `---------------------------\n` +
            `👤 <b>ชื่อลูกค้า:</b> ${orderData.customerName}\n` +
            `📞 <b>เบอร์โทร:</b> ${orderData.phone}\n` +
            `🏠 <b>ที่อยู่จัดส่ง:</b> ${orderData.address || '-'}\n` +
            `☕ <b>รายละเอียดสินค้า:</b> ${orderData.orderDetails || '-'}\n` +
            `💰 <b>ราคารวม:</b> ${orderData.totalPrice || 0} บาท\n` +
            `📝 <b>หมายเหตุ:</b> ${orderData.notes || '-'}`;

        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'HTML'
                })
            });
        } catch (err) {
            console.error('เกิดข้อผิดพลาดในการส่งเข้า Telegram:', err);
        }
    }

    // 2. บันทึกข้อมูลลง Google Sheet
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
