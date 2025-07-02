import { PrismaClient, UserRole, CourseLevel, ResourceType, QuestionType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@northernlms.com' },
    update: {},
    create: {
      email: 'admin@northernlms.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      language: 'en',
    },
  })

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', 12)
  
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: studentPassword,
      name: 'Ahmad Musa',
      role: UserRole.STUDENT,
      language: 'ha',
      location: 'Kano, Nigeria',
      phone: '+2348012345678',
    },
  })

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      nameHausa: 'Fasaha',
      slug: 'technology',
      description: 'Computer science and technology courses',
      color: '#3B82F6',
      icon: 'Monitor',
    },
  })

  const businessCategory = await prisma.category.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      name: 'Business',
      nameHausa: 'Kasuwanci',
      slug: 'business',
      description: 'Business and entrepreneurship courses',
      color: '#10B981',
      icon: 'Briefcase',
    },
  })

  const islamicCategory = await prisma.category.upsert({
    where: { slug: 'islamic-studies' },
    update: {},
    create: {
      name: 'Islamic Studies',
      nameHausa: 'Ilimin Musulunci',
      slug: 'islamic-studies',
      description: 'Islamic education and studies',
      color: '#059669',
      icon: 'BookOpen',
    },
  })

  // Create sample courses
  const webDevCourse = await prisma.course.upsert({
    where: { slug: 'web-development-hausa' },
    update: {},
    create: {
      title: 'Web Development for Beginners',
      titleHausa: 'Koyon Gina Shafukan Yanar Gizo',
      slug: 'web-development-hausa',
      description: 'Learn web development from scratch with HTML, CSS, and JavaScript',
      descriptionHausa: 'Koyi yadda ake gina shafukan yanar gizo daga farko da HTML, CSS, da JavaScript',
      price: 25000, // 25,000 NGN
      level: CourseLevel.BEGINNER,
      language: 'both',
      duration: 1800, // 30 hours in minutes
      isPublished: true,
      isFeatured: true,
      requirements: ['Basic computer skills', 'Internet connection'],
      whatYouLearn: [
        'HTML fundamentals',
        'CSS styling and layout',
        'JavaScript programming',
        'Building responsive websites',
        'Deploying websites online'
      ],
      categoryId: techCategory.id,
      creatorId: admin.id,
    },
  })

  const businessCourse = await prisma.course.upsert({
    where: { slug: 'small-business-management' },
    update: {},
    create: {
      title: 'Small Business Management',
      titleHausa: 'Gudanar da Kananan Kasuwanci',
      slug: 'small-business-management',
      description: 'Essential skills for managing and growing your small business',
      descriptionHausa: 'Mahimman dabarun gudanar da kasuwanci da kuma bunkasar shi',
      price: 15000, // 15,000 NGN
      level: CourseLevel.BEGINNER,
      language: 'both',
      duration: 720, // 12 hours
      isPublished: true,
      requirements: ['Basic literacy', 'Interest in business'],
      whatYouLearn: [
        'Business planning',
        'Financial management',
        'Marketing strategies',
        'Customer service',
        'Legal requirements'
      ],
      categoryId: businessCategory.id,
      creatorId: admin.id,
    },
  })

  // Create lessons for web development course
  const htmlLesson = await prisma.lesson.create({
    data: {
      title: 'Introduction to HTML',
      titleHausa: 'Gabatarwa ga HTML',
      slug: 'introduction-to-html',
      description: 'Learn the basics of HTML markup language',
      descriptionHausa: 'Koyi muhimman abubuwan HTML',
      content: 'HTML (HyperText Markup Language) is the foundation of web development...',
      contentHausa: 'HTML (HyperText Markup Language) shine tushen gina shafukan yanar gizo...',
      videoUrl: 'https://example.com/videos/html-intro.mp4',
      videoDuration: 1800, // 30 minutes
      order: 1,
      isPublished: true,
      isFree: true,
      courseId: webDevCourse.id,
    },
  })

  const cssLesson = await prisma.lesson.create({
    data: {
      title: 'CSS Styling Fundamentals',
      titleHausa: 'Muhimman Abubuwan CSS',
      slug: 'css-fundamentals',
      description: 'Learn how to style web pages with CSS',
      descriptionHausa: 'Koyi yadda ake yin ado ga shafukan yanar gizo da CSS',
      content: 'CSS (Cascading Style Sheets) is used to style HTML elements...',
      contentHausa: 'CSS (Cascading Style Sheets) ana amfani da shi wajen yin ado ga HTML...',
      videoUrl: 'https://example.com/videos/css-fundamentals.mp4',
      videoDuration: 2400, // 40 minutes
      order: 2,
      isPublished: true,
      courseId: webDevCourse.id,
    },
  })

  // Create resources
  await prisma.resource.create({
    data: {
      title: 'HTML Cheat Sheet',
      titleHausa: 'Takardar Taimako ta HTML',
      type: ResourceType.PDF,
      url: 'https://example.com/resources/html-cheatsheet.pdf',
      size: 1024000, // 1MB
      lessonId: htmlLesson.id,
    },
  })

  await prisma.resource.create({
    data: {
      title: 'CSS Reference Guide',
      titleHausa: 'Jagoran CSS',
      type: ResourceType.PDF,
      url: 'https://example.com/resources/css-reference.pdf',
      size: 2048000, // 2MB
      lessonId: cssLesson.id,
    },
  })

  // Create a quiz
  const htmlQuiz = await prisma.quiz.create({
    data: {
      title: 'HTML Basics Quiz',
      titleHausa: 'Gwajin HTML na Farko',
      description: 'Test your understanding of HTML fundamentals',
      descriptionHausa: 'Gwada fahimtarka game da HTML',
      timeLimit: 30, // 30 minutes
      passingScore: 70,
      maxAttempts: 3,
      isPublished: true,
      lessonId: htmlLesson.id,
    },
  })

  // Create quiz questions
  await prisma.question.createMany({
    data: [
      {
        question: 'What does HTML stand for?',
        questionHausa: 'Me HTML ke nufi?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        optionsHausa: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        correctAnswer: 'HyperText Markup Language',
        explanation: 'HTML stands for HyperText Markup Language',
        explanationHausa: 'HTML yana nufin HyperText Markup Language',
        points: 1,
        order: 1,
        quizId: htmlQuiz.id,
      },
      {
        question: 'Which tag is used for the largest heading?',
        questionHausa: 'Wane tag ake amfani da shi don kanun labarai mafi girma?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['<h1>', '<h6>', '<header>', '<heading>'],
        optionsHausa: ['<h1>', '<h6>', '<header>', '<heading>'],
        correctAnswer: '<h1>',
        explanation: 'The <h1> tag is used for the largest heading',
        explanationHausa: 'Ana amfani da <h1> tag don kanun labarai mafi girma',
        points: 1,
        order: 2,
        quizId: htmlQuiz.id,
      },
    ],
  })

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: webDevCourse.id,
      progress: 25.0,
    },
  })

  // Create progress
  await prisma.progress.create({
    data: {
      studentId: student.id,
      lessonId: htmlLesson.id,
      isCompleted: true,
      completedAt: new Date(),
      timeSpent: 1800, // 30 minutes
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('🔑 Admin credentials: admin@northernlms.com / admin123')
  console.log('👨‍🎓 Student credentials: student@example.com / student123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })