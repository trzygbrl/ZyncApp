# 📄 Final Product Requirements Document: Zync

## 1. Product Overview
**Zync** is a personalized, AI-driven daily planner application that dynamically schedules tasks based on the user's current mood, energy levels, and available time, rather than just rigid deadlines. The application will be available for both web and mobile, with **mobile being the priority platform**.

## 2. Target Audience
* People who suffer from burnout using standard strict calendars.
* Neurodivergent users (ADHD, etc.) who experience fluctuating energy levels.
* Freelancers and creatives who want their workflow to match their daily vibe.

## 3. Core Features (MVP)
### 3.1. Dynamic Mood Check-ins & Task Entry
* **Interval Mood Check-ins:** The app periodically checks in with the user (e.g., every few hours) to ask "How are you feeling right now?". This is a quick UI interaction (selectable states, emojis, or sliders) rather than a typed string. If energy crashes or spikes, the schedule adjusts instantly.
* **Continuous Task Entry:** The user can add a task at any time throughout the day.
* **Detailed Task Prompts:** Every time a new task is added, the app actively prompts for specific details about its **priority**, **type of task**, and **deadline** ensuring accurate scheduling.

### 3.2. AI Task Processing Engine
* The app sends the user's continuous check-in data and structured task details to the AI.
* The AI analyzes the user's stated mood/energy levels in real-time.
* The AI processes the structured task properties to find the optimal schedule slot.

### 3.3. Dynamic Schedule Generation
* The AI outputs a suggested daily schedule.
* **High Energy:** AI schedules High Priority / High Effort tasks first.
* **Low Energy:** AI schedules simple, administrative tasks and pushes heavy tasks to following days if deadlines permit. 
* The user can drag-and-drop to adjust the generated schedule if they disagree with the AI.

### 3.4. The Aesthetic & Vibe (Crucial)
* Modern, premium feel with dark modes or harmonious, soft color palettes based on the user's stated mood (e.g., warm colors for energetic days, cool/calming colors for stressed days).
* Micro-animations and page transitions using **Framer Motion** to make the app feel alive and responsive.

## 4. 🌟 Amazing Feature Suggestions (To Consider)
* **Adaptive "Flow State" Timer:** A built-in Pomodoro timer that changes its intervals based on your energy. (e.g., High Energy = 45 min work / 5 min break. Low Energy = 15 min work / 10 min break).
* **Energy Analytics & Insights:** Weekly reports telling you, "You usually experience an energy crash on Wednesday afternoons. We recommend keeping this time block clear of heavy tasks."
* **Voice-to-Task Brain Dump:** Tap a microphone button, ramble about what you need to do, and the AI automatically extracts the task names, priorities, and types.
* **Aura Visualizer:** A fluid, glowing blob or gradient background on the dashboard that subtly shifts colors and shapes based on your check-ins and completed tasks.
* **Spotify/Apple Music Integration:** Zync automatically recommends a focus or relaxation playlist that matches your current mood.

---

# 🚀 Development Plan & Phasing

### Phase 1: Foundation & UI Skeleton
* **Goal:** Initialize the Next.js project and set up the premium mobile-first UI framework.
* **Tasks:**
  * Setup Next.js boilerplate.
  * Configure Vanilla CSS with global design tokens (colors, typography).
  * Setup Framer Motion and create standard micro-animations (button hovers, page transitions).
  * Build the mobile-responsive layout shell (Navbar, Bottom Tab bar for mobile).

### Phase 2: Database & Authentication
* **Goal:** Secure the app and setup data storage.
* **Tasks:**
  * Setup Supabase project.
  * Implement user signup/login flow.
  * Define Database Schema: `Users`, `Tasks`, `MoodLogs`.

### Phase 3: Core Task CRUD & State
* **Goal:** Allow users to manage their tasks.
* **Tasks:**
  * Build the "Add Task" modal/screen with structured prompts (Priority, Type, Deadline).
  * Implement front-end state management.
  * Save tasks to Supabase.

### Phase 4: AI Brain & Dynamic Check-ins
* **Goal:** The "Magic" phase. Bring Zync to life.
* **Tasks:**
  * Build the Mood Check-in UI (emojis/sliders) that triggers every few hours.
  * Integrate Gemini API.
  * Write the prompt engineering to allow the AI to sort the user's `Tasks` based on their `MoodLog`.
  * Display the dynamically sorted schedule to the user.

### Phase 5: Polish & Launch
* **Goal:** Make it ready for the world.
* **Tasks:**
  * Implement drag-and-drop for the schedule.
  * Refine the color-changing UI based on mood.
  * Extensive testing on mobile devices to ensure a native-like feel.

### Future Post-MVP Roadmap
* Google Calendar Integration (pulling in hard-coded meetings so the AI schedules *around* them).
* Habit Tracking.
* End-of-day check-outs for reflection.
