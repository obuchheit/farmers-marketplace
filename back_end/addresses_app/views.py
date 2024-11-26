from typing import Any
from django.shortcuts import render
from django.views.generic.edit import CreateView
from .models import Address
import json

class AddressView(CreateView):
    model = Address
    fields = ['address']
    template_name = 'addresses_app/home.html'
    success_url = '/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['token'] = 'pk.eyJ1Ijoib2J1Y2hoZWl0IiwiYSI6ImNtM3AwamlqNTA5YWkya3FhZmt4cXMwMnYifQ.qvtyMdcq82bivZRMyYd7GQ'
        
        # Get all addresses with lat and lon
        addresses = Address.objects.all().values('lat', 'lon')
        
        # Pass the serialized addresses data to the template as a JSON string
        context['addresses'] = json.dumps(list(addresses))

        return context