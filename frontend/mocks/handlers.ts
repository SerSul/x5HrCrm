import { http, HttpResponse } from 'msw';

// Mock session storage (in-memory)
let mockSession: {
  username: string;
  authorities: { authority: string }[];
} | null = null;

// Mock directions with statuses
const mockDirections = [
  {
    id: 1,
    title: 'Frontend Developer',
    description: 'Разработка веб-приложений на React и TypeScript',
    employment_type: 'FULL_TIME',
    salary_min: 150000,
    salary_max: 250000,
    active: true,
    created_at: '2025-01-01T00:00:00Z',
    test_id: 1,
    statuses: [
      { id: 1, title: 'Новая заявка', description: 'Заявка получена', sequence_order: 1, is_mandatory: true },
      { id: 2, title: 'Тестирование', description: 'Прохождение теста', sequence_order: 2, is_mandatory: true },
      { id: 3, title: 'Интервью', description: 'Собеседование', sequence_order: 3, is_mandatory: true },
      { id: 4, title: 'Оффер', description: 'Предложение работы', sequence_order: 4, is_mandatory: false },
    ],
  },
  {
    id: 2,
    title: 'Backend Developer',
    description: 'Разработка серверной части на Java Spring Boot',
    employment_type: 'FULL_TIME',
    salary_min: 180000,
    salary_max: 300000,
    active: true,
    created_at: '2025-01-05T00:00:00Z',
    test_id: 2,
    statuses: [
      { id: 5, title: 'Новая заявка', description: 'Заявка получена', sequence_order: 1, is_mandatory: true },
      { id: 6, title: 'Тестирование', description: 'Прохождение теста', sequence_order: 2, is_mandatory: true },
      { id: 7, title: 'Техническое интервью', description: 'Техническое собеседование', sequence_order: 3, is_mandatory: true },
      { id: 8, title: 'Финальное интервью', description: 'Встреча с руководством', sequence_order: 4, is_mandatory: false },
    ],
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    description: 'Дизайн интерфейсов и пользовательского опыта',
    employment_type: 'PART_TIME',
    salary_min: 100000,
    salary_max: 180000,
    active: true,
    created_at: '2025-01-10T00:00:00Z',
    statuses: [
      { id: 9, title: 'Новая заявка', description: 'Заявка получена', sequence_order: 1, is_mandatory: true },
      { id: 10, title: 'Портфолио', description: 'Оценка портфолио', sequence_order: 2, is_mandatory: true },
      { id: 11, title: 'Интервью', description: 'Собеседование', sequence_order: 3, is_mandatory: false },
    ],
  },
];

// Mock test questions database
const mockTestQuestions: Record<number, any[]> = {
  1: [ // Frontend test
    {
      question_id: 1,
      text: 'Что такое Virtual DOM в React?',
      difficulty: 10,
      order_index: 1,
      options: [
        { option_id: 1, text: 'Виртуальная копия реального DOM' },
        { option_id: 2, text: 'Браузерный API' },
        { option_id: 3, text: 'База данных' },
        { option_id: 4, text: 'CSS фреймворк' },
      ],
    },
    {
      question_id: 2,
      text: 'Какой хук используется для управления состоянием в функциональных компонентах?',
      difficulty: 10,
      order_index: 2,
      options: [
        { option_id: 5, text: 'useState' },
        { option_id: 6, text: 'useContext' },
        { option_id: 7, text: 'useReducer' },
        { option_id: 8, text: 'useCallback' },
      ],
    },
    {
      question_id: 3,
      text: 'Что делает оператор spread (...) в JavaScript?',
      difficulty: 10,
      order_index: 3,
      options: [
        { option_id: 9, text: 'Распаковывает элементы массива или объекта' },
        { option_id: 10, text: 'Объединяет строки' },
        { option_id: 11, text: 'Создаёт новый массив' },
        { option_id: 12, text: 'Удаляет элементы' },
      ],
    },
  ],
  2: [ // Backend test
    {
      question_id: 4,
      text: 'Что такое REST API?',
      difficulty: 10,
      order_index: 1,
      options: [
        { option_id: 13, text: 'Архитектурный стиль для создания веб-сервисов' },
        { option_id: 14, text: 'База данных' },
        { option_id: 15, text: 'Язык программирования' },
        { option_id: 16, text: 'Фреймворк' },
      ],
    },
    {
      question_id: 5,
      text: 'Какой HTTP метод используется для создания ресурса?',
      difficulty: 10,
      order_index: 2,
      options: [
        { option_id: 17, text: 'POST' },
        { option_id: 18, text: 'GET' },
        { option_id: 19, text: 'PUT' },
        { option_id: 20, text: 'DELETE' },
      ],
    },
  ],
};

// Mock applications storage (in-memory, mutable)
const mockApplications: Record<number, any> = {}; // directionId -> application

// Mock test attempts storage
const mockTestAttempts: Record<number, any> = {}; // attemptId -> attempt data
let nextAttemptId = 1;

