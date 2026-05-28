import csv
import os
from datetime import date

# Create sample_data directory
output_dir = 'sample_data'
os.makedirs(output_dir, exist_ok=True)

# 1. SAP Sample CSV
sap_data = [
    {
        'plant_code': 'P001',
        'material_description': 'Diesel Fuel',
        'quantity': '5000',
        'unit': 'gallons',
        'posting_date': '2026-05-28',
        'cost_center': 'CC-100',
        'vendor_name': 'FuelCorp'
    },
    {
        'plant_code': 'P002',
        'material_description': 'Natural Gas',
        'quantity': '12000',
        'unit': 'm3',
        'posting_date': '2026-05-28',
        'cost_center': 'CC-200',
        'vendor_name': 'GasSupply Inc'
    },
    {
        'plant_code': 'P003',
        'material_description': 'Gasoline Premium',
        'quantity': '3500',
        'unit': 'liters',
        'posting_date': '2026-05-27',
        'cost_center': 'CC-300',
        'vendor_name': 'FuelCorp'
    }
]

with open(f'{output_dir}/sap_sample.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['plant_code', 'material_description', 'quantity', 'unit', 'posting_date', 'cost_center', 'vendor_name'])
    writer.writeheader()
    writer.writerows(sap_data)

print(f"Created: {output_dir}/sap_sample.csv")

# 2. Utility Sample CSV
utility_data = [
    {
        'meter_id': 'MTR-001',
        'site_name': 'HQ Building',
        'billing_start': '2026-05-01',
        'billing_end': '2026-05-31',
        'consumption_value': '45000',
        'unit': 'kWh',
        'tariff_type': 'Commercial'
    },
    {
        'meter_id': 'MTR-002',
        'site_name': 'Warehouse A',
        'billing_start': '2026-04-01',
        'billing_end': '2026-04-30',
        'consumption_value': '120000',
        'unit': 'kWh',
        'tariff_type': 'Industrial'
    },
    {
        'meter_id': 'MTR-003',
        'site_name': 'Office Park',
        'billing_start': '2026-05-01',
        'billing_end': '2026-05-31',
        'consumption_value': '0.5',
        'unit': 'MWh',
        'tariff_type': 'Commercial'
    }
]

with open(f'{output_dir}/utility_sample.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['meter_id', 'site_name', 'billing_start', 'billing_end', 'consumption_value', 'unit', 'tariff_type'])
    writer.writeheader()
    writer.writerows(utility_data)

print(f"Created: {output_dir}/utility_sample.csv")

# 3. Travel Sample CSV
travel_data = [
    {
        'employee_name': 'John Smith',
        'departure_airport': 'JFK',
        'arrival_airport': 'LAX',
        'travel_mode': 'flight',
        'distance_km': '3980',
        'hotel_nights': '3',
        'booking_date': '2026-05-28'
    },
    {
        'employee_name': 'Alice Williams',
        'departure_airport': 'NYC',
        'arrival_airport': 'DC',
        'travel_mode': 'train',
        'distance_km': '250',
        'hotel_nights': '0',
        'booking_date': '2026-05-28'
    },
    {
        'employee_name': 'Bob Johnson',
        'departure_airport': 'ORD',
        'arrival_airport': 'SFO',
        'travel_mode': 'flight',
        'distance_km': '2960',
        'hotel_nights': '2',
        'booking_date': '2026-05-27'
    }
]

with open(f'{output_dir}/travel_sample.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['employee_name', 'departure_airport', 'arrival_airport', 'travel_mode', 'distance_km', 'hotel_nights', 'booking_date'])
    writer.writeheader()
    writer.writerows(travel_data)

print(f"Created: {output_dir}/travel_sample.csv")

print(f"\n✓ All sample CSV files created in '{output_dir}/' directory")
print("\nYou can now upload these files through the Upload Center:")
print("  1. sap_sample.csv - For SAP fuel/procurement data")
print("  2. utility_sample.csv - For utility electricity data")
print("  3. travel_sample.csv - For corporate travel data")
