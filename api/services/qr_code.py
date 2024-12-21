import uuid
import qrcode


def generate_qr_codes(data: str):
    name = data.strip()
    qr = qrcode.QRCode(border=1, error_correction=qrcode.constants.ERROR_CORRECT_H)
    qr.add_data(name)
    qr.make(fit=True)
    qrcode_image = qr.make_image(fill_color="black", back_color="white")
    filename = f"{uuid.uuid4()}.png"
    qrcode_image.save(f"assets/images/{filename}")
    return filename
