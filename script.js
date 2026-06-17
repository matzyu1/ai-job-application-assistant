const fields = {
  jobDescription: document.querySelector("#jobDescription"),
  candidateProfile: document.querySelector("#candidateProfile"),
  targetRole: document.querySelector("#targetRole")
};

const state = {
  analysis: null,
  activeOutput: "summary",
  activeDemo: 0
};

const demoScenarios = [
  {
    targetRole: "Junior Data Analyst",
    jobDescription:
      "We are hiring a Junior Data Analyst to support reporting, dashboard creation and customer insight projects. The role requires SQL, Excel, Power BI, data cleaning, KPI reporting, stakeholder communication, commercial analysis, attention to detail and problem solving. Python, CRM data and marketing analytics would be useful but are not essential.",
    candidateProfile:
      "Early-career analyst with experience using SQL, Excel and Power BI to clean datasets, build dashboards and support KPI reporting. Created weekly reporting packs, checked attention to detail in customer records and summarised sales trends for managers. Built a Python notebook for data cleaning CSV files and a portfolio dashboard using CRM data and marketing analytics. Comfortable with stakeholder communication, commercial analysis and problem solving, with GitHub used to present project work."
  },
  {
    targetRole: "Associate Product Manager",
    jobDescription:
      "We need an Associate Product Manager to support product discovery, roadmap planning and user research. The role involves stakeholder communication, prioritisation, analytics, experimentation, product metrics, agile delivery, documentation and clear communication with design and engineering teams.",
    candidateProfile:
      "Product-focused candidate with experience in product discovery, agile delivery and roadmap planning. Worked with design and engineering teams to write documentation, review analytics and support prioritisation. Comfortable with stakeholder communication and clear communication, but still developing deeper experimentation practice."
  },
  {
    targetRole: "Digital Marketing Executive",
    jobDescription:
      "The Digital Marketing Executive will manage SEO, paid social, email campaigns, content planning and marketing analytics. The role needs copywriting, campaign reporting, CRM data, A/B testing, stakeholder communication, attention to detail and performance analysis.",
    candidateProfile:
      "Marketing graduate with experience writing social content, supporting email campaigns and reviewing campaign reporting. Used marketing analytics dashboards during coursework and helped with CRM data clean-up. Has strong copywriting and attention to detail, but limited paid social and A/B testing experience."
  },
  {
    targetRole: "Junior UX Designer",
    jobDescription:
      "We are looking for a Junior UX Designer with user research, wireframing, prototyping, Figma, usability testing, accessibility, design systems, stakeholder communication and documentation experience. The role works closely with product managers and engineers.",
    candidateProfile:
      "Career changer with customer service experience and a small portfolio of Figma landing page mockups. Completed one usability testing exercise and wrote simple documentation for a volunteer project. Has communication experience but limited user research, accessibility and design systems exposure."
  },
  {
    targetRole: "Customer Support Specialist",
    jobDescription:
      "Customer Support Specialist needed for ticket triage, Zendesk, CRM updates, customer communication, troubleshooting, escalation handling, knowledge base documentation, empathy, attention to detail and service level reporting.",
    candidateProfile:
      "Candidate has retail sales experience, cash handling, punctuality and general teamwork. Comfortable speaking with people face to face and learning new processes. Their background is positive but does not yet show specialist helpdesk, software or operational reporting evidence."
  }
];

const knownKeywords = [
  "sql", "excel", "power bi", "python", "data cleaning", "dashboard", "dashboards",
  "kpi", "kpi reporting", "reporting", "stakeholder", "stakeholder communication",
  "commercial analysis", "customer insight", "crm", "marketing analytics", "problem solving",
  "attention to detail", "communication", "data visualisation", "analysis", "github",
  "product discovery", "roadmap", "roadmap planning", "user research", "prioritisation",
  "analytics", "experimentation", "product metrics", "agile", "agile delivery", "documentation",
  "seo", "paid social", "email campaigns", "content planning", "copywriting", "campaign reporting",
  "a/b testing", "wireframing", "prototyping", "figma", "usability testing", "accessibility",
  "design systems", "ticket triage", "zendesk", "customer communication", "troubleshooting",
  "escalation", "escalation handling", "knowledge base", "empathy", "service level reporting"
];

