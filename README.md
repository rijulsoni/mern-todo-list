# To-Do List

A MERN to-do app: create, edit, delete and search tasks, schedule them by date and time, and track progress week by week (Monday–Sunday).

- **Live app:** _add the Netlify URL_
- **API:** _add the API URL_

## Features

- **Tasks** with a title, optional description, date and start time (plus an optional end time), and an optional Low / Medium / High priority.
- **Edit** any field by tapping a task. **Delete** with the trash icon, by swiping a row left, or from the edit sheet.
- **Mark tasks** as Completed or In Progress with the checkbox. Week counts update straight away.
- **Home:** a day strip to pick a date, this week's completed / pending counts, a weekly progress bar and the selected day's tasks.
- **All Tasks:** one card per week showing open and completed counts. Tap a card to expand that week's tasks.
- **Search** across titles and descriptions (at least 3 characters). Results can be viewed, edited or deleted.
- **Responsive:** the mobile layout follows the Figma design. Wider screens get a two-column home and centred dialogs.

## Tech stack

| Part | Stack |
| --- | --- |
| Client | React 19, React Router 7, Tailwind CSS 4, Vite |
| API | Node 22, Express 5, Mongoose 9, Zod |
| Database | MongoDB (Atlas in production) |

## Run locally

You need Node 22+ and a MongoDB connection string (Atlas, or a local `mongodb://127.0.0.1:27017/todo`).

```bash
# API: http://localhost:4000
cd server
cp .env.example .env      # set MONGODB_URI
npm install
npm run dev

# Client: http://localhost:5173 (in a second terminal)
cd client
cp .env.example .env      # API_URL=http://localhost:4000
npm install
npm run dev
```

## API

Base URL: `/api/tasks`. Dates are ISO 8601 date-times with a time zone, for example `2026-11-14T10:00:00+05:30`.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks sorted by start time. Optional filters: `search` (3+ characters), `status`, `priority`, `from` (inclusive), `to` (exclusive) |
| `GET` | `/api/tasks/weekly-summary?tz=Asia/Kolkata` | Open / completed counts per Monday–Sunday week, in the caller's time zone |
| `GET` | `/api/tasks/:id` | One task |
| `POST` | `/api/tasks` | Create: `title` and `startsAt` are required; `description`, `endsAt`, `priority`, `status` are optional |
| `PATCH` | `/api/tasks/:id` | Update any of the fields above |
| `DELETE` | `/api/tasks/:id` | Delete |
| `GET` | `/health` | Health check |

Validation errors return `400` with `{ "error": "Validation failed", "details": [{ "field", "message" }] }`.

## Deploy

**API** (Render, Railway or any Node host):
- Root directory `server`, build command `npm install`, start command `npm start`.
- Environment variables: `MONGODB_URI` (Atlas connection string), and `CORS_ORIGIN` set to the Netlify site URL (comma-separate several).
- Most hosts set `PORT` themselves.

**Client** (Netlify): connect the repository with base directory `client`, build command `npm run build` and publish directory `client/dist`. Add the environment variable `API_URL` with the API's URL, then deploy. `client/public/_redirects` sends every route to the app, so refreshing `/tasks` works.
