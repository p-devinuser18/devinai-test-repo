import sqlite3
import os

from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)
DATABASE = os.path.join(os.path.dirname(__file__), "jobs.db")


def get_db():
    """Open a new database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables and insert sample data if the jobs table is empty."""
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
            experience TEXT NOT NULL,
            skills TEXT NOT NULL DEFAULT ''
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL UNIQUE,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs (id)
        )
    """
    )

    cursor.execute("SELECT COUNT(*) FROM jobs")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_jobs = [
            # US - West Coast
            ("Software Engineer", "Google", "Mountain View, CA", 120000, 180000, "Mid", "Python, Java, Go, Cloud"),
            ("Frontend Developer", "Meta", "Menlo Park, CA", 110000, 170000, "Mid", "React, TypeScript, CSS, GraphQL"),
            ("Machine Learning Engineer", "OpenAI", "San Francisco, CA", 150000, 250000, "Senior", "Python, PyTorch, TensorFlow, MLOps"),
            ("Full Stack Developer", "Apple", "Cupertino, CA", 125000, 190000, "Senior", "Swift, React, Node.js, AWS"),
            ("Mobile Developer", "Uber", "San Francisco, CA", 120000, 185000, "Mid", "Kotlin, Swift, React Native, Firebase"),
            ("Product Manager", "Stripe", "San Francisco, CA", 135000, 210000, "Senior", "SQL, Analytics, Agile, Strategy"),
            ("Site Reliability Engineer", "LinkedIn", "Sunnyvale, CA", 130000, 195000, "Senior", "Kubernetes, Terraform, Python, AWS"),
            ("Database Administrator", "Oracle", "Redwood City, CA", 100000, 155000, "Mid", "Oracle DB, SQL, PL/SQL, Linux"),
            ("Technical Writer", "Atlassian", "San Francisco, CA", 80000, 120000, "Junior", "Markdown, Git, API Docs, Jira"),
            ("UX Designer", "Pinterest", "San Francisco, CA", 115000, 170000, "Mid", "Figma, Sketch, User Research, Prototyping"),
            # US - Pacific Northwest
            ("Backend Developer", "Amazon", "Seattle, WA", 115000, 175000, "Mid", "Java, AWS, DynamoDB, Microservices"),
            ("DevOps Engineer", "Microsoft", "Redmond, WA", 105000, 160000, "Mid", "Azure, Docker, Kubernetes, CI/CD"),
            ("Data Engineer", "Snowflake", "Seattle, WA", 130000, 195000, "Senior", "SQL, Python, Spark, dbt"),
            ("Cloud Solutions Architect", "AWS", "Seattle, WA", 145000, 225000, "Senior", "AWS, Terraform, Python, Networking"),
            # US - Texas
            ("Systems Engineer", "Tesla", "Austin, TX", 100000, 155000, "Mid", "Linux, Python, C++, Networking"),
            ("Security Engineer", "CrowdStrike", "Austin, TX", 110000, 175000, "Mid", "Cybersecurity, SIEM, Python, Cloud Security"),
            ("Embedded Software Engineer", "Dell", "Austin, TX", 95000, 145000, "Mid", "C, C++, RTOS, Embedded Linux"),
            ("Junior QA Tester", "Indeed", "Austin, TX", 55000, 78000, "Junior", "Selenium, Python, JIRA, Manual Testing"),
            # US - East Coast
            ("QA Engineer", "Spotify", "New York, NY", 90000, 130000, "Mid", "Selenium, Python, CI/CD, Automation"),
            ("Junior Data Analyst", "IBM", "New York, NY", 55000, 80000, "Junior", "SQL, Excel, Python, Tableau"),
            ("Investment Banking Analyst", "Goldman Sachs", "New York, NY", 100000, 150000, "Junior", "Excel, Financial Modeling, SQL, VBA"),
            ("Marketing Data Scientist", "Spotify", "New York, NY", 120000, 180000, "Mid", "Python, R, SQL, A/B Testing"),
            ("Blockchain Developer", "ConsenSys", "Brooklyn, NY", 130000, 200000, "Senior", "Solidity, Ethereum, TypeScript, Web3"),
            ("Junior Frontend Developer", "HubSpot", "Cambridge, MA", 65000, 90000, "Junior", "HTML, CSS, JavaScript, React"),
            ("Robotics Engineer", "Boston Dynamics", "Waltham, MA", 120000, 180000, "Senior", "C++, ROS, Python, Computer Vision"),
            ("Cloud Architect", "AWS", "Arlington, VA", 140000, 220000, "Senior", "AWS, CloudFormation, Python, Networking"),
            # US - Other
            ("Junior Developer", "Shopify", "Remote, US", 60000, 85000, "Junior", "Ruby, Rails, JavaScript, Git"),
            ("Data Scientist", "Netflix", "Los Gatos, CA", 130000, 200000, "Senior", "Python, R, SQL, Machine Learning"),
            ("iOS Developer", "Lyft", "Nashville, TN", 105000, 160000, "Mid", "Swift, UIKit, SwiftUI, Xcode"),
            ("Game Developer", "Epic Games", "Cary, NC", 95000, 150000, "Mid", "C++, Unreal Engine, 3D Math, GPU Programming"),
            # International - Europe
            ("AI Research Scientist", "DeepMind", "London, UK", 140000, 230000, "Senior", "Python, TensorFlow, Research, Statistics"),
            ("Full Stack Engineer", "Revolut", "London, UK", 85000, 130000, "Mid", "Java, React, PostgreSQL, Microservices"),
            ("Backend Engineer", "Spotify", "Stockholm, Sweden", 80000, 125000, "Mid", "Java, Spring Boot, Kafka, GCP"),
            ("DevOps Lead", "SAP", "Berlin, Germany", 90000, 140000, "Senior", "Kubernetes, Jenkins, AWS, Ansible"),
            ("Junior Python Developer", "Booking.com", "Amsterdam, Netherlands", 50000, 75000, "Junior", "Python, Django, PostgreSQL, REST APIs"),
            # International - Asia & Other
            ("Software Architect", "Grab", "Singapore", 110000, 170000, "Senior", "Java, Microservices, AWS, System Design"),
            ("Frontend Lead", "Mercari", "Tokyo, Japan", 90000, 145000, "Senior", "TypeScript, React, Next.js, GraphQL"),
            ("Data Analyst", "Flipkart", "Bangalore, India", 30000, 55000, "Junior", "SQL, Python, Excel, Power BI"),
            ("Platform Engineer", "Canva", "Sydney, Australia", 100000, 155000, "Mid", "Go, Kubernetes, Terraform, AWS"),
            ("Cybersecurity Analyst", "Kaspersky", "Dubai, UAE", 85000, 135000, "Mid", "Threat Analysis, SIEM, Python, Forensics"),
        ]

        cursor.executemany(
            "INSERT INTO jobs (title, company, location, salary_min, salary_max, experience, skills) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
        query += " AND (title LIKE ? OR skills LIKE ?)"
        params.append(f"%{keyword}%")
        params.append(f"%{keyword}%")

    if location:
        query += " AND location LIKE ?"
        params.append(f"%{location}%")

    if salary_min:
        try:
            val = int(salary_min)
            query += " AND salary_max >= ?"
            params.append(val)
        except ValueError:
            pass

    if salary_max:
        try:
            val = int(salary_max)
            query += " AND salary_min <= ?"
            params.append(val)
        except ValueError:
            pass

    if experience:
        query += " AND experience = ?"
        params.append(experience)

    query += " ORDER BY salary_max DESC"

    cursor.execute(query, params)
    jobs = cursor.fetchall()

    # Get distinct locations for the filter dropdown
    cursor.execute("SELECT DISTINCT location FROM jobs ORDER BY location")
    locations = [row["location"] for row in cursor.fetchall()]

    # Get saved job IDs
    cursor.execute("SELECT job_id FROM saved_jobs")
    saved_ids = {row["job_id"] for row in cursor.fetchall()}

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
        saved_ids=saved_ids,
    )


@app.route("/save/<int:job_id>", methods=["POST"])
def save_job(job_id):
    """Save a job to the saved_jobs table."""
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO saved_jobs (job_id) VALUES (?)", (job_id,))
        conn.commit()
    except sqlite3.IntegrityError:
        pass
    conn.close()

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify({"status": "saved", "job_id": job_id})

    return redirect(request.referrer or url_for("index"))


@app.route("/unsave/<int:job_id>", methods=["POST"])
def unsave_job(job_id):
    """Remove a job from the saved_jobs table."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_jobs WHERE job_id = ?", (job_id,))
    conn.commit()
    conn.close()

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify({"status": "unsaved", "job_id": job_id})

    return redirect(request.referrer or url_for("index"))


@app.route("/saved")
def saved_jobs():
    """Render the saved jobs page."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT j.*, s.saved_at
        FROM jobs j
        JOIN saved_jobs s ON j.id = s.job_id
        ORDER BY s.saved_at DESC
    """
    )
    jobs = cursor.fetchall()
    conn.close()

    return render_template("saved.html", jobs=jobs)


init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() in ("true", "1", "yes")
    app.run(debug=debug, host="0.0.0.0", port=port)
