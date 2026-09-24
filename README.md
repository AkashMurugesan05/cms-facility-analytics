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



## Project Structure

cms-facility-analytics/
├── Api/
│   ├── main.py
│   └── .env.example
├── Database/
│   └── cms_schema.sql
├── Data/
│   └── v4.py
├── Js/
├── Newsletter/
│   ├── css/
│   ├── samples/
│   ├── generate_newsletter.py
│   └── template.html
├── css/
├── screenshots/
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
└── README.md



## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **Data Processing:** Python, Pandas, OpenPyXL
- **Reporting:** HTML/CSS, Python-based PDF generation
- **AI Integration:** Gemini API
- **API Architecture:** REST APIs


- **Reporting:** HTML/CSS, Python-based PDF generation
- **AI Integration:** Gemini API
- **API Architecture:** REST APIs