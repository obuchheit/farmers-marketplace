from django.http import JsonResponse
import os
import json

def load_json_data(subdir, file_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(current_dir, '..', subdir)
    file_path = os.path.join(static_dir, file_name)
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
    return data

def get_all_data(request):
    agritourism_data = load_json_data('agritourism', 'agritourismJSON.json')
    csa_data = load_json_data('csa', 'csaJSON.json')
    farmers_market_data = load_json_data('farmers_market', 'farmers_marketJSON.json')
    foodhub_data = load_json_data('foodhub', 'foodhubJSON.json')
    on_farm_market_data = load_json_data('on_farm_market', 'on_farm_marketJSON.json')

    all_data = {
        'agritourism': agritourism_data,
        'csa': csa_data,
        'farmers_market': farmers_market_data,
        'foodhub': foodhub_data,
        'on_farm_market': on_farm_market_data,
    }
    return JsonResponse(all_data)