export interface CategoryAdminInfo {
  name: string;
  image: string;
}

export const CATEGORY_ADMINS: Record<string, CategoryAdminInfo> = {
  "part-time-income": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg",
  },
  "share-market": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg",
  },
  "ai-prompts": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg",
  },
  "youtube-growth": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg",
  },
  "instagram": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg",
  },
  "mobile-hacks": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg",
  },
  "ai-tools": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg",
  },
  "marketing": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg",
  },
  "startup-ideas": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg",
  },
  "technology": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg",
  },
  "apps-websites": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg",
  },
  "facebook": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg",
  },
  "current-affairs": {
    name: "Kusuma",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_telugu_indian_student_202606131442_qicxhk.jpg",
  },
  "govt-jobs-updates": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg",
  },
  "govt-jobs": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg",
  },
  "career-jobs": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg",
  },
  "carrer-jobs": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg",
  },
  "files-materials": {
    name: "Bhargavi",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353599/create_a_indian_student_only_202606131457_mvyu44.jpg",
  },
  "internships": {
    name: "Harsha Vardhan",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_tamil_indian_guy_202606131451_tjp86m.jpg",
  },
  "scholarships": {
    name: "Keerthana Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_telugu_indian_student_202606131452_efm1aq.jpg",
  },
  "editing": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg",
  },
  "exam-prep": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg",
  },
};

/**
 * Returns the admin name and avatar for a given category slug.
 */
export function getCategoryAdmin(categorySlug?: string | null): CategoryAdminInfo {
  if (!categorySlug) {
    return { name: "Rakesh Naidu", image: "/logo.png" };
  }
  const clean = categorySlug.toLowerCase().trim().replace(/_/g, "-");
  return (
    CATEGORY_ADMINS[clean] || {
      name: "Rakesh Naidu",
      image: "/logo.png",
    }
  );
}

/**
 * Formats the author string as "Admin <Name>"
 */
export function getFormattedAdminName(categorySlug?: string | null): string {
  const admin = getCategoryAdmin(categorySlug);
  return `Admin ${admin.name}`;
}