const keywordAliases = {
  sql: ["sql", "queries", "query"],
  dashboard: ["dashboard", "dashboards", "power bi"],
  dashboards: ["dashboard", "dashboards", "power bi"],
  stakeholder: ["stakeholder", "stakeholders"],
  "stakeholder communication": ["stakeholder communication", "stakeholders", "explaining findings"],
  "customer insight": ["customer insight", "customer data", "customer"],
  "commercial analysis": ["commercial analysis", "sales trends", "business questions"],
  crm: ["crm", "customer records", "customer data"],
  "marketing analytics": ["marketing analytics", "marketing"],
  roadmap: ["roadmap", "roadmap planning"],
  "roadmap planning": ["roadmap", "roadmap planning"],
  agile: ["agile", "agile delivery"],
  "agile delivery": ["agile", "agile delivery"],
  "product metrics": ["product metrics", "metrics"],
  "paid social": ["paid social", "social ads"],
  "email campaigns": ["email campaigns", "email campaign"],
  "a/b testing": ["a/b testing", "ab testing", "testing"],
  prototyping: ["prototyping", "prototype"],
  figma: ["figma", "mockups"],
  "design systems": ["design systems", "design system"],
  "ticket triage": ["ticket triage", "ticketing", "tickets"],
  zendesk: ["zendesk", "ticketing system"],
  "customer communication": ["customer communication", "email communication", "helping customers"],
  escalation: ["escalation", "escalation handling"],
  "escalation handling": ["escalation", "escalation handling"],
  "knowledge base": ["knowledge base", "documentation"],
  "service level reporting": ["service level reporting", "service level", "sla"]
};

const stopWords = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "role", "will", "are",
  "you", "our", "your", "job", "candidate", "requires", "useful", "essential", "support"
]);

function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9+# ]/g, " ");
}

function stem(word) {
  return word
    .replace(/ies$/, "y")
    .replace(/ing$/, "")
    .replace(/ed$/, "")
    .replace(/s$/, "");
}

function extractKeywords(text) {
  const normalised = normalise(text);
  const detected = knownKeywords.filter((keyword) => normalised.includes(keyword));
  const words = normalised
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 36);

  if (detected.length >= 8) return [...new Set(detected)].slice(0, 18);
  return [...new Set([...detected, ...words])].slice(0, 18);
}

function matchesKeyword(keyword, profileText) {
  const normalisedProfile = normalise(profileText);
  if (normalisedProfile.includes(keyword)) return true;
  if ((keywordAliases[keyword] || []).some((alias) => normalisedProfile.includes(alias))) return true;

  const profileStems = new Set(normalisedProfile.split(/\s+/).map(stem));
  const keywordStems = keyword.split(/\s+/).map(stem);
  const requiredMatches = keywordStems.length <= 2 ? keywordStems.length : Math.ceil(keywordStems.length * 0.66);
  return keywordStems.filter((item) => profileStems.has(item)).length >= requiredMatches;
}

function analyseFit() {
  if (!validateInputs()) return;

  const jobText = fields.jobDescription.value.trim();
  const profileText = fields.candidateProfile.value.trim();
  const targetRole = fields.targetRole.value.trim() || "target role";
  const roleKeywords = extractKeywords(jobText);
  const matched = roleKeywords.filter((keyword) => matchesKeyword(keyword, profileText));
  const missing = roleKeywords.filter((keyword) => !matchesKeyword(keyword, profileText));
  const score = roleKeywords.length ? Math.round((matched.length / roleKeywords.length) * 100) : 0;
  const fitLevel = score >= 76 ? "Strong" : score >= 48 ? "Moderate" : "Needs Work";

  state.analysis = {
    targetRole,
    roleKeywords,
    matched,
    missing,
    score,
    fitLevel,
    jobText,
    profileText
  };

  renderResults();
  renderOutput();
  document.querySelector("#results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateInputs() {
  let valid = true;
  [fields.jobDescription, fields.candidateProfile].forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("input-error", empty);
    if (empty) valid = false;
  });

  document.querySelector("#validationMessage").textContent = valid
    ? ""
    : "Please paste both a job description and candidate profile before analysing fit.";

  return valid;
}

