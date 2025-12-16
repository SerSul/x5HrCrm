import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('http://localhost:3000/register', async ({ request }) => {
    const body = await request.json();
    console.log('Mock register called with:', body);

    return HttpResponse.json({
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  }),

  http.post('http://localhost:3000/login', async ({ request }) => {
    const body = await request.json();
    console.log('Mock login called with:', body);

    return HttpResponse.json({
      user: {
        id: 'user-456',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IkphbmUgU21pdGgiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
  }),

  http.get('http://localhost:3000/vacancies', () => {
    console.log('Mock vacancies called');

    return HttpResponse.json([
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
    ])
  }),
]