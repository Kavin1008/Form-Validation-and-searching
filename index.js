import countries from './countries.json' with {type : "json"};
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const existingData = JSON.parse(localStorage.getItem('registrationFormData')) || [];

    const existingUsernames = existingData.map(obj => obj.username);
    const existingEmails = existingData.map(obj => obj.email);
    const existingContactNos = existingData.map(obj => obj.contactno);
    const existingPans = existingData.map(obj => obj.pan);
    

    const countrySelect = document.getElementById('country');

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });

    form.addEventListener('submit', function (event) {

        event.preventDefault();
        event.stopPropagation();

        validateDOB();
        validatePassword();
        validateUsername();
        validateProfilePicture();
        validateConfirmPassword();
        validateEmail();
        validatePan();
        validateContactNo();
        validateName();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return; 
        }

        saveFormData();
        form.classList.add('was-validated');
    });

    function saveFormData() {
        const fileInput = document.getElementById('profilePicture');
        const file = fileInput.files[0];

        let profilePictureData = null;
        const reader = new FileReader();
        const pwd = document.getElementById('password').value



        reader.onload = function (event) {
            profilePictureData = {
                name: file.name,
                size: (file.size / 1024).toFixed(2) + " KB",
                type: file.type,
                content: event.target.result,
            };


            const formData = {
                username: document.getElementById('username').value,
                password: pwd,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                contactno: document.getElementById('contactNo').value,
                dob: document.getElementById('dob').value,
                education: document.getElementById('education').value,
                country: document.getElementById('country').value,
                bio: document.getElementById('bio').value || "",
                color: document.getElementById('favoriteColor').value || "",
                gender: document.querySelector('input[name="gender"]:checked').value,
                pan: document.getElementById('pan').value,
                profilePicture: profilePictureData,
            };

            existingData.push(formData);

            localStorage.setItem('registrationFormData', JSON.stringify(existingData));
            console.log(existingData);
            alert("User data saved successfully!");
    
            form.reset();

            const negativeFeedbackElements = document.querySelectorAll('.invalid-feedback');
            negativeFeedbackElements.forEach(feedback => {
                feedback.textContent = ''; 
            });
            const positiveFeedbackElements = document.querySelectorAll('.valid-feedback');
            positiveFeedbackElements.forEach(feedback => {
                feedback.textContent = ''; 
            });

            form.classList.remove('was-validated');
       };
        reader.readAsDataURL(file);

    }


    function validateDOB() {
        const dobInput = document.getElementById('dob');
        const dobPositiveFeedback = document.querySelector('#dob ~ .valid-feedback');
        const dobNegativeFeedback = document.querySelector('#dob ~ .invalid-feedback');
        const dob = new Date(dobInput.value);
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const minDate =  new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

        if (dob < minDate || dob > maxDate) {
            dobInput.setCustomValidity('You must be 18 or older.');
            dobNegativeFeedback.textContent = 'You must be 18 or older.';
            dobNegativeFeedback.style.display = "block"
            dobPositiveFeedback.style.display = "none"
            dobInput.classList.add('is-invalid');
        } else {
            dobInput.setCustomValidity('');  
            dobPositiveFeedback.textContent = "Looks fine"
            dobPositiveFeedback.style.display = "block"
            dobNegativeFeedback.style.display = "none"
            dobInput.classList.add('is-valid');
            dobInput.classList.remove('is-invalid');
        }
        dobInput.reportValidity();
    }

    function validatePassword() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;
        const passwordNegativeFeedback = document.querySelector('#password ~ .invalid-feedback');
        const passwordPositiveFeedback = document.querySelector('#password ~ .valid-feedback');
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*\d).{8,15}$/;

        if (!regex.test(password)) {
            passwordInput.setCustomValidity('Password must be 8-15 characters long, contain uppercase, lowercase, numbers, and special characters.');
            passwordNegativeFeedback.textContent = 'Password must be 8-15 characters long, contain uppercase, lowercase, numbers, and special characters.';
            passwordPositiveFeedback.style.display = 'none';
            passwordNegativeFeedback.style.display = 'block';
            passwordInput.classList.add('is-invalid');
            
        } else {
            passwordPositiveFeedback.textContent = 'Looks fine';
            passwordNegativeFeedback.style.display = 'none';
            passwordPositiveFeedback.style.display = 'block';
            passwordInput.classList.add('is-valid');
            passwordInput.classList.remove('is-invalid');
            passwordInput.setCustomValidity('');
        }
        passwordInput.reportValidity();
    }

    function validateConfirmPassword() {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const confirmPasswordNegativeFeedback = document.querySelector('#confirmPassword ~ .invalid-feedback');
        const confirmPasswordPositiveFeedback = document.querySelector('#confirmPassword ~ .valid-feedback');
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
            confirmPasswordNegativeFeedback.textContent = 'Passwords do not match';
            confirmPasswordPositiveFeedback.style.display = 'none';
            confirmPasswordNegativeFeedback.style.display = 'block';
            passwordInput.classList.add('is-invalid');
        } else {
            confirmPasswordPositiveFeedback.textContent = 'Looks fine';
            confirmPasswordNegativeFeedback.style.display = 'none';
            confirmPasswordPositiveFeedback.style.display = 'block';
            confirmPasswordInput.classList.add('is-valid');
            confirmPasswordInput.classList.remove('is-invalid');
            confirmPasswordInput.setCustomValidity('');
        }
        confirmPasswordInput.reportValidity();
    }

    function validateEmail() {
        const emailInput = document.getElementById('email');
        const emailNegativeFeedback = document.querySelector('#email ~ .invalid-feedback');
        const emailPositiveFeedback = document.querySelector('#email ~ .valid-feedback');
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/


        if (existingEmails.includes(emailInput.value)) {
            emailInput.setCustomValidity('This email is already used.');
            emailNegativeFeedback.textContent = 'This email is already used.';
            emailNegativeFeedback.style.display = "block"
            emailPositiveFeedback.style.display = "none"
            emailInput.classList.add('is-invalid');
        } else if(!regex.test(emailInput.value)){
            emailInput.setCustomValidity('');
            emailNegativeFeedback.textContent = 'Please provide a valid email.';
            emailNegativeFeedback.style.display = "block"
            emailPositiveFeedback.style.display = "none"
            emailInput.classList.add('is-invalid');
        }else{
            emailInput.setCustomValidity('');  
            emailPositiveFeedback.textContent = "Looks fine"
            emailPositiveFeedback.style.display = "block"
            emailNegativeFeedback.style.display = "none"
            emailInput.classList.add('is-valid');
            emailInput.classList.remove('is-invalid');

        }
        emailInput.reportValidity();
    }

    function validateContactNo() {
        const contactInput = document.getElementById('contactNo');
        const contactNegativeFeedback = document.querySelector('#contactNo ~ .invalid-feedback');
        const contactPositiveFeedback = document.querySelector('#contactNo ~ .valid-feedback');

        if (existingContactNos.includes(contactInput.value)) {
            contactInput.setCustomValidity('This number is already used.');
            contactNegativeFeedback.textContent = 'This number is already used.';
            contactNegativeFeedback.style.display = "block";
            contactPositiveFeedback.style.display = "none";
            contactInput.classList.add("is-invalid");
        } 
        else if(String(contactInput.value).length != 10 || (String(contactInput.value).charAt(0) != '9' && String(contactInput.value).charAt(0) != '8' && String(contactInput.value).charAt(0) != '7' && String(contactInput.value).charAt(0) != '6')){
            
            contactInput.setCustomValidity('Enter a valid number.');
            contactNegativeFeedback.textContent = 'Enter a valid number.';
            contactNegativeFeedback.style.display = "block";
            contactPositiveFeedback.style.display = "none";
            contactInput.classList.add("is-invalid");
        }
        else{
            contactInput.setCustomValidity('');  
            contactPositiveFeedback.textContent = "Looks fine"
            contactPositiveFeedback.style.display = "block"
            contactNegativeFeedback.style.display = "none"
            contactInput.classList.add('is-valid');
            contactInput.classList.remove('is-invalid');
        }
        contactInput.reportValidity();
    }

    function validateUsername() {
        const usernameInput = document.getElementById('username');
        const usernameNegativeFeedback = document.querySelector('#username ~ .invalid-feedback');
        const usernamePositiveFeedback = document.querySelector('#username ~ .valid-feedback');
        
        if (existingUsernames.includes(usernameInput.value)) {            
            usernameInput.setCustomValidity('This username is already taken.');
            usernameNegativeFeedback.textContent = 'This username is already taken.';
            usernameNegativeFeedback.style.display = "block"
            usernamePositiveFeedback.style.display = "none"
            usernameInput.classList.add('is-invalid');
        } else if(usernameInput.value === ""){
            usernameInput.setCustomValidity('');            
            usernameNegativeFeedback.textContent = 'Please provide a username.';
            usernameNegativeFeedback.style.display = "block"
            usernamePositiveFeedback.style.display = "none"
            usernameInput.classList.add('is-invalid');
        }
        else{
            usernameInput.setCustomValidity('');  
            usernamePositiveFeedback.textContent = "Looks fine"
            usernamePositiveFeedback.style.display = "block"
            usernameNegativeFeedback.style.display = "none"
            usernameInput.classList.add('is-valid');
            usernameInput.classList.remove('is-invalid');

        }
        usernameInput.reportValidity();
    }

    function validateName() {
        const nameInput = document.getElementById('name');
        const nameNegativeFeedback = document.querySelector('#name ~ .invalid-feedback');
        const namePositiveFeedback = document.querySelector('#name ~ .valid-feedback');
        const regex = /^[A-Za-z\s]+$/;
        
        if (!regex.test(nameInput.value)) {            
            nameInput.setCustomValidity('Name must contain only alphabets.');
            nameNegativeFeedback.textContent = 'Name must contain only alphabets.';
            nameNegativeFeedback.style.display = "block"
            namePositiveFeedback.style.display = "none"
            nameInput.classList.add('is-invalid');
        } 
        else{
            nameInput.setCustomValidity('');  
            namePositiveFeedback.textContent = "Looks fine"
            namePositiveFeedback.style.display = "block"
            nameNegativeFeedback.style.display = "none"
            nameInput.classList.add('is-valid');
            nameInput.classList.remove('is-invalid');

        }
        nameInput.reportValidity();
    }

    function validatePan() {
        const panInput = document.getElementById('pan');
        const panNegativeFeedback = document.querySelector('#pan ~ .invalid-feedback');
        const panPositiveFeedback = document.querySelector('#pan ~ .valid-feedback');
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if(!panRegex.test(panInput.value)){
            panInput.setCustomValidity('Enter a valid pan number(ABCDE1234A).');
            panNegativeFeedback.textContent = 'Enter a valid pan number(ABCDE1234A).';
            panNegativeFeedback.style.display = 'block';
            panPositiveFeedback.style.display = 'none';
            panInput.classList.add('is-invalid');
        }
        else if(existingPans.includes(panInput.value)) {
            panInput.setCustomValidity('This pan is already existing.');
            panNegativeFeedback.textContent = 'This pan is already existing.';
            panNegativeFeedback.style.display = 'block';
            panPositiveFeedback.style.display = 'none';
            panInput.classList.add('is-invalid');
        } else {
            panInput.setCustomValidity('');  
            panPositiveFeedback.textContent = "Looks fine"
            panPositiveFeedback.style.display = "block"
            panNegativeFeedback.style.display = "none"
            panInput.classList.add('is-valid');
            panInput.classList.remove('is-invalid');
        }
        panInput.reportValidity();
    }

    function validateProfilePicture() {
        const fileInput = document.getElementById('profilePicture');
        const filePositiveInput = document.querySelector("#profilePicture ~ .valid-feedback");
        const fileNegativeInput = document.querySelector('#profilePicture ~ .invalid-feedback');    
        const file = fileInput.files[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                fileInput.setCustomValidity('File size must be less than 2MB.');
                fileNegativeInput.textContent = "File size must be less than 2MB.";
                fileNegativeInput.style.display = "block";
                filePositiveInput.style.display = "none";
                fileInput.classList.add('is-invalid');
            }
            else{
                fileInput.setCustomValidity('');
                filePositiveInput.textContent = "Looks fine";
                fileNegativeInput.style.display = "none";
                filePositiveInput.style.display = "block";
                fileInput.classList.add('is-valid');
                fileInput.classList.remove('is-invalid');
            }
        }
        else{
            fileInput.setCustomValidity('Upload a file.');
            fileNegativeInput.textContent = "Upload a file.";
            fileNegativeInput.style.display = "block";
            filePositiveInput.style.display = "none";
            fileInput.classList.add('is-invalid');
        }
        fileInput.reportValidity();
    }

    function validateBio() {
        const bioInput = document.getElementById('bio');
        const bioPositiveFeedback = document.querySelector('#bio ~ .valid-feedback');
        const bioNegativeFeedback = document.querySelector('#bio ~ .invalid-feedback');
        if (bioInput.value.length >= 201) {
            bioInput.setCustomValidity("Bio cannot exceed 200 characters");
            bioPositiveFeedback.textContent = "Bio cannot exceed 200 characters."
            bioPositiveFeedback.style.display = 'none';
            bioNegativeFeedback.style.display = 'block'
            bioInput.classList.add('is-invalid');
        } else {
            this.setCustomValidity('');
            bioPositiveFeedback.textContent = 'Looks fine'
            bioNegativeFeedback.style.display = 'none'
            bioPositiveFeedback.style.display = 'block'
            bioInput.classList.add('is-valid')
            bioInput.classList.remove('is-invalid')
        }
        bioInput.reportValidity();
    }

    function redirectToSearch(){
        window.location.href = "search.html";
    }

    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });

    document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('confirmPassword');
        const icon = this.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });


    document.getElementById('bio').addEventListener('input', validateBio);
    document.getElementById('confirmPassword').addEventListener('input', validateConfirmPassword);
    document.getElementById('profilePicture').addEventListener('input', validateProfilePicture);
    document.getElementById('dob').addEventListener('input', validateDOB);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('username').addEventListener('input',() =>  validateUsername());
    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('contactNo').addEventListener('input', validateContactNo);
    document.getElementById('pan').addEventListener('input', validatePan);
    document.getElementById('name').addEventListener('input', validateName);
    document.getElementById('redirectToSearchPage').addEventListener('click', redirectToSearch);

});
