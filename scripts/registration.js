// Validation for Registration Form
document.querySelector("#btnRegister").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    
    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const regPhone = /^[0-9]{10}$/;
    const regZip = /^[0-9]{5}$/;

    let email = document.querySelector("#strEmail").value.trim();
    let password = document.querySelector("#strNewPassword").value.trim();
    let confirmPassword = document.querySelector("#strConfirmPassword").value.trim();
    let firstName = document.querySelector("#strFirstName").value.trim();
    let lastName = document.querySelector("#strLastName").value.trim();
    
    let errors = "";

    // Email Validation
    if (!regEmail.test(email)) {
        errors += "<p class='mb-1 mt-1'>Invalid email format</p>";
    }

    // Password Validation
    if (!regPass.test(password)) {
        errors += "<p class='mb-1 mt-1'>Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one number</p>";
    }

    if (password !== confirmPassword) {
        errors += "<p class='mb-1 mt-1'>Passwords do not match</p>";
    }

    // Required Field Validation
    if (!firstName) errors += "<p class='mb-1 mt-1'>First Name is required</p>";
    if (!lastName) errors += "<p class='mb-1 mt-1'>Last Name is required</p>";

    if (errors) {
        Swal.fire({
            title: "Registration Error!",
            html: errors,
            icon: "error"
        });
    } else {
        Swal.fire({
            title: "Success!",
            text: "Registration successful",
            icon: "success"
        });
    }
});
