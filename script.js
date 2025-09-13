document.addEventListener("DOMContentLoaded", () => {
    initializeApp();

    const path = window.location.pathname;
    if (path.includes("login.html")) {
        setupLoginPage();
    } else if (path.includes("dashboard.html")) {
        setupDashboardPage();
    } else if (path.includes("index.html")) {
        setupHomePage();
    } else if (path.includes("skills.html")) {
        setupSkillsPage();
    } else if (path.includes("boosters.html")) {
        setupBoostersPage();
    } else if (path.includes("leaderboard.html")) {
        setupLeaderboardPage();
    }
});

let gameState = {};

function loadGameState() {
    const state = JSON.parse(localStorage.getItem("gameState"));
    if (state && state.user) {
        gameState = state;
    } else {
        logout();
    }
}

function saveGameState() {
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function initializeApp() {
    const protectedPages = ["index.html", "dashboard.html", "skills.html", "boosters.html", "leaderboard.html"];
    if (protectedPages.some(page => window.location.pathname.includes(page))) {
        if (!localStorage.getItem("gameState")) {
            window.location.href = "login.html";
            return;
        }
        loadGameState();
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.removeItem('darkMode');
            }
        });
    }
    
    updateXPDisplay();
}

function updateXPDisplay() {
    const xpDisplay = document.querySelector("#xp-display");
    if (xpDisplay && gameState.totalXP !== undefined) {
        xpDisplay.textContent = `XP: ${Math.floor(gameState.totalXP)}`;
    } else if (xpDisplay) {
        xpDisplay.textContent = "XP: 0";
    }
}

function calculateTotalXP(student) {
    const baseXpFromJson = student.xp;
    const attendanceXP = student.attendance * 5;
    const extraActivitiesXP = 500;

    return baseXpFromJson + attendanceXP + extraActivitiesXP;
}

async function setupLoginPage() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;

    try {
        const response = await fetch("students_data.json");
        const studentsData = await response.json();

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const student = studentsData.students.find(
                (s) => s.registration_number === username && s.password === password
            );

            if (student) {
                gameState = {
                    user: student,
                    totalXP: calculateTotalXP(student),
                    skills: {
                        Communication: 0,
                        Coding: 0,
                        Leadership: 0,
                        Teamwork: 0,
                        Creativity: 0
                    },
                    boosters: {
                        xpBoost: {
                            active: false,
                            expiresAt: null
                        }
                    }
                };
                saveGameState();
                window.location.href = "index.html";
            } else {
                document.getElementById("error-msg").textContent = "Invalid Username or Password";
            }
        });
    } catch (error) {
        console.error("Failed to load student data:", error);
        document.getElementById("error-msg").textContent = "Error loading application data. Please try again later.";
    }
}

function setupDashboardPage() {
    document.getElementById("student-name").textContent = gameState.user.name;
    document.getElementById("total-xp").textContent = `${Math.floor(gameState.totalXP)} XP`;
    document.getElementById("attendance").textContent = `${gameState.user.attendance}%`;

    const subjectTableBody = document.getElementById("subject-table-body");
    const xpBreakdownBody = document.getElementById("xp-breakdown");
    subjectTableBody.innerHTML = "";
    xpBreakdownBody.innerHTML = "";

    let totalMarksXP = 0;
    Object.entries(gameState.user.marks).forEach(([subject, scores]) => {
        const xpFromMarks = scores.cat1 + scores.cat2 + scores.fat + scores.da1 + scores.da2 + scores.da3;
        totalMarksXP += xpFromMarks;
        subjectTableBody.innerHTML += `
            <tr>
                <td>${subject}</td>
                <td>${scores.cat1}</td>
                <td>${scores.cat2}</td>
                <td>${scores.fat}</td>
                <td>${scores.da1}</td>
                <td>${scores.da2}</td>
                <td>${scores.da3}</td>
                <td>${xpFromMarks} XP</td>
            </tr>`;
    });

    const attendanceXP = gameState.user.attendance * 5;
    const extraActivitiesXP = 500;

    xpBreakdownBody.innerHTML = `
        <tr><td>Base XP from Marks (from JSON)</td><td>${gameState.user.xp} XP</td></tr>
        <tr><td>Bonus from Attendance</td><td>${attendanceXP} XP</td></tr>
        <tr><td>Bonus from Extra Activities</td><td>${extraActivitiesXP} XP</td></tr>
        <tr><td><strong>Total XP</strong></td><td><strong>${Math.floor(gameState.totalXP)} XP</strong></td></tr>`;
}

