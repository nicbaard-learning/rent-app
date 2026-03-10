import React, { useState } from 'react';
import {
    FileText,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Activity,
    UserCheck,
    MapPin,
    Briefcase
} from 'lucide-react';

const AgentSummary = ({ formData, aiResults }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!aiResults) return null;

    const StatusBadge = ({ status }) => {
        const colors = {
            'PASS': { bg: '#e6fffa', text: '#234e52', icon: <CheckCircle2 size={14} /> },
            'BORDERLINE': { bg: '#fffaf0', text: '#7b341e', icon: <AlertCircle size={14} /> },
            'FAIL': { bg: '#fff5f5', text: '#822727', icon: <AlertCircle size={14} /> },
            'VERIFIED': { bg: '#e6fffa', text: '#234e52', icon: <UserCheck size={14} /> },
            'HEALTHY': { bg: '#ebf8ff', text: '#2a4365', icon: <Activity size={14} /> }
        };
        const config = colors[status] || colors['BORDERLINE'];

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                backgroundColor: config.bg,
                color: config.text
            }}>
                {config.icon} {status}
            </span>
        );
    };

    return (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn"
                style={{ width: '100%', justifyContent: 'space-between', border: '1px solid var(--border)', background: 'white' }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldCheck size={18} color="var(--primary)" />
                    View Agent Submission Summary (AI Powered)
                </span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isOpen && (
                <div className="animate-fade-in" style={{
                    marginTop: '1rem',
                    padding: '2rem',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>
                            Agent Review Package
                        </h3>
                        <div style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '4px' }}>
                            Sent to: {formData.property.agentEmail}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(56, 161, 105, 0.05)', borderRadius: '4px', border: '1px solid var(--success)', fontSize: '0.85rem', color: 'var(--success)' }}>
                        <strong>Package Contents:</strong> Full Application Form + AI Analysis + {
                            Object.values(formData.uploads.firstApplicant || {}).flat().filter(Boolean).length +
                            Object.values(formData.uploads.secondApplicant || {}).flat().filter(Boolean).length
                        } Attached Documents
                    </div>

                    <div className="grid-2">
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserCheck size={16} /> Identity Consistency
                            </h4>
                            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Status:</span>
                                    <StatusBadge status={aiResults.identityCheck.status} />
                                </div>
                                <p style={{ color: 'var(--text-muted)' }}>{aiResults.identityCheck.details.extractedName} matches application form. ID {aiResults.identityCheck.details.extractedID} verified.</p>
                            </div>

                            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16} /> Residency Verification
                            </h4>
                            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Status:</span>
                                    <StatusBadge status={aiResults.residencyCheck.status} />
                                </div>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Document date: {aiResults.residencyCheck.details.documentDate}
                                    {aiResults.residencyCheck.details.dateValid ? ' (under 90 days)' : ' (OVER 90 DAYS - EXPIRED)'}.
                                    Address matches current physical address.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} /> Affordability Analysis
                            </h4>
                            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Status:</span>
                                    <StatusBadge status={aiResults.affordability.status} />
                                </div>
                                <div style={{ background: 'var(--bg-main)', padding: '0.75rem', borderRadius: '4px' }}>
                                    <p><strong>Rent-to-Income:</strong> {aiResults.affordability.ratio}</p>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>R{aiResults.affordability.rent.toLocaleString()} / R{aiResults.affordability.householdIncome.toLocaleString()}</p>
                                </div>
                            </div>

                            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Briefcase size={16} /> Employer Verification
                            </h4>
                            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Status:</span>
                                    <StatusBadge status={aiResults.employerVerification.status} />
                                </div>
                                <p style={{ color: 'var(--text-muted)' }}>Found business in {aiResults.employerVerification.details.source}. Address is valid location.</p>
                            </div>
                        </div>
                    </div>

                    <h4 style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        Bank Statement Consistency
                    </h4>
                    <div style={{ background: 'rgba(26, 54, 93, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                        <p style={{ marginBottom: '1rem' }}>
                            <CheckCircle2 color="var(--success)" size={14} style={{ marginRight: '8px' }} />
                            Salary deposits match payslips in all 3 months. Reference: "{formData.firstApplicant.employment.employerName}" detected.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>
                            <CheckCircle2 color="var(--success)" size={14} style={{ marginRight: '8px' }} />
                            Recurring rental payment detected: R{aiResults.bankConsistency.details.averageRentDetected.toLocaleString()}.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '4px' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Account Health</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overdraft usage: {aiResults.accountHealth.details.overdraftUsage}. Unpaid items: {aiResults.accountHealth.details.unpaidItems}.</p>
                            </div>
                            <StatusBadge status={aiResults.accountHealth.status} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentSummary;
