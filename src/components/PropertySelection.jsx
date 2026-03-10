import React, { useState } from 'react';
import { Building2, MapPin, Calendar, Banknote, Search, CheckCircle2, ChevronRight } from 'lucide-react';

const PropertySelection = ({ properties, formData, updateFormData, onNext }) => {
    const [selectedId, setSelectedId] = useState(formData.property?.id || '');

    const selectedProperty = properties.find(p => p.id === selectedId);

    const handleSelect = (e) => {
        const id = e.target.value;
        setSelectedId(id);
        const prop = properties.find(p => p.id === id);
        updateFormData('property', prop);
    };

    const calculateTotalDeposit = (breakdown) => {
        if (!breakdown) return 0;
        return Object.values(breakdown).reduce((sum, val) => sum + (val || 0), 0);
    };

    return (
        <div className="animate-fade-in">
            <div className="card glass">
                <h2 className="section-title">Select Rental Property</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                    Please select the unit you are applying for from the list below.
                </p>

                <div className="form-group" style={{ position: 'relative' }}>
                    <label htmlFor="property-search">Property Search</label>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={18}
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                        />
                        <select
                            id="property-search"
                            value={selectedId}
                            onChange={handleSelect}
                            style={{ paddingLeft: '2.5rem' }}
                        >
                            <option value="">-- Choose a property --</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.displayName} - {p.suburb}, {p.city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedProperty && (
                    <div className="card" style={{ background: 'var(--primary)', color: 'white', marginTop: '2rem', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    {selectedProperty.displayName}
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.9, marginBottom: '0.5rem' }}>
                                    <MapPin size={16} />
                                    <span>{selectedProperty.streetAddress}, {selectedProperty.suburb}, {selectedProperty.city}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.9 }}>
                                        <Calendar size={16} />
                                        <span>Available: {selectedProperty.availableFrom}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.9 }}>
                                        <Banknote size={16} />
                                        <span>Rent: R{selectedProperty.monthlyRent.toLocaleString()} /mo</span>
                                    </div>
                                </div>
                            </div>
                            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', minWidth: '250px', background: 'rgba(255,255,255,0.1)' }}>
                                <h4 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
                                    Financial Summary
                                </h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Monthly Rent:</span>
                                    <span>R{selectedProperty.monthlyRent.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Credit Check Fee:</span>
                                    <span>R{selectedProperty.creditCheckFee.toLocaleString()}</span>
                                </div>
                                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Deposit Breakdown:</span>
                                    {Object.entries(selectedProperty.depositBreakdown).map(([key, value]) => (
                                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8, marginTop: '0.2rem' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                            <span>R{value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent-light)' }}>
                                    <span>Total Deposit:</span>
                                    <span>R{calculateTotalDeposit(selectedProperty.depositBreakdown).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.propertyConfirmed}
                                        onChange={(e) => updateFormData('propertyConfirmed', e.target.checked)}
                                        style={{ width: 'auto' }}
                                    />
                                    <span>Is this the correct property you are applying for?</span>
                                </label>
                            </div>
                            <button
                                className="btn"
                                style={{ background: 'var(--accent)', color: 'var(--primary)' }}
                                disabled={!formData.propertyConfirmed}
                                onClick={onNext}
                            >
                                Start Application <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!selectedProperty && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Building2 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>Select a property to begin your application process.</p>
                </div>
            )}
        </div>
    );
};

export default PropertySelection;
