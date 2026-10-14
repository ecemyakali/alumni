/**
 * ========================================================
 * Factory: User (Alumni) Factory
 * File: factories/userFactory.js
 * ========================================================
 * 
 * Generates realistic mock domain entities for testing,
 * local development, and database seeding.
 */

let counter = 1;

const DEPARTMENTS = [
  'Computer Engineering',
  'Software Engineering',
  'Industrial Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Data Science & Artificial Intelligence',
  'Civil Engineering',
  'Business Administration'
];

const SAMPLE_ALUMNI = [
  { name: 'Ece Yakali', email: 'ece@example.com', department: 'Computer Engineering', graduationYear: 2024, role: 'alumni' },
  { name: 'Admin User', email: 'admin@example.com', department: 'System Administration', graduationYear: 2020, role: 'admin' },
  { name: 'Can Demir', email: 'can.demir@alumni.edu', department: 'Industrial Engineering', graduationYear: 2023, role: 'alumni' },
  { name: 'Zeynep Kaya', email: 'zeynep.kaya@alumni.edu', department: 'Electrical & Electronics Engineering', graduationYear: 2022, role: 'alumni' },
  { name: 'Ahmet Yilmaz', email: 'ahmet.yilmaz@alumni.edu', department: 'Software Engineering', graduationYear: 2021, role: 'alumni' },
  { name: 'Elif Ozturk', email: 'elif.ozturk@alumni.edu', department: 'Data Science & Artificial Intelligence', graduationYear: 2025, role: 'alumni' },
  { name: 'Burak Celik', email: 'burak.celik@alumni.edu', department: 'Mechanical Engineering', graduationYear: 2020, role: 'alumni' },
  { name: 'Selin Aydin', email: 'selin.aydin@alumni.edu', department: 'Computer Engineering', graduationYear: 2024, role: 'alumni' },
  { name: 'Emre Arslan', email: 'emre.arslan@alumni.edu', department: 'Business Administration', graduationYear: 2019, role: 'alumni' },
  { name: 'Busra Sahin', email: 'busra.sahin@alumni.edu', department: 'Civil Engineering', graduationYear: 2022, role: 'alumni' }
];

const userFactory = {
  /**
   * Builds a single mock user object with customizable overrides
   * @param {Object} [overrides] - Custom property overrides
   * @returns {Object} Mock user record
   */
  build(overrides = {}) {
    const id = counter++;
    const sampleIndex = (id - 1) % SAMPLE_ALUMNI.length;
    const sample = SAMPLE_ALUMNI[sampleIndex];

    const defaultUser = {
      name: sample ? sample.name : `Alumni Graduate ${id}`,
      email: sample ? (overrides.email ? overrides.email : (id <= SAMPLE_ALUMNI.length ? sample.email : `alumni${id}@alumni.edu`)) : `alumni${id}@alumni.edu`,
      department: sample ? sample.department : DEPARTMENTS[id % DEPARTMENTS.length],
      graduationYear: sample ? sample.graduationYear : 2020 + (id % 6),
      role: sample ? sample.role : 'alumni'
    };

    return {
      ...defaultUser,
      ...overrides
    };
  },

  /**
   * Builds an array of mock users
   * @param {number} [count=5] - Number of users to generate
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
   * Returns list of sample alumni constants
   */
  getSampleAlumni() {
    return [...SAMPLE_ALUMNI];
  },

  // Aliases for convention interoperability
  create(overrides) { return this.build(overrides); },
  createMany(count, overrides) { return this.buildMany(count, overrides); },
  resetCounter() { return this.reset(); }
};

module.exports = userFactory;
