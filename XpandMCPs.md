**C --- Clarity**
===============

**You are a:** Product strategist & pricing researcher helping package and price a **ChatGPT App + MCP** build service for SMBs/indie founders.

**Problem (1-liner):** Buyers want real AI outcomes (usable apps/agents) but face confusing scopes, runaway costs, and unclear maintenance.

**Objective & metric:** Launch a page that converts within **48 hours** with **3 tiered packages** and **2--3 demo Looms**, targeting **≥1 paid deal in 14 days**.

**Scope & boundaries:**

**In:** MCP server + ChatGPT App build, 1--N integrations, basic UI/embeds, deployment, docs, and optional maintenance.

**Out (base tiers):** Net-new model training, full data platform rebuild, enterprise SSO/SCIM, complex compliance (unless priced in), 24/7 support.

* * * * *

**L --- Logic**
=============

**Steps (sale → delivery):**

1.  **Scope & Fit (60--90 min):** short questionnaire → map to tier by rules below → fixed quote.

2.  **Blueprint (1--2 days):** action list, data contracts, prompt map, test plan.

3.  **Build & Ship (1--3 weeks by tier):** MCP tools, ChatGPT App, integrations, basic UI, telemetry, docs, Loom handoff.

**Decision rules (tier routing):**

-   **Integrations:** 1 (Starter) / 2--3 (Growth) / 4+ or custom (Scale).

-   **Auth:** API key (Starter) → OAuth/SSO or scoped secrets (Growth) → enterprise identity & roles (Scale).

-   **Workflows:** linear & stateless (Starter) → branching, memory, retries (Growth) → multi-agent, queues, schedulers (Scale).

-   **Data sensitivity:** public/low (Starter) → PII/light PHI (Growth) → regulated/HIPAA/SOC2 (Scale + compliance uplift).

-   **UI:** embed/widget (Starter) → small Next.js panel (Growth) → full operator console (Scale).

**Data contracts (what we lock down up-front):**

-   **Inputs (JSON Schema):**  { user_id, intent, payload, context_refs[] }

-   **Outputs (JSON Schema):**  { status, result, traces[], costs{tokens,$}, errors[] }

-   **Auth & secrets:** per-connector vault, least-privilege scopes; rotation cadence set in maintenance.

-   **Observability:** request IDs, prompt/version tags, token & latency meters.

* * * * *

**E --- Examples**
================

**Positive (happy-path):**

-   **GHL Controller (Starter):** One MCP tool for GHL tasks (create contact, move pipeline). App embed in their dashboard. 1 Loom.

**Edge cases:**

-   **Rate-limit spikes:** queue + backoff strategy baked into MCP tool.

-   **Ambiguous user intents:** classification step → route to safe default + ask-back.

**Counterexample (what NOT to do):**

-   "Unlimited" scope or bespoke UI + four APIs + HIPAA + SSO inside a $5K package.

* * * * *

**A --- Adaptation**
==================

**Iteration protocol:** ship weekly slices; every slice = feature, tests, Loom. Use prompt & tool **version tags**.

