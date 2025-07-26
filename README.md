# StreetSnackConnect

A full-stack platform for street food vendors and suppliers. This guide will help you set up and run the project from scratch, even if you are a complete beginner.

---

## Quick Start for Beginners (No MERN Experience Needed)

### 1. Install Node.js

- Go to the official Node.js website: https://nodejs.org/
- Download the **LTS** version for your operating system (Windows, Mac, or Linux).
- Run the installer and follow the instructions (just click Next/OK for all steps).
- To check if Node.js and npm are installed, open a terminal (Command Prompt on Windows) and run:
  ```sh
  node --version
  npm --version
  ```
  You should see version numbers for both.

### 2. Download the Project

- If you have Git, run:
  ```sh
  git clone https://github.com/debeb-dotcom/StreetSnackConnect.git
  cd StreetSnackConnect
  ```
- Or, download the ZIP from GitHub, extract it, and open the folder in VS Code or your editor.

### 3. Install Project Dependencies

- In the project folder, run:
  ```sh
  npm install
  ```
- This will download everything needed to run the app. It may take a few minutes.

### 4. Start the Application

- In the same folder, run:
  ```sh
  npm run dev
  ```
- This will start both the frontend (React) and backend (Node.js/Express) servers.
- After a few seconds, you should see a message like:
  ```
  VITE vX.X.X  ready in ...
  ➜  Local:   http://localhost:5173/
  ```
- Open your browser and go to [http://localhost:5173](http://localhost:5173)

### 5. Using the App

- Register as a vendor, supplier, or admin.
- Try adding products, suppliers, and using the cart.

### 6. If You Get Errors

- Make sure you are in the correct folder (where `package.json` is).
- Try running `npm install` again if you see missing package errors.
- If you see a port error, close other apps using that port or restart your computer.
- For any other error, copy the message and search it on Google or ask your instructor.

---

## What You Just Did
- Installed Node.js (the engine for running JavaScript apps)
- Downloaded the project code
- Installed all required libraries
- Started the app locally

You do **not** need to install MongoDB or MySQL for the default demo setup.

---

## .gitignore (What to Ignore in Git)

This project uses a `.gitignore` file to prevent certain files and folders from being tracked by Git. This keeps your repository clean and avoids uploading unnecessary or sensitive files.

**Common entries in `.gitignore`:**
- `node_modules` — All installed dependencies (never commit this folder)
- `dist` — Build output (auto-generated)
- `.DS_Store` — macOS system files
- `server/public` — Public assets (if generated or not needed in repo)
- `vite.config.ts.*` — Vite config backups or variants
- `*.tar.gz` — Any tarball archives

**How to use:**
1. The `.gitignore` file is already present in the project root. You can add more patterns as needed.
2. To ignore a new file or folder, add its name or pattern to `.gitignore` (one per line).
3. Changes to `.gitignore` take effect for new files. Already-tracked files must be removed from git with:
   ```sh
   git rm --cached <file-or-folder>
   ```

**Example .gitignore:**
```
node_modules
.DS_Store
dist
server/public
vite.config.ts.*
*.tar.gz
```

---

## Prerequisites

- **Node.js** (v18 or newer recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (for production, but the default setup uses in-memory storage for demo)
- **Git** (optional, for cloning the repo)

---

## 1. Download or Clone the Project

- **Option 1:** Download the ZIP from GitHub and extract it.
- **Option 2:** Use Git:
  ```sh
  git clone https://github.com/debeb-dotcom/StreetSnackConnect.git
  cd StreetSnackConnect
  ```

---

## 2. Install Dependencies

Open a terminal in the project folder and run:

```sh
npm install
```

This will install all required packages for both frontend and backend.

---

## 3. Start the Development Server

```sh
npm run dev
```

- This will start both the frontend (React) and backend (Node.js/Express) servers.
- The app will be available at [http://localhost:5000](http://localhost:5173) (or the port shown in your terminal).

---

## 4. Using the App

- Open your browser and go to [http://localhost:5000](http://localhost:5173)
- You can register as a vendor, supplier, or admin.
- Try adding products, suppliers, and using the cart.

---

## 5. Common Issues

- If you see errors about missing dependencies, run `npm install` again.
- If ports are in use, stop other apps using those ports or change the port in `vite.config.ts` or `server/vite.ts`.
- For MySQL setup, see the `shared/schema.ts` for the DB schema and adjust backend config as needed.

---

## 6. Project Structure

- `client/` - Frontend React app
- `server/` - Backend Node.js/Express API
- `shared/` - Shared types and DB schema

---

## 7. Advanced: MySQL Setup (Optional)

- By default, the backend uses in-memory storage for demo/testing.
- To use MySQL, set up your DB and update the backend config in `server/storage.ts`.

---

## 8. Need Help?

- Open an issue on GitHub or ask your instructor/mentor.
- For Node.js/npm errors, search the error message online—most issues are common and have solutions.

---

Happy coding!
