"use client";

import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import clsx from "clsx";

type PersonalDetails = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
};

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
};

type Education = {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
  highlights: string[];
};

type SkillCategory = {
  id: string;
  label: string;
  items: string[];
};

type ResumeData = {
  personal: PersonalDetails;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
};

const newId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

const defaultResume: ResumeData = {
  personal: {
    fullName: "Avery Johnson",
    headline: "Product Designer",
    email: "avery.johnson@email.com",
    phone: "+1 (123) 555-4821",
    location: "San Francisco, CA",
    website: "averyjohnson.design",
    summary:
      "Human-centered designer with 6+ years of experience crafting product experiences for SaaS platforms. Excels at bridging research, interaction design, and execution to ship measurable outcomes.",
  },
  experiences: [
    {
      id: newId(),
      role: "Senior Product Designer",
      company: "Lumen Analytics",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "",
      isCurrent: true,
      highlights: [
        "Led redesign of analytics dashboard that increased weekly active usage by 27%.",
        "Partnered with product & data science to launch forecasting flow adopted by 60% of enterprise accounts.",
        "Built design system foundations that reduced handoff time by 35%.",
      ],
    },
  ],
  education: [
    {
      id: newId(),
      school: "Parsons School of Design",
      degree: "BFA, Communication Design",
      startDate: "2011",
      endDate: "2015",
      details: "Graduated Magna Cum Laude · UX Thesis Award",
    },
  ],
  projects: [
    {
      id: newId(),
      name: "Align Mobile",
      description:
        "Personal wellness mobile app that helps teams coordinate wellbeing rituals.",
      url: "align.mobile",
      highlights: [
        "Designed onboarding that improved trial conversion by 18%.",
        "Built qualitative research program with 40+ recurring participants.",
      ],
    },
  ],
  skills: [
    {
      id: newId(),
      label: "Core Skills",
      items: [
        "Interaction Design",
        "Design Systems",
        "User Research",
        "Rapid Prototyping",
      ],
    },
    {
      id: newId(),
      label: "Tools",
      items: ["Figma", "Framer", "Notion", "Maze", "Amplitude"],
    },
  ],
};

const bulletSuggestions: Record<string, string[]> = {
  designer: [
    "Created end-to-end flows informed by research that lifted key KPI by 15%.",
    "Facilitated cross-functional workshops to align product direction.",
    "Built high-fidelity prototypes accelerating usability testing cycles.",
  ],
  engineer: [
    "Shipped performant features with measurable latency improvements.",
    "Automated release workflows, reducing deployment effort dramatically.",
    "Mentored junior developers and introduced team-wide coding standards.",
  ],
  manager: [
    "Led cross-functional planning cadences ensuring predictable delivery.",
    "Instituted feedback rituals improving engagement scores across the org.",
    "Scaled hiring pipeline resulting in 3 high-performing team additions.",
  ],
};

const templates: {
  id: string;
  name: string;
  accent: string;
  border: string;
  heading: string;
  emphasis: string;
}[] = [
  {
    id: "minimal",
    name: "Minimal",
    accent: "text-slate-900",
    border: "border-slate-300",
    heading: "text-slate-800",
    emphasis: "text-slate-600",
  },
  {
    id: "midnight",
    name: "Midnight",
    accent: "text-sky-50",
    border: "border-sky-200/70",
    heading: "text-sky-100",
    emphasis: "text-sky-200",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    accent: "text-amber-900",
    border: "border-amber-300",
    heading: "text-amber-800",
    emphasis: "text-amber-600",
  },
];

const templateBackground: Record<string, string> = {
  minimal: "bg-white",
  midnight: "bg-slate-900 text-slate-50",
  sunrise: "bg-amber-50",
};

const templateAccent: Record<string, string> = {
  minimal: "text-slate-900",
  midnight: "text-sky-300",
  sunrise: "text-amber-700",
};

