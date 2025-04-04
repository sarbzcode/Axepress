# **Axepress**

Axepress is a centralized digital noticeboard designed for the Acadia University community, where students can view upcoming events, club announcements, and important notices in real-time. It provides a responsive and user-friendly web platform, allowing students and administrators to interact with event content seamlessly.

---

## **Table of Contents**
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation Instructions](#installation-instructions)
- [User Documentation](#user-documentation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributors](#contributors)
- [License](#license)

---

## **Project Overview**

Axepress is a digital noticeboard and event manager designed to replace physical posters and scattered social media posts. The platform consolidates all important announcements in one place, ensuring that the Acadia community can stay informed about campus events and notices. 

---

## **Technologies Used**

- **Frontend**:
  - **React.js**: For building dynamic user interfaces.
  - **Vite**: A build tool that enables fast development with hot reloading.
  - **CSS Modules**: For scoped and modular styling.

- **Backend**:
  - **Node.js**: JavaScript runtime for server-side development.
  - **Express.js**: Web framework for building RESTful APIs.

- **Database**:
  - **PostgreSQL**: For storing structured event and user data.

---

## **Installation Instructions**

To set up the Axepress application locally, follow the steps below:

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (v14 or later)
- **PostgreSQL** (for the database)

### **Steps**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sarbzcode/Axepress.git
   cd Axepress
   ```bash

2. **Install frontend dependencies:** Navigate to the frontend directory and install dependencies:
    ```bash
    cd frontend
    npm install
    ```bash

3. **Install backend dependencies:** Navigate to the backend directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```bash

4. **Set up PostgreSQL:**
- Create a PostgreSQL database.
- Update the database configuration file in the backend with your PostgreSQL credentials.

5. **Start the frontend:** In the frontend directory, run the following command to start the development server:
    ```bash
    npm run dev
    ```bash

6. **Start the backend:** In the backend directory, run the following command to start the server:
    ```bash
    node server.js
    ```bash

7. **Access the application:** Open your browser and go to http://localhost:5000 to access the application.

## **User Documentation**
### **For Admins:**
1. **Login:**
- Admins can log in using an invitation code. This ensures only authorized personnel can manage events.

2. **Managing Events:**
- Admins can create, edit, and delete events through the admin dashboard.
- Events will be displayed on the homepage and can be clicked for more details.

### **For Users:**
1. **Viewing Events:**
- Users can browse upcoming 5 events and 5 recent notices on the homepage, which displays cards with key information.
- Clicking on an event or notice card takes the user to a detailed page with more information.

2. **Event Interaction:**
- Users can add events to their Google Calendar directly via the "Add to Calendar" button on each event's page.

## **Contributors**
- **Melita Leonie Pereira**
- **Sarbjot Singh**
- **Vishu Vishu**