function setupHomePage() {
    const LEVEL_THRESHOLD = 1500;
    const currentXP = gameState.totalXP;
    const currentLevel = Math.floor(currentXP / LEVEL_THRESHOLD) + 1;
    const xpIntoLevel = currentXP % LEVEL_THRESHOLD;
    const progressPercentage = (xpIntoLevel / LEVEL_THRESHOLD) * 100;

    document.getElementById("xp-bar-progress").style.width = `${progressPercentage}%`;
    document.getElementById("xp-indicator-text").textContent = `Level ${currentLevel} (${Math.floor(progressPercentage)}%)`;
}

function setupSkillsPage() {
    const skillsContainer = document.getElementById("skills-container");
    const skillForm = document.getElementById("skill-form");
    const badgeDisplay = document.getElementById("badge-display");

    function renderSkills() {
        skillsContainer.innerHTML = "";
        for (const [skill, value] of Object.entries(gameState.skills)) {
            skillsContainer.innerHTML += `
                <div>
                    <p><strong>${skill}</strong> - Level: ${value}</p>
                    <div class.progress-bar">
                        <div class="progress" style="width: ${value}%;"></div>
                    </div>
                </div>`;
        }
    }

    skillForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const skillName = document.getElementById("skill-name").value;
        const skillValue = parseInt(document.getElementById("skill-value").value);
        
        if (isNaN(skillValue) || skillValue < 0 || skillValue > 100) {
            alert("Please enter a valid level between 0 and 100.");
            return;
        }

        const previousValue = gameState.skills[skillName] || 0;
        const xpGained = Math.max(0, skillValue - previousValue);

        let finalXPGained = xpGained;
        const booster = gameState.boosters.xpBoost;
        if (booster.active && new Date().getTime() < booster.expiresAt) {
            finalXPGained *= 2;
            alert("🚀 XP Booster Active! Double XP awarded!");
        }

        gameState.skills[skillName] = skillValue;
        gameState.totalXP += finalXPGained;
        
        saveGameState();
        renderSkills();
        updateXPDisplay();

        if (finalXPGained > 0) {
            alert(`+${finalXPGained} XP for improving ${skillName}!`);
        }

        if (skillValue >= 80) {
            badgeDisplay.innerHTML = `<p>🏅 Congrats! You've earned the <strong>${skillName} Expert</strong> badge!</p>`;
        }
        
        document.getElementById("skill-value").value = "";
    });

    renderSkills();
}

function setupBoostersPage() {
    document.getElementById("user-xp").textContent = `${Math.floor(gameState.totalXP)} XP`;

    document.querySelectorAll(".buy-booster").forEach(button => {
        button.addEventListener("click", function () {
            const boosterCard = this.closest(".booster");
            const price = parseInt(boosterCard.dataset.price, 10);
            const boosterId = boosterCard.dataset.id;

            if (gameState.totalXP >= price) {
                gameState.totalXP -= price;

                if (boosterId === 'xp-booster') {
                    const now = new Date();
                    gameState.boosters.xpBoost.active = true;
                    gameState.boosters.xpBoost.expiresAt = now.getTime() + (24 * 60 * 60 * 1000);
                    alert("✅ XP Booster purchased! You will earn 2x XP from skills for 24 hours.");
                } else {
                     alert("✅ Booster purchased successfully!");
                }

                saveGameState();
                updateXPDisplay();
                document.getElementById("user-xp").textContent = `${Math.floor(gameState.totalXP)} XP`;
            } else {
                alert("❌ Not enough XP to buy this booster.");
            }
        });
    });
}

async function setupLeaderboardPage() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = `<tr><td colspan="3">Loading...</td></tr>`;

    try {
        const response = await fetch("students_data.json");
        const studentsData = await response.json();

        const rankedStudents = studentsData.students.map(student => ({
            name: student.name,
            xp: calculateTotalXP(student)
        })).sort((a, b) => b.xp - a.xp);

        leaderboardBody.innerHTML = "";
        rankedStudents.forEach((student, index) => {
            leaderboardBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${Math.floor(student.xp)} XP</td>
                </tr>`;
        });

    } catch (error) {
        console.error("Failed to load leaderboard data:", error);
        leaderboardBody.innerHTML = `<tr><td colspan="3">Could not load leaderboard.</td></tr>`;
    }
}