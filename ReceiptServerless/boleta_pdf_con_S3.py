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


def crear_boleta(transaction_id, group_name, user_name, user_email, stock_symbol, stock_quantity,
                 stock_price):
    # Crear una instancia de BoletaPDF
    pdf = BoletaPDF()
    pdf.add_page()

    # Agregar contenido a la boleta
    pdf.chapter_title("Información de la Empresa:")
    pdf.chapter_body(f"Nombre de la Empresa: {group_name}\n\n")

    pdf.chapter_title("Información del Cliente:")
    pdf.chapter_body(f"Nombre del Cliente: {user_name}\n"
                     f"Correo Electrónico: {user_email}\n\n")

    pdf.chapter_title("Detalles de la Compra:")
    pdf.chapter_body("Stocks comprados:\n"
                     f"  - Nombre: {stock_symbol}\n"
                     f"  - Cantidad: {stock_quantity}\n"
                     f"  - Precio Total: {stock_price} CLP\n\n")

    # Crear un archivo temporal para el PDF
    pdf_file_name = f"boleta_{transaction_id}.pdf"

    # Guardar el PDF en el archivo temporal
    pdf.output("/tmp/" + pdf_file_name, 'F')

    # Devolver la URL del archivo en S3
    # pdf_url = f"https://{s3_bucket}.s3.amazonaws.com/{s3_key}"

    return pdf_file_name
