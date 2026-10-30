import os
import sys
import re
import json
import pymupdf

sys.stdout.reconfigure(encoding="utf-8")

folder = r"C:\Users\juane\OneDrive\Desktop\Simulador ICFES\Archivos utiles"
files = [f for f in sorted(os.listdir(folder)) if f.endswith(".pdf")]

results = []

print(f"Iniciando procesamiento de los {len(files)} documentos...")

for idx, filename in enumerate(files, start=1):
    filepath = os.path.join(folder, filename)
    doc_info = {
        "index": idx,
        "filename": filename,
        "filepath": filepath,
        "pages": 0,
        "exam": "DESCONOCIDO",
        "module_or_area": "GENERAL",
        "doc_type": "OTRO",
        "competencies_found": [],
        "sample_questions_count": 0,
        "extracted_summary": "",
        "key_topics": []
    }
    
    try:
        doc = pymupdf.open(filepath)
        doc_info["pages"] = len(doc)
        
        # Extract all text from up to first 10 pages and last 3 pages
        head_text = ""
        for p in range(min(10, len(doc))):
            head_text += doc[p].get_text("text") + "\n"
            
        tail_text = ""
        if len(doc) > 10:
            for p in range(max(10, len(doc) - 4), len(doc)):
                tail_text += doc[p].get_text("text") + "\n"
        
        full_text_sample = (head_text + "\n" + tail_text).lower()
        
        # 1. Detect Exam Type
        if "saber 11" in full_text_sample or "saber 11.°" in full_text_sample or "saber-11" in filename.lower() or "1528" in filename:
            doc_info["exam"] = "SABER_11"
        elif "saber pro" in full_text_sample or "saber-pro" in filename.lower() or "saber_pro" in filename.lower():
            doc_info["exam"] = "SABER_PRO"
        elif "saber tyt" in full_text_sample:
            doc_info["exam"] = "SABER_TYT"
        else:
            doc_info["exam"] = "SABER_PRO" # Default for university modules
            
        # 2. Detect Document Type
        if "guia" in filename.lower() or "guía" in head_text.lower() or "orientación" in head_text.lower() or "orientacion" in filename.lower():
            doc_info["doc_type"] = "GUIA_DE_ORIENTACION"
        elif "cuadernillo" in filename.lower() or "preguntas" in filename.lower() or "cuadernillo" in head_text.lower():
            doc_info["doc_type"] = "CUADERNILLO_DE_PREGUNTAS"
        elif "banco" in filename.lower():
            doc_info["doc_type"] = "BANCO_DE_PREGUNTAS"
        else:
            doc_info["doc_type"] = "GUIA_O_CUADERNILLO"

        # 3. Detect Module or Area
        f_clean = filename.lower()
        if "matem" in f_clean or "cuantitativo" in f_clean or "1528147638" in f_clean:
            doc_info["module_or_area"] = "Matemáticas / Razonamiento Cuantitativo"
        elif "lectura" in f_clean or "critica" in f_clean or "comunicaci" in f_clean or "1528121873" in f_clean:
            doc_info["module_or_area"] = "Lectura Crítica / Comunicación Escrita"
        elif "naturales" in f_clean or "biologia" in f_clean or "1528121774" in f_clean:
            doc_info["module_or_area"] = "Ciencias Naturales - Biología"
        elif "fisica" in f_clean or "1528121851" in f_clean:
            doc_info["module_or_area"] = "Ciencias Naturales - Física"
        elif "quimica" in f_clean or "1528147675" in f_clean:
            doc_info["module_or_area"] = "Ciencias Naturales - Química"
        elif "sociales" in f_clean or "ciudadanas" in f_clean or "1528121817" in f_clean:
            doc_info["module_or_area"] = "Sociales y Ciudadanas"
        elif "ingles" in f_clean or "ingls" in f_clean or "1528147590" in f_clean:
            doc_info["module_or_area"] = "Inglés"
        elif "software" in f_clean:
            doc_info["module_or_area"] = "Diseño de Software (Saber Pro Específico)"
        elif "infraestructura" in f_clean:
            doc_info["module_or_area"] = "Diseño de Obras de Infraestructura (Saber Pro Específico)"
        elif "procesos-industriales" in f_clean:
            doc_info["module_or_area"] = "Diseño de Procesos Industriales (Saber Pro Específico)"
        elif "sistemas-de-control" in f_clean:
            doc_info["module_or_area"] = "Diseño de Sistemas de Control (Saber Pro Específico)"
        elif "sistemas-mecanicos" in f_clean:
            doc_info["module_or_area"] = "Diseño de Sistemas Mecánicos (Saber Pro Específico)"
        elif "productivos-y-logisticos" in f_clean:
            doc_info["module_or_area"] = "Sistemas Productivos y Logísticos (Saber Pro Específico)"
        elif "manejo-de-ia" in f_clean or "manejo de ia" in head_text.lower():
            doc_info["module_or_area"] = "Sistemas de Manejo de Información y Automatización"
        elif "formulacion-de-proyectos" in f_clean or "feg-de-proyectos" in f_clean:
            doc_info["module_or_area"] = "Formulación y Evaluación de Proyectos de Ingeniería"
        elif "gestion-de-organizaciones" in f_clean:
            doc_info["module_or_area"] = "Gestión de Organizaciones (Saber Pro Específico)"
        elif "gestion-financiera" in f_clean:
            doc_info["module_or_area"] = "Gestión Financiera (Saber Pro Específico)"
        elif "contable" in f_clean:
            doc_info["module_or_area"] = "Información y Control Contable (Saber Pro Específico)"
        elif "economico" in f_clean:
            doc_info["module_or_area"] = "Análisis Económico (Saber Pro Específico)"
        elif "juridica" in f_clean or "conflicto" in f_clean:
            doc_info["module_or_area"] = "Ciencias Jurídicas y Gestión del Conflicto"
        elif "ensenar" in f_clean or "evaluar" in f_clean or "formar" in f_clean:
            doc_info["module_or_area"] = "Educación y Pedagogía (Enseñar / Evaluar / Formar)"
        elif "salud" in f_clean or "medico" in f_clean or "enfermeria" in f_clean or "oral" in f_clean or "enfermedad" in f_clean:
            doc_info["module_or_area"] = "Ciencias de la Salud (Medicina, Odontología, Enfermería)"
        elif "agricola" in f_clean or "pecuaria" in f_clean or "animal" in f_clean:
            doc_info["module_or_area"] = "Ciencias Agropecuarias y Medicina Veterinaria"
        elif "arquitectura" in f_clean or "estudio-proyectual" in f_clean or "artefactos" in f_clean:
            doc_info["module_or_area"] = "Arquitectura, Urbanismo y Diseño proyectual"
        elif "psicologicas" in f_clean or "procesos-sociales" in f_clean:
            doc_info["module_or_area"] = "Psicología e Intervención Social"
        elif "pensamiento-cientifico" in f_clean:
            doc_info["module_or_area"] = "Pensamiento Científico (Saber Pro)"
        else:
            # Fallback parsing first lines
            first_lines = [l.strip() for l in head_text.split("\n") if len(l.strip()) > 4][:5]
            doc_info["module_or_area"] = " / ".join(first_lines[:2])

        # 4. Extract Competencies mentioned
        competencies = set()
        matches = re.findall(r"(?:competencia|afirmación|afirmacion)[:\s]+([^\n\r\.\;]{10,80})", head_text + tail_text, re.IGNORECASE)
        for m in matches:
            cleaned = m.strip()
            if len(cleaned) > 8 and not any(ch in cleaned for ch in ["icfes", "página", "cuadernillo"]):
                competencies.add(cleaned)
        doc_info["competencies_found"] = list(competencies)[:5]

        # 5. Count sample questions
        q_matches = re.findall(r"(?:pregunta|posición|posicion)\s+(\d{1,3})", head_text + tail_text, re.IGNORECASE)
        if q_matches:
            nums = [int(n) for n in q_matches if int(n) <= 150]
            if nums:
                doc_info["sample_questions_count"] = max(nums)
        else:
            # Alternate search for options patterns (A. B. C. D.)
            opt_matches = len(re.findall(r"\bA\.\s+[^\n]+", head_text + tail_text))
            doc_info["sample_questions_count"] = opt_matches

        # Extract brief description
        paragraphs = [p.strip().replace("\n", " ") for p in head_text.split("\n\n") if len(p.strip()) > 60]
        if paragraphs:
            doc_info["extracted_summary"] = paragraphs[0][:250] + "..."
            
        doc.close()
        results.append(doc_info)
        print(f"[{idx:02d}/58] OK: {doc_info['exam']} - {doc_info['module_or_area']} ({doc_info['pages']} pags)")
        
    except Exception as e:
        doc_info["error"] = str(e)
        results.append(doc_info)
        print(f"[{idx:02d}/58] ERROR {filename}: {e}")

output_file = r"C:\Users\juane\OneDrive\Desktop\Simulador ICFES\guias_y_bancos_procesados.json"
with open(output_file, "w", encoding="utf-8") as f_out:
    json.dump(results, f_out, indent=2, ensure_ascii=False)

print(f"\nProcesamiento finalizado con exito. Archivo generado en: {output_file}")
