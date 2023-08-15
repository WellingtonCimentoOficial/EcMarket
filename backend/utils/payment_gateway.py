import os
import requests

class Gateway:
    def __init__(self):
        self.base_url = "https://api.mercadopago.com"
        self.access_token = os.getenv('GATEWAY_ACCESS_TOKEN')

    def create_payment(self, payment_data):
        response = requests.post(self.base_url + '/v1/payments', json=payment_data, headers={'Content-Type': 'application/json','Authorization': f'Bearer {self.access_token}'})
        return response

    def get_payment(self, payment_id):
        response = requests.get(self.base_url + f'/v1/payments/{payment_id}', headers={'Authorization': f'Bearer {self.access_token}'})
        return response
    
    def save_card(self, customer_id, payment_data):
        response = requests.post(self.base_url + f'/v1/customers/{customer_id}/cards', json=payment_data, headers={'Content-Type': 'application/json','Authorization': f'Bearer {self.access_token}'})
        return response
    
    def get_card(self, customer_id, card_id):
        response = requests.get(self.base_url + f'/v1/customers/{customer_id}/cards/{card_id}', headers={'Authorization': f'Bearer {self.access_token}'})
        return response
    
    def get_cards(self, customer_id):
        response = requests.get(self.base_url + f'/v1/customers/{customer_id}/cards', headers={'Authorization': f'Bearer {self.access_token}'})
        return response
    
    def update_card(self, customer_id, card_id, card_data):
        response = requests.put(self.base_url + f'/v1/customers/{customer_id}/cards/{card_id}', json=card_data, headers={'Content-Type': 'application/json','Authorization': f'Bearer {self.access_token}'})
        return response
    
    def delete_card(self, customer_id, card_id):
        response = requests.delete(self.base_url + f'/v1/customers/{customer_id}/cards/{card_id}', headers={'Authorization': f'Bearer {self.access_token}'})
        return response
    
    def create_customer(self, payment_data):
        response = requests.post(self.base_url + f'/v1/customers/', json=payment_data, headers={'Content-Type': 'application/json','Authorization': f'Bearer {self.access_token}'})
        return response
    
    def search_customer(self, email):
        response = requests.get(self.base_url + f'/v1/customers/search?email={email}', headers={'Authorization': f'Bearer {self.access_token}'})
        return response
    
    def get_customer(self, customer_id):
        response = requests.get(self.base_url + f'/v1/customers/{customer_id}', headers={'Authorization': f'Bearer {self.access_token}'})
        return response
    
    def update_customer(self, customer_id, payment_data):
        response = requests.put(self.base_url + f'/v1/customers/{customer_id}', json=payment_data, headers={'Content-Type': 'application/json','Authorization': f'Bearer {self.access_token}'})
        return response
    
    