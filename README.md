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

```text
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
