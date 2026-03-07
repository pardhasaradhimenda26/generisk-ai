# GeneRisk AI — DNA Cancer Risk Analyzer

> AI-powered DNA cancer risk analyzer — detect gene mutations and predict cancer probability using Gemini AI

---

## What is GeneRisk AI?

GeneRisk AI is an advanced 3D web application that analyzes DNA sequences and gene mutations to predict the probability of developing specific types of cancer. Paste your DNA sequence or select known gene mutations and instantly receive a detailed cancer risk report with AI-powered explanations.

---

## Features

- 3D Rotating DNA Helix — stunning Three.js landing page
- Mutation Detection — detects BRCA1, TP53, KRAS, MLH1 and more
- Cancer Risk Radar Chart — visual pentagon chart across 5 cancer types
- Circular Risk Meters — animated progress rings per cancer type
- Gemini AI Explanations — plain English explanation of your results
- Mutations Table — detailed gene breakdown with risk levels
- Health Recommendations — personalised diet, screening and lifestyle tips
- Download PDF Report — save and share your results
- GSAP Animations — smooth scroll-triggered animations throughout

---

## Supported Mutations and Cancer Risk

| Gene  | Cancer Types                          | Risk Level |
|-------|---------------------------------------|------------|
| BRCA1 | Breast (75%), Ovarian (60%)           | HIGH       |
| TP53  | Lung (65%), Colon (55%), Blood (50%)  | HIGH       |
| KRAS  | Lung (70%), Colon (65%)               | HIGH       |
| MLH1  | Colon (80%)                           | HIGH       |
| None  | All cancers (10-15%)                  | LOW        |

---

## Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| 3D Graphics  | Three.js                    |
| Animations   | GSAP + ScrollTrigger        |
| Charts       | SVG Radar + Canvas Rings    |
| AI           | Google Gemini 2.0 Flash Lite|
| Styling      | Vanilla CSS (Glassmorphism) |
| Deploy       | Vercel                      |

---

## Getting Started

1. Clone the repo

git clone https://github.com/pardhasaradhimenda26/generisk-ai.git
cd generisk-ai

2. Add your Gemini API Key

Copy config.example.js to config.js and add your free Gemini API key.
Get your free key at: https://aistudio.google.com

3. Run locally

Open index.html in your browser or use Live Server in VS Code.

---

## Test DNA Sequences

BRCA1 mutation (High breast cancer risk):
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAG

TP53 mutation (High lung and colon risk):
ATGTTCAAGACAGATTTTTTCTTTGTTTTCTTCTTTTTTTTTTTGAGATGGAGTCTCGCTCTGTCGC

KRAS mutation (High lung and colon risk):
ATGACTGAATATAAACTTGTGGTAGTTGGAGCTGGTGGCGTAGGCAAGAGTGCCTTGACGATACAG

---

## Project Structure

generisk-ai/
├── index.html          — Main HTML structure
├── main.js             — Core JS (mutations, charts, Gemini API)
├── style.css           — All styling and glassmorphism
├── config.example.js   — API key template
├── vercel.json         — Vercel deployment config
└── .gitignore          — Git ignore rules

---

## Disclaimer

This tool is for educational purposes only.
Always consult a qualified medical professional for any health related decisions.

---

## Built By

Pardhasaradhi Menda — B.Tech CSE (AI & ML), SRM University KTR

---

## License

MIT License — feel free to use and modify!
