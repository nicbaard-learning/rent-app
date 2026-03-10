import React from 'react';
import { User, Users, MapPin, Phone, Mail, Home } from 'lucide-react';

const ApplicantDetails = ({ formData, updateFormData, onNext, onBack }) => {
    const handleApplicantChange = (applicant, field, value) => {
        const section = applicant === 1 ? 'firstApplicant' : 'secondApplicant';
        updateFormData(section, { ...formData[section], [field]: value });
    };

    const handleNestedChange = (applicant, category, field, value) => {
        const section = applicant === 1 ? 'firstApplicant' : 'secondApplicant';
        updateFormData(section, {
            ...formData[section],
            [category]: { ...formData[section][category], [field]: value }
        });
    };

    const renderApplicantForm = (num) => {
        const section = num === 1 ? 'firstApplicant' : 'secondApplicant';
        const data = formData[section];

        return (
            <div className="card" key={num}>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {num === 1 ? <User size={20} /> : <Users size={20} />}
                    {num === 1 ? "First Applicant" : "Second Applicant"} Details
                </h3>

                <div className="grid-2">
                    <div className="form-group">
                        <label>Full Legal Name</label>
                        <input
                            type="text"
                            value={data.fullName || ''}
                            onChange={(e) => handleApplicantChange(num, 'fullName', e.target.value)}
                            placeholder="As shown on ID/Passport"
                        />
                    </div>
                    <div className="form-group">
                        <label>Previous/Maiden Name (if applicable)</label>
                        <input
                            type="text"
                            value={data.previousName || ''}
                            onChange={(e) => handleApplicantChange(num, 'previousName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid-2">
                    <div className="form-group">
                        <label>Identity / Passport Number</label>
                        <input
                            type="text"
                            value={data.idNumber || ''}
                            onChange={(e) => handleApplicantChange(num, 'idNumber', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={data.dob || ''}
                            onChange={(e) => handleApplicantChange(num, 'dob', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid-2">
                    <div className="form-group">
                        <label>Nationality</label>
                        <input
                            type="text"
                            value={data.nationality || ''}
                            onChange={(e) => handleApplicantChange(num, 'nationality', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Marital Status</label>
                        <select
                            value={data.maritalStatus || ''}
                            onChange={(e) => handleApplicantChange(num, 'maritalStatus', e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Other">Other (Specify)</option>
                        </select>
                    </div>
                </div>

                {data.maritalStatus === 'Married' && (
                    <div className="form-group">
                        <label>Marital Property Regime</label>
                        <select
                            value={data.maritalRegime || ''}
                            onChange={(e) => handleApplicantChange(num, 'maritalRegime', e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="In community of property">In community of property</option>
                            <option value="ANC">Antenuptial contract (ANC)</option>
                            <option value="Accrual system">Accrual system</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                )}

                <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary-light)', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Contact Details
                </h4>
                <div className="grid-2">
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            value={data.mobile || ''}
                            onChange={(e) => handleApplicantChange(num, 'mobile', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={data.email || ''}
                            onChange={(e) => handleApplicantChange(num, 'email', e.target.value)}
                        />
                    </div>
                </div>

                <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary-light)', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Current Residential Address
                </h4>
                <div className="form-group">
                    <label>Physical Address</label>
                    <input
                        type="text"
                        placeholder="Street, Suburb, City, Postal Code"
                        value={data.address || ''}
                        onChange={(e) => handleApplicantChange(num, 'address', e.target.value)}
                    />
                </div>

                <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary-light)', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Current Accommodation
                </h4>
                <div className="form-group">
                    <label>Are you the owner of the property where you currently stay?</label>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                            <input
                                type="radio"
                                name={`owner-${num}`}
                                checked={data.accommodation.isOwner === true}
                                onChange={() => handleNestedChange(num, 'accommodation', 'isOwner', true)}
                                style={{ width: 'auto' }}
                            /> Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                            <input
                                type="radio"
                                name={`owner-${num}`}
                                checked={data.accommodation.isOwner === false}
                                onChange={() => handleNestedChange(num, 'accommodation', 'isOwner', false)}
                                style={{ width: 'auto' }}
                            /> No
                        </label>
                    </div>
                </div>

                {!data.accommodation.isOwner && (
                    <div className="animate-fade-in">
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Monthly rent currently paid</label>
                                <input
                                    type="number"
                                    value={data.accommodation.monthlyRent || ''}
                                    onChange={(e) => handleNestedChange(num, 'accommodation', 'monthlyRent', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration of residency (months/years)</label>
                                <input
                                    type="text"
                                    value={data.accommodation.duration || ''}
                                    onChange={(e) => handleNestedChange(num, 'accommodation', 'duration', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Landlord / Agency Name</label>
                                <input
                                    type="text"
                                    value={data.accommodation.landlordName || ''}
                                    onChange={(e) => handleNestedChange(num, 'accommodation', 'landlordName', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Landlord Contact Number</label>
                                <input
                                    type="tel"
                                    value={data.accommodation.landlordPhone || ''}
                                    onChange={(e) => handleNestedChange(num, 'accommodation', 'landlordPhone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary-light)', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Next of Kin
                </h4>
                <div className="grid-2">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={data.nextOfKin.fullName || ''}
                            onChange={(e) => handleNestedChange(num, 'nextOfKin', 'fullName', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Relationship</label>
                        <input
                            type="text"
                            value={data.nextOfKin.relationship || ''}
                            onChange={(e) => handleNestedChange(num, 'nextOfKin', 'relationship', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Contact Number</label>
                    <input
                        type="tel"
                        value={data.nextOfKin.phone || ''}
                        onChange={(e) => handleNestedChange(num, 'nextOfKin', 'phone', e.target.value)}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="card glass" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="section-title">Applicant Information</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Provide personal and contact details for the lease holders.</p>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.secondApplicant.enabled}
                                onChange={(e) => updateFormData('secondApplicant', { ...formData.secondApplicant, enabled: e.target.checked })}
                                style={{ width: 'auto' }}
                            />
                            <span>Add Second Applicant</span>
                        </label>
                    </div>
                </div>
            </div>

            {renderApplicantForm(1)}

            {formData.secondApplicant.enabled && renderApplicantForm(2)}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={onBack}>Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue to Household <Users size={18} /></button>
            </div>
        </div>
    );
};

export default ApplicantDetails;
