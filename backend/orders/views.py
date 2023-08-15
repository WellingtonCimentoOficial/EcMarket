from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from orders.models import Order
from rest_framework import status
from utils.payment_gateway import Gateway

# Create your views here.