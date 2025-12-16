import { http, HttpResponse } from 'msw'

// Mock data storage
const mockVacancies = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer proficient in React and TypeScript.',
    company: 'Tech Corp',
    salary: '$100,000 - $140,000',
    location: 'San Francisco, CA',
    type: 'Full-time',
  },
  {
    id: '2',
    title: 'Backend Engineer',
    description: 'Join our backend team to build scalable microservices architecture.',
    company: 'StartupXYZ',
    salary: '$90,000 - $130,000',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive user interfaces for our products.',
    company: 'Design Studio',
    salary: '$80,000 - $110,000',
    location: 'New York, NY',
    type: 'Full-time',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description: 'Maintain and improve our cloud infrastructure and CI/CD pipelines.',
    company: 'CloudTech',
    salary: '$110,000 - $150,000',
    location: 'Austin, TX',
    type: 'Hybrid',
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'Analyze large datasets and build machine learning models.',
    company: 'DataCorp',
    salary: '$120,000 - $160,000',
    location: 'Seattle, WA',
    type: 'Full-time',
  },
  {
    id: '6',
    title: 'Product Manager',
    description: 'Lead product strategy and work with cross-functional teams.',
    company: 'InnovateLabs',
    salary: '$130,000 - $170,000',
    location: 'Remote',
    type: 'Full-time',
  },
];

const mockCandidates = [
  {
    id: 'cand-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 (555) 111-2222',
    experience: '5 years of experience in full-stack development, specializing in React and Node.js',
    skills: 'React, TypeScript, Node.js, GraphQL, PostgreSQL, AWS',
  },
  {
    id: 'cand-2',
    name: 'Bob Martinez',
    email: 'bob.martinez@example.com',
    phone: '+1 (555) 222-3333',
    experience: '3 years as a backend developer, focusing on microservices and cloud infrastructure',
    skills: 'Python, Django, Docker, Kubernetes, MongoDB, CI/CD',
  },
  {
    id: 'cand-3',
    name: 'Carol White',
    email: 'carol.white@example.com',
    phone: '+1 (555) 333-4444',
    experience: '7 years in UI/UX design with a strong portfolio in mobile and web applications',
    skills: 'Figma, Adobe XD, Sketch, HTML/CSS, User Research, Prototyping',
  },
  {
    id: 'cand-4',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 444-5555',
    experience: '4 years as DevOps engineer with expertise in cloud infrastructure and automation',
    skills: 'AWS, Terraform, Jenkins, Ansible, Linux, Python scripting',
  },
];

let mockApplications = [
  {
    id: 'app-1',
    candidateId: 'cand-1',
    candidateName: 'Alice Johnson',
    candidateEmail: 'alice.johnson@example.com',
    vacancyId: '1',
    vacancyTitle: 'Senior Frontend Developer',
    status: 'pending',
    appliedAt: '2025-12-10T10:00:00Z',
  },
  {
    id: 'app-2',
    candidateId: 'cand-2',
    candidateName: 'Bob Martinez',
    candidateEmail: 'bob.martinez@example.com',
    vacancyId: '2',
    vacancyTitle: 'Backend Engineer',
    status: 'reviewed',
    appliedAt: '2025-12-11T14:30:00Z',
  },
  {
    id: 'app-3',
    candidateId: 'cand-3',
    candidateName: 'Carol White',
    candidateEmail: 'carol.white@example.com',
    vacancyId: '3',
    vacancyTitle: 'UI/UX Designer',
    status: 'accepted',
    appliedAt: '2025-12-09T09:15:00Z',
  },
];

