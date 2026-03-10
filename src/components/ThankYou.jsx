import React from 'react';
import { CheckCircle, ExternalLink, Mail, Clock, ShieldCheck } from 'lucide-react';


const ThankYou = ({ formData, aiResults }) => {
    return (
        <div className="animate-fade-in card glass" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ background: 'rgba(56, 161, 105, 0.1)', color: 'var(--success)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', margin: '0 auto 2rem' }}>
                <CheckCircle size={48} />
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Application Submitted!</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Thank you! Your rental application has been successfully submitted and forwarded to our leasing team for review.
            </p>

            <div style={{
                background: '#f0fff4',
                border: '1px solid #c6f6d5',
                padding: '1.5rem',
                borderRadius: '8px',
                color: '#22543d',
                maxWidth: '600px',
                margin: '0 auto 3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'left'
            }}>
                <ShieldCheck size={24} />
                <div>
                    <strong>Verification Complete:</strong> All information and documentation has been automatically verified and the finalized package has been successfully sent to <strong>{formData.property.agentEmail}</strong>.
                </div>
            </div>

            <div className="grid-2" style={{ maxWidth: '700px', margin: '1rem auto 2rem', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Clock size={18} /> What happens next?
                    </h4>
                    <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.2rem' }}>
                        <li>The property agent has received your full application package.</li>
                        <li>They will review the AI verification results and documents.</li>
                        <li>An agent will contact you shortly to arrange a viewing or discuss the next steps.</li>
                    </ul>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Mail size={18} /> Confirmation
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        We've sent a copy of your application details to the email address provided in your form. Please keep it for your records.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    Your data is safe and will be archived after 30 days of inactivity.
                </p>
            </div>

            <button
                className="btn btn-outline"
                style={{ marginTop: '3rem' }}
                onClick={() => window.location.reload()}
            >
                Return to Home
            </button>
        </div>
    );
};

export default ThankYou;
