document.addEventListener('DOMContentLoaded', () => {
    // 1. Get targets from URL
    const urlParams = new URLSearchParams(window.location.search);
    const targetUsername = urlParams.get('user');

    // 2. Load data safely
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // 3. Find the artist
    const artist = allUsers.find(u => u.username === targetUsername);

    if (artist) {
        renderProfile(artist, currentUser);
    } else {
        showError();
    }
    
    // 4. Update shared navbar (if function exists in main.js)
    if (typeof updateNavbar === "function") updateNavbar();
});

function renderProfile(artist, currentUser) {
    // Update Text & Meta
    document.getElementById('display-username').innerText = `@${artist.username}`;
    document.getElementById('user-avatar').innerText = artist.username.charAt(0).toUpperCase();
    document.getElementById('image-count').innerText = `${artist.images.length} Digital Masterpieces`;
    document.title = `${artist.username}'s Portfolio | DigiArt`;

    // SELF-VIEW CHECK: If I am viewing my own profile, show the manage button
    if (currentUser && currentUser.username === artist.username) {
        document.getElementById('manage-btn').style.display = 'inline-block';
    }

    const gallery = document.getElementById('profile-gallery');
    gallery.innerHTML = ''; // Clear existing

    if (artist.images.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 50px; color:#94a3b8;">
                <p style="font-size: 1.2rem;">This gallery is currently empty.</p>
            </div>`;
        return;
    }

    // 5. Inject Images with staggered animation delay
    artist.images.forEach((imgUrl, index) => {
        const card = document.createElement('div');
        card.className = 'art-card';
        // Add a slight delay for each card to create a "waterfall" effect
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="img-wrapper" style="position:relative; overflow:hidden; border-radius:20px;">
                <img src="${imgUrl}" 
                     alt="Art" 
                     style="width:100%; display:block; transition: transform 0.5s ease;"
                     onerror="this.parentElement.innerHTML='<div style=\'padding:40px; background:#f1f5f9; text-align:center; color:#94a3b8;\'>Link Broken</div>'">
            </div>
        `;
        gallery.appendChild(card);
    });
}

function showError() {
    document.querySelector('.profile-header').style.display = 'none';
    document.getElementById('profile-gallery').style.display = 'none';
    document.getElementById('error-view').style.display = 'block';
}