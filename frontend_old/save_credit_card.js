const mp = new MercadoPago('');

var cards = []

const securityCodeElement = mp.fields.create('securityCode', {
    placeholder: "CVV"
}).mount('form-checkout__securityCode-container');


const get_cards = async () => {
    const response = await fetch("http://127.0.0.1:8000/cards/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
    })
    const data = await response.json()
    if(response.status == 200){
        return data
    }
}

const formatCards = (cards) => {
    let new_data = []
    cards.forEach(card => {
        new_data.push({
            "id": card.gateway_card_id,
            "last_four_digits": card.last_four_digits,
            "payment_method": {
                "name": card.paymentmethod_name,
            },
            "security_code": {
                "length": card.secutirycode_length,
            }
        })
    })
    return new_data
}

function appendCardToSelect(data) {
    const selectElement = document.getElementById('form-checkout__cardId');
    const tmpFragment = document.createDocumentFragment();
    data.forEach(({ id, last_four_digits, payment_method }) => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', id)
        optionElement.textContent = `${payment_method.name} terminado em ${last_four_digits}`
        tmpFragment.appendChild(optionElement);
    })
    selectElement.appendChild(tmpFragment)
}

const formElement = document.getElementById('form-checkout');
formElement.addEventListener('submit', e => createCardToken(e));
const createCardToken = async (event) => {
    try {
        const tokenElement = document.getElementById('token');
        if (!tokenElement.value) {
            event.preventDefault();
            cardId = document.getElementById('form-checkout__cardId').value
            const token = await mp.fields.createCardToken({
                cardId: cardId
            });
            tokenElement.value = token.id;
            console.log(token.id);
            sendData(cardId, token.id)
        }
    } catch (e) {
        console.error('error creating card token: ', e)
    }
}

const sendData = async (cardId, token) => {
    console.log(cards.filter(card => card.gateway_card_id === cardId)[0].paymentmethod_id)
    const response = await fetch("http://127.0.0.1:8000/transactions/process_payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
            token,
            payment_method_id: cards.filter(card => card.gateway_card_id === cardId)[0].paymentmethod_id,
            payer: {
                identification: {
                    type: "CPF",
                    number: "12345678909",
                },
            },
            discount_coupon: "AD548SD"
        }),
    });
    const data = await response.json()
    if(response.status === 200){
        console.log("pagamento com sucesso")
    }else{
        console.log(data)
    }
}

window.onload = async () => {
    cards = await get_cards()
    cards_formated = formatCards(cards)
    appendCardToSelect(cards_formated);
}
