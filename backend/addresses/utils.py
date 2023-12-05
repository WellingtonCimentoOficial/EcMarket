import requests
from .exceptions import InvalidAddressError
from transactions.exceptions import InternalError

UF_TO_STATE = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins",
}

def validate_address(street, number, district, city, state, uf, zip_code):
    try:
        int(number)
    except:
        raise InvalidAddressError()
    
    if not str(zip_code).isdigit():
        raise InvalidAddressError()

    try:
        response = requests.get(f'https://viacep.com.br/ws/{zip_code}/json/')
        if response.status_code == 200:
            data = response.json()
            if street == data["logradouro"] and district == data["bairro"] and city == data["localidade"] and str(uf).upper() == data["uf"] and state == UF_TO_STATE.get(str(data["uf"]).upper()):
                return True
            raise InvalidAddressError()
        raise InternalError()
    except InvalidAddressError as e:
        raise e
    except:
        raise InternalError()