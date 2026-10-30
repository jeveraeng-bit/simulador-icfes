# Simulador ICFES — Saber 11.° y Saber Pro
> **Plataforma Psicométrica Digital de Alta Fidelidad para Pruebas de Estado en Colombia**  
> Diseñada bajo el **Modelo Basado en Evidencias (MBE)** y la **Teoría de Respuesta al Ítem (TRI - Modelo 3PL)**.

---

## Autor y Desarrollador Principal

* **Autor:** Juan Esteban Vera Rodríguez
* **Perfil:** Estudiante de Ingeniería Electrónica
* **Institución:** Universidad Antonio Nariño (UAN) — Sede Ibagué
* **Ubicación:** Ibagué, Tolima, Colombia

---

## 1. Descripción del Proyecto

Este proyecto nace como una solución de ingeniería de software e innovación educativa orientada a resolver dos problemas estructurales de la educación en Colombia:

1. **Brecha de preparación y entrenamiento de calidad:** Proveer a los estudiantes de educación media (grado 11) y pregrado universitario (Saber Pro) una plataforma gratuita y escalable que emula con fidelidad matemática y psicométrica los exámenes censales del ICFES, integrando un **Tutor Socrático impulsado por Inteligencia Artificial**.
2. **Impacto ambiental y logística en papel:** Brindar a colegios y universidades el módulo institucional **"Cero Papel"** para aplicar simulacros completos en salas de cómputo, eliminando el gasto de cartillas físicas y hojas ópticas de respuesta, con actas y calificación inmediata por salón.

---

## 2. Marco Normativo y Metodología Psicométrica

La plataforma se fundamenta en los lineamientos del **Ministerio de Educación Nacional (MEN)** y el **ICFES**:
* **Ley 1324 de 2009**: Parámetros del Sistema Nacional de Evaluación de la Educación.
* **Decreto 1075 de 2015**: Reglamentación de las pruebas de Estado en Colombia.
* **Evidence-Centered Design (ECD / MBE)**: Cada pregunta está categorizada jerárquicamente en:
  * **Dominio**: Área del conocimiento (ej. *Matemáticas*, *Lectura Crítica*, *Ciencias Naturales*).
  * **Afirmación**: Lo que se certifica del estudiante.
  * **Evidencia**: Manifestación conductual medible.
  * **Tarea**: Ítem contextualizado con clave única y análisis de distractores comunes.
* **Teoría de Respuesta al Ítem (TRI - Modelo Logístico 3PL)**:
  $$P_i(\theta) = c_i + (1 - c_i) \frac{1}{1 + e^{-D \cdot a_i(\theta - b_i)}}$$
  Donde se calibran parámetros de discriminación ($a$), dificultad ($b$) y pseudo-azar ($c$).
* **Fórmula Oficial de Ponderación Saber 11 (Escala 0 a 500)**:
  $$\text{Puntaje Global} = \operatorname{redondear}\left( \frac{3 \cdot S_{\text{Mat}} + 3 \cdot S_{\text{Lec}} + 3 \cdot S_{\text{Soc}} + 3 \cdot S_{\text{Nat}} + 1 \cdot S_{\text{Ing}}}{13} \times 5 \right)$$

---

## 3. Características Principales de la Plataforma

* **Batería de Preguntas Oficiales**: Banco extraído de 58 guías de orientación y cuadernillos censales de Saber 11 y Saber Pro (módulos genéricos y específicos como *Diseño de Software*, *Ingeniería*, *Salud*, *Educación*, *Derecho* y *Ciencias Económicas*).
* **Simulacro Oficial y Diagnóstico Rápido**:
  * *Diagnóstico Inteligente (25 min)*: 15 preguntas calibradas para estimación inmediata de percentil.
  * *Simulacro Oficial (Condición Censal)*: Con cronómetro regresivo, cuadrícula de preguntas, marcación para revisión y telemetría de fatiga cognitiva.
* **Tutor Académico con Inteligencia Artificial**:
  * Asistente socrático integrado en cada reactivo que explica pistas de razonamiento, analiza por qué los distractores son erróneos y detalla los postulados teóricos.
* **Telemetría y Pacing Analytics**:
  * Registro de segundos por pregunta frente al estándar de 1.8 min.
  * Detección de "preguntas ladronas de tiempo" (>3.5 min y erradas).
  * Cuaderno de Errores con retroalimentación paso a paso.
* **Módulo Institucional &ldquo;Cero Papel&rdquo;**:
  * Generador de códigos de sala y sesión digital para profesores y colegios.
* **Monetización y Modelo Freemium**:
  * Banners limpios preparados para Google AdSense / patrocinadores universitarios y plan PRO para analítica avanzada.
* **Estándar Visual**:
  * Diseño limpio, accesible, moderno, con iconos vectoriales SVG (`lucide-react`) y **cero emojis**.

---

## 4. Stack Tecnológico

* **Frontend & Backend (Full-Stack)**: Next.js 15 (App Router, Turbopack) + React 19.
* **Lenguaje**: TypeScript 5 (tipado estricto en todas las capas).
* **Estilos & UI**: Tailwind CSS 3.4 + Lucide React.
* **Motor Psicométrico**: Algoritmos TypeScript de puntuación ponderada y función normal acumulativa (CDF).
* **Procesamiento de Microdatos y PDFs**: Python 3.14 + PyMuPDF (extracción automatizada de 58 documentos oficiales).

---

## 5. Instrucciones de Instalación y Ejecución

### Prerrequisitos
* Node.js v18+ o v24+
* npm o yarn
* Python 3.10+ (opcional para scripts de extracción)

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jeveraeng-bit/simulador-icfes.git
   cd simulador-icfes
   ```

2. Ingresar al directorio de la aplicación web:
   ```bash
   cd app-simulador
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

---

## 6. Créditos Institucionales

* **Desarrollo y Arquitectura**: Juan Esteban Vera Rodríguez
* **Programa Académico**: Ingeniería Electrónica
* **Universidad**: Universidad Antonio Nariño (UAN), Sede Ibagué, Colombia
* **Año**: 2026
