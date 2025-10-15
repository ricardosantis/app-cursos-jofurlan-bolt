import { Course, Module, Lesson } from '@/types';

/**
 * @const lessons
 * @description An array of sample lesson data.
 */
const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Introdução ao bem-estar',
    type: 'video',
    duration: '12 min',
    description: 'Uma introdução aos princípios básicos de bem-estar e como eles afetam sua vida diária.',
  },
  {
    id: 2,
    title: 'Hábitos alimentares saudáveis',
    type: 'video',
    duration: '15 min',
    description: 'Aprenda como desenvolver hábitos alimentares que promovem saúde e bem-estar.',
  },
  {
    id: 3,
    title: 'Exercícios para iniciantes',
    type: 'video',
    duration: '20 min',
    description: 'Rotina básica de exercícios que qualquer pessoa pode começar independente do nível de condicionamento.',
  },
  {
    id: 4,
    title: 'Técnicas de respiração',
    type: 'text',
    duration: '8 min',
    description: 'Guia detalhado sobre técnicas de respiração para reduzir o estresse e melhorar o foco.',
  },
  {
    id: 5,
    title: 'Meditação guiada',
    type: 'video',
    duration: '10 min',
    description: 'Sessão de meditação guiada para iniciantes focada em atenção plena.',
  },
  {
    id: 6,
    title: 'Estratégias de foco',
    type: 'video',
    duration: '18 min',
    description: 'Como treinar seu cérebro para manter o foco mesmo em ambientes desafiadores.',
  },
  {
    id: 7,
    title: 'Técnicas de produtividade',
    type: 'text',
    duration: '12 min',
    description: 'Métodos comprovados para aumentar sua produtividade no trabalho e estudos.',
  },
  {
    id: 8,
    title: 'Gerenciamento de tempo',
    type: 'video',
    duration: '14 min',
    description: 'Aprenda a organizar seu tempo de forma eficiente para alcançar seus objetivos.',
  },
  {
    id: 9,
    title: 'Hábitos para um cérebro saudável',
    type: 'video',
    duration: '22 min',
    description: 'Rotinas diárias que melhoram a saúde do cérebro e ajudam a prevenir o declínio cognitivo.',
  },
  {
    id: 10,
    title: 'Nutrição para o cérebro',
    type: 'text',
    duration: '15 min',
    description: 'Alimentos e suplementos que ajudam a otimizar a função cerebral.',
  },
  {
    id: 11,
    title: 'Estudo de caso: Alta performance',
    type: 'video',
    duration: '25 min',
    description: 'Análise detalhada de como pessoas de alta performance mantêm seu foco e energia.',
  },
  {
    id: 12,
    title: 'Exercícios para memória',
    type: 'video',
    duration: '16 min',
    description: 'Atividades práticas para fortalecer sua memória e capacidade de retenção.',
    locked: true,
  },
];

/**
 * @const modules
 * @description An array of sample module data.
 */
const modules: Module[] = [
  {
    id: 1,
    title: 'Fundamentos de Bem-Estar',
    description: 'Aprenda os conceitos básicos de bem-estar e como eles afetam todos os aspectos da sua vida.',
    order: 1,
    duration: '55 min',
    lessons: [lessons[0], lessons[1], lessons[2], lessons[3]],
  },
  {
    id: 2,
    title: 'Práticas Diárias',
    description: 'Técnicas e práticas que você pode incorporar no seu dia a dia para melhorar seu bem-estar.',
    order: 2,
    duration: '30 min',
    lessons: [lessons[4], lessons[3]],
  },
  {
    id: 3,
    title: 'Produtividade e Foco',
    description: 'Como otimizar seu desempenho mental e manter o foco em tarefas importantes.',
    order: 1,
    duration: '44 min',
    lessons: [lessons[5], lessons[6], lessons[7]],
  },
  {
    id: 4,
    title: 'Saúde Cerebral',
    description: 'Entenda como manter seu cérebro saudável e funcionando em seu potencial máximo.',
    order: 2,
    duration: '78 min',
    lessons: [lessons[8], lessons[9], lessons[10], lessons[11]],
  },
];

/**
 * @const allCourses
 * @description An array of all available courses.
 */
