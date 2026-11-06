# Portfolio maintenance

## Structure and conventions

This is a plain HTML5/CSS3 static academic portfolio. Keep it dependency-free; do not introduce a framework, build system, or JavaScript without a specific need. Pages live at the repository root; shared styles and the neutral profile SVG live in `assets/`.

Use the existing checkout; cloud tasks are already isolated. Do not create worktrees unless explicitly requested.

Preserve the reference design: white background, narrow centered 800px content, blue links, muted blue secondary text, thin borders, restrained typography, no cards or decorative UI. About uses a centered profile column and biography column; research uses text entries with inline resource controls and dates aligned right on desktop. The footer stays near the viewport bottom on short pages. At mobile sizes, columns stack and dates reflow.

Use semantic headings and landmarks, descriptive image alt text, visible keyboard focus, relative asset/navigation paths, and exactly one `aria-current="page"` in each navigation. Keep the header/footer consistent across all four pages. Keep 2026 as the supplied footer year unless asked to change it.

Never invent profile, publication, document, or social URLs. Unavailable controls are documented spans with `role="link"` and `aria-disabled="true"`; replace them with real anchors when destinations are supplied. Do not substitute a real person's photograph for the neutral placeholder.

## Validation and delivery

Preview with `python3 -m http.server 8000` from the repo. Also serve its parent and check `/website/` to validate project-site paths. Check all internal links and images, active states, desktop/tablet/mobile widths, and horizontal overflow. No compilation or dependency installation is needed.

Make small targeted edits. Work on a dedicated branch and prepare a pull request when remote access is available. Do not merge or publish without user approval.
