// Fetch User Data from Session
fetch('/checkSession')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            document.getElementById('userId').innerText = data.userId || "N/A";
            document.getElementById('userName').innerText = data.userName || "N/A";
            document.getElementById('userEmail').innerText = data.userEmail || "N/A";
            // Save user session in localStorage
            localStorage.setItem("sessionUser", JSON.stringify({
                userId: data.userId,
                userName: data.userName,
                userEmail: data.userEmail
            }));
        } else {
            alert("You need to log in first!");
            window.location.href = "/loginSignUP";
        }
    })
    .catch(error => console.error("Error fetching user session:", error));
