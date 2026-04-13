document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        currentPage: 'page-age-verification',
        user: null, // { username, email, type, dob, photo }
        isLoggedIn: false
    };

    // DOM Elements
    const pages = {
        age: document.getElementById('page-age-verification'),
        firstMain: document.getElementById('page-first-main'),
        choice: document.getElementById('page-login-signup-choice'),
        signup: document.getElementById('page-signup'),
        login: document.getElementById('page-login'),
        dashboard: document.getElementById('page-dashboard'),
        allJobs: document.getElementById('page-all-jobs')
    };

    // Page Transition Helper
    window.showPage = function (pageId) {
        // Remove active class from all pages
        Object.values(pages).forEach(page => page.classList.remove('active'));

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            state.currentPage = pageId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // --- Navigation Logic ---

    // Age Verification
    document.getElementById('btn-age-yes').addEventListener('click', () => {
        showPage('page-first-main');
    });

    document.getElementById('btn-age-no').addEventListener('click', () => {
        const errorMsg = document.getElementById('age-error-message');
        errorMsg.style.display = 'block';
        errorMsg.classList.add('animate-up');
    });

    // Header Login
    document.getElementById('btn-header-login').addEventListener('click', () => {
        showPage('page-login');
    });

    // First Main Page
    document.getElementById('btn-get-started').addEventListener('click', () => {
        showPage('page-login-signup-choice');
    });

    // Choice Page
    document.getElementById('btn-go-login').addEventListener('click', () => {
        showPage('page-login');
    });

    document.getElementById('btn-go-signup').addEventListener('click', () => {
        showPage('page-signup');
    });

    // Links between Login/Signup
    document.getElementById('link-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('page-login');
    });

    document.getElementById('link-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('page-signup');
    });

    // --- Form Handling ---

    // Signup Profile Photo Preview
    const profileInput = document.getElementById('profile-photo');
    const profilePreview = document.getElementById('profile-preview');

    profileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePreview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="width:100%; height:100%; object-fit:cover;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Signup Submission
    document.getElementById('form-signup').addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPass = document.getElementById('signup-confirm-password').value;
        const dob = document.getElementById('signup-dob').value;
        const type = document.querySelector('input[name="user-type"]:checked')?.value || 'labour';

        // Basic validation
        if (password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        // DOB Check (18+)
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            alert("Minimum age requirement is 18 years.");
            return;
        }

        // Save state
        state.user = {
            username,
            email,
            type,
            dob,
            photo: profilePreview.querySelector('img')?.src || `https://ui-avatars.com/api/?name=${username}&background=6366f1&color=fff`
        };
        state.isLoggedIn = true;

        updateDashboardUI();
        showPage('page-dashboard');
    });

    // Login Submission
    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        // Mock login
        if (!state.user || state.user.email !== email) {
            state.user = {
                username: email.split('@')[0],
                email: email,
                type: 'labour',
                photo: `https://ui-avatars.com/api/?name=${email}&background=6366f1&color=fff`
            };
        }
        state.isLoggedIn = true;

        updateDashboardUI();
        showPage('page-dashboard');
    });

    // --- Dashboard Logic ---

    function updateDashboardUI() {
        if (!state.user) return;

        const { username, type, photo, email } = state.user;

        // Header & Menu
        document.getElementById('welcome-name').textContent = username;
        document.getElementById('nav-profile-img').src = photo;
        document.getElementById('menu-profile-img').src = photo;
        document.getElementById('menu-username').textContent = username;

        // Dynamic Action Card & Menu Item
        const roleTagline = document.getElementById('role-tagline');
        const dynamicTitle = document.getElementById('dynamic-title');
        const dynamicDesc = document.getElementById('dynamic-desc');
        const dynamicIcon = document.getElementById('dynamic-icon');
        const menuDynamic = document.getElementById('menu-dynamic-action');

        if (type === 'labour') {
            roleTagline.textContent = "Explore high-quality work opportunities tailored for you.";
            dynamicTitle.textContent = "Browse Openings";
            dynamicDesc.textContent = "We found 12 new matches for your skill set in your local area.";
            dynamicIcon.className = "fas fa-magnifying-glass";
            menuDynamic.innerHTML = `<a href="#"><i class="fas fa-magnifying-glass"></i> Explore Jobs</a>`;
        } else {
            roleTagline.textContent = "Connect with the best talent for your upcoming projects.";
            dynamicTitle.textContent = "Publish Opportunity";
            dynamicDesc.textContent = "Reach over 5,000 verified professionals instantly.";
            dynamicIcon.className = "fas fa-plus";
            menuDynamic.innerHTML = `<a href="#"><i class="fas fa-file-pen"></i> Manage Jobs</a>`;
        }

        // Profile Modal Data
        document.getElementById('update-username').value = username;
        document.getElementById('update-email').value = email;
        document.getElementById('update-profile-preview').src = photo;

        // Rating Text Logic
        const ratingTitle = document.getElementById('rating-job-title');
        const ratingUser = document.getElementById('rating-job-user');
        const ratingTargetName = document.getElementById('rating-target-name');

        if (type === 'labour') {
            ratingTitle.textContent = "Plumbing Repair";
            ratingUser.innerHTML = `Completed with: <span style="color: white; font-weight: 600;">John (Employer)</span>`;
            ratingTargetName.textContent = "John";
        } else {
            ratingTitle.textContent = "Kitchen Cleaning";
            ratingUser.innerHTML = `Completed with: <span style="color: white; font-weight: 600;">Sarah (Worker)</span>`;
            ratingTargetName.textContent = "Sarah";
        }
    }

    // --- Rating Logic ---
    const ratingModal = document.getElementById('rating-modal');
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;

    document.getElementById('btn-open-rating').addEventListener('click', () => {
        ratingModal.classList.add('active');
    });

    document.getElementById('btn-close-rating').addEventListener('click', () => {
        ratingModal.classList.remove('active');
        resetStars();
    });

    document.getElementById('btn-submit-rating').addEventListener('click', () => {
        if (currentRating === 0) {
            alert("Please select a star rating.");
            return;
        }
        alert("Rating submitted successfully!");
        ratingModal.classList.remove('active');
        resetStars();
        // Hide rating card or change status mock
        document.getElementById('btn-open-rating').textContent = "Rated";
        document.getElementById('btn-open-rating').disabled = true;
    });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'));
            updateStars(currentRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            const val = parseInt(star.getAttribute('data-value'));
            if (val <= rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }

    function resetStars() {
        currentRating = 0;
        updateStars(0);
    }

    // Side Menu Toggle
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    document.getElementById('btn-menu').addEventListener('click', () => {
        sideMenu.classList.add('active');
    });

    menuOverlay.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });

    // Profile Modal Toggle
    const profileModal = document.getElementById('profile-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    document.getElementById('user-profile-trigger').addEventListener('click', () => {
        profileModal.classList.add('active');
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    modalOverlay.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        state.isLoggedIn = false;
        state.user = null;
        sideMenu.classList.remove('active');
        showPage('page-login-signup-choice');
    });

    // Profile Update
    document.getElementById('form-update-profile').addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('update-username').value;
        if (newUsername) {
            state.user.username = newUsername;
            updateDashboardUI();
            profileModal.classList.remove('active');
            // Show a subtle toast or just close
        }
    });

    // --- Jobs Logic ---
    const mockJobs = [
        {
            title: "Plumber Needed",
            price: "$35/hr",
            time: "Urgent • Start Today",
            desc: "Fixing a leaking pipe in the kitchen. Approx 2 hours work. Tools provided if needed.",
            tags: ["Plumbing", "Repair"],
            icon: "fa-wrench"
        },
        {
            title: "House Cleaning",
            price: "$25/hr",
            time: "Flexible Schedule",
            desc: "Deep cleaning for a 3BHK apartment. Vacuuming, dusting, and mopping required.",
            tags: ["Cleaning", "Housekeeping"],
            icon: "fa-broom"
        },
        {
            title: "Electrician for Wiring",
            price: "$45/hr",
            time: "Tomorrow Morning",
            desc: "Install new socket outlets in the living room. Must be certified.",
            tags: ["Electrical", "Installation"],
            icon: "fa-bolt"
        },
        {
            title: "Gardener",
            price: "$20/hr",
            time: "This Weekend",
            desc: "Lawn mowing and trimming hedges for a small backyard garden.",
            tags: ["Gardening", "Outdoor"],
            icon: "fa-leaf"
        },
        {
            title: "Moving Helper",
            price: "$30/hr",
            time: "Saturday",
            desc: "Help moving furniture and boxes to a truck. Heavy lifting involved.",
            tags: ["Moving", "Labor"],
            icon: "fa-truck-ramp-box"
        },
        {
            title: "AC Repair",
            price: "$40/hr",
            time: "Urgent",
            desc: "AC unit not cooling effectively. Need diagnosis and gas refill.",
            tags: ["Repair", "HVAC"],
            icon: "fa-snowflake"
        }
    ];

    function renderJobs() {
        const container = document.getElementById('jobs-container');
        if (!container) return;
        container.innerHTML = '';

        mockJobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-header">
                    <div class="job-icon">
                        <i class="fas ${job.icon}"></i>
                    </div>
                    <div>
                        <div class="job-price">${job.price}</div>
                        <div class="job-time">${job.time}</div>
                    </div>
                </div>
                <h3>${job.title}</h3>
                <p>${job.desc}</p>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                </div>
                <div class="job-footer">
                    <button class="btn btn-primary-hero btn-sm">Apply Now</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    const btnViewJobs = document.getElementById('btn-view-jobs');
    if (btnViewJobs) {
        btnViewJobs.addEventListener('click', () => {
            renderJobs();
            showPage('page-all-jobs');
        });
    }

});
