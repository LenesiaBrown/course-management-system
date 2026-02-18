import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const creatorId = "2";  // Can be updated to have in the courses table if needed

// Departments data
const departments = [
    {
        name: 'Video Production'
    },
    {
        name: 'Graphic Design'
    },
    {
        name: 'Digital Advertising'
    },
    {
        name: 'Web Development'
    }
];

// Courses data
const courses = [
    // Video Production Courses
    {
        name: 'Complete Video Production Bootcamp',
        description: 'Learn video editing, color grading, and post-production with industry-standard tools',
        skills: ['Video Editing', 'Premiere Pro', 'After Effects', 'Color Grading'],
        externalLink: 'https://www.youtube.com/watch?v=O-3ca1Z8BoQ',
        departmentId: 0 // Will be updated in main()
    },
    {
        name: 'DaVinci Resolve - Complete Course',
        description: 'Master professional video editing and color correction with DaVinci Resolve',
        skills: ['DaVinci Resolve', 'Color Grading', 'Video Editing', 'Visual Effects'],
        externalLink: 'https://www.blackmagicdesign.com/products/davinciresolve/training',
        departmentId: 0
    },
    {
        name: 'Cinematography Masterclass',
        description: 'Learn camera techniques, lighting, and visual storytelling',
        skills: ['Cinematography', 'Camera Work', 'Lighting', 'Storytelling'],
        externalLink: 'https://www.youtube.com/watch?v=LPA0ZbnZGOA',
        departmentId: 0
    },
    
    // Graphic Design Courses
    {
        name: 'Adobe Photoshop Complete Course',
        description: 'Master photo editing, retouching, and digital art with Photoshop',
        skills: ['Photoshop', 'Photo Editing', 'Retouching', 'Digital Art'],
        externalLink: 'https://www.youtube.com/watch?v=IyR_uYsRdPs',
        departmentId: 0
    },
    {
        name: 'Graphic Design Fundamentals',
        description: 'Learn design principles, typography, and layout from scratch',
        skills: ['Design Principles', 'Typography', 'Layout', 'Color Theory'],
        externalLink: 'https://www.codecademy.com/learn/learn-graphic-design',
        departmentId: 0
    },
    {
        name: 'Figma UI/UX Design',
        description: 'Create beautiful user interfaces and prototypes with Figma',
        skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping'],
        externalLink: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        departmentId: 0
    },
    {
        name: 'Adobe Illustrator Masterclass',
        description: 'Vector graphics, logo design, and illustration techniques',
        skills: ['Illustrator', 'Vector Graphics', 'Logo Design', 'Illustration'],
        externalLink: 'https://www.youtube.com/watch?v=Ib8UBwu3yGA',
        departmentId: 0
    },
    
    // Digital Advertising Courses
    {
        name: 'Digital Marketing Complete Course',
        description: 'Learn SEO, social media marketing, and content strategy',
        skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Strategy'],
        externalLink: 'https://www.codecademy.com/learn/introduction-to-digital-marketing',
        departmentId: 0
    },
    {
        name: 'Facebook & Instagram Ads Mastery',
        description: 'Create high-converting ad campaigns on Meta platforms',
        skills: ['Facebook Ads', 'Instagram Ads', 'Meta Business Suite', 'Ad Targeting'],
        externalLink: 'https://www.facebook.com/business/learn',
        departmentId: 0
    },
    {
        name: 'Google Ads Certification Course',
        description: 'Master Google Ads, search campaigns, and PPC advertising',
        skills: ['Google Ads', 'PPC', 'Search Ads', 'Display Ads'],
        externalLink: 'https://skillshop.withgoogle.com/',
        departmentId: 0
    },
    {
        name: 'Social Media Marketing Strategy',
        description: 'Build your brand and grow your audience across social platforms',
        skills: ['Social Media Strategy', 'Content Creation', 'Community Management', 'Analytics'],
        externalLink: 'https://www.youtube.com/watch?v=xKuJqPGPpr8',
        departmentId: 0
    },
    
    // Web Development Courses
    {
        name: 'HTML & CSS Full Course',
        description: 'Build responsive websites from scratch with HTML and CSS',
        skills: ['HTML', 'CSS', 'Responsive Design', 'Flexbox'],
        externalLink: 'https://www.codecademy.com/learn/learn-html',
        departmentId: 0
    },
    {
        name: 'JavaScript - Complete Bootcamp',
        description: 'Master modern JavaScript including ES6+, async/await, and APIs',
        skills: ['JavaScript', 'ES6', 'APIs', 'DOM Manipulation'],
        externalLink: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        departmentId: 0
    },
    {
        name: 'React - The Complete Guide',
        description: 'Build modern web applications with React and hooks',
        skills: ['React', 'Hooks', 'State Management', 'Components'],
        externalLink: 'https://www.codecademy.com/learn/react-101',
        departmentId: 0
    },
    {
        name: 'Full Stack Web Development',
        description: 'Learn frontend and backend development with the MERN stack',
        skills: ['MongoDB', 'Express', 'React', 'Node.js'],
        externalLink: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
        departmentId: 0
    },
    {
        name: 'Tailwind CSS Crash Course',
        description: 'Build beautiful websites faster with utility-first CSS',
        skills: ['Tailwind CSS', 'CSS', 'Responsive Design', 'Utility Classes'],
        externalLink: 'https://www.youtube.com/watch?v=dFgzHOX84xQ',
        departmentId: 0
    }
];

const main = async () => {
    console.log("Seeding database...");


    // Create departments
    const createdDepartments = [];
    for (const dept of departments) {
        const created = await prisma.department.create({
            data: dept,
        });
        createdDepartments.push(created);
        console.log(`Created department: ${dept.name}`);
    }

    // Assign department IDs to courses
    // Video Production (3 courses) - indices 0-2
    courses[0].departmentId = createdDepartments[0].id;
    courses[1].departmentId = createdDepartments[0].id;
    courses[2].departmentId = createdDepartments[0].id;
    
    // Graphic Design (4 courses) - indices 3-6
    courses[3].departmentId = createdDepartments[1].id;
    courses[4].departmentId = createdDepartments[1].id;
    courses[5].departmentId = createdDepartments[1].id;
    courses[6].departmentId = createdDepartments[1].id;
    
    // Digital Advertising (4 courses) - indices 7-10
    courses[7].departmentId = createdDepartments[2].id;
    courses[8].departmentId = createdDepartments[2].id;
    courses[9].departmentId = createdDepartments[2].id;
    courses[10].departmentId = createdDepartments[2].id;
    
    // Web Development (5 courses) - indices 11-15
    courses[11].departmentId = createdDepartments[3].id;
    courses[12].departmentId = createdDepartments[3].id;
    courses[13].departmentId = createdDepartments[3].id;
    courses[14].departmentId = createdDepartments[3].id;
    courses[15].departmentId = createdDepartments[3].id;



    // Create courses
    for (const course of courses) {
        await prisma.course.create({
            data: course,
        });
        console.log(`Created course: ${course.name}`);
    }

    console.log("Database seeding completed!");
    console.log(`Created ${createdDepartments.length} departments and ${courses.length} courses`);
};


main()
    .catch((err) => {
        console.error("Error seeding database:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });