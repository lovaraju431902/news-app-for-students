"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, BookOpen, ArrowLeft, Home } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImg: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: {
    tag: Tag;
  }[];
}

function preprocessHtmlContent(html: string): string {
  if (!html) return html;
  // Regex to match font-size style declarations (e.g. font-size: 20px, font-size:14pt, etc.)
  const fontSizeRegex = /font-size\s*:\s*([\d\.]+(?:px|pt|em|rem|%|vw|vh))/gi;
  return html.replace(fontSizeRegex, (match, val) => {
    return `--original-font-size: ${val}; font-size: min(var(--original-font-size), max(14px, calc(var(--original-font-size) * var(--inline-font-scale, 1))))`;
  });
}

function renderContentWithCodeBlocks(htmlContent: string) {
  const regex = /<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  const decodeHtml = (html: string) => {
    return html
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  };

  let keyIndex = 0;
  while ((match = regex.exec(htmlContent)) !== null) {
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      elements.push(
        <div
          key={`text-${keyIndex++}`}
          dangerouslySetInnerHTML={{ __html: preprocessHtmlContent(htmlContent.substring(lastIndex, matchIndex)) }}
        />
      );
    }

    const attrs = (match[1] || "") + " " + (match[2] || "");
    const langMatch = /class="[^"]*(?:lang|language)-([^"\s]*)/.exec(attrs);
    const lang = langMatch ? langMatch[1] : "tsx";
    const codeText = decodeHtml(match[3]);

    elements.push(
      <div key={`code-${keyIndex++}`} className="w-full max-w-3xl my-6 font-sans">
        <CodeBlock
          code={codeText}
          language={lang}
          title={lang ? `code.${lang === "typescript" ? "ts" : lang === "javascript" ? "js" : lang}` : "snippet"}
          showLineNumbers={true}
          highlightLines={[]}
          variant="terminal"
        />
      </div>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < htmlContent.length) {
    elements.push(
      <div
        key={`text-${keyIndex++}`}
        dangerouslySetInnerHTML={{ __html: preprocessHtmlContent(htmlContent.substring(lastIndex)) }}
      />
    );
  }

  return elements;
}

const ADMIN_MAPPING: Record<string, { name: string; image: string }> = {
  "part-time-income": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  },
  "share-market": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg"
  },
  "business": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  },
  // "career-jobs": {
  //   name: "Harsha Vardhan",
  //   image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_tamil_indian_guy_202606131451_tjp86m.jpg"
  // },

  "youtube-growth": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg"
  },
  "instagram": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg"
  },
  "mobile-hacks": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg"
  },
  "ai-tools": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg"
  },
  "marketing": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg"
  },
  "startup-ideas": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg"
  },
  "technology": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg"
  },
  "apps-websites": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg"
  },
  "facebook": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg"
  },
  "current-affairs": {
    name: "Kusuma",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_telugu_indian_student_202606131442_qicxhk.jpg"
  },
  "govt-jobs-updates": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg"
  },
  "files-materials": {
    name: "Bhargavi",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353599/create_a_indian_student_only_202606131457_mvyu44.jpg"
  },
  "internships": {
    name: "Harsha Vardhan",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_tamil_indian_guy_202606131451_tjp86m.jpg"
  },
  "scholarships": {
    name: "Keerthana Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_telugu_indian_student_202606131452_efm1aq.jpg"
  },
  "editing": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg"
  }
};

