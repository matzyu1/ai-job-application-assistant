# AI Job Application Assistant

An honest AI-ready portfolio prototype that helps job seekers compare a job description against a candidate profile and turn the result into clearer application feedback.

This version runs fully in the browser. It does not use a backend, database, private environment variables, or an external AI API.

## Problem It Solves

Job seekers often spend too much time trying to understand what a role is really asking for. They may rewrite their CV manually without knowing which parts are most relevant, which keywords are missing, or how a recruiter might read their profile at first scan.

## What The Project Does

The app simulates an AI job application workflow using local rule-based logic. Users can load a preset demo scenario or paste their own job description and candidate profile, then run a simple fit analysis.

The goal is not to pretend real AI is running. The goal is to demonstrate the product workflow, input structure, recruiter-friendly output design, and future AI integration path.

## Key Features

- Rule-based role-fit scoring
- Five preset demo scenarios with different fit levels
- Job description and candidate profile comparison
- Recruiter Fit Snapshot with:
  - overall fit score
  - fit level
  - best matched areas
  - main gaps
  - missing keywords
  - recruiter first impression
  - suggested next action
- Three concise feedback tabs:
  - Recruiter Summary
  - CV Improvements
  - Interview Prep
- Future AI Layer explaining how live AI integration would improve the product
- Portfolio case study section
- Fully static GitHub Pages-ready structure

## How It Supports Job Applications

The prototype helps candidates quickly identify whether their profile looks relevant for a role, which keywords are visible, what gaps might concern a recruiter, and what they should improve before applying.

It is designed for fast review rather than long-form content generation, making it suitable for recruiters, portfolio reviewers, and interview discussions.

## Tech Stack

- HTML
- CSS
- JavaScript
- Local keyword matching
- Template-based feedback
- No backend
- No API key

## Live Demo

GitHub Pages:

`https://matzyu1.github.io/ai-job-application-assistant/`

## Portfolio Case Study Note

This project is intended as a junior AI / analyst portfolio prototype. It demonstrates practical AI workflow design, product thinking, input-output structure, user journey design, and basic analysis logic.

Future improvements could include AI API integration, CV upload analysis, tone control, richer cover letter generation, saved profiles, export to PDF, and deeper recruiter-style reasoning.

## Running Locally

Open `index.html` directly in a browser, or run a simple local server:

```bash
python -m http.server 4173
```

Then visit:

```text
http://localhost:4173/
```

## GitHub Pages

This project is ready to publish from the repository root because `index.html` is the entry file and all CSS/JavaScript paths are relative.