export const handlers = [
  // Candidate registration
  http.post('http://localhost:3000/register', async ({ request }) => {
    const body = await request.json();
    console.log('Mock candidate register called with:', body);

    return HttpResponse.json({
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'candidate',
        experience: '',
        skills: '',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  }),

  // Recruiter registration
  http.post('http://localhost:3000/register/recruiter', async ({ request }) => {
    const body = await request.json();
    console.log('Mock recruiter register called with:', body);

    return HttpResponse.json({
      user: {
        id: 'rec-123',
        name: 'Recruiter Sarah',
        email: 'sarah.recruiter@company.com',
        phone: '+1 (555) 999-8888',
        role: 'recruiter',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyZWMxMjMiLCJuYW1lIjoiUmVjcnVpdGVyIFNhcmFoIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  }),

  // Login (returns candidate by default)
  http.post('http://localhost:3000/login', async ({ request }) => {
    const body = await request.json();
    console.log('Mock login called with:', body);

    // Simple logic: if login contains 'recruiter', return recruiter role
    const isRecruiter = (body as any).login?.includes('recruiter');

    if (isRecruiter) {
      return HttpResponse.json({
        user: {
          id: 'rec-456',
          name: 'Recruiter Jane',
          email: 'jane.recruiter@company.com',
          phone: '+1 (555) 888-7777',
          role: 'recruiter',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyZWM0NTYiLCJuYW1lIjoiUmVjcnVpdGVyIEphbmUiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      })
    }

    return HttpResponse.json({
      user: {
        id: 'user-456',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        role: 'candidate',
        experience: '3 years in frontend development',
        skills: 'React, JavaScript, CSS',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IkphbmUgU21pdGgiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  }),

  // Get all vacancies
  http.get('http://localhost:3000/vacancies', () => {
    console.log('Mock vacancies called');
    return HttpResponse.json(mockVacancies);
  }),

  // Get vacancy by ID
  http.get('http://localhost:3000/vacancies/:id', ({ params }) => {
    console.log('Mock vacancy by ID called with id:', params.id);
    const vacancy = mockVacancies.find(v => v.id === params.id);
    if (vacancy) {
      return HttpResponse.json(vacancy);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Get all candidates (recruiter only)
  http.get('http://localhost:3000/candidates', () => {
    console.log('Mock candidates called');
    return HttpResponse.json(mockCandidates);
  }),

  // Get candidate by ID (recruiter only)
  http.get('http://localhost:3000/candidates/:id', ({ params }) => {
    console.log('Mock candidate by ID called with id:', params.id);
    const candidate = mockCandidates.find(c => c.id === params.id);
    if (candidate) {
      return HttpResponse.json(candidate);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Apply to vacancy
  http.post('http://localhost:3000/applications', async ({ request }) => {
    const body = await request.json() as { vacancyId: string };
    console.log('Mock apply to vacancy called with:', body);

    const vacancy = mockVacancies.find(v => v.id === body.vacancyId);
    const newApplication = {
      id: `app-${Date.now()}`,
      candidateId: 'user-456',
      candidateName: 'Jane Smith',
      candidateEmail: 'jane.smith@example.com',
      vacancyId: body.vacancyId,
      vacancyTitle: vacancy?.title || 'Unknown Position',
      status: 'pending' as const,
      appliedAt: new Date().toISOString(),
    };

    mockApplications.push(newApplication);
    return HttpResponse.json(newApplication);
  }),

  // Get my applications (candidate)
  http.get('http://localhost:3000/applications/me', () => {
    console.log('Mock get my applications called');
    // In a real app, this would filter by current user
    return HttpResponse.json(mockApplications);
  }),

  // Get applications for a vacancy (recruiter)
  http.get('http://localhost:3000/applications/vacancy/:vacancyId', ({ params }) => {
    console.log('Mock get vacancy applications called with vacancyId:', params.vacancyId);
    const applications = mockApplications.filter(app => app.vacancyId === params.vacancyId);
    return HttpResponse.json(applications);
  }),

  // Update application status (recruiter)
  http.patch('http://localhost:3000/applications/:id/status', async ({ params, request }) => {
    const body = await request.json() as { status: string };
    console.log('Mock update application status called with id:', params.id, 'status:', body.status);

    const appIndex = mockApplications.findIndex(app => app.id === params.id);
    if (appIndex !== -1) {
      mockApplications[appIndex] = {
        ...mockApplications[appIndex],
        status: body.status as any,
      };
      return HttpResponse.json(mockApplications[appIndex]);
    }
    return new HttpResponse(null, { status: 404 });
  }),
]