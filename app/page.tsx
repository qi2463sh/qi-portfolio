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
    title: "Optical imaging systems built for daily use",
    desc: "Designed and maintained intensity-modulated nonlinear microscopy workflows (IM-2PM / IM-2PEF), including synchronized acquisition, calibration routines, and robust signal readout.",
  },
  {
    title: "From raw measurements to validated physical parameters",
    desc: "Built end-to-end analysis pipelines: preprocessing, modulation-domain features, ODE/kinetic modeling, and ML-assisted inference—focused on interpretability, validation, and failure-mode detection.",
  },
  {
    title: "Engineering mindset: stability, debugging, and reproducibility",
    desc: "Implemented guardrails, structured outputs, and repeatable runs for long experiments; integrated multi-instrument control and kept the software maintainable for collaborators over years.",
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
      year: "2025",
      title:
        "Young Investigator Synergy Award (Light & Materials profile): Charge dynamics in lead-free perovskite nanocrystals with single-atom cocatalysts for CO₂ photoreduction",
    },
    {
      year: "2024",
      title: "Travel grant (Lund University): Nordic-Baltic Femtochemistry Conference 2024",
    },
    {
      year: "2023",
      title:
        "Young Investigator Synergy Award (Light & Materials profile): Sustainable GaInP nanowire micro-LEDs with AI-enhanced functional imaging",
    },
     { year: "2019", title: "Travel grant (Fysiografiska): ICMAT 2019, Singapore" },
        {
      year: "2018",
      title:
        "Research grant (Fysiografiska): Mapping spatial distribution of large polarons in hybrid perovskites using temperature-dependent PL & photocurrent imaging",
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
      title: "Intensity-Modulated Two-Photon Excited Photoluminescence Microscopy (IM-2PM)",
      subtitle:
        "Technique development: modulation-domain readout for background suppression and quantitative contrast in nonlinear microscopy.",
      thumbSrc: "/work/im2pef-thumb.jpg",
      imageAlt: "IM-2PEF intensity-modulated two-photon excited photoluminescence microscopy",
      badge: "Paper",
      introPoints: [
        "Core technique: intensity modulation of femtosecond pulse train + demodulation in the detection chain.",
        "Enables robust contrast extraction under drift/noise; improves interpretability of nonlinear signals.",
        "Forms the foundation for later IM-2PM / functional imaging pipelines.",
      ],
      tags: ["Nonlinear microscopy", "Modulation", "Signal processing", "IM-2PM"],
      links: [
        { label: "ACS Phys. Chem. Au (Paper)", href: "https://pubs.acs.org/doi/full/10.1021/acsphyschemau.3c00013" },
        { label: "J. Phys. Chem. C (Paper)", href: "https://pubs.acs.org/doi/abs/10.1021/acs.jpcc.9b01968" },
      ],
      references: [
        { label: "ACS Phys. Chem. Au", href: "https://pubs.acs.org/doi/full/10.1021/acsphyschemau.3c00013" },
        { label: "J. Phys. Chem. C", href: "https://pubs.acs.org/doi/abs/10.1021/acs.jpcc.9b01968" },
      ],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Focus:</strong> Intensity-modulated two-photon excited fluorescence microscopy — using modulation
            and demodulation to extract robust contrast from nonlinear optical signals.
          </div>

          <div>
            <strong>What the work demonstrates:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Modulation-domain readout to separate meaningful signal from low-frequency drift and noise.</li>
              <li>• Practical measurement strategy that improves repeatability for long experiments.</li>
              <li>• A technique foundation that later enables functional imaging and quantitative inference.</li>
            </ul>
          </div>

          <div>
            <strong>My contributions (high level):</strong>
            <ul className="mt-1 space-y-1">
              <li>• Implemented the end-to-end measurement/analysis workflow (acquisition → demodulation → validation).</li>
              <li>• Built software routines to make the method reusable and stable in day-to-day experiments.</li>
            </ul>
          </div>
        </div>
      ),
    },


        {
      title: "Simultaneous Photocurrent (PC) + Photoluminescence (PL) Imaging under Intensity Modulation",
      subtitle:
        "Correlated PC/PL imaging to link transport and radiative recombination pathways in semiconductor devices.",
      thumbSrc: "/work/pcpl-thumb.jpg",
      imageAlt: "Simultaneous intensity-modulated PC and PL imaging",
      badge: "Paper",
      introPoints: [
        "Simultaneous PC + PL acquisition to correlate electronic transport with optical response.",
        "Intensity modulation improves SNR and enables robust contrast extraction.",
        "Useful for diagnosing losses, spatial heterogeneity, and device-level behavior.",
      ],
      tags: ["PC imaging", "PL imaging", "Modulation", "Semiconductors", "Correlative imaging"],
      links: [{ label: "Paper", href: "https://pubs.acs.org/doi/abs/10.1021/acs.jpcc.8b00542" }],
      references: [{ label: "J. Phys. Chem. C", href: "https://pubs.acs.org/doi/abs/10.1021/acs.jpcc.8b00542" }],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> PC and PL probe different parts of device physics. Measuring them separately makes
            it hard to interpret spatial heterogeneity and loss channels.
          </div>

          <div>
            <strong>What this work provides:</strong>
            <ul className="mt-1 space-y-1">
              <li>• A simultaneous imaging strategy (PC + PL) for more direct correlation.</li>
              <li>• Modulation-based readout to improve robustness against drift/noise.</li>
              <li>• Spatial maps that help connect micro-scale heterogeneity to device-level performance.</li>
            </ul>
          </div>

          <div>
            <strong>My contributions (high level):</strong>
            <ul className="mt-1 space-y-1">
              <li>• Built/maintained the measurement workflow and analysis routines for reliable map generation.</li>
              <li>• Ensured repeatable acquisition and clean data outputs for downstream interpretation.</li>
            </ul>
          </div>
        </div>
      ),
    },


        {
      title: "Photocurrent (PC) Imaging for Spatially Resolved Device Diagnostics",
      subtitle:
        "PC mapping to visualize transport bottlenecks, contact issues, and spatial heterogeneity in semiconductor devices.",
      thumbSrc: "/work/pc-thumb.jpg",
      imageAlt: "Photocurrent imaging (PC) map",
      badge: "Paper",
      introPoints: [
        "PC imaging provides direct spatial readout of charge extraction/transport behavior.",
        "Enables identification of bottlenecks and non-uniformity that are not obvious in bulk measurements.",
        "Complements PL-based imaging for more complete interpretation of device physics.",
      ],
      tags: ["PC imaging", "Device diagnostics", "Spatial mapping", "Semiconductors"],
      links: [{ label: "Paper", href: "https://pubs.acs.org/doi/abs/10.1021/acs.jpclett.8b02250" }],
      references: [{ label: "J. Phys. Chem. Lett.", href: "https://pubs.acs.org/doi/abs/10.1021/acs.jpclett.8b02250" }],
      details: (
        <div className="space-y-4">
          <div>
            <strong>Problem:</strong> Bulk electrical metrics hide local defects and spatial non-uniformity that dominate
            real device performance.
          </div>

          <div>
            <strong>What this work provides:</strong>
            <ul className="mt-1 space-y-1">
              <li>• PC imaging as a direct spatial diagnostic for extraction/transport limitations.</li>
              <li>• Clear visualization of non-uniformity to guide interpretation and optimization.</li>
              <li>• A complementary modality alongside PL/optical maps for multi-physics understanding.</li>
            </ul>
          </div>

          <div>
            <strong>My contributions (high level):</strong>
            <ul className="mt-1 space-y-1">
              <li>• Supported the acquisition/processing pipeline and produced consistent PC maps for analysis.</li>
              <li>• Focus on practical reliability: repeatable measurements, stable preprocessing, and QC.</li>
            </ul>
          </div>
        </div>
      ),
    },
{
      title: "ml-IM2PM: Machine Learning Regression for IM-2PM — Postdoc",
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
        "CNN-based super-resolution to enhance functional microscopy maps under SNR and acquisition-time constraints.",
      thumbSrc: "/work/sr-thumb.jpg",
      imageAlt: "Super-resolution preview",
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
                Optical Imaging Systems · ML-assisted Analysis · Software Engineering
              </h1>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Lund, Sweden · Open to roles in optical imaging / ML / scientific software
              </div>
            </div>

            <div className="shrink-0">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black sm:h-36 sm:w-36">
                <Image src="/profile.jpg" alt="Qi Shi profile photo" fill className="object-cover" priority />
              </div>
            </div>
          </div>

          <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              I build reliable optical imaging systems and analysis software. Over nearly a decade at Lund University,
              I developed intensity-modulated nonlinear microscopy (IM-2PM) workflows—from instrument control
              and synchronized acquisition to signal processing, modeling, and ML-assisted parameter inference.
              My focus is turning complex experimental pipelines into maintainable tools that produce consistent results
              and are easy to validate and debug.
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
