# Silva Clinic - setup guide

## 1. Open the project
Unzip `silva-clinic.zip` and open the `silva-clinic` folder in VS Code (File → Open Folder).

## 2. Install Node.js (one-time, if not already installed)
Download and install from https://nodejs.org (LTS version). Confirm it worked by
opening the VS Code terminal (Terminal → New Terminal) and typing:
```
node -v
```

## 3. Install the project's dependencies
In the VS Code terminal, inside the `silva-clinic` folder, run:
```
npm install
```
This reads `package.json` and downloads React, React Router, and React Icons -
that's what connects all the pieces together; you don't need to link files by hand.

## 4. Run it
```
npm run dev
```
Vite will print a local address (usually `http://localhost:5173`) - open that
in your browser (or hold Ctrl and click it in the terminal).

## 5. How the project fits together
- `src/main.jsx` boots React and wraps everything in a router.
- `src/App.jsx` lists every URL/page ("route") and which page component handles it.
- `src/components/Layout.jsx` puts the navbar and footer around every page.
- `src/pages/*.jsx` are your actual pages (Home, Patients, Stock, Dosing, Lending, Finance).
- `src/components/*.jsx` are the smaller reusable pieces the pages are built from
  (forms, tables, badges, etc.) - you don't need to import these yourself, the
  pages already do.
- `src/utils/storage.js` is the only place that talks to localStorage. When you
  move to a real backend later, this is the file to rewrite - the pages call
  functions like `patientsApi.getAll()` and won't need to change much.
- `src/index.css` is the one stylesheet for the whole app.

## 6. Data lives in your browser for now
Everything is saved to localStorage in whichever browser you use - it will not
sync between computers or phones, and clearing browser data will erase it. This
is expected for now; you told me you'll move to a backend later.

## 7. What's built vs. what's next
Built: Home dashboard, Patients (list + sort/search + individual record with
debt tracking, drugs/acts, lab tests, wound treatment, dosing/condition tags,
payments), Stock (items, weekly/annual counts, order receipts that top up
stock automatically), Dosing/course tracker, Borrowing/lending with Trinity,
Ave Maria, Muzizi DS, Joshua Clinic, and a daily income/expenses log.

Worth adding once you've tried it: edit/undo on entries (right now you can add
entries but not edit a past one - only delete a whole patient), printable daily
reports, and eventually login/auth once there's a backend.
