"use client";

import React, { useState, useId } from "react";
import Image from "next/image";

const THUMB_COL_W = 200;

type WorkLink = { label: string; href: string };

type WorkItemType = {
  title: string;

  thumbSrc: string;
  imageAlt: string;

  thumbW?: number;
  thumbH?: number;

  subtitle?: string;
  badge?: string;

  introPoints?: string[];
  details?: React.ReactNode;

  tags?: string[];
  links?: WorkLink[];
  references?: WorkLink[];
};

function WorkItem({ item }: { item: WorkItemType }) {
  const hasDetails = Boolean(item.details);
  const [imgOpen, setImgOpen] = useState(false);

  // Unique ids for aria
  const dialogId = useId();

  return (
    <>
      <details className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-black">
        <summary className="cursor-pointer list-none">
          <div className="grid gap-4 md:grid-cols-[200px,1fr] md:items-start">
            {/* Thumbnail (click to zoom) */}
            <div
              className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black"
              style={{ width: THUMB_COL_W }}
            >
              {/* Click layer: stop summary toggle, open modal */}
              <button
                type="button"
                aria-label="Open image"
                className="group/thumb relative block w-full cursor-zoom-in"
                onClick={(e) => {
                  e.preventDefault(); // prevent <summary> default toggle
                  e.stopPropagation(); // prevent <details> toggle
                  setImgOpen(true);
                }}
              >
                <Image
                  src={item.thumbSrc}
                  alt={item.imageAlt}
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 200px, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-200 group-hover/thumb:scale-[1.02]"
                />

                {/* Subtle zoom hint */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/thumb:opacity-100">
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
                    Click to zoom
                  </div>
                </div>
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
                      Project
                    </span>
                    {item.badge && (
                      <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-base font-semibold leading-snug">{item.title}</div>

                  {item.subtitle && (
                    <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {item.subtitle}
                    </div>
                  )}

                  {item.links && item.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                      {item.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 hover:underline dark:text-blue-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {item.introPoints && item.introPoints.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                      {item.introPoints.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 pt-1 text-sm text-zinc-500">
                  <span className="group-open:hidden">Expand</span>
                  <span className="hidden group-open:inline">Collapse</span>
                </div>
              </div>
            </div>
          </div>
        </summary>

        {hasDetails && (
          <div className="mt-5 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
              {item.details}

              {item.references && item.references.length > 0 && (
                <div className="pt-1">
                  <div className="font-semibold">References</div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {item.references.map((r) => (
                      <a
                        key={r.href}
                        href={r.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline dark:text-blue-400"
                      >
                        {r.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </details>

      {/* Lightbox: click once to open, click outside to close */}
      {imgOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogId}
          onClick={() => setImgOpen(false)} // click blank area closes
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] cursor-zoom-out"
            onClick={(e) => e.stopPropagation()} // click on image container does NOT close
          >
            {/* Hidden label for screen readers */}
            <div id={dialogId} className="sr-only">
              {item.title} image
            </div>

            <Image
              src={item.thumbSrc}
              alt={item.imageAlt}
              width={1600}
              height={1200}
              className="h-auto w-full rounded-xl bg-white shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const highlights = [
    {
      title: "Imaging systems → reliable software",
      desc: "Built end-to-end pipelines for nonlinear optical imaging: calibration, acquisition, preprocessing, modeling, and visualization—designed for repeated use by collaborators.",
    },
    {
      title: "Machine learning with interpretability",
      desc: "Combine physical constraints with supervised ML for robust parameter inference, validation, and failure-mode analysis (not black-box demos).",
    },
    {
      title: "Performance & reproducibility",
      desc: "GPU/HPC workflows (e.g., SLURM), experiment tracking, and structured outputs to make results repeatable and debugging practical.",
    },
  ];

  const education = [
    {
      degree: "Postdoctoral Researcher",
      org: "Lund University, Sweden",
      time: "Jan 2021 – Dec 2025",
      detail: "Topic: AI-Enhanced Functional Microscopy",
    },
    {
      degree: "Ph.D., Chemical Physics",
      org: "Lund University, Sweden",
      time: "Sep 2016 – Dec 2020",
      detail:
        "Thesis: Phase modulation two photon microscopy of hybrid halide perovskite · Advisor: Tönu Pullerits",
    },
    {
      degree: "M.Sc., Analytical Chemistry",
      org: "Sichuan University, China",
      time: "Sep 2013 – Jun 2016",
      detail:
        "Thesis: Laser-induced Breakdown Spectroscopy (LIBS) for quantitative analysis of sedimentary rocks based on machine learning",
    },
    {
      degree: "B.Sc., Chemical & Pharmaceutical",
      org: "Anyang Normal University, China",
      time: "Sep 2009 – Jun 2013",
      detail: "College of Chemistry and Chemical Engineering",
    },
  ];

  const grants = [
    {
      year: "2018",
      title:
        "Research grant (Fysiografiska): Mapping spatial distribution of large polarons in hybrid perovskites using temperature-dependent PL & photocurrent imaging",
    },
    { year: "2019", title: "Travel grant (Fysiografiska): ICMAT 2019, Singapore" },
    {
      year: "2023",
      title:
        "Young Investigator Synergy Award (Light & Materials profile): Sustainable GaInP nanowire micro-LEDs with AI-enhanced functional imaging",
    },
    {
      year: "2024",
      title: "Travel grant (Lund University): Nordic-Baltic Femtochemistry Conference 2024",
    },
    {
      year: "2025",
      title:
        "Young Investigator Synergy Award (Light & Materials profile): Charge dynamics in lead-free perovskite nanocrystals with single-atom cocatalysts for CO₂ photoreduction",
    },
  ];

  const talks = [
    "Nanolund Annual Meeting (2016–2024) — posters",
    "Chemical Physics Science Day (2016–2024) — talks",
    "ICMAT 2019, Singapore — talk",
    "2nd LU–USTB (2024) — invited speaker",
    "Nordic-Baltic Femtochemistry Conference 2024 — talk",
    "LINXS Science Day on New Materials 2024 — poster",
    "Perovskite Workshop (2023–2024, Lund) — posters",
    "HAMLET-PHYSICS 2025 (Copenhagen) — talk",
  ];

  const work: WorkItemType[] = [
    {
      title: "Instrument Control & Imaging Acquisition System (MATLAB GUI)",
      subtitle:
        "Multi-instrument control, synchronized data acquisition, and imaging workflows for nonlinear optical microscopy.",
      thumbSrc: "/work/instrument-thumb.jpg",
      imageAlt: "Instrument control GUI preview",
      badge: "Core system",
      introPoints: [
        "Daily-use MATLAB GUIs for synchronized acquisition across multiple instruments.",
        "Stable scan orchestration + digitizer DAQ + automated saving + live plotting.",
        "Built as a maintainable system with guardrails (not ad-hoc scripts).",
      ],
      tags: ["MATLAB", "GUI", "Instrument control", "Synchronization", "DAQ"],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> Nonlinear optical imaging requires reliable synchronization across multiple
            hardware components (delay stages, scanners, digitizers, detectors) while remaining stable for long-term,
            daily experimental use.
          </div>

          <div>
            <strong>What I built:</strong>
            <ul className="mt-1 space-y-1">
              <li>• MATLAB App Designer GUIs for instrument control and imaging acquisition.</li>
              <li>• Integrated digitizer configuration, synchronized scanning, data saving, and live plotting.</li>
              <li>• Separate GUIs for imaging main window and 2D scan control (piezo + PI stage workflows).</li>
              <li>• Parameter validation + guardrails to avoid invalid hardware states.</li>
            </ul>
          </div>

          <div>
            <strong>Impact / Significance:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Backbone control software used across multi-year PhD/postdoc experiments.</li>
              <li>• Reduced setup time and human error for complex scans.</li>
              <li>• Enabled reproducible acquisition pipelines suitable for downstream ML/analysis.</li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      title: "AI-Enhanced High-Resolution Functional Imaging (IM-2PM) — Postdoc",
      subtitle:
        "ML-assisted inference pipeline for pixel-wise mapping of trap states and recombination pathways in perovskites.",
      thumbSrc: "/work/ai-functional-thumb.jpg",
      imageAlt: "AI-enhanced functional imaging preview",
      badge: "Paper",
      introPoints: [
        "Regress IM-2PM observables → physical recombination parameters at pixel level.",
        "Coupled ML predictions with ODE-based carrier population simulations.",
        "Validation strategy + failure-mode analysis for heterogeneous samples.",
      ],
      tags: ["Python", "ML regression", "ODE simulation", "Imaging pipeline"],
      links: [{ label: "Paper", href: "https://onlinelibrary.wiley.com/doi/full/10.1002/eem2.70062" }],
      references: [
        { label: "Energy & Environmental Materials (2025)", href: "https://onlinelibrary.wiley.com/doi/full/10.1002/eem2.70062" },
      ],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> Extracting pixel-wise physical recombination parameters from modulated nonlinear
            optical signals across heterogeneous perovskite films is slow and difficult to scale.
          </div>

          <div>
            <strong>What I built:</strong>
            <ul className="mt-1 space-y-1">
              <li>• ML-assisted inference pipeline linking IM-2PM observables to physical parameters.</li>
              <li>• Coupled ML predictions with ODE-based carrier population simulations.</li>
              <li>• Robust training/validation strategy for imbalanced parameter regimes + failure-mode analysis.</li>
            </ul>
          </div>

          <div>
            <strong>Impact / Significance:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Enables quantitative spatial mapping of trap-mediated losses and recombination pathways.</li>
              <li>• Turns complex spectroscopy into an automated, reusable analysis tool.</li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      title: "Deep Learning Super-Resolution for IM-2PM Functional Imaging — Postdoc",
      subtitle:
        "CNN-based super-resolution to enhance functional microscopy maps under SNR and acquisition-time constraints (unpublished).",
      thumbSrc: "/work/sr-thumb.jpg",
      imageAlt: "Super-resolution preview",
      badge: "Unpublished",
      introPoints: [
        "Paired LR→HR reconstruction for functional microscopy maps (U-Net style).",
        "Guardrails to reduce hallucination: structure consistency + sanity checks.",
        "SSIM/MSE + error maps; QC overlays to localize failure modes.",
      ],
      tags: ["PyTorch", "CNN / U-Net", "Super-resolution", "SSIM/MSE", "QC"],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> Functional IM-2PM maps are limited by optical resolution, scan step size, and
            photon budget. High-resolution scans are slower and more drift-sensitive. Goal: recover higher effective
            spatial detail while preserving physically meaningful contrast.
          </div>

          <div>
            <strong>What I built:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Paired LR/HR dataset creation from repeated scans + controlled downsampling.</li>
              <li>• U-Net–style CNN models with structure-preserving constraints for edge/feature recovery.</li>
              <li>• Evaluation suite: SSIM/MSE on held-out regions + localized error maps + QC overlays.</li>
              <li>• Workflow integration: batch inference, standardized outputs, and clear failure reporting.</li>
            </ul>
          </div>

          <div>
            <strong>Impact / Significance:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Demonstrated resolution enhancement while preserving physically meaningful contrast.</li>
              <li>• Built as a reusable pipeline step (research-to-tool development).</li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      title: "ml-IM2PM: Machine Learning Regression for IM-2PM — PhD",
      subtitle: "Interpretable ML for extracting recombination parameters from modulated two-photon microscopy.",
      thumbSrc: "/work/ml-im2pm-thumb.jpg",
      imageAlt: "ml-IM2PM preview",
      badge: "Paper",
      introPoints: [
        "Replaced slow/manual fitting with supervised regression using modulation-domain features.",
        "End-to-end pipeline: preprocessing → training → evaluation → validation.",
        "Designed for repeated use and practical debugging (not a one-off demo).",
      ],
      tags: ["Python", "scikit-learn", "Signal processing", "Validation"],
      links: [{ label: "Paper", href: "https://pubs.acs.org/doi/full/10.1021/acsphotonics.3c01523" }],
      references: [{ label: "ACS Photonics (2024)", href: "https://pubs.acs.org/doi/full/10.1021/acsphotonics.3c01523" }],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> Manual fitting of IM-2PM signals is slow, sensitive to initialization, and hard to
            scale across large imaging datasets.
          </div>

          <div>
            <strong>What I built:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Supervised regression mapping modulation harmonics/features → physical parameters.</li>
              <li>• Preprocessing + standardized feature extraction + reproducible evaluation.</li>
              <li>• Validation routines and sanity checks to ensure interpretability and detect failure modes.</li>
            </ul>
          </div>

          <div>
            <strong>Impact / Significance:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Made parameter extraction scalable and more robust across experimental conditions.</li>
              <li>• Provided a foundation for later AI-enhanced functional imaging workflows.</li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      title: "LIBS + Machine Learning for Quantitative Elemental Analysis — MSc",
      subtitle: "Regression-based elemental quantification from laser-induced breakdown spectroscopy (LIBS).",
      thumbSrc: "/work/libs-thumb.jpg",
      imageAlt: "LIBS + ML preview",
      badge: "MSc",
      introPoints: [
        "Built multivariate regression models (SVR/PLSR) for high-dimensional LIBS spectra.",
        "Preprocessing + cross-validation for robust quantification on complex matrices.",
        "Compared univariate vs multivariate pipelines to improve accuracy and stability.",
      ],
      tags: ["LIBS", "SVR", "PLSR", "Chemometrics", "Regression"],
      links: [
        { label: "2015 (JAAS)", href: "https://pubs.rsc.org/en/content/articlelanding/2015/ja/c5ja00255a" },
        { label: "2018 (JAAS)", href: "https://pubs.rsc.org/en/content/articlelanding/2018/ja/c8ja00219c" },
        { label: "2019 (Analytical Methods)", href: "https://pubs.rsc.org/en/content/articlelanding/2019/ay/c9ay00890j/unauth" },
      ],
      references: [
        { label: "J. Anal. At. Spectrom. (2015)", href: "https://pubs.rsc.org/en/content/articlelanding/2015/ja/c5ja00255a" },
        { label: "J. Anal. At. Spectrom. (2018)", href: "https://pubs.rsc.org/en/content/articlelanding/2018/ja/c8ja00219c" },
        { label: "Analytical Methods (2019)", href: "https://pubs.rsc.org/en/content/articlelanding/2019/ay/c9ay00890j/unauth" },
      ],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> LIBS spectra are high-dimensional, noisy, and matrix-dependent, making univariate
            calibration unreliable for quantitative multi-element analysis.
          </div>

          <div>
            <strong>What I built:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Multivariate regression models (SVR, PLSR) for quantitative prediction from spectra.</li>
              <li>• Robust preprocessing + cross-validation and comparative benchmarking vs univariate methods.</li>
              <li>• Error analysis to identify spectral regions and conditions driving failure modes.</li>
            </ul>
          </div>

          <div>
            <strong>Impact / Significance:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Improved robustness and accuracy of quantitative elemental analysis on complex samples.</li>
              <li>• Established a practical pipeline linking spectroscopy to machine-learning regression.</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/70 dark:bg-black/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-wide">Qi Shi</div>

          <nav className="hidden items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300 sm:flex">
            <a className="hover:text-zinc-900 dark:hover:text-zinc-100" href="#work">
              Work
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-100" href="#education">
              Education
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-100" href="#grants">
              Awards
            </a>
            <a className="hover:text-zinc-900 dark:hover:text-zinc-100" href="mailto:qi2463sh@gmail.com">
              Email
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <section className="space-y-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Imaging · Machine Learning · Scientific Software
              </h1>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Lund, Sweden · Open to roles in imaging / ML / scientific software
              </div>
            </div>

            <div className="shrink-0">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black sm:h-36 sm:w-36">
                <Image src="/profile.jpg" alt="Qi Shi profile photo" fill className="object-cover" priority />
              </div>
            </div>
          </div>

          <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            I am a scientific software engineer with a Ph.D. in Chemical Physics and nearly a decade of experience at
            Lund University. I build reliable end-to-end systems bridging nonlinear optical imaging, machine learning,
            and engineering practices—from instrument control and data acquisition to model training, validation, and
            long-term maintainability.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-900"
              href="/cv.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download CV
            </a>

            <a
              className="inline-flex h-11 items-center justify-center rounded-full border border-transparent px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              href="#work"
            >
              View work →
            </a>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <a className="hover:underline" href="https://www.linkedin.com/in/qi-shi-a26618171/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="hover:underline" href="https://github.com/qi2463sh" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className="hover:underline"
              href="https://scholar.google.com/citations?user=rlOFcsMAAAAJ&hl=en&oi=ao"
              target="_blank"
              rel="noreferrer"
            >
              Google Scholar
            </a>
            <a className="hover:underline" href="mailto:qi2463sh@gmail.com">
              qi2463sh@gmail.com
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-black">
            <div className="font-semibold">Academic snapshot</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 text-zinc-700 dark:text-zinc-300">
              <div>• 26+ peer-reviewed publications</div>
              <div>• h-index 16 · i10-index 20</div>
              <div>• 900+ citations (Jan 2026)</div>
              <div>
                • Full list:{" "}
                <a className="underline" href="https://scholar.google.com/citations?user=rlOFcsMAAAAJ&hl=en&oi=ao" target="_blank" rel="noreferrer">
                  Google Scholar
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Highlights</h2>
          <div className="mt-4 space-y-3">
            {highlights.map((h) => (
              <div key={h.title} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <div className="font-medium">{h.title}</div>
                <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Work</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Expand for details (Problem → What I built → Impact).
              </p>
            </div>

            <a
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-900"
              href="https://scholar.google.com/citations?user=rlOFcsMAAAAJ&hl=en&oi=ao"
              target="_blank"
              rel="noreferrer"
            >
              Google Scholar →
            </a>
          </div>

          <div className="mt-6 space-y-4">
            {work.map((item) => (
              <WorkItem key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section id="education" className="mt-12">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Education & Training</h2>
          <div className="mt-4 space-y-3">
            {education.map((e) => (
              <div key={`${e.degree}-${e.time}`} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="font-medium">{e.degree}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{e.time}</div>
                </div>
                <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{e.org}</div>
                <div className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{e.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="grants" className="mt-12">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Grants & Awards</h2>
          <div className="mt-4 space-y-3">
            {grants.map((g) => (
              <div key={`${g.year}-${g.title}`} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <div className="text-sm font-medium">{g.year}</div>
                <div className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{g.title}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="talks" className="mt-12">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Conferences & Invited Talks</h2>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {talks.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
