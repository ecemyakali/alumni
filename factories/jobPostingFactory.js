/**
 * ========================================================
 * Factory: Job Posting Factory
 * File: factories/jobPostingFactory.js
 * ========================================================
 * 
 * Generates realistic mock job posting entities for testing,
 * local development, and database seeding.
 */

let counter = 1;

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];

const SAMPLE_JOB_POSTINGS = [
  {
    title: 'Software Engineer (Backend)',
    company: 'TechCorp Solutions',
    location: 'Remote',
    type: 'full-time',
    description: 'Designing and developing high-performance RESTful APIs, distributed microservices, and database layers with Node.js and PostgreSQL.',
    requirements: '3+ years experience with Node.js, Express, PostgreSQL, Docker containerization, and Git.',
    salary: '$85,000 - $110,000',
    contactEmail: 'careers@techcorp.com'
  },
  {
    title: 'Full-Stack Developer',
    company: 'CloudScale Innovations',
    location: 'Istanbul, Turkey (Hybrid)',
    type: 'full-time',
    description: 'Building scalable modern web applications with responsive React frontend and Express/PostgreSQL backend services.',
    requirements: 'Proficiency in React, Node.js, REST APIs, SQL databases, and modern CSS/Tailwind.',
    salary: '$70,000 - $90,000',
    contactEmail: 'jobs@cloudscale.io'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'DeepData Labs',
    location: 'Ankara, Turkey',
    type: 'full-time',
    description: 'Developing, fine-tuning, and deploying large-scale predictive models, computer vision, and LLM agent pipelines in production.',
    requirements: 'Strong proficiency in Python, PyTorch, LangChain, API serving, and Vector DBs.',
    salary: '$95,000 - $130,000',
    contactEmail: 'ai-careers@deepdata.com'
  },
  {
    title: 'DevOps & Cloud Infrastructure Engineer',
    company: 'Nexus Infrastructure',
    location: 'Remote',
    type: 'contract',
    description: 'Automating multi-environment CI/CD pipelines, container orchestration with Kubernetes, and managing cloud security.',
    requirements: 'Hands-on experience with Docker, Kubernetes, AWS/GCP, GitHub Actions, and Terraform.',
    salary: '$90,000 - $120,000',
    contactEmail: 'devops@nexusinfra.net'
  },
  {
    title: 'Junior Frontend Engineer',
    company: 'InnoTech Studios',
    location: 'Izmir, Turkey (Hybrid)',
    type: 'internship',
    description: 'Entry-level opportunity for recent computer engineering graduates to work on responsive web interfaces and user experience.',
    requirements: 'HTML5, modern JavaScript (ES6+), React basics, and collaborative team mindset.',
    salary: '$35,000 - $45,000',
    contactEmail: 'internships@innotech.com'
  },
  {
    title: 'Technical Product Manager',
    company: 'Alumni Network Global',
    location: 'Remote',
    type: 'full-time',
    description: 'Leading cross-functional feature discovery, roadmap prioritization, and data-driven user engagement for alumni career portals.',
    requirements: '2+ years agile product management, user research, wireframing, and SQL analytics.',
    salary: '$80,000 - $105,000',
    contactEmail: 'pm@alumninetwork.org'
  }
];

const jobPostingFactory = {
  /**
   * Builds a single mock job posting object with customizable overrides
   * @param {Object} [overrides] - Custom property overrides
   * @returns {Object} Mock job posting record
   */
  build(overrides = {}) {
    const id = counter++;
    const sampleIndex = (id - 1) % SAMPLE_JOB_POSTINGS.length;
    const sample = SAMPLE_JOB_POSTINGS[sampleIndex];

    const defaultJobPosting = {
      title: sample ? sample.title : `Career Opportunity #${id}`,
      company: sample ? sample.company : `Global Enterprise #${id}`,
      location: sample ? sample.location : 'Remote',
      type: sample ? sample.type : EMPLOYMENT_TYPES[id % EMPLOYMENT_TYPES.length],
      description: sample ? sample.description : `Comprehensive role responsibilities and qualifications for position #${id}.`,
      requirements: sample ? sample.requirements : 'Bachelor’s degree in Computer Engineering or related technical field.',
      salary: sample ? sample.salary : '$75,000 - $95,000',
      contactEmail: sample ? sample.contactEmail : `careers${id}@example.com`,
      postedBy: overrides.postedBy !== undefined ? overrides.postedBy : ((id % 3) + 1)
    };

    return {
      ...defaultJobPosting,
      ...overrides
    };
  },

  /**
   * Builds an array of mock job postings
   * @param {number} [count=5] - Number of job postings to generate
   * @param {Object} [overrides] - Common overrides applied to each
   * @returns {Array<Object>}
   */
  buildMany(count = 5, overrides = {}) {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(this.build(overrides));
    }
    return result;
  },

  /**
   * Resets the internal counter
   */
  reset() {
    counter = 1;
  },

  /**
   * Returns list of sample job postings
   */
  getSampleJobPostings() {
    return [...SAMPLE_JOB_POSTINGS];
  },

  // Aliases for convention interoperability
  create(overrides) { return this.build(overrides); },
  createMany(count, overrides) { return this.buildMany(count, overrides); },
  resetCounter() { return this.reset(); }
};

module.exports = jobPostingFactory;
