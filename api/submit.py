from http.server import BaseHTTPRequestHandler
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import re
import cgi

# --- CONFIGURATION (UPDATED) ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "nic76778@gmail.com"
SMTP_PASSWORD = "onvtpsaudegjkjmu"
DEFAULT_SENDER = "Nic Baard <nic76778@gmail.com>"
# ---------------------

def get_status_color(status):
    status = str(status).upper()
    if 'PASS' in status or 'HEALTHY' in status or 'VERIFIED' in status:
        return '#38a169'
    if 'FAIL' in status or ('HEALTHY' not in status and 'UNHEALTHY' in status):
        return '#e53e3e'
    return '#d69e2e'

def create_ai_block(title, result):
    status = result.get('status', 'N/A')
    color = get_status_color(status)
    details_html = ""
    details = result.get('details', {})
    
    if isinstance(details, dict):
        for k, v in details.items():
            if k == 'dateValid': continue
            label = re.sub(r'([A-Z])', r' \1', k).strip().capitalize()
            val_str = str(v)
            if isinstance(v, bool):
                val_str = "YES" if v else "NO"
            elif isinstance(v, (int, float)) and v > 1000:
                val_str = f"R{v:,.0f}"
            details_html += f"<p style='margin: 2px 0; font-size: 0.85em; color: #4a5568;'>• {label}: {val_str}</p>"
    
    if result.get('ratio'):
        details_html += f"<p style='margin: 2px 0; font-size: 0.85em; color: #4a5568;'>Rent-to-Income: {result.get('ratio')}</p>"
        rent = result.get('rent', 0)
        hh_income = result.get('householdIncome', 0)
        details_html += f"<p style='margin: 2px 0; font-size: 0.85em; color: #4a5568;'>Rent: R{rent:,.2f} / Household: R{hh_income:,.2f}</p>"

    return f"""
    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 0px; height: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: #2d3748; font-size: 0.9em;">{title}</strong>
            <span style="background: {color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; font-weight: bold;">{status}</span>
        </div>
        {details_html}
    </div>
    """

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_type, pdict = cgi.parse_header(self.headers.get('content-type'))
            if content_type != 'multipart/form-data':
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'Must be multipart data')
                return

            if 'boundary' in pdict:
                pdict['boundary'] = pdict['boundary'].encode('utf-8')
            
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST', 'CONTENT_TYPE': self.headers['Content-Type']}
            )

            form_data = json.loads(form.getvalue('formData'))
            ai_results = json.loads(form.getvalue('aiResults'))
            submitted_at = json.loads(form.getvalue('submittedAt', '"Now"'))

            agent_email = form_data.get('property', {}).get('agentEmail', 'nicbaard@gmail.com')
            applicant_email = form_data.get('firstApplicant', {}).get('email')
            property_name = form_data.get('property', {}).get('displayName', 'Property')
            applicant_name = form_data.get('firstApplicant', {}).get('fullName', 'Applicant')

            # --- Emails ---
            # 1. AGENT EMAIL
            agent_msg = MIMEMultipart()
            agent_msg['From'] = DEFAULT_SENDER
            agent_msg['To'] = agent_email
            agent_msg['Subject'] = f"AGENT PACKAGE: {property_name} - {applicant_name}"

            # ... (ai_grid and build_form_table logic remains) ...
            ai_grid = f"""
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="width: 50%; padding-right: 10px; vertical-align: top;">
                        {create_ai_block('Identity Consistency', ai_results.get('identityCheck', {}))}
                    </td>
                    <td style="width: 50%; padding-left: 10px; vertical-align: top;">
                        {create_ai_block('Affordability Analysis', ai_results.get('affordability', {}))}
                    </td>
                </tr>
                <tr><td style="height: 20px;"></td></tr>
                <tr>
                    <td style="width: 50%; padding-right: 10px; vertical-align: top;">
                        {create_ai_block('Residency Verification', ai_results.get('residencyCheck', {}))}
                    </td>
                    <td style="width: 50%; padding-top: 5px; padding-left: 10px; vertical-align: top;">
                        {create_ai_block('Employer Verification', ai_results.get('employerVerification', {}))}
                    </td>
                </tr>
            </table>
            {create_ai_block('Bank Statement Consistency & Health', ai_results.get('bankConsistency', {}))}
            """

            def build_form_table(section, items):
                rows = ""
                for k, v in items.items():
                    if isinstance(v, (dict, list)): continue
                    label = re.sub(r'([A-Z])', r' \1', k).strip().capitalize()
                    rows += f"<tr><td style='padding: 6px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 40%; font-size: 0.85em;'>{label}</td><td style='padding: 6px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 0.85em;'>{v}</td></tr>"
                return f"""
                <div style="margin-top: 20px;">
                    <h4 style="color: #475569; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; font-size: 0.75em; letter-spacing: 0.5px;">{section}</h4>
                    <table style="width: 100%; border-collapse: collapse;">{rows}</table>
                </div>
                """

            agent_html = f"""
            <html>
            <body style="font-family: sans-serif; background-color: #f1f5f9; padding: 20px;">
                <div style="max-width: 850px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <span style="background: #1e293b; color: #fbbf24; padding: 8px 16px; font-weight: bold; border-radius: 4px; font-size: 0.8em;">AGENT REVIEW PACKAGE</span>
                        <h2 style="color: #0f172a; margin: 15px 0 5px;">{property_name}</h2>
                        <p style="color: #64748b; margin-top: 0;">Submitted: {submitted_at}</p>
                    </div>
                    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; border-top: 4px solid #fbbf24; margin-bottom: 30px;">
                        <h3 style="color: #0f172a; margin-top: 0;">AI ANALYSIS SUMMARY</h3>
                        {ai_grid}
                    </div>
                    <h3 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">APPLICANT PROFILE</h3>
                    {build_form_table('Personal Information', form_data.get('firstApplicant', {}))}
                    {build_form_table('Employment details', form_data.get('firstApplicant', {}).get('employment', {}))}
                    {build_form_table('Banking details', form_data.get('firstApplicant', {}).get('banking', {}))}
                </div>
            </body>
            </html>
            """
            agent_msg.attach(MIMEText(agent_html, 'html'))

            # 2. APPLICANT EMAIL
            credit_check_fee = form_data.get('property', {}).get('creditCheckFee', 0)
            num_applicants = 1
            if form_data.get('secondApplicant', {}).get('enabled'):
                num_applicants = 2
            total_fee = credit_check_fee * num_applicants

            applicant_msg = MIMEMultipart()
            applicant_msg['From'] = DEFAULT_SENDER
            applicant_msg['To'] = applicant_email
            applicant_msg['Subject'] = f"Application Confirmed - {property_name}"
            
            app_html = f"""
            <html>
            <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #1a365d;">Application Received</h2>
                    <p>Hi {applicant_name},</p>
                    <p>Your application for <strong>{property_name}</strong> has been successfully submitted and forwarded to the property agent for review.</p>
                    
                    <div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #c53030;">Action Required: Credit Check Fee</h3>
                        <p>To process your application, a credit check fee of <strong>R{total_fee:,.2f}</strong> (R{credit_check_fee:,.2f} x {num_applicants} applicant{'s' if num_applicants > 1 else ''}) must be paid into the following account:</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 4px 0;"><strong>Bank:</strong></td><td>FNB</td></tr>
                            <tr><td style="padding: 4px 0;"><strong>Account Number:</strong></td><td>62855339547</td></tr>
                            <tr><td style="padding: 4px 0;"><strong>Branch Code:</strong></td><td>250655</td></tr>
                            <tr><td style="padding: 4px 0;"><strong>Reference:</strong></td><td>{applicant_name}</td></tr>
                        </table>
                    </div>

                    <p>Please send your proof of payment to the agent at {agent_email}.</p>
                    <p>Sincerely,<br>Leasing Support</p>
                </div>
            </body>
            </html>
            """
            applicant_msg.attach(MIMEText(app_html, 'html'))

            # Handle attachments
            if 'files' in form:
                file_items = form['files']
                if not isinstance(file_items, list):
                    file_items = [file_items]
                
                for file_item in file_items:
                    if file_item.filename:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(file_item.file.read())
                        encoders.encode_base64(part)
                        part.add_header('Content-Disposition', f"attachment; filename={file_item.filename}")
                        agent_msg.attach(part)

            # Send
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(agent_msg)
            server.send_message(applicant_msg)
            server.quit()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode())
            print(f"Server error: {e}")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
