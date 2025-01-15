
function initializeApp() {
    const userGrid = document.getElementById("userGrid");
    const searchInput = document.getElementById("searchInput");
    const users = JSON.parse(localStorage.getItem("registrationFormData")) || [];

    function redirectToForm() {
        window.location.href = 'index.html';
    }

    function createUserCard(user) {
        const imgurl = user.profilePicture.content;

        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
        <div class="card h-100 shadow-sm" id="card">
            <div class="card-body d-flex align-items-center">
                <div class="user-info me-4 flex-grow-1 overflow-hidden">
                    <div class="col mb-2">
                        <div class="col-auto">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-person-circle me-2"></i>${user.name}
                            </h5>
                        </div>
                        <div class="col-auto">
                            <p class="card-text mb-0 text-muted">
                                (<i class="bi bi-at me-2"></i>${user.username})
                            </p>
                        </div>
                    </div>
                    <p class="card-text mb-0">
                        <i class="bi bi-envelope me-2"></i>${user.email}
                    </p>
                    <p class="card-text mb-0">
                        <i class="bi bi-telephone me-2"></i>${user.contactno}
                    </p>
                    <p class="card-text mb-0">
                        <i class="bi bi-person-vcard me-2"></i>${user.pan}
                    </p>
                    <p class="card-text mb-0">
                        <i class="bi bi-calendar-date me-2"></i>${user.dob}
                    </p>
                    <p class="card-text mb-0">
                        ${user.gender === "male" 
                            ? `<i class="bi bi-gender-male me-2"></i>` 
                            : `<i class="bi bi-gender-female me-2"></i>`}
                        ${user.gender}
                    </p>
                </div>
                <div class="user-image">
                    <img src="${imgurl}" alt="${user.name}'s picture" 
                         class="img-fluid rounded-circle" 
                         style="width: 100px; height: 100px; object-fit: cover;">
                </div>
            </div>
        </div>
    `;    
        return card;
    }

    function displayUsers(usersToDisplay) {
        userGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        usersToDisplay.forEach((user) => {
            fragment.appendChild(createUserCard(user));
        });
        userGrid.appendChild(fragment);
    }
    
    function filterUsers(searchTerm) {
        searchTerm = searchTerm.trim();
        if(searchTerm.toLowerCase().includes("mb") && !isNaN(searchTerm.charAt(0)))
        {   
            searchTerm = parseFloat(searchTerm) * 1024;
        }
        else if(searchTerm.toLowerCase().includes("kb") && !isNaN(searchTerm.charAt(0)))
        {
            searchTerm = parseFloat(searchTerm);
        }
        return users.filter(
            (user) =>
            {
                const dob = new Date(user.dob);
                const today = new Date();
                const days = Math.floor(today.getTime() - dob.getTime())/(1000 * 60 * 60 * 24);                

               return ( searchTerm === ""? user : isNaN(searchTerm) ? 
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.username.toLowerCase().includes(searchTerm) ||
                user.pan.toLowerCase().includes(searchTerm) ||
                user.gender.includes(searchTerm) ||
                user.education.includes(searchTerm) ||
                user.country.toLowerCase().includes(searchTerm)
                :
                searchTerm > 6574 ?
                String(user.contactno).includes(searchTerm) ||
                days < searchTerm :
                parseFloat(user.profilePicture.size) < searchTerm
            )
            }
    );
    }

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const handleSearchInput = debounce((e) => {
        const searchTerm = e.target.value;
        const filteredUsers = filterUsers(searchTerm);
        displayUsers(filteredUsers);
    }, 300);

    searchInput.addEventListener("input", handleSearchInput);
    document.getElementById("redirectToFormPage").addEventListener("click", redirectToForm)

    displayUsers(users);
}

document.addEventListener("DOMContentLoaded", initializeApp);