function renderResults() {
  const analysis = state.analysis;
  document.querySelector("#scoreRing").style.setProperty("--score", analysis.score);
  document.querySelector("#overallScore").textContent = analysis.score;
  document.querySelector("#fitLevel").textContent = `Fit level: ${analysis.fitLevel}`;

  renderList("#bestMatches", getBestMatches(analysis));
  renderList("#mainGaps", getMainGaps(analysis));
  renderTags("#missingKeywords", analysis.missing.slice(0, 6));
  document.querySelector("#firstImpression").textContent = getFirstImpression(analysis);
  document.querySelector("#nextAction").textContent = getNextAction(analysis);
}

function getBestMatches(analysis) {
  if (!analysis.matched.length) return ["No clear match detected yet."];
  return analysis.matched.slice(0, 4).map((keyword) => `Evidence found for ${keyword}.`);
}

function getMainGaps(analysis) {
  if (!analysis.missing.length) return ["No major keyword gaps detected by the prototype rules."];
  return analysis.missing.slice(0, 3).map((keyword) => `Make ${keyword} clearer if it is genuine experience.`);
}

function getFirstImpression(analysis) {
  if (analysis.fitLevel === "Strong") {
    return `The candidate looks relevant for a ${analysis.targetRole} role at first scan, with several role keywords visible.`;
  }
  if (analysis.fitLevel === "Moderate") {
    return `The candidate looks potentially relevant, but the CV would need clearer evidence around ${analysis.missing.slice(0, 2).join(" and ") || "the core requirements"}.`;
  }
  return `The candidate may look too generic because too few job-description keywords are visible in the profile.`;
}

function getNextAction(analysis) {
  if (analysis.fitLevel === "Strong") {
    return "Apply after adding one or two measurable outcomes to make the evidence stronger.";
  }
  if (analysis.fitLevel === "Moderate") {
    return `Before applying, rewrite the CV summary and top bullets to include ${analysis.missing.slice(0, 3).join(", ") || "the missing requirements"}.`;
  }
  return "Do not apply yet. First add honest role-specific evidence, projects or transferable examples that match the job description.";
}

function renderTags(selector, tags) {
  const container = document.querySelector(selector);
  container.innerHTML = "";

  if (!tags.length) {
    container.innerHTML = "<span>No major gaps</span>";
    return;
  }

  tags.forEach((tag) => {
    const element = document.createElement("span");
    element.textContent = tag;
    container.appendChild(element);
  });
}

