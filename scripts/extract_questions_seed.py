import os
import sys
import re
import json
import pymupdf

sys.stdout.reconfigure(encoding="utf-8")

# Let's inspect the exact layout of questions in 02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf
pdf_path = r"C:\Users\juane\OneDrive\Desktop\Simulador ICFES\Archivos utiles\02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf"
doc = pymupdf.open(pdf_path)

# Extract answers from page 15 and 16
answers = {}
for p_idx in [14, 15]:
    text = doc[p_idx].get_text("text")
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for i, line in enumerate(lines):
        if line.isdigit() and int(line) <= 50:
            q_num = int(line)
            # Find next letter A, B, C, D in subsequent lines
            for next_line in lines[i+1:i+10]:
                if next_line in ["A", "B", "C", "D"]:
                    answers[q_num] = next_line
                    break

print(f"Respuestas extraidas para Cuadernillo Raz. Cuantitativo Saber Pro: {len(answers)}")
print(answers)
