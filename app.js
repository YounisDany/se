document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // الحصول على القيم من الحقول
    const name = document.getElementById('name').value;
    const phone_number = document.getElementById('phone_number').value;
    const session_id = document.getElementById('session_id').value;
    const amount_paid = parseFloat(document.getElementById('amount_paid').value);

    // سعر الجلسة (تأكد من تعديل السعر إذا كان الجلسات الخاصة لها سعر مختلف)
    const session_price = 50.00;

    // التحقق مما إذا كانت الجلسة محجوزة بالفعل
    let sessions = JSON.parse(localStorage.getItem('sessions')) || {};

    if (sessions[session_id] && sessions[session_id].is_booked) {
        document.getElementById('message').textContent = "هذه الجلسة محجوزة بالفعل.";
        return;
    }

    const remaining_amount = session_price - amount_paid;

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
});
