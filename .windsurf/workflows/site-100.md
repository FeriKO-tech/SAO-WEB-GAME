---
auto_execution_mode: 0
description: Bring the entire SAO WEB GAME website to 100% before starting the game client roadmap
---
Your mission is to finish the full SAO WEB GAME website to a true production-ready state.

Do not start any game client roadmap work until this workflow is fully completed and the website has passed the final completion gate.

# Core rules for the agent

1. Work autonomously in clearly defined phases.
2. Keep a live todo list with exactly one `in_progress` item at a time.
3. At the start of each new area, identify the authoritative files and data flow before editing.
4. Prefer implementing verified fixes over long theory when the path is clear.
5. After each meaningful stage, report progress in percentages for:
   - whole website
   - frontend
   - backend
   - cybersecurity
6. After each completed and verified stage, run the appropriate checks. At minimum, run the project build.
7. If verification succeeds, deploy immediately for production-facing website work.
8. Never deploy broken or unverified code.
9. Keep Firestore rules, types, and client logic aligned whenever the data model changes.
10. Do not switch to the game client roadmap while website P0 or P1 issues remain.
11. Only interrupt the user when a real decision, credential, or external approval is required.

# Phase 1 - Establish the site completion board

Create a master completion board for the whole website.

Required outcomes:
- Inventory all major website modules and flows.
- Score the current state of each major area.
- Build a prioritized backlog grouped as `P0`, `P1`, `P2`.
- Identify what is already complete, what is partially complete, and what is missing.

Minimum modules to audit:
- public pages / landing / navigation
- authentication
- account settings / profile
- support / staff tools
- forum / community features
- content pages / news / legal pages
- Firestore rules / access control
- Cloud Functions / server automation
- localization
- deployment / production readiness
- cybersecurity hardening

Deliverables for this phase:
- a concise master backlog
- current global completion percentage
- current frontend percentage
- current backend percentage
- current cybersecurity percentage

# Phase 2 - Finish the support and staff system

Close the remaining support backlog first, because it is already advanced and production-facing.

Required outcomes:
- finish ticket assignment
- finish internal notes
- refine user-facing and staff-facing error messages
- verify requester identity display
- verify unread logic
- verify resolved ticket closure behavior
- verify notifications
- verify priority editing and sorting
- verify staff/admin permission boundaries

Definition of done for this phase:
- no known support-system P0/P1 issues remain
- build passes
- production deploy is complete
- progress percentages are updated

# Phase 3 - Finish auth, profile, and account flows

Audit and complete all user account flows.

Required outcomes:
- verify login, register, logout, and auth-action flows
- verify password reset and email action flows
- verify Google/local provider edge cases
- verify username uniqueness and rename behavior
- verify settings save/load behavior
- verify personal profile fields and display formatting
- verify access control around account data
- fix missing validation, errors, and edge cases

Definition of done for this phase:
- critical account flows work end-to-end
- no known P0/P1 auth or profile issues remain
- build passes
- deploy if changes were made

# Phase 4 - Finish forum, community, and content areas

Bring the non-support site surfaces to production quality.

Required outcomes:
- audit forum flows and permissions
- verify posting, reading, editing, and deletion behavior if supported
- verify moderation/admin boundaries if supported
- verify search, empty states, and loading states
- verify news and static content rendering
- verify legal/public pages for consistency and quality
- fix broken routes, missing states, and UI regressions

Definition of done for this phase:
- all public/community areas are stable and coherent
- no obvious broken flows remain
- build passes
- deploy if changes were made

# Phase 5 - Cybersecurity hardening

Run a dedicated security pass across the whole website.

Required outcomes:
- audit Firestore rules for every writable collection
- verify owner/staff/admin permissions across all flows
- verify client-side rendering safety and escaping
- review server/client secrets exposure risks
- review `.env` handling and unsafe public config exposure
- review dependency risk and vulnerable packages where possible
- add or plan anti-abuse protections for public endpoints and forms
- evaluate App Check, rate limiting, spam prevention, and brute-force mitigation where relevant
- review hosting hardening opportunities such as headers or CSP where applicable

Definition of done for this phase:
- no obvious high-severity security gaps remain in reviewed areas
- rules match the real data model
- critical write paths are defended
- security percentage is updated

# Phase 6 - UX, localization, accessibility, and performance polish

Perform a site-wide quality pass after the main feature work is stable.

Required outcomes:
- verify responsive behavior on key pages
- verify empty/loading/error states
- verify text consistency and tone
- verify localization coverage for new and existing features
- verify accessibility basics for interactive flows
- remove obvious UX friction and rough edges
- fix obvious performance regressions in major flows

Definition of done for this phase:
- website feels consistent and polished
- no major untranslated or broken UI states remain
- build passes
- deploy if changes were made

# Phase 7 - Final release gate for the website

Only declare the website complete when all of the following are true:
- no known website-scope P0 issues remain
- no known website-scope P1 issues remain
- critical user flows are verified manually
- critical staff/admin flows are verified manually
- Firestore rules are aligned with final data structures
- build passes cleanly
- production deployment is complete
- remaining backlog is optional polish only

Final deliverables:
- final website completion percentage = 100%
- final frontend percentage
- final backend percentage
- final cybersecurity percentage
- a short list of optional future improvements

# Exit condition before starting the game client roadmap

Do not begin any game client planning or implementation until this workflow reaches the final release gate.

Once the website is complete:
1. Produce a final handoff summary for the finished website.
2. List deferred non-critical polish separately.
3. Start a new roadmap specifically for the game client.
4. Treat the website as a stabilized production surface, not an active unfinished foundation.

# Expected status update format after each completed stage

Use a short update containing:
- completed stage
- what was finished
- current whole-site percentage
- current frontend percentage
- current backend percentage
- current cybersecurity percentage
- next stage
