const button = document.getElementById('google')
const googleOAuthClientId = '131194775869-49hh1dv2m43pm8pkj90hh3e130vqdndu.apps.googleusercontent.com'

const handleCredentialResponse = (response) => {
    console.log(response)
}

window.onload = () => {
    window.google.accounts.id.initialize({
        client_id: googleOAuthClientId,
        callback: handleCredentialResponse,
        login_uri: 'http://localhost:3000/'
    })

    window.google.accounts.id.renderButton(
        button, {
            type: 'standard',
            size: 'large',
            logo_alignment: 'center',
        }
    )
}