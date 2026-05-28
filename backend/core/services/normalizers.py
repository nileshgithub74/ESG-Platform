from datetime import datetime
from .unit_converter import UnitConverter

class SAPNormalizer:
    """Normalize SAP fuel/procurement data"""
    
    FUEL_KEYWORDS = ['diesel', 'gasoline', 'petrol', 'fuel', 'natural gas', 'lng', 'lpg']
    
    @classmethod
    def normalize(cls, row_data):
        """Convert SAP row to normalized format"""
        material = row_data.get('material_description', '').lower()
        
        # Determine activity type and scope
        activity_type = cls._classify_material(material)
        scope = cls._determine_scope(material)
        
        # Normalize quantity and unit - handle empty values
        quantity_str = row_data.get('quantity', '').strip()
        quantity = float(quantity_str) if quantity_str else None
        unit = row_data.get('unit', '')
        
        normalized_qty, normalized_unit = cls._normalize_unit(quantity, unit, material)
        
        # Parse date
        period_start = cls._parse_date(row_data.get('posting_date'))
        
        return {
            'activity_type': activity_type,
            'scope_category': scope,
            'quantity': quantity,
            'original_unit': unit,
            'normalized_quantity': normalized_qty,
            'normalized_unit': normalized_unit,
            'period_start': period_start,
            'period_end': period_start,
        }
    
    @classmethod
    def _classify_material(cls, material):
        """Map material description to activity type"""
        if any(fuel in material for fuel in cls.FUEL_KEYWORDS):
            return 'Fuel Combustion'
        return 'Procurement'
    
    @classmethod
    def _determine_scope(cls, material):
        """Determine GHG scope based on material"""
        if any(fuel in material for fuel in cls.FUEL_KEYWORDS):
            return 'SCOPE_1'
        return 'SCOPE_3'
    
    @classmethod
    def _normalize_unit(cls, quantity, unit, material):
        """Normalize units based on material type"""
        if not quantity or not unit:
            return None, unit
        
        # Volume-based fuels
        if any(fuel in material for fuel in ['diesel', 'gasoline', 'petrol']):
            return UnitConverter.normalize_volume(quantity, unit)
        
        # Default: return as-is
        return float(quantity), unit
    
    @classmethod
    def _parse_date(cls, date_str):
        """Parse various date formats"""
        if not date_str:
            return None
        try:
            return datetime.strptime(str(date_str), '%Y-%m-%d').date()
        except:
            try:
                return datetime.strptime(str(date_str), '%m/%d/%Y').date()
            except:
                return None


class UtilityNormalizer:
    """Normalize utility electricity data"""
    
    @classmethod
    def normalize(cls, row_data):
        """Convert utility row to normalized format"""
        consumption_str = row_data.get('consumption_value', '').strip()
        consumption = float(consumption_str) if consumption_str else None
        unit = row_data.get('unit', '')
        
        # Normalize energy units
        normalized_qty, normalized_unit = UnitConverter.normalize_energy(consumption, unit) if consumption else (None, unit)
        
        # Parse billing period
        period_start = cls._parse_date(row_data.get('billing_start'))
        period_end = cls._parse_date(row_data.get('billing_end'))
        
        return {
            'activity_type': 'Electricity Consumption',
            'scope_category': 'SCOPE_2',
            'quantity': consumption,
            'original_unit': unit,
            'normalized_quantity': normalized_qty,
            'normalized_unit': normalized_unit,
            'period_start': period_start,
            'period_end': period_end,
        }
    
    @classmethod
    def _parse_date(cls, date_str):
        """Parse date string"""
        if not date_str:
            return None
        try:
            return datetime.strptime(str(date_str), '%Y-%m-%d').date()
        except:
            try:
                return datetime.strptime(str(date_str), '%m/%d/%Y').date()
            except:
                return None


class TravelNormalizer:
    """Normalize corporate travel data"""
    
    TRAVEL_MODE_MAP = {
        'flight': 'Air Travel',
        'air': 'Air Travel',
        'plane': 'Air Travel',
        'train': 'Rail Travel',
        'rail': 'Rail Travel',
        'car': 'Ground Transport',
        'taxi': 'Ground Transport',
        'rental': 'Ground Transport',
    }
    
    @classmethod
    def normalize(cls, row_data):
        """Convert travel row to normalized format"""
        travel_mode = row_data.get('travel_mode', '').lower()
        activity_type = cls._classify_travel_mode(travel_mode)
        
        # Normalize distance - handle empty values
        distance_str = row_data.get('distance_km', '').strip()
        distance = float(distance_str) if distance_str else None
        normalized_qty, normalized_unit = UnitConverter.normalize_distance(distance, 'km') if distance else (None, 'km')
        
        # Parse booking date
        period_start = cls._parse_date(row_data.get('booking_date'))
        
        return {
            'activity_type': activity_type,
            'scope_category': 'SCOPE_3',
            'quantity': distance,
            'original_unit': 'km',
            'normalized_quantity': normalized_qty,
            'normalized_unit': normalized_unit,
            'period_start': period_start,
            'period_end': period_start,
        }
    
    @classmethod
    def _classify_travel_mode(cls, travel_mode):
        """Map travel mode to activity type"""
        for key, activity in cls.TRAVEL_MODE_MAP.items():
            if key in travel_mode:
                return activity
        return 'Other Travel'
    
    @classmethod
    def _parse_date(cls, date_str):
        """Parse date string"""
        if not date_str:
            return None
        try:
            return datetime.strptime(str(date_str), '%Y-%m-%d').date()
        except:
            try:
                return datetime.strptime(str(date_str), '%m/%d/%Y').date()
            except:
                return None
