import os
import json

def load_json_data(subdir, file_name):
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        static_dir = os.path.join(current_dir, '../../static', subdir)  # Static folder explicitly included
        file_path = os.path.join(static_dir, file_name)
        
        with open(file_path, 'r') as json_file:
            return json.load(json_file)
    except FileNotFoundError:
        return {"error": f"File {file_name} not found in {subdir}"}
    except json.JSONDecodeError:
        return {"error": f"Error decoding JSON file: {file_name}"}

def print_all_data():
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

    # Print all data to the terminal
    for key, value in all_data.items():
        print(f"\nCategory: {key}")
        print(json.dumps(value, indent=4))  # Pretty-print JSON data
    
    print("\nLength of entries in each category:")
    for key, value in all_data.items():
        if isinstance(value, list):
            print(f"{key}: {len(value)} entries")
        else:
            print(f"{key}: {len(value) if isinstance(value, dict) else 'N/A'} entries")

# Run the script
if __name__ == "__main__":
    print_all_data()