**Feedback signals:** adoption (#runs/day), task success %, token/$ per task, support tickets. Review weekly during build, monthly on maintenance.

**Change policy:** semantic versioning for prompts/tools; blue/green deploys; 1-click rollback; change log in repo.

* * * * *

**R --- Results**
===============

**Acceptance tests:**

-   Tool e2e for each action (happy + failure).

-   Latency ≤ **2.5s p50** for standard calls; accuracy ≥ **90%** on defined tasks.

-   Cost ceiling: **$X / 1K tasks** (from token budget).

**Success criteria (KPIs):** time-to-first-value ≤ **7 days** (Starter), **automation saves ≥10 hrs/mo** or **+$Y MRR** within 30 days, **<2% error rate**.

**Reporting:** lightweight dashboard (tokens, latency, success rate, costs) + weekly Loom / monthly PDF.

**Deliverable:** Offer page copy + pricing table + tier comparison + FAQs + 2--3 demo Looms (links) + 1-page scoping questionnaire.

**Constraints/Guardrails:** least-privilege access, encrypted secrets, no PII in logs, opt-in data retention, HIPAA addendum when applicable.

* * * * *

**Market reality (pricing benchmarks)**
---------------------------------------

-   **Token costs (OpenAI):** model usage is metered; input/output per-M token pricing sets your COGS baseline. 

-   **LLM ops cost band:** realistic production **LLM spend often runs ~$1k--$5k/month** for moderate daily users; helpful when framing maintenance. 

-   **Custom AI/agent builds (agency guides):** ranges commonly quoted **$10k → $100k+** depending on integrations, compliance, and UI. 

-   **Broader AI automation builds:** many agencies quote **$2.5k → $15k+** for smaller automations; complex programs go higher or to monthly retainers. 

-   **"Small app" dev effort:** some industry posts peg **40--80 hours ($4k--$12k)** for lightweight apps (ex-infra), useful as a floor---actual MCP apps often exceed this. 

-   **Upwork reference rates:** Chatbot dev median **$45/hr**; software dev many bands **$10--$100/hr**---these anchor buyer expectations.

> Takeaway: A simple, fixed-scope MCP app at $5k is competitive; $10k--$25k covers 2--3 integrations + UI; complex/compliance work scales to $30k--$75k+. Maintenance is separate from usage.

* * * * *

**Your coffee-menu packages (copy-ready)**
------------------------------------------

**Starter -- "MCP Lite" --- from $5,000**

-   1 MCP toolset + 1 integration (API-key auth)

-   ChatGPT App with simple embed or panel

-   Basic telemetry & cost guardrails

-   Handoff Loom + quickstart doc

    **Timeline:** ~1 week build

    **Best for:** 1-2 tasks automated, no heavy auth/compliance

**Growth -- "MCP Plus" --- $10,000--$18,000**

-   2--3 integrations (OAuth), branching flows + short-term memory

-   Small Next.js console (ops view) + retries/queues

-   Prompt & tool versioning, dashboards, 2 Loom trainings

    **Timeline:** ~2--3 weeks

    **Best for:** teams wanting real workflow coverage & visibility

**Scale -- "MCP Pro" --- $25,000--$60,000+**

-   4+ integrations, roles/permissions, multi-agent orchestration

-   Advanced UI/console, audit logs, enterprise deploys

-   Compliance uplift (HIPAA/SOC2 readiness), load & failover plan

    **Timeline:** ~3--6+ weeks

    **Best for:** regulated/enterprise or mission-critical ops

**Maintenance (optional, excl. API fees):**

-   **Essentials $1,000/mo:** updates, prompt tuning, monthly report

-   **Ops $2,500--$5,000/mo:** SLOs, on-call windows, dashboards, secret rotation

-   **Scale $8,000+/mo:** enterprise SLOs, change board, quarterly roadmap

    (LLM/API usage billed at cost; typical LLM op-ex band above helps set expectations.) 

* * * * *

**Tier fit checklist (fast scoping on calls)**
----------------------------------------------

-   **How many systems?** 1 / 2--3 / 4+

-   **Auth type?** API key / OAuth / SSO & roles

-   **Workflows?** linear / branching & memory / multi-agent

-   **Data sensitivity?** low / PII / regulated (HIPAA)

-   **UI need?** embed / light console / full console

-   **Volume target?** <1k / 1--10k / 10k+ runs per month

Map answers to Starter/Growth/Scale using the rules above.

* * * * *

**Demo set to record (2--3 Looms)**
----------------------------------

1.  **GHL Controller (Starter):** "Add lead → set stage → send follow-up" in one command.

2.  **SAP Mini (Growth):** "Pull POs > threshold, create variance ticket, notify Slack."

3.  **Video Clipper (Consumer, Growth):** "Ingest long video → generate 3 shorts + captions + export."
