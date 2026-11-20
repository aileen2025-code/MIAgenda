import { ClassSession, NoteItem, TaskItem } from '../types';
import { addDaysISO, getTodayISO } from '../utils/dateUtils';

export function createInitialClasses(): ClassSession[] {
  const today = getTodayISO();

  return [
    {
      id: 'clase-1',
      title: 'Exploración del espacio de trabajo en Google AI Studio',
      topic: 'Introducción a Google AI Studio',
      date: addDaysISO(today, -3),
      startTime: '18:00',
      endTime: '19:15',
      modality: 'Clase en vivo',
      description:
        'Recorrido por los tipos de prompts (Chat, Freeform y Structured), selección de modelos Gemini y gestión de historial.',
    },
    {
      id: 'clase-2',
      title: 'Diseño de instrucciones del sistema y ejemplos Few-Shot',
      topic: 'Ingeniería de Prompts',
      date: today,
      startTime: '18:30',
      endTime: '20:00',
      modality: 'Clase en vivo',
      description:
        'Cómo redactar System Instructions claras para definir el rol, el tono y las reglas de respuesta del modelo.',
    },
    {
      id: 'clase-3',
      title: 'Ajuste de temperatura, Top-P y límite de tokens',
      topic: 'Parámetros y Modelos Gemini',
      date: addDaysISO(today, 1),
      startTime: '10:00',
      endTime: '11:30',
      modality: 'Práctica guiada',
      description:
        'Laboratorio práctico comparando salidas deterministas frente a respuestas creativas usando los controles laterales.',
    },
    {
      id: 'clase-4',
      title: 'Análisis de imágenes, audio y PDFs en el editor',
      topic: 'Multimodalidad y Datos',
      date: addDaysISO(today, 3),
      startTime: '18:30',
      endTime: '19:45',
      modality: 'Clase en vivo',
      description:
        'Carga de archivos reales desde Google Drive o el equipo para extraer resúmenes, transcripciones y tablas.',
    },
    {
      id: 'clase-5',
      title: 'Esquemas de salida JSON y validación de respuestas',
      topic: 'Salida Estructurada (JSON)',
      date: addDaysISO(today, 5),
      startTime: '19:00',
      endTime: '20:15',
      modality: 'Práctica guiada',
      description:
        'Uso de Structured Outputs para garantizar objetos JSON consistentes listos para conectarse con una aplicación web.',
    },
    {
      id: 'clase-6',
      title: 'Exportar código y conectar la API de Gemini en proyectos',
      topic: 'Integración y API',
      date: addDaysISO(today, 7),
      startTime: '17:30',
      endTime: '18:45',
      modality: 'Tutoría',
      description:
        'Uso del botón Get Code en Google AI Studio para pasar un prompt probado a TypeScript con el SDK oficial.',
    },
  ];
}

export function createInitialTasks(): TaskItem[] {
  const today = getTodayISO();

  return [
    {
      id: 'tarea-1',
      title: 'Crear mi primer prompt de sistema en Google AI Studio',
      description:
        'Configurar un asistente tutor de estudio usando System Instructions con un tono claro, pasos breves y ejemplos en español.',
      dueDate: addDaysISO(today, -2),
      topic: 'Introducción a Google AI Studio',
      status: 'completed',
    },
    {
      id: 'tarea-2',
      title: 'Comparar respuestas con temperatura 0.2 y 1.0',
      description:
        'Ejecutar el mismo prompt de lluvia de ideas con dos valores distintos de temperatura y anotar qué cambia en precisión y variedad.',
      dueDate: addDaysISO(today, -1),
      topic: 'Parámetros y Modelos Gemini',
      status: 'completed',
    },
    {
      id: 'tarea-3',
      title: 'Armar tabla de 3 ejemplos Few-Shot para clasificar dudas',
      description:
        'Crear un prompt estructurado con tres pares de entrada y salida para clasificar preguntas de estudiantes por tema.',
      dueDate: today,
      topic: 'Ingeniería de Prompts',
      status: 'pending',
    },
    {
      id: 'tarea-4',
      title: 'Probar carga multimodal con una imagen de apuntes',
      description:
        'Subir la foto de un esquema de clase a Google AI Studio y pedirle al modelo que lo convierta en una lista de repaso ordenada.',
      dueDate: addDaysISO(today, 2),
      topic: 'Multimodalidad y Datos',
      status: 'pending',
    },
    {
      id: 'tarea-5',
      title: 'Definir esquema JSON para tarjetas de estudio',
      description:
        'Configurar Structured Output con campos pregunta, respuesta y dificultad, verificando que todas las salidas cumplan el formato.',
      dueDate: addDaysISO(today, 4),
      topic: 'Salida Estructurada (JSON)',
      status: 'pending',
    },
    {
      id: 'tarea-6',
      title: 'Revisar límites de seguridad y filtros de contenido',
      description:
        'Explorar el panel Safety Settings en AI Studio y documentar cómo ajustar cada categoría según un caso educativo.',
      dueDate: addDaysISO(today, -4),
      topic: 'Parámetros y Modelos Gemini',
      status: 'completed',
    },
    {
      id: 'tarea-7',
      title: 'Exportar código de prueba con Get Code',
      description:
        'Generar el fragmento en JavaScript/TypeScript desde AI Studio y guardarlo en el repositorio del proyecto final.',
      dueDate: addDaysISO(today, 6),
      topic: 'Integración y API',
      status: 'pending',
    },
  ];
}

export function createInitialNotes(): NoteItem[] {
  const today = getTodayISO();

  return [
    {
      id: 'nota-1',
      title: 'Cómo redactar buenas System Instructions',
      topic: 'Ingeniería de Prompts',
      updatedAt: today,
      content:
        'Las instrucciones del sistema definen el comportamiento general antes de que el usuario escriba su mensaje.\n\nPuntos clave de la clase:\n• Indicar el rol concreto y el idioma de respuesta.\n• Especificar qué hacer si falta información para evitar inventar datos.\n• Mantener reglas cortas y ordenadas con viñetas.',
    },
    {
      id: 'nota-2',
      title: 'Resumen de parámetros: Temperatura, Top-P y Max Tokens',
      topic: 'Parámetros y Modelos Gemini',
      updatedAt: addDaysISO(today, -1),
      content:
        '• Temperatura baja (0.0 a 0.3): ideal para respuestas exactas, resúmenes y extracción de datos.\n• Temperatura media-alta (0.7 a 1.0): útil para redactar ideas, ejemplos variados o ejercicios creativos.\n• Max output tokens: controla la extensión máxima de la respuesta para evitar textos demasiado largos.',
    },
    {
      id: 'nota-3',
      title: 'Prompts multimodales con PDFs e imágenes',
      topic: 'Multimodalidad y Datos',
      updatedAt: addDaysISO(today, -2),
      content:
        'En Google AI Studio se pueden combinar texto, imágenes, audio y archivos PDF en un mismo prompt.\n\nConsejo práctico: colocar primero el archivo o imagen y luego escribir la pregunta concreta indicando el formato esperado (por ejemplo, tabla o lista numerada).',
    },
    {
      id: 'nota-4',
      title: 'Ventajas de Structured Outputs en formato JSON',
      topic: 'Salida Estructurada (JSON)',
      updatedAt: addDaysISO(today, -3),
      content:
        'Cuando necesitamos que el modelo devuelva datos listos para usar en código, activar el esquema JSON evita texto extra alrededor.\n\nEs recomendable describir cada propiedad del esquema con claridad para mejorar la consistencia de cada campo.',
    },
  ];
}
