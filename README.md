# Secure AI Development: Applying DevSecOps Methodologies to an AI-Powered Application


## Project Overview

This project implements a secure AI chat application using OpenAI's API, following DevSecOps principles. It showcases the integration of various tools and technologies to create a robust, secure, and automated software development lifecycle.

## Features

- AI-powered chat interface using OpenAI's GPT-3.5 API
- User authentication and profile management
- Personalized fitness and nutrition plan generation
- Secure development pipeline with continuous integration and deployment (CI/CD)
- Comprehensive security scanning and monitoring

## Technologies Used

### Backend
- Python
- Flask
- SQLite

### Frontend
- HTML
- CSS
- JavaScript

### DevOps
- Jenkins
- GitLab
- Docker
- Kubernetes

### Security
- SonarQube
- Snyk
- Trivy
- OWASP ZAP

### Monitoring
- Prometheus
- Grafana

### Cloud
- Amazon Web Services (AWS)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     SECRET_KEY=your_secret_key
     ```

4. Initialize the database:
   ```bash
   python init_db.py
   ```

5. Start the Flask application:
   ```bash
   python server.py
   ```

## DevSecOps Implementation

### CI/CD Pipeline
The project uses Jenkins for continuous integration and deployment. The pipeline includes the following stages:

1. Workspace Preparation
2. Dependency Installation
3. Static Code Analysis (SonarQube)
4. Security Scanning (Snyk, Trivy)
5. Containerization (Docker)
6. Deployment (Kubernetes)
7. Dynamic Application Security Testing (OWASP ZAP)

### Security Integration
- OWASP ZAP for dynamic application security testing
- SonarQube for static code analysis
- Snyk and Trivy for vulnerability scanning
- Secure secret management using Kubernetes Secrets

### Containerization and Orchestration
- Docker for containerization
- Kubernetes for container orchestration and deployment

### Monitoring and Observability
- Prometheus for metrics collection
- Grafana for visualization of metrics and application health

## Project Structure

### Backend Files
- `server.py`: Main Flask application
- `response_generator.py`: Handles interaction with OpenAI API
- `secret_key_gen.py`: Generates secure secret keys
- `print_users.py`: Utility for querying user data

### Frontend Files
- `index.html`: Home page
- `sign_up.html`: User registration page
- `profile.html`: User profile page
- JavaScript files:
  - `common.js`: Handles success messages
  - `fitness_form.js`: Manages fitness form submission
  - `login.js`: Handles user login
  - `multi_step_form.js`: Manages multi-step registration form
  - `script.js`: Combines various frontend functionalities

## Usage

After setting up the application:

1. Navigate to the home page
2. Sign up for a new account or log in
3. Use the chat interface to generate personalized fitness and nutrition plans



