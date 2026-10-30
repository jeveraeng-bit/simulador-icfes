import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

with open("catalog_archivos_utiles.json", encoding="utf-8") as f:
    data = json.load(f)

print("=== ARCHIVOS SABER 11 ===")
for item in data:
    if item["exam_type"] == "SABER_11":
        print(f"  [{item['area']}] {item['filename']} ({item['pages']} pags)")

print("\n=== ARCHIVOS SABER PRO (GENERICOS Y BANCOS) ===")
for item in data:
    if item["exam_type"] == "SABER_PRO" and not item["area"].startswith("ESPECIFICO_"):
        print(f"  [{item['area']}] {item['filename']} ({item['pages']} pags)")

print("\n=== ARCHIVOS SABER PRO (MODULOS ESPECIFICOS) ===")
for item in data:
    if item["exam_type"] == "SABER_PRO" and item["area"].startswith("ESPECIFICO_"):
        print(f"  [{item['area']}] {item['filename']} ({item['pages']} pags)")