const templateDivider: Record<string, string> = {
  minimal: "border-slate-200",
  midnight: "border-slate-700",
  sunrise: "border-amber-200",
};

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "appearance">(
    "content",
  );
  const [template, setTemplate] = useState<string>("minimal");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resume.personal.fullName} Resume`,
  });

  const sectionAnchors = useMemo(
    () => ({
      personal: "Personal Info",
      experiences: "Experience",
      education: "Education",
      projects: "Projects",
      skills: "Skills",
    }),
    [],
  );

  const addExperience = () => {
    const newExperience: Experience = {
      id: newId(),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      highlights: [""],
    };
    setResume((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
    setActiveExperience(newExperience.id);
  };

  const addExperienceHighlight = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id
          ? { ...exp, highlights: [...exp.highlights, ""] }
          : exp,
      ),
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const updateExperienceHighlight = (
    id: string,
    index: number,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              highlights: exp.highlights.map((item, idx) =>
                idx === index ? value : item,
              ),
            }
          : exp,
      ),
    }));
  };

  const removeExperienceHighlight = (id: string, index: number) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              highlights: exp.highlights.filter((_, idx) => idx !== index),
            }
          : exp,
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: newId(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      details: "",
    };
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: newId(),
      name: "",
      description: "",
      url: "",
      highlights: [""],
    };
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj,
      ),
    }));
  };

  const updateProjectHighlight = (
    id: string,
    index: number,
    value: string,
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id
          ? {
              ...proj,
              highlights: proj.highlights.map((item, idx) =>
                idx === index ? value : item,
              ),
            }
          : proj,
      ),
    }));
  };

  const removeProjectHighlight = (id: string, index: number) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id
          ? {
              ...proj,
              highlights: proj.highlights.filter((_, idx) => idx !== index),
            }
          : proj,
      ),
    }));
  };

  const addProjectHighlight = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id
          ? { ...proj, highlights: [...proj.highlights, ""] }
          : proj,
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const addSkillCategory = () => {
    const newSkill: SkillCategory = {
      id: newId(),
      label: "New Category",
      items: [],
    };
    setResume((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkillCategory = (
    id: string,
    field: keyof SkillCategory,
    value: string | string[],
  ) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill,
      ),
    }));
  };

  const removeSkillCategory = (id: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const promptSuggestions = (role: string) => {
    if (!role) return [];
    const roleKey = role.toLowerCase();
    if (roleKey.includes("design")) return bulletSuggestions.designer;
    if (roleKey.includes("engineer") || roleKey.includes("developer")) {
      return bulletSuggestions.engineer;
    }
    if (
      roleKey.includes("manager") ||
      roleKey.includes("lead") ||
      roleKey.includes("director")
    ) {
      return bulletSuggestions.manager;
    }
    return [
      "Delivered impactful outcomes tied to measurable business metrics.",
      "Optimized workflows that saved significant time for cross-functional partners.",
      "Initiated improvements that elevated product quality and team efficiency.",
    ];
  };

  const replaceHighlightWithSuggestion = (id: string, text: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              highlights:
                exp.highlights.length === 0
                  ? [text]
                  : [text, ...exp.highlights.slice(1)],
            }
          : exp,
      ),
    }));
  };

  const highlightSuggestion = (exp: Experience) => {
    const suggestionPool = promptSuggestions(exp.role);
    return suggestionPool.map((text) => (
      <button
        key={text}
        className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        onClick={(event) => {
          event.preventDefault();
          replaceHighlightWithSuggestion(exp.id, text);
        }}
      >
        {text}
      </button>
    ));
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col gap-6 py-10">
      <header className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm shadow-slate-100/60 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Resume Builder Agent
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Craft a polished resume with live preview, templates, and guided
            prompts.
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
          >
            Export PDF
          </button>
          <button
            onClick={addExperience}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Quick Add Role
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <aside className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-sm font-medium text-slate-600 shadow-sm">
            <button
              onClick={() => setActiveTab("content")}
              className={clsx(
                "w-full rounded-lg px-4 py-2 transition",
                activeTab === "content"
                  ? "bg-slate-900 text-white shadow"
                  : "hover:bg-slate-100",
              )}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={clsx(
                "w-full rounded-lg px-4 py-2 transition",
                activeTab === "appearance"
                  ? "bg-slate-900 text-white shadow"
                  : "hover:bg-slate-100",
              )}
            >
              Appearance
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {activeTab === "content" ? (
              <div className="flex flex-col gap-8">
                <section className="flex flex-col gap-3" id="personal">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Personal
                    </h2>
                    <span className="text-xs text-slate-400">Basics</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      ["fullName", "Full name"],
                      ["headline", "Professional headline"],
                      ["summary", "Summary"],
                      ["email", "Email"],
                      ["phone", "Phone"],
                      ["location", "Location"],
                      ["website", "Website or portfolio"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex flex-col gap-1 text-xs">
                        <span className="font-medium text-slate-600">
                          {label}
                        </span>
                        {key === "summary" ? (
                          <textarea
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:shadow"
                            rows={3}
                            value={
                              resume.personal[key as keyof PersonalDetails] as
                                | string
                                | number
                            }
                            onFocus={() => setFocusedField(`personal-${key}`)}
                            onChange={(event) =>
                              setResume((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  [key]: event.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          <input
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:shadow"
                            value={
                              resume.personal[key as keyof PersonalDetails] as
                                | string
                                | number
                            }
                            onFocus={() => setFocusedField(`personal-${key}`)}
                            onChange={(event) =>
                              setResume((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  [key]: event.target.value,
                                },
                              }))
                            }
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Experience
                    </h2>
                    <button
                      onClick={addExperience}
                      className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
                    >
                      Add Role
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {resume.experiences.map((exp, expIndex) => (
                      <div
                        key={exp.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Role {expIndex + 1}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              onClick={() => setActiveExperience(exp.id)}
                              className={clsx(
                                "rounded-full px-3 py-1 transition",
                                activeExperience === exp.id
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-500 hover:bg-slate-200/70",
                              )}
                            >
                              Focus
                            </button>
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="rounded-full px-3 py-1 text-slate-400 transition hover:bg-slate-200/70 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3">
                          {[
                            ["role", "Role title"],
                            ["company", "Company"],
                            ["location", "Location"],
                          ].map(([key, label]) => (
                            <label
                              key={key}
                              className="flex flex-col gap-1 text-xs text-slate-600"
                            >
                              <span>{label}</span>
                              <input
                                value={exp[key as keyof Experience] as string}
                                onChange={(event) =>
                                  updateExperience(
                                    exp.id,
                                    key as keyof Experience,
                                    event.target.value,
                                  )
                                }
                                onFocus={() =>
                                  setFocusedField(
                                    `${exp.id}-${key as string}`,
                                  )
                                }
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                              />
                            </label>
                          ))}
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              ["startDate", "Start"],
                              ["endDate", "End (leave blank if current)"],
                            ].map(([key, label]) => (
                              <label
                                key={key}
                                className="flex flex-col gap-1 text-xs text-slate-600"
                              >
                                <span>{label}</span>
                                <input
                                  value={exp[key as keyof Experience] as string}
                                  onChange={(event) =>
                                    updateExperience(
                                      exp.id,
                                      key as keyof Experience,
                                      event.target.value,
                                    )
                                  }
                                  onFocus={() =>
                                    setFocusedField(
                                      `${exp.id}-${key as string}`,
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                                />
                              </label>
                            ))}
                          </div>
                          <label className="flex items-center gap-2 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={exp.isCurrent}
                              onChange={(event) =>
                                updateExperience(
                                  exp.id,
                                  "isCurrent",
                                  event.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border border-slate-300"
                            />
                            Currently here
                          </label>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {highlightSuggestion(exp)}
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            Highlights
                          </p>
                          {exp.highlights.map((item, idx) => (
                            <div className="flex items-center gap-2" key={idx}>
                              <textarea
                                value={item}
                                onChange={(event) =>
                                  updateExperienceHighlight(
                                    exp.id,
                                    idx,
                                    event.target.value,
                                  )
                                }
                                onFocus={() =>
                                  setFocusedField(`${exp.id}-highlight-${idx}`)
                                }
                                rows={2}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                              />
                              <button
                                onClick={() =>
                                  removeExperienceHighlight(exp.id, idx)
                                }
                                className="rounded-full px-3 py-2 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addExperienceHighlight(exp.id)}
                            className="self-start rounded-full border border-slate-300 px-4 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Add highlight
                          </button>
                        </div>
                      </div>
                    ))}
                    {resume.experiences.length === 0 && (
                      <button
                        onClick={addExperience}
                        className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        Add your first role
                      </button>
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4" id="education">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Education
                    </h2>
                    <button
                      onClick={addEducation}
                      className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
                    >
                      Add Program
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {resume.education.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner"
                      >
                        <div className="flex items-start justify-between text-xs">
                          <p className="font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Program {index + 1}
                          </p>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="rounded-full px-3 py-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3">
                          {[
                            ["school", "School"],
                            ["degree", "Degree"],
                            ["details", "Honors / details"],
                          ].map(([key, label]) => (
                            <label
                              key={key}
                              className="flex flex-col gap-1 text-xs text-slate-600"
                            >
                              <span>{label}</span>
                              {key === "details" ? (
                                <textarea
                                  value={edu[key as keyof Education] as string}
                                  onChange={(event) =>
                                    updateEducation(
                                      edu.id,
                                      key as keyof Education,
                                      event.target.value,
                                    )
                                  }
                                  onFocus={() =>
                                    setFocusedField(
                                      `${edu.id}-${key as string}`,
                                    )
                                  }
                                  rows={2}
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                                />
                              ) : (
                                <input
                                  value={edu[key as keyof Education] as string}
                                  onChange={(event) =>
                                    updateEducation(
                                      edu.id,
                                      key as keyof Education,
                                      event.target.value,
                                    )
                                  }
                                  onFocus={() =>
                                    setFocusedField(
                                      `${edu.id}-${key as string}`,
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                                />
                              )}
                            </label>
                          ))}
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              ["startDate", "Start"],
                              ["endDate", "End"],
                            ].map(([key, label]) => (
                              <label
                                key={key}
                                className="flex flex-col gap-1 text-xs text-slate-600"
                              >
                                <span>{label}</span>
                                <input
                                  value={edu[key as keyof Education] as string}
                                  onChange={(event) =>
                                    updateEducation(
                                      edu.id,
                                      key as keyof Education,
                                      event.target.value,
                                    )
                                  }
                                  onFocus={() =>
                                    setFocusedField(
                                      `${edu.id}-${key as string}`,
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {resume.education.length === 0 && (
                      <button
                        onClick={addEducation}
                        className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        Add your education
                      </button>
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4" id="projects">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Projects
                    </h2>
                    <button
                      onClick={addProject}
                      className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
                    >
                      Add Project
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {resume.projects.map((project, index) => (
                      <div
                        key={project.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner"
                      >
                        <div className="flex items-start justify-between text-xs">
                          <p className="font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Project {index + 1}
                          </p>
                          <button
                            onClick={() => removeProject(project.id)}
                            className="rounded-full px-3 py-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3">
                          {[
                            ["name", "Project name"],
                            ["url", "URL"],
                          ].map(([key, label]) => (
                            <label
                              key={key}
                              className="flex flex-col gap-1 text-xs text-slate-600"
                            >
                              <span>{label}</span>
                              <input
                                value={project[key as keyof Project] as string}
                                onChange={(event) =>
                                  updateProject(
                                    project.id,
                                    key as keyof Project,
                                    event.target.value,
                                  )
                                }
                                onFocus={() =>
                                  setFocusedField(
                                    `${project.id}-${key as string}`,
                                  )
                                }
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                              />
                            </label>
                          ))}
                          <label className="flex flex-col gap-1 text-xs text-slate-600">
                            <span>Description</span>
                            <textarea
                              value={project.description}
                              onChange={(event) =>
                                updateProject(
                                  project.id,
                                  "description",
                                  event.target.value,
                                )
                              }
                              onFocus={() =>
                                setFocusedField(`${project.id}-description`)
                              }
                              rows={2}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                            />
                          </label>
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            Highlights
                          </p>
                          {project.highlights.map((item, idx) => (
                            <div className="flex items-center gap-2" key={idx}>
                              <textarea
                                value={item}
                                onChange={(event) =>
                                  updateProjectHighlight(
                                    project.id,
                                    idx,
                                    event.target.value,
                                  )
                                }
                                onFocus={() =>
                                  setFocusedField(
                                    `${project.id}-highlight-${idx}`,
                                  )
                                }
                                rows={2}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                              />
                              <button
                                onClick={() =>
                                  removeProjectHighlight(project.id, idx)
                                }
                                className="rounded-full px-3 py-2 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addProjectHighlight(project.id)}
                            className="self-start rounded-full border border-slate-300 px-4 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Add highlight
                          </button>
                        </div>
                      </div>
                    ))}
                    {resume.projects.length === 0 && (
                      <button
                        onClick={addProject}
                        className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        Add a project
                      </button>
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4" id="skills">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Skills
                    </h2>
                    <button
                      onClick={addSkillCategory}
                      className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
                    >
                      Add Category
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {resume.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner"
                      >
                        <div className="flex items-start justify-between text-xs">
                          <input
                            value={skill.label}
                            onChange={(event) =>
                              updateSkillCategory(
                                skill.id,
                                "label",
                                event.target.value,
                              )
                            }
                            onFocus={() =>
                              setFocusedField(`${skill.id}-label`)
                            }
                            className="w-full max-w-[220px] rounded-lg border border-transparent bg-transparent px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 outline-none transition focus:border-slate-300 focus:bg-white"
                          />
                          <button
                            onClick={() => removeSkillCategory(skill.id)}
                            className="rounded-full px-3 py-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                        <textarea
                          value={skill.items.join(", ")}
                          onChange={(event) =>
                            updateSkillCategory(
                              skill.id,
                              "items",
                              event.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            )
                          }
                          onFocus={() =>
                            setFocusedField(`${skill.id}-items`)
                          }
                          rows={2}
                          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:shadow"
                          placeholder="List comma separated skills"
                        />
                      </div>
                    ))}
                    {resume.skills.length === 0 && (
                      <button
                        onClick={addSkillCategory}
                        className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        Add a skill category
                      </button>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Template
                  </h2>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {templates.map((item) => (
                      <button
                        key={item.id}
                        className={clsx(
                          "rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md",
                          template === item.id
                            ? "border-slate-900 shadow-lg"
                            : "border-slate-200",
                        )}
                        onClick={() => setTemplate(item.id)}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {template === item.id
                            ? "Active template"
                            : "Tap to apply"}
                        </p>
                        <div
                          className={clsx(
                            "mt-4 h-20 rounded-xl border",
                            item.border,
                            item.accent,
                            "bg-gradient-to-br from-white to-slate-50",
                          )}
                        >
                          <div className="flex h-full flex-col justify-between p-3 text-xs">
                            <span className={item.heading}>Heading</span>
                            <span className={item.emphasis}>Details</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Focus Navigator
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sectionAnchors).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() =>
                          document
                            .getElementById(key)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="rounded-full border border-slate-300 px-4 py-1 text-xs text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={() => setFocusedField(null)}
                      className="rounded-full border border-slate-300 px-4 py-1 text-xs text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      Clear focus
                    </button>
                  </div>
                </section>

                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Tips
                  </h2>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>Prioritize measurable results in highlights.</li>
                    <li>Keep each bullet to one impactful statement.</li>
                    <li>Use the Focus button on roles to iterate quickly.</li>
                    <li>
                      Export to PDF when ready. The layout is print optimized.
                    </li>
                  </ul>
                </section>
              </div>
            )}
          </div>
        </aside>

        <section
          className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner md:p-10"
          id="preview"
        >
          <div className="pointer-events-none absolute left-0 top-10 hidden h-[70%] w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent lg:block" />
          <div
            ref={previewRef}
            className={clsx(
              "resume-preview mx-auto max-w-3xl rounded-2xl border bg-white p-10 shadow-xl",
              templateBackground[template],
              templateDivider[template],
            )}
          >
            <header className="border-b pb-4">
              <div className="flex flex-col gap-1">
                <h1
                  className={clsx(
                    "text-3xl font-semibold tracking-tight",
                    templateAccent[template],
                  )}
                >
                  {resume.personal.fullName || "Your Name"}
                </h1>
                <p className="text-sm font-medium text-slate-500">
                  {resume.personal.headline || "Professional Headline"}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                {resume.personal.email && (
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Email:</span>
                    {resume.personal.email}
                  </span>
                )}
                {resume.personal.phone && (
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Phone:</span>
                    {resume.personal.phone}
                  </span>
                )}
                {resume.personal.location && (
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Location:</span>
                    {resume.personal.location}
                  </span>
                )}
                {resume.personal.website && (
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Website:</span>
                    {resume.personal.website}
                  </span>
                )}
              </div>
              {resume.personal.summary && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {resume.personal.summary}
                </p>
              )}
            </header>

            <div className="mt-6 space-y-6">
              {resume.experiences.length > 0 && (
                <section className="space-y-3">
                  <h2
                    className={clsx(
                      "text-xs font-semibold uppercase tracking-[0.3em]",
                      templateAccent[template],
                    )}
                  >
                    Experience
                  </h2>
                  <div className="space-y-5">
                    {resume.experiences.map((exp) => (
                      <article
                        key={exp.id}
                        className={clsx(
                          "rounded-lg border-l-2 pl-4",
                          templateDivider[template],
                          focusedField?.startsWith(exp.id)
                            ? "bg-white/80 shadow"
                            : "bg-white/40",
                        )}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                              {exp.role || "Role Title"}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {[exp.company, exp.location]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">
                            {[exp.startDate, exp.isCurrent ? "Present" : exp.endDate]
                              .filter(Boolean)
                              .join(" — ")}
                          </p>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {exp.highlights
                            .filter((item) => item.trim().length > 0)
                            .map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                <span className="mr-2 text-slate-400">•</span>
                                {item}
                              </li>
                            ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {resume.projects.length > 0 && (
                <section className="space-y-3">
                  <h2
                    className={clsx(
                      "text-xs font-semibold uppercase tracking-[0.3em]",
                      templateAccent[template],
                    )}
                  >
                    Projects
                  </h2>
                  <div className="space-y-5">
                    {resume.projects.map((project) => (
                      <article
                        key={project.id}
                        className={clsx(
                          "rounded-lg border p-4",
                          templateDivider[template],
                          focusedField?.startsWith(project.id)
                            ? "bg-white shadow"
                            : "bg-white/60",
                        )}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                              {project.name || "Project Name"}
                            </h3>
                            {project.url && (
                              <p className="text-xs text-slate-500">
                                {project.url}
                              </p>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-xs text-slate-500">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {project.highlights
                            .filter((item) => item.trim().length > 0)
                            .map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                <span className="mr-2 text-slate-400">•</span>
                                {item}
                              </li>
                            ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {resume.education.length > 0 && (
                <section className="space-y-3">
                  <h2
                    className={clsx(
                      "text-xs font-semibold uppercase tracking-[0.3em]",
                      templateAccent[template],
                    )}
                  >
                    Education
                  </h2>
                  <div className="space-y-4">
                    {resume.education.map((edu) => (
                      <article
                        key={edu.id}
                        className={clsx(
                          "rounded-lg border-l-2 pl-4",
                          templateDivider[template],
                          focusedField?.startsWith(edu.id)
                            ? "bg-white/80 shadow"
                            : "bg-white/40",
                        )}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                              {edu.school || "School"}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {edu.degree || "Degree"}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">
                            {[edu.startDate, edu.endDate]
                              .filter(Boolean)
                              .join(" — ")}
                          </p>
                        </div>
                        {edu.details && (
                          <p className="mt-2 text-sm text-slate-700">
                            {edu.details}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {resume.skills.length > 0 && (
                <section className="space-y-3">
                  <h2
                    className={clsx(
                      "text-xs font-semibold uppercase tracking-[0.3em]",
                      templateAccent[template],
                    )}
                  >
                    Skills
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {resume.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={clsx(
                          "rounded-lg border p-4",
                          templateDivider[template],
                          focusedField?.startsWith(skill.id)
                            ? "bg-white shadow"
                            : "bg-white/60",
                        )}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {skill.label || "Category"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
                          {skill.items.length > 0
                            ? skill.items.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                                >
                                  {item}
                                </span>
                              ))
                            : "Add skills"}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResumeBuilder;
