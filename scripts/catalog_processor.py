import os
import sys
import json
import pymupdf

folder = r"C:\Users\juane\OneDrive\Desktop\Simulador ICFES\Archivos utiles"
files = [f for f in os.listdir(folder) if f.endswith(".pdf")]

catalog = []

for f in sorted(files):
    p = os.path.join(folder, f)
    try:
        doc = pymupdf.open(p)
        total_pages = len(doc)
        text_samples = []
        for i in range(min(5, total_pages)):
            text_samples.append(doc[i].get_text("text"))
        full_sample = " ".join(text_samples).replace("\n", " ").lower()
        
        # Categorize exam
        exam_type = "SABER_11" if ("saber 11" in full_sample or "saber-11" in f.lower() or "1528" in f) else "SABER_PRO"
        
        is_guide = "guia" in f.lower() or "guía" in full_sample[:300] or "orientacion" in f.lower()
        is_booklet = "cuadernillo" in f.lower() or "banco" in f.lower() or "preguntas" in full_sample[:300]
        
        # Determine Area / Subject
        name_lower = f.lower() + " " + full_sample[:600]
        area = "GENERAL"
        if "matematica" in name_lower or "razonamiento cuantitativo" in name_lower:
            area = "MATEMATICAS_O_RAZONAMIENTO_CUANTITATIVO"
        elif "lectura cr" in name_lower or "lectura-critica" in name_lower or "comunicaci" in name_lower:
            area = "LECTURA_CRITICA_Y_COMUNICACION"
        elif "ciencias naturales" in name_lower or "biologia" in name_lower or "fisica" in name_lower or "quimica" in name_lower:
            area = "CIENCIAS_NATURALES"
        elif "sociales" in name_lower or "ciudadanas" in name_lower:
            area = "SOCIALES_Y_CIUDADANAS"
        elif "ingles" in name_lower or "ingls" in name_lower:
            area = "INGLES"
        elif "software" in name_lower:
            area = "ESPECIFICO_DISENO_SOFTWARE"
        elif "proyectos" in name_lower or "ingenieria" in name_lower or "mecanicos" in name_lower or "infraestructura" in name_lower or "procesos industriales" in name_lower:
            area = "ESPECIFICO_INGENIERIA"
        elif "salud" in name_lower or "medico" in name_lower or "enfermeria" in name_lower or "oral" in name_lower:
            area = "ESPECIFICO_SALUD"
        elif "educacion" in name_lower or "ensenar" in name_lower or "evaluar" in name_lower or "formar" in name_lower:
            area = "ESPECIFICO_EDUCACION"
        elif "organizacion" in name_lower or "financiera" in name_lower or "contable" in name_lower or "economico" in name_lower:
            area = "ESPECIFICO_CIENCIAS_ECONOMICAS"
        elif "juridica" in name_lower or "derecho" in name_lower:
            area = "ESPECIFICO_JURIDICO"
        elif "psicologicas" in name_lower:
            area = "ESPECIFICO_PSICOLOGIA"
        elif "agricola" in name_lower or "pecuaria" in name_lower or "agroindustriales" in name_lower or "animal" in name_lower:
            area = "ESPECIFICO_AGROPECUARIO"
        elif "arquitectura" in name_lower or "estudio-proyectual" in name_lower:
            area = "ESPECIFICO_ARQUITECTURA"
        else:
            area = "ESPECIFICO_OTRO"
            
        doc.close()
        catalog.append({
            "filename": f,
            "path": p,
            "pages": total_pages,
            "exam_type": exam_type,
            "area": area,
            "is_guide": is_guide,
            "is_booklet": is_booklet,
            "size_bytes": os.path.getsize(p)
        })
    except Exception as e:
        catalog.append({"filename": f, "error": str(e)})

output_path = r"C:\Users\juane\OneDrive\Desktop\Simulador ICFES\catalog_archivos_utiles.json"
with open(output_path, "w", encoding="utf-8") as out:
    json.dump(catalog, out, indent=2, ensure_ascii=False)

print(f"EXITO: Procesados {len(catalog)} archivos.")
summary = {}
for item in catalog:
    k = f"{item.get('exam_type', 'UNK')} - {item.get('area', 'UNK')}"
    summary[k] = summary.get(k, 0) + 1

for k, v in sorted(summary.items()):
    print(f"  {k}: {v} archivos")
