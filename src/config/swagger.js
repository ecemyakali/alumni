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
      name: 'API Announcements',
      description: 'RESTful API announcement management via ApiAnnouncementController (.../api/announcements)'
    },
    {
      name: 'Web Announcements',
      description: 'Web / Application announcement management via AnnouncementController (.../announcements)'
    },
    {
      name: 'API Job Postings',
      description: 'RESTful API career opportunity management via ApiJobPostingController (.../api/job-postings)'
    },
    {
      name: 'Web Job Postings',
      description: 'Web / Application career opportunity management via JobPostingController (.../job-postings)'
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
    '/users/{id}/edit': {
      get: {
        tags: ['Web Users'],
        summary: 'Get Edit User form View (Web / App)',
        description: 'Renders the pre-filled HTML form to edit user details via UserController.',
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
            description: 'HTML Edit User Form'
          },
          '404': {
            description: 'User not found'
          }
        }
      }
    },
    '/users/{id}/update': {
      post: {
        tags: ['Web Users'],
        summary: 'Update user from Web form (Web / App)',
        description: 'Submits user updates from HTML edit form and renders updated View.',
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
      }
    },
    '/users/{id}/delete': {
      post: {
        tags: ['Web Users'],
        summary: 'Delete user from Web form (Web / App)',
        description: 'Deletes user via HTML form submit and renders updated directory View.',
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
            description: 'User deleted and directory view rendered'
          },
          '404': {
            description: 'User not found'
          }
        }
      }
    },
    '/api/announcements': {
      get: {
        tags: ['API Announcements'],
        summary: 'List all announcements (API)',
        description: 'Retrieves all published announcements as JSON from in-memory storage.',
        responses: {
          '200': {
            description: 'List of announcements',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Announcement' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['API Announcements'],
        summary: 'Publish new announcement (API)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string', example: 'Annual Alumni Homecoming 2026' },
                  content: { type: 'string', example: 'Join us for campus reunion and networking events.' },
                  author: { type: 'string', example: 'Alumni Office' },
                  category: { type: 'string', example: 'Event' },
                  priority: { type: 'string', example: 'high' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Announcement published successfully'
          },
          '400': {
            description: 'Title and content required'
          }
        }
      }
    },
    '/api/announcements/{id}': {
      get: {
        tags: ['API Announcements'],
        summary: 'Get announcement by ID (API)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        responses: {
          '200': { description: 'Announcement details' },
          '404': { description: 'Announcement not found' }
        }
      },
      put: {
        tags: ['API Announcements'],
        summary: 'Update announcement by ID (API)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Updated Title' },
                  content: { type: 'string', example: 'Updated Content' },
                  priority: { type: 'string', example: 'urgent' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Updated successfully' },
          '404': { description: 'Not found' }
        }
      },
      delete: {
        tags: ['API Announcements'],
        summary: 'Delete announcement by ID (API)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        responses: {
          '200': { description: 'Deleted successfully' },
          '404': { description: 'Not found' }
        }
      }
    },
    '/announcements': {
      get: {
        tags: ['Web Announcements'],
        summary: 'Announcements Board (Web / App)',
        description: 'Renders the Announcements Board HTML view with list and creation form.',
        responses: {
          '200': { description: 'Announcements Board HTML or JSON' }
        }
      },
      post: {
        tags: ['Web Announcements'],
        summary: 'Publish announcement from Web form',
        description: 'Creates new announcement from browser form submission.',
        responses: {
          '201': { description: 'Published and view rendered' },
          '400': { description: 'Missing required fields' }
        }
      }
    },
    '/announcements/{id}': {
      get: {
        tags: ['Web Announcements'],
        summary: 'Announcement Detail page (Web / App)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        responses: {
          '200': { description: 'Announcement detail card' },
          '404': { description: 'Not found' }
        }
      }
    },
    '/announcements/{id}/edit': {
      get: {
        tags: ['Web Announcements'],
        summary: 'Get Edit Announcement form View',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        responses: {
          '200': { description: 'Pre-filled edit form' },
          '404': { description: 'Not found' }
        }
      }
    },
    '/announcements/{id}/update': {
      post: {
        tags: ['Web Announcements'],
        summary: 'Update announcement from Web form',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        responses: {
          '200': { description: 'Updated and detail view rendered' },
          '404': { description: 'Not found' }
        }
      }
    },
    '/announcements/{id}/delete': {
      post: {
        tags: ['Web Announcements'],
        summary: 'Delete announcement from Web form',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }
        ],
        responses: {
          '200': { description: 'Deleted and board view rendered' },
          '404': { description: 'Not found' }
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
    },
    '/api/job-postings': {
      get: {
        tags: ['API Job Postings'],
        summary: 'List all job postings',
        description: 'Returns all career and job opportunities with optional filtering by company or employment type.',
        parameters: [
          { name: 'company', in: 'query', schema: { type: 'string' }, description: 'Filter by company name' },
          { name: 'type', in: 'query', schema: { type: 'string' }, description: 'Filter by employment type' }
        ],
        responses: {
          '200': {
            description: 'List of job postings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/JobPosting' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['API Job Postings'],
        summary: 'Create a new job posting',
        description: 'Creates a new career opportunity record in the database.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'company', 'description'],
                properties: {
                  title: { type: 'string', example: 'Software Engineer (Backend)' },
                  company: { type: 'string', example: 'TechCorp Solutions' },
                  location: { type: 'string', example: 'Istanbul / Remote' },
                  type: { type: 'string', example: 'full-time' },
                  description: { type: 'string', example: 'Building robust microservices' },
                  requirements: { type: 'string', example: 'Node.js, PostgreSQL' },
                  salary: { type: 'string', example: '$80,000 - $100,000' },
                  contactEmail: { type: 'string', example: 'careers@techcorp.com' },
                  postedBy: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Job posting created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Job posting created successfully' },
                    jobPosting: { $ref: '#/components/schemas/JobPosting' },
                    totalJobPostings: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request - missing required fields'
          }
        }
      }
    },
    '/api/job-postings/{id}': {
      get: {
        tags: ['API Job Postings'],
        summary: 'Get job posting by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Job posting details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/JobPosting' }
                  }
                }
              }
            }
          },
          '404': { description: 'Job posting not found' }
        }
      },
      put: {
        tags: ['API Job Postings'],
        summary: 'Update job posting details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JobPosting' }
            }
          }
        },
        responses: {
          '200': { description: 'Job posting updated successfully' },
          '404': { description: 'Job posting not found' }
        }
      },
      delete: {
        tags: ['API Job Postings'],
        summary: 'Delete job posting by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'Job posting deleted successfully' },
          '404': { description: 'Job posting not found' }
        }
      }
    },
    '/job-postings': {
      get: {
        tags: ['Web Job Postings'],
        summary: 'Render Career Opportunities board',
        responses: {
          '200': { description: 'HTML rendered career board' }
        }
      },
      post: {
        tags: ['Web Job Postings'],
        summary: 'Submit new job posting form',
        responses: {
          '201': { description: 'Job posting created' },
          '400': { description: 'Validation error' }
        }
      }
    },
    '/job-postings/{id}': {
      get: {
        tags: ['Web Job Postings'],
        summary: 'Render single job posting detail card',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'HTML rendered detail view' },
          '404': { description: 'Job posting not found' }
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
      },
      Announcement: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Annual Alumni Homecoming 2026' },
          content: { type: 'string', example: 'Join us for campus reunion and networking events.' },
          author: { type: 'string', example: 'Alumni Office' },
          category: { type: 'string', example: 'Event' },
          priority: { type: 'string', example: 'high' },
          createdAt: { type: 'string', example: '2026-10-07T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2026-10-07T11:00:00.000Z' }
        }
      },
      JobPosting: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Software Engineer (Backend)' },
          company: { type: 'string', example: 'TechCorp Solutions' },
          location: { type: 'string', example: 'Remote' },
          type: { type: 'string', example: 'full-time' },
          description: { type: 'string', example: 'Designing and developing robust microservices' },
          requirements: { type: 'string', example: 'Proficiency in Node.js, Express, PostgreSQL' },
          salary: { type: 'string', example: '$75,000 - $95,000' },
          contactEmail: { type: 'string', example: 'careers@techcorp.com' },
          postedBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', example: '2026-10-21T20:00:00.000Z' },
          updatedAt: { type: 'string', example: null }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
