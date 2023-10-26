import os
import tempfile
import boto3
from fpdf import FPDF


# Clase personalizada que hereda de FPDF para crear una boleta
class BoletaPDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Boleta de Compra", 0, 1, "C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", 0, 0, "C")

    def chapter_title(self, title):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, title, 0, 1, "L")
        self.ln(4)

    def chapter_body(self, body):
        self.set_font("Arial", size=12)
        self.multi_cell(0, 10, body)
        self.ln()


def crear_boleta(group_name, user_name, user_email, stock_symbol, stock_quantity, stock_price):
    # Inicializar el cliente de S3
    s3 = boto3.client('s3')

    # Crear una instancia de BoletaPDF
    pdf = BoletaPDF()
    pdf.add_page()

    # Agregar contenido a la boleta
    pdf.chapter_title("Información de la Empresa:")
    pdf.chapter_body("Nombre de la Empresa: Mi Empresa\n\n")

    pdf.chapter_title("Información del Cliente:")
    pdf.chapter_body("Nombre del Cliente: Juan Pérez\n"
                     "Correo Electrónico: juan@example.com\n\n")

    pdf.chapter_title("Detalles de la Compra:")
    pdf.chapter_body("Producto 1:\n"
                     "  - Nombre: Producto A\n"
                     "  - Cantidad: 2\n"
                     "  - Precio Unitario: $10.00\n\n"
                     "Producto 2:\n"
                     "  - Nombre: Producto B\n"
                     "  - Cantidad: 1\n"
                     "  - Precio Unitario: $15.00\n\n")

    # Crear un archivo temporal para el PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False)

    # Guardar el PDF en el archivo temporal
    pdf.output(temp_file)

    # Nombre del archivo PDF en S3
    s3_bucket = 'tu-bucket-s3'
    s3_key = 'ruta/del/archivo/boleta.pdf'

    # Subir el archivo PDF a S3
    s3.upload_file(temp_file.name, s3_bucket, s3_key)

    # Devolver la URL del archivo en S3
    pdf_url = f"https://{s3_bucket}.s3.amazonaws.com/{s3_key}"
    return pdf_url
