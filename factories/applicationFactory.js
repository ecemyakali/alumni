/**
 * ========================================================
 * Factory: Application Factory
 * File: factories/applicationFactory.js
 * ========================================================
 * 
 * Generates realistic mock job application records (Action Entity)
 * for testing, seeding, and database initialization.
 */

let counter = 1;

const SAMPLE_NOTES = [
  'I have 3+ years of experience with Node.js and scalable distributed microservices.',
  'Graduated with honors in Computer Engineering. Strong proficiency in React and full-stack development.',
  'Extensive experience with PostgreSQL optimization, Docker containerization, and automated CI/CD pipelines.',
  'Enthusiastic about distributed systems and cloud infrastructure. Check my portfolio and GitHub projects.',
  'Looking forward to contributing my software craftsmanship and engineering mindset to the team.'
];

const VALID_STATUSES = ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'];

const applicationFactory = {
  /**
   * Builds an in-memory application object without persisting
   * @param {Object} [overrides={}] - Custom field values
   * @returns {Object} Mock application
   */
  build(overrides = {}) {
    const id = counter++;
    const noteIndex = (id - 1) % SAMPLE_NOTES.length;
    const statusIndex = (id - 1) % VALID_STATUSES.length;

    const defaultRecord = {
      userId: overrides.userId !== undefined ? overrides.userId : ((id % 3) + 1),
      jobPostingId: overrides.jobPostingId !== undefined ? overrides.jobPostingId : (id > 3 ? 2 : id),
      status: VALID_STATUSES[statusIndex],
      resumeUrl: `https://drive.google.com/file/d/mock-resume-${id}.pdf`,
      coverNote: SAMPLE_NOTES[noteIndex],
      appliedAt: new Date().toISOString()
    };

    return { ...defaultRecord, ...overrides };
  },

  /**
   * Generates an array of mock application objects
   * @param {number} count 
   * @param {Object} [overrides={}] 
   * @returns {Array<Object>}
   */
  buildMany(count = 3, overrides = {}) {
    const records = [];
    for (let i = 0; i < count; i++) {
      records.push(this.build(overrides));
    }
    return records;
  },

  /**
   * Alias for build to support class/static creation conventions
   */
  create(overrides = {}) {
    return this.build(overrides);
  },

  /**
   * Alias for buildMany
   */
  createMany(count = 3, overrides = {}) {
    return this.buildMany(count, overrides);
  },

  /**
   * Resets counter to 1
   */
  reset() {
    counter = 1;
  }
};

module.exports = applicationFactory;