function renderList(selector, items) {
  const list = document.querySelector(selector);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function generateOutputs() {
  if (!state.analysis) {
    return {
      summary: {
        title: "Recruiter Summary",
        content: "Run an analysis or load the demo example to generate short recruiter-friendly feedback."
      },
      cv: {
        title: "CV Improvements",
        content: "Run an analysis to see three CV improvements, keywords to add and one warning."
      },
      interview: {
        title: "Interview Prep",
        content: "Run an analysis to generate likely interview questions and a short STAR outline."
      }
    };
  }

  const analysis = state.analysis;
  const matched = analysis.matched.slice(0, 3).join(", ") || "some transferable experience";
  const missing = analysis.missing.slice(0, 3);
  const missingText = missing.join(", ") || "measurable outcomes";

  return {
    summary: {
      title: "Recruiter Summary",
      content: `At first scan, this candidate appears ${analysis.fitLevel.toLowerCase()} for ${analysis.targetRole}. The strongest evidence is around ${matched}. The application would be clearer if it showed stronger proof of ${missingText}.`
    },
    cv: {
      title: "CV Improvements",
      content:
        `Suggested bullet improvements:\n` +
        `- Lead with a bullet that connects your experience directly to ${analysis.targetRole} work.\n` +
        `- Add a measurable result to your strongest relevant project or task.\n` +
        `- Use the same practical language as the job description where it is truthful.\n\n` +
        `Keywords to add:\n` +
        `- ${missing[0] || "role impact"}\n` +
        `- ${missing[1] || "tools used"}\n` +
        `- ${missing[2] || "measurable result"}\n\n` +
        `Warning:\n` +
        `The profile may look weak if the most relevant evidence stays buried or too general.`
    },
    interview: {
      title: "Interview Prep",
      content:
        `Likely interview questions:\n` +
        `1. Which part of this role best matches your current experience?\n` +
        `2. Tell me about a time you used ${matched.split(", ")[0] || "analysis"} to solve a problem.\n` +
        `3. How would you close the gap around ${missing[0] || "a new requirement"}?\n\n` +
        `STAR outline:\n` +
        `Situation: A task required clearer analysis or reporting.\n` +
        `Task: Explain what decision or output was needed.\n` +
        `Action: Describe the tool, method and communication step.\n` +
        `Result: Add a measurable or practical outcome.`
    }
  };
}

function renderOutput() {
  const outputs = generateOutputs();
  const active = outputs[state.activeOutput];
  document.querySelector("#outputTitle").textContent = active.title;
  document.querySelector("#outputContent").textContent = active.content;
}

function resetApp() {
  Object.values(fields).forEach((field) => {
    field.value = "";
    field.classList.remove("input-error");
  });
  state.analysis = null;
  state.activeOutput = "summary";
  state.activeDemo = 0;
  setActiveDemoButton();
  document.querySelector("#validationMessage").textContent = "";
  document.querySelectorAll(".tab").forEach((tab) => {
    const isSummary = tab.dataset.output === "summary";
    tab.classList.toggle("active", isSummary);
    tab.setAttribute("aria-selected", String(isSummary));
  });
  renderEmptyState();
}

function renderEmptyState() {
  document.querySelector("#scoreRing").style.setProperty("--score", 0);
  document.querySelector("#overallScore").textContent = "0";
  document.querySelector("#fitLevel").textContent = "Fit level: Not analysed";
  renderList("#bestMatches", ["Run the analysis to see matched areas."]);
  renderList("#mainGaps", ["Run the analysis to see candidate gaps."]);
  renderTags("#missingKeywords", ["Pending"]);
  document.querySelector("#firstImpression").textContent = "The snapshot will summarise whether the candidate looks relevant at first scan.";
  document.querySelector("#nextAction").textContent = "Load the demo or analyse your own text to receive a recommended next step.";
  renderOutput();
}

function fillDemo(index = state.activeDemo) {
  const scenario = demoScenarios[index] || demoScenarios[0];
  state.activeDemo = demoScenarios[index] ? index : 0;
  fields.jobDescription.value = scenario.jobDescription;
  fields.candidateProfile.value = scenario.candidateProfile;
  fields.targetRole.value = scenario.targetRole;
  Object.values(fields).forEach((field) => field.classList.remove("input-error"));
  document.querySelector("#validationMessage").textContent = "";
  setActiveDemoButton();
}

function loadDemo(index = state.activeDemo) {
  fillDemo(index);
  analyseFit();
}

document.querySelector("#analyseButton").addEventListener("click", analyseFit);
document.querySelector("#tryDemoButton").addEventListener("click", () => {
  fillDemo();
  document.querySelector("#workflow").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#resetButton").addEventListener("click", resetApp);

document.querySelectorAll(".demo-option").forEach((button) => {
  button.addEventListener("click", () => {
    fillDemo(Number(button.dataset.demo));
  });
});

function setActiveDemoButton() {
  document.querySelectorAll(".demo-option").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.demo) === state.activeDemo);
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    state.activeOutput = tab.dataset.output;
    renderOutput();
  });
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    field.classList.remove("input-error");
    document.querySelector("#validationMessage").textContent = "";
  });
});

renderEmptyState();
