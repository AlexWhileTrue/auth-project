const username = localStorage.getItem("username");

if (username) {
    document.getElementById("profileName").textContent = username;
} else {
    document.getElementById("profileName").textContent = "Guest";
}

if (!username) {

    window.location.href = "/";
}

document.getElementById("username")
    .textContent = username;

async function loadNews() {

    const response =
        await fetch("/api/news");

    const news =
        await response.json();

    document.getElementById("newsCount")
        .textContent = news.length;

    document.getElementById("newsContainer")
        .innerHTML = news.map(item => `

        <div class="news-card">
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        </div>

    `).join("");
}

async function loadMatches() {

    const response =
        await fetch("/api/matches");

    const matches =
        await response.json();

    document.getElementById("matchCount")
        .textContent = matches.length;

    document.getElementById("matchesTable")
        .innerHTML = matches.map(match => `

        <tr>
            <td>${match.match_date}</td>
            <td>${match.opponent}</td>
            <td>${match.stadium}</td>
        </tr>

    `).join("");
}

async function loadNotifications() {

    const response =
        await fetch("/api/notifications");

    const notifications =
        await response.json();

    document.getElementById("notificationCount")
        .textContent = notifications.length;

    document.getElementById("notificationContainer")
        .innerHTML = notifications.map(item => `

        <div class="notification-card">
            ${item.text}
        </div>

    `).join("");
}

function logout() {

    localStorage.removeItem("username");

    window.location.href = "/";
}

loadNews();
loadMatches();
loadNotifications();