export const allCourses: Course[] = [
  {
    id: 1,
    title: 'Bem Estar com o Dr. Jô',
    description: 'Um curso completo sobre bem-estar físico e mental, projetado para ajudar você a viver uma vida mais saudável e equilibrada. Aprenda práticas diárias, hábitos alimentares e técnicas de relaxamento que transformarão sua qualidade de vida.',
    instructor: 'Dr. Jô Furlan',
    category: 'Saúde',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '1h 25min',
    modules: [modules[0], modules[1]],
    featured: true,
    inProgress: true,
  },
  {
    id: 2,
    title: 'Cérebro de Resultados',
    description: 'Descubra como otimizar o funcionamento do seu cérebro para alcançar resultados extraordinários em todas as áreas da sua vida. Este curso combina neurociência de ponta com técnicas práticas para melhorar foco, memória e produtividade.',
    instructor: 'Dr. Jô Furlan',
    category: 'Produtividade',
    imageUrl: 'https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '2h 02min',
    modules: [modules[2], modules[3]],
    featured: true,
  },
  {
    id: 3,
    title: 'Nutrição Inteligente',
    description: 'Aprenda a fazer escolhas alimentares conscientes que nutrem seu corpo e mente. Este curso vai além das dietas da moda para ensinar princípios fundamentais de nutrição para saúde duradoura.',
    instructor: 'Dra. Ana Silva',
    category: 'Saúde',
    imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '1h 45min',
    modules: [modules[0]],
    featured: false,
    inProgress: true,
  },
  {
    id: 4,
    title: 'Meditação para Iniciantes',
    description: 'Um guia passo a passo para começar sua jornada na meditação. Aprenda técnicas simples mas poderosas para acalmar a mente, reduzir o estresse e aumentar sua presença no momento presente.',
    instructor: 'Pedro Santos',
    category: 'Bem-estar',
    imageUrl: 'https://images.pexels.com/photos/3759661/pexels-photo-3759661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '55min',
    modules: [modules[1]],
    featured: true,
  },
  {
    id: 5,
    title: 'Produtividade Máxima',
    description: 'Transforme sua eficiência e realize mais em menos tempo. Este curso apresenta sistemas testados e comprovados para gerenciar seu tempo, energia e atenção de forma estratégica.',
    instructor: 'Mariana Costa',
    category: 'Produtividade',
    imageUrl: 'https://images.pexels.com/photos/7147664/pexels-photo-7147664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '1h 30min',
    modules: [modules[2]],
    featured: false,
  },
  {
    id: 6,
    title: 'Sono Reparador',
    description: 'Descubra os segredos para um sono profundo e restaurador. Aprenda como otimizar seu ambiente, rotinas e hábitos para melhorar a qualidade do sono e despertar revigorado todos os dias.',
    instructor: 'Dr. Carlos Mendes',
    category: 'Saúde',
    imageUrl: 'https://images.pexels.com/photos/6069773/pexels-photo-6069773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '1h 15min',
    modules: [modules[0]],
    featured: false,
  },
];

/**
 * @const featuredCourses
 * @description An array of courses that are marked as featured.
 */
export const featuredCourses = allCourses.filter(course => course.featured);

/**
 * @const inProgressCourses
 * @description An array of courses that are marked as in progress.
 */
export const inProgressCourses = allCourses.filter(course => course.inProgress);

/**
 * @function getCourseById
 * @description Retrieves a course by its ID.
 * @param {number} id - The ID of the course to retrieve.
 * @returns {Course | undefined} The course object, or undefined if not found.
 */
export const getCourseById = (id: number): Course | undefined => {
  return allCourses.find(course => course.id === id);
};

/**
 * @function getModuleById
 * @description Retrieves a module by its ID.
 * @param {number} id - The ID of the module to retrieve.
 * @returns {Module | undefined} The module object, or undefined if not found.
 */
export const getModuleById = (id: number): Module | undefined => {
  for (const course of allCourses) {
    const module = course.modules.find(m => m.id === id);
    if (module) return module;
  }
  return undefined;
};

/**
 * @function getLessonById
 * @description Retrieves a lesson by its ID.
 * @param {number} id - The ID of the lesson to retrieve.
 * @returns {Lesson | undefined} The lesson object, or undefined if not found.
 */
export const getLessonById = (id: number): Lesson | undefined => {
  for (const course of allCourses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === id);
      if (lesson) return lesson;
    }
  }
  return undefined;
};

/**
 * @function getNextLesson
 * @description Retrieves the next lesson in the same module.
 * @param {number} currentLessonId - The ID of the current lesson.
 * @returns {Lesson | undefined} The next lesson object, or undefined if there is no next lesson.
 */
export const getNextLesson = (currentLessonId: number): Lesson | undefined => {
  for (const course of allCourses) {
    for (const module of course.modules) {
      const currentLessonIndex = module.lessons.findIndex(l => l.id === currentLessonId);
      if (currentLessonIndex !== -1 && currentLessonIndex < module.lessons.length - 1) {
        return module.lessons[currentLessonIndex + 1];
      }
    }
  }
  return undefined;
};

/**
 * @function getPreviousLesson
 * @description Retrieves the previous lesson in the same module.
 * @param {number} currentLessonId - The ID of the current lesson.
 * @returns {Lesson | undefined} The previous lesson object, or undefined if there is no previous lesson.
 */
export const getPreviousLesson = (currentLessonId: number): Lesson | undefined => {
  for (const course of allCourses) {
    for (const module of course.modules) {
      const currentLessonIndex = module.lessons.findIndex(l => l.id === currentLessonId);
      if (currentLessonIndex > 0) {
        return module.lessons[currentLessonIndex - 1];
      }
    }
  }
  return undefined;
};