export const handlers = [
  // ========== Authentication ==========

  http.post('*/auth/register', async ({ request }) => {
    const body = await request.json() as any;
    const isRecruiter = body.email?.includes('recruiter');

    mockSession = {
      username: body.email,
      authorities: [{ authority: isRecruiter ? 'ROLE_RECRUITER' : 'ROLE_CANDIDATE' }],
    };

    return HttpResponse.json(mockSession, {
      headers: {
        'Set-Cookie': 'JSESSIONID=mock-session-id; Path=/; HttpOnly',
      },
    });
  }),

  http.post('*/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    const isRecruiter = body.email?.includes('recruiter');

    mockSession = {
      username: body.email,
      authorities: [{ authority: isRecruiter ? 'ROLE_RECRUITER' : 'ROLE_CANDIDATE' }],
    };

    return HttpResponse.json(mockSession, {
      headers: {
        'Set-Cookie': 'JSESSIONID=mock-session-id; Path=/; HttpOnly',
      },
    });
  }),

  http.get('*/auth/me', () => {
    if (!mockSession) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(mockSession);
  }),

  http.post('*/auth/logout', () => {
    mockSession = null;
    return HttpResponse.json({ message: 'Logged out' });
  }),

  // ========== Directions ==========

  http.get('*/public/directions', ({ request }) => {
    const url = new URL(request.url);
    const onlyApplied = url.searchParams.get('only_applied') === 'true';

    let directions = [...mockDirections];

    // Add 'applied' field based on mockApplications
    directions = directions.map(d => ({
      ...d,
      applied: !!mockApplications[d.id],
    }));

    if (onlyApplied) {
      directions = directions.filter(d => d.applied);
    }

    return HttpResponse.json(directions);
  }),

  // ========== Applications ==========

  http.post('*/directions/apply/:directionId', async ({ params, request }) => {
    const directionId = parseInt(params.directionId as string, 10);
    const body = await request.json() as any;

    const direction = mockDirections.find(d => d.id === directionId);
    if (!direction) {
      return new HttpResponse('Direction not found', { status: 404 });
    }

    // Create application
    mockApplications[directionId] = {
      direction_id: directionId,
      current_status: direction.statuses[0],
      status_history: [
        {
          id: Date.now(),
          status_id: direction.statuses[0].id,
          status_title: direction.statuses[0].title,
          changed_by_user_id: 1,
          changed_at: new Date().toISOString(),
          comment: 'Заявка создана',
        },
      ],
      resume_path: body.resume_path,
      comment: body.comment,
      // Initialize test if direction has test_id
      test: direction.test_id ? {
        test_id: direction.test_id,
        status: 'NOT_STARTED',
      } : undefined,
    };

    return HttpResponse.json({ message: 'Application created' });
  }),

  http.delete('*/directions/apply/:directionId', ({ params }) => {
    const directionId = parseInt(params.directionId as string, 10);
    delete mockApplications[directionId];
    return HttpResponse.json({ message: 'Application withdrawn' });
  }),

  http.get('*/apply-info/directions/:directionId', ({ params }) => {
    const directionId = parseInt(params.directionId as string, 10);
    const application = mockApplications[directionId];

    if (!application) {
      return HttpResponse.json({
        direction_id: directionId,
        status_history: [],
      });
    }

    return HttpResponse.json(application);
  }),

  // ========== Test Flow ==========

  http.post('*/test/start', async ({ request }) => {
    const body = await request.json() as any;
    const applicationId = body.application_id;

    // Find direction for this application (simplified - in real app would lookup by application_id)
    const direction = mockDirections.find(d => mockApplications[d.id]);
    if (!direction || !direction.test_id) {
      return new HttpResponse('Test not found', { status: 404 });
    }

    const attemptId = nextAttemptId++;
    const questions = mockTestQuestions[direction.test_id] || [];

    mockTestAttempts[attemptId] = {
      attempt_id: attemptId,
      test_id: direction.test_id,
      application_id: applicationId,
      status: 'IN_PROGRESS',
      questions,
    };

    // Update application with test info
    if (mockApplications[direction.id]) {
      mockApplications[direction.id].test = {
        test_id: direction.test_id,
        attempt_id: attemptId,
        status: 'IN_PROGRESS',
      };
    }

    return HttpResponse.json({
      attempt_id: attemptId,
      test_id: direction.test_id,
      questions,
    });
  }),

  http.get('*/test/questions/:attemptId', ({ params }) => {
    const attemptId = parseInt(params.attemptId as string, 10);
    const attempt = mockTestAttempts[attemptId];

    if (!attempt) {
      return new HttpResponse('Test attempt not found', { status: 404 });
    }

    return HttpResponse.json({
      attempt_id: attempt.attempt_id,
      test_id: attempt.test_id,
      questions: attempt.questions,
    });
  }),

  http.post('*/test/submit', async ({ request }) => {
    const body = await request.json() as any;
    const attemptId = body.attempt_id;
    const answers = body.answers;

    const attempt = mockTestAttempts[attemptId];
    if (!attempt) {
      return new HttpResponse('Test attempt not found', { status: 404 });
    }

    // Calculate score (simplified - just count correct answers)
    const score = answers.length * 10; // 10 points per question answered
    const maxScore = attempt.questions.length * 10;

    const result = {
      attempt_id: attemptId,
      status: 'FINISHED',
      score,
      max_score: maxScore,
      finished_at: new Date().toISOString(),
    };

    attempt.status = 'FINISHED';
    attempt.score = score;

    // Update application test info
    const direction = mockDirections.find(d => d.test_id === attempt.test_id);
    if (direction && mockApplications[direction.id]) {
      mockApplications[direction.id].test = {
        test_id: attempt.test_id,
        attempt_id: attemptId,
        status: 'FINISHED',
        score,
      };
    }

    return HttpResponse.json(result);
  }),

  // ========== HR Application Management ==========

  http.post('*/hr/applications/list', async ({ request }) => {
    const body = await request.json() as any;
    const { direction_name, active, sort_by_score, page = 1, size = 20 } = body;

    // Build ApplicationHrItem list from mockApplications
    let applicationItems: any[] = [];

    Object.entries(mockApplications).forEach(([directionId, application]: [string, any]) => {
      const direction = mockDirections.find(d => d.id === parseInt(directionId));
      if (!direction) return;

      // Create ApplicationHrItem
      const item = {
        user_id: 1, // Mock user ID
        application_id: Date.now() + parseInt(directionId), // Mock application ID
        full_name: 'Иван Иванов', // Mock name
        direction_id: direction.id,
        direction_name: direction.title,
        test_attempt_id: application.test?.attempt_id,
        test_status: application.test?.status,
        test_score: application.test?.score,
        max_score: 30, // Mock max score
        is_active: application.close_reason ? false : true,
        applied_at: application.status_history[0]?.changed_at || new Date().toISOString(),
        resume_path: application.resume_path,
      };

      applicationItems.push(item);
    });

    // Filter by direction_name
    if (direction_name) {
      applicationItems = applicationItems.filter(item =>
        item.direction_name.toLowerCase().includes(direction_name.toLowerCase())
      );
    }

    // Filter by active status
    if (active !== undefined) {
      applicationItems = applicationItems.filter(item => item.is_active === active);
    }

    // Sort by test score
    if (sort_by_score) {
      applicationItems.sort((a, b) => {
        const scoreA = a.test_score || 0;
        const scoreB = b.test_score || 0;
        return sort_by_score === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      });
    }

    // Pagination
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedItems = applicationItems.slice(startIndex, endIndex);

    return HttpResponse.json({
      items: paginatedItems,
      total: applicationItems.length,
      page,
      size,
      total_pages: Math.ceil(applicationItems.length / size),
    });
  }),

  http.post('*/hr/applications/status', async ({ request }) => {
    const body = await request.json() as any;
    const { direction_id, user_id, sequence_order, comment } = body;

    const application = mockApplications[direction_id];
    if (!application) {
      return new HttpResponse('Application not found', { status: 404 });
    }

    const direction = mockDirections.find(d => d.id === direction_id);
    if (!direction) {
      return new HttpResponse('Direction not found', { status: 404 });
    }

    // Find status by sequence_order
    const targetStatus = direction.statuses.find(s => s.sequence_order === sequence_order);
    if (!targetStatus) {
      return new HttpResponse('Invalid sequence order', { status: 400 });
    }

    // Update application status
    application.current_status = targetStatus;
    application.status_history.push({
      id: Date.now(),
      status_id: targetStatus.id,
      status_title: targetStatus.title,
      changed_by_user_id: 1, // Mock recruiter ID
      changed_at: new Date().toISOString(),
      comment: comment || `Статус изменен на "${targetStatus.title}"`,
    });

    return HttpResponse.json({ message: 'Status updated' });
  }),

  http.post('*/hr/applications/reject', async ({ request }) => {
    const body = await request.json() as any;
    const { application_id, close_reason, comment } = body;

    // Find application by ID (simplified - in real implementation would use proper lookup)
    let foundApplication: any = null;
    let foundDirectionId: number | null = null;

    Object.entries(mockApplications).forEach(([directionId, application]: [string, any]) => {
      const appId = Date.now() + parseInt(directionId);
      if (appId === application_id) {
        foundApplication = application;
        foundDirectionId = parseInt(directionId);
      }
    });

    if (!foundApplication) {
      return new HttpResponse('Application not found', { status: 404 });
    }

    // Mark application as closed
    foundApplication.close_reason = close_reason || 'REJECTED';
    foundApplication.status_history.push({
      id: Date.now(),
      status_id: 0,
      status_title: 'Отклонено',
      changed_by_user_id: 1,
      changed_at: new Date().toISOString(),
      comment: comment || `Заявка отклонена: ${close_reason || 'REJECTED'}`,
    });

    return HttpResponse.json({ message: 'Application rejected' });
  }),
];
