from pathlib import Path
from io import BytesIO
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, ArrayObject
from reportlab.pdfgen import canvas
import pypdfium2 as pdfium
src=Path(r'C:\Users\avane\Downloads\R Avaneesh_Resume.pdf')
out=Path('output/pdf/R Avaneesh_Resume_Updated.pdf')
r=PdfReader(src)
p=r.pages[0]
s=ContentStream(p.get_contents(),r)
# Retain company names and remove the old location/date text from the actual stream.
for idx,cut in [(103,4),(163,13)]:
    a,op=s.operations[idx]
    arr=a[0]
    # Locate the large horizontal gap separating company from right-aligned details.
    stop=next(i for i,x in enumerate(arr) if isinstance(x,(int,float)) and x < -1000)
    a[0]=ArrayObject(arr[:stop])
p.replace_contents(s)
b=BytesIO()
c=canvas.Canvas(b,pagesize=(612,792))
c.setFont('Times-Italic',9.9626)
c.drawRightString(573.76,683.67,'Chennai   Jun 22, 2026 - Present')
c.drawRightString(573.76,599.183,'Bengaluru & Chennai   Sep 2023 - Jun 19, 2026')
c.save()
p.merge_page(PdfReader(b).pages[0])
w=PdfWriter(); w.append(r); w.write(out)
check=PdfReader(out); t=check.pages[0].extract_text()
assert 'Jun 22, 2026 - Present' in t and 'Jun 19, 2026' in t
assert len(check.pages)==1
pdf=pdfium.PdfDocument(str(out)); pdf[0].render(scale=1.6).to_pil().save('tmp/pdfs/updated.png')
print(out.resolve())
