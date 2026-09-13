# SNK — Special Needs Kids

SNK is a browser-based learning-app prototype with student and caregiver experiences. It brings together playful literacy activities, adjustable reading and sensory preferences, and family dashboard demonstrations.

The interface uses a green-and-navy theme, responsive layouts, read-aloud controls, and animated characters. **WordSplash is the currently implemented game**, with five worlds and 50 levels.

> **Project status:** This is a frontend demo. Signup and login do not create or authenticate accounts. Family profiles, caregiver analytics, appointments, and therapist notes use example data. Use sample details in the forms.

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [Features and demo walkthrough](#features-and-demo-walkthrough)
- [Routes](#routes)
- [Architecture](#architecture)
- [State and persistence](#state-and-persistence)
- [Accessibility and responsive behavior](#accessibility-and-responsive-behavior)
- [Validation](#validation)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)

## Quick start

### Requirements

- Git.
- Node.js **20 or newer**, as required by the installed Font Awesome React package.
- npm. This repository uses `package-lock.json` for dependency reproducibility.

The local development and build checks for the current implementation used Node.js `20.18.0` and npm `10.8.2`. No backend, database, API key, or environment variable is required to run the demo.

```bash
git clone https://github.com/Kimathii/SNK.git
cd SNK
git switch develop
npm ci
npm run dev
```

Open the URL printed by Vite, normally **http://localhost:5173**. If that port is busy, Vite may select another one.

To preview on a phone or tablet connected to the same local network:

```bash
npm run dev -- --host 0.0.0.0
```

Open the network URL printed by Vite on the other device. The host computer must allow the connection through its firewall.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the exact dependency versions from the lockfile. |
| `npm run dev` | Start Vite with hot module replacement. |
| `npm run build` | Run TypeScript checks, then generate the production bundle in `dist/`. |
| `npm run preview` | Serve the production build locally for inspection. |
| `git diff --check` | Check pending changes for whitespace errors and conflict markers. |

There are currently no configured `test` or `lint` scripts.

## Features and demo walkthrough

### Landing page

- Full-width photo banner with readable overlaid text.
- Sections introducing the learning flow, WordSplash, and family views.
- Reading-font and calm-color controls, plus the full accessibility drawer.
- Read-aloud introduction, grouped footer navigation, and SNK branding.
- One-time scroll reveals, staggered entrances, and hover effects that respect reduced-motion preferences.

Choose **Get started** to enter signup through the welcome screen, or **Log in** to open the login form.

### Signup and login

- Student is selected by default.
- The **G / Caregiver** control switches to Caregiver.
- Signup includes name, email, and password fields; login includes email and password.
- Native form validation checks required fields and email format. Signup requires at least eight password characters.
- A visibility control shows or hides the password.
- Signup continues to learning-needs selection and the congratulations screen.
- Demo login opens the selected role's dashboard.
- Back buttons and the form logo return to the landing page; learning-needs selection has a back button to signup.

These forms are UI flows only. Passwords are not persisted by the app, and there is no server-side authentication or access control. Form entries are discarded when the form unmounts.

### Caregiver dashboard

Switch among Samuel, Grace, and David to explore different example datasets:

- Games, weekly activity, and monthly skill charts.
- Session, activity, and goal summary cards.
- A game-plan customizer with playtime, game choices, and sensory options.
- Streak and milestone displays.
- Notifications and condition-guide dialogs.
- Therapist insights and appointment links to the selected child's profile.
- Recommended game links and a switch to the student view.

The game-plan dialog updates local component state and displays a confirmation. It does not save a plan to a backend or configure the actual game engines.

### Student and family views

Students can open WordSplash or browse the game library. The family hub displays example children and links to profiles with overview, session history, notes, and appointment tabs.

### WordSplash

| World | Activity | Main skill |
| --- | --- | --- |
| 1 — Letter Splash | Find and pop target letters. | Letter recognition |
| 2 — Word Builder | Arrange letter tiles into words. | Letter sequencing |
| 3 — Trace & Splash | Follow letter and shape guides on a canvas. | Tracing and motor practice |
| 4 — Listen & Build | Listen to a word, then arrange its letters. | Sound-to-letter association |
| 5 — Word Splash | Select correctly spelled words. | Spelling recognition |

Each world contains ten levels. Demo mode unlocks all 50 levels. Completion records and stars are saved in the current browser.

Numbershark, Detective Lonny, and Jungle Adventure appear in the library and example dashboard content, but are not implemented as playable games in the current source tree.

## Routes

Navigation uses the browser History API and the `SCREEN_PATHS` mapping in [src/App.tsx](src/App.tsx). Browser Back/Forward and direct screen loading are supported; no external routing library is installed.

| URL | Screen |
| --- | --- |
| `/` | Landing page |
| `/welcome` | Timed welcome screen |
| `/signup` | Signup form |
| `/login` | Login form |
| `/learning-needs` | Learning-needs selection |
| `/ready` | Congratulations screen |
| `/caregiver` | Caregiver dashboard |
| `/student` | Student dashboard |
| `/games` | Game library |
| `/family` | Family hub |
| `/child-profile` | Selected child's profile |
| `/wordsplash` | WordSplash world map and game |

Landing-page fragments such as `/#lp-games` identify sections on the landing page. Opening another screen replaces that fragment with the screen's route.

Selected child and onboarding choices are held in memory, not encoded in the route. Refreshing `/child-profile` falls back to the default child. WordSplash's internal world/level views are also component state rather than individual URLs. Unknown paths currently render the landing screen.

## Architecture

### Stack

| Area | Technology |
| --- | --- |
| UI | React 18 and TypeScript |
| Development/build | Vite 5 with the React plugin |
| Charts | Recharts |
| Icons | Font Awesome SVG React components, alongside legacy icons in other screens |
| Styling | Plain CSS, component stylesheets, global tokens, and responsive overrides |
| Sound | Web Audio API |
| Read-aloud | Web Speech API |
| Animation | CSS, Web Animations API, and IntersectionObserver |
| Persistence | Browser `localStorage` |

### Source layout

```text
assets/
  header.jpg                     Landing-page photo
src/
  main.tsx                       React entry point and stylesheet imports
  App.tsx                        Screen routing, role, and selected child
  index.css                      Shared tokens, shells, and base styles
  responsive.css                 Cross-screen viewport and responsive rules
  components/                    Headers, navigation, accessibility drawer, speech button
  context/
    AccessibilityContext.tsx     Global settings, layout choice, and persistence
  screens/                       Landing, forms, dashboards, family, and onboarding
  games/wordsplash/
    WordSplashGame.tsx           Game views, input handlers, and completion flow
    gameData.ts                  World and level definitions
    gameState.ts                 Persistence, progress, and unlock helpers
    audio.ts                     WordSplash audio engine
    components/                  World map, levels, tracing, particles, settings
  utils/
    soundEngine.ts               Shared UI sound and speech engine
```

`main.tsx` renders the application in React Strict Mode. `AccessibilityProvider` wraps the app. Screens communicate navigation and selections through callbacks, while individual activities and dialogs manage their own local state.

## State and persistence

| Data | Storage | Behavior |
| --- | --- | --- |
| Global accessibility preferences | `snk_accessibility_settings` in `localStorage` | Restored on reload; synchronized with root attributes and the shared sound engine. |
| WordSplash progress and settings | `snk_wordsplash_state_v1` in `localStorage` | Restored on reload; demo mode remains enabled. |
| Active role, selected child, learning-needs choice | React state | Reset on reload; some routes supply a default view. |
| Caregiver game plan and dialog state | Component state | Reset when the dashboard unmounts or the page reloads. |
| Profiles, charts, notes, appointments | Source fixtures | Example data, not connected to game results or a service. |

Saved progress belongs to a browser origin, not an authenticated account or individual child. A different hostname, port, browser, or device has separate storage.

To reset local demo data, run the following in the browser developer console for the app. **This deletes saved WordSplash progress and accessibility preferences for that origin.**

```js
localStorage.removeItem('snk_accessibility_settings')
localStorage.removeItem('snk_wordsplash_state_v1')
location.reload()
```

## Accessibility and responsive behavior

Global controls include calm colors, reduced motion, reading font, text size, text spacing, high contrast, sound effects, read-aloud speed/pitch, and layout mode.

- Automatic layout uses mobile navigation below **1024px** and the desktop sidebar at larger widths.
- Screens use dynamic viewport height, with safe-area spacing and scrollable content for short windows.
- The landing and form screens use responsive layouts, labeled controls, and visible keyboard focus.
- Landing reveals and mascot animations respect the relevant reduced-motion controls. The onboarding flame's pupils track mouse or pen movement and ignore touch movement.
- WordSplash has its own accessibility settings and audio engine. They are not fully synchronized with the global controls.

These features are not a claim of complete accessibility compliance. Some legacy cards and game interactions still need keyboard and screen-reader review. Browser support, available speech voices, and user settings affect read-aloud behavior.

## Validation

The current integration passed `npm run build` and targeted local browser checks covering:

- Layouts at phone, tablet, desktop, and landscape sizes, including 320px-wide screens.
- Signup/login role selection, validation, password visibility, and navigation.
- Direct routes, refresh, browser Back/Forward, and clearing stale anchors.
- Desktop and mobile scrolling.
- Dashboard child switching, analytics tabs, dialogs, and child-profile links.
- Student dashboard links to WordSplash.
- Landing animation behavior, keyboard focus during reveals, and reduced motion.
- Pupil tracking and movement bounds at multiple viewport sizes.

These were targeted manual/automated browser checks during development, not a committed regression suite. The repository currently has no automated test framework or CI configuration. The production build reports a JavaScript chunk-size warning; code splitting remains future work.

## Deployment

```bash
npm ci
npm run build
npm run preview
```

Publish the generated `dist/` directory using a static hosting service. `npm run preview` is for local build inspection.

**Configure an SPA fallback:** requests for application routes such as `/login`, `/caregiver`, and `/wordsplash` must serve `index.html`, while real asset files must continue to be served normally. Without this rewrite, opening or refreshing a nested route can return a server 404 even though in-app navigation works.

Routes currently assume deployment at the domain root. Deploying under a subdirectory requires changes to both Vite's base configuration and the route mapping. Google Fonts are loaded from an external stylesheet in `index.html`; local fallback fonts are used if that resource is unavailable.

## Known limitations

- Authentication, account creation, authorization, and backend APIs are not implemented.
- Dashboard analytics and therapist content are fixtures, not live reports or clinical assessments.
- Progress is local to the browser and is not isolated per child or synced across devices.
- Most non-tracing game modes currently report 100% completion accuracy even after retries. Skill statistics count successful completions and do not yet capture every incorrect attempt.
- Tracing replay/level transitions need further state-reset testing. Some multi-answer spelling content also needs completion-rule review.
- Some game settings exist in the state model without full runtime integration.
- The app is a learning prototype; its content and outcomes have not been clinically validated.

## Contributing

Use `develop` as the integration branch. Create a focused feature branch for new work and open a pull request back to `develop`.

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/describe-your-change
```

Before proposing a change:

1. Run `npm run build` and `git diff --check`.
2. Exercise the affected flow on a small phone and desktop viewport.
3. Check scrolling, keyboard focus, and reduced-motion behavior when changing UI.
4. Keep demo content clearly distinguished from implemented services.
5. Use a conventional commit title, for example `feat(auth): improve role selection` or `fix(navigation): clear stale section anchors`.
6. Preserve original authorship when integrating another contributor's commits.

Existing implementation history includes work by **Echioda Mathias** and **heismyke**; Git history records authorship for each commit.

## License

No license file is currently included. Do not assume that the public repository grants unrestricted reuse; confirm permission with the repository owner before redistributing the code or bundled assets.
