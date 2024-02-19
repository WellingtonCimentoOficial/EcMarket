const mp = new MercadoPago("");


(async function getIdentificationTypes() {
    try {
      const identificationTypes = await mp.getIdentificationTypes();
      const identificationTypeElement = document.getElementById('form-checkout__identificationType');

      createSelectOptions(identificationTypeElement, identificationTypes);
    } catch (e) {
      return console.error('Error getting identificationTypes: ', e);
    }
})();

function createSelectOptions(elem, options, labelsAndKeys = { label: "name", value: "id" }) {
    const { label, value } = labelsAndKeys;

    elem.options.length = 0;

    const tempOptions = document.createDocumentFragment();

    options.forEach(option => {
        const optValue = option[value];
        const optLabel = option[label];

        const opt = document.createElement('option');
        opt.value = optValue;
        opt.textContent = optLabel;

        tempOptions.appendChild(opt);
    });

    elem.appendChild(tempOptions);
}

const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const payload = {
        payment_method_id: 'pix',
        payer: {
            first_name: formData.get("payerFirstName"),
            last_name: formData.get("payerLastName"),
            identification: {
                type: formData.get("identificationType"),
                number: formData.get("identificationNumber")
            }
        },
        
    }
    const response = await fetch("http://127.0.0.1:8000/transactions/process_payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(payload)
    })
    const data = await response.json()
    if(response.status === 200){
        console.log("pagamento com sucesso")
    }else{
        console.log(data)
    }
}

document.getElementById("form-checkout").addEventListener('submit', handleSubmit)
