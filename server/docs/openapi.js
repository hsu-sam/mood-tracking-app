const errorResponse = {
  description: 'Request failed',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'fail' },
          message: { type: 'string', example: 'Invalid request' },
        },
      },
    },
  },
};

const bearerAuth = [{ bearerAuth: [] }];

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Mood Tracker API',
    version: '1.0.0',
    description:
      'Authentication, account management, and mood-tracking endpoints.',
  },
  servers: [
    {
      url: '/',
      description: 'Current server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Account access and password flows',
    },
    { name: 'Users', description: 'Authenticated user account management' },
    { name: 'Moods', description: 'Mood entries and summaries' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the JWT returned by the login endpoint.',
      },
    },
    schemas: {
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          password: { type: 'string', format: 'password', minLength: 8 },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665a1c2d3e4f506172839405' },
          fullName: { type: 'string', example: 'Alex Morgan' },
          email: { type: 'string', format: 'email' },
          photo: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['user', 'admin'] },
        },
      },
      MoodEntry: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string', description: 'Owner user ID' },
          entryDate: { type: 'string', format: 'date', example: '2026-11-11' },
          mood: { type: 'integer', enum: [-2, -1, 0, 1, 2] },
          feelings: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: { type: 'string' },
          },
          sleepHours: { type: 'number', enum: [1, 3.5, 5.5, 7.5, 9] },
          journal: { type: 'string', maxLength: 2000 },
        },
      },
    },
  },
  paths: {
    '/api/v1/users/signup': {
      post: {
        tags: ['Authentication'],
        summary: 'Create a user account and send a welcome email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Credentials' },
            },
          },
        },
        responses: {
          201: { description: 'Account created' },
          400: errorResponse,
          409: errorResponse,
        },
      },
    },
    '/api/v1/users/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Credentials' },
            },
          },
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { token: { type: 'string' } },
                },
              },
            },
          },
          401: errorResponse,
        },
      },
    },
    '/api/v1/users/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Log out and invalidate the current JWT',
        security: bearerAuth,
        responses: { 200: { description: 'Logged out' }, 401: errorResponse },
      },
    },
    '/api/v1/users/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Email a password reset link',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Reset link sent' },
          404: errorResponse,
        },
      },
    },
    '/api/v1/users/reset-password/{token}': {
      patch: {
        tags: ['Authentication'],
        summary: 'Reset a password with the emailed token',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'passwordConfirm'],
                properties: {
                  password: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                  },
                  passwordConfirm: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password reset; confirmation email attempted' },
          400: errorResponse,
        },
      },
    },
    '/api/v1/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users (admin only)',
        security: bearerAuth,
        responses: {
          200: { description: 'Users returned' },
          401: errorResponse,
          403: errorResponse,
        },
      },
    },
    '/api/v1/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get the authenticated user',
        security: bearerAuth,
        responses: {
          200: { description: 'Current user returned' },
          401: errorResponse,
        },
      },
    },
    '/api/v1/users/onboarding': {
      patch: {
        tags: ['Users'],
        summary: 'Set onboarding profile details',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName'],
                properties: {
                  fullName: { type: 'string' },
                  photo: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
          401: errorResponse,
        },
      },
    },
    '/api/v1/users/update-me': {
      patch: {
        tags: ['Users'],
        summary: 'Update profile name and/or upload a profile photo',
        security: bearerAuth,
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string' },
                  photo: {
                    type: 'string',
                    format: 'binary',
                    description: 'PNG or JPEG, max 250 KB',
                  },
                },
              },
            },
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string' },
                  photo: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
          400: errorResponse,
          401: errorResponse,
        },
      },
    },
    '/api/v1/users/update-password': {
      patch: {
        tags: ['Users'],
        summary: 'Change password for the authenticated user',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['passwordCurrent', 'password', 'passwordConfirm'],
                properties: {
                  passwordCurrent: { type: 'string', format: 'password' },
                  password: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                  },
                  passwordConfirm: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password changed; a new JWT is returned' },
          401: errorResponse,
        },
      },
    },
    '/api/v1/users/{id}': {
      delete: {
        tags: ['Users'],
        summary: 'Delete a user (admin only)',
        security: bearerAuth,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: { description: 'User deleted' },
          401: errorResponse,
          403: errorResponse,
          404: errorResponse,
        },
      },
    },
    '/api/v1/moods': {
      get: {
        tags: ['Moods'],
        summary: 'List moods (users see their own; admins see all)',
        security: bearerAuth,
        parameters: [
          {
            name: 'entryDate[gte]',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'entryDate[lte]',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
          { name: 'mood', in: 'query', schema: { type: 'integer' } },
          { name: 'sleepHours', in: 'query', schema: { type: 'number' } },
          { name: 'feelings', in: 'query', schema: { type: 'string' } },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', example: '-entryDate' },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100 },
          },
          {
            name: 'fields',
            in: 'query',
            schema: { type: 'string', example: 'mood,entryDate,feelings' },
          },
        ],
        responses: {
          200: { description: 'Mood entries returned' },
          401: errorResponse,
        },
      },
      post: {
        tags: ['Moods'],
        summary: 'Create a mood entry for the authenticated user',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/MoodEntry' },
                  {
                    type: 'object',
                    required: ['entryDate', 'mood', 'feelings', 'sleepHours'],
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: { description: 'Mood entry created' },
          400: errorResponse,
          401: errorResponse,
          409: errorResponse,
        },
      },
    },
    '/api/v1/moods/today': {
      get: {
        tags: ['Moods'],
        summary: 'Get the authenticated user’s mood for a date',
        security: bearerAuth,
        parameters: [
          {
            name: 'date',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date', example: '2026-11-11' },
          },
        ],
        responses: {
          200: { description: 'Mood returned, or null if none exists' },
          400: errorResponse,
          401: errorResponse,
        },
      },
    },
    '/api/v1/moods/recent': {
      get: {
        tags: ['Moods'],
        summary: 'Get the latest 11 mood entries for the chart',
        security: bearerAuth,
        responses: {
          200: { description: 'Recent moods returned' },
          401: errorResponse,
        },
      },
    },
    '/api/v1/moods/averages': {
      get: {
        tags: ['Moods'],
        summary:
          'Compare averages for the latest five and previous five entries',
        security: bearerAuth,
        responses: {
          200: { description: 'Mood and sleep averages returned' },
          401: errorResponse,
        },
      },
    },
    '/api/v1/moods/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      get: {
        tags: ['Moods'],
        summary: 'Get one mood entry by ID',
        security: bearerAuth,
        responses: {
          200: { description: 'Mood returned' },
          401: errorResponse,
          403: errorResponse,
          404: errorResponse,
        },
      },
      patch: {
        tags: ['Moods'],
        summary: 'Update an owned mood entry (admins may update any entry)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mood: { type: 'integer', enum: [-2, -1, 0, 1, 2] },
                  feelings: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 3,
                    items: { type: 'string' },
                  },
                  sleepHours: { type: 'number', enum: [1, 3.5, 5.5, 7.5, 9] },
                  journal: { type: 'string', maxLength: 2000 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Mood updated' },
          400: errorResponse,
          401: errorResponse,
          403: errorResponse,
          404: errorResponse,
        },
      },
      delete: {
        tags: ['Moods'],
        summary: 'Delete an owned mood entry (admins may delete any entry)',
        security: bearerAuth,
        responses: {
          204: { description: 'Mood deleted' },
          401: errorResponse,
          403: errorResponse,
          404: errorResponse,
        },
      },
    },
  },
};

export default openApiSpec;
