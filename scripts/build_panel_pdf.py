from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPORT_DIR = ROOT / "exports"
PANEL_DIR = EXPORT_DIR / "panels"
HTML_PATH = EXPORT_DIR / "panel-deck.html"
PDF_PATH = EXPORT_DIR / "doe-user-facilities-company-project-graphics.pdf"
SOURCE_URL = "https://science.osti.gov/User-Facilities/User-Statistics/Data-Archive"

PANELS = [
    ("supercomputing.png", "Supercomputing"),
    ("xray.png", "X-ray Light Sources"),
    ("nanoscience.png", "Nanoscience Centers"),
    ("fusion.png", "Fusion Facilities"),
    ("accelerators.png", "Accelerator & Isotope Facilities"),
    ("neutrons.png", "Neutron Sources"),
]


def panel_pages():
    pages = []
    for filename, title in PANELS:
        image_path = (PANEL_DIR / filename).resolve().as_uri()
        pages.append(
            f"""
            <section class="page panel-page" aria-label="{title}">
              <img src="{image_path}" alt="{title}" />
            </section>
            """
        )
    return "\n".join(pages)


def build_html():
    source_text = "Source: DOE-SC User Statistics by Project FY2025 workbook"
    panels = "\n".join(f"<li>{title}</li>" for _, title in PANELS)
    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>DOE User Facilities Company Project Graphics</title>
    <style>
      @page {{
        size: 16in 9in;
        margin: 0;
      }}

      * {{
        box-sizing: border-box;
      }}

      body {{
        margin: 0;
        color: #0f172a;
        font-family: Arial, Helvetica, sans-serif;
        background: #fff;
      }}

      .page {{
        width: 16in;
        height: 9in;
        break-after: page;
        page-break-after: always;
        overflow: hidden;
        position: relative;
      }}

      .title-page {{
        padding: 1.05in 1.05in 0.9in;
        background: #f8fafc;
      }}

      .title-page h1 {{
        margin: 0;
        max-width: 10.5in;
        font-size: 0.72in;
        line-height: 0.95;
        letter-spacing: 0;
      }}

      .title-page p {{
        margin: 0.45in 0 0;
        max-width: 10.4in;
        color: #475569;
        font-size: 0.28in;
        line-height: 1.28;
      }}

      .rule {{
        width: 12.4in;
        height: 2px;
        margin: 0.56in 0 0.36in;
        background: #cbd5e1;
      }}

      .panel-list-title {{
        font-size: 0.25in;
        font-weight: 700;
        margin-bottom: 0.18in;
      }}

      ol {{
        margin: 0;
        padding-left: 0.36in;
        font-size: 0.22in;
        line-height: 1.55;
        font-weight: 700;
      }}

      .source {{
        position: absolute;
        left: 1.05in;
        bottom: 0.68in;
        font-size: 0.18in;
      }}

      .source a {{
        color: #1f6feb;
        text-decoration: underline;
      }}

      .panel-page img {{
        display: block;
        width: 100%;
        height: 100%;
      }}
    </style>
  </head>
  <body>
    <section class="page title-page">
      <h1>DOE User Facilities Company Project Graphics</h1>
      <p>Selected FY2025 industry projects mapped to DOE-SC user facility locations.</p>
      <div class="rule"></div>
      <div class="panel-list-title">Panels</div>
      <ol>
        {panels}
      </ol>
      <div class="source"><a href="{SOURCE_URL}">{source_text}</a></div>
    </section>
    {panel_pages()}
  </body>
</html>
"""
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    HTML_PATH.write_text(html)
    print(HTML_PATH)
    print(PDF_PATH)


if __name__ == "__main__":
    build_html()