const INSTAGRAM_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 264.583 264.583" className="w-full h-full">
    <defs>
      <radialGradient xlinkHref="#insta-a" id="insta-f" cx="158.429" cy="578.088" r="52.352" fx="158.429" fy="578.088" gradientTransform="matrix(0 -4.03418 4.28018 0 -2332.227 942.236)" gradientUnits="userSpaceOnUse" />
      <radialGradient xlinkHref="#insta-b" id="insta-g" cx="172.615" cy="600.692" r="65" fx="172.615" fy="600.692" gradientTransform="matrix(.67441 -1.16203 1.51283 .87801 -814.366 -47.835)" gradientUnits="userSpaceOnUse" />
      <radialGradient xlinkHref="#insta-c" id="insta-h" cx="144.012" cy="51.337" r="67.081" fx="144.012" fy="51.337" gradientTransform="matrix(-2.3989 .67549 -.23008 -.81732 464.996 -26.404)" gradientUnits="userSpaceOnUse" />
      <radialGradient xlinkHref="#insta-d" id="insta-e" cx="199.788" cy="628.438" r="52.352" fx="199.788" fy="628.438" gradientTransform="matrix(-3.10797 .87652 -.6315 -2.23914 1345.65 1374.198)" gradientUnits="userSpaceOnUse" />
      <linearGradient id="insta-d">
        <stop offset="0" stopColor="#ff005f" />
        <stop offset="1" stopColor="#fc01d8" />
      </linearGradient>
      <linearGradient id="insta-c">
        <stop offset="0" stopColor="#780cff" />
        <stop offset="1" stopColor="#820bff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="insta-b">
        <stop offset="0" stopColor="#fc0" />
        <stop offset="1" stopColor="#fc0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="insta-a">
        <stop offset="0" stopColor="#fc0" />
        <stop offset=".124" stopColor="#fc0" />
        <stop offset=".567" stopColor="#fe4a05" />
        <stop offset=".694" stopColor="#ff0f3f" />
        <stop offset="1" stopColor="#fe0657" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path fill="url(#insta-e)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
    <path fill="url(#insta-f)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
    <path fill="url(#insta-g)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
    <path fill="url(#insta-h)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
    <path fill="#fff" d="M132.345 33.973c-26.716 0-30.07.117-40.563.594-10.472.48-17.62 2.136-23.876 4.567-6.47 2.51-11.958 5.87-17.426 11.335-5.472 5.464-8.834 10.948-11.354 17.412-2.44 6.252-4.1 13.397-4.57 23.858-.47 10.486-.593 13.838-.593 40.535 0 26.697.119 30.037.594 40.522.482 10.465 2.14 17.609 4.57 23.859 2.515 6.465 5.876 11.95 11.346 17.414 5.466 5.468 10.955 8.834 17.42 11.345 6.26 2.431 13.41 4.088 23.881 4.567 10.493.477 13.844.594 40.559.594 26.719 0 30.061-.117 40.555-.594 10.472-.48 17.63-2.136 23.888-4.567 6.468-2.51 11.948-5.877 17.414-11.345 5.472-5.464 8.834-10.949 11.354-17.412 2.419-6.252 4.079-13.398 4.57-23.858.472-10.486.595-13.828.595-40.525s-.123-30.047-.594-40.533c-.492-10.465-2.152-17.608-4.57-23.858-2.521-6.466-5.883-11.95-11.355-17.414-5.472-5.468-10.944-8.827-17.42-11.335-6.271-2.431-13.424-4.088-23.897-4.567-10.493-.477-13.834-.594-40.558-.594zm-8.825 17.715c2.62-.004 5.542 0 8.825 0 26.266 0 29.38.094 39.752.565 9.591.438 14.797 2.04 18.264 3.385 4.591 1.782 7.864 3.912 11.305 7.352 3.443 3.44 5.575 6.717 7.362 11.305 1.346 3.46 2.951 8.663 3.388 18.247.47 10.363.573 13.475.573 39.71 0 26.233-.102 29.346-.573 39.709-.44 9.584-2.042 14.786-3.388 18.247-1.783 4.587-3.919 7.854-7.362 11.292-3.443 3.441-6.712 5.57-11.305 7.352-3.463 1.352-8.673 2.95-18.264 3.388-10.37.47-13.486.573-39.752.573-26.268 0-29.38-.102-39.751-.573-9.592-.443-14.797-2.044-18.267-3.39-4.59-1.781-7.87-3.911-11.313-7.352-3.443-3.44-5.574-6.709-7.362-11.298-1.346-3.461-2.95-8.663-3.387-18.247-.472-10.363-.566-13.476-.566-39.726s.094-29.347.566-39.71c.438-9.584 2.04-14.786 3.387-18.25 1.783-4.588 3.919-7.865 7.362-11.305 3.443-3.441 6.722-5.57 11.313-7.357 3.468-1.351 8.675-2.949 18.267-3.389 9.075-.41 12.592-.532 30.926-.553zm61.337 16.322c-6.518 0-11.805 5.277-11.805 11.792 0 6.512 5.287 11.796 11.805 11.796 6.517 0 11.804-5.284 11.804-11.796 0-6.513-5.287-11.796-11.805-11.796zm-52.512 13.782c-27.9 0-50.519 22.603-50.519 50.482 0 27.879 22.62 50.471 50.52 50.471s50.51-22.592 50.51-50.471c0-27.879-22.613-50.482-50.513-50.482zm0 17.715c18.11 0 32.792 14.67 32.792 32.767 0 18.096-14.683 32.767-32.792 32.767-18.11 0-32.791-14.671-32.791-32.767 0-18.098 14.68-32.767 32.791-32.767z" />
  </svg>
);

