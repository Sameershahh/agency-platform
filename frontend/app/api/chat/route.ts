export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

// ─── NeuraStack Knowledge Base ───────────────────────────────────────────────
const NEURASTACK_KNOWLEDGE_BASE = `
# NeuraStack Labs — Company Knowledge Base

## Company Overview
NeuraStack Labs is a cutting-edge AI software agency specializing in building intelligent digital systems, enterprise automation, and full-stack web products. We operate at the intersection of AI engineering and modern software development, delivering production-grade solutions to businesses globally.

## Mission & Values
- Mission: To democratize AI-powered software and help businesses scale with intelligent automation.
- We believe in transparent pricing, clean architectures, and measurable ROI.
- Our team is obsessed with quality, performance, and developer experience.

## Services Offered

### 1. AI Automation
We streamline complex, repetitive workflows using LLM pipelines (Gemini, Claude, GPT-4), custom agents, and integrations with existing enterprise tools. Our automation saves clients 40-80% in manual operations.

### 2. Data Analytics & Intelligence
We build real-time dashboards, ETL pipelines, and predictive analytics systems. Technologies: Python, Django, Supabase/PostgreSQL, Next.js, Recharts.

### 3. Smart Chatbots & Conversational AI
We build context-aware chatbots powered by RAG (Retrieval-Augmented Generation), vector databases (FAISS, Pinecone), and LLMs with streaming support. Used for customer support, onboarding, and internal knowledge bases.

### 4. Full-Stack Web Development
Premium web applications built with Next.js (App Router), TypeScript, TailwindCSS, and Django/FastAPI backends. We prioritize performance, SEO, and beautiful UI.

### 5. Cloud Integration & Infrastructure
We handle AWS deployments, serverless architectures, Docker containerization, CI/CD pipelines, and Supabase integration for managed databases and auth.

### 6. AI Voice Agents
Enterprise telephony AI using Twilio, Deepgram (ASR), and LLM reasoning — enabling automated call handling with human-like latency.

## Key Projects & Case Studies

### NeuraStack Platform (This Website)
- A full SaaS platform built with Next.js 14, Django REST Framework, JWT HttpOnly cookie auth, and Google OAuth.
- Features: User dashboard, analytics, project tracking, tiered subscriptions.
- Stack: Next.js 14, TypeScript, Django 5.2, PostgreSQL (Supabase), Redis, JWT.

### AI Content Engine
- End-to-end automated video content pipeline: trend discovery (Playwright), script generation (Gemini 2.5), image synthesis (FLUX/SiliconFlow), and video assembly (MoviePy).
- Result: Fully autonomous video publishing with zero human input.

### AI Voice Agent
- Enterprise telephony AI with <500ms latency: Twilio WSS → Deepgram Nova-2 (STT) → Groq Llama-3.3-70b → Deepgram Aura (TTS).
- Capable of emergency triage, intent detection, and call routing.

### Pakistan Influencer Discovery Engine
- High-precision scraping system identifying Pakistani micro-influencers (1k–200k followers) across Instagram and TikTok.
- Features smart deduplication, niche scoring, and a real-time analytics dashboard.

### YT Toxicity Analyzer
- ML-powered YouTube comment toxicity detection system.
- Stack: Django DRF, scikit-learn classifier, Next.js frontend with real-time scoring UI.

## Technologies & Stack

### AI/ML
- LLMs: Gemini 2.5 Flash/Pro, Claude Sonnet, GPT-4o, Groq (Llama)
- Voice AI: Twilio, Deepgram (ASR + TTS)
- RAG: FAISS, Pinecone, Voyage Embeddings, Sentence Transformers
- Image AI: FLUX, Stable Diffusion, Google Vision AI

### Backend
- Python: Django 5.x, FastAPI, asyncio
- Auth: JWT (HttpOnly cookies), Google OAuth, allauth
- Databases: PostgreSQL, Supabase, SQLite, Redis
- APIs: REST, WebSockets

### Frontend
- Next.js 14/15 (App Router), TypeScript, React 18
- Styling: Tailwind CSS, Framer Motion, shadcn/ui
- Charts: Recharts

### Infrastructure
- Cloud: AWS (EC2, S3, Lambda), Vercel, Railway
- Containers: Docker, Docker Compose
- CI/CD: GitHub Actions

## Pricing Tiers (General Guidance)
- Starter Projects: $500–$2,000 (basic landing pages, simple integrations)
- Professional: $2,000–$8,000 (full-stack apps, chatbots, automation pipelines)
- Enterprise: $8,000+ (multi-service AI platforms, voice agents, custom AI infrastructure)
- All projects include: code ownership, 1 month of post-deployment support, documentation.

## Contact & Engagement
- Contact Page: /contact
- To start a project, visit the contact page and describe your requirements.
- We typically respond within 24 hours.
- Clients can sign up for the platform at /signup to access the client dashboard.

## Team & Expertise
NeuraStack is led by Sameer Shah — a full-stack AI developer based in Karachi, Pakistan — with deep expertise in:
- Python (Django, FastAPI, asyncio)
- AI Engineering (LLMs, RAG, Voice AI)
- Frontend (Next.js, TypeScript, React)
- Cloud DevOps (AWS, Docker, Supabase)

## Frequently Asked Questions

**Q: How long does a typical project take?**
A: Simple integrations take 1–2 weeks. Full-stack custom apps take 4–8 weeks. Enterprise AI platforms are scoped individually.

**Q: Do you offer ongoing maintenance?**
A: Yes. All clients get 1 month free post-launch support, with optional monthly retainers for continuous improvements.

**Q: Can you integrate AI into our existing product?**
A: Absolutely. This is one of our core strengths — adding intelligent features (chatbots, automation, analytics) to existing codebases.

**Q: What industries have you served?**
A: E-commerce, SaaS, healthcare triage AI, influencer marketing, content creation, and education technology.

**Q: Is my data secure?**
A: Yes. We use industry-standard practices: HttpOnly JWT cookies, encrypted at-rest data, and no third-party data sharing.
`;

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing or invalid message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[NeuraStack Chat] Missing GEMINI_API_KEY!");
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // Build multi-turn history for the request
    const conversationHistory = Array.isArray(history)
      ? history
          .filter((m: any) => m?.role && m?.text)
          .map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }],
          }))
      : [];

    // Add the current user message
    conversationHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    const systemPrompt = `You are the NeuraStack Labs AI Assistant — a professional, helpful, and conversational representative of the NeuraStack software agency.

### YOUR ROLE:
- You help website visitors understand NeuraStack's services, capabilities, and how to engage with us.
- You answer questions about our projects, pricing, technologies, and team.
- You are professional but friendly — think of yourself as a smart account manager.

### STRICT RULES:
1. ONLY answer based on the KNOWLEDGE BASE provided below. Do not hallucinate facts.
2. If a question is outside the knowledge base, politely say you don't have that specific information and invite them to use the Contact page.
3. Keep responses concise — ideally 2–4 sentences unless more detail is genuinely needed.
4. Never claim to be a human. You are an AI assistant for NeuraStack Labs.
5. For questions about starting a project or pricing, always guide users to /contact.

### KNOWLEDGE BASE:
${NEURASTACK_KNOWLEDGE_BASE}`;

    // ⏱ 10-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 450,
            topP: 0.9,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("[NeuraStack Chat] Gemini API error:", res.status, errorBody);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: res.status }
      );
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, I couldn't generate a response. Please try again or contact us directly at /contact.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("[NeuraStack Chat] Server error:", error.name, error.message);
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "The request timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
