# BlockNexa — AI-Powered Automatic Railway Block Planning System
### Indian Railways • Central Railway (Bhusawal Division)

BlockNexa is a high-fidelity prototype designed for Indian Railways section controllers and divisional operating officers to automatically coordinate, optimize, and safely sanction maintenance blocks without causing massive train delays.

---

## 🚀 Live Local Application URL

The development server is running and accessible at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

### How to Run Locally:
```bash
# Option 1: From the root folder
npm run dev

# Option 2: From the BlockNexa folder
cd BlockNexa
npm run dev
```

### 🛰️ Live Open-Source Dataset Ingestion:
BlockNexa uses real-world railway failure telemetry from the Hugging Face dataset [`samyuktha01/Indian_Railway_maintance`](https://huggingface.co/datasets/samyuktha01/Indian_Railway_maintance) (CC BY 4.0, 100K records). To re-sync or refresh the dataset:
```bash
# Run from BlockNexa folder:
python scripts/import_hf_dataset.py
```
This parses the 100K dataset, isolates Central Railway (CR) records requiring maintenance, computes Composite Priority Index (CPI) scores, and exports to `src/data/huggingfaceMaintenanceData.js`.

---

## 🧭 How BlockNexa Works (In Simple Words)

In real railway operations, track maintenance requires **"Blocks"** — periods where trains are stopped or diverted so railway gangs can fix tracks, overhead power lines, or signals. Historically, different departments (Track, Electrical, Signals) asked for blocks separately, causing huge train delays.

**BlockNexa solves this by:**
1. Combining separate maintenance requests into **one single joint window**.
2. Checking the live train timetable so high-priority trains like **Vande Bharat** and **Rajdhani** run smoothly.
3. Giving the human controller a clear **Safety Validation & Official Permit** before work begins.

---

## 📑 Walkthrough of Each Module (Simple Language)

### 0. Login Screen
- **What it does:** Secure login portal styled after Indian Railways divisional control rooms.
- **Features:** Authentic Indian Railways crest, dark control-room theme, and **1-Click Quick Demo Accounts** (`Section Controller`, `Admin`, `Engineering P-Way`, `S&T Signal`, `TRD OHE`). Clicking any demo role logs you right in.

---

### 1. Dashboard (The High-Level Overview)
- **What it does:** Gives the section controller a quick snapshot of the entire railway division at a glance.
- **What you see:**
  - **Pending Maintenance:** How many repairs are waiting in queue.
  - **Critical Defects:** Urgent track or electrical defects needing immediate attention.
  - **Active Blocks:** Maintenance currently happening on the tracks right now with a live countdown timer.
  - **Conflicts:** How many trains or blocks are clashing.
  - **Asset Availability:** Health score of tracks and overhead lines (94.2%).
  - **Today's Schedule:** Today's planned maintenance windows.

---

### 2. Maintenance Requests (Department Requisitions)
- **What it does:** Collects and displays maintenance jobs raised by the 3 core railway field departments:
  - **Engineering (TMS):** Track repairs, rail welds, ballast cleaning machines.
  - **Traction (TDMS):** Overhead electric wire (OHE), pantograph insulators.
  - **Signalling & Telecom (SMMS):** Points, electronic interlocking, axle counters.
- **Key Actions:** Filter by department or severity, select multiple requests to bundle them together, or click **"+ Raise Requisition"** to simulate a field defect report.

---

### 3. AI Block Planner — CORE ENGINE (The Brain)
- **What it does:** Automatically takes 4 data streams:
  1. Field maintenance requests.
  2. Passenger train timetable (COA).
  3. Goods train forecast (FOIS freight rakes).
  4. Available track lines (Up, Down, Loop lines).
- **Key Action:** Click **"Generate Optimized Block Plan"**. An animated 5-stage AI solver runs, detecting collisions, bundling multi-department requests together, and generating a delay-minimized plan saving over **190 minutes of train delays**.

---

### 4. Gantt / Block Schedule (The Interactive Timeline)
- **What it does:** Visual representation of time vs. tracks (similar to railway time-distance charts).
- **What you see:**
  - **Time Axis:** 06:00 to 22:00 with a red vertical line showing the current time.
  - **Tracks:** Down Main Line, Up Main Line, Bi-directional Loop Line, and 3rd Dedicated Freight Line.
  - **Train Paths:** Moving train slots for Vande Bharat, Rajdhani, Punjab Mail, and freight trains.
  - **Blocks:** Color-coded maintenance blocks (Amber for Track, Cyan for OHE, Green for Signals, and glowing Violet for AI-Selected Joint Windows).
  - **Interactivity:** Click any block to view full telemetry, speed restriction caution orders, and crew details. Toggle Daily, Weekly, or Monthly views.

---

### 5. Train Impact (Delay & Passenger Mitigation)
- **What it does:** Analyzes exactly which passenger and freight trains will be affected by track work and lets controllers fix delays with a single click.
- **Key Action:** For each train, choose between:
  - **Reroute via Loop Line:** Diverts the train through a middle bypass line (e.g. Rajdhani delay reduced from 24 mins to only 4 mins).
  - **Regulate / Hold:** Holds freight rakes at loop sidings to let express trains pass.
  - **Margin Recovery:** Speeds up recovery over safe sections.

---

### 6. Conflict Center (Collision & Clash Detection)
- **What it does:** Flags when two maintenance teams ask for the same track at different times, or when a high-speed passenger train infringes on a planned track block.
- **Key Action:** Shows clear AI recommendations with confidence ratings. Click **"Apply AI Resolution"** to resolve the conflict instantly.

---

### 7. Asset Intelligence (Predictive Health Monitoring)
- **What it does:** Monitors physical railway assets to prevent accidents before they occur.
- **What you see:**
  - Health scores for Track (TQI), Overhead Electric Lines, and Signalling systems.
  - Telemetry for high-risk assets: ultrasonic rail flaws (USFD), insulator flashovers, and point machine motor currents.
  - Alerts for overdue maintenance.

---

### 8. Simulation & Replanning (What-If Sandbox)
- **What it does:** Allows the controller to test changes safely before applying them to real train movements.
- **Key Action:** Move the **Start Time** and **Duration** sliders, toggle **Single Line Working (SLW)**, and click **"Run What-If Simulation"**. A side-by-side **Before vs. After** comparison shows exact train delay minutes saved and track output gained.

---

### 9. Safety Validation & Approval Gate (The Final Sign-Off)
- **What it does:** The mandatory safety checkpoint before any maintenance team is permitted onto the tracks.
- **What you see:**
  - **4 Automated Safety Checks:** Corridor Isolation, Zero Train Conflict, Gang/Machinery on Site, and SIL-4 Compliance.
  - **Controller Electronic Sign-off:** Enter Controller Name, PIN, and Caution Order remarks.
  - **Official Sanction Order:** Generates a printable **Divisional Block Permit** complete with official Ministry of Railways formatting, divisional seal stamp, and verification QR code.
