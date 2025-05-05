import { authAPI } from '../js/api.js';

// Validation for Login Form
document.querySelector("#btnLogin").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission

    const strEmail = document.querySelector("#strUsername").value.trim();
    const strPassword = document.querySelector("#strPassword").value.trim();

    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let errors = "";

    let blnError = false;
    let strMessage = "";

    if (!regEmail.test(strEmail)) {
        blnError = true;
        strMessage += "<p>Please enter a valid email address.</p>";
    } 
    if (!regPassword.test(strPassword)) {
        blnError = true;
        strMessage += "<p>Please enter a valid password.</p>";
    }

    if (blnError) {
        Swal.fire({
            title: "Error",
            html: strMessage,
            icon: "error",
        });
    } else {
        try {
            const response = await authAPI.login({ email: strEmail, password: strPassword });
            
            if (response.status === "success") {
                // Store the token
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                Swal.fire({
                    title: "Success!",
                    text: "Login Successful!",
                    icon: "success"
                }).then(() => {
                    // Redirect based on user role
                    const user = response.user;
                    if (user.role === 'Student') {
                        window.location.href = '/student.html';
                    } else {
                        window.location.href = '/faculty.html';
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "Login failed",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                title: "Error",
                text: "An error occurred during login. Please try again.",
                icon: "error"
            });
        }
    }
});