const FACEBOOK_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.667 666.667" className="w-full h-full">
    <defs>
      <clipPath id="fb-clip" clipPathUnits="userSpaceOnUse">
        <path d="M0 700h700V0H0Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#fb-clip)" transform="matrix(1.33333 0 0 -1.33333 -133.333 800)">
      <path d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0" style={{ fill: "#0866ff", fillOpacity: 1, fillRule: "nonzero", stroke: "none" }} transform="translate(600 350)" />
      <path d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z" style={{ fill: "#fff", fillOpacity: 1, fillRule: "nonzero", stroke: "none" }} transform="translate(447.918 273.604)" />
    </g>
  </svg>
);

const TWITTER_X_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1200 1227" className="w-5 h-5">
    <path fill="#fff" d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
  </svg>
);

const WHATSAPP_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 360 362" className="w-full h-full">
    <path fill="#25D366" fillRule="evenodd" d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z" clipRule="evenodd" />
  </svg>
);

const TELEGRAM_SVG = (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid">
    <defs>
      <linearGradient id="telegram-gradient" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#2AABEE" />
        <stop offset="100%" stopColor="#229ED9" />
      </linearGradient>
    </defs>
    <path fill="url(#telegram-gradient)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z" />
    <path fill="#FFF" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z" />
  </svg>
);

