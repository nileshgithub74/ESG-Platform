import csv
import os
from datetime import datetime, timedelta
import random

def generate_sample_csvs():
    """Generate realistic sample CSV files with messy data"""
    
    output_dir = 'sample_data'
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. SAP Fuel/Procurement CSV
    sap_data = [
        # Clean records
        {'plant_code': 'P001', 'material_description': 'Diesel Fuel', 'quantity': '5000', 'unit': 'gallons', 
         'posting_date': '2024-01-15', 'cost_center': 'CC-100', 'vendor_name': 'FuelCorp'},
        {'plant_code': 'P002', 'material_description': 'Natural Gas', 'quantity': '12000', 'unit': 'm3', 
         'posting_date': '2024-01-20', 'cost_center': 'CC-200', 'vendor_name': 'GasSupply Inc'},
        {'plant_code': 'P001', 'material_description': 'Gasoline Premium', 'quantity': '3500', 'unit': 'liters', 
         'posting_date': '2024-02-01', 'cost_center': 'CC-100', 'vendor_name': 'FuelCorp'},
        
        # Messy records
        {'plant_code': 'P003', 'material_description': 'DIESEL', 'quantity': '', 'unit': 'gal',  # Missing quantity
         'posting_date': '2024-02-10', 'cost_center': 'CC-300', 'vendor_name': 'Unknown'},
        {'plant_code': 'P001', 'material_description': 'Diesel Fuel', 'quantity': '150000', 'unit': 'gallons',  # Suspicious high
         'posting_date': '2024-02-15', 'cost_center': 'CC-100', 'vendor_name': 'FuelCorp'},
        {'plant_code': 'P002', 'material_description': 'Office Supplies', 'quantity': '50', 'unit': 'units',  # Non-fuel
         'posting_date': '', 'cost_center': 'CC-200', 'vendor_name': 'OfficeMax'},  # Missing date
        {'plant_code': 'P004', 'material_description': 'LPG', 'quantity': '8000', 'unit': 'kg', 
         'posting_date': '01/30/2024', 'cost_center': 'CC-400', 'vendor_name': 'PropaneWorld'},  # Different date format
    ]
    
    with open(f'{output_dir}/sap_sample.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['plant_code', 'material_description', 'quantity', 'unit', 
                                                'posting_date', 'cost_center', 'vendor_name'])
        writer.writeheader()
        writer.writerows(sap_data)
    
    # 2. Utility Electricity CSV
    utility_data = [
        # Clean records
        {'meter_id': 'MTR-001', 'site_name': 'HQ Building', 'billing_start': '2024-01-01', 
         'billing_end': '2024-01-31', 'consumption_value': '45000', 'unit': 'kWh', 'tariff_type': 'Commercial'},
        {'meter_id': 'MTR-002', 'site_name': 'Warehouse A', 'billing_start': '2024-01-01', 
         'billing_end': '2024-01-31', 'consumption_value': '120000', 'unit': 'kWh', 'tariff_type': 'Industrial'},
        {'meter_id': 'MTR-003', 'site_name': 'Office Park', 'billing_start': '2024-02-01', 
         'billing_end': '2024-02-29', 'consumption_value': '0.5', 'unit': 'MWh', 'tariff_type': 'Commercial'},
        
        # Messy records
        {'meter_id': 'MTR-001', 'site_name': 'HQ Building', 'billing_start': '2024-02-01', 
         'billing_end': '', 'consumption_value': '48000', 'unit': 'kWh', 'tariff_type': 'Commercial'},  # Missing end date
        {'meter_id': 'MTR-004', 'site_name': 'Data Center', 'billing_start': '2024-01-01', 
         'billing_end': '2024-01-31', 'consumption_value': '2500000', 'unit': 'kWh', 'tariff_type': 'Industrial'},  # Suspicious high
        {'meter_id': 'MTR-005', 'site_name': 'Branch Office', 'billing_start': '01/01/2024', 
         'billing_end': '01/31/2024', 'consumption_value': '15', 'unit': 'MWh', 'tariff_type': 'Commercial'},  # Different date format
        {'meter_id': 'MTR-002', 'site_name': 'Warehouse A', 'billing_start': '2024-02-01', 
         'billing_end': '2024-02-29', 'consumption_value': '', 'unit': 'kWh', 'tariff_type': 'Industrial'},  # Missing consumption
    ]
    
    with open(f'{output_dir}/utility_sample.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['meter_id', 'site_name', 'billing_start', 'billing_end', 
                                                'consumption_value', 'unit', 'tariff_type'])
        writer.writeheader()
        writer.writerows(utility_data)
    
    # 3. Corporate Travel CSV
    travel_data = [
        # Clean records
        {'employee_name': 'John Smith', 'departure_airport': 'JFK', 'arrival_airport': 'LAX', 
         'travel_mode': 'flight', 'distance_km': '3980', 'hotel_nights': '3', 'booking_date': '2024-01-10'},
        {'employee_name': 'Jane Doe', 'departure_airport': 'ORD', 'arrival_airport': 'SFO', 
         'travel_mode': 'air', 'distance_km': '2960', 'hotel_nights': '2', 'booking_date': '2024-01-15'},
        {'employee_name': 'Bob Johnson', 'departure_airport': 'BOS', 'arrival_airport': 'ATL', 
         'travel_mode': 'Flight', 'distance_km': '1500', 'hotel_nights': '1', 'booking_date': '2024-02-01'},
        {'employee_name': 'Alice Williams', 'departure_airport': 'NYC', 'arrival_airport': 'DC', 
         'travel_mode': 'train', 'distance_km': '360', 'hotel_nights': '0', 'booking_date': '2024-02-05'},
        
        # Messy records
        {'employee_name': 'Mike Brown', 'departure_airport': 'LAX', 'arrival_airport': 'SYD', 
         'travel_mode': 'plane', 'distance_km': '75000', 'hotel_nights': '5', 'booking_date': '2024-02-10'},  # Suspicious distance
        {'employee_name': 'Sarah Davis', 'departure_airport': 'DFW', 'arrival_airport': 'MIA', 
         'travel_mode': 'flight', 'distance_km': '', 'hotel_nights': '2', 'booking_date': '2024-02-15'},  # Missing distance
        {'employee_name': 'Tom Wilson', 'departure_airport': 'SEA', 'arrival_airport': 'PDX', 
         'travel_mode': 'car', 'distance_km': '280', 'hotel_nights': '0', 'booking_date': ''},  # Missing date
        {'employee_name': 'Emma Martinez', 'departure_airport': 'PHX', 'arrival_airport': 'LAS', 
         'travel_mode': 'rental', 'distance_km': '420', 'hotel_nights': '1', 'booking_date': '02/20/2024'},  # Different date format
    ]
    
    with open(f'{output_dir}/travel_sample.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['employee_name', 'departure_airport', 'arrival_airport', 
                                                'travel_mode', 'distance_km', 'hotel_nights', 'booking_date'])
        writer.writeheader()
        writer.writerows(travel_data)
    
    print(f"Sample CSV files generated in '{output_dir}/' directory:")
    print("- sap_sample.csv")
    print("- utility_sample.csv")
    print("- travel_sample.csv")
