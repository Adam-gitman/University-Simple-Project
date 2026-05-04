import os
import resend
import random
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables
base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / '.env.local'
load_dotenv(dotenv_path=env_path)

# Configurar Resend
resend.api_key = os.getenv("RESEND_API_KEY")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")

otp_storage = {}

class AuthController:

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(email: str):
        try:
            otp = AuthController.generate_otp()
            otp_storage[email] = otp

            # Enviar usando la librería de Resend
            params = {
                "from": f"Verificación <{EMAIL_SENDER}>",
                "to": [email],
                "subject": "Tu Código de Verificación",
                "html": f"""
                <div style="font-family: sans-serif; text-align: center;">
                    <h2>Código de Acceso</h2>
                    <p style="font-size: 24px; font-weight: bold; color: #4F46E5;">{otp}</p>
                    <p>Este código expirará en 5 minutos.</p>
                </div>
                """,
            }

            resend.Emails.send(params)
            print(f"✅ OTP enviado a {email} vía Resend")
            return {"success": True, "message": "Código enviado"}

        except Exception as e:
            print(f"❌ Error con Resend: {e}")
            return {"success": False, "message": "Fallo al enviar correo"}

    @staticmethod
    def verify_otp(email: str, otp: str):
        if email in otp_storage and otp_storage[email] == otp:
            del otp_storage[email]
            return {"valid": True, "message": "Correcto"}
        return {"valid": False, "message": "Incorrecto"}