// scripts/seed_data.js
// Seeds default tags and 30 high-quality starter blogs if the database is empty.
// This is executed during deployment setup automatically to populate starter content for clients.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const DEFAULT_TAGS = [
  { name: "Govt Jobs", slug: "govt-jobs" },
  { name: "Study Tips", slug: "study-tips" },
  { name: "Tech News", slug: "tech-news" },
  { name: "YouTube Tips", slug: "youtube-tips" },
  { name: "Results", slug: "results" },
  { name: "Scholarships", slug: "scholarships" },
  { name: "Exam Prep", slug: "exam-prep" },
  { name: "Part-time Income", slug: "part-time-income" },
  { name: "Share Market", slug: "share-market" },
  { name: "AI Prompts", slug: "ai-prompts" },
  { name: "Career & Jobs", slug: "career-jobs" },
  { name: "YouTube Growth", slug: "youtube-growth" },
  { name: "Instagram", slug: "instagram" },
  { name: "Mobile Hacks", slug: "mobile-hacks" },
  { name: "AI Tools", slug: "ai-tools" },
  { name: "Marketing", slug: "marketing" },
  { name: "Startup Ideas", slug: "startup-ideas" },
  { name: "Technology", slug: "technology" },
  { name: "Apps & Websites", slug: "apps-websites" },
  { name: "Facebook", slug: "facebook" },
  { name: "Current Affairs", slug: "current-affairs" },
  { name: "Govt Jobs Updates", slug: "govt-jobs-updates" },
  { name: "Files & Materials", slug: "files-materials" },
  { name: "Internships", slug: "internships" },
  { name: "Editing", slug: "editing" }
];

