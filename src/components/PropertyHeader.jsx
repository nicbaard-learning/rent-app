import React from 'react';
import { MapPin, Calendar, Banknote, Info } from 'lucide-react';

const PropertyHeader = ({ property }) => {
    if (!property) return null;

    const calculateTotalDeposit = (breakdown) => {
        if (!breakdown) return 0;
        return Object.values(breakdown).reduce((sum, val) => sum + (val || 0), 0);
    };

    return (
        <div className="card animate-fade-in" style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                        {property.displayName}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.9, fontSize: '0.85rem' }}>
                        <MapPin size={14} />
                        <span>{property.streetAddress}, {property.suburb}, {property.city}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.9 }}>
                        <Calendar size={14} />
                        <span>Available: {property.availableFrom}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.9 }}>
                        <Banknote size={14} />
                        <span>Rent: R{property.monthlyRent.toLocaleString()} /mo</span>
                    </div>
                </div>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.8rem'
            }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                        <span style={{ opacity: 0.7, marginRight: '8px' }}>Credit Check Fee:</span>
                        <strong>R{property.creditCheckFee.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ opacity: 0.7 }}>Deposit Breakdown:</span>
                        {Object.entries(property.depositBreakdown).map(([key, value]) => (
                            <span key={key} style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-light)' }}>
                                {key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}: R{value.toLocaleString()}
                            </span>
                        ))}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <span style={{ opacity: 0.7, marginRight: '8px' }}>Total Deposit:</span>
                        <strong style={{ color: 'var(--accent-light)', fontSize: '1rem' }}>R{calculateTotalDeposit(property.depositBreakdown).toLocaleString()}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyHeader;
