import requests 

class Correios:
    def __init__(self, username, APItoken):
        self.username = username
        self.APItoken = APItoken

    def get_token(self):
        url = "https://api.correios.com.br/token/v1/autentica"

        try:
            response = requests.post(url, auth=(self.username, self.APItoken))

            if response.status_code == 200 or response.status_code == 201:
                return response.json()['token']
        except:
            return ''
        
    def get_delivery_time(self, token, source_zip_code, destination_zip_code):
        url = f"https://apihom.correios.com.br/prazo/v1/nacional/03220?cepOrigem={source_zip_code}&cepDestino={destination_zip_code}"

        headers = {
            'Authorization': 'Bearer ' + token
        }

        try:
            response = requests.get(url, headers=headers)

            fake_response = {
                "coProduto": "03220",
                "prazoEntrega": 1,
                "dataMaxima": "2022-03-22T23:58:00",
                "entregaDomiciliar": "S",
                "entregaSabado": "N"
            }

            if response.status_code == 200 or response.status_code == 201:
                return response.json()
            return fake_response
        except:
            return {}
        
    def get_delivery_price(self, token, source_zip_code, destination_zip_code, obj_weight, obj_length, obj_width, obj_height):
        url = ("https://apihom.correios.com.br/preco/v1/nacional/03220?"
            f"cepDestino={destination_zip_code}&"
            f"cepOrigem={source_zip_code}&"
            f"psObjeto={obj_weight}&"
            f"tpObjeto=2&"
            f"comprimento={obj_length}&"
            f"largura={obj_width}&"
            f"altura={obj_height}&"
            "servicosAdicionais=019&"
            "servicosAdicionais=001&"
            "vlDeclarado=200"
        )

        headers = {
            'Authorization': 'Bearer ' + token
        }

        try:
            response = requests.get(url, headers=headers)

            fake_response = {
                "coProduto": "03220",
                "pcBase": "10,68",
                "pcBaseGeral": "11,13",
                "peVariacao": "0,0000",
                "pcReferencia": "11,13",
                "vlBaseCalculoImposto": "19,92",
                "inPesoCubico": "N",
                "psCobrado": "300",
                "servicoAdicional": [
                    {
                        "coServAdicional": "019",
                        "tpServAdicional": "V",
                        "pcServicoAdicional": "1,79"
                    },
                    {
                        "coServAdicional": "001",
                        "tpServAdicional": "A",
                        "pcServicoAdicional": "7,00"
                    }
                ],
                "peAdValorem": "0,0100",
                "vlSeguroAutomatico": "21,00",
                "qtAdicional": "0",
                "pcFaixa": "11,13",
                "pcFaixaVariacao": "11,13",
                "pcProduto": "11,13",
                "pcTotalServicosAdicionais": "8,79",
                "pcFinal": "19,92"
            }

            if response.status_code == 200 or response.status_code == 201:
                return response.json()
            return fake_response
        except:
            return {}
        
    def get_zip_code_info(self, token, destination_zip_code):
        url = f"https://apihom.correios.com.br/cep/v1/enderecos/{destination_zip_code}"

        headers = {
            'Authorization': 'Bearer ' + token
        }

        try:
            response = requests.get(url, headers=headers)

            fake_response = {
                "cep": "01001001",
                "uf": "SP",
                "localidade": "São Paulo",
                "logradouro": "Praça da Sé",
                "tipoLogradouro": "Praça",
                "nomeLogradouro": "da Sé",
                "complemento": "- lado par",
                "abreviatura": "Pç da Sé",
                "bairro": "Sé",
                "numeroLocalidade": 96681,
                "tipoCEP": 2,
                "cepUnidadeOperacional": "01032970",
                "lado": "P",
                "numeroInicial": 0,
                "numeroFinal": 998
            }

            if response.status_code == 200 or response.status_code == 201:
                return response.json()
            return fake_response
        except:
            return {}
        
    def validate_zip_code(self, zip_code):
        if zip_code.isdigit() and len(zip_code) == 8:
            return True
        return False