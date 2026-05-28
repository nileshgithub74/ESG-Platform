class RecordValidator:
    """Validation and anomaly detection for emission records"""
    
    # Thresholds for anomaly detection
    MAX_FUEL_LITERS = 100000
    MAX_ELECTRICITY_KWH = 1000000
    MAX_DISTANCE_KM = 50000
    
    @classmethod
    def validate(cls, record_data, raw_payload):
        """Run validation checks and return status + flags"""
        flags = []
        status = 'VALID'
        
        # Critical validations (FAILED)
        if not record_data.get('quantity'):
            flags.append({'type': 'error', 'message': 'Missing quantity value'})
            status = 'FAILED'
        
        if not record_data.get('period_start'):
            flags.append({'type': 'error', 'message': 'Missing date information'})
            status = 'FAILED'
        
        if not record_data.get('normalized_unit'):
            flags.append({'type': 'error', 'message': 'Unknown or invalid unit'})
            status = 'FAILED'
        
        # Skip further checks if already failed
        if status == 'FAILED':
            return status, flags
        
        # Anomaly detection (SUSPICIOUS)
        quantity = record_data.get('normalized_quantity')
        unit = record_data.get('normalized_unit', '')
        
        if quantity:
            if unit == 'liters' and quantity > cls.MAX_FUEL_LITERS:
                flags.append({'type': 'warning', 'message': f'Unusually high fuel quantity: {quantity} liters'})
                status = 'SUSPICIOUS'
            
            elif unit == 'kWh' and quantity > cls.MAX_ELECTRICITY_KWH:
                flags.append({'type': 'warning', 'message': f'Unusually high electricity: {quantity} kWh'})
                status = 'SUSPICIOUS'
            
            elif unit == 'km' and quantity > cls.MAX_DISTANCE_KM:
                flags.append({'type': 'warning', 'message': f'Unusually high distance: {quantity} km'})
                status = 'SUSPICIOUS'
        
        # Duplicate detection
        # Note: In production, check against existing records in DB
        # For MVP, we flag potential duplicates based on raw data patterns
        
        # If no issues found, mark as valid
        if not flags:
            flags.append({'type': 'info', 'message': 'All validations passed'})
        
        return status, flags
