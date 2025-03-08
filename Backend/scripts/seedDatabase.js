const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
require('dotenv').config();

const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    thumbnail: 'web-dev-bootcamp.jpg',
    category: 'Web Development',
    level: 'Beginner',
    price: 99.99,
    prerequisites: ['Basic computer knowledge', 'No coding experience required'],
    learningOutcomes: [
      'Build responsive websites using HTML5 and CSS3',
      'Master JavaScript and modern ES6+ features',
      'Create full-stack applications with MERN stack',
      'Deploy applications to production',
    ],
    duration: 2400, // 40 hours
    tags: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
  },
  {
    title: 'Data Science and Machine Learning',
    description: 'Master data science, machine learning, and deep learning concepts. Learn Python, NumPy, Pandas, Scikit-learn, and TensorFlow.',
    thumbnail: 'data-science.jpg',
    category: 'Data Science',
    level: 'Intermediate',
    price: 129.99,
    prerequisites: ['Basic Python knowledge', 'Understanding of mathematics'],
    learningOutcomes: [
      'Understand data science workflow',
      'Build machine learning models',
      'Perform data analysis and visualization',
      'Deploy ML models to production',
    ],
    duration: 3000, // 50 hours
    tags: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Neural Networks'],
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Create iOS and Android apps with a single codebase.',
    thumbnail: 'react-native.jpg',
    category: 'Mobile Development',
    level: 'Intermediate',
    price: 89.99,
    prerequisites: ['JavaScript fundamentals', 'Basic React knowledge'],
    learningOutcomes: [
      'Build native mobile apps for iOS and Android',
      'Implement complex UI animations',
      'Work with device features and APIs',
      'Deploy apps to app stores',
    ],
    duration: 1800, // 30 hours
    tags: ['React Native', 'Mobile Development', 'iOS', 'Android', 'JavaScript'],
  },
  {
    title: 'DevOps Engineering Professional',
    description: 'Learn modern DevOps practices including CI/CD, containerization, and cloud deployment using popular tools and services.',
    thumbnail: 'devops.jpg',
    category: 'DevOps',
    level: 'Advanced',
    price: 149.99,
    prerequisites: ['Basic Linux knowledge', 'Understanding of web applications'],
    learningOutcomes: [
      'Implement CI/CD pipelines',
      'Master Docker and Kubernetes',
      'Deploy to cloud platforms',
      'Manage infrastructure as code',
    ],
    duration: 2700, // 45 hours
    tags: ['DevOps', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins'],
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Master the art of user interface and user experience design. Learn design principles, tools, and industry best practices.',
    thumbnail: 'ui-ux.jpg',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 79.99,
    prerequisites: ['No prior experience required', 'Basic design interest'],
    learningOutcomes: [
      'Create user-centered designs',
      'Build interactive prototypes',
      'Conduct user research',
      'Design mobile and web interfaces',
    ],
    duration: 1500, // 25 hours
    tags: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create a demo instructor
    const instructor = await User.findOneAndUpdate(
      { email: 'instructor@demo.com' },
      {
        email: 'instructor@demo.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E0Mail/QeqZeO', // 'password123'
        role: 'instructor',
        isEmailVerified: true,
      },
      { upsert: true, new: true }
    );

    // Add instructor and generate slug for each course
    const coursesWithInstructor = courses.map(course => ({
      ...course,
      instructor: instructor._id,
      slug: course.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      isPublished: true,
    }));

    // Delete existing courses
    await Course.deleteMany({});

    // Insert new courses
    await Course.insertMany(coursesWithInstructor);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 