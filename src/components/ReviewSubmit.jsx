import React, { useState } from 'react';
import { FileText, ShieldCheck, CreditCard, Home, Briefcase, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ReviewSubmit = ({ formData, updateFormData, onBack, onSubmit, isSubmitting }) => {
    const [agreed, setAgreed] = useState(formData.consent.legalDeclarations);

    const calculateTotalDeposit = (breakdown) => {
        if (!breakdown) return 0;
        return Object.values(breakdown).reduce((sum, val) => sum + (val || 0), 0);
    };

    const handleConsent = (e) => {
        setAgreed(e.target.checked);
        updateFormData('consent', { ...formData.consent, legalDeclarations: e.target.checked });
    };

    const renderSummarySection = (title, icon, content) => (
        <div key={title} className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                {icon} {title}
            </h4>
            {content}
        </div>
    );

    const applicantSummary = (num) => {
        const applicantKey = num === 1 ? 'firstApplicant' : 'secondApplicant';
        const data = formData[applicantKey];
        if (num === 2 && !data.enabled) return null;

        return renderSummarySection(
            `${num === 1 ? 'First' : 'Second'} Applicant Details`,
            <FileText size={18} />,
            <div className="grid-2" style={{ fontSize: '0.9rem' }}>
                <div>
                    <p><strong>Name:</strong> {data.fullName}</p>
                    <p><strong>ID/Passport:</strong> {data.idNumber}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Phone:</strong> {data.mobile}</p>
                </div>
                <div>
                    <p><strong>Employment:</strong> {data.employment.jobTitle} at {data.employment.employerName}</p>
                    <p><strong>Monthly Nett:</strong> R{parseFloat(data.employment.netSalary || 0).toLocaleString()}</p>
                    <p><strong>Marital Status:</strong> {data.maritalStatus}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="card glass">
                <h2 className="section-title">Review & Submit Application</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Please review your information one last time before submitting it to the property agent for AI processing.
                </p>

                {renderSummarySection(
                    "Property Selection",
                    <Home size={18} />,
                    <div className="grid-2" style={{ fontSize: '0.9rem' }}>
                        <div>
                            <p><strong>Property:</strong> {formData.property.displayName}</p>
                            <p><strong>Address:</strong> {formData.property.streetAddress}, {formData.property.suburb}</p>
                        </div>
                        <div>
                            <p><strong>Monthly Rent:</strong> R{formData.property.monthlyRent.toLocaleString()}</p>
                            <p><strong>Deposit:</strong> R{calculateTotalDeposit(formData.property.depositBreakdown).toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {applicantSummary(1)}
                {applicantSummary(2)}

                {renderSummarySection(
                    "Household & Credit Details",
                    <ShieldCheck size={18} />,
                    <div className="grid-2" style={{ fontSize: '0.9rem' }}>
                        <div>
                            <p><strong>Residents:</strong> {formData.household.adults} Adults, {formData.household.children} Children</p>
                            <p><strong>Pets:</strong> {formData.household.pets} ({formData.household.petsType})</p>
                            <p><strong>Vehicles:</strong> {formData.household.vehicles.length} registered</p>
                        </div>
                        <div>
                            <p><strong>Credit Judgments:</strong> {formData.credit.hasJudgments ? <span style={{ color: 'var(--danger)' }}>Yes</span> : 'No'}</p>
                            <p><strong>Debt Review:</strong> {formData.credit.isUnderDebtReview ? <span style={{ color: 'var(--warning)' }}>Yes</span> : 'No'}</p>
                        </div>
                    </div>
                )}

                <div className="card" style={{ background: 'rgba(26, 54, 93, 0.03)', border: '1px solid var(--primary)', padding: '2rem' }}>
                    <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Declarations & Consent</h3>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6' }}>
                        <p>1. I/We confirm that all information supplied in the application is true, correct, and complete to the best of our knowledge, and that we have not intentionally withheld any information that could reasonably affect the landlord’s decision.</p>
                        <p>2. I/We undertake to inform the landlord or property practitioner in writing of any material changes to the information provided in the application before or during the lease.</p>
                        <p>3. I/We acknowledge that submission of the application does not guarantee acceptance or conclusion of a lease agreement.</p>
                        <p>4. I/We consent to the landlord and/or authorised property practitioner to contact, request, and obtain information from any credit provider, bank, or registered credit bureau; and to provide information about our payment behaviour and credit history to registered credit bureaus or credit providers.</p>
                        <p>5. I/We confirm that we understand and agree that deposits, fees, and first month’s rent will be payable upon acceptance and conclusion of a lease agreement (not at application stage).</p>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <input
                            type="checkbox"
                            id="legal-agree"
                            checked={agreed}
                            onChange={handleConsent}
                            style={{ width: 'auto', marginTop: '4px' }}
                        />
                        <label htmlFor="legal-agree" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                            I/We have read and agree to the above declarations and consents.
                        </label>
                    </div>

                    {agreed && (
                        <div className="animate-fade-in grid-2" style={{ marginTop: '2rem' }}>
                            <div className="form-group">
                                <label>First Applicant Full Name (as signature)</label>
                                <input
                                    type="text"
                                    placeholder="Type full legal name"
                                    value={formData.firstApplicant.fullName}
                                    onChange={() => { }} // Read-only from before
                                    readOnly
                                    style={{ background: 'rgba(0,0,0,0.05)', fontStyle: 'italic', fontFamily: 'cursive' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Signing Location</label>
                                <input
                                    type="text"
                                    placeholder="City/Suburb"
                                    value={formData.consent.signingLocation || ''}
                                    onChange={(e) => updateFormData('consent', { ...formData.consent, signingLocation: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Marketing Consent (First Applicant)</label>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', fontSize: '0.8rem' }}>
                                <input type="radio" checked={formData.consent.firstApplicantMarketing === true} onChange={() => updateFormData('consent', { ...formData.consent, firstApplicantMarketing: true })} style={{ width: 'auto' }} /> Yes
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', fontSize: '0.8rem' }}>
                                <input type="radio" checked={formData.consent.firstApplicantMarketing === false} onChange={() => updateFormData('consent', { ...formData.consent, firstApplicantMarketing: false })} style={{ width: 'auto' }} /> No
                            </label>
                        </div>
                    </div>
                    {formData.secondApplicant.enabled && (
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Marketing Consent (Second Applicant)</label>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', fontSize: '0.8rem' }}>
                                    <input type="radio" checked={formData.consent.secondApplicantMarketing === true} onChange={() => updateFormData('consent', { ...formData.consent, secondApplicantMarketing: true })} style={{ width: 'auto' }} /> Yes
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: 'auto', fontSize: '0.8rem' }}>
                                    <input type="radio" checked={formData.consent.secondApplicantMarketing === false} onChange={() => updateFormData('consent', { ...formData.consent, secondApplicantMarketing: false })} style={{ width: 'auto' }} /> No
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={onBack}>Back to Uploads</button>
                <button
                    className="btn btn-primary"
                    onClick={onSubmit}
                    disabled={!agreed || isSubmitting}
                    style={{ padding: '0.75rem 3rem' }}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} /> Processing AI Checks...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReviewSubmit;
