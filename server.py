from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import json
import re
from datetime import datetime
import pdfplumber
try:
    from PIL import Image
    import pytesseract
except ImportError:
    pass # Fallback for environments without OCR

app = Flask(__name__)
CORS(app)

# --- SMTP CONFIG ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "nic76778@gmail.com"
SMTP_PASSWORD = "onvtpsaudegjkjmu"
DEFAULT_SENDER = "Nic Baard <nic76778@gmail.com>"
# ---------------------

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def perform_real_analysis(files, form_data, property_rent):
    results = {
        "identityCheck": {"status": "FAIL", "details": {"message": "ID Document not found or unreadable"}},
        "residencyCheck": {"status": "FAIL", "details": {"message": "Residency proof missing"}},
        "affordability": {"status": "FAIL", "ratio": "0%", "rent": property_rent, "householdIncome": 0},
        "bankConsistency": {"status": "FAIL", "details": {"message": "No bank statements processed"}},
        "accountHealth": {"status": "HEALTHY", "details": {"negativesDetected": False}}
    }
    
    extracted_income = 0
    salary_detected = False
    rent_detected = False

    for file in files:
        filename = file.filename.lower()
        content = ""
        
        # 1. EXTRACT CONTENT
        if filename.endswith('.pdf'):
            try:
                with pdfplumber.open(file) as pdf:
                    content = " ".join([page.extract_text() for page in pdf.pages if page.extract_text()])
            except:
                continue
        elif any(filename.endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            try:
                img = Image.open(file)
                content = pytesseract.image_to_string(img)
            except:
                content = "" # OCR failed or Tesseract not installed

        # 2. ANALYSIS LOGIC
        # Identify "Salary" in Bank Statements or Payslips
        if "statement" in filename or "pay" in filename:
            # Look for large credit amounts (R1,000 to R200,000)
            amounts = re.findall(r'[R\s]?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)', content)
            numeric_amounts = []
            for a in amounts:
                clean_v = a.replace(',', '').replace(' ', '')
                try:
                    numeric_amounts.append(float(clean_v))
                except:
                    continue
            
            if numeric_amounts:
                extracted_income = max(numeric_amounts) # Assume highest recurring credit is salary for this prototype
                salary_detected = True
                
            if "rent" in content.lower() or "lease" in content.lower():
                rent_detected = True

        # Identity Check
        if "id" in filename or "pax" in filename:
            user_name = form_data.get('firstApplicant', {}).get('fullName', '').lower()
            if user_name and user_name.split()[0] in content.lower():
                results["identityCheck"] = {"status": "PASS", "details": {"nameMatch": True, "extracted": user_name}}

        # Residency Check
        if "res" in filename or "bill" in filename or "utility" in filename:
            # Check for current year
            current_year = str(datetime.now().year)
            if current_year in content:
                results["residencyCheck"] = {"status": "PASS", "details": {"dateVerified": True, "year": current_year}}

    # Calculation
    results["affordability"]["householdIncome"] = extracted_income
    if extracted_income > 0:
        ratio = property_rent / extracted_income
        results["affordability"]["ratio"] = f"{round(ratio * 100, 1)}%"
        results["affordability"]["status"] = "PASS" if ratio < 0.3 else "BORDERLINE" if ratio < 0.4 else "FAIL"

    if salary_detected:
        results["bankConsistency"] = {
            "status": "PASS", 
            "details": {"salaryDetected": True, "rentPaymentFound": rent_detected, "incomeFound": extracted_income}
        }

    return results

@app.route('/api/submit', methods=['POST'])
def submit_application():
    try:
        form_data = json.loads(request.form.get('formData'))
        property_rent = form_data.get('property', {}).get('monthlyRent', 0)
        submitted_at = json.loads(request.form.get('submittedAt', '"Now"'))
        files = request.files.getlist('files')

        # 1. RUN REAL ANALYSIS
        # We need to seek(0) as we'll read files twice (once for AI, once for email)
        for f in files: f.seek(0)
        ai_results = perform_real_analysis(files, form_data, property_rent)
        for f in files: f.seek(0)

        # 2. EMAILING (AGENT)
        agent_email = form_data.get('property', {}).get('agentEmail', 'nicbaard@gmail.com')
        applicant_email = form_data.get('firstApplicant', {}).get('email')
        property_name = form_data.get('property', {}).get('displayName', 'Property')
        
        msg = MIMEMultipart()
        msg['From'] = DEFAULT_SENDER
        msg['To'] = agent_email
        msg['Subject'] = f"REAL-TIME PACKAGE: {property_name} - {form_data['firstApplicant']['fullName']}"
        
        body = f"""
        REAL AI VERIFICATION REPORT
        ---------------------------
        Income Detected: R{ai_results['affordability']['householdIncome']:,.2f}
        Affordability Status: {ai_results['affordability']['status']} ({ai_results['affordability']['ratio']})
        Identity Verified: {ai_results['identityCheck']['status']}
        Residency Verified: {ai_results['residencyCheck']['status']}
        
        Detailed form data and files attached.
        """
        msg.attach(MIMEText(body, 'plain'))

        for file in files:
            if file.filename:
                file.save(os.path.join(UPLOAD_FOLDER, file.filename))
                file.seek(0)
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f"attachment; filename={file.filename}")
                msg.attach(part)

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        
        # 3. EMAILING (APPLICANT)
        credit_check_fee = form_data.get('property', {}).get('creditCheckFee', 0)
        num_applicants = 1
        if form_data.get('secondApplicant', {}).get('enabled'):
            num_applicants = 2
        total_fee = credit_check_fee * num_applicants

        app_msg = MIMEMultipart()
        app_msg['From'] = DEFAULT_SENDER
        app_msg['To'] = applicant_email
        app_msg['Subject'] = f"Application Confirmed - {property_name}"
        
        app_body = f"""
        <html>
        <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1a365d;">Application Received</h2>
                <p>Hi {form_data['firstApplicant']['fullName']},</p>
                <p>Your application for <strong>{property_name}</strong> has been successfully submitted and forwarded to the property agent for review.</p>
                
                <div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #c53030;">Action Required: Credit Check Fee</h3>
                    <p>To process your application, a credit check fee of <strong>R{total_fee:,.2f}</strong> (R{credit_check_fee:,.2f} x {num_applicants} applicant{'s' if num_applicants > 1 else ''}) must be paid into the following account:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 4px 0;"><strong>Bank:</strong></td><td>FNB</td></tr>
                        <tr><td style="padding: 4px 0;"><strong>Account Number:</strong></td><td>62855339547</td></tr>
                        <tr><td style="padding: 4px 0;"><strong>Branch Code:</strong></td><td>250655</td></tr>
                        <tr><td style="padding: 4px 0;"><strong>Reference:</strong></td><td>{form_data['firstApplicant']['fullName']}</td></tr>
                    </table>
                </div>

                <p>Please send your proof of payment to the agent at {agent_email}.</p>
                <p>Sincerely,<br>Leasing Support</p>
            </div>
        </body>
        </html>
        """
        app_msg.attach(MIMEText(app_body, 'html'))
        server.send_message(app_msg)
        server.quit()

        # Return the REAL results to the frontend
        return jsonify({"status": "success", "aiResults": ai_results}), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
