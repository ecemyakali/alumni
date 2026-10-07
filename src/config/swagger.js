const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Alumni Tracking System API',
    version: '1.0.0',
    description: 'Comprehensive API documentation for the Alumni Tracking System backend, built with Node.js and Express following MVC architecture.',
    contact: {
      name: 'Alumni Tracking System Team'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Default Server (Port 5000)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Alternate Server (Port 3000)'
    }
  ],
  tags: [
    {
      name: 'System',
      description: 'System health checks and uptime status'
    },
    {
      name: 'API Users',
      description: 'RESTful API user management via ApiUserController (.../api/users)'
    },
    {
      name: 'Web Users',
      description: 'Web / Application user management via UserController (.../users)'
    },
    {
      name: 'Whiteboard Routes',
      description: 'Introductory classroom routes and endpoints'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'System health check',
        description: 'Returns the current server health status, uptime, and timestamp in JSON format.',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string', example: 'System is healthy' },
                    timestamp: { type: 'string', example: '2026-09-30T07:23:17.000Z' },
                    uptime: { type: 'number', example: 124.56 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['API Users'],
        summary: 'List all users (API)',
        description: 'Retrieves all registered users as JSON from in-memory storage via ApiUserController.',
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 2 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['API Users'],
        summary: 'Create a new user (API)',
        description: 'Adds a new user to in-memory storage via ApiUserController. Accepts form-urlencoded or JSON body.',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Ece Yakali' },
                  email: { type: 'string', example: 'ece@example.com' },
                  role: { type: 'string', example: 'alumni' },
                  department: { type: 'string', example: 'Computer Engineering' }
                }
              }
            },
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Ece Yakali' },
                  email: { type: 'string', example: 'ece@example.com' },
                  role: { type: 'string', example: 'alumni' },
                  department: { type: 'string', example: 'Computer Engineering' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User created successfully' },
                    user: { $ref: '#/components/schemas/User' },
                    totalUsers: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid input / empty form data'
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['API Users'],
        summary: 'Get user by ID (API)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Numeric user ID',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'User not found'
          }
        }
      },
      put: {
        tags: ['API Users'],
        summary: 'Update user by ID (API)',
        description: 'Updates all or multiple details of an existing user via ApiUserController.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Ece Yakali (Updated)' },
                  email: { type: 'string', example: 'ece.updated@example.com' },
                  department: { type: 'string', example: 'Software Engineering' },
                  role: { type: 'string', example: 'senior_alumni' }
                }
              }
            },
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Ece Yakali (Updated)' },
                  email: { type: 'string', example: 'ece.updated@example.com' },
                  department: { type: 'string', example: 'Software Engineering' },
                  role: { type: 'string', example: 'senior_alumni' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User updated successfully' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'User not found'
          }
        }
      },
      patch: {
        tags: ['API Users'],
        summary: 'Partial update user by ID (API)',
        description: 'Partially updates specific fields of an existing user via ApiUserController.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', example: 'senior_alumni' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User updated successfully' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'User not found'
          }
        }
      },
      delete: {
        tags: ['API Users'],
        summary: 'Delete user by ID (API)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User deleted successfully' },
                    deletedUser: { $ref: '#/components/schemas/User' },
                    totalUsers: { type: 'integer', example: 0 }
                  }
                }
              }
            }
          },
          '404': {
            description: 'User not found'
          }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Web Users'],
        summary: 'List all users (Web / App)',
        description: 'Retrieves all users via UserController. Supports HTML views (Accept: text/html) and JSON fallback.',
        responses: {
          '200': {
            description: 'List of users in HTML or JSON representation',
            content: {
              'text/html': {
                schema: { type: 'string', example: '<h1>Alumni Users Directory</h1><ul>...</ul>' }
              },
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Web Users'],
        summary: 'Create a new user (Web / App)',
        description: 'Handles web user creation form submission via UserController.',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Ece Yakali' },
                  email: { type: 'string', example: 'ece@example.com' },
                  role: { type: 'string', example: 'alumni' },
                  department: { type: 'string', example: 'Computer Engineering' }
                }
              }
            },
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Ece Yakali' },
                  email: { type: 'string', example: 'ece@example.com' },
                  role: { type: 'string', example: 'alumni' },
                  department: { type: 'string', example: 'Computer Engineering' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully'
          },
          '400': {
            description: 'Form data is empty'
          }
        }
      }
    },
    '/users/{id}': {
      get: {
        tags: ['Web Users'],
        summary: 'Get user profile by ID (Web / App)',
        description: 'Retrieves user profile via UserController (HTML view or JSON).',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'User profile representation'
          },
          '404': {
            description: 'User not found'
          }
        }
      },
      put: {
        tags: ['Web Users'],
        summary: 'Update user by ID (Web / App)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Ece Yakali (Updated)' },
                  department: { type: 'string', example: 'Software Engineering' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated'
          },
          '404': {
            description: 'User not found'
          }
        }
      },
      patch: {
        tags: ['Web Users'],
        summary: 'Partial update user by ID (Web / App)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', example: 'senior_alumni' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated'
          },
          '404': {
            description: 'User not found'
          }
        }
      },
      delete: {
        tags: ['Web Users'],
        summary: 'Delete user by ID (Web / App)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'User deleted'
          },
          '404': {
            description: 'User not found'
          }
        }
      }
    },
    '/hello': {
      get: {
        tags: ['Whiteboard Routes'],
        summary: 'Hello World greeting',
        responses: {
          '200': {
            description: 'Returns Hello, World!'
          }
        }
      }
    },
    '/hello/{name}': {
      get: {
        tags: ['Whiteboard Routes'],
        summary: 'Personalized greeting',
        parameters: [
          {
            name: 'name',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'emre' }
          }
        ],
        responses: {
          '200': {
            description: 'Returns Hello, {Name}!'
          }
        }
      }
    },
    '/sum/{number1}/{number2}': {
      get: {
        tags: ['Whiteboard Routes'],
        summary: 'Add two numbers',
        parameters: [
          {
            name: 'number1',
            in: 'path',
            required: true,
            schema: { type: 'number', example: 5 }
          },
          {
            name: 'number2',
            in: 'path',
            required: true,
            schema: { type: 'number', example: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Returns sum of the two numbers'
          }
        }
      }
    },
    '/about': {
      get: {
        tags: ['Whiteboard Routes'],
        summary: 'About page',
        responses: {
          '200': {
            description: 'Returns temp. about page'
          }
        }
      }
    },
    '/alumni': {
      get: {
        tags: ['Whiteboard Routes'],
        summary: 'Alumni base route status',
        responses: {
          '200': {
            description: 'Returns ok'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ece Yakali' },
          email: { type: 'string', example: 'ece@example.com' },
          role: { type: 'string', example: 'alumni' },
          department: { type: 'string', example: 'Computer Engineering' },
          createdAt: { type: 'string', example: '2026-09-30T08:11:30.322Z' },
          updatedAt: { type: 'string', example: '2026-09-30T08:11:58.287Z' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
