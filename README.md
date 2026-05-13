# pick2do


> **Developer Note:** I am a university student, and I built this app with heavy use of AI to solve my own personal time-management and focus needs. It's designed to cut through the noise of traditional to-do lists and help you figure out what to do *right now*.


pick2do is a blazing-fast, keyboard-first, smart task management application built for minimal friction and maximum focus. Instead of overwhelming you with endless checklists, pick2do dynamically scores and sorts your tasks based on **how much time you have right now** and your current **cognitive focus** (Deep vs. Shallow work).

## Technical Overview

This project was built from scratch with a focus on performance, accessibility, and modern web architecture:
- **Framework:** Next.js (App Router) with React 19
- **Language:** TypeScript for robust, end-to-end type safety
- **Styling:** Vanilla inline CSS / minimal styling for maximum speed and zero dependencies
- **Architecture:** Modular component design emphasizing reusability and clean separation of concerns
- **Backend/API:** Next.js Route Handlers (`app/api/...`) that read and write to the local filesystem using Node.js `fs/promises`
- **Algorithms:** Custom dynamic scoring and sorting algorithm that prioritizes tasks based on real-time constraints (duration, deadlines, and cognitive load)
- **Accessibility:** 100% keyboard-navigable interface with customized event listeners and segmented controls for power users

## Philosophy

Most task managers fail because they ask you "What do you want to do?" when they should be asking **"What *can* you do right now?"**. 

If you only have 15 minutes between meetings, your task manager shouldn't show you a 90-minute architecture refactor. If you're exhausted and just want to clear some emails, it shouldn't show you deep-focus coding tasks.

pick2do solves this by:
1. **Dynamic Scoring**: Tasks are prioritized based on approaching deadlines, duration fit, and cognitive load match.
2. **Frictionless Splitting**: If a task is too big (e.g., exceeds 90 minutes), the app *forces* you to split it into manageable, sequential chunks.
3. **Keyboard First**: Every single interaction is built to be navigated flawlessly with a keyboard. No mouse required.

## Key Features

- **Smart Prioritization**: Enter your available time and focus state, and the algorithm surfaces the perfect tasks.
- **Mandatory Splitting**: Enforces task size limits to prevent procrastination on oversized items.
- **Sequential Dependencies**: When splitting tasks, you can mark them as sequential so subsequent parts remain hidden until the first part is completed.
- **Local JSON Storage**: Everything is saved instantly to a local `data.json` file. No database, no backend, no accounts required. Complete privacy and easily backed up to Dropbox or Google Drive.
- **Accessible & Fast**: 100% keyboard navigable with instant UI updates and zero bloat.

## Installation & Booting

pick2do is built with Next.js and requires Node.js to be installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/pick2do.git
   cd pick2do
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Boot the application normally (for development):**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running in the Background (Always On)

If you want pick2do to run completely silently in the background (so you never have to keep a terminal open, and it automatically starts when you restart your computer), you can use PM2:

1. **Install PM2 Globally:**
   ```bash
   npm install -g pm2
   ```

2. **Build and Start the Background Service:**
   ```bash
   npm run build
   npm run start:bg
   ```

3. **Make it Survive Computer Reboots:**
   Run the following command and follow the instructions it prints on your screen:
   ```bash
   pm2 startup
   ```
   Once you've run the generated command, save your current running processes:
   ```bash
   pm2 save
   ```
   *Your app is now permanently running at `http://localhost:3000` even after you restart your computer!*

## How the Save System Works

pick2do is completely serverless but uses a tiny, lightning-fast Next.js Route Handler to read and write your data directly to your local filesystem. 

* Every time you add, edit, split, or complete a task, the changes are saved instantly to a local `data.json` file in the root of your project directory.
* Because the data is stored in a simple `.json` file, it is incredibly easy to backup, sync with Dropbox/Google Drive, or migrate to a new machine.
* The frontend synchronizes with this file instantly to ensure zero UI lag while making sure your data is perfectly persisted.

## Keyboard Shortcuts Cheat Sheet

* **Global**
  * `[N]` - Add a new task
  * `[S]` - Open settings/preferences
  * `[R]` - Restart session (re-select time and focus)
  * `[A]` - Toggle "Show all" vs "Show top 2" tasks
  * `[C]` - Toggle "Show done" tasks

* **Navigation & Forms**
  * `[Tab]` - Navigate between inputs and buttons
  * `[Space]` / `[Enter]` - Toggle tasks as complete, submit forms, or toggle focus states
  * `[Esc]` - Close any open modal (Add, Edit, Split, Settings)

## Configuration (Settings)

You can hit `[S]` to open the Algorithm Settings. Here you can tweak exactly how pick2do scores your tasks:
* **Max Task Duration**: The limit before a task *must* be split.
* **Focus Match/Mismatch**: How heavily to reward/penalize tasks that match your current cognitive state.
* **Overtime Penalty**: Penalty for tasks that take longer than your available session time.
* **Deadline Urgency**: How many points to award based on approaching due dates.

## Future Ideas

Coming up soon:
- dark mode
- stats
- repeating tasks
- mobile app
- maybe focus mode with timer
- reward mechanism, collecting points
- cross device sync drive/dropbox or something
- screenshots and the logic behind due date without year input in readme

---
*Built for flow.*