export default function BlogContentRenderer({ blog, inline = false }: { blog: Blog; inline?: boolean }) {
  const [imageError, setImageError] = useState(false);
  const [adminImgError, setAdminImgError] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const getReadingTime = (content: string) => {
    const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText ? cleanText.split(" ").length : 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getAdminInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  let adminInfo = {
    name: "Admin",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  };

  for (const { tag } of blog.tags) {
    const normalizedSlug = tag.slug?.toLowerCase();
    if (normalizedSlug) {
      const lookupKey = normalizedSlug === "career-jobs" ? "carrer-jobs" : normalizedSlug;
      if (ADMIN_MAPPING[lookupKey]) {
        adminInfo = ADMIN_MAPPING[lookupKey];
        break;
      }
    }
  }

  const primaryTag = blog.tags.find(({ tag }) => !tag.parentId)?.tag || blog.tags[0]?.tag;
  const categoryName = primaryTag ? primaryTag.name : "Latest News";
  const categoryUrl = primaryTag ? `/${primaryTag.slug}` : "/blogs";

  const handleInstagramShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: blog.title,
          url: shareUrl
        }).catch(() => {
          copyToClipboard();
        });
      } else {
        copyToClipboard();
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Link copied! Share it on Instagram.");
    }).catch(() => {
      showToast("Failed to copy link.");
    });
  };

  return (
    <article className={cn(
      "text-zinc-900 dark:text-zinc-150 font-sans selection:bg-blue-500/20",
      inline ? "" : "min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
    )}>

      {!inline && (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/blogs"
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-650 dark:text-zinc-400 flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blogs
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Published Article</span>
        </header>
      )}

      <div className={cn(
        "",
        inline ? "w-full max-w-none" : "max-w-4xl mx-auto px-4 md:px-8"
      )}>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-4 font-sans select-none flex-wrap">
          <Link href="/" className="text-black flex gap-1 items-center hover:underline">
            <Home className="w-4 h-4" />
            Home

          </Link>
          <span className="text-black font-normal">&gt;</span>
          <Link href={categoryUrl} className="text-black hover:underline">
            {categoryName}
          </Link>
          <span className="text-black dark:text-white font-normal">&gt;</span>
          <span className="text-black dark:text-zinc-400 line-clamp-1">{blog.title}</span>
        </div>

        {primaryTag && (
          <div className="mb-4">
            <Link
              href={`/${primaryTag.slug}`}
              className="inline-block bg-[#00873d] text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              {primaryTag.name}
            </Link>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-black tracking-tight text-zinc-900 dark:text-white leading-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-y border-zinc-200 dark:border-zinc-800 py-3.5 mb-8 font-sans">

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-550 dark:text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                {!adminImgError && adminInfo.image ? (
                  <Image
                    src={adminInfo.image}
                    alt={adminInfo.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                    onError={() => setAdminImgError(true)}
                  />
                ) : (
                  <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-350">
                    {getAdminInitials(adminInfo.name)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  By <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{adminInfo.name === "Admin" ? "Students Voice" : adminInfo.name}</span>
                </span>
                <svg className="w-3.5 h-3.5 text-blue-500 fill-blue-500 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 font-light">|</span>

            <div className="flex items-center gap-1.5 py-1">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 font-light">|</span>

            <div className="flex items-center gap-1.5 py-1">
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <span>{getReadingTime(blog.content)} min read</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="w-[34px] h-[34px] flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              {FACEBOOK_SVG}
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X (Twitter)"
              className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200 p-1.5"
            >
              {TWITTER_X_SVG}
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="w-[34px] h-[34px] flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              {WHATSAPP_SVG}
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Telegram"
              className="w-[34px] h-[34px] flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              {TELEGRAM_SVG}
            </a>

            <button
              onClick={handleInstagramShare}
              title="Share on Instagram"
              className="w-[34px] h-[34px] flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {INSTAGRAM_SVG}
            </button>
          </div>
        </div>

        {blog.featuredImg && !imageError && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
            <Image
              src={blog.featuredImg}
              alt={blog.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg md:text-xl font-medium text-zinc-650 dark:text-zinc-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 my-6">
            {blog.excerpt}
          </p>
        )}

        {/* Rich HTML Content */}
        <div
          className="article-preview-content prose max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed text-base md:text-lg
            [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-extrabold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:tracking-tight [&_h1]:text-zinc-900 [&_h1]:dark:text-white
            [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-extrabold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-zinc-900 [&_h2]:dark:text-zinc-100
            [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-zinc-850 [&_h3]:dark:text-zinc-200
            [&_p]:mb-6 [&_p]:leading-relaxed
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:py-3.5 [&_blockquote]:px-5 [&_blockquote]:rounded-r-xl [&_blockquote]:bg-blue-50/50 [&_blockquote]:dark:bg-blue-950/20 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-zinc-655 [&_blockquote]:dark:text-zinc-400 [&_blockquote]:text-base [&_blockquote]:md:text-lg
            
            [&_.callout-box]:text-base [&_.callout-box]:md:text-lg
            
            [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded-md
            
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-1.5
            [&_li]:text-zinc-855 [&_li]:dark:text-zinc-300
            
            [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:underline [&_a]:transition-colors
            
            [&_code]:bg-zinc-100 [&_code]:dark:bg-zinc-900 [&_code]:text-red-500 [&_code]:dark:text-red-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
            
            [&_img]:rounded-xl [&_img]:border [&_img]:border-zinc-200 [&_img]:dark:border-zinc-800 [&_img]:my-6
            [&_img[data-alignment='left']]:float-left 
            [&_img[data-alignment='left']]:mr-6 
            [&_img[data-alignment='left']]:mb-4
            [&_img[data-alignment='right']]:float-right 
            [&_img[data-alignment='right']]:ml-6 
            [&_img[data-alignment='right']]:mb-4
            [&_img[data-alignment='center']]:block 
            [&_img[data-alignment='center']]:mx-auto 
            [&_img[data-alignment='center']]:my-6
            [&_img[data-alignment='center']]:float-none
            [&_img[data-alignment='center']]:clear-both
            
            [&_div[data-custom-video]]:my-6
            [&_div[data-custom-video][data-alignment='left']]:float-left
            [&_div[data-custom-video][data-alignment='left']]:mr-6
            [&_div[data-custom-video][data-alignment='left']]:mb-4
            [&_div[data-custom-video][data-alignment='right']]:float-right
            [&_div[data-custom-video][data-alignment='right']]:ml-6
            [&_div[data-custom-video][data-alignment='right']]:mb-4
            [&_div[data-custom-video][data-alignment='center']]:block
            [&_div[data-custom-video][data-alignment='center']]:mx-auto
            [&_div[data-custom-video][data-alignment='center']]:clear-both
            
            [&_video]:rounded-xl [&_video]:border [&_video]:border-zinc-200 [&_video]:dark:border-zinc-800 [&_video]:my-6 [&_video]:shadow-md"
        >
          {renderContentWithCodeBlocks(blog.content)}
        </div>

        {/* Clear floats just in case */}
        {!inline && (
          <div className="clear-both pt-8 mt-12 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-850 hover:bg-zinc-800 dark:hover:bg-zinc-750 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Explore More Articles
            </Link>
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-zinc-800 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </article>
  );
}
