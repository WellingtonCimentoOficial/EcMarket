const URL_BASE = "http://127.0.0.1:8000"


const handleSubmit = async (e) => {
    e.preventDefault()
    grecaptcha.ready(async function() {
        grecaptcha.execute('6LeKJCQnAAAAAPFOjyIvDJazV8ja7lEgR1VIv-He', {action: 'submit'}).then(async function(token) {
            const data = {
                "email": document.getElementById("email").value,
                "password": document.getElementById("password").value,
                "g-recaptcha-response": token
            }
            const response = await fetch(`${URL_BASE}/accounts/sign-in/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if(response.status == 200){
                const responseData = await response.json()
                localStorage.setItem("access_token", responseData.access)
                localStorage.setItem("refresh_token", responseData.refresh)
            }
        })
    })
}

document.getElementById("submit-button").addEventListener('click', handleSubmit)

window.onload = () => {
    access_token = localStorage.getItem("access_token")
    refresh_token = localStorage.getItem("refresh_token")
    document.getElementById("access_token").innerText = `Access Token: ${access_token}`
    document.getElementById("refresh_token").innerText = `Refresh Token: ${refresh_token}`
}