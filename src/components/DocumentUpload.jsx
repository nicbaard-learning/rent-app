import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, Loader2, ArrowRight } from 'lucide-react';

const DocumentUpload = ({ formData, updateFormData, onNext, onBack }) => {
    const [uploading, setUploading] = useState({});

    const requiredDocs = [
        { id: 'idDoc', label: 'Identity Document / Passport', multiple: false },
        { id: 'proofOfAddress', label: 'Proof of Residential Address', multiple: false },
        { id: 'payslips', label: 'Recent Payslips (Last 3 Months)', multiple: true },
        { id: 'bankStatements', label: 'Recent Bank Statements (Last 3 Months)', multiple: true },
        { id: 'taxProof', label: 'Verified Tax Number Proof', multiple: false, optional: true }
    ];

    const handleFileUpload = (applicantNum, docId, files) => {
        const key = `${applicantNum}-${docId}`;
        setUploading(prev => ({ ...prev, [key]: true }));

        // Simulate upload delay
        setTimeout(() => {
            const applicantKey = applicantNum === 1 ? 'firstApplicant' : 'secondApplicant';
            const currentUploads = formData.uploads[applicantKey] || {};

            const newFiles = Array.from(files).map(f => ({
                name: f.name,
                size: f.size,
                type: f.type,
                url: URL.createObjectURL(f),
                rawFile: f // Keep the actual File object for the API call
            }));

            updateFormData('uploads', {
                ...formData.uploads,
                [applicantKey]: {
                    ...currentUploads,
                    [docId]: docId === 'payslips' || docId === 'bankStatements'
                        ? [...(currentUploads[docId] || []), ...newFiles]
                        : newFiles[0]
                }
            });

            setUploading(prev => ({ ...prev, [key]: false }));
        }, 1500);
    };

    const removeFile = (applicantNum, docId, fileName) => {
        const applicantKey = applicantNum === 1 ? 'firstApplicant' : 'secondApplicant';
        const currentUploads = formData.uploads[applicantKey];

        if (Array.isArray(currentUploads[docId])) {
            updateFormData('uploads', {
                ...formData.uploads,
                [applicantKey]: {
                    ...currentUploads,
                    [docId]: currentUploads[docId].filter(f => f.name !== fileName)
                }
            });
        } else {
            updateFormData('uploads', {
                ...formData.uploads,
                [applicantKey]: {
                    ...currentUploads,
                    [docId]: null
                }
            });
        }
    };

    const renderUploadSection = (num) => {
        const applicantKey = num === 1 ? 'firstApplicant' : 'secondApplicant';
        const uploads = formData.uploads[applicantKey] || {};

        return (
            <div key={num} className="animate-fade-in" style={{ marginBottom: '3rem' }}>
                <h3 className="section-title">
                    {num === 1 ? "First Applicant" : "Second Applicant"} Documents
                </h3>

                <div className="grid-2">
                    {requiredDocs.map(doc => {
                        const uploaded = uploads[doc.id];
                        const isUploading = uploading[`${num}-${doc.id}`];

                        return (
                            <div key={doc.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border)', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <label style={{ marginBottom: 0 }}>
                                        {doc.label} {doc.optional && <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>(Optional)</span>}
                                    </label>
                                    {uploaded && <CheckCircle size={18} color="var(--success)" />}
                                </div>

                                {!uploaded && !isUploading && (
                                    <div
                                        style={{
                                            border: '2px dashed var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            handleFileUpload(num, doc.id, e.dataTransfer.files);
                                        }}
                                        onClick={() => document.getElementById(`file-${num}-${doc.id}`).click()}
                                    >
                                        <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click or drag to upload</p>
                                        <input
                                            type="file"
                                            id={`file-${num}-${doc.id}`}
                                            style={{ display: 'none' }}
                                            multiple={doc.multiple}
                                            onChange={(e) => handleFileUpload(num, doc.id, e.target.files)}
                                        />
                                    </div>
                                )}

                                {isUploading && (
                                    <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                                        <p style={{ fontSize: '0.8rem' }}>Uploading...</p>
                                    </div>
                                )}

                                {uploaded && (
                                    <div className="animate-fade-in">
                                        {Array.isArray(uploaded) ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {uploaded.map((f, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '4px' }}>
                                                        <File size={14} />
                                                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</span>
                                                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFile(num, doc.id, f.name)} />
                                                    </div>
                                                ))}
                                                {doc.multiple && (
                                                    <button
                                                        className="btn"
                                                        style={{ fontSize: '0.7rem', padding: '0.25rem', color: 'var(--primary)' }}
                                                        onClick={() => document.getElementById(`file-${num}-${doc.id}`).click()}
                                                    >
                                                        + Add more
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '4px' }}>
                                                <File size={14} />
                                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{uploaded.name}</span>
                                                <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFile(num, doc.id, uploaded.name)} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const isAllRequiredUploaded = () => {
        const checkApplicant = (num) => {
            const applicantKey = num === 1 ? 'firstApplicant' : 'secondApplicant';
            const u = formData.uploads[applicantKey] || {};
            return u.idDoc && u.proofOfAddress && u.payslips?.length > 0 && u.bankStatements?.length > 0;
        };

        if (!checkApplicant(1)) return false;
        if (formData.secondApplicant.enabled && !checkApplicant(2)) return false;
        return true;
    };

    return (
        <div className="animate-fade-in">
            <div className="card glass">
                <h2 className="section-title">Upload Documents</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Please provide high-quality scans or photos of the following documents. Max size: 10MB per file.
                </p>

                <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <AlertCircle size={20} color="var(--accent)" />
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                        <strong>Heads up:</strong> Our AI will automatically verify your identity and financial stability using these documents.
                    </p>
                </div>

                {renderUploadSection(1)}
                {formData.secondApplicant.enabled && renderUploadSection(2)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={onBack}>Back</button>
                <button
                    className="btn btn-primary"
                    onClick={onNext}
                    disabled={!isAllRequiredUploaded()}
                >
                    Review & Submit <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default DocumentUpload;
