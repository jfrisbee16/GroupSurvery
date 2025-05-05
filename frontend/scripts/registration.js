import { authAPI } from '../js/api.js';

// Validation for Registration Form
document.querySelector("#btnRegister").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    
    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const regPhone = /^[0-9]{10}$/;
    const regZip = /^[0-9]{5}$/;
    const role = document.getElementById("strRole").value;

    let email = document.querySelector("#strEmail").value.trim();
    let password = document.querySelector("#strNewPassword").value.trim();
    let confirmPassword = document.querySelector("#strConfirmPassword").value.trim();
    let firstName = document.querySelector("#strFirstName").value.trim();
    let middleName = document.querySelector("#strMiddleName").value.trim();
    let lastName = document.querySelector("#strLastName").value.trim();
    
    let errors = "";

    // Required Field Validation
    if (!firstName) errors += "<p class='mb-1 mt-1'>First Name is required</p>";
    if (!middleName) errors += "<p class='mb-1 mt-1'>Middle Name is required</p>";
    if (!lastName) errors += "<p class='mb-1 mt-1'>Last Name is required</p>";    

    // Email Validation
    if (!regEmail.test(email)) {
        errors += "<p class='mb-1 mt-1'>Invalid email format</p>";
    }

    // Password Validation
    if (!regPass.test(password)) {
        errors += "<p class='mb-1 mt-1'>Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, one number, and one special character</p>";
    }

    if (password !== confirmPassword) {
        errors += "<p class='mb-1 mt-1'>Passwords do not match</p>";
    }

    if (errors) {
        Swal.fire({
            title: "Registration Error!",
            html: errors,
            icon: "error"
        });
    } else {
        try {
            const response = await authAPI.register({
                email,
                password,
                firstName,
                middleName,
                lastName,
                role
            });

            if (response.status === "success") {
                // Store the token
                localStorage.setItem('token', response.token);

                Swal.fire({
                    title: "Success!",
                    text: "Registration successful",
                    icon: "success"
                }).then(() => {
                    // Redirect based on role
                    if (role === 'Student') {
                        window.location.href = '/student.html';
                    } else {
                        window.location.href = '/faculty.html';
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "Registration failed",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                title: "Error",
                text: "An error occurred during registration. Please try again.",
                icon: "error"
            });
        }
    }
});
