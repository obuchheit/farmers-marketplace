import os
import pandas as pd
import json

# Get the absolute path to the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the CSV file
csv_file_path = os.path.join(current_dir, 'csa.csv') 

# Load the CSV data
df = pd.read_csv(csv_file_path, low_memory=False)

# Process only the first 10 entries
df_subset = df.head(3)

# Select specific columns to include in the JSON output
columns_to_include = ['listing_id', 'listing_name', 'location_address', 'location_x', 'location_y', 'orgnization', 'listing_desc']
df_subset = df_subset[columns_to_include]

# Convert DataFrame to JSON string
json_data = df_subset.to_json(orient='records') 
print(json.dumps(json_data, indent=4))

# Save the JSON data to a file with pretty formatting
json_file_path = os.path.join(current_dir, 'csaJSON.json')
with open(json_file_path, 'w') as json_file:
    json.dump(json.loads(json_data), json_file, indent=4)

print(f"JSON data saved to {json_file_path}")