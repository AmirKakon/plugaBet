# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Application Overview

This application, named "פלוגה ב", is designed to manage equipment handover between shifts. It provides functionalities for administrators to create equipment lists and for regular users to acknowledge the state of the equipment at the start of their shift. The application also offers data summary capabilities to track equipment history.

### Core Features

- **Form Creation:** Administrators can create forms to list equipment for each shift swap.
- **Form Signing:** Regular users can sign the form at the beginning of their shift to acknowledge the status of the equipment.
- **User Authentication:** The application controls access to sensitive documents and administrative functionalities through user authentication.
- **Data Summary:** The application can generate summaries showing overall and item-by-item shift history for all equipment.

### Required Backend Endpoints

To support the frontend functionalities, the following backend endpoints will be required:

- **Authentication:**
  - `POST /api/auth/login`: Endpoint for user login.
- **Tasks:**
  - `GET /api/tasks`: Endpoint to get all tasks.
  - `GET /api/tasks/:taskId/items`: Endpoint to get all items of the task for the form.
- **Form Management:**
  - `POST /api/forms`: Endpoint to create a new equipment form.
  - `GET /api/forms`: Endpoint to retrieve all forms or specific forms based on query parameters (e.g., by date, shift).
  - `GET /api/forms/:id`: Endpoint to retrieve a specific form by ID.
- **Data Summary:**
  - `GET /api/summary`: Endpoint to retrieve summarized equipment history data.

To get started, take a look at src/app/page.tsx.
