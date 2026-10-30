import { NextRequest, NextResponse } from 'next/server';

interface TutorRequest {
  questionId: string;
  enunciado: string;
  opciones: { id: string; texto: string; es_correcta: boolean; tipo_distractor?: string | null }[];
  claveOficial: string;
  explicacionOficial: string;
  userQuery: string;
  mode?: 'PISTA' | 'DESCARTE' | 'CONCEPTUAL' | 'COMPLETO';
}

export async function POST(req: NextRequest) {
  try {
    const body: TutorRequest = await req.json();
    const { enunciado, opciones, claveOficial, explicacionOficial, userQuery, mode } = body;

    const queryLower = (userQuery || '').toLowerCase();
    let responseText = '';

    const claveTexto = opciones.find((o) => o.id === claveOficial)?.texto || '';
    const distractores = opciones.filter((o) => !o.es_correcta);

    if (mode === 'PISTA' || queryLower.includes('pista') || queryLower.includes('ayuda sin decir')) {
      responseText = `Orientación pedagógica (Método Socrático):
1. Revisa detenidamente la condición central del enunciado: identifica qué variable o premisa debe mantenerse constante frente a las variables que cambian.
2. Descarta aquellas opciones que hagan afirmaciones absolutas o que utilicen datos que no fueron suministrados en la tabla o situación.
3. Pregúntate: ¿Qué relación matemática o lógica une la pregunta con la conclusión requerida? No intentes calcular todo de inmediato; delimita el orden de magnitud esperado.`;
    } else if (mode === 'DESCARTE' || queryLower.includes('descarte') || queryLower.includes('distractor') || queryLower.includes('trampa')) {
      const distractoresInfo = distractores
        .map((d) => `* Opción ${d.id}: Incorrecta. Suele ser un distractor por ${d.tipo_distractor || 'análisis incompleto o confusión de variables'}. Representa un error común al tomar datos parciales.`)
        .join('\n');

      responseText = `Análisis de descarte estructurado:
${distractoresInfo}

Conclusión: La única opción que resiste la verificación metodológica rigurosa es la opción ${claveOficial}.`;
    } else if (mode === 'CONCEPTUAL' || queryLower.includes('teoria') || queryLower.includes('formula') || queryLower.includes('concepto')) {
      responseText = `Fundamento conceptual del Modelo Basado en Evidencias (ICFES):
Este ítem evalúa la competencia de formulación, ejecución y argumentación formal. 
Para resolverlo, debes aplicar:
1. Lectura selectiva de datos cuantitativos o textuales, separando información contextual del dato operativo.
2. Identificación del principio subyacente (conservación, proporcionalidad, articulación de tesis o deducción silogística).
3. Verificación de pertinencia: una opción puede contener una afirmación verídica en la vida cotidiana, pero si no se deriva del contexto presentado, queda descartada.`;
    } else {
      // General question answering
      responseText = `Respuesta del Tutor Especializado:

Sobre tu consulta: "${userQuery}"

1. Análisis del ítem:
El enunciado plantea: "${enunciado.slice(0, 160)}...".

2. Justificación de la solución:
La respuesta correcta y validada oficialmente por el ICFES es la Opción ${claveOficial}: "${claveTexto}".
${explicacionOficial}

3. Recomendación táctica para el examen:
En este tipo de reactivos, el tiempo objetivo de resolución debe ser menor a 1.8 minutos. La clave reside en leer primero la pregunta puntual para saber con precisión qué variable buscar antes de procesar todos los datos numéricos.`;
    }

    return NextResponse.json({
      success: true,
      tutorResponse: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al procesar la consulta';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
