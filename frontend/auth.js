document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("auth-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // evitar recarga

        const otp = document.getElementById("otp").value;

        
        const email = localStorage.getItem("email");

        if (!email) {
            alert("No se encontró el correo. Vuelve al login.");
            window.location.href = "/";
            return;
        }

        try {
            const response = await fetch("/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp
                })
            });

            const data = await response.json();

            if (data.valid) {
                alert("Código correcto ✅");

                // limpiar email guardado
                localStorage.removeItem("email");

                // redirigir
                window.location.href = "/index.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Error en la verificación");
        }
    });
});