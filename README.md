# IT Support Interview Roadmap

Interactive 30-day hour-by-hour roadmap for school and MSP IT support / systems admin interview prep. Use it as a self-paced study tracker with progress saved in your browser. Covers Microsoft 365, Active Directory, networking, Intune, ticketing, documentation, and interview prep across 30 structured days.

## Features

- 30-day schedule with time blocks, resources, and task types
- Checkbox progress tracked per block
- Search and category filters
- Progress saved in the browser via `localStorage`
- Export and import progress as JSON
- Reset progress with confirmation
- “Go to Today’s Suggested Day” jumps to the first day with incomplete blocks

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Other commands

```bash
npm run build    # production build to dist/
npm run preview  # preview production build locally
```

## Progress storage

Progress is stored **only in your browser** on this device:

- Key: `it-speedrun-progress-v1`
- Last updated: `it-speedrun-last-updated-v1`

It does **not** sync across devices or browsers unless you export and import the JSON file. Adding a backend would be required for cloud sync.

## Deploy on Vercel

1. Initialize git and push to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial roadmap app"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. In [Vercel](https://vercel.com), click **Add New Project** and import your GitHub repository.

3. Use these settings:

   | Setting | Value |
   |---------|--------|
   | Framework Preset | **Vite** |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` (default) |

4. Deploy. Vercel will run `npm install` and `npm run build` automatically on each push.

No environment variables are required for the static app.

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── data/
│       └── roadmap.js   # full 30-day curriculum data
└── public/
```

## License

Personal study use. Roadmap links point to official Microsoft, Cisco, and other vendor documentation.
