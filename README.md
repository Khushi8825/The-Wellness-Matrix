# Wellness Matrix

Wellness Matrix is a health monitoring and risk assessment application that helps users track their daily health vitals and gain insights into their overall wellness. The platform visualizes health data through interactive graphs and identifies potential health risks based on trends in the recorded vitals.

## Overview

Maintaining good health requires consistent monitoring of key body metrics. Wellness Matrix allows users to record daily vital signs and view their health patterns over time. By analyzing these trends, the application provides risk indicators that help users become more aware of potential health concerns.

## Features

### Daily Health Tracking

* Record daily health vitals.
* Maintain a history of health records.
* Monitor changes over time.

### Vital Parameters

The application can track:

* Heart Rate
* Blood Pressure
* Body Temperature
* Blood Oxygen (SpO₂)
* Weight
* BMI
* Other custom health metrics

### Data Visualization

* Interactive graphs and charts.
* Trend analysis of health parameters.
* Easy-to-understand visual representation of health data.

### Health Risk Assessment

* Analyze recorded vitals.
* Detect abnormal patterns.
* Generate health risk indicators based on tracked data.

### User-Friendly Dashboard

* Centralized view of all health metrics.
* Quick access to recent records and trends.

## Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Visualization

* Chart.js / Recharts

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/wellness-matrix.git
```

2. Navigate to the project folder

```bash
cd wellness-matrix
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

5. Start the application

```bash
npm run dev
```

## How It Works

1. Users enter their daily health vitals.
2. Data is securely stored in the database.
3. The system generates graphical representations of health trends.
4. Risk analysis algorithms evaluate the data.
5. Users receive insights about potential health risks and wellness patterns.

## Future Enhancements

* AI-powered health recommendations
* Wearable device integration
* Health report generation (PDF)
* Email/SMS health alerts
* Personalized fitness suggestions
* Doctor consultation integration

## Project Status

🚧 Development Project — Currently running locally and not yet deployed.

## Disclaimer

This application is intended for educational and informational purposes only. It does not replace professional medical advice, diagnosis, or treatment.

## License

This project is licensed under the MIT License.
