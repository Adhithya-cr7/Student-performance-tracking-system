# Student-performance-tracking-system
 Gamified Student Performance Tracker
# Gamified Student Performance Tracking System

> A web application that transforms academic tracking into an engaging and motivational game for students.

This project was developed for a 2nd-semester Digital System and Design course to explore how gamification can be applied to improve student engagement. It's a client-side web application that allows students to log in, track their academic performance (marks, attendance), and see their progress visualized through game-like elements such as Experience Points (XP), levels, and leaderboards.

---

### Key Features

* **Personalized Dashboard**: Upon logging in, students are greeted with a comprehensive dashboard showing their subject-wise marks, attendance percentage, and a detailed XP breakdown.
* **Dynamic Leaderboard**: To foster healthy competition, the application features a dynamic leaderboard that automatically calculates the total XP for all students and ranks them from highest to lowest.
* **Dynamic XP System**: The core of the application is its Experience Point system. A student's total XP is calculated based on their base XP from the data file, with added bonuses for high attendance and other activities.
* **Booster Store & Rewards**: Students can spend their hard-earned XP in the "Boosters" store to purchase in-game rewards, such as an "XP Booster" that temporarily doubles XP gain.
* **Skill Development Tracker**: A unique page allows students to self-report and track their progress in various skills (e.g., Communication, Coding), earning additional XP for self-improvement.
* **User Authentication & Session**: The system includes a secure login page that verifies user credentials against student data. It uses `localStorage` to maintain the user's session across different pages.
* **Dark Mode**: A user-friendly dark mode toggle is available on every page for better viewing comfort.

---

### Tech Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Data Format**: JSON
* **State Management**: Browser LocalStorage API

---

### Getting Started

This project uses the `fetch` API to load student data from `students_data.json`. Due to browser security policies (CORS), you **cannot** run the `.html` files by opening them directly. The project must be served by a local web server.

#### **How to Run**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your-repo-name
    ```
3.  **Serve the files using one of the following methods:**

    **Option A: Using VS Code Live Server (Recommended)**
    1.  Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
    2.  Right-click on `login.html` and select "Open with Live Server".

    **Option B: Using Python's Built-in Server**
    1.  Make sure you have Python installed on your system.
    2.  Run the command below in your terminal:
        ```sh
        python -m http.server
        ```
    3.  Open your browser and navigate to `http://localhost:8000/login.html`.

---

### Usage

Once the application is running, you can log in with sample credentials from the `students_data.json` file:

* **Username:** `STU001` | **Password:** `pass1`
* **Username:** `STU002` | **Password:** `pass2`
* **Username:** `STU003` | **Password:** `pass3`

---
### Contributing

Contributions are welcome! If you'd like to improve the project, please follow these steps:

1.  **Fork the Repository**: Create your own copy of the project.
2.  **Create a Feature Branch**: Make a new branch for your changes (`git checkout -b feature/AmazingFeature`).
3.  **Commit Your Changes**: Add your changes with a clear commit message (`git commit -m 'Add some AmazingFeature'`).
4.  **Push to the Branch**: Push your changes to your forked repository (`git push origin feature/AmazingFeature`).
5.  **Open a Pull Request**: Submit a pull request to the original repository for review.
