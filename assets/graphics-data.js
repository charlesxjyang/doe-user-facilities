window.GRAPHIC_DATA = {
  facilities: {
    NERSC: { name: "National Energy Research Scientific Computing Center", host: "LBNL", lat: 37.875, lon: -122.247 },
    ALCF: { name: "Argonne Leadership Computing Facility", host: "ANL", lat: 41.713, lon: -87.978 },
    OLCF: { name: "Oak Ridge Leadership Computing Facility", host: "ORNL", lat: 35.93, lon: -84.31 },
    ALS: { name: "Advanced Light Source", host: "LBNL", lat: 37.8719, lon: -122.2508 },
    APS: { name: "Advanced Photon Source", host: "ANL", lat: 41.717, lon: -87.982 },
    LCLS: { name: "Linac Coherent Light Source", host: "SLAC", lat: 37.416, lon: -122.205 },
    "NSLS-II": { name: "National Synchrotron Light Source II", host: "BNL", lat: 40.873, lon: -72.875 },
    SSRL: { name: "Stanford Synchrotron Radiation Lightsource", host: "SLAC", lat: 37.416, lon: -122.205 },
    HFIR: { name: "High Flux Isotope Reactor", host: "ORNL", lat: 35.93, lon: -84.31 },
    SNS: { name: "Spallation Neutron Source", host: "ORNL", lat: 35.93, lon: -84.31 },
    CFN: { name: "Center for Functional Nanomaterials", host: "BNL", lat: 40.873, lon: -72.875 },
    CINT: { name: "Center for Integrated Nanotechnologies", host: "SNL/LANL", lat: 35.084, lon: -106.65 },
    CNMS: { name: "Center for Nanophase Materials Sciences", host: "ORNL", lat: 35.93, lon: -84.31 },
    CNM: { name: "Center for Nanoscale Materials", host: "ANL", lat: 41.713, lon: -87.978 },
    TMF: { name: "The Molecular Foundry", host: "LBNL", lat: 37.875, lon: -122.247 },
    "DIII-D": { name: "DIII-D", host: "General Atomics", lat: 32.89, lon: -117.09 },
    "NSTX-U": { name: "National Spherical Torus Experiment Upgrade", host: "PPPL", lat: 40.35, lon: -74.60 },
    ATF: { name: "Accelerator Test Facility", host: "BNL", lat: 40.873, lon: -72.875 },
    "FACET-II": { name: "Facility for Advanced Accelerator Experimental Tests II", host: "SLAC", lat: 37.416, lon: -122.205 },
    "Fermilab AC": { name: "Fermilab Accelerator Complex", host: "FNAL", lat: 41.84, lon: -88.26 },
    CEBAF: { name: "Continuous Electron Beam Accelerator Facility", host: "JLab", lat: 37.094, lon: -76.484 },
    RHIC: { name: "Relativistic Heavy Ion Collider", host: "BNL", lat: 40.873, lon: -72.875 },
    FRIB: { name: "Facility for Rare Isotope Beams", host: "MSU", lat: 42.723, lon: -84.484 },
    ATLAS: { name: "Argonne Tandem Linac Accelerator System", host: "ANL", lat: 41.713, lon: -87.978 }
  },
  slides: [
    {
      id: "supercomputing",
      title: "Supercomputing",
      kicker: "DOE leadership computing facilities used by industry in FY2025",
      facilities: ["NERSC", "ALCF", "OLCF"],
      labelOffsets: {
        ALCF: { dx: -12, dy: 4, anchor: "end" },
        OLCF: { dx: -12, dy: 4, anchor: "end" }
      },
      accent: "#1f6feb",
      projects: [
        {
          company: "Cerebras",
          domain: "cerebras.net",
          facility: "ALCF",
          project: "Trillion Parameter Consortium",
          description: "AI-scale computing work at Argonne's leadership computing facility.",
          x: 1206, y: 130, w: 330, h: 168
        },
        {
          company: "Commonwealth Fusion Systems",
          domain: "cfs.energy",
          facility: "NERSC",
          project: "Analysis for the SPARC magnetic fusion experiment",
          description: "Supercomputing analysis supporting SPARC and ARC fusion physics studies.",
          x: 64, y: 210, w: 330, h: 194
        },
        {
          company: "CubicPV",
          domain: "cubicpv.com",
          facility: "NERSC",
          project: "Perovskite instability simulations",
          description: "Computational studies of anion and cation instabilities in hybrid perovskite solar materials.",
          x: 64, y: 474, w: 330, h: 168
        },
        {
          company: "GE Vernova",
          domain: "gevernova.com",
          facility: "OLCF",
          project: "Hydrogen gas turbine LES",
          description: "Massively parallel large-eddy simulations for high-efficiency gas turbines operating with hydrogen.",
          x: 1206, y: 490, w: 330, h: 168
        },
        {
          company: "Pratt & Whitney",
          domain: "prattwhitney.com",
          facility: "OLCF",
          project: "Aviation combustor multiphysics models",
          description: "Validation of multiphysics models for simulating aviation combustors.",
          x: 1206, y: 670, w: 330, h: 168
        },
        {
          company: "Boeing",
          domain: "boeing.com",
          facility: "ALCF",
          project: "High-fidelity open fan and wing integration",
          description: "High-fidelity CFD for aircraft configurations and sustainable aviation concepts.",
          x: 1206, y: 310, w: 330, h: 168
        }
      ]
    },
    {
      id: "xray",
      title: "X-ray Light Sources",
      kicker: "Synchrotrons and X-ray lasers supporting industrial materials, batteries, and chips",
      facilities: ["ALS", "APS", "LCLS", "NSLS-II", "SSRL"],
      facilityOffsets: {
        ALS: { dx: 22, dy: -8 },
        LCLS: { dx: 0, dy: 24 },
        SSRL: { dx: 18, dy: 16 }
      },
      labelOffsets: {
        ALS: { dx: 14, dy: 4 },
        APS: { dx: -12, dy: 4, anchor: "end" },
        LCLS: { dx: -10, dy: 36, anchor: "middle" },
        SSRL: { dx: 12, dy: 18 },
        "NSLS-II": { dx: -12, dy: 4, anchor: "end" }
      },
      accent: "#c2410c",
      projects: [
        {
          company: "Lam Research",
          domain: "lamresearch.com",
          facility: "ALS",
          project: "EUV photoresist underlayers",
          description: "X-ray studies probing how underlayers affect EUV photoresist performance.",
          x: 48, y: 248, w: 330, h: 168
        },
        {
          company: "Form Energy",
          domain: "formenergy.com",
          facility: "NSLS-II",
          project: "Mapping reaction heterogeneity in iron-air batteries",
          description: "Synchrotron measurements of battery chemistry for long-duration energy storage.",
          x: 1206, y: 152, w: 330, h: 168
        },
        {
          company: "Dow",
          domain: "dow.com",
          facility: "APS",
          project: "X-ray scattering studies on polymeric systems",
          description: "APS scattering studies supporting polymer materials research.",
          x: 1206, y: 346, w: 330, h: 168
        },
        {
          company: "General Motors",
          domain: "gm.com",
          facility: "APS",
          project: "High-speed X-ray imaging of laser weld defects",
          description: "Battery and fuel-cell manufacturing research using real-time X-ray imaging.",
          x: 1206, y: 540, w: 330, h: 168
        },
        {
          company: "Intel",
          domain: "intel.com",
          facility: "SSRL",
          project: "X-ray induced transient effects in a new transistor technology",
          description: "Beamline studies probing reliability behavior in next-generation transistor materials.",
          x: 64, y: 474, w: 330, h: 168
        }
      ]
    },
    {
      id: "nanoscience",
      title: "Nanoscience Centers",
      kicker: "Nanoscale fabrication, microscopy, and materials characterization for companies",
      facilities: ["CFN", "CINT", "CNMS", "CNM", "TMF"],
      accent: "#0f766e",
      projects: [
        {
          company: "Microsoft",
          domain: "microsoft.com",
          facility: "CNMS",
          project: "Cross-sectional STM of semiconductor-superconductor devices",
          description: "Atomic-scale imaging for quantum-device materials and interfaces.",
          connectorControls: [{ x: 1138, y: 510 }, { x: 1102, y: 626 }],
          x: 1206, y: 388, w: 330, h: 168
        },
        {
          company: "Seagate",
          domain: "seagate.com",
          facility: "CNM",
          project: "Graphene magnetotransport",
          description: "Magnetotransport and magnetoresistance studies in graphene nanoribbon systems.",
          connectorControls: [{ x: 1138, y: 248 }, { x: 1056, y: 236 }],
          x: 1206, y: 180, w: 330, h: 168
        },
        {
          company: "Limelight Steel",
          domain: "limelightsteel.com",
          facility: "TMF",
          project: "Laser furnace for low-carbon iron",
          description: "Molecular Foundry work on converting iron oxides and ores to iron metal without CO2 emissions.",
          x: 64, y: 382, w: 330, h: 168
        }
      ]
    },
    {
      id: "fusion",
      title: "Fusion Facilities",
      kicker: "Tokamak and spherical-torus experiments with industrial fusion users",
      facilities: ["DIII-D", "NSTX-U"],
      accent: "#7c3aed",
      projects: [
        {
          company: "General Atomics",
          domain: "ga.com",
          facility: "NSTX-U",
          project: "Predict-first modeling and experimental demonstration",
          description: "NSTX-U control analysis, scenario development, and predictive modeling work at PPPL.",
          x: 1206, y: 374, w: 330, h: 168
        },
        {
          company: "Helion Energy",
          domain: "helionenergy.com",
          facility: "DIII-D",
          project: "Polaris first-wall material candidates",
          description: "DIII-D exposure studies of ceramic first-wall material candidates for Helion's Polaris generator.",
          x: 64, y: 478, w: 330, h: 168
        }
      ]
    },
    {
      id: "accelerators",
      title: "Accelerator & Isotope Facilities",
      kicker: "Accelerator testbeds and rare-isotope facilities used by aerospace and electronics companies",
      facilities: ["ATF", "FACET-II", "Fermilab AC", "CEBAF", "RHIC", "FRIB", "ATLAS"],
      facilityOffsets: {
        "Fermilab AC": { dx: -10, dy: 8 },
        ATLAS: { dx: 10, dy: -8 },
        FRIB: { dx: 14, dy: 2 }
      },
      labelOffsets: {
        ATLAS: { dx: -10, dy: 4, anchor: "end" },
        "Fermilab AC": { dx: -10, dy: 22, anchor: "end" },
        FRIB: { dx: -2, dy: 22 },
        ATF: { dx: 12, dy: -11 },
        RHIC: { dx: 12, dy: 12 },
        CEBAF: { dx: 12, dy: 18 }
      },
      accent: "#b45309",
      compactCards: true,
      projects: [
        {
          company: "NVIDIA",
          domain: "nvidia.com",
          facility: "Fermilab AC",
          project: "DUNE neutrino experiment",
          description: "Fermilab accelerator-complex work tied to DUNE and Neutrino Division projects.",
          x: 64, y: 198, w: 330, h: 136
        },
        {
          company: "SpaceX",
          domain: "spacex.com",
          facility: "FRIB",
          project: "FSEE testing",
          description: "Multiple FRIB test campaigns tied to radiation-effects testing for space systems.",
          x: 1206, y: 220, w: 330, h: 136
        },
        {
          company: "Northrop Grumman",
          domain: "northropgrumman.com",
          facility: "FRIB",
          project: "FRIB instrument working groups",
          description: "Industry participation in FRIB detector, data acquisition, isotope, and neutron-source working groups.",
          connectorControls: [{ x: 1110, y: 430 }, { x: 1090, y: 356 }],
          x: 1206, y: 368, w: 330, h: 136
        },
        {
          company: "Thermo Fisher Scientific",
          domain: "thermofisher.com",
          facility: "FRIB",
          project: "FRIB instrument working groups",
          description: "Contributions to FRIB ion trap, neutron detection, data acquisition, and radioactive-decay station groups.",
          x: 1206, y: 516, w: 330, h: 136
        },
        {
          company: "Toyota Motors",
          domain: "toyota.com",
          facility: "FRIB",
          project: "FSEE site visits",
          description: "Toyota Motor Engineering & Manufacturing North America visits to understand FRIB FSEE capabilities.",
          x: 1206, y: 664, w: 330, h: 136
        }
      ]
    },
    {
      id: "neutrons",
      title: "Neutron Sources",
      kicker: "Neutron imaging and scattering for energy, nuclear, industrial, and structural materials",
      facilities: ["HFIR", "SNS"],
      accent: "#475569",
      projects: [
        {
          company: "Kairos Power",
          domain: "kairospower.com",
          facility: "HFIR",
          project: "Neutron imaging of FLiBe salt intrusion in graphite",
          description: "Molten-salt reactor material research using neutron imaging at ORNL.",
          x: 1206, y: 232, w: 330, h: 168
        },
        {
          company: "Schlumberger",
          domain: "slb.com",
          facility: "SNS",
          project: "Local structure of lithium-bearing clays",
          description: "Neutron scattering to understand subsurface lithium-bearing materials.",
          x: 1206, y: 474, w: 330, h: 168
        }
      ]
    }
  ]
};
