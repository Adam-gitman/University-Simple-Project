const API_URL = "http://localhost:8000/students";

document.addEventListener('DOMContentLoaded', () =>{
    setupForm();
})

// Funcionalidad para el botón de cancelar
document.querySelector('.btn-cancel').addEventListener('click', () => {
    if(confirm("¿Estás seguro de que quieres cancelar?")) {
        document.getElementById('student-form').reset();
    }
});

function setupForm() {
    const form = document.getElementById('student-form');
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        saveStudents();
        console.log("Formulario enviado con éxito");
        alert("¡Datos guardados correctamente!");
    })
}

function saveStudents() {
    const id = document.getElementById("student-id").value;
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const grade = parseFloat(document.getElementById("grade").value);

    const studentData = {name, age, grade};

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json' //MIME
        },
        body: JSON.stringify(studentData)
    }).then( response => {
        if (!response.ok){
            return response.json().then(err => {throw new Error(err.detail || 'Error en la operación')})
        }
        return response.json()
    }).then(data =>{
        alert("Estudiante creado")
    })

}
