const API_URL = "http://127.0.0.1:8000/students";

document.addEventListener('DOMContentLoaded', () =>{
    setupForm();
    loadStudents(); 
})

function setupForm() {
    const form = document.getElementById('student-form');
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        history.replaceState(null, '', '/');
        saveStudents();
    })
}

document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = "";
    document.getElementById('submit-btn').textContent = "Guardar";
});

function saveStudents() {
    const id = document.getElementById("student-id").value;
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const grade = parseFloat(document.getElementById("grade").value);

    const studentData = {name, age, grade};

    const method = id ? "PUT" : "POST";
    const url = id ? `http://127.0.0.1:8000/students/${id}` : `http://127.0.0.1:8000/students/`;
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    }).then(response => {
        if (!response.ok){
            return response.json().then(err => {throw new Error(err.detail || 'Error en la operación')})
        }
        return response.json()
    }).then(data => {
        alert(id ? "Estudiante actualizado" : "Estudiante creado");
        document.getElementById("student-form").reset();
        document.getElementById("student-id").value = "";
        document.getElementById("submit-btn").textContent = "Guardar";
        loadStudents();
    })
}

function loadStudents() {
    fetch(`http://127.0.0.1:8000/students/`)
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('students-list');
        tbody.innerHTML = '';
        data.forEach(student => {
            tbody.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.grade}</td>
                    <td>
                        <button onclick="editStudent(${student.id}, '${student.name}', ${student.age}, ${student.grade})">Editar</button>
                        <button onclick="deleteStudent(${student.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    })
}

function editStudent(id, name, age, grade) {
    document.getElementById("student-id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("grade").value = grade;
    document.getElementById("submit-btn").textContent = "Actualizar";
}

function deleteStudent(id) {
    if (confirm("¿Estás seguro de eliminar este estudiante?")) {
        fetch(`http://127.0.0.1:8000/students/${id}`, {
            method: "DELETE"
        }).then(response => response.json())
        .then(() => {
            alert("Estudiante eliminado");
            loadStudents();
        })
    }
}