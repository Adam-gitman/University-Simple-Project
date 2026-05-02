document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("auth-form");
    const inputs = document.querySelectorAll('.otp-field');
    const timerDisplay = document.getElementById("timer");
    
    let timeLeft = 300; // 5 minutos en segundos
    let timerExpired = false;

    // --- LÓGICA DEL TEMPORIZADOR ---
    const startTimer = () => {
        const countdown = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerExpired = true;
                timerDisplay.textContent = "EXPIRADO";
                timerDisplay.style.color = "red";
                alert("El tiempo ha expirado. Por favor, solicita un nuevo código.");
            }
            timeLeft--;
        }, 1000);
    };

    startTimer();

    // --- LÓGICA DE ENTRADA Y SALTO ---
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // Validar que solo sean números
            e.target.value = e.target.value.replace(/[^0-9]/g, '');

            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // --- LÓGICA DE ENVÍO ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (timerExpired) {
            alert("Este código ya no es válido por tiempo expirado.");
            return;
        }

        let otpValue = "";
        inputs.forEach(input => otpValue += input.value);

        if (otpValue.length < 6) {
            alert("Por favor, completa los 6 dígitos.");
            return;
        }

        const email = localStorage.getItem("email");

        try {
            const response = await fetch("/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpValue })
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                // ÉXITO: Redirigir al formulario de estudiantes
                alert("Código correcto ✅");
                
                // IMPORTANTE: No borres el email si lo necesitas para el formulario, 
                // o usa una sesión/token de acceso aquí.
                window.location.href = "/form/edit/"; 
            } else {
                // ERROR: Código incorrecto
                alert("❌ Código incorrecto. Inténtalo de nuevo.");
                // Limpiar inputs para reintentar
                inputs.forEach(input => input.value = "");
                inputs[0].focus();
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        }
    });
});