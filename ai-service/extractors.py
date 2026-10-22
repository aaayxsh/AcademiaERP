import io
import re
from typing import Tuple, Optional

def clean_extracted_text(text: str) -> str:
    """Normalize whitespace and remove non-printable characters."""
    if not text:
        return ""
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, Optional[str]]:
    """Extract text from PDF bytes using pypdf with fallback."""
    try:
        from pypdf import PdfReader
        stream = io.BytesIO(file_bytes)
        reader = PdfReader(stream)
        
        extracted_pages = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            extracted_pages.append(page_text)
            
        full_text = clean_extracted_text("\n".join(extracted_pages))
        if not full_text:
            return "", "Document appears to be scanned or contains only images (no extractable text)."
        return full_text, None
    except Exception as e:
        return "", f"PDF parsing error: {str(e)}"

def extract_text_from_docx(file_bytes: bytes) -> Tuple[str, Optional[str]]:
    """Extract text from DOCX bytes using python-docx with zipfile fallback."""
    try:
        import docx
        stream = io.BytesIO(file_bytes)
        doc = docx.Document(stream)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        for table in doc.tables:
            for row in table.rows:
                paragraphs.extend([cell.text.strip() for cell in row.cells if cell.text.strip()])
        full_text = clean_extracted_text("\n".join(paragraphs))
        if not full_text:
            return "", "DOCX file contains no extractable paragraphs."
        return full_text, None
    except Exception:
        # Fallback using zipfile and xml parsing if python-docx is not installed
        try:
            import zipfile
            import xml.etree.ElementTree as ET
            stream = io.BytesIO(file_bytes)
            with zipfile.ZipFile(stream) as z:
                xml_content = z.read('word/document.xml')
                tree = ET.fromstring(xml_content)
                namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                texts = [node.text for node in tree.findall('.//w:t', namespaces) if node.text]
                full_text = clean_extracted_text(" ".join(texts))
                if not full_text:
                    return "", "DOCX document empty."
                return full_text, None
        except Exception as e:
            return "", f"DOCX parsing error: {str(e)}"
