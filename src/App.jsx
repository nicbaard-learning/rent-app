import React, { useState, useEffect } from 'react';
import propertiesData from './data/properties.json';
import { APP_CONFIG } from './config';
import {
  Building2,
  User,
  Users,
  Briefcase,
  Upload,
  CheckCircle,
  ArrowRight,
  FileText,
  ShieldCheck
} from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import PropertySelection from './components/PropertySelection';
import ApplicantDetails from './components/ApplicantDetails';
import HouseholdDetails from './components/HouseholdDetails';
import EmploymentBanking from './components/EmploymentBanking';
import DocumentUpload from './components/DocumentUpload';
import ReviewSubmit from './components/ReviewSubmit';
import ThankYou from './components/ThankYou';
import PropertyHeader from './components/PropertyHeader';

const STEPS = [
  { id: 'property', label: 'Property', icon: Building2 },
  { id: 'applicants', label: 'Applicants', icon: User },
  { id: 'household', label: 'Household', icon: Users },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'uploads', label: 'Uploads', icon: Upload },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

const STORAGE_KEY = 'rental_application_data';

function App() {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).currentStep || 0 : 0;
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialData = {
      property: null,
      propertyConfirmed: false,
      firstApplicant: {
        maritalStatus: '',
        accommodation: { isOwner: false },
        nextOfKin: {},
        banking: {},
        employment: {}
      },
      secondApplicant: {
        enabled: false,
        maritalStatus: '',
        accommodation: { isOwner: false },
        nextOfKin: {},
        banking: {},
        employment: {}
      },
      household: {
        adults: 1,
        children: 0,
        childrenDetails: [],
        pets: 0,
        petsType: '',
        vehicles: []
      },
      credit: {
        hasJudgments: false,
        judgmentDetails: '',
        isUnderDebtReview: false,
        debtReviewDetails: ''
      },
      consent: {
        firstApplicantMarketing: false,
        secondApplicantMarketing: false,
        legalDeclarations: false
      },
      uploads: {
        firstApplicant: {},
        secondApplicant: {}
      }
    };
    return saved ? { ...initialData, ...JSON.parse(saved).formData } : initialData;
  });

  const [aiResults, setAiResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    // Only save if NOT on the final Thank You page (step 6)
    if (currentStep < 6) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, formData }));
    }
  }, [currentStep, formData]);

  const resetForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const updateFormData = (section, data) => {
    setFormData(prev => {
      // If either current or new data is null/not an object, replace instead of merge
      if (
        prev[section] === null ||
        data === null ||
        typeof prev[section] !== 'object' ||
        typeof data !== 'object'
      ) {
        return { ...prev, [section]: data };
      }
      // Otherwise merge
      return {
        ...prev,
        [section]: { ...prev[section], ...data }
      };
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PropertySelection
          properties={propertiesData}
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
        />;
      case 1:
        return <ApplicantDetails
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />;
      case 2:
        return <HouseholdDetails
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />;
      case 3:
        return <EmploymentBanking
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />;
      case 4:
        return <DocumentUpload
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />;
      case 5:
        return <ReviewSubmit
          formData={formData}
          updateFormData={updateFormData}
          onBack={prevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />;
      case 6:
        return <ThankYou formData={formData} aiResults={aiResults} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Calculate Results for the record
      const results = simulateAI(formData);
      setAiResults(results);

      // 2. Prepare Multi-part Form Data
      const body = new FormData();

      // Structure JSON for backend
      body.append('formData', JSON.stringify(formData));
      body.append('aiResults', JSON.stringify(results));
      body.append('submittedAt', JSON.stringify(new Date().toLocaleString()));

      // 3. Extract and Append Raw Files
      const applicants = ['firstApplicant', 'secondApplicant'];
      applicants.forEach(app => {
        const docs = formData.uploads[app] || {};
        Object.values(docs).flat().forEach(fileObj => {
          if (fileObj && fileObj.rawFile instanceof File) {
            body.append('files', fileObj.rawFile, fileObj.name);
          }
        });
      });

      // 4. Send to Python Backend
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: body
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to reach backend server');
      }

      const data = await response.json();
      console.log("Application Submitted and Emailed:", data);

      // 5. Use the REAL AI results from the backend
      setAiResults(data.aiResults);

      // 5. Success Flow
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(6);
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission Failed: Make sure your Python backend is running at http://localhost:5000 and has SMTP access. Details: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateAI = (data) => {
    // This mocks the logic in section 10
    const rent = data.property?.monthlyRent || 0;
    const income1 = parseFloat(data.firstApplicant.employment.netSalary || 0);
    const income2 = data.secondApplicant.enabled ? parseFloat(data.secondApplicant.employment.netSalary || 0) : 0;
    const totalIncome = income1 + income2;
    const ratio = totalIncome > 0 ? (rent / totalIncome) : 0;

    const proofOfAddressFile = data.uploads.firstApplicant?.proofOfAddress?.rawFile;
    let dateValid = true;
    let docDateStr = 'Unknown';

    if (proofOfAddressFile) {
      const docDate = new Date(proofOfAddressFile.lastModified);
      docDateStr = docDate.toISOString().split('T')[0];
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      dateValid = docDate > ninetyDaysAgo;
    }

    const fullName = data.firstApplicant.fullName || 'Applicant';
    const idNum = data.firstApplicant.idNumber || 'ID';
    const currentRent = parseFloat(data.firstApplicant.accommodation.monthlyRent || 0);

    // AI Checks per Section 10
    return {
      identityCheck: {
        status: fullName.length > 3 ? 'PASS' : 'BORDERLINE',
        details: {
          nameMatch: true,
          idMatch: true,
          extractedName: fullName,
          extractedID: idNum
        }
      },
      residencyCheck: {
        status: dateValid ? 'PASS' : 'FAIL',
        details: {
          dateValid: dateValid,
          nameMatch: true,
          addressMatch: true,
          documentDate: docDateStr,
          message: dateValid ? 'Document date verified' : 'Document older than 90 days'
        }
      },
      affordability: {
        ratio: (ratio * 100).toFixed(1) + '%',
        status: ratio < 0.3 ? 'PASS' : ratio < 0.35 ? 'BORDERLINE' : 'FAIL',
        rent: rent,
        householdIncome: totalIncome
      },
      bankConsistency: {
        status: income1 > 0 ? 'PASS' : 'FAIL',
        details: {
          salaryMatch: true,
          frequencyMatch: true,
          rentPaymentDetected: currentRent > 0,
          averageRentDetected: currentRent
        }
      },
      accountHealth: {
        status: 'HEALTHY',
        details: {
          negativesDetected: false,
          overdraftUsage: 'MINIMAL',
          unpaidItems: 0
        }
      },
      employerVerification: {
        status: 'VERIFIED',
        details: {
          addressValid: true,
          businessFound: true,
          source: 'Public Business Listings'
        }
      }
    };
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Rental <span style={{ color: 'var(--accent)' }}>Application</span> Portal
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Securely apply for your next home in minutes.</p>
      </header>

      {currentStep < 6 && (
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      )}

      <main>
        {currentStep > 0 && currentStep < 6 && formData.property && (
          <PropertyHeader property={formData.property} />
        )}
        {renderStep()}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <p>&copy; {new Date().getFullYear()} Rental Application Portal. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>
          <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Your data is encrypted and handled according to POPIA/GDPR regulations.
        </p>
      </footer>
    </div>
  );
}

export default App;
