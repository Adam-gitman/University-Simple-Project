import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_SENDER = "kylerunner45@gmail.com"
EMAIL_PASSWORD = "plyjudmthculkqbx"

otp_storage = {}

class AuthController:

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_otp(email: str):
        otp = AuthController.generate_otp()
        otp_storage[email] = otp

        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = email
        msg["Subject"] = "Código de verificación"

        body = f"Tu código de verificación es: {otp}"
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email, msg.as_string())

        return {"message": "Código enviado al correo"}

    @staticmethod
    def verify_otp(email: str, otp: str):
        if email not in otp_storage:
            return {"valid": False, "message": "Correo no encontrado"}
        
        if otp_storage[email] == otp:
            del otp_storage[email]
            return {"valid": True, "message": "Código correcto"}
        
        return {"valid": False, "message": "Código incorrecto"}