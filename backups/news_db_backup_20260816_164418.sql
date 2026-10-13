--
-- PostgreSQL database dump
--

\restrict hCRnUV3uPOaGU8KpwFBj3OPEdV1glx2275ucMJU3Vu7SbCOCd7i6y99d9N9ucxX

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AiPrompt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AiPrompt" (
    id text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    prompt text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AiPrompt" OWNER TO postgres;

--
-- Name: Blog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Blog" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    "featuredImg" text,
    "seoKeywords" text,
    search_vector tsvector,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Blog" OWNER TO postgres;

--
-- Name: BlogTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogTag" (
    "blogId" text NOT NULL,
    "tagId" text NOT NULL
);


ALTER TABLE public."BlogTag" OWNER TO postgres;

--
-- Name: LatestNews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LatestNews" (
    id text NOT NULL,
    tag text NOT NULL,
    "tagColor" text NOT NULL,
    image text,
    title text,
    date text NOT NULL,
    read text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LatestNews" OWNER TO postgres;

--
-- Name: MaterialFile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MaterialFile" (
    id text NOT NULL,
    title text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileSize" text NOT NULL,
    "fileType" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MaterialFile" OWNER TO postgres;

--
-- Name: MostRead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MostRead" (
    id text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MostRead" OWNER TO postgres;

--
-- Name: PopularTopics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PopularTopics" (
    id text NOT NULL,
    topic text NOT NULL,
    "labelColor" text NOT NULL,
    href text,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PopularTopics" OWNER TO postgres;

--
-- Name: RightCards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RightCards" (
    id text NOT NULL,
    image text,
    title text,
    date text NOT NULL,
    badge jsonb,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RightCards" OWNER TO postgres;

--
-- Name: SiteSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSetting" (
    id text DEFAULT 'default'::text NOT NULL,
    "siteName" text DEFAULT 'Students Hub'::text NOT NULL,
    "siteTagline" text DEFAULT 'Learn • Grow • Build a Better Future'::text NOT NULL,
    "siteLogo" text DEFAULT '/logo.png'::text NOT NULL,
    "siteFavicon" text DEFAULT '/logo.png'::text NOT NULL,
    "supportEmail" text DEFAULT 'support@studentsvoice.in'::text NOT NULL,
    "contactPhone" text DEFAULT '+91 98765 43210'::text NOT NULL,
    "contactAddress" text DEFAULT 'Hyderabad, Telangana, India'::text NOT NULL,
    "workingHours" text DEFAULT 'Mon - Sat: 9:00 AM - 6:00 PM IST'::text NOT NULL,
    "adminEmail" text DEFAULT 'admin@gmail.com'::text NOT NULL,
    "adminPassword" text DEFAULT 'admin123'::text NOT NULL,
    "metaTitle" text DEFAULT 'Students Hub - Latest Government Jobs, Education & Career Updates'::text NOT NULL,
    "metaDescription" text DEFAULT 'Get fast, reliable student news, notifications, study materials, mock tests, and career opportunities.'::text NOT NULL,
    "metaKeywords" text DEFAULT 'student news, government jobs, current affairs, internships, scholarships, study materials'::text NOT NULL,
    "canonicalUrl" text DEFAULT 'http://localhost'::text NOT NULL,
    "ogImage" text DEFAULT '/logo.png'::text NOT NULL,
    "twitterHandle" text DEFAULT '@studentsvoice'::text NOT NULL,
    "googleAnalyticsId" text DEFAULT ''::text NOT NULL,
    "googleSearchConsoleCode" text DEFAULT ''::text NOT NULL,
    facebook text DEFAULT 'https://facebook.com'::text NOT NULL,
    instagram text DEFAULT 'https://instagram.com'::text NOT NULL,
    twitter text DEFAULT 'https://twitter.com'::text NOT NULL,
    youtube text DEFAULT 'https://youtube.com'::text NOT NULL,
    telegram text DEFAULT 'https://t.me'::text NOT NULL,
    whatsapp text DEFAULT 'https://whatsapp.com'::text NOT NULL,
    linkedin text DEFAULT 'https://linkedin.com'::text NOT NULL,
    github text DEFAULT 'https://github.com'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteSetting" OWNER TO postgres;

--
-- Name: SlideData; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SlideData" (
    id text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    "readTime" text NOT NULL,
    date text NOT NULL,
    author text NOT NULL,
    badge jsonb NOT NULL,
    href text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SlideData" OWNER TO postgres;

