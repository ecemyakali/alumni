/**
 * ========================================================
 * Factory: Announcement Factory
 * File: factories/announcementFactory.js
 * ========================================================
 * 
 * Generates realistic mock announcement entities for testing,
 * local development, and database seeding.
 */

let counter = 1;

const CATEGORIES = ['General', 'Event', 'Career', 'Academic', 'Alumni', 'Networking'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: 'Annual Alumni Reunion 2026',
    content: 'Welcome back to campus! Join us for the annual gala dinner, alumni awards ceremony, and networking panel with distinguished graduates.',
    category: 'Event',
    author: 'Alumni Relations Office',
    priority: 'high'
  },
  {
    title: 'Tech Career & Internship Fair 2026',
    content: 'Meet over 50 leading technology firms, explore internship openings, and discover full-time engineering and product opportunities.',
    category: 'Career',
    author: 'Career Development Center',
    priority: 'normal'
  },
  {
    title: 'Alumni-to-Student Mentorship Program',
    content: 'Give back to the community! Share your industry experience with recent graduates and seniors. Sign up today as a mentor.',
    category: 'Networking',
    author: 'Alumni Association',
    priority: 'normal'
  },
  {
    title: 'Graduate Studies & Fellowship Information Session',
    content: 'Thinking about pursuing a master’s degree or PhD? Attend our upcoming session covering fellowships, scholarships, and research grants.',
    category: 'Academic',
    author: 'Graduate School Office',
    priority: 'normal'
  },
  {
    title: 'Distinguished Alumni Speaker Series: AI in 2026',
    content: 'Hear from our alumni pioneers in AI, cloud computing, and machine learning about the latest industry breakthroughs.',
    category: 'Event',
    author: 'Computer Engineering Department',
    priority: 'high'
  },
  {
    title: 'Campus Facilities Access for Alumni',
    content: 'Alumni cardholders can now access the central library, sports center, and innovation labs on weekends. Apply online for your card.',
    category: 'General',
    author: 'Rectorate General Secretariat',
    priority: 'low'
  }
];

const announcementFactory = {
  /**
   * Builds a single mock announcement object
   * @param {Object} [overrides] - Custom property overrides
   * @returns {Object} Mock announcement record
   */
  build(overrides = {}) {
    const id = counter++;
    const sampleIndex = (id - 1) % SAMPLE_ANNOUNCEMENTS.length;
    const sample = SAMPLE_ANNOUNCEMENTS[sampleIndex];

    const defaultAnnouncement = {
      title: sample ? sample.title : `Campus Announcement #${id}`,
      content: sample ? sample.content : `Official broadcast message and update content for notice #${id}.`,
      category: sample ? sample.category : CATEGORIES[id % CATEGORIES.length],
      author: sample ? sample.author : 'Alumni Association',
      priority: sample ? sample.priority : PRIORITIES[id % PRIORITIES.length]
    };

    return {
      ...defaultAnnouncement,
      ...overrides
    };
  },

  /**
   * Builds an array of mock announcements
   * @param {number} [count=5] - Number of announcements to generate
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
   * Returns list of sample announcement constants
   */
  getSampleAnnouncements() {
    return [...SAMPLE_ANNOUNCEMENTS];
  },

  // Aliases for convention interoperability
  create(overrides) { return this.build(overrides); },
  createMany(count, overrides) { return this.buildMany(count, overrides); },
  resetCounter() { return this.reset(); }
};

module.exports = announcementFactory;
