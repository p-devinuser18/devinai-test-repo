import sqlite3
import os

from flask import Flask, render_template, request

app = Flask(__name__)
DATABASE = os.path.join(os.path.dirname(__file__), "jobs.db")


def get_db():
    """Open a new database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the jobs table and insert sample data if the table is empty."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            salary_min INTEGER NOT NULL,
            salary_max INTEGER NOT NULL,
            experience TEXT NOT NULL
        )
    """
    )

    cursor.execute("SELECT COUNT(*) FROM jobs")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_jobs = [
            ("Software Engineer", "Google", "Mountain View, CA", 120000, 180000, "Mid"),
            ("Frontend Developer", "Meta", "Menlo Park, CA", 110000, 170000, "Mid"),
            ("Backend Developer", "Amazon", "Seattle, WA", 115000, 175000, "Mid"),
            ("Data Scientist", "Netflix", "Los Gatos, CA", 130000, 200000, "Senior"),
            ("DevOps Engineer", "Microsoft", "Redmond, WA", 105000, 160000, "Mid"),
            ("Full Stack Developer", "Apple", "Cupertino, CA", 125000, 190000, "Senior"),
            ("Junior Developer", "Shopify", "Ottawa, ON", 60000, 85000, "Junior"),
            ("Machine Learning Engineer", "OpenAI", "San Francisco, CA", 150000, 250000, "Senior"),
            ("QA Engineer", "Spotify", "New York, NY", 90000, 130000, "Mid"),
            ("Cloud Architect", "AWS", "Arlington, VA", 140000, 220000, "Senior"),
            ("Mobile Developer", "Uber", "San Francisco, CA", 120000, 185000, "Mid"),
            ("Systems Engineer", "Tesla", "Austin, TX", 100000, 155000, "Mid"),
            ("Product Manager", "Stripe", "San Francisco, CA", 135000, 210000, "Senior"),
            ("Junior Data Analyst", "IBM", "New York, NY", 55000, 80000, "Junior"),
            ("Security Engineer", "CrowdStrike", "Austin, TX", 110000, 175000, "Mid"),
            ("Site Reliability Engineer", "LinkedIn", "Sunnyvale, CA", 130000, 195000, "Senior"),
            ("Junior Frontend Developer", "HubSpot", "Cambridge, MA", 65000, 90000, "Junior"),
            ("Database Administrator", "Oracle", "Redwood City, CA", 100000, 155000, "Mid"),
            ("AI Research Scientist", "DeepMind", "London, UK", 140000, 230000, "Senior"),
            ("Technical Writer", "Atlassian", "San Francisco, CA", 80000, 120000, "Junior"),
        ]

        cursor.executemany(
            "INSERT INTO jobs (title, company, location, salary_min, salary_max, experience) VALUES (?, ?, ?, ?, ?, ?)",
            sample_jobs,
        )

    conn.commit()
    conn.close()


@app.route("/")
def index():
    """Render the job search page with optional filters."""
    conn = get_db()
    cursor = conn.cursor()

    keyword = request.args.get("keyword", "").strip()
    location = request.args.get("location", "").strip()
    salary_min = request.args.get("salary_min", "").strip()
    salary_max = request.args.get("salary_max", "").strip()
    experience = request.args.get("experience", "").strip()

    query = "SELECT * FROM jobs WHERE 1=1"
    params = []

    if keyword:
        query += " AND title LIKE ?"
        params.append(f"%{keyword}%")

    if location:
        query += " AND location LIKE ?"
        params.append(f"%{location}%")

    if salary_min:
        query += " AND salary_max >= ?"
        params.append(int(salary_min))

    if salary_max:
        query += " AND salary_min <= ?"
        params.append(int(salary_max))

    if experience:
        query += " AND experience = ?"
        params.append(experience)

    query += " ORDER BY salary_max DESC"

    cursor.execute(query, params)
    jobs = cursor.fetchall()

    # Get distinct locations for the filter dropdown
    cursor.execute("SELECT DISTINCT location FROM jobs ORDER BY location")
    locations = [row["location"] for row in cursor.fetchall()]

    conn.close()

    return render_template(
        "index.html",
        jobs=jobs,
        locations=locations,
        keyword=keyword,
        selected_location=location,
        salary_min=salary_min,
        salary_max=salary_max,
        selected_experience=experience,
    )


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
