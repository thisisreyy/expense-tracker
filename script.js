document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('authenticated')) {
        window.location.href = 'signin.html';
    }

    let currencyFixed = false;
    let initialCurrency = '';

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('authenticated');
        window.location.href = 'signin.html';
    });

    function updateTotalExpenses() {
        const expenseList = document.getElementById('expense-list').getElementsByTagName('li');
        let total = 0;
        for (let item of expenseList) {
            const amountText = item.querySelector('span:last-child').textContent.replace(/[^\d.-]/g, '');
            total += parseFloat(amountText);
        }
        const currency = initialCurrency || document.getElementById('currency').value;
        document.getElementById('total-expenses').textContent = `${currency}${total.toFixed(2)}`;
    }

    document.getElementById('currency').addEventListener('change', function() {
        if (currencyFixed) {
            alert('Invalid choice: You cannot change the currency after adding an expense.');
            this.value = initialCurrency; // Reset to initial currency
        }
    });

    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const currency = document.getElementById('currency').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const description = document.getElementById('expense-name').value;
        const category = document.getElementById('expense-category').value;

        if (!isNaN(amount) && description && category) {
            if (!currencyFixed) {
                initialCurrency = currency; // Set initial currency
                currencyFixed = true;       // Lock the currency
            }

            const expenseList = document.getElementById('expense-list');
            const expenseItem = document.createElement('li');

            expenseItem.className = 'p-4 bg-black rounded-md';
            expenseItem.innerHTML = `
                <strong>${description}</strong><br>
                <span>${category}</span><br>
                <span>${initialCurrency}${amount.toFixed(2)}</span>
            `;

            expenseList.appendChild(expenseItem);

            updateTotalExpenses();

            // Reset form fields
            document.getElementById('expense-amount').value = '';
            document.getElementById('expense-name').value = '';
            document.getElementById('expense-category').value = '';
        } else {
            alert('Please enter a valid amount and complete all fields.');
        }
    });
});