const STARTER_BLOGS = [
  {
    title: "APPSC Group 2 Notification: Complete Syllabus & Study Plan",
    slug: "appsc-group-2-notification-complete-syllabus-study-plan",
    excerpt: "Get details about the official APPSC Group 2 syllabus, exam pattern, and subject-wise strategy.",
    content: `
      <h1>APPSC Group 2 Syllabus & Subject Strategy</h1>
      <p>Andhra Pradesh Public Service Commission (APPSC) has released the Group 2 recruitment schedule. Candidates preparing for Group 2 jobs must format their preparation according to the latest syllabus.</p>
      <h2>Exam Pattern & Marks Break-up</h2>
      <ul>
        <li><strong>Preliminary Screening Test:</strong> General Studies (150 Marks)</li>
        <li><strong>Main Examination:</strong> Paper 1 & Paper 2 (150 Marks each)</li>
      </ul>
      <blockquote>Verify all notices with the official APPSC website before registrations.</blockquote>
    `,
    featuredImg: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "APPSC Group 2, AP Govt Jobs, Syllabus",
    tagSlug: "govt-jobs"
  },
  {
    title: "TSPSC Group 4 Results & Expected Cutoff Marks",
    slug: "tspsc-group-4-results-expected-cutoff-marks",
    excerpt: "Expected cutoff list and results update for TSPSC Group 4 exams in Telangana.",
    content: `
      <h1>TSPSC Group 4 Cutoff Trends</h1>
      <p>Candidates are eagerly waiting for TSPSC Group 4 results. Expected cutoff ranges are analyzed based on candidate feedback across regional centers.</p>
      <h2>Expected Merit Cutoff (General Category)</h2>
      <p>The cutoff is predicted to be between 180 to 195 marks out of the total score.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "TSPSC Group 4, Results, Cutoff Marks",
    tagSlug: "results"
  },
  {
    title: "Top 10 Scholarships for Telugu Students in 2026",
    slug: "top-10-scholarships-for-telugu-students-in-2026",
    excerpt: "Excellent financial aid opportunities and scholarships matching criteria for AP & TS students.",
    content: `
      <h1>Scholarships for Higher Studies</h1>
      <p>Find standard corporate and government scholarship opportunities for degree, engineering, and medical courses in Andhra Pradesh & Telangana.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Scholarships, Telugu students, Education aid",
    tagSlug: "scholarships"
  },
  {
    title: "How to Prepare for Bank PO Exams: A Step-by-Step Guide",
    slug: "how-to-prepare-for-bank-po-exams-a-step-by-step-guide",
    excerpt: "Learn how to crack Bank Probationary Officer (PO) exams using this systematic daily study plan.",
    content: `
      <h1>Bank PO Prep Blueprint</h1>
      <p>Banking jobs are highly sought after. Focus on quantitative aptitude, logical reasoning, and general English grammar patterns to pass pre-screens easily.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Bank PO, IBPS Prep, Reasoning strategy",
    tagSlug: "study-tips"
  },
  {
    title: "Best Work From Home Jobs for College Students in India",
    slug: "best-work-from-home-jobs-for-college-students-in-india",
    excerpt: "Discover online part-time opportunities like typing, tutoring, and content writing.",
    content: `
      <h1>Part-time Online Jobs</h1>
      <p>Students can support their expenses through remote data entry, translation jobs, virtual assistant posts, or social media management.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Work from home, Student income, Part time jobs",
    tagSlug: "part-time-income"
  },
  {
    title: "Introduction to Share Market: How to Start Investing Safely",
    slug: "introduction-to-share-market-how-to-start-investing-safely",
    excerpt: "Learn stock market basics, mutual funds, and safe investing strategies for beginners.",
    content: `
      <h1>Stock Market Guide</h1>
      <p>Investing early is great, but understand the risks. Start with mutual funds, SIPs, and index funds before trading high-volatility direct equities.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Share market, Investing, Finance tips",
    tagSlug: "share-market"
  },
  {
    title: "How to Use AI Prompts for Faster Academic Writing",
    slug: "how-to-use-ai-prompts-for-faster-academic-writing",
    excerpt: "Boost study productivity using ChatGPT and Gemini prompts for revision.",
    content: `
      <h1>Academic AI Prompts</h1>
      <p>AI tools can explain difficult engineering or scientific terms in simple words if you feed them targeted prompts. Use ChatGPT responsibly to review concepts.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "AI prompts, Study hacks, ChatGPT tips",
    tagSlug: "ai-prompts"
  },
  {
    title: "YouTube Channel Growth Strategy for Telugu Creators",
    slug: "youtube-channel-growth-strategy-for-telugu-creators",
    excerpt: "A complete manual on finding your niche, editing, and using SEO on YouTube.",
    content: `
      <h1>YouTube Telugu Growth Manual</h1>
      <p>Find your niche topic, focus on high quality audio, utilize clicky thumbnails, and configure Telugu video search keywords to grow rapidly.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "YouTube growth, Creator tips, SEO tips",
    tagSlug: "youtube-growth"
  },
  {
    title: "How to Build a Professional Brand on Instagram",
    slug: "how-to-build-a-professional-brand-on-instagram",
    excerpt: "Turn your Instagram account into a professional portfolio showcasing your skills.",
    content: `
      <h1>Professional Instagram Branding</h1>
      <p>Learn how design templates, Reels strategies, and consistent updates can convert standard profile pages into professional portfolio pipelines.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Instagram branding, Digital presence, Reels tips",
    tagSlug: "instagram"
  },
  {
    title: "Top 10 Mobile Security Hacks Every Student Should Know",
    slug: "top-10-mobile-security-hacks-every-student-should-know",
    excerpt: "Protect your phone from spam, malware, and privacy breaches.",
    content: `
      <h1>Mobile Security Checklist</h1>
      <p>Avoid sideloading applications from unknown domains, review app permissions, secure financial accounts, and check spam numbers with simple rules.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Mobile security, Spam blocker, Privacy tips",
    tagSlug: "mobile-hacks"
  },
  {
    title: "Must-Use Free AI Tools for Coding & Design in 2026",
    slug: "must-use-free-ai-tools-for-coding-design-in-2026",
    excerpt: "Top AI applications that will assist you in generating designs and coding templates.",
    content: `
      <h1>Free Developer AI Tools</h1>
      <p>Explore tools like v0.dev, Bolt.new, and Cursor editor configurations to build projects five times faster.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "AI Tools, Web design, Free Coding aid",
    tagSlug: "ai-tools"
  },
  {
    title: "Digital Marketing Basics for Small Startups & Beginners",
    slug: "digital-marketing-basics-for-small-startups-and-beginners",
    excerpt: "Master SEO, social media marketing, and email newsletters on a budget.",
    content: `
      <h1>Digital Marketing 101</h1>
      <p>Focus on local SEO listings, share engaging user feedback on social reels, and deploy simple newsletters to retain customers.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Digital Marketing, SEO basics, Startup guide",
    tagSlug: "marketing"
  },
  {
    title: "5 High-Potential Startup Ideas for College Grads",
    slug: "5-high-potential-startup-ideas-for-college-grads",
    excerpt: "Profitable service and product business ideas you can launch from a dorm room.",
    content: `
      <h1>College Startup Blueprints</h1>
      <p>Explore local delivery apps, AI editing agencies, student hostels facilities networks, and custom exam coaching programs.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Startup ideas, Entrepreneurship, Student businesses",
    tagSlug: "startup-ideas"
  },
  {
    title: "The Future of Web Development: Next.js 16 Explained",
    slug: "the-future-of-web-development-nextjs-16-explained",
    excerpt: "A deep dive into server components, client cache optimizations, and new compiler options.",
    content: `
      <h1>Next.js 16 Features</h1>
      <p>Next.js 16 offers optimized compiler setups, faster hot-reloading times, and advanced streaming interfaces for heavy data dashboards.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Next.js 16, React, Web development trend",
    tagSlug: "technology"
  },
  {
    title: "Top Websites & Apps for Free NCERT Textbook PDFs",
    slug: "top-websites-apps-for-free-ncert-textbook-pdfs",
    excerpt: "Download all school and board textbook PDF syllabus guides instantly.",
    content: `
      <h1>NCERT Free PDFs list</h1>
      <p>Check the official NCERT portal and certified regional apps to get free chapters and textbooks for study reference.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "NCERT books, School PDFs, Study resources",
    tagSlug: "apps-websites"
  },
  {
    title: "How to Build and Grow a Facebook Group Community",
    slug: "how-to-build-and-grow-a-facebook-group-community",
    excerpt: "Strategy guide to getting active engagement and organic reach in groups.",
    content: `
      <h1>Facebook Group Growth Strategy</h1>
      <p>Maintain strict moderation guidelines, schedule daily interactive polls, and reply instantly to user posts to build trust.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Facebook groups, Community building, Social media growth",
    tagSlug: "facebook"
  },
  {
    title: "Daily Current Affairs: Key National & International News",
    slug: "daily-current-affairs-key-national-international-news",
    excerpt: "Stay updated with important international events and current affairs for competitive exams.",
    content: `
      <h1>Current Affairs Updates</h1>
      <p>Read today's summarized news covering science projects, global summits, national trade policies, and sports awards.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Current affairs, Daily news, General knowledge",
    tagSlug: "current-affairs"
  },
  {
    title: "Railway Recruitment Board (RRB) NTPC Exam Prep Guide",
    slug: "railway-recruitment-board-rrb-ntpc-exam-prep-guide",
    excerpt: "Everything you need to know about RRB NTPC syllabus, exams dates, and mocks.",
    content: `
      <h1>RRB NTPC preparation roadmap</h1>
      <p>Practice past papers covering numerical methods, GK, and computer tests to secure scoring cutoffs.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "RRB NTPC, Railway Jobs, Exam guide",
    tagSlug: "exam-prep"
  },
  {
    title: "Central Government Job Openings: SSC CGL 2026 Guide",
    slug: "central-government-job-openings-ssc-cgl-2026-guide",
    excerpt: "Detailed breakdown of the SSC CGL notification, post-wise vacancies, and online form.",
    content: `
      <h1>SSC CGL vacancies strategy</h1>
      <p>Check the educational criteria, age limit details, tier 1 mock guidelines, and apply online before last date warnings.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "SSC CGL, Central Jobs, SSC forms",
    tagSlug: "govt-jobs"
  },
  {
    title: "Indian Army Agniveer Recruitment Cycle Details",
    slug: "indian-army-agniveer-recruitment-cycle-details",
    excerpt: "Age limit, physical tests parameters, and online registry details for Agniveer program.",
    content: `
      <h1>Army Agniveer Registry manual</h1>
      <p>Prepare physical training patterns, running parameters, and primary written exam details to qualify for final selection.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1508847154043-be12a62861c1?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Agniveer, Indian Army, Defense Jobs",
    tagSlug: "govt-jobs-updates"
  },
  {
    title: "AP Intermediate Board Exam Preparation & Model Papers",
    slug: "ap-intermediate-board-exam-preparation-model-papers",
    excerpt: "Download intermediate board physics, maths, and chemistry sample papers.",
    content: `
      <h1>AP Inter Model papers lists</h1>
      <p>Solve previous years question papers and sample templates to improve score margins in board exam cycles.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "AP Intermediate, Inter syllabus, Board papers",
    tagSlug: "files-materials"
  },
  {
    title: "TS Inter Board Exam Answer Keys & Results Updates",
    slug: "ts-inter-board-exam-answer-keys-results-updates",
    excerpt: "Check direct links and dates for TS Intermediate board results release.",
    content: `
      <h1>TS Inter Board exam results guidelines</h1>
      <p>Access official subdomains directly using candidate hall ticket code numbers to fetch score sheets.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1588072405854-d1a73392ee21?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "TS Inter results, Answer key, Score sheets",
    tagSlug: "results"
  },
  {
    title: "National Scholarship Portal (NSP) Online Registration Guide",
    slug: "national-scholarship-portal-nsp-online-registration-guide",
    excerpt: "Step-by-step application instructions and documents criteria for NSP online.",
    content: `
      <h1>NSP registration checklists</h1>
      <p>Prepare income certificates, academic marks list, bank details, and aadhaar linkage sheets before submitting NSP forms.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "NSP scholarship, Online registry, Central aid",
    tagSlug: "scholarships"
  },
  {
    title: "TCS NQT 2026 Placement Syllabus & Interview Prep",
    slug: "tcs-nqt-2026-placement-syllabus-interview-prep",
    excerpt: "How freshers can prepare for TCS National Qualifier Test (NQT) coding and cognitive sections.",
    content: `
      <h1>TCS NQT placement tips</h1>
      <p>Practice competitive coding challenges, review mock questions covering data structures, and focus on logical reasoning loops.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "TCS NQT, IT jobs, Coding interview prep",
    tagSlug: "internships"
  },
  {
    title: "Wipro & Infosys Off-Campus Drive Updates for Freshers",
    slug: "wipro-infosys-off-campus-drive-updates-for-freshers",
    excerpt: "Application links and interview schedules for Wipro Elite NTH and Infosys off-campus drives.",
    content: `
      <h1>Off campus drive registration</h1>
      <p>Submit college transcripts, build code portfolios, and prepare basic mock questions on core Java/Python concepts.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Off campus placements, IT careers, Freshman jobs",
    tagSlug: "internships"
  },
  {
    title: "Video Editing for Reels and YouTube: Best Mobile Tools",
    slug: "video-editing-for-reels-and-youtube-best-mobile-tools",
    excerpt: "Learn how to edit high quality reels using CapCut, VN Editor, and mobile apps.",
    content: `
      <h1>Mobile Video editing tutorial</h1>
      <p>Focus on smooth keyframe animations, audio synchronization levels, clean title overlay templates, and WebP compression formats.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Video editing, CapCut hacks, Reels editing",
    tagSlug: "editing"
  },
  {
    title: "How to Write a Resume that Gets Selected by ATS",
    slug: "how-to-write-a-resume-that-gets-selected-by-ats",
    excerpt: "Optimizing your resume keywords to beat Applicant Tracking Systems (ATS) software.",
    content: `
      <h1>ATS resume building rules</h1>
      <p>Avoid using complex multi-column tables, match job description keyword tags, list measurable project metrics, and use clean formats.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "ATS Resume, Job selection, Placement hacks",
    tagSlug: "career-jobs"
  },
  {
    title: "Highest Paying Software Engineering Internships in India",
    slug: "highest-paying-software-engineering-internships-in-india",
    excerpt: "List of tech companies offering student internships paying over INR 50k per month.",
    content: `
      <h1>High paying internship updates</h1>
      <p>Look out for application portals at companies like Amazon, Adobe, Google, and Indian product startups during seasonal hiring sprints.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Tech Internships, High pay careers, Software engineering",
    tagSlug: "internships"
  },
  {
    title: "Central Sector Scholarship Scheme Eligibility Checklist",
    slug: "central-sector-scholarship-scheme-eligibility-checklist",
    excerpt: "Find out if you qualify for the CSSS college students financial grant.",
    content: `
      <h1>CSSS scholarship criteria</h1>
      <p>Eligible candidates must rank in the top 80th percentile of their state intermediate board results and have family income below threshold limits.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "CSSS scholarship, College grant, Eligibility",
    tagSlug: "scholarships"
  },
  {
    title: "How to Stay Focused During Competitive Exam Prep",
    slug: "how-to-stay-focused-during-competitive-exam-prep",
    excerpt: "Effective time-boxing and mindfulness tips for long study durations.",
    content: `
      <h1>Exam Prep Focus blueprint</h1>
      <p>Deploy the Pomodoro study technique, isolate screen notifications, block out distraction hours, and maintain uniform sleep schedules.</p>
    `,
    featuredImg: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800",
    seoKeywords: "Study focus, Exam stress, Productivity loops",
    tagSlug: "study-tips"
  }
];

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // Apply full-text search SQL functions and triggers
  try {
    const ftsSqlPath = path.join(process.cwd(), "prisma", "full_text_search.sql");
    if (fs.existsSync(ftsSqlPath)) {
      console.log("🔍 Applying Full Text Search triggers and functions...");
      const sqlContent = fs.readFileSync(ftsSqlPath, "utf-8");
      await prisma.$executeRawUnsafe(sqlContent);
      console.log("✅ Full Text Search function and triggers configured successfully.");
    }
  } catch (err) {
    console.error("⚠️ Failed to apply Full Text Search schema setup:", err.message);
  }

  // 1. Seed Default SiteSettings if missing
  const settingsCount = await prisma.siteSetting.count();
  if (settingsCount === 0) {
    await prisma.siteSetting.create({
      data: {
        id: "default",
        siteName: "Students Hub",
        siteTagline: "Learn • Grow • Build a Better Future",
        siteLogo: "/logo.png",
        siteFavicon: "/logo.png",
        supportEmail: "support@studentsvoice.in",
        contactPhone: "+91 98765 43210",
        contactAddress: "Hyderabad, Telangana, India",
        workingHours: "Mon - Sat: 9:00 AM - 6:00 PM IST",
      }
    });
    console.log("✅ Seeded default SiteSettings.");
  }

  // 2. Seed Default Tags/Categories if missing
  console.log("🏷️ Seeding default categories...");
  const tagMapping = {};
  for (const defaultTag of DEFAULT_TAGS) {
    let tagRecord = await prisma.tag.findUnique({
      where: { slug: defaultTag.slug }
    });

    if (!tagRecord) {
      tagRecord = await prisma.tag.create({
        data: {
          name: defaultTag.name,
          slug: defaultTag.slug
        }
      });
      console.log(`➕ Added Tag: ${defaultTag.name}`);
    }
    tagMapping[defaultTag.slug] = tagRecord.id;
  }

  // 3. Seed Starter Blogs if none exist
  const blogCount = await prisma.blog.count();
  if (blogCount > 0) {
    console.log("⏩ Database already contains blogs. Skipping starter blogs seeding.");
    return;
  }

  console.log(`📝 Seeding ${STARTER_BLOGS.length} starter blogs...`);
  for (const starter of STARTER_BLOGS) {
    const tagId = tagMapping[starter.tagSlug];
    if (!tagId) continue;

    // Create the blog and link the tag
    await prisma.blog.create({
      data: {
        title: starter.title,
        slug: starter.slug,
        excerpt: starter.excerpt,
        content: starter.content,
        featuredImg: starter.featuredImg,
        seoKeywords: starter.seoKeywords,
        tags: {
          create: {
            tagId: tagId
          }
        }
      }
    });
    console.log(`🚀 Created Blog: ${starter.title}`);
  }

  // 4. Seed Homepage Manager Data if tables are empty
  console.log("🖥️ Seeding Homepage Manager models...");

  const slideCount = await prisma.slideData.count();
  if (slideCount === 0) {
    await prisma.slideData.createMany({
      data: [
        {
          title: "APPSC Group 2 Preliminary Exam Preparation Blueprint",
          image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
          readTime: "5 min read",
          date: "August 14, 2026",
          author: "Karthikeya",
          badge: ["Govt Jobs", "Exam Prep"],
          href: "/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan",
          isActive: true
        },
        {
          title: "Top Scholarships Offering Free Education Aid for Degree Aspirants",
          image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
          readTime: "4 min read",
          date: "August 13, 2026",
          author: "Keerthana Reddy",
          badge: ["Scholarships"],
          href: "/scholarships/top-10-scholarships-for-telugu-students-in-2026",
          isActive: true
        },
        {
          title: "Next.js 16 Compiler Optimizations and Web Dev Trends",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          readTime: "6 min read",
          date: "August 12, 2026",
          author: "Rohith Reddy",
          badge: ["Technology", "Tech News"],
          href: "/technology/the-future-of-web-development-nextjs-16-explained",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded SlideData.");
  }

  const rightCardsCount = await prisma.rightCards.count();
  if (rightCardsCount === 0) {
    await prisma.rightCards.createMany({
      data: [
        {
          title: "How to Stay Focused During Long Study Sessions",
          image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800",
          date: "Today",
          badge: ["Study Tips"],
          href: "/study-tips/how-to-stay-focused-during-competitive-exam-prep",
          isActive: true
        },
        {
          title: "ATS-Friendly Resume Building Techniques for 2026",
          image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
          date: "Yesterday",
          badge: ["Career & Jobs"],
          href: "/career-jobs/how-to-write-a-resume-that-gets-selected-by-ats",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded RightCards.");
  }

  const latestNewsCount = await prisma.latestNews.count();
  if (latestNewsCount === 0) {
    await prisma.latestNews.createMany({
      data: [
        {
          tag: "Govt Jobs",
          tagColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
          title: "SSC CGL 2026 Vacancy List Released: Apply Before Last Date Warnings",
          date: "August 14, 2026",
          read: "4 min read",
          href: "/govt-jobs/central-government-job-openings-ssc-cgl-2026-guide",
          isActive: true
        },
        {
          tag: "Results",
          tagColor: "bg-emerald-600",
          image: "https://images.unsplash.com/photo-1588072405854-d1a73392ee21?auto=format&fit=crop&q=80&w=800",
          title: "TS Intermediate Board Results expected score margins analysis",
          date: "August 13, 2026",
          read: "3 min read",
          href: "/results/ts-inter-board-exam-answer-keys-results-updates",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded LatestNews.");
  }

  const trendingNewsCount = await prisma.trendingNews.count();
  if (trendingNewsCount === 0) {
    await prisma.trendingNews.createMany({
      data: [
        {
          title: "Railway Recruitment Board NTPC syllabus roadmap released",
          image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
          date: "Trending",
          href: "/exam-prep/railway-recruitment-board-rrb-ntpc-exam-prep-guide",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded TrendingNews.");
  }

  const popularTopicsCount = await prisma.popularTopics.count();
  if (popularTopicsCount === 0) {
    await prisma.popularTopics.createMany({
      data: [
        {
          topic: "Govt Jobs",
          labelColor: "bg-blue-50 text-blue-700 border-blue-200",
          href: "/govt-jobs",
          isActive: true
        },
        {
          topic: "Scholarships",
          labelColor: "bg-orange-50 text-orange-700 border-orange-200",
          href: "/scholarships",
          isActive: true
        },
        {
          topic: "Study Tips",
          labelColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          href: "/study-tips",
          isActive: true
        },
        {
          topic: "Internships",
          labelColor: "bg-purple-50 text-purple-700 border-purple-200",
          href: "/internships",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded PopularTopics.");
  }

  const studyMaterialCount = await prisma.studyMaterial.count();
  if (studyMaterialCount === 0) {
    await prisma.studyMaterial.createMany({
      data: [
        {
          title: "AP Intermediate Model Physics Paper PDF",
          href: "/files-materials/ap-intermediate-board-exam-preparation-model-papers",
          isActive: true
        },
        {
          title: "TS Intermediate Board Chemistry Syllabus Sheet",
          href: "/results/ts-inter-board-exam-answer-keys-results-updates",
          isActive: true
        },
        {
          title: "Railway Recruitment Board NTPC study reference guides",
          href: "/exam-prep/railway-recruitment-board-rrb-ntpc-exam-prep-guide",
          isActive: true
        },
        {
          title: "APPSC Group 2 General Studies Practice Set PDF",
          href: "/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan",
          isActive: true
        },
        {
          title: "TCS NQT Placement Cognitive Syllabus Material",
          href: "/internships/tcs-nqt-2026-placement-syllabus-interview-prep",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded StudyMaterial.");
  }

  const technologyNewsCount = await prisma.technologyNews.count();
  if (technologyNewsCount === 0) {
    await prisma.technologyNews.createMany({
      data: [
        {
          title: "Must-Use Free AI Tools for Coding & Design in 2026",
          image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
          href: "/ai-tools/must-use-free-ai-tools-for-coding-design-in-2026",
          isActive: true
        },
        {
          title: "The Future of Web Development: Next.js 16 Compiler Breakdown",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          href: "/technology/the-future-of-web-development-nextjs-16-explained",
          isActive: true
        },
        {
          title: "How Bolt.new and v0.dev are Changing Frontend Prototyping",
          image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
          href: "/ai-tools/must-use-free-ai-tools-for-coding-design-in-2026",
          isActive: true
        },
        {
          title: "Top AI Code Editors for Students: Cursor vs VS Code Copilot",
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
          href: "/ai-tools/must-use-free-ai-tools-for-coding-design-in-2026",
          isActive: true
        },
        {
          title: "How to Build Fullstack Apps in 10 Minutes with AI Prompts",
          image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800",
          href: "/ai-prompts/how-to-use-ai-prompts-for-faster-academic-writing",
          isActive: true
        },
        {
          title: "The Rise of Edge Databases: Neon Postgres and Turso SQLite",
          image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
          href: "/technology/the-future-of-web-development-nextjs-16-explained",
          isActive: true
        },
        {
          title: "WebAssembly in 2026: Running C++ and Rust on the Client Browser",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
          href: "/technology/the-future-of-web-development-nextjs-16-explained",
          isActive: true
        },
        {
          title: "Why TailWindCSS v4.0 is the Fastest CSS Utility Library Yet",
          image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
          href: "/technology/the-future-of-web-development-nextjs-16-explained",
          isActive: true
        },
        {
          title: "Building Microfrontends with Module Federation in Vite and Next",
          image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
          href: "/technology/the-future-of-web-development-nextjs-16-explained",
          isActive: true
        },
        {
          title: "How to Secure Your Web Apps Against OWASP Top 10 Vulnerabilities",
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
          href: "/mobile-hacks/top-10-mobile-security-hacks-every-student-should-know",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded TechnologyNews.");
  }

  const webStoryCount = await prisma.webStory.count();
  if (webStoryCount === 0) {
    await prisma.webStory.createMany({
      data: [
        {
          title: "5 Tips to Clear Group Exams",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
          href: "/study-tips/how-to-stay-focused-during-competitive-exam-prep",
          isActive: true
        },
        {
          title: "Highest Paying Student Internships 2026",
          image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800",
          href: "/internships/highest-paying-software-engineering-internships-in-india",
          isActive: true
        },
        {
          title: "Top 5 Websites for Free Textbook PDFs",
          image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
          href: "/apps-websites/top-websites-apps-for-free-ncert-textbook-pdfs",
          isActive: true
        },
        {
          title: "Work From Home Job Roles for Freshers",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
          href: "/part-time-income/best-work-from-home-jobs-for-college-students-in-india",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded WebStory.");
  }

  const videoCount = await prisma.video.count();
  if (videoCount === 0) {
    await prisma.video.createMany({
      data: [
        {
          title: "How to Build a Professional Brand on Instagram",
          image: "https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg",
          badge: "12:15",
          href: "https://www.youtube.com/watch?v=y6120QOlsfU",
          isActive: true
        },
        {
          title: "YouTube Channel Growth Strategy for Telugu Creators",
          image: "https://img.youtube.com/vi/F3_qfO0P5-c/mqdefault.jpg",
          badge: "08:45",
          href: "https://www.youtube.com/watch?v=F3_qfO0P5-c",
          isActive: true
        },
        {
          title: "VN Editor Hacks: Pro Video Editing on Mobile",
          image: "https://img.youtube.com/vi/Ke90Tje7VS0/mqdefault.jpg",
          badge: "14:20",
          href: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          isActive: true
        },
        {
          title: "Next.js 16 Compiler Optimizations and Web Dev Trends",
          image: "https://img.youtube.com/vi/HXYTNuL7-O0/mqdefault.jpg",
          badge: "10:30",
          href: "https://www.youtube.com/watch?v=HXYTNuL7-O0",
          isActive: true
        },
        {
          title: "Python Programming Full Course for Beginners",
          image: "https://img.youtube.com/vi/9P1vW6YdC68/mqdefault.jpg",
          badge: "45:10",
          href: "https://www.youtube.com/watch?v=9P1vW6YdC68",
          isActive: true
        },
        {
          title: "How to Write a Resume that Gets Selected by ATS Scanner",
          image: "https://img.youtube.com/vi/dD2EISBDjWM/mqdefault.jpg",
          badge: "06:15",
          href: "https://www.youtube.com/watch?v=dD2EISBDjWM",
          isActive: true
        },
        {
          title: "Digital Marketing Complete Roadmap for College Grads",
          image: "https://img.youtube.com/vi/tVzUXW6siu0/mqdefault.jpg",
          badge: "11:55",
          href: "https://www.youtube.com/watch?v=tVzUXW6siu0",
          isActive: true
        },
        {
          title: "How to Stay Highly Productive and Focused While Studying",
          image: "https://img.youtube.com/vi/7fPXI_MnOPc/mqdefault.jpg",
          badge: "09:40",
          href: "https://www.youtube.com/watch?v=7fPXI_MnOPc",
          isActive: true
        },
        {
          title: "Central Sector & Corporate Scholarship Schemes Registration Guide",
          image: "https://img.youtube.com/vi/8M0yKkZ8S9c/mqdefault.jpg",
          badge: "13:20",
          href: "https://www.youtube.com/watch?v=8M0yKkZ8S9c",
          isActive: true
        },
        {
          title: "High Paying Remote Jobs & Internships for College Grads",
          image: "https://img.youtube.com/vi/uD4izuPDy_A/mqdefault.jpg",
          badge: "07:50",
          href: "https://www.youtube.com/watch?v=uD4izuPDy_A",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded Video.");
  }

  const mostReadCount = await prisma.mostRead.count();
  if (mostReadCount === 0) {
    await prisma.mostRead.createMany({
      data: [
        {
          title: "Top 10 Scholarships for Telugu Students in 2026",
          image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
          href: "/scholarships/top-10-scholarships-for-telugu-students-in-2026",
          isActive: true
        },
        {
          title: "How to Prepare for Bank PO Exams: A Step-by-Step Study Guide",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
          href: "/study-tips/how-to-prepare-for-bank-po-exams-a-step-by-step-guide",
          isActive: true
        },
        {
          title: "APPSC Group 2 Recruitment Notification: Syllabus & Strategy",
          image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
          href: "/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan",
          isActive: true
        },
        {
          title: "TSPSC Group 4 Results & Expected Cutoff Marks Sheet",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
          href: "/results/tspsc-group-4-results-expected-cutoff-marks",
          isActive: true
        },
        {
          title: "Best Work From Home Jobs for College Students in India",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
          href: "/part-time-income/best-work-from-home-jobs-for-college-students-in-india",
          isActive: true
        },
        {
          title: "Introduction to Share Market: Investing Guide for Beginners",
          image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
          href: "/share-market/introduction-to-share-market-how-to-start-investing-safely",
          isActive: true
        },
        {
          title: "How to Use AI Prompts for Faster Academic Writing",
          image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800",
          href: "/ai-prompts/how-to-use-ai-prompts-for-faster-academic-writing",
          isActive: true
        },
        {
          title: "YouTube Channel Growth Strategy for Telugu Creators",
          image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
          href: "/youtube-growth/youtube-channel-growth-strategy-for-telugu-creators",
          isActive: true
        },
        {
          title: "How to Build a Professional Brand on Instagram Page",
          image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&q=80&w=800",
          href: "/instagram/how-to-build-a-professional-brand-on-instagram",
          isActive: true
        },
        {
          title: "Top 10 Mobile Security Hacks Every Student Should Know",
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
          href: "/mobile-hacks/top-10-mobile-security-hacks-every-student-should-know",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded MostRead.");
  }

  const videoGalleryCount = await prisma.videoGallery.count();
  if (videoGalleryCount === 0) {
    await prisma.videoGallery.createMany({
      data: [
        {
          title: "YouTube Telugu Growth Video Manual Guide",
          image: "https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg",
          duration: "10:45",
          category: "YouTube Tips",
          href: "https://www.youtube.com/watch?v=y6120QOlsfU",
          isActive: true
        },
        {
          title: "Instagram Page Setup & Growth Masterclass",
          image: "https://img.youtube.com/vi/F3_qfO0P5-c/mqdefault.jpg",
          duration: "14:10",
          category: "Instagram Growth",
          href: "https://www.youtube.com/watch?v=F3_qfO0P5-c",
          isActive: true
        },
        {
          title: "Mobile Video Editing Hacks using VN Editor & CapCut",
          image: "https://img.youtube.com/vi/Ke90Tje7VS0/mqdefault.jpg",
          duration: "08:35",
          category: "Video Editing",
          href: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          isActive: true
        },
        {
          title: "Next.js 16 Web Development Framework Compiler Review",
          image: "https://img.youtube.com/vi/HXYTNuL7-O0/mqdefault.jpg",
          duration: "11:55",
          category: "Technology",
          href: "https://www.youtube.com/watch?v=HXYTNuL7-O0",
          isActive: true
        },
        {
          title: "Python Full Language Roadmap for Absolute Beginners",
          image: "https://img.youtube.com/vi/9P1vW6YdC68/mqdefault.jpg",
          duration: "25:40",
          category: "Coding",
          href: "https://www.youtube.com/watch?v=9P1vW6YdC68",
          isActive: true
        },
        {
          title: "Write an ATS-Optimized Resume to Beat Scan Software",
          image: "https://img.youtube.com/vi/dD2EISBDjWM/mqdefault.jpg",
          duration: "06:15",
          category: "Placement Tips",
          href: "https://www.youtube.com/watch?v=dD2EISBDjWM",
          isActive: true
        },
        {
          title: "Complete Digital Marketing Masterclass for Beginners",
          image: "https://img.youtube.com/vi/tVzUXW6siu0/mqdefault.jpg",
          duration: "15:20",
          category: "Marketing",
          href: "https://www.youtube.com/watch?v=tVzUXW6siu0",
          isActive: true
        },
        {
          title: "Mindfulness & Pomodoro Study Tips for High Focus",
          image: "https://img.youtube.com/vi/7fPXI_MnOPc/mqdefault.jpg",
          duration: "09:12",
          category: "Study Tips",
          href: "https://www.youtube.com/watch?v=7fPXI_MnOPc",
          isActive: true
        },
        {
          title: "National & Corporate Scholarship Portals Selection Guide",
          image: "https://img.youtube.com/vi/8M0yKkZ8S9c/mqdefault.jpg",
          duration: "13:45",
          category: "Scholarships",
          href: "https://www.youtube.com/watch?v=8M0yKkZ8S9c",
          isActive: true
        },
        {
          title: "Top Remote Freelance Jobs for University Students",
          image: "https://img.youtube.com/vi/uD4izuPDy_A/mqdefault.jpg",
          duration: "07:22",
          category: "Career & Jobs",
          href: "https://www.youtube.com/watch?v=uD4izuPDy_A",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded VideoGallery.");
  }

  const youMayLikeCount = await prisma.youMayLike.count();
  if (youMayLikeCount === 0) {
    await prisma.youMayLike.createMany({
      data: [
        {
          headline: "Best Work From Home Jobs for College Students in India",
          description: "Explore flexible part-time options that pay well for college students.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
          href: "/part-time-income/best-work-from-home-jobs-for-college-students-in-india",
          isActive: true
        },
        {
          headline: "Introduction to Share Market: Investing Blueprint for Beginners",
          description: "Learn safe ways to allocate small capitals in equities and mutual funds.",
          image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
          href: "/share-market/introduction-to-share-market-how-to-start-investing-safely",
          isActive: true
        },
        {
          headline: "ATS-Friendly Resume Blueprint: Optimize Keywords Instantly",
          description: "Format resume descriptors correctly to pass applicant parsing tracking systems.",
          image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
          href: "/career-jobs/how-to-write-a-resume-that-gets-selected-by-ats",
          isActive: true
        },
        {
          headline: "APPSC Group 2 Core Preparation Strategy & Daily Study Hours",
          description: "Organize mock practices and history timelines to pass preliminary thresholds.",
          image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
          href: "/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan",
          isActive: true
        },
        {
          headline: "TSPSC Group 4 Expected Cutoff Marks & Score Verification",
          description: "Verify document listing guidelines and regional merit metrics trends.",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
          href: "/results/tspsc-group-4-results-expected-cutoff-marks",
          isActive: true
        },
        {
          headline: "Free NCERT Textbooks Chapter PDFs for All Boards",
          description: "Download certified NCERT textbook chapters for exam preparation reference.",
          image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
          href: "/apps-websites/top-websites-apps-for-free-ncert-textbook-pdfs",
          isActive: true
        },
        {
          headline: "TCS NQT placement syllabus, questions pattern guidelines",
          description: "A complete prep manual for programming, verbal and aptitude tests.",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
          href: "/internships/tcs-nqt-2026-placement-syllabus-interview-prep",
          isActive: true
        },
        {
          headline: "How to secure high paying Software Engineering Internships",
          description: "Prepare resume descriptors and build GitHub projects to catch recruiters eyes.",
          image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800",
          href: "/internships/highest-paying-software-engineering-internships-in-india",
          isActive: true
        },
        {
          headline: "Daily Current Affairs: National and Global Summits updates",
          description: "Read today's mock general knowledge summary to study current events easily.",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
          href: "/current-affairs/daily-current-affairs-key-national-international-news",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded YouMayLike.");
  }

  const aiPromptCount = await prisma.aiPrompt.count();
  if (aiPromptCount === 0) {
    await prisma.aiPrompt.createMany({
      data: [
        {
          title: "Write ATS Resume description summary",
          image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800",
          prompt: "Optimize the following resume bullet points for ATS scanner software.",
          isActive: true
        },
        {
          title: "Translate academic studies to basic Telugu",
          image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
          prompt: "Translate this technical computer science concept into simple, easy-to-understand Telugu terms.",
          isActive: true
        },
        {
          title: "Generate mock practice questions for Bank PO exams",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
          prompt: "Generate a list of 5 hard quantitative aptitude questions with step-by-step explanations.",
          isActive: true
        },
        {
          title: "Refactor standard Javascript to clean ES6 standards",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          prompt: "Refactor the following legacy JS function parameters using map and filter modern methods.",
          isActive: true
        },
        {
          title: "Summarize dry official government notifications list",
          image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
          prompt: "Summarize this long notification page details into 5 bullet points with deadlines highlighted.",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded AiPrompt.");
  }

  const materialFileCount = await prisma.materialFile.count();
  if (materialFileCount === 0) {
    await prisma.materialFile.createMany({
      data: [
        {
          title: "AP Intermediate Model Physics Paper",
          fileUrl: "/uploads/ap-inter-physics.pdf",
          fileSize: "2.4 MB",
          fileType: "PDF",
          isActive: true
        },
        {
          title: "TS Intermediate Board Chemistry Syllabus Sheet",
          fileUrl: "/uploads/ts-inter-chemistry.pdf",
          fileSize: "1.8 MB",
          fileType: "PDF",
          isActive: true
        },
        {
          title: "Railway RRB NTPC Past Solved Papers Guide",
          fileUrl: "/uploads/rrb-ntpc-papers.pdf",
          fileSize: "5.2 MB",
          fileType: "PDF",
          isActive: true
        },
        {
          title: "APPSC Group 2 General Studies Syllabus Guide",
          fileUrl: "/uploads/appsc-gs-guide.pdf",
          fileSize: "3.1 MB",
          fileType: "PDF",
          isActive: true
        },
        {
          title: "TCS NQT Placement Practice Questions Set",
          fileUrl: "/uploads/tcs-nqt-practice.pdf",
          fileSize: "4.8 MB",
          fileType: "PDF",
          isActive: true
        }
      ]
    });
    console.log("✅ Seeded MaterialFile.");
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
