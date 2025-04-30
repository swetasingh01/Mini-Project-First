let students = JSON.parse(localStorage.getItem('students')) || [];
let isEditMode = false;

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function handleSubmit() {
    if(isEditMode) {
        updateStudent();
    } else {
        addStudent();
    }
}

function addStudent() {
    const student = {
        name: document.getElementById('studentName').value.trim(),
        rollNo: document.getElementById('rollNumber').value.trim(),
        marks: {
            java: parseInt(document.getElementById('java').value),
            dbms: parseInt(document.getElementById('dbms').value),
            automata: parseInt(document.getElementById('automata').value),
            microprocessor: parseInt(document.getElementById('microprocessor').value),
            maths: parseInt(document.getElementById('maths').value)
        }
    };

    if (!student.name || !student.rollNo) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    if (students.some(s => s.rollNo === student.rollNo)) {
        showNotification('Roll number already exists!', 'error');
        return;
    }

    for (const subject in student.marks) {
        const mark = student.marks[subject];
        if (isNaN(mark) || mark < 0 || mark > 100) {
            showNotification('Invalid marks (0-100 only)', 'error');
            return;
        }
    }

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    showNotification('Student added successfully!', 'success');
    clearFields();
    loadStudents();
}

function editStudent(rollNo) {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return;

    isEditMode = true;
    document.getElementById('formTitle').textContent = "Edit Student";
    document.getElementById('cancelBtn').classList.remove('hidden');
    document.getElementById('studentForm').classList.add('edit-mode');
    
    document.getElementById('studentName').value = student.name;
    document.getElementById('rollNumber').value = student.rollNo;
    document.getElementById('originalRollNo').value = student.rollNo;
    document.getElementById('java').value = student.marks.java;
    document.getElementById('dbms').value = student.marks.dbms;
    document.getElementById('automata').value = student.marks.automata;
    document.getElementById('microprocessor').value = student.marks.microprocessor;
    document.getElementById('maths').value = student.marks.maths;
}

function updateStudent() {
    const originalRollNo = document.getElementById('originalRollNo').value;
    const studentIndex = students.findIndex(s => s.rollNo === originalRollNo);
    
    const updatedStudent = {
        name: document.getElementById('studentName').value.trim(),
        rollNo: document.getElementById('rollNumber').value.trim(),
        marks: {
            java: parseInt(document.getElementById('java').value),
            dbms: parseInt(document.getElementById('dbms').value),
            automata: parseInt(document.getElementById('automata').value),
            microprocessor: parseInt(document.getElementById('microprocessor').value),
            maths: parseInt(document.getElementById('maths').value)
        }
    };

    if (!updatedStudent.name || !updatedStudent.rollNo) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    if (updatedStudent.rollNo !== originalRollNo && students.some(s => s.rollNo === updatedStudent.rollNo)) {
        showNotification('Roll number already exists!', 'error');
        return;
    }

    for (const subject in updatedStudent.marks) {
        const mark = updatedStudent.marks[subject];
        if (isNaN(mark) || mark < 0 || mark > 100) {
            showNotification('Invalid marks (0-100 only)', 'error');
            return;
        }
    }

    students[studentIndex] = updatedStudent;
    localStorage.setItem('students', JSON.stringify(students));
    showNotification('Student updated successfully!', 'success');
    cancelEdit();
    loadStudents();
}

function cancelEdit() {
    isEditMode = false;
    document.getElementById('formTitle').textContent = "Add New Student";
    document.getElementById('cancelBtn').classList.add('hidden');
    document.getElementById('studentForm').classList.remove('edit-mode');
    clearFields();
}

function searchStudent() {
    const query = document.getElementById('searchName').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    if (!query) {
        showNotification('Please enter search query', 'error');
        return;
    }

    const found = students.filter(s => s.name.toLowerCase().includes(query));

    if (found.length === 0) {
        resultsDiv.innerHTML = `<div class="result-card">No matching students found</div>`;
        return;
    }

    found.forEach(student => {
        const total = calculateTotal(student.marks);
        const percentage = calculatePercentage(total);
        resultsDiv.innerHTML += `
            <div class="result-card">
                <h3>${student.name} <span style="color: #64748b; font-size: 0.9em">(${student.rollNo})</span></h3>
                <div class="mark-detail">
                    <div style="flex:1">
                        <p>📘 JAVA: ${student.marks.java}</p>
                        <p>🗃️ DBMS: ${student.marks.dbms}</p>
                    </div>
                    <div style="flex:1">
                        <p>🤖 Automata: ${student.marks.automata}</p>
                        <p>⚡ Microprocessor: ${student.marks.microprocessor}</p>
                    </div>
                    <div style="flex:1">
                        <p>🧮 Maths: ${student.marks.maths}</p>
                        <p>🏆 Total: ${total}</p>
                    </div>
                </div>
                <div style="margin-top: 1rem; color: var(--primary); font-weight: 600;">
                    📊 Percentage: ${percentage}%
                </div>
            </div>
        `;
    });
}

function loadStudents() {
    const tbody = document.getElementById('allStudents');
    tbody.innerHTML = '';

    students.forEach(student => {
        const total = calculateTotal(student.marks);
        const percentage = calculatePercentage(total);
        
        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${total}</td>
                <td>${percentage}%</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-icon btn-view" onclick="viewStudent('${student.rollNo}')">👁️</button>
                        <button class="btn btn-icon btn-edit" onclick="editStudent('${student.rollNo}')">✏️</button>
                        <button class="btn btn-icon btn-delete" onclick="deleteStudent('${student.rollNo}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function viewStudent(rollNo) {
    const student = students.find(s => s.rollNo === rollNo);
    const total = calculateTotal(student.marks);
    const percentage = calculatePercentage(total);
    
    const resultHTML = `
        <div class="result-card">
            <h3>${student.name}'s Detailed Report</h3>
            <div class="mark-detail">
                <div style="flex:1">
                    <p>📘 JAVA: ${student.marks.java}</p>
                    <p>🗃️ DBMS: ${student.marks.dbms}</p>
                </div>
                <div style="flex:1">
                    <p>🤖 Automata: ${student.marks.automata}</p>
                    <p>⚡ Microprocessor: ${student.marks.microprocessor}</p>
                </div>
                <div style="flex:1">
                    <p>🧮 Maths: ${student.marks.maths}</p>
                    <p>🏆 Total: ${total}</p>
                </div>
            </div>
            <div style="margin-top: 1rem; color: var(--primary); font-weight: 600;">
                📊 Percentage: ${percentage}%
            </div>
        </div>
    `;
    
    document.getElementById('searchResults').innerHTML = resultHTML;
}

function deleteStudent(rollNo) {
    if (confirm(`Are you sure you want to delete student ${rollNo}?`)) {
        students = students.filter(s => s.rollNo !== rollNo);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        showNotification('Student record deleted', 'success');
    }
}

function calculateTotal(marks) {
    return Object.values(marks).reduce((a, b) => a + b, 0);
}

function calculatePercentage(total) {
    return ((total / 500) * 100).toFixed(2);
}

function clearFields() {
    document.getElementById('studentName').value = '';
    document.getElementById('rollNumber').value = '';
    document.getElementById('java').value = '';
    document.getElementById('dbms').value = '';
    document.getElementById('automata').value = '';
    document.getElementById('microprocessor').value = '';
    document.getElementById('maths').value = '';
    document.getElementById('originalRollNo').value = '';
}

// Initial load
loadStudents();