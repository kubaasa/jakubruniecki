export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: ReadonlyArray<string>;
  location: string;
  status: "open-to-work" | "employed" | "freelance";
  yearsOfExperience: number;
  experienceBreakdown: ReadonlyArray<string>;
  cvDelivery: "on-request" | "public-pdf";
};

export type SkillCategory =
  | "test-automation"
  | "test-manual"
  | "api-testing"
  | "ci-cd"
  | "test-management"
  | "debugging"
  | "ai-augmented";
export type SkillLevel = "senior" | "advanced" | "intermediate" | "beginner";

export type Skill = {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  yearsUsed?: number;
};

export type DemoRepo = {
  type: "demo-repo";
  title: string;
  description: string;
  tech: ReadonlyArray<string>;
  githubUrl: string;
  liveUrl?: string;
  highlights: ReadonlyArray<string>;
  status: "active" | "archived";
};

export type CaseStudy = {
  type: "case-study";
  title: string;
  industry: string;
  role: string;
  duration: string;
  description: string;
  metrics: ReadonlyArray<string>;
  techUsed: ReadonlyArray<string>;
};

export type Project = DemoRepo | CaseStudy;

export type ContactIcon = "email" | "linkedin" | "location" | "phone";

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: ContactIcon;
};
