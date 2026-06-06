# Covaya Campaign Site

A static HTML/CSS/JS website for the **Cowboys & Chaos** D&D campaign, set in the frontier nation of Covaya. Built for GitHub Pages. No build tools, no frameworks — just files.

## Structure

```
covaya-site/
├── index.html          # Landing page with star animation
├── history.html        # Timeline from the Long Dark to present
├── culture.html        # Government, religion, daily life
├── factions.html       # Tribes, Chancellery, key NPCs
├── map.html            # Interactive map with clickable pins
├── style.css           # Shared styles (all pages import this)
├── main.js             # Shared JS: nav toggle, audio player, active links
├── map.webp            # The Covaya map image
├── audio/              # (you create this) — MP3 narration files
│   ├── welcome.mp3
│   ├── history.mp3
│   ├── culture.mp3
│   ├── factions.mp3
│   ├── spine-gulch.mp3
│   ├── copper-city.mp3
│   ├── wort-tribe.mp3
│   ├── tex-tribe.mp3
│   ├── strange-mountains.mp3
│   ├── grand-mesa.mp3
│   └── the-spines.mp3
└── locations/
    ├── _template.html      # Boilerplate for new location pages
    ├── spine-gulch.html    # Fully detailed
    ├── copper-city.html    # Stub — expand as campaign develops
    ├── wort-tribe.html     # Stub
    ├── tex-tribe.html      # Stub
    ├── strange-mountains.html  # Stub
    ├── grand-mesa.html     # Stub
    └── the-spines.html     # Stub
```

## Adding Audio

Create an `audio/` folder in the root. Each page's Play button already points to the correct filename — just drop in the MP3. If a file isn't found yet, the button shows "Audio not yet loaded" briefly and resets.

## Adding a New Location Page

1. Copy `locations/_template.html`
2. Replace `{{TITLE}}`, `{{SUBTITLE}}`, `{{AUDIO}}`, and `{{CONTENT}}`
3. Add a pin to `map.html` (position as `left`/`top` percentages of the map image)
4. Add a card to the location grid in `map.html`

## Map Pins

Pins in `map.html` are absolutely positioned over the map image using percentage coordinates. Each pin is an `<a>` tag linking to the location page. Pin colors:
- **Gold** — settlements and regions
- **Rust/red** — dangerous or strange locations
- **Sage/green** — tribal territories

To adjust a pin's position, change its `left` and `top` inline style values.

## Design System

All visual tokens live in CSS custom properties at the top of `style.css`:

| Variable | Use |
|---|---|
| `--parchment` | Main background for content sections |
| `--ink` / `--ink-light` | Body text |
| `--rust` / `--rust-light` | Accent, headings, danger pins |
| `--gold` / `--gold-light` | Nav, highlights, decorative elements |
| `--wood` / `--wood-light` | Wooden sign cards |
| `--shadow` | Dark section backgrounds |
| `--font-display` | Rye — section titles, nav brand, labels |
| `--font-heading` | Playfair Display — card titles, h2/h3 |
| `--font-body` | Crimson Text — all body copy |

## Deploying to GitHub Pages

1. Push to a GitHub repo
2. Go to Settings → Pages → Source: `main` branch, `/ (root)`
3. Done — the site will be live at `https://<username>.github.io/<repo>/`

## Lore Source Files

The campaign's reference documents live separately (not in this repo). When expanding location or faction pages, draw from:
- `Gods_of_Covaya.docx`
- `Historical_Overview_of_Covaya.docx`
- `Covayan_Government.docx`
- `Spine_Gulch.docx`

Major mysteries (Before People, the Quint split, the Calamity, the strangeness of the Strange Mountains) are intentionally unresolved in those documents. Keep them vague on the site too — players shouldn't know more than the archive does.