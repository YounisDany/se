document.addEventListener('DOMContentLoaded', function() {
    const sessionSelect = document.getElementById('session_id');

    // توليد الجلسات العادية من 1 إلى 20
    const normalSessionsGroup = document.createElement('optgroup');
    normalSessionsGroup.label = "الجلسات العادية";
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `جلسة ${i}`;
        normalSessionsGroup.appendChild(option);
    }
    sessionSelect.appendChild(normalSessionsGroup);

    // توليد الجلسات الخاصة من 21 إلى 23
    const specialSessionsGroup = document.createElement('optgroup');
    specialSessionsGroup.label = "الجلسات الخاصة";
    for (let i = 21; i <= 23; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `جلسة خاصة ${i - 20}`;
        specialSessionsGroup.appendChild(option);
    }
    sessionSelect.appendChild(specialSessionsGroup);
});

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // الحصول على القيم من الحقول
    const name = document.getElementById('name').value;
    const phone_number = document.getElementById('phone_number').value;
    const session_id = document.getElementById('session_id').value;
    const amount_paid = parseFloat(document.getElementById('amount_paid').value);

    // سعر الجلسة (تأكد من تعديل السعر إذا كان الجلسات الخاصة لها سعر مختلف)
    const session_price = session_id > 20 ? 100.00 : 50.00; // سعر مختلف للجلسات الخاصة

    // التحقق مما إذا كانت الجلسة محجوزة بالفعل
    let sessions = JSON.parse(localStorage.getItem('sessions')) || {};

    if (sessions[session_id] && sessions[session_id].is_booked) {
        document.getElementById('message').textContent = "هذه الجلسة محجوزة بالفعل.";
        return;
    }

    const remaining_amount = session_price - amount_paid;
    document.getElementById('remaining_amount').value = remaining_amount.toFixed(2);

    // تخزين بيانات الحجز
    sessions[session_id] = {
        name: name,
        phone_number: phone_number,
        session_id: session_id,
        amount_paid: amount_paid,
        remaining_amount: remaining_amount,
        is_booked: true
    };

    localStorage.setItem('sessions', JSON.stringify(sessions));

    document.getElementById('message').textContent = "تم حجز الجلسة بنجاح!";
    document.getElementById('bookingForm').reset();

    displaySessions();
});

function displaySessions() {
    const sessions = JSON.parse(localStorage.getItem('sessions')) || {};
    const sessionsDiv = document.getElementById('sessions');
    sessionsDiv.innerHTML = '';

    Object.keys(sessions).forEach(function(sessionId) {
        const session = sessions[sessionId];

        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        sessionItem.innerHTML = `
            <strong>رقم الجلسة:</strong> ${session.session_id} <br>
            <strong>الاسم:</strong> ${session.name} <br>
            <strong>رقم الهاتف:</strong> ${session.phone_number} <br>
            <strong>المبلغ المدفوع:</strong> ${session.amount_paid} ريال <br>
            <strong>المبلغ المتبقي:</strong> ${session.remaining_amount} ريال
            <button onclick="deleteSession(${session.session_id})">حذف</button>
        `;
        sessionsDiv.appendChild(sessionItem);
    });
}

function deleteSession(sessionId) {
    let sessions = JSON.parse(localStorage.getItem('sessions')) || {};

    if (sessions[sessionId]) {
        delete sessions[sessionId];
        localStorage.setItem('sessions', JSON.stringify(sessions));
        displaySessions();
    }
}

// عرض الجلسات عند تحميل الصفحة
displaySessions();
