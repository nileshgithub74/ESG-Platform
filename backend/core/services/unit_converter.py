class UnitConverter:
    """Utility for normalizing units across different measurement systems"""
    
    # Volume conversions to liters
    VOLUME_TO_LITERS = {
        'l': 1.0,
        'liter': 1.0,
        'liters': 1.0,
        'gal': 3.78541,
        'gallon': 3.78541,
        'gallons': 3.78541,
        'm3': 1000.0,
        'cubic_meter': 1000.0,
    }
    
    # Energy conversions to kWh
    ENERGY_TO_KWH = {
        'kwh': 1.0,
        'mwh': 1000.0,
        'gwh': 1000000.0,
        'kj': 0.000277778,
        'mj': 0.277778,
        'gj': 277.778,
    }
    
    # Distance conversions to km
    DISTANCE_TO_KM = {
        'km': 1.0,
        'kilometer': 1.0,
        'kilometers': 1.0,
        'mi': 1.60934,
        'mile': 1.60934,
        'miles': 1.60934,
        'm': 0.001,
        'meter': 0.001,
        'meters': 0.001,
    }
    
    @classmethod
    def normalize_volume(cls, value, unit):
        """Convert volume to liters"""
        unit_lower = unit.lower().strip()
        factor = cls.VOLUME_TO_LITERS.get(unit_lower)
        if factor:
            return float(value) * factor, 'liters'
        return float(value), unit
    
    @classmethod
    def normalize_energy(cls, value, unit):
        """Convert energy to kWh"""
        unit_lower = unit.lower().strip()
        factor = cls.ENERGY_TO_KWH.get(unit_lower)
        if factor:
            return float(value) * factor, 'kWh'
        return float(value), unit
    
    @classmethod
    def normalize_distance(cls, value, unit):
        """Convert distance to km"""
        unit_lower = unit.lower().strip()
        factor = cls.DISTANCE_TO_KM.get(unit_lower)
        if factor:
            return float(value) * factor, 'km'
        return float(value), unit
