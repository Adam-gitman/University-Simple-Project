/**
 * CONFIGURACIÓN DE LA API
 */
const API_URL = import.meta.env.VITE_API_URL;

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadStudents();
    checkEditMode();
});

/**
 * Revisa si venimos de la lista con intención de editar un estudiante.
 */
function checkEditMode() {
    const studentToEdit = localStorage.getItem('editStudent');
    const formIdInput = document.getElementById("student-id");

    if (formIdInput && studentToEdit) {
        const student = JSON.parse(studentToEdit);

        document.getElementById("student-id").value = student.id;
        document.getElementById("name").value = student.name;
        document.getElementById("age").value = student.age;
        document.getElementById("grade").value = student.grade;

        document.getElementById("submit-btn").textContent = "Actualizar";
        document.querySelector('.h-form h3').textContent = "Editar Estudiante";

        // Limpiamos el localStorage para evitar que se cargue en la siguiente visita limpia
        localStorage.removeItem('editStudent');
    }
}

/**
 * Configura el listener del formulario para creación o actualización.
 */
function setupForm() {
    const form = document.getElementById('student-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Limpiamos el estado de la URL si es necesario
            history.replaceState(null, '', '/');
            saveStudents();
        });
    }
}

/**
 * Envía los datos a la API (POST para nuevos, PUT para existentes).
 */
function saveStudents() {
    const id = document.getElementById("student-id").value;
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const grade = parseFloat(document.getElementById("grade").value);

    const studentData = { name, age, grade };

    const method = id ? "PUT" : "POST";
    // Construimos la URL usando la constante API_URL de producción
    const url = id ? `${API_URL}/${id}` : `${API_URL}/`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { 
                throw new Error(err.detail || 'Error en la operación');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(id ? "Estudiante actualizado correctamente" : "Estudiante creado con éxito");
        
        if (id) {
            // Si editamos, regresamos a la lista de visualización
            window.location.href = "/view-list";
        } else {
            // Si creamos, reseteamos y recargamos la tabla (si existe en la página)
            document.getElementById("student-form").reset();
            loadStudents();
        }
    })
    .catch(error => alert(`Error: ${error.message}`));
}

/**
 * Carga la lista de estudiantes desde la API de Render.
 */
function loadStudents() {
    const tbody = document.getElementById('students-list');
    const template = document.getElementById('student-row-template');

    // Validación: solo ejecutar si los elementos existen en el HTML actual
    if (!tbody || !template) return;

    fetch(`${API_URL}/`)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo obtener la lista de estudiantes");
            return response.json();
        })
        .then(data => {
            tbody.innerHTML = '';

            data.forEach(student => {
                const clone = template.content.cloneNode(true);

                clone.querySelector('.col-id').textContent = student.id;
                clone.querySelector('.col-name').textContent = student.name;
                clone.querySelector('.col-age').textContent = student.age;
                clone.querySelector('.col-grade').textContent = student.grade.toFixed(1);

                // Lógica visual para el Badge de aprobado/reprobado
                const badge = clone.querySelector('.badge');
                if (badge) {
                    if (student.grade >= 3.0) {
                        badge.textContent = "Aprobado";
                        badge.classList.add('badge-essential'); 
                    } else {
                        badge.textContent = "Reprobado";
                        badge.classList.add('badge-extraordinary'); 
                    }
                }

                // Configuración de botones de acción
                const btnEdit = clone.querySelector('.btn-edit');
                if (btnEdit) {
                    btnEdit.onclick = () => {
                        localStorage.setItem('editStudent', JSON.stringify(student));
                        window.location.href = "/form/edit/";
                    };
                }

                const btnDelete = clone.querySelector('.btn-delete');
                if (btnDelete) {
                    btnDelete.onclick = () => deleteStudent(student.id, student.name);
                }

                tbody.appendChild(clone);
            });
        })
        .catch(error => console.error("Error en loadStudents:", error));
}

/**
 * Elimina un estudiante por su ID.
 */
function deleteStudent(id, name) {
    if (confirm(`¿Estás seguro de eliminar al estudiante "${name}"?`)) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                alert("Estudiante eliminado");
                loadStudents();
            } else {
                alert("Error al intentar eliminar");
            }
        })
        .catch(error => console.error("Error en deleteStudent:", error));
    }
}

/**
 * Gestión del botón cancelar.
 */
const btnCancel = document.querySelector('.btn-cancel');
if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        if (confirm("¿Deseas limpiar el formulario y cancelar la operación?")) {
            const form = document.getElementById('student-form');
            if (form) form.reset();
            // Si estamos en modo edición, lo mejor es volver a la lista
            if (document.getElementById("student-id").value) {
                window.location.href = "/view-list";
            }
        }
    });
}