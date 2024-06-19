let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

document.getElementById('expense-form').addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the form from submitting the default way

    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if(category === ''){
        alert('Please select a category');
        return;
    }
    if(isNaN(amount) || amount <= 0){
        alert('Please enter a valid amount');
        return;
    }
    if(info === ''){
        alert('Please enter a valid info');
        return;
    }
    if(date === ''){
        alert('Please select a valid date');
        return;
    }

    const expense = { category, amount, info, date };

    // Send data to the server using fetch API
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => response.text())
    .then(data => {
        if(data === "Record Inserted Successfully") {
            addExpenseToTable(expense);
        } else {
            alert('Error inserting record');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function addExpenseToTable(expense) {
    expenses.push(expense);
    if(expense.category === 'Income') {
        totalAmount += expense.amount;
    } else if(expense.category === 'Expense') {
        totalAmount -= expense.amount;
    }
    totalAmountCell.textContent = totalAmount;

    const newRow = expenseTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const infoCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function(){
        expenses.splice(expenses.indexOf(expense), 1);
        if(expense.category === 'Income'){
            totalAmount -= expense.amount;
        } else if(expense.category === 'Expense'){
            totalAmount += expense.amount;
        }
        totalAmountCell.textContent = totalAmount;
        expenseTableBody.removeChild(newRow);
    });

    deleteCell.appendChild(deleteBtn);
}
