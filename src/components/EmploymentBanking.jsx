import React from 'react';
import { Briefcase, CreditCard, Building, Wallet, TrendingUp, ArrowRight } from 'lucide-react';

const EmploymentBanking = ({ formData, updateFormData, onNext, onBack }) => {
    const handleNestedChange = (applicant, section, field, value) => {
        const applicantKey = applicant === 1 ? 'firstApplicant' : 'secondApplicant';
        updateFormData(applicantKey, {
            ...formData[applicantKey],
            [section]: { ...formData[applicantKey][section], [field]: value }
        });
    };

    const renderSection = (num) => {
        const applicantKey = num === 1 ? 'firstApplicant' : 'secondApplicant';
        const data = formData[applicantKey];

        return (
            <div key={num} className="animate-fade-in">
                <h3 className="section-title" style={{ marginTop: num === 2 ? '3rem' : '0' }}>
                    {num === 1 ? "First Applicant" : "Second Applicant"} Employment & Banking
                </h3>

                <div className="card glass">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        <Briefcase size={20} /> Employment Details
                    </h4>

                    <div className="form-group">
                        <label>Are you self-employed?</label>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                                <input
                                    type="radio"
                                    name={`self-${num}`}
                                    checked={data.employment.isSelfEmployed === true}
                                    onChange={() => handleNestedChange(num, 'employment', 'isSelfEmployed', true)}
                                    style={{ width: 'auto' }}
                                /> Yes
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                                <input
                                    type="radio"
                                    name={`self-${num}`}
                                    checked={data.employment.isSelfEmployed === false}
                                    onChange={() => handleNestedChange(num, 'employment', 'isSelfEmployed', false)}
                                    style={{ width: 'auto' }}
                                /> No
                            </label>
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Occupation / Job Title</label>
                            <input
                                type="text"
                                value={data.employment.jobTitle || ''}
                                onChange={(e) => handleNestedChange(num, 'employment', 'jobTitle', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Employer Name</label>
                            <input
                                type="text"
                                value={data.employment.employerName || ''}
                                onChange={(e) => handleNestedChange(num, 'employment', 'employerName', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Employer Physical Address</label>
                        <input
                            type="text"
                            value={data.employment.employerAddress || ''}
                            onChange={(e) => handleNestedChange(num, 'employment', 'employerAddress', e.target.value)}
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Period of Employment</label>
                            <input
                                type="text"
                                placeholder="e.g. 3 years, 4 months"
                                value={data.employment.duration || ''}
                                onChange={(e) => handleNestedChange(num, 'employment', 'duration', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gross Monthly Salary (Before Tax)</label>
                            <input
                                type="number"
                                value={data.employment.grossSalary || ''}
                                onChange={(e) => handleNestedChange(num, 'employment', 'grossSalary', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Nett Monthly Salary (After Tax)</label>
                            <input
                                type="number"
                                value={data.employment.netSalary || ''}
                                onChange={(e) => handleNestedChange(num, 'employment', 'netSalary', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Total Monthly Expenses</label>
                            <input
                                type="number"
                                placeholder="Approximate total"
                                value={data.employment.totalExpenses || ''}
                                onChange={(e) => handleNestedChange(num, 'employment', 'totalExpenses', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card glass" style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        <CreditCard size={20} /> Banking Details
                    </h4>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Bank Name</label>
                            <input
                                type="text"
                                value={data.banking.bankName || ''}
                                onChange={(e) => handleNestedChange(num, 'banking', 'bankName', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Branch Name / Code</label>
                            <input
                                type="text"
                                value={data.banking.branchCode || ''}
                                onChange={(e) => handleNestedChange(num, 'banking', 'branchCode', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Account Number</label>
                            <input
                                type="text"
                                value={data.banking.accountNumber || ''}
                                onChange={(e) => handleNestedChange(num, 'banking', 'accountNumber', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Type of Account</label>
                            <select
                                value={data.banking.accountType || ''}
                                onChange={(e) => handleNestedChange(num, 'banking', 'accountType', e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                <option value="Current/Cheque">Current / Cheque</option>
                                <option value="Savings">Savings</option>
                                <option value="Transmission">Transmission</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            {renderSection(1)}
            {formData.secondApplicant.enabled && renderSection(2)}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={onBack}>Back</button>
                <button className="btn btn-primary" onClick={onNext}>Continue to Documents <ArrowRight size={18} /></button>
            </div>
        </div>
    );
};

export default EmploymentBanking;
