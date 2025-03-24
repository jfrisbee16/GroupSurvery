// Validation for Registration Form
document.querySelector("#btnRegister").addEventListener("click", (e) => {
    e.preventDefault() // Prevent form submission
    
    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    const regPhone = /^[0-9]{10}$/
    const regZip = /^[0-9]{5}$/

    let email = document.querySelector("#txtEmail").value.trim()
    let password = document.querySelector("#txtPassword").value.trim()
    let confirmPassword = document.querySelector("#txtConfirmPassword").value.trim()
    let firstName = document.querySelector("#txtFirstName").value.trim()
    let lastName = document.querySelector("#txtLastName").value.trim()
    let street1 = document.querySelector("#txtStreetAddressOne").value.trim()
    let city = document.querySelector("#txtCity").value.trim()
    let state = document.querySelector("#txtState").value.trim()
    let zip = document.querySelector("#txtZipcode").value.trim()
    let phone = document.querySelector("#txtPhone").value.trim()

    let errors = ""

    // Email Validation
    if (!regEmail.test(email)) {
        errors += "<p class='mb-1 mt-1'>Invalid email format</p>"
    }

    // Password Validation
    if (!regPass.test(password)) {
        errors += "<p class='mb-1 mt-1'>Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one number</p>"
    }

    if (password !== confirmPassword) {
        errors += "<p class='mb-1 mt-1'>Passwords do not match</p>"
    }

    // Required Field Validation
    if (!firstName) errors += "<p class='mb-1 mt-1'>First Name is required</p>"
    if (!lastName) errors += "<p class='mb-1 mt-1'>Last Name is required</p>"
    if (!street1) errors += "<p class='mb-1 mt-1'>Street Address 1 is required</p>"
    if (!city) errors += "<p class='mb-1 mt-1'>City is required</p>"
    if (!state) errors += "<p class='mb-1 mt-1'>State is required</p>"

    // Zip Code Validation
    if (!regZip.test(zip)) {
        errors += "<p class='mb-1 mt-1'>Zip code must be 5 digits</p>"
    }

    // Phone Number Validation
    if (!regPhone.test(phone)) {
        errors += "<p class='mb-1 mt-1'>Phone number must be 10 digits</p>"
    }

    if (errors) {
        Swal.fire({
            title: "Registration Error!",
            html: errors,
            icon: "error"
        })
    } else {
        Swal.fire({
            title: "Success!",
            text: "Registration successful",
            icon: "success"
        })
    }
})