// Validation for Login Form
document.querySelector("#btnLogin").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission

    const strEmail = document.querySelector("#strUsername").value.trim();
    const strPassword = document.querySelector("#strPassword").value.trim();
    console.log("Captured Password:", strPassword); // Debugging

    const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let errors = "";

    let blnError = false;
    let strMessage = "";

    if (!regEmail.test(strEmail)) {
        blnError = true;
        strMessage += "<p>Please enter a valid email address.</p>";
    } 
    if (!regPassword.test(strPassword)) {  // <-- FIXED: Separate condition
        blnError = true;
        strMessage += "<p>Please enter a valid password.</p>";
    }

    if (blnError) {
        console.log("Error Message:", strMessage); // Debugging
        Swal.fire({
            title: "Error",
            html: strMessage,
            icon: "error",
        });
    } else {
        Swal.fire({
            title: "Success!",
            text: "Login Successful!",
            icon: "success"
        });
    }
});