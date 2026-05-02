import os
import random
import smtplib
from pathlib import Path
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / '.env.local' 

load_dotenv(dotenv_path=env_path)

EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))

otp_storage = {}

class AuthController:

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(email: str):
        if not EMAIL_SENDER or not EMAIL_PASSWORD:
            return {
                "success": False, 
                "message": f"Error interno: Variables no cargadas. Buscando en: {env_path}"
            }

        otp = AuthController.generate_otp()
        otp_storage[email] = otp

        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = email
        msg["Subject"] = "Código de verificación"

        body = f"Tu código de verificación es: {otp}"
        msg.attach(MIMEText(body, "plain"))

        try:
            # Cambiamos SMTP_SSL por SMTP estándar para el puerto 587
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()  # <--- CRITICO: Inicia el cifrado TLS
                server.login(EMAIL_SENDER, EMAIL_PASSWORD)
                server.sendmail(EMAIL_SENDER, email, msg.as_string())
            return {"success": True, "message": "Código enviado al correo"}
        except Exception as e:
            print(f"Error SMTP: {e}")
            return {"success": False, "message": f"No se pudo enviar el correo: {str(e)}"}

    @staticmethod
    def verify_otp(email: str, otp: str):
        if email not in otp_storage:
            return {"valid": False, "message": "Correo no encontrado"}
        
        if otp_storage[email] == otp:
            del otp_storage[email]
            return {"valid": True, "message": "Código correcto"}
        
        return {"valid": False, "message": "Código incorrecto"}