import os
import random
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Cargar variables desde el archivo .env
load_dotenv()

# Configuración de credenciales protegidas
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Almacenamiento temporal de OTP (En producción se recomienda Redis o una DB)
otp_storage = {}

class AuthController:

    @staticmethod
    def generate_otp():
        """Genera un código numérico de 6 dígitos."""
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(email: str):
        """Genera un OTP, lo almacena y lo envía por correo electrónico."""
        try:
            otp = AuthController.generate_otp()
            otp_storage[email] = otp

            # Configuración del mensaje
            msg = MIMEMultipart()
            msg["From"] = EMAIL_SENDER
            msg["To"] = email
            msg["Subject"] = "Tu Código de Verificación"

            body = f"""
            <html>
                <body>
                    <h2 style="color: #333;">Verificación de Identidad</h2>
                    <p>Has solicitado un código de acceso para el sistema de Gestión de Estudiantes.</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                        {otp}
                    </div>
                    <p>Este código expirará en 5 minutos.</p>
                    <p style="font-size: 12px; color: #888;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
                </body>
            </html>
            """
            msg.attach(MIMEText(body, "html"))

            # Envío mediante Servidor SMTP de Gmail (SSL)
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(EMAIL_SENDER, EMAIL_PASSWORD)
                server.sendmail(EMAIL_SENDER, email, msg.as_string())

            return {"success": True, "message": "Código enviado exitosamente"}

        except Exception as e:
            print(f"Error enviando email: {e}")
            return {"success": False, "message": "No se pudo enviar el código"}

    @staticmethod
    def verify_otp(email: str, otp: str):
        """Valida el código ingresado por el usuario."""
        if email not in otp_storage:
            return {"valid": False, "message": "No hay un código pendiente para este correo"}
        
        # Validación del código
        if otp_storage[email] == otp:
            # Eliminar código tras uso exitoso (seguridad)
            del otp_storage[email]
            return {"valid": True, "message": "Código correcto"}
        
        return {"valid": False, "message": "Código incorrecto"}