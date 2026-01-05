// --- SHARED UTILITIES ---
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// --- NAVBAR LOGIC (Runs on every page) ---
function updateNavbar() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return; // Safety check

    const user = getCurrentUser();

    if (user) {
        navLinks.innerHTML = `
            <a href="dashboard.html">Dashboard</a>
            <a href="profile.html?user=${user.username}" class="btn-profile" style="font-weight:bold; color:var(--primary)">My Profile</a>
            <button onclick="logout()" class="btn-logout" style="cursor:pointer; background:none; border:none; color:#ef4444; font-weight:bold;">Logout</button>
        `;
    } else {
        // GUEST VIEW: Ensure buttons show up for logged-out users
        navLinks.innerHTML = `
            <a href="login.html">Login</a>
            <a href="signup.html" class="btn-join" style="background:var(--primary); color:white; padding:8px 20px; border-radius:20px;">Join Now</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// --- DASHBOARD LOGIC (Upload function) ---
function uploadImage() {
    const urlInput = document.getElementById('image-url');
    if (!urlInput) return;
    
    const url = urlInput.value;
    const currentUser = getCurrentUser();
    
    if(url && currentUser) {
        // Update Session
        currentUser.images.push(url);
        
        // Update "Database"
        let users = getUsers();
        let idx = users.findIndex(u => u.username === currentUser.username);
        if (idx !== -1) {
            users[idx].images.push(url);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            location.reload(); 
        }
    }
}

// --- PROFILE PAGE LOGIC ---
// We wrap this in a check to see if we are actually ON the profile page
function initProfilePage() {
    const profileNameElem = document.getElementById('profile-name');
    const userGridElem = document.getElementById('user-grid');
    
    if (!profileNameElem || !userGridElem) return; // Exit if not on profile page

    const params = new URLSearchParams(window.location.search);
    const targetUser = params.get('user');
    const users = getUsers();
    const userData = users.find(u => u.username === targetUser);

    if(userData) {
        profileNameElem.innerText = `@${userData.username}`;
        userGridElem.innerHTML = ''; // Clear previous
        userData.images.forEach(imgUrl => {
            userGridElem.innerHTML += `
                <div class="art-card">
                    <img src="${imgUrl}" onerror="this.src='https://via.placeholder.com/400?text=Invalid+Image+URL'">
                </div>`;
        });
    } else {
        profileNameElem.innerText = "Artist Not Found";
    }
}

// --- INITIALIZE EVERYTHING ---
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    initProfilePage();
});