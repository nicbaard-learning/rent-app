import React from 'react';
import { Users, User, Baby, Dog, Car, Trash2, PlusCircle, ArrowRight } from 'lucide-react';

const HouseholdDetails = ({ formData, updateFormData, onNext, onBack }) => {
    const handleHouseholdChange = (field, value) => {
        updateFormData('household', { ...formData.household, [field]: value });
    };

    const handleVehicleChange = (index, field, value) => {
        const vehicles = [...formData.household.vehicles];
        vehicles[index] = { ...vehicles[index], [field]: value };
        handleHouseholdChange('vehicles', vehicles);
    };

    const addVehicle = () => {
        const vehicles = [...formData.household.vehicles, { type: '', registration: '' }];
        handleHouseholdChange('vehicles', vehicles);
    };

    const removeVehicle = (index) => {
        const vehicles = formData.household.vehicles.filter((_, i) => i !== index);
        handleHouseholdChange('vehicles', vehicles);
    };

    return (
        <div className="animate-fade-in">
            <div className="card glass">
                <h2 className="section-title">Household & General Details</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Please specify who will be residing at the premises for the duration of the lease.
                </p>

                <div className="grid-2">
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={16} /> Number of Adults
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.household.adults}
                            onChange={(e) => handleHouseholdChange('adults', parseInt(e.target.value))}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Baby size={16} /> Number of Children
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.household.children}
                            onChange={(e) => handleHouseholdChange('children', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {formData.household.children > 0 && (
                    <div className="form-group">
                        <label>Children's Ages and Schools (optional)</label>
                        <textarea
                            rows="3"
                            placeholder="e.g. 5 (Primary School), 12 (High School)"
                            value={formData.household.childrenDetails}
                            onChange={(e) => handleHouseholdChange('childrenDetails', e.target.value)}
                        />
                    </div>
                )}

                <div className="grid-2">
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Dog size={16} /> Number of Pets
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.household.pets}
                            onChange={(e) => handleHouseholdChange('pets', parseInt(e.target.value))}
                        />
                    </div>
                    {formData.household.pets > 0 && (
                        <div className="form-group">
                            <label>Type of Pets</label>
                            <input
                                type="text"
                                placeholder="e.g. 2 x Small Dogs"
                                value={formData.household.petsType}
                                onChange={(e) => handleHouseholdChange('petsType', e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <h3 className="section-title" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Car size={20} /> Vehicle Details
                </h3>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    List all vehicles that will be kept at the premises.
                </p>

                {formData.household.vehicles.map((v, index) => (
                    <div key={index} className="grid-2 card" style={{ padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Vehicle {index + 1} Type</label>
                            <input
                                type="text"
                                placeholder="Car, Motorcycle, bakkie, etc."
                                value={v.type}
                                onChange={(e) => handleVehicleChange(index, 'type', e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                            <label>Registration Number</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={v.registration}
                                    onChange={(e) => handleVehicleChange(index, 'registration', e.target.value)}
                                />
                                <button
                                    className="btn"
                                    style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem' }}
                                    onClick={() => removeVehicle(index)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    className="btn btn-outline"
                    onClick={addVehicle}
                    style={{ width: '100%', borderStyle: 'dashed', opacity: 0.8 }}
                >
                    <PlusCircle size={18} /> Add Vehicle
                </button>

                <h3 className="section-title" style={{ marginTop: '3rem' }}>Credit & Debt History</h3>

                <div className="form-group">
                    <label>Have you (or either of you) ever had any court judgments or payment defaults granted against you?</label>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                            <input
                                type="radio"
                                name="judgments"
                                checked={formData.credit.hasJudgments === true}
                                onChange={() => updateFormData('credit', { ...formData.credit, hasJudgments: true })}
                                style={{ width: 'auto' }}
                            /> Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                            <input
                                type="radio"
                                name="judgments"
                                checked={formData.credit.hasJudgments === false}
                                onChange={() => updateFormData('credit', { ...formData.credit, hasJudgments: false })}
                                style={{ width: 'auto' }}
                            /> No
                        </label>
                    </div>
                    {formData.credit.hasJudgments && (
                        <textarea
                            className="animate-fade-in"
                            style={{ marginTop: '1rem' }}
                            rows="3"
                            placeholder="Please provide details..."
                            value={formData.credit.judgmentDetails}
                            onChange={(e) => updateFormData('credit', { ...formData.credit, judgmentDetails: e.target.value })}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Are you (or either of you) currently under, or have you ever undergone, debt review proceedings?</label>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                            <input
                                type="radio"
                                name="debtReview"
                                checked={formData.credit.isUnderDebtReview === true}
                                onChange={() => updateFormData('credit', { ...formData.credit, isUnderDebtReview: true })}
                                style={{ width: 'auto' }}
                            /> Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                            <input
                                type="radio"
                                name="debtReview"
                                checked={formData.credit.isUnderDebtReview === false}
                                onChange={() => updateFormData('credit', { ...formData.credit, isUnderDebtReview: false })}
                                style={{ width: 'auto' }}
                            /> No
                        </label>
                    </div>
                    {formData.credit.isUnderDebtReview && (
                        <textarea
                            className="animate-fade-in"
                            style={{ marginTop: '1rem' }}
                            rows="3"
                            placeholder="Please provide details..."
                            value={formData.credit.debtReviewDetails}
                            onChange={(e) => updateFormData('credit', { ...formData.credit, debtReviewDetails: e.target.value })}
                        />
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={onBack}>Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue to Employment <ArrowRight size={18} /></button>
            </div>
        </div>
    );
};

export default HouseholdDetails;
