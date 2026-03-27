# Job Search Web Application

A Flask web application for searching and saving jobs, with SQLite database storage.

## Features

- Search jobs by title, keyword, or skill
- Filter by location, salary range, and experience level (Junior/Mid/Senior)
- Save/unsave jobs with database persistence
- Dedicated saved jobs page
- Modern responsive UI with mobile breakpoints at 768px and 480px
- 40 sample job records seeded on first run

## Requirements

- Python 3.8+

## Setup & Run

### 1. Install dependencies

```bash
cd job-search-app
pip install -r requirements.txt
```

### 2. Run the application

**Development:**

```bash
python app.py
```

The app starts at `http://localhost:5000` by default.

**Production (with Gunicorn):**

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

### 3. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the server listens on |
| `FLASK_DEBUG` | `true` | Enable/disable debug mode (`true`, `1`, `yes` to enable) |

### 4. Access the app

- **Home / Search:** `http://localhost:5000/`
- **Saved Jobs:** `http://localhost:5000/saved`

## Project Structure

```
job-search-app/
  app.py              # Flask application (routes, DB init, sample data)
  requirements.txt    # Python dependencies
  jobs.db             # SQLite database (auto-created on first run)
  static/
    style.css         # Stylesheet
  templates/
    index.html        # Search page template
    saved.html        # Saved jobs page template
```

## Notes

- The SQLite database (`jobs.db`) is created automatically on first run with 40 sample jobs.
- If you need to reset the data, delete `jobs.db` and restart the app.
- The app binds to `0.0.0.0` so it is accessible from external hosts when deployed.