--
-- Name: StudyMaterial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudyMaterial" (
    id text NOT NULL,
    href text,
    title text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudyMaterial" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: TechnologyNews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TechnologyNews" (
    id text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TechnologyNews" OWNER TO postgres;

--
-- Name: TrendingNews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrendingNews" (
    id text NOT NULL,
    image text,
    title text,
    date text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TrendingNews" OWNER TO postgres;

--
-- Name: Video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Video" (
    id text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    badge text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Video" OWNER TO postgres;

--
-- Name: VideoGallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VideoGallery" (
    id text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    duration text NOT NULL,
    category text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VideoGallery" OWNER TO postgres;

--
-- Name: WebStory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WebStory" (
    id text NOT NULL,
    title text NOT NULL,
    image text,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WebStory" OWNER TO postgres;

--
-- Name: YouMayLike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."YouMayLike" (
    id text NOT NULL,
    headline text NOT NULL,
    description text NOT NULL,
    image text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    href text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."YouMayLike" OWNER TO postgres;

--
-- Data for Name: AiPrompt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AiPrompt" (id, title, image, prompt, "isActive", "createdAt", "updatedAt") FROM stdin;
cmssoy788003hpk3gxqwjjj8l	Write ATS Resume description summary	https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800	Optimize the following resume bullet points for ATS scanner software.	t	2026-08-14 08:34:34.905	2026-08-14 08:34:34.905
cmssoy788003ipk3gc29lnh5p	Translate academic studies to basic Telugu	https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800	Translate this technical computer science concept into simple, easy-to-understand Telugu terms.	t	2026-08-14 08:34:34.905	2026-08-14 08:34:34.905
cmssoy788003jpk3gnmdn9fdx	Generate mock practice questions for Bank PO exams	https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800	Generate a list of 5 hard quantitative aptitude questions with step-by-step explanations.	t	2026-08-14 08:34:34.905	2026-08-14 08:34:34.905
cmssoy788003kpk3ghv3xwr9u	Refactor standard Javascript to clean ES6 standards	https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800	Refactor the following legacy JS function parameters using map and filter modern methods.	t	2026-08-14 08:34:34.905	2026-08-14 08:34:34.905
cmssoy789003lpk3gd6nhztjm	Summarize dry official government notifications list	https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800	Summarize this long notification page details into 5 bullet points with deadlines highlighted.	t	2026-08-14 08:34:34.905	2026-08-14 08:34:34.905
\.


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Blog" (id, title, slug, content, excerpt, "featuredImg", "seoKeywords", search_vector, "createdAt", "updatedAt") FROM stdin;
cmssoy6wu000ppk3gtkmu2t99	APPSC Group 2 Notification: Complete Syllabus & Study Plan	appsc-group-2-notification-complete-syllabus-study-plan	\n      <h1>APPSC Group 2 Syllabus & Subject Strategy</h1>\n      <p>Andhra Pradesh Public Service Commission (APPSC) has released the Group 2 recruitment schedule. Candidates preparing for Group 2 jobs must format their preparation according to the latest syllabus.</p>\n      <h2>Exam Pattern & Marks Break-up</h2>\n      <ul>\n        <li><strong>Preliminary Screening Test:</strong> General Studies (150 Marks)</li>\n        <li><strong>Main Examination:</strong> Paper 1 & Paper 2 (150 Marks each)</li>\n      </ul>\n      <blockquote>Verify all notices with the official APPSC website before registrations.</blockquote>\n    	Get details about the official APPSC Group 2 syllabus, exam pattern, and subject-wise strategy.	https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800	APPSC Group 2, AP Govt Jobs, Syllabus	\N	2026-08-14 08:34:34.495	2026-08-14 08:34:34.495
cmssoy6xa000qpk3gyuu30m85	TSPSC Group 4 Results & Expected Cutoff Marks	tspsc-group-4-results-expected-cutoff-marks	\n      <h1>TSPSC Group 4 Cutoff Trends</h1>\n      <p>Candidates are eagerly waiting for TSPSC Group 4 results. Expected cutoff ranges are analyzed based on candidate feedback across regional centers.</p>\n      <h2>Expected Merit Cutoff (General Category)</h2>\n      <p>The cutoff is predicted to be between 180 to 195 marks out of the total score.</p>\n    	Expected cutoff list and results update for TSPSC Group 4 exams in Telangana.	https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800	TSPSC Group 4, Results, Cutoff Marks	\N	2026-08-14 08:34:34.511	2026-08-14 08:34:34.511
cmssoy6xk000rpk3gaeltapz3	Top 10 Scholarships for Telugu Students in 2026	top-10-scholarships-for-telugu-students-in-2026	\n      <h1>Scholarships for Higher Studies</h1>\n      <p>Find standard corporate and government scholarship opportunities for degree, engineering, and medical courses in Andhra Pradesh & Telangana.</p>\n    	Excellent financial aid opportunities and scholarships matching criteria for AP & TS students.	https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800	Scholarships, Telugu students, Education aid	\N	2026-08-14 08:34:34.52	2026-08-14 08:34:34.52
cmssoy6xt000spk3ggl9vlyw8	How to Prepare for Bank PO Exams: A Step-by-Step Guide	how-to-prepare-for-bank-po-exams-a-step-by-step-guide	\n      <h1>Bank PO Prep Blueprint</h1>\n      <p>Banking jobs are highly sought after. Focus on quantitative aptitude, logical reasoning, and general English grammar patterns to pass pre-screens easily.</p>\n    	Learn how to crack Bank Probationary Officer (PO) exams using this systematic daily study plan.	https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800	Bank PO, IBPS Prep, Reasoning strategy	\N	2026-08-14 08:34:34.529	2026-08-14 08:34:34.529
cmssoy6y2000tpk3g3x8ju71u	Best Work From Home Jobs for College Students in India	best-work-from-home-jobs-for-college-students-in-india	\n      <h1>Part-time Online Jobs</h1>\n      <p>Students can support their expenses through remote data entry, translation jobs, virtual assistant posts, or social media management.</p>\n    	Discover online part-time opportunities like typing, tutoring, and content writing.	https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800	Work from home, Student income, Part time jobs	\N	2026-08-14 08:34:34.538	2026-08-14 08:34:34.538
cmssoy6y9000upk3gt6cxdq7w	Introduction to Share Market: How to Start Investing Safely	introduction-to-share-market-how-to-start-investing-safely	\n      <h1>Stock Market Guide</h1>\n      <p>Investing early is great, but understand the risks. Start with mutual funds, SIPs, and index funds before trading high-volatility direct equities.</p>\n    	Learn stock market basics, mutual funds, and safe investing strategies for beginners.	https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800	Share market, Investing, Finance tips	\N	2026-08-14 08:34:34.546	2026-08-14 08:34:34.546
cmssoy6yh000vpk3get9ddh7h	How to Use AI Prompts for Faster Academic Writing	how-to-use-ai-prompts-for-faster-academic-writing	\n      <h1>Academic AI Prompts</h1>\n      <p>AI tools can explain difficult engineering or scientific terms in simple words if you feed them targeted prompts. Use ChatGPT responsibly to review concepts.</p>\n    	Boost study productivity using ChatGPT and Gemini prompts for revision.	https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800	AI prompts, Study hacks, ChatGPT tips	\N	2026-08-14 08:34:34.554	2026-08-14 08:34:34.554
cmssoy6yq000wpk3gejstk0hg	YouTube Channel Growth Strategy for Telugu Creators	youtube-channel-growth-strategy-for-telugu-creators	\n      <h1>YouTube Telugu Growth Manual</h1>\n      <p>Find your niche topic, focus on high quality audio, utilize clicky thumbnails, and configure Telugu video search keywords to grow rapidly.</p>\n    	A complete manual on finding your niche, editing, and using SEO on YouTube.	https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800	YouTube growth, Creator tips, SEO tips	\N	2026-08-14 08:34:34.562	2026-08-14 08:34:34.562
cmssoy6yy000xpk3gcjzefnci	How to Build a Professional Brand on Instagram	how-to-build-a-professional-brand-on-instagram	\n      <h1>Professional Instagram Branding</h1>\n      <p>Learn how design templates, Reels strategies, and consistent updates can convert standard profile pages into professional portfolio pipelines.</p>\n    	Turn your Instagram account into a professional portfolio showcasing your skills.	https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&q=80&w=800	Instagram branding, Digital presence, Reels tips	\N	2026-08-14 08:34:34.57	2026-08-14 08:34:34.57
cmssoy6z6000ypk3g3fxdv585	Top 10 Mobile Security Hacks Every Student Should Know	top-10-mobile-security-hacks-every-student-should-know	\n      <h1>Mobile Security Checklist</h1>\n      <p>Avoid sideloading applications from unknown domains, review app permissions, secure financial accounts, and check spam numbers with simple rules.</p>\n    	Protect your phone from spam, malware, and privacy breaches.	https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800	Mobile security, Spam blocker, Privacy tips	\N	2026-08-14 08:34:34.578	2026-08-14 08:34:34.578
cmssoy6ze000zpk3gtyzvzxri	Must-Use Free AI Tools for Coding & Design in 2026	must-use-free-ai-tools-for-coding-design-in-2026	\n      <h1>Free Developer AI Tools</h1>\n      <p>Explore tools like v0.dev, Bolt.new, and Cursor editor configurations to build projects five times faster.</p>\n    	Top AI applications that will assist you in generating designs and coding templates.	https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800	AI Tools, Web design, Free Coding aid	\N	2026-08-14 08:34:34.586	2026-08-14 08:34:34.586
cmssoy6zl0010pk3gel9qshze	Digital Marketing Basics for Small Startups & Beginners	digital-marketing-basics-for-small-startups-and-beginners	\n      <h1>Digital Marketing 101</h1>\n      <p>Focus on local SEO listings, share engaging user feedback on social reels, and deploy simple newsletters to retain customers.</p>\n    	Master SEO, social media marketing, and email newsletters on a budget.	https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800	Digital Marketing, SEO basics, Startup guide	\N	2026-08-14 08:34:34.594	2026-08-14 08:34:34.594
cmssoy6zu0011pk3gbhjusnl0	5 High-Potential Startup Ideas for College Grads	5-high-potential-startup-ideas-for-college-grads	\n      <h1>College Startup Blueprints</h1>\n      <p>Explore local delivery apps, AI editing agencies, student hostels facilities networks, and custom exam coaching programs.</p>\n    	Profitable service and product business ideas you can launch from a dorm room.	https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800	Startup ideas, Entrepreneurship, Student businesses	\N	2026-08-14 08:34:34.602	2026-08-14 08:34:34.602
cmssoy7010012pk3g87p87d2n	The Future of Web Development: Next.js 16 Explained	the-future-of-web-development-nextjs-16-explained	\n      <h1>Next.js 16 Features</h1>\n      <p>Next.js 16 offers optimized compiler setups, faster hot-reloading times, and advanced streaming interfaces for heavy data dashboards.</p>\n    	A deep dive into server components, client cache optimizations, and new compiler options.	https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800	Next.js 16, React, Web development trend	\N	2026-08-14 08:34:34.609	2026-08-14 08:34:34.609
cmssoy70a0013pk3gio4ackxl	Top Websites & Apps for Free NCERT Textbook PDFs	top-websites-apps-for-free-ncert-textbook-pdfs	\n      <h1>NCERT Free PDFs list</h1>\n      <p>Check the official NCERT portal and certified regional apps to get free chapters and textbooks for study reference.</p>\n    	Download all school and board textbook PDF syllabus guides instantly.	https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800	NCERT books, School PDFs, Study resources	\N	2026-08-14 08:34:34.618	2026-08-14 08:34:34.618
cmssoy70i0014pk3g5xg6gw5n	How to Build and Grow a Facebook Group Community	how-to-build-and-grow-a-facebook-group-community	\n      <h1>Facebook Group Growth Strategy</h1>\n      <p>Maintain strict moderation guidelines, schedule daily interactive polls, and reply instantly to user posts to build trust.</p>\n    	Strategy guide to getting active engagement and organic reach in groups.	https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800	Facebook groups, Community building, Social media growth	\N	2026-08-14 08:34:34.626	2026-08-14 08:34:34.626
cmssoy70q0015pk3gzzm2b2on	Daily Current Affairs: Key National & International News	daily-current-affairs-key-national-international-news	\n      <h1>Current Affairs Updates</h1>\n      <p>Read today's summarized news covering science projects, global summits, national trade policies, and sports awards.</p>\n    	Stay updated with important international events and current affairs for competitive exams.	https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800	Current affairs, Daily news, General knowledge	\N	2026-08-14 08:34:34.635	2026-08-14 08:34:34.635
cmssoy70x0016pk3gyhs9122d	Railway Recruitment Board (RRB) NTPC Exam Prep Guide	railway-recruitment-board-rrb-ntpc-exam-prep-guide	\n      <h1>RRB NTPC preparation roadmap</h1>\n      <p>Practice past papers covering numerical methods, GK, and computer tests to secure scoring cutoffs.</p>\n    	Everything you need to know about RRB NTPC syllabus, exams dates, and mocks.	https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800	RRB NTPC, Railway Jobs, Exam guide	\N	2026-08-14 08:34:34.642	2026-08-14 08:34:34.642
cmssoy7160017pk3g9zv3vvjv	Central Government Job Openings: SSC CGL 2026 Guide	central-government-job-openings-ssc-cgl-2026-guide	\n      <h1>SSC CGL vacancies strategy</h1>\n      <p>Check the educational criteria, age limit details, tier 1 mock guidelines, and apply online before last date warnings.</p>\n    	Detailed breakdown of the SSC CGL notification, post-wise vacancies, and online form.	https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800	SSC CGL, Central Jobs, SSC forms	\N	2026-08-14 08:34:34.651	2026-08-14 08:34:34.651
cmssoy71f0018pk3gqfq5x1kj	Indian Army Agniveer Recruitment Cycle Details	indian-army-agniveer-recruitment-cycle-details	\n      <h1>Army Agniveer Registry manual</h1>\n      <p>Prepare physical training patterns, running parameters, and primary written exam details to qualify for final selection.</p>\n    	Age limit, physical tests parameters, and online registry details for Agniveer program.	https://images.unsplash.com/photo-1508847154043-be12a62861c1?auto=format&fit=crop&q=80&w=800	Agniveer, Indian Army, Defense Jobs	\N	2026-08-14 08:34:34.66	2026-08-14 08:34:34.66
cmssoy71o0019pk3gyty523kn	AP Intermediate Board Exam Preparation & Model Papers	ap-intermediate-board-exam-preparation-model-papers	\n      <h1>AP Inter Model papers lists</h1>\n      <p>Solve previous years question papers and sample templates to improve score margins in board exam cycles.</p>\n    	Download intermediate board physics, maths, and chemistry sample papers.	https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800	AP Intermediate, Inter syllabus, Board papers	\N	2026-08-14 08:34:34.669	2026-08-14 08:34:34.669
cmssoy71v001apk3g86bs7r9e	TS Inter Board Exam Answer Keys & Results Updates	ts-inter-board-exam-answer-keys-results-updates	\n      <h1>TS Inter Board exam results guidelines</h1>\n      <p>Access official subdomains directly using candidate hall ticket code numbers to fetch score sheets.</p>\n    	Check direct links and dates for TS Intermediate board results release.	https://images.unsplash.com/photo-1588072405854-d1a73392ee21?auto=format&fit=crop&q=80&w=800	TS Inter results, Answer key, Score sheets	\N	2026-08-14 08:34:34.676	2026-08-14 08:34:34.676
cmssoy724001bpk3g4d907n4t	National Scholarship Portal (NSP) Online Registration Guide	national-scholarship-portal-nsp-online-registration-guide	\n      <h1>NSP registration checklists</h1>\n      <p>Prepare income certificates, academic marks list, bank details, and aadhaar linkage sheets before submitting NSP forms.</p>\n    	Step-by-step application instructions and documents criteria for NSP online.	https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800	NSP scholarship, Online registry, Central aid	\N	2026-08-14 08:34:34.684	2026-08-14 08:34:34.684
cmssoy72b001cpk3g9n485wuu	TCS NQT 2026 Placement Syllabus & Interview Prep	tcs-nqt-2026-placement-syllabus-interview-prep	\n      <h1>TCS NQT placement tips</h1>\n      <p>Practice competitive coding challenges, review mock questions covering data structures, and focus on logical reasoning loops.</p>\n    	How freshers can prepare for TCS National Qualifier Test (NQT) coding and cognitive sections.	https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800	TCS NQT, IT jobs, Coding interview prep	\N	2026-08-14 08:34:34.691	2026-08-14 08:34:34.691
cmssoy72l001dpk3g2os7zcpn	Wipro & Infosys Off-Campus Drive Updates for Freshers	wipro-infosys-off-campus-drive-updates-for-freshers	\n      <h1>Off campus drive registration</h1>\n      <p>Submit college transcripts, build code portfolios, and prepare basic mock questions on core Java/Python concepts.</p>\n    	Application links and interview schedules for Wipro Elite NTH and Infosys off-campus drives.	https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800	Off campus placements, IT careers, Freshman jobs	\N	2026-08-14 08:34:34.701	2026-08-14 08:34:34.701
cmssoy72s001epk3glamsym5y	Video Editing for Reels and YouTube: Best Mobile Tools	video-editing-for-reels-and-youtube-best-mobile-tools	\n      <h1>Mobile Video editing tutorial</h1>\n      <p>Focus on smooth keyframe animations, audio synchronization levels, clean title overlay templates, and WebP compression formats.</p>\n    	Learn how to edit high quality reels using CapCut, VN Editor, and mobile apps.	https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800	Video editing, CapCut hacks, Reels editing	\N	2026-08-14 08:34:34.708	2026-08-14 08:34:34.708
cmssoy730001fpk3g29s6zdzj	How to Write a Resume that Gets Selected by ATS	how-to-write-a-resume-that-gets-selected-by-ats	\n      <h1>ATS resume building rules</h1>\n      <p>Avoid using complex multi-column tables, match job description keyword tags, list measurable project metrics, and use clean formats.</p>\n    	Optimizing your resume keywords to beat Applicant Tracking Systems (ATS) software.	https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800	ATS Resume, Job selection, Placement hacks	\N	2026-08-14 08:34:34.717	2026-08-14 08:34:34.717
cmssoy739001gpk3gk4sskfbz	Highest Paying Software Engineering Internships in India	highest-paying-software-engineering-internships-in-india	\n      <h1>High paying internship updates</h1>\n      <p>Look out for application portals at companies like Amazon, Adobe, Google, and Indian product startups during seasonal hiring sprints.</p>\n    	List of tech companies offering student internships paying over INR 50k per month.	https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800	Tech Internships, High pay careers, Software engineering	\N	2026-08-14 08:34:34.725	2026-08-14 08:34:34.725
cmssoy73h001hpk3gxo4lcg23	Central Sector Scholarship Scheme Eligibility Checklist	central-sector-scholarship-scheme-eligibility-checklist	\n      <h1>CSSS scholarship criteria</h1>\n      <p>Eligible candidates must rank in the top 80th percentile of their state intermediate board results and have family income below threshold limits.</p>\n    	Find out if you qualify for the CSSS college students financial grant.	https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800	CSSS scholarship, College grant, Eligibility	\N	2026-08-14 08:34:34.734	2026-08-14 08:34:34.734
cmssoy73p001ipk3gsiw9h01v	How to Stay Focused During Competitive Exam Prep	how-to-stay-focused-during-competitive-exam-prep	<div data-color="green" data-type="callout" class="callout-box"><p>Student లైఫ్‌లోనే మన సొంత ఖర్చుల కోసం లేదా pocket money కోసం వేరొకరిపై depend అవ్వకుండా సంపాదించుకోవడం నిజంగా ఒక గొప్ప ఫీలింగ్. ప్రతిరోజూ ఫోన్‌లో రీల్స్ చూస్తూ time waste చేసే బదులు, రోజుకి 1-2 గంటలు కేటాయించి నేర్చుకోగలిగే 7 online మార్గాలు ఇక్కడ ఉన్నాయి.</p><p>వీటికోసం మీరు ఒక్క రూపాయి కూడా investment పెట్టాల్సిన అవసరం లేదు.</p></div><h3><span style="color: rgb(168, 85, 247);"><strong><mark data-color="#e9d5ff" style="background-color: rgb(233, 213, 255); color: inherit;">7 Easy Digital Skills</mark></strong></span></h3><p></p><div data-color="pink" data-type="callout" class="callout-box"><p><strong>1. PPT మేకింగ్</strong></p><p>MS PowerPoint లేదా Canva వాడి మంచి slides తయారు చేయడం. Youtubers కి లేదా చిన్న బిజినెస్ చేసేవారికి presentations డిజైన్ చేసి ఇస్తే మంచిగా earn చేయవచ్చు.</p></div><div data-color="blue" data-type="callout" class="callout-box"><p><strong>2. ఆన్లైన్ లాంగ్వేజ్ ట్యూటర్</strong></p><p>మీకు తెలుగు లేదా హిందీ స్పష్టంగా మాట్లాడటం వస్తే, foreigners కి ఆ భాష నేర్పించవచ్చు. Verbling వంటి వెబ్‌సైట్లలో tutor గా జాయిన్ అయి గంటకు కొంత చార్జ్ చేయవచ్చు.</p></div><p></p><div data-color="purple" data-type="callout" class="callout-box"><p><strong>3. నోట్స్ అమ్మడం &amp; Doubts క్లియర్ చేయడం</strong></p><ul><li><p><strong>నోట్స్ అమ్మడం:</strong> మీ 10th లేదా Inter క్లీన్ నోట్స్‌ను StudyPool వెబ్‌సైట్‌లో upload చేస్తే, ఎవరైనా download చేసుకున్న ప్రతిసారీ money వస్తాయి.</p></li></ul><ul><li><p><strong>Doubts తీర్చడం:</strong> Chegg, Brainly సైట్లలో students అడిగే ప్రశ్నలకు answers ఇస్తూ డబ్బులతో పాటు subject knowledge కూడా పెంచుకోవచ్చు.</p></li></ul></div><p></p><p></p><div data-color="#ff0000" data-type="callout" class="callout-box" style="border-color: rgb(255, 0, 0); background-color: rgba(255, 0, 0, 0.07);"><p><strong>4. వీడియో ఎడిటింగ్</strong></p><p>ఇప్పుడు Reels, Shorts కి చాలా demand ఉంది. YouTube లో ఫ్రీగా CapCut లేదా VN Editor నేర్చుకుని, చిన్న creators వీడియోలను edit చేసి ఇస్తూ income పొందవచ్చు.</p></div><div data-color="#ff00ea" data-type="callout" class="callout-box" style="border-color: rgb(255, 0, 234); background-color: rgba(255, 0, 234, 0.07);"><p><strong>5. థంబ్‌నెయిల్ డిజైనింగ్</strong></p><p>YouTube వీడియో పైన కనిపించే cover photo ని Canva లేదా Photoshop లో డిజైన్ చేయడం. YouTubers కి మీరు చేసిన sample designs పంపిస్తే, work నచ్చితే వాళ్ల team లో మిమ్మల్ని తీసుకుంటారు.</p></div><div data-color="#eeff00" data-type="callout" class="callout-box" style="border-color: rgb(238, 255, 0); background-color: rgba(238, 255, 0, 0.07);"><p><strong>6. ఇన్ఫ్లుయెన్సర్ మేనేజర్</strong></p><p>Creators కి కంపెనీల నుండి వచ్చే sponsorship deals మాట్లాడి పెట్టి, వచ్చిన amount లో 10% commission తీసుకోవడం. దీనికి మంచి communication skills ఉంటే సరిపోతుంది.</p><p></p></div><div data-color="#0008ff" data-type="callout" class="callout-box" style="border-color: rgb(0, 8, 255); background-color: rgba(0, 8, 255, 0.07);"><p><strong>7. వెబ్‌సైట్ డిజైనింగ్ &amp; కోడింగ్</strong></p><p>WordPress లేదా బేసిక్ HTML/CSS నేర్చుకుని చిన్న బిజినెస్‌లకు websites తయారు చేయడం. Fiverr, Upwork వంటి freelancing సైట్లలో global clients నుండి projects పొందవచ్చు.</p></div><p></p>	Effective time-boxing and mindfulness tips for long study durations.	https://pub-2e8ad281ac034f31ad341dca24074376.r2.dev/c157ea393dd14b885821c51cfaedf8d4-1786896609842-kmvk5h.webp	Study focus, Exam stress, Productivity loops	\N	2026-08-14 08:34:34.741	2026-08-16 16:10:15.917
\.


--
-- Data for Name: BlogTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogTag" ("blogId", "tagId") FROM stdin;
cmssoy6wu000ppk3gtkmu2t99	cmssoy6rr0000pk3gdmn7gl3v
cmssoy6xa000qpk3gyuu30m85	cmssoy6so0004pk3g5ykujubd
cmssoy6xk000rpk3gaeltapz3	cmssoy6sw0005pk3gnrw4rntz
cmssoy6xt000spk3ggl9vlyw8	cmssoy6s10001pk3gbvtca7kj
cmssoy6y2000tpk3g3x8ju71u	cmssoy6tc0007pk3g61smxmwl
cmssoy6y9000upk3gt6cxdq7w	cmssoy6ti0008pk3ggqshgj9v
cmssoy6yh000vpk3get9ddh7h	cmssoy6tq0009pk3gsta1o3vq
cmssoy6yq000wpk3gejstk0hg	cmssoy6u4000bpk3gyh3gox0t
cmssoy6yy000xpk3gcjzefnci	cmssoy6ub000cpk3g97syrccy
cmssoy6z6000ypk3g3fxdv585	cmssoy6uh000dpk3gdp2epioi
cmssoy6ze000zpk3gtyzvzxri	cmssoy6up000epk3gswwg01fw
cmssoy6zl0010pk3gel9qshze	cmssoy6uv000fpk3g0y0fcx0n
cmssoy6zu0011pk3gbhjusnl0	cmssoy6v2000gpk3gja72ks3t
cmssoy7010012pk3g87p87d2n	cmssoy6v9000hpk3gg201jfog
cmssoy70a0013pk3gio4ackxl	cmssoy6vg000ipk3geqk53oap
cmssoy70i0014pk3g5xg6gw5n	cmssoy6vn000jpk3gp80hozl9
cmssoy70q0015pk3gzzm2b2on	cmssoy6vt000kpk3ggksxs2hz
cmssoy70x0016pk3gyhs9122d	cmssoy6t30006pk3gy8d4rxd9
cmssoy7160017pk3g9zv3vvjv	cmssoy6rr0000pk3gdmn7gl3v
cmssoy71f0018pk3gqfq5x1kj	cmssoy6w0000lpk3gk0ot2zjf
cmssoy71o0019pk3gyty523kn	cmssoy6w6000mpk3g4706lrwp
cmssoy71v001apk3g86bs7r9e	cmssoy6so0004pk3g5ykujubd
cmssoy724001bpk3g4d907n4t	cmssoy6sw0005pk3gnrw4rntz
cmssoy72b001cpk3g9n485wuu	cmssoy6wd000npk3guqgp5vis
cmssoy72l001dpk3g2os7zcpn	cmssoy6wd000npk3guqgp5vis
cmssoy72s001epk3glamsym5y	cmssoy6wk000opk3g0cx6ytvs
cmssoy730001fpk3g29s6zdzj	cmssoy6tx000apk3gg8f2q8nu
cmssoy739001gpk3gk4sskfbz	cmssoy6wd000npk3guqgp5vis
cmssoy73h001hpk3gxo4lcg23	cmssoy6sw0005pk3gnrw4rntz
cmssoy73p001ipk3gsiw9h01v	cmssoy6w0000lpk3gk0ot2zjf
\.


--
-- Data for Name: LatestNews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LatestNews" (id, tag, "tagColor", image, title, date, read, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy74y001opk3giasdyzcx	Govt Jobs	bg-blue-600	https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800	SSC CGL 2026 Vacancy List Released: Apply Before Last Date Warnings	August 14, 2026	4 min read	t	/govt-jobs/central-government-job-openings-ssc-cgl-2026-guide	2026-08-14 08:34:34.787	2026-08-14 08:34:34.787
cmssoy74y001ppk3gw00hhcx5	Results	bg-emerald-600	https://images.unsplash.com/photo-1588072405854-d1a73392ee21?auto=format&fit=crop&q=80&w=800	TS Intermediate Board Results expected score margins analysis	August 13, 2026	3 min read	t	/results/ts-inter-board-exam-answer-keys-results-updates	2026-08-14 08:34:34.787	2026-08-14 08:34:34.787
\.


--
-- Data for Name: MaterialFile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MaterialFile" (id, title, "fileUrl", "fileSize", "fileType", "isActive", "createdAt", "updatedAt") FROM stdin;
cmssoy78j003mpk3gf1e59rlb	AP Intermediate Model Physics Paper	/uploads/ap-inter-physics.pdf	2.4 MB	PDF	t	2026-08-14 08:34:34.916	2026-08-14 08:34:34.916
cmssoy78j003npk3gcg0bg7mh	TS Intermediate Board Chemistry Syllabus Sheet	/uploads/ts-inter-chemistry.pdf	1.8 MB	PDF	t	2026-08-14 08:34:34.916	2026-08-14 08:34:34.916
cmssoy78j003opk3gishakqq9	Railway RRB NTPC Past Solved Papers Guide	/uploads/rrb-ntpc-papers.pdf	5.2 MB	PDF	t	2026-08-14 08:34:34.916	2026-08-14 08:34:34.916
cmssoy78j003ppk3g719fj6t3	APPSC Group 2 General Studies Syllabus Guide	/uploads/appsc-gs-guide.pdf	3.1 MB	PDF	t	2026-08-14 08:34:34.916	2026-08-14 08:34:34.916
cmssoy78j003qpk3g343ehe88	TCS NQT Placement Practice Questions Set	/uploads/tcs-nqt-practice.pdf	4.8 MB	PDF	t	2026-08-14 08:34:34.916	2026-08-14 08:34:34.916
\.


--
-- Data for Name: MostRead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MostRead" (id, title, image, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy778002opk3g1glg2qu1	Top 10 Scholarships for Telugu Students in 2026	https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800	t	/scholarships/top-10-scholarships-for-telugu-students-in-2026	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002ppk3g8b9qqz8s	How to Prepare for Bank PO Exams: A Step-by-Step Study Guide	https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800	t	/study-tips/how-to-prepare-for-bank-po-exams-a-step-by-step-guide	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002qpk3gnwo6360t	APPSC Group 2 Recruitment Notification: Syllabus & Strategy	https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800	t	/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002rpk3g87we5nnc	TSPSC Group 4 Results & Expected Cutoff Marks Sheet	https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800	t	/results/tspsc-group-4-results-expected-cutoff-marks	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002spk3gypvntnjq	Best Work From Home Jobs for College Students in India	https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800	t	/part-time-income/best-work-from-home-jobs-for-college-students-in-india	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002tpk3gasq6zekb	Introduction to Share Market: Investing Guide for Beginners	https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800	t	/share-market/introduction-to-share-market-how-to-start-investing-safely	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002upk3g0xusicb3	How to Use AI Prompts for Faster Academic Writing	https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800	t	/ai-prompts/how-to-use-ai-prompts-for-faster-academic-writing	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002vpk3g3m0ck4na	YouTube Channel Growth Strategy for Telugu Creators	https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800	t	/youtube-growth/youtube-channel-growth-strategy-for-telugu-creators	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002wpk3gf85szc9m	How to Build a Professional Brand on Instagram Page	https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&q=80&w=800	t	/instagram/how-to-build-a-professional-brand-on-instagram	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
cmssoy778002xpk3gfxi8tiyz	Top 10 Mobile Security Hacks Every Student Should Know	https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800	t	/mobile-hacks/top-10-mobile-security-hacks-every-student-should-know	2026-08-14 08:34:34.868	2026-08-14 08:34:34.868
\.


--
-- Data for Name: PopularTopics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PopularTopics" (id, topic, "labelColor", href, "isActive", "createdAt", "updatedAt") FROM stdin;
cmssoy75l001rpk3gm8secfki	Govt Jobs	bg-blue-50 text-blue-700 border-blue-200	/govt-jobs	t	2026-08-14 08:34:34.809	2026-08-14 08:34:34.809
cmssoy75l001spk3go1vdy516	Scholarships	bg-orange-50 text-orange-700 border-orange-200	/scholarships	t	2026-08-14 08:34:34.809	2026-08-14 08:34:34.809
cmssoy75l001tpk3gyoiwe1a6	Study Tips	bg-indigo-50 text-indigo-700 border-indigo-200	/study-tips	t	2026-08-14 08:34:34.809	2026-08-14 08:34:34.809
cmssoy75l001upk3gh6mzed9y	Internships	bg-purple-50 text-purple-700 border-purple-200	/internships	t	2026-08-14 08:34:34.809	2026-08-14 08:34:34.809
\.


--
-- Data for Name: RightCards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RightCards" (id, image, title, date, badge, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy74l001mpk3gdkzpkfd0	https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800	How to Stay Focused During Long Study Sessions	Today	["Study Tips"]	t	/study-tips/how-to-stay-focused-during-competitive-exam-prep	2026-08-14 08:34:34.773	2026-08-14 08:34:34.773
cmssoy74l001npk3g6icue4fo	https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800	ATS-Friendly Resume Building Techniques for 2026	Yesterday	["Career & Jobs"]	t	/career-jobs/how-to-write-a-resume-that-gets-selected-by-ats	2026-08-14 08:34:34.773	2026-08-14 08:34:34.773
\.


--
-- Data for Name: SiteSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSetting" (id, "siteName", "siteTagline", "siteLogo", "siteFavicon", "supportEmail", "contactPhone", "contactAddress", "workingHours", "adminEmail", "adminPassword", "metaTitle", "metaDescription", "metaKeywords", "canonicalUrl", "ogImage", "twitterHandle", "googleAnalyticsId", "googleSearchConsoleCode", facebook, instagram, twitter, youtube, telegram, whatsapp, linkedin, github, "createdAt", "updatedAt") FROM stdin;
default	Students Pub	Learn • Grow • Build a Better Future	/logo.png	/logo.png	support@studentsvoice.in	+91 98765 43210	Hyderabad, Telangana, India	Mon - Sat: 9:00 AM - 6:00 PM IST	admin@gmail.com	admin123	Students Hub - Latest Government Jobs, Education & Career Updates	Get fast, reliable student news, notifications, study materials, mock tests, and career opportunities.	student news, government jobs, current affairs, internships, scholarships, study materials	http://localhost	/logo.png	@studentsvoice			https://facebook.com	https://instagram.com	https://twitter.com	https://youtube.com	https://t.me	https://whatsapp.com	https://linkedin.com	https://github.com	2026-08-14 08:34:34.293	2026-08-14 08:42:34.052
\.


--
-- Data for Name: SlideData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SlideData" (id, title, image, "readTime", date, author, badge, href, "isActive", "createdAt", "updatedAt") FROM stdin;
cmssoy744001jpk3gofu1g2z4	APPSC Group 2 Preliminary Exam Preparation Blueprint	https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800	5 min read	August 14, 2026	Karthikeya	["Govt Jobs", "Exam Prep"]	/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan	t	2026-08-14 08:34:34.756	2026-08-14 08:34:34.756
cmssoy744001kpk3gusu007mh	Top Scholarships Offering Free Education Aid for Degree Aspirants	https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800	4 min read	August 13, 2026	Keerthana Reddy	["Scholarships"]	/scholarships/top-10-scholarships-for-telugu-students-in-2026	t	2026-08-14 08:34:34.756	2026-08-14 08:34:34.756
cmssoy744001lpk3glvczdgey	Next.js 16 Compiler Optimizations and Web Dev Trends	https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800	6 min read	August 12, 2026	Rohith Reddy	["Technology", "Tech News"]	/technology/the-future-of-web-development-nextjs-16-explained	t	2026-08-14 08:34:34.756	2026-08-14 08:34:34.756
\.


--
-- Data for Name: StudyMaterial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudyMaterial" (id, href, title, "isActive", "createdAt", "updatedAt") FROM stdin;
cmssoy75x001vpk3gnbt006ut	/files-materials/ap-intermediate-board-exam-preparation-model-papers	AP Intermediate Model Physics Paper PDF	t	2026-08-14 08:34:34.821	2026-08-14 08:34:34.821
cmssoy75x001wpk3gsus5x4k3	/results/ts-inter-board-exam-answer-keys-results-updates	TS Intermediate Board Chemistry Syllabus Sheet	t	2026-08-14 08:34:34.821	2026-08-14 08:34:34.821
cmssoy75x001xpk3gtf9qo855	/exam-prep/railway-recruitment-board-rrb-ntpc-exam-prep-guide	Railway Recruitment Board NTPC study reference guides	t	2026-08-14 08:34:34.821	2026-08-14 08:34:34.821
cmssoy75x001ypk3g8903sa7c	/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan	APPSC Group 2 General Studies Practice Set PDF	t	2026-08-14 08:34:34.821	2026-08-14 08:34:34.821
cmssoy75x001zpk3gow46vs44	/internships/tcs-nqt-2026-placement-syllabus-interview-prep	TCS NQT Placement Cognitive Syllabus Material	t	2026-08-14 08:34:34.821	2026-08-14 08:34:34.821
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name, slug, "parentId", "createdAt") FROM stdin;
cmssoy6rr0000pk3gdmn7gl3v	Govt Jobs	govt-jobs	\N	2026-08-14 08:34:34.311
cmssoy6s10001pk3gbvtca7kj	Study Tips	study-tips	\N	2026-08-14 08:34:34.321
cmssoy6s90002pk3gnhm4xe3e	Tech News	tech-news	\N	2026-08-14 08:34:34.33
cmssoy6sh0003pk3g4mx11wur	YouTube Tips	youtube-tips	\N	2026-08-14 08:34:34.338
cmssoy6so0004pk3g5ykujubd	Results	results	\N	2026-08-14 08:34:34.345
cmssoy6sw0005pk3gnrw4rntz	Scholarships	scholarships	\N	2026-08-14 08:34:34.352
cmssoy6t30006pk3gy8d4rxd9	Exam Prep	exam-prep	\N	2026-08-14 08:34:34.36
cmssoy6tc0007pk3g61smxmwl	Part-time Income	part-time-income	\N	2026-08-14 08:34:34.368
cmssoy6ti0008pk3ggqshgj9v	Share Market	share-market	\N	2026-08-14 08:34:34.374
cmssoy6tq0009pk3gsta1o3vq	AI Prompts	ai-prompts	\N	2026-08-14 08:34:34.382
cmssoy6tx000apk3gg8f2q8nu	Career & Jobs	career-jobs	\N	2026-08-14 08:34:34.389
cmssoy6u4000bpk3gyh3gox0t	YouTube Growth	youtube-growth	\N	2026-08-14 08:34:34.396
cmssoy6ub000cpk3g97syrccy	Instagram	instagram	\N	2026-08-14 08:34:34.403
cmssoy6uh000dpk3gdp2epioi	Mobile Hacks	mobile-hacks	\N	2026-08-14 08:34:34.409
cmssoy6up000epk3gswwg01fw	AI Tools	ai-tools	\N	2026-08-14 08:34:34.417
cmssoy6uv000fpk3g0y0fcx0n	Marketing	marketing	\N	2026-08-14 08:34:34.424
cmssoy6v2000gpk3gja72ks3t	Startup Ideas	startup-ideas	\N	2026-08-14 08:34:34.431
cmssoy6v9000hpk3gg201jfog	Technology	technology	\N	2026-08-14 08:34:34.438
cmssoy6vg000ipk3geqk53oap	Apps & Websites	apps-websites	\N	2026-08-14 08:34:34.444
cmssoy6vn000jpk3gp80hozl9	Facebook	facebook	\N	2026-08-14 08:34:34.452
cmssoy6vt000kpk3ggksxs2hz	Current Affairs	current-affairs	\N	2026-08-14 08:34:34.458
cmssoy6w0000lpk3gk0ot2zjf	Govt Jobs Updates	govt-jobs-updates	\N	2026-08-14 08:34:34.465
cmssoy6w6000mpk3g4706lrwp	Files & Materials	files-materials	\N	2026-08-14 08:34:34.471
cmssoy6wd000npk3guqgp5vis	Internships	internships	\N	2026-08-14 08:34:34.477
cmssoy6wk000opk3g0cx6ytvs	Editing	editing	\N	2026-08-14 08:34:34.484
cmsvbdqs30001pk010chcriqv	Carrer Jobs	carrer-jobs	\N	2026-08-16 04:38:03.961
\.


--
-- Data for Name: TechnologyNews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TechnologyNews" (id, title, image, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy7690020pk3gtdjh1r3l	Must-Use Free AI Tools for Coding & Design in 2026	https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800	t	/ai-tools/must-use-free-ai-tools-for-coding-design-in-2026	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690021pk3gg4xtobx1	The Future of Web Development: Next.js 16 Compiler Breakdown	https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800	t	/technology/the-future-of-web-development-nextjs-16-explained	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690022pk3gqoxv09n0	How Bolt.new and v0.dev are Changing Frontend Prototyping	https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800	t	/ai-tools/must-use-free-ai-tools-for-coding-design-in-2026	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690023pk3g6814ie0n	Top AI Code Editors for Students: Cursor vs VS Code Copilot	https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800	t	/ai-tools/must-use-free-ai-tools-for-coding-design-in-2026	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690024pk3g3ds34p2a	How to Build Fullstack Apps in 10 Minutes with AI Prompts	https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800	t	/ai-prompts/how-to-use-ai-prompts-for-faster-academic-writing	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690025pk3gfpc8xsut	The Rise of Edge Databases: Neon Postgres and Turso SQLite	https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800	t	/technology/the-future-of-web-development-nextjs-16-explained	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690026pk3g7x6cuorj	WebAssembly in 2026: Running C++ and Rust on the Client Browser	https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800	t	/technology/the-future-of-web-development-nextjs-16-explained	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690027pk3gw0ncszph	Why TailWindCSS v4.0 is the Fastest CSS Utility Library Yet	https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800	t	/technology/the-future-of-web-development-nextjs-16-explained	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690028pk3gslky0efv	Building Microfrontends with Module Federation in Vite and Next	https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800	t	/technology/the-future-of-web-development-nextjs-16-explained	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
cmssoy7690029pk3gn8096a0z	How to Secure Your Web Apps Against OWASP Top 10 Vulnerabilities	https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800	t	/mobile-hacks/top-10-mobile-security-hacks-every-student-should-know	2026-08-14 08:34:34.834	2026-08-14 08:34:34.834
\.


--
-- Data for Name: TrendingNews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TrendingNews" (id, image, title, date, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy75a001qpk3gf4lyg3yw	https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800	Railway Recruitment Board NTPC syllabus roadmap released	Trending	t	/exam-prep/railway-recruitment-board-rrb-ntpc-exam-prep-guide	2026-08-14 08:34:34.798	2026-08-14 08:34:34.798
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Video" (id, title, image, badge, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy76w002epk3gw2oybmyi	How to Build a Professional Brand on Instagram	https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg	12:15	t	https://www.youtube.com/watch?v=y6120QOlsfU	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002fpk3gq4ibdoj0	YouTube Channel Growth Strategy for Telugu Creators	https://img.youtube.com/vi/F3_qfO0P5-c/mqdefault.jpg	08:45	t	https://www.youtube.com/watch?v=F3_qfO0P5-c	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002gpk3g33jdkv6q	VN Editor Hacks: Pro Video Editing on Mobile	https://img.youtube.com/vi/Ke90Tje7VS0/mqdefault.jpg	14:20	t	https://www.youtube.com/watch?v=Ke90Tje7VS0	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002hpk3guut906zh	Next.js 16 Compiler Optimizations and Web Dev Trends	https://img.youtube.com/vi/HXYTNuL7-O0/mqdefault.jpg	10:30	t	https://www.youtube.com/watch?v=HXYTNuL7-O0	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002ipk3ga61hjamc	Python Programming Full Course for Beginners	https://img.youtube.com/vi/9P1vW6YdC68/mqdefault.jpg	45:10	t	https://www.youtube.com/watch?v=9P1vW6YdC68	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002jpk3ggjx1t7q5	How to Write a Resume that Gets Selected by ATS Scanner	https://img.youtube.com/vi/dD2EISBDjWM/mqdefault.jpg	06:15	t	https://www.youtube.com/watch?v=dD2EISBDjWM	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002kpk3gk5c5nv20	Digital Marketing Complete Roadmap for College Grads	https://img.youtube.com/vi/tVzUXW6siu0/mqdefault.jpg	11:55	t	https://www.youtube.com/watch?v=tVzUXW6siu0	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002lpk3gz7t8vjng	How to Stay Highly Productive and Focused While Studying	https://img.youtube.com/vi/7fPXI_MnOPc/mqdefault.jpg	09:40	t	https://www.youtube.com/watch?v=7fPXI_MnOPc	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76w002mpk3g6qcbx46a	Central Sector & Corporate Scholarship Schemes Registration Guide	https://img.youtube.com/vi/8M0yKkZ8S9c/mqdefault.jpg	13:20	t	https://www.youtube.com/watch?v=8M0yKkZ8S9c	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
cmssoy76x002npk3gtvqbx6re	High Paying Remote Jobs & Internships for College Grads	https://img.youtube.com/vi/uD4izuPDy_A/mqdefault.jpg	07:50	t	https://www.youtube.com/watch?v=uD4izuPDy_A	2026-08-14 08:34:34.857	2026-08-14 08:34:34.857
\.


--
-- Data for Name: VideoGallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VideoGallery" (id, title, image, duration, category, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy77i002ypk3gs566sxzk	YouTube Telugu Growth Video Manual Guide	https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg	10:45	YouTube Tips	t	https://www.youtube.com/watch?v=y6120QOlsfU	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i002zpk3guqjmpji9	Instagram Page Setup & Growth Masterclass	https://img.youtube.com/vi/F3_qfO0P5-c/mqdefault.jpg	14:10	Instagram Growth	t	https://www.youtube.com/watch?v=F3_qfO0P5-c	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0030pk3gakuq1p4v	Mobile Video Editing Hacks using VN Editor & CapCut	https://img.youtube.com/vi/Ke90Tje7VS0/mqdefault.jpg	08:35	Video Editing	t	https://www.youtube.com/watch?v=Ke90Tje7VS0	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0031pk3gfp5i99nk	Next.js 16 Web Development Framework Compiler Review	https://img.youtube.com/vi/HXYTNuL7-O0/mqdefault.jpg	11:55	Technology	t	https://www.youtube.com/watch?v=HXYTNuL7-O0	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0032pk3gfs3akdr8	Python Full Language Roadmap for Absolute Beginners	https://img.youtube.com/vi/9P1vW6YdC68/mqdefault.jpg	25:40	Coding	t	https://www.youtube.com/watch?v=9P1vW6YdC68	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0033pk3gb4xbbbw3	Write an ATS-Optimized Resume to Beat Scan Software	https://img.youtube.com/vi/dD2EISBDjWM/mqdefault.jpg	06:15	Placement Tips	t	https://www.youtube.com/watch?v=dD2EISBDjWM	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0034pk3g7910alx0	Complete Digital Marketing Masterclass for Beginners	https://img.youtube.com/vi/tVzUXW6siu0/mqdefault.jpg	15:20	Marketing	t	https://www.youtube.com/watch?v=tVzUXW6siu0	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0035pk3gems159ab	Mindfulness & Pomodoro Study Tips for High Focus	https://img.youtube.com/vi/7fPXI_MnOPc/mqdefault.jpg	09:12	Study Tips	t	https://www.youtube.com/watch?v=7fPXI_MnOPc	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0036pk3gw2hu27oj	National & Corporate Scholarship Portals Selection Guide	https://img.youtube.com/vi/8M0yKkZ8S9c/mqdefault.jpg	13:45	Scholarships	t	https://www.youtube.com/watch?v=8M0yKkZ8S9c	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
cmssoy77i0037pk3g5iulm0wk	Top Remote Freelance Jobs for University Students	https://img.youtube.com/vi/uD4izuPDy_A/mqdefault.jpg	07:22	Career & Jobs	t	https://www.youtube.com/watch?v=uD4izuPDy_A	2026-08-14 08:34:34.878	2026-08-14 08:34:34.878
\.


--
-- Data for Name: WebStory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WebStory" (id, title, image, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy76k002apk3g6gq4ccx5	5 Tips to Clear Group Exams	https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800	t	/study-tips/how-to-stay-focused-during-competitive-exam-prep	2026-08-14 08:34:34.844	2026-08-14 08:34:34.844
cmssoy76k002bpk3g2tqqnbtb	Highest Paying Student Internships 2026	https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800	t	/internships/highest-paying-software-engineering-internships-in-india	2026-08-14 08:34:34.844	2026-08-14 08:34:34.844
cmssoy76k002cpk3g0yh3e2iv	Top 5 Websites for Free Textbook PDFs	https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800	t	/apps-websites/top-websites-apps-for-free-ncert-textbook-pdfs	2026-08-14 08:34:34.844	2026-08-14 08:34:34.844
cmssoy76k002dpk3g4rzw95eh	Work From Home Job Roles for Freshers	https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800	t	/part-time-income/best-work-from-home-jobs-for-college-students-in-india	2026-08-14 08:34:34.844	2026-08-14 08:34:34.844
\.


--
-- Data for Name: YouMayLike; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."YouMayLike" (id, headline, description, image, "isActive", href, "createdAt", "updatedAt") FROM stdin;
cmssoy77v0038pk3g6rvknkk5	Best Work From Home Jobs for College Students in India	Explore flexible part-time options that pay well for college students.	https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800	t	/part-time-income/best-work-from-home-jobs-for-college-students-in-india	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v0039pk3gplfv8wws	Introduction to Share Market: Investing Blueprint for Beginners	Learn safe ways to allocate small capitals in equities and mutual funds.	https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800	t	/share-market/introduction-to-share-market-how-to-start-investing-safely	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003apk3ghblxrlo9	ATS-Friendly Resume Blueprint: Optimize Keywords Instantly	Format resume descriptors correctly to pass applicant parsing tracking systems.	https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800	t	/career-jobs/how-to-write-a-resume-that-gets-selected-by-ats	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003bpk3gihpeiljf	APPSC Group 2 Core Preparation Strategy & Daily Study Hours	Organize mock practices and history timelines to pass preliminary thresholds.	https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800	t	/govt-jobs/appsc-group-2-notification-complete-syllabus-study-plan	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003cpk3gp2ck6b11	TSPSC Group 4 Expected Cutoff Marks & Score Verification	Verify document listing guidelines and regional merit metrics trends.	https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800	t	/results/tspsc-group-4-results-expected-cutoff-marks	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003dpk3g3q8rjdt7	Free NCERT Textbooks Chapter PDFs for All Boards	Download certified NCERT textbook chapters for exam preparation reference.	https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800	t	/apps-websites/top-websites-apps-for-free-ncert-textbook-pdfs	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003epk3gjmh7m32l	TCS NQT placement syllabus, questions pattern guidelines	A complete prep manual for programming, verbal and aptitude tests.	https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800	t	/internships/tcs-nqt-2026-placement-syllabus-interview-prep	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003fpk3g393w95t4	How to secure high paying Software Engineering Internships	Prepare resume descriptors and build GitHub projects to catch recruiters eyes.	https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800	t	/internships/highest-paying-software-engineering-internships-in-india	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
cmssoy77v003gpk3gn27cf2uy	Daily Current Affairs: National and Global Summits updates	Read today's mock general knowledge summary to study current events easily.	https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800	t	/current-affairs/daily-current-affairs-key-national-international-news	2026-08-14 08:34:34.891	2026-08-14 08:34:34.891
\.


--
-- Name: AiPrompt AiPrompt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AiPrompt"
    ADD CONSTRAINT "AiPrompt_pkey" PRIMARY KEY (id);


--
-- Name: BlogTag BlogTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogTag"
    ADD CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("blogId", "tagId");


--
-- Name: Blog Blog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blog"
    ADD CONSTRAINT "Blog_pkey" PRIMARY KEY (id);


--
-- Name: LatestNews LatestNews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LatestNews"
    ADD CONSTRAINT "LatestNews_pkey" PRIMARY KEY (id);


--
-- Name: MaterialFile MaterialFile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaterialFile"
    ADD CONSTRAINT "MaterialFile_pkey" PRIMARY KEY (id);


--
-- Name: MostRead MostRead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MostRead"
    ADD CONSTRAINT "MostRead_pkey" PRIMARY KEY (id);


--
-- Name: PopularTopics PopularTopics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PopularTopics"
    ADD CONSTRAINT "PopularTopics_pkey" PRIMARY KEY (id);


--
-- Name: RightCards RightCards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RightCards"
    ADD CONSTRAINT "RightCards_pkey" PRIMARY KEY (id);


--
-- Name: SiteSetting SiteSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSetting"
    ADD CONSTRAINT "SiteSetting_pkey" PRIMARY KEY (id);


--
-- Name: SlideData SlideData_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SlideData"
    ADD CONSTRAINT "SlideData_pkey" PRIMARY KEY (id);


--
-- Name: StudyMaterial StudyMaterial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyMaterial"
    ADD CONSTRAINT "StudyMaterial_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TechnologyNews TechnologyNews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TechnologyNews"
    ADD CONSTRAINT "TechnologyNews_pkey" PRIMARY KEY (id);


--
-- Name: TrendingNews TrendingNews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrendingNews"
    ADD CONSTRAINT "TrendingNews_pkey" PRIMARY KEY (id);


--
-- Name: VideoGallery VideoGallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VideoGallery"
    ADD CONSTRAINT "VideoGallery_pkey" PRIMARY KEY (id);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: WebStory WebStory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebStory"
    ADD CONSTRAINT "WebStory_pkey" PRIMARY KEY (id);


--
-- Name: YouMayLike YouMayLike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."YouMayLike"
    ADD CONSTRAINT "YouMayLike_pkey" PRIMARY KEY (id);


--
-- Name: AiPrompt_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AiPrompt_isActive_createdAt_idx" ON public."AiPrompt" USING btree ("isActive", "createdAt" DESC);


--
-- Name: BlogTag_blogId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogTag_blogId_idx" ON public."BlogTag" USING btree ("blogId");


--
-- Name: BlogTag_tagId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogTag_tagId_idx" ON public."BlogTag" USING btree ("tagId");


--
-- Name: Blog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Blog_createdAt_idx" ON public."Blog" USING btree ("createdAt" DESC);


--
-- Name: Blog_search_vector_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Blog_search_vector_idx" ON public."Blog" USING gin (search_vector);


--
-- Name: Blog_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Blog_slug_key" ON public."Blog" USING btree (slug);


--
-- Name: LatestNews_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LatestNews_isActive_createdAt_idx" ON public."LatestNews" USING btree ("isActive", "createdAt" DESC);


--
-- Name: MaterialFile_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaterialFile_isActive_createdAt_idx" ON public."MaterialFile" USING btree ("isActive", "createdAt" DESC);


--
-- Name: MostRead_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MostRead_isActive_createdAt_idx" ON public."MostRead" USING btree ("isActive", "createdAt" DESC);


--
-- Name: PopularTopics_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PopularTopics_isActive_createdAt_idx" ON public."PopularTopics" USING btree ("isActive", "createdAt" DESC);


--
-- Name: RightCards_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RightCards_isActive_createdAt_idx" ON public."RightCards" USING btree ("isActive", "createdAt" DESC);


--
-- Name: SlideData_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SlideData_isActive_createdAt_idx" ON public."SlideData" USING btree ("isActive", "createdAt" DESC);


--
-- Name: StudyMaterial_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyMaterial_isActive_createdAt_idx" ON public."StudyMaterial" USING btree ("isActive", "createdAt" DESC);


--
-- Name: Tag_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tag_parentId_idx" ON public."Tag" USING btree ("parentId");


--
-- Name: Tag_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tag_slug_idx" ON public."Tag" USING btree (slug);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: TechnologyNews_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TechnologyNews_isActive_createdAt_idx" ON public."TechnologyNews" USING btree ("isActive", "createdAt" DESC);


--
-- Name: TrendingNews_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TrendingNews_isActive_createdAt_idx" ON public."TrendingNews" USING btree ("isActive", "createdAt" DESC);


--
-- Name: VideoGallery_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VideoGallery_isActive_createdAt_idx" ON public."VideoGallery" USING btree ("isActive", "createdAt" DESC);


--
-- Name: Video_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Video_isActive_createdAt_idx" ON public."Video" USING btree ("isActive", "createdAt" DESC);


--
-- Name: WebStory_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WebStory_isActive_createdAt_idx" ON public."WebStory" USING btree ("isActive", "createdAt" DESC);


--
-- Name: YouMayLike_isActive_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "YouMayLike_isActive_createdAt_idx" ON public."YouMayLike" USING btree ("isActive", "createdAt" DESC);


--
-- Name: BlogTag BlogTag_blogId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogTag"
    ADD CONSTRAINT "BlogTag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES public."Blog"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlogTag BlogTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogTag"
    ADD CONSTRAINT "BlogTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tag Tag_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict hCRnUV3uPOaGU8KpwFBj3OPEdV1glx2275ucMJU3Vu7SbCOCd7i6y99d9N9ucxX

