# CMS Healthcare Facility Analytics Platform

A full-stack healthcare facility analytics platform designed to transform CMS facility data into interactive dashboards, comparative analytics, operational insights, and automated executive reporting.

## Project Overview

This project combines data processing, database management, backend API development, frontend dashboards, and automated reporting into a single analytics platform.

The application allows users to search and analyze healthcare facilities and explore areas such as:

- Overall facility ratings
- Staffing and staffing trends
- Quality measures
- Health inspections
- Long-stay performance
- Short-stay performance
- Facility comparisons
- State and national benchmarks
- Executive-level analytics
- Automated executive report generation

## Business Problem

Healthcare facility data is available across multiple datasets and performance categories, making it difficult to analyze facility performance from a single view.

This project addresses that problem by bringing facility-level data into a centralized analytics platform that enables users to:

- Search and identify healthcare facilities
- Review facility performance across multiple categories
- Compare facility results with state and national benchmarks
- Analyze staffing, quality, inspection, and stay-related metrics
- Identify areas requiring operational attention
- Generate executive-level reports for periodic review

## Key Features

### Facility Discovery

- Search healthcare facilities by facility information
- View facility-level performance and statistics
- Access facility-specific analytics through a centralized interface

### Performance Analytics

- Overall facility performance analysis
- Quality measure analysis
- Staffing analysis and trends
- Health inspection and compliance analysis
- Long-stay and short-stay performance analysis
- Facility-level historical analysis

### Comparative Analytics

- Facility-to-facility comparison
- State-level benchmarking
- National benchmarking
- Performance trend analysis

### Executive Reporting

- Automated executive-level reporting
- HTML-based newsletter templates
- PDF report generation
- Facility performance summaries and key metrics

## Analytics Architecture

```text
CMS / Raw Data
      ↓
Python Data Processing
      ↓
PostgreSQL Database
      ↓
FastAPI Backend
      ↓
REST APIs
      ↓
JavaScript Dashboard
      ↓
Interactive Analytics
      ↓
Executive Reporting / PDF
```

## Data Pipeline

The platform follows a structured data processing and analytics pipeline:

```text
CMS / Raw Facility Data
        ↓
Python Data Processing
        ↓
Data Cleaning & Transformation
        ↓
PostgreSQL Database
        ↓
FastAPI REST API
        ↓
JavaScript Frontend
        ↓
Interactive Facility Analytics
        ↓
Executive Reporting & PDF Generation
```

The data pipeline separates data ingestion, storage, backend processing, frontend visualization, and executive reporting into distinct stages.

## Backend & API

The backend is developed using Python and FastAPI and provides REST API endpoints for the frontend analytics modules.

The API layer handles:

- Facility search and retrieval
- Facility summary information
- Historical performance data
- Staffing analytics
- Quality measure data
- Health inspection data
- Facility comparisons
- State and national benchmark data
- Executive reporting data

The frontend JavaScript modules consume these API endpoints to display interactive facility analytics.

## Automated Executive Reporting

The platform includes an automated reporting workflow that converts facility analytics into executive-friendly reports.

The reporting workflow includes:

- Facility performance summaries
- Key operational and quality metrics
- Staffing and compliance insights
- Trend-based observations
- HTML newsletter generation
- PDF report generation
- AI-assisted content generation using the Gemini API
- Reusable HTML and CSS report templates

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **Data Processing:** Python, Pandas, OpenPyXL
- **Reporting:** HTML/CSS, Python-based PDF generation
- **AI Integration:** Gemini API
- **API Architecture:** REST APIs

## Database

The project uses PostgreSQL as the central data storage layer.

The database schema contains structured datasets and analytical views supporting areas such as:

- Facility performance
- Staffing
- Quality measures
- Health inspections
- Ownership
- Penalties
- State and national averages
- Survey information
- Skilled nursing facility performance

The database layer provides the foundation for the FastAPI backend and dashboard analytics.

## Dashboard Modules

The frontend provides dedicated analytics interfaces for different areas of facility performance, including:

- Facility Search
- Facility Executive Dashboard
- Facility Star Rating
- Quality Measures
- Health Inspection
- Long-Stay Analysis
- Short-Stay Analysis
- Staffing Analysis

## Screenshots

### Provider Discovery

![Provider Discovery](screenshots/provider-discovery.png)

### Facility Executive Dashboard

![Facility Dashboard](screenshots/facility-dashboard.png)

### Quality Measures

![Quality Measures](screenshots/quality-measures.png)

### Long-Stay Analysis

![Long-Stay Analysis](screenshots/long-stay-analysis.png)

### Short-Stay Analysis

![Short-Stay Analysis](screenshots/short-stay-analysis.png)

### Staffing Analysis

![Staffing Analysis](screenshots/staffing-analysis.png)

### Health Inspection

![Health Inspection](screenshots/health-inspection.png)

## Project Structure

```text
cms-facility-analytics/
│
├── Api/
│   ├── main.py
│   └── .env.example
│
├── Database/
│   └── cms_schema.sql
│
├── Data/
│   └── v4.py
│
├── Js/
│   ├── facility.js
│   ├── facilitystarrating.js
│   ├── healthispection.js
│   ├── longstay.js
│   ├── qualitymeasures.js
│   ├── search.js
│   ├── shortstay.js
│   └── staffing.js
│
├── Newsletter/
│   ├── css/
│   │   └── style.css
│   ├── samples/
│   │   ├── Executive_Newsletter_015009.pdf
│   │   ├── Executive_Newsletter_015019.pdf
│   │   └── Executive_Newsletter_145696.pdf
│   ├── generate_newsletter.py
│   └── template.html
│
├── css/
│   └── style.css
│
├── screenshots/
│   ├── provider-discovery.png
│   ├── facility-dashboard.png
│   ├── quality-measures.png
│   ├── long-stay-analysis.png
│   ├── short-stay-analysis.png
│   ├── staffing-analysis.png
│   └── health-inspection.png
│
├── facility.html
├── facilitystarrating.html
├── healthispection.html
├── longstay.html
├── qualitymeasures.html
├── search.html
├── shortstay.html
├── staffing.html
├── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

## Setup Overview

### 1. Clone the repository

```bash
git clone https://github.com/AkashMurugesan05/cms-facility-analytics.git
cd cms-facility-analytics
```

### 2. Create a Python virtual environment

```bash
python -m venv venv
```

Activate the environment according to your operating system.

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a local `.env` file using `.env.example` as a reference.

Database credentials and API keys should be stored in environment variables and should not be committed to the repository.

### 5. Configure PostgreSQL

Create the required PostgreSQL database and apply the schema from:

```text
Database/cms_schema.sql
```

### 6. Start the FastAPI backend

```bash
uvicorn Api.main:app --reload
```

The frontend can then communicate with the FastAPI REST endpoints.

## Security

Sensitive credentials such as:

- Database passwords
- API keys
- Environment-specific configuration

should be stored in environment variables and excluded from version control using `.gitignore`.

## Portfolio Version Notice

This repository contains an earlier development/portfolio version of the CMS Analytics Platform. The production implementation evolved beyond this version with additional functionality, refinements and modifications.

Some components in this repository may therefore differ from the current implementation. The repository is provided to demonstrate the architecture, technologies, analytics workflow, and development approach used during the project.

## Project Focus

This project demonstrates practical experience in:

- Data processing
- Data cleaning and transformation
- SQL and PostgreSQL
- REST API development
- Dashboard development
- KPI and performance analytics
- Comparative benchmarking
- Automated reporting
- PDF report generation
- AI API integration
- Full-stack analytics workflow