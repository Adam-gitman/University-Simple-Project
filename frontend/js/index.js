const API_URL = "http://127.0.0.1:8000/students";

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadStudents();
    checkEditMode();
});

function checkEditMode() {
    const studentToEdit = localStorage.getItem('editStudent');
    const formIdInput = document.getElementById("student-id");

    // Si existe el input del ID (estamos en la página del formulario) y hay datos en localStorage
    if (formIdInput && studentToEdit) {
        const student = JSON.parse(studentToEdit);

        // Llenamos los campos
        document.getElementById("student-id").value = student.id;
        document.getElementById("name").value = student.name;
        document.getElementById("age").value = student.age;
        document.getElementById("grade").value = student.grade;

        document.getElementById("submit-btn").textContent = "Actualizar";
        document.querySelector('.h-form h3').textContent = "Editar Estudiante";

        // Limpiamos el localStorage para que no se quede "pegado" en futuras visitas
        localStorage.removeItem('editStudent');
    }
}

function setupForm() {
    const form = document.getElementById('student-form');
    // Solo agregar el evento si el formulario existe en esta página
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            history.replaceState(null, '', '/');
            saveStudents();
        });
    }
}

function saveStudents() {
    const id = document.getElementById("student-id").value;
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const grade = parseFloat(document.getElementById("grade").value);

    const studentData = { name, age, grade };

    const method = id ? "PUT" : "POST";
    const url = id ? `http://127.0.0.1:8000/students/${id}` : `http://127.0.0.1:8000/students/`;
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || 'Error en la operación') })
        }
        return response.json()
    }).then(data => {
        alert(id ? "Estudiante actualizado" : "Estudiante creado");
        // Si estamos editando, regresamos a la lista después de la alerta
        if (id) {
            window.location.href = "/view-list";
        } else {
            document.getElementById("student-form").reset();
            loadStudents();
        }
    })
}

function loadStudents() {
    // 1. Referenciamos los elementos del DOM
    const tbody = document.getElementById('students-list');
    const template = document.getElementById('student-row-template');

    // 2. VALIDACIÓN: Si los elementos no existen en esta página, 
    // detenemos la ejecución para evitar errores de "null" en consola.
    if (!tbody || !template) {
        console.log("Tabla o template no encontrados. Saltando carga de estudiantes.");
        return;
    }

    // 3. Petición a la API
    fetch(`http://127.0.0.1:8000/students/`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener estudiantes");
            return response.json();
        })
        .then(data => {
            // 4. Limpiamos el contenido previo de la tabla
            tbody.innerHTML = '';

            // 5. Iteramos sobre cada estudiante recibido
            data.forEach(student => {
                // Clonamos el contenido del template (el "molde" HTML)
                const clone = template.content.cloneNode(true);

                // Rellenamos los datos básicos usando textContent por seguridad
                clone.querySelector('.col-id').textContent = student.id;
                clone.querySelector('.col-name').textContent = student.name;
                clone.querySelector('.col-age').textContent = student.age;
                clone.querySelector('.col-grade').textContent = student.grade.toFixed(1);

                // 6. LÓGICA DE BADGE: Aplicamos clases según la nota
                const badge = clone.querySelector('.badge');
                if (badge) {
                    if (student.grade >= 3.0) {
                        badge.textContent = "Aprobado";
                        badge.classList.add('badge-essential'); // Clase para nota >= 3.0
                    } else {
                        badge.textContent = "Reprobado";
                        badge.classList.add('badge-extraordinary'); // Clase para nota < 3.0
                    }
                }

                // 7. EVENTOS DE ACCIÓN:
                const btnEdit = clone.querySelector('.btn-edit');
                if (btnEdit) {
                    btnEdit.onclick = () => {
                        // Guardamos los datos en localStorage para que la página del formulario los lea
                        localStorage.setItem('editStudent', JSON.stringify(student));
                        // Redirigimos a la página del formulario
                        window.location.href = "/form/edit/";
                    };
                }

                const btnDelete = clone.querySelector('.btn-delete');
                if (btnDelete) {
                    // Pasamos también el nombre para la alerta personalizada
                    btnDelete.onclick = () => deleteStudent(student.id, student.name);
                }

                // 8. Insertamos el clon ya relleno en el cuerpo de la tabla
                tbody.appendChild(clone);
            });
        })
        .catch(error => console.error("Error en loadStudents:", error));
}

function deleteStudent(id, name) {
    // Alerta personalizada con el nombre "x"
    if (confirm(`¿Estás seguro de eliminar al estudiante "${name}" de la lista?`)) {
        fetch(`http://127.0.0.1:8000/students/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                alert("Estudiante eliminado correctamente");
                loadStudents(); // Recargar la tabla
            } else {
                alert("No se pudo eliminar al estudiante");
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

const btnCancel = document.querySelector('.btn-cancel');
// Verificar que el botón exista antes de usarlo
if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        if (confirm("¿Estás seguro de que quieres cancelar?")) {
            const form = document.getElementById('student-form');
            if (form) form.reset();
        }
    });
}

