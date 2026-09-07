# Sekelela Loans - Loan Application Portal

A modern, mobile-first web application for **Sekelela Loans**, a Zambian micro-lending company. This platform provides a clean, secure, and user-friendly interface for loan applications with real-time loan calculations and multi-step application processing.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Technical Details](#technical-details)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Contact & Support](#contact--support)

---

## ✨ Features

### 1. **Interactive Loan Calculator**
- **Loan Amount Range**: ZMW 5 to ZMW 10,000 with slider and text input
- **Flexible Repayment Terms**:
  - Short-Term (7-30 days) with 20% interest rate
  - Medium-Term (60-90 days) with 30% interest rate
- **Real-Time Calculations**: Instantly displays:
  - Principal Amount
  - Interest Rate (%)
  - Interest Amount (ZMW)
  - Total Repayment Amount
  - Repayment Due Date
- **Responsive Design**: Works seamlessly on all device sizes

### 2. **Multi-Step Application Form**
The application is divided into 4 intuitive steps with progress tracking:

#### Step 1: Personal Details
- First, Middle, and Last Names
- National Registration Card (NRC) Number with format validation (XXXXXX/XX/X)
- Mobile phone number (MTN, Airtel, Zamtel compatible)
- Physical residential address
- City/Town selection

#### Step 2: Next of Kin Information
- Relative's full name
- Relationship to applicant (dropdown selection)
- Relative's contact phone number

#### Step 3: Document Verification
- NRC scan upload (front and back)
- Passport-style photo or live selfie upload
- File validation (format and size)

#### Step 4: Terms & Confirmation
- Application summary review
- Terms and Conditions agreement
- Final submission

### 3. **Modern User Interface**
- **Color Palette**: Professional deep green/teal with warm gold accents
- **Typography**: Clear, readable fonts optimized for mobile
- **Visual Feedback**: Smooth animations and transitions
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark Mode**: Automatic support for system dark mode preferences

### 4. **Data Validation**
- Client-side validation for all form fields
- NRC format validation
- Mobile number validation (Zambian format)
- File upload validation (size and type)
- Clear error messaging

### 5. **Terms & Conditions Modal**
- Comprehensive T&C document
- Easy-to-read modal presentation
- Printable content

### 6. **Success Confirmation**
- Application reference number generation
- Success modal with next steps
- Contact information for follow-up

---

## 📁 Project Structure

```
sekelela-loans/
├── index.html           # Main application HTML
├── styles.css           # Comprehensive CSS styling
├── app.js              # JavaScript functionality
├── README.md           # This file
├── DEPLOYMENT.md       # Deployment guide
├── BACKEND-SETUP.md    # Backend integration guide
└── .gitignore         # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side dependencies required for client-side functionality
- A web server for deployment (Apache, Nginx, Node.js, etc.)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/mstembo127-ai/sekelela-loans.git
cd sekelela-loans
```

#### 2. Local Testing (No Server)
Simply open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

#### 3. Local Development Server (Recommended)

**Using Python 3:**
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
# Visit http://localhost:8000
```

**Using Node.js (http-server):**
```bash
npm install -g http-server
http-server -p 8000
# Visit http://localhost:8000
```

**Using PHP:**
```bash
php -S localhost:8000
# Visit http://localhost:8000
```

---

## 📖 Usage Guide

### For End Users (Loan Applicants)

#### 1. **Calculate Your Loan**
- Navigate to the "Calculator" section
- Adjust the **Loan Amount** slider (ZMW 5 - ZMW 10,000)
- Select your preferred **Repayment Term**:
  - Short-Term (7-30 days, 20% interest)
  - Medium-Term (60-90 days, 30% interest)
- Adjust **Repayment Duration** using the slider
- View real-time calculations in the breakdown display

#### 2. **Complete Application Form**
Click "Apply Now" or navigate to the application section

**Step 1: Personal Details**
- Enter your full legal name (First, Middle, Last)
- Input your NRC number (format: 123456/78/9)
- Enter your primary mobile number
- Provide your residential address
- Select your city/town

**Step 2: Next of Kin**
- Enter your relative's full name
- Select your relationship (Spouse, Parent, Sibling, etc.)
- Provide their contact phone number

**Step 3: Upload Documents**
- Upload a scan of your NRC (front & back)
- Upload a clear passport-style photo or selfie
- Maximum file size: 5MB per file
- Accepted formats: PNG, JPG, PDF (for NRC only)

**Step 4: Review & Submit**
- Review your application summary
- Read and accept the Terms & Conditions
- Click "Submit Application"
- Receive your application reference number

#### 3. **Track Application**
- Save your reference number for future inquiries
- Contact support via phone, email, or WhatsApp
- Check email/SMS for application status updates

### For Administrators

See `BACKEND-SETUP.md` for backend integration and administrative features.

---

## 🔧 Technical Details

### Architecture

**Frontend Stack:**
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Mobile-first, responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: No dependencies, pure JS for optimal performance

### Key JavaScript Functions

#### Calculator Functions
```javascript
updateCalculator()           // Main calculator update
calculateDueDate(days)       // Calculate repayment date
formatCurrency(amount)       // Format amounts in ZMW
displayCalculationResults()  // Update calculator display
```

#### Form Functions
```javascript
changeStep(direction)        // Navigate between form steps
validateCurrentStep()        // Validate current form step
validateNRC(nrc)            // Validate NRC format
validateMobileNumber(phone)  // Validate phone format
saveStepData()              // Save form data
handleFormSubmit(event)     // Process form submission
```

#### Utility Functions
```javascript
scrollToSection(sectionId)  // Smooth scroll navigation
generateReferenceNumber()   // Generate unique application ID
handleFileSelect(input)     // Process file uploads
```

### CSS Variables (Customization)

Key CSS variables in `styles.css`:
```css
--primary-dark: #006B54;      /* Deep Teal/Green */
--primary-light: #00B86F;     /* Bright Green */
--secondary-warm: #FFA500;    /* Warm Orange/Gold */
--accent-light: #FFD700;      /* Light Yellow */
```

### Form Data Structure

Application data is stored in a JavaScript object:
```javascript
applicationData = {
    firstName: string,
    middleName: string,
    lastName: string,
    nrcNumber: string,
    mobileNumber: string,
    address: string,
    city: string,
    nextOfKinName: string,
    relationship: string,
    nextOfKinPhone: string,
    loanAmount: number,
    interestRate: number,
    repaymentDays: number
}
```

---

## 🎨 Customization

### Changing Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-dark: #YOUR_COLOR;
    --primary-light: #YOUR_COLOR;
    --secondary-warm: #YOUR_COLOR;
    --accent-light: #YOUR_COLOR;
}
```

### Changing Loan Amounts

Edit in `index.html`:
```html
<input type="number" id="loanAmount" min="5" max="10000" step="100">
```

### Changing Interest Rates

Edit in `app.js`:
```javascript
let interestRate = selectedTerm === 'short' ? 20 : 30; // Modify these values
```

### Changing Repayment Terms

Edit in `index.html` and `app.js`:
```html
<label class="term-option">
    <input type="radio" name="term" value="short">
    <span>Short-Term (7-30 Days) - 20% Interest</span>
</label>
```

### Adding Company Information

Edit the header and footer in `index.html`:
```html
<div class="logo-text">
    <h1 class="logo-title">Sekelela Loans</h1>
    <p class="logo-tagline">Your Custom Tagline Here</p>
</div>
```

### Modifying Terms & Conditions

Edit the modal content in `index.html`:
```html
<div id="termsModal" class="modal">
    <div class="modal-content">
        <!-- Edit T&C content here -->
    </div>
</div>
```

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full Support |
| Firefox | Latest | ✅ Full Support |
| Safari | Latest | ✅ Full Support |
| Edge | Latest | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | Latest | ✅ Full Support |
| Mobile Firefox | Latest | ✅ Full Support |

### Mobile Optimization
- Responsive design tested on devices from 320px to 1920px width
- Touch-friendly buttons (minimum 44x44px)
- Optimized for 4G/LTE networks
- Minimal data usage

---

## 🔒 Security Considerations

### Current Security Features
- **Client-side Validation**: All inputs validated before processing
- **File Upload Validation**: Size and type restrictions
- **XSS Prevention**: No inline script execution
- **HTTPS Ready**: Deploy with HTTPS certificate

### Additional Security for Production

1. **Backend Validation**
   - Never trust client-side validation alone
   - Re-validate all data on the server
   - Implement server-side rate limiting

2. **Data Encryption**
   - Use HTTPS/TLS for all communications
   - Encrypt sensitive data at rest
   - Implement secure password storage

3. **Authentication**
   - Implement secure login system
   - Use OAuth 2.0 or similar for user management
   - Add 2FA support

4. **Privacy**
   - Comply with data protection regulations
   - Implement data retention policies
   - Add privacy policy and cookie consent

5. **API Security**
   - Use JWT tokens for API authentication
   - Implement CORS properly
   - Add API rate limiting and throttling

See `BACKEND-SETUP.md` for detailed backend security implementation.

---

## 🚀 Deployment

### Quick Deployment Options

#### 1. **GitHub Pages** (Free, Static Only)
```bash
# This repository is already public and can be deployed to GitHub Pages
# Go to Settings → Pages → Source: Deploy from branch (main)
# Your site will be available at: https://mstembo127-ai.github.io/sekelela-loans/
```

#### 2. **Netlify** (Free Tier Available)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or connect GitHub repo for automatic deployments
```

#### 3. **Vercel** (Free Tier Available)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 4. **Traditional Hosting** (Apache/Nginx)
See `DEPLOYMENT.md` for detailed instructions.

---

## 📊 Application Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│               Sekelela Loans Portal                      │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
         ┌──────▼─────┐      ┌──────▼──────┐
         │ Calculator │      │ Apply Now   │
         └──────┬─────┘      └──────┬──────┘
                │                   │
                │         ┌─────────┴──────────┐
                │         │                    │
                │    Step 1: Personal    Step 2: Next of Kin
                │         │                    │
                │         └────────┬───────────┘
                │                  │
                │         ┌────────▼────────┐
                │         │                 │
                │    Step 3: Documents  Step 4: Confirm
                │         │                 │
                │         └────────┬────────┘
                │                  │
                └──────────┬───────┘
                           │
                    ┌──────▼──────┐
                    │   Submit    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │ Success Modal   │
                    │ (Reference #)   │
                    └─────────────────┘
```

---

## 🔄 Loan Calculation Example

**Scenario:**
- Loan Amount: ZMW 5,000
- Term: Medium-Term (60-90 days)
- Duration: 75 days

**Calculation:**
```
Principal: ZMW 5,000
Interest Rate: 30%
Interest Amount: ZMW 5,000 × 30% = ZMW 1,500
Total to Repay: ZMW 5,000 + ZMW 1,500 = ZMW 6,500
Due Date: 75 days from application date
```

---

## 📞 Contact & Support

### Customer Support
- **Phone**: +260 211 123 456
- **Email**: support@sekelela.zm
- **WhatsApp**: +260 97 123 4567
- **Hours**: Monday - Friday, 8:00 AM - 5:00 PM SAST

### Technical Support (Developers)
- **GitHub Issues**: [Report bugs and request features](https://github.com/mstembo127-ai/sekelela-loans/issues)
- **Email**: dev@sekelela.zm

---

## 📝 Version History

### v1.0.0 (Current)
- ✅ Complete landing page with hero section
- ✅ Interactive loan calculator
- ✅ 4-step application form with validation
- ✅ Document upload functionality
- ✅ Mobile-responsive design
- ✅ Terms & Conditions modal
- ✅ Success confirmation with reference number

### Planned Features (v1.1.0)
- 🔄 Application status tracking
- 🔄 Email/SMS notifications
- 🔄 Loan calculator export (PDF)
- 🔄 Multi-language support (English, Bemba, Nyanja)
- 🔄 Payment integration
- 🔄 Admin dashboard

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- All features are tested
- Documentation is updated
- Commit messages are descriptive

---

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Detailed description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Browser/device information

---

## ✅ Testing Checklist

Before deploying to production, verify:

- [ ] All form fields validate correctly
- [ ] Calculator updates in real-time
- [ ] File uploads work (test with various file sizes)
- [ ] Modal dialogs open and close properly
- [ ] Form navigation works (previous/next buttons)
- [ ] Application can be submitted successfully
- [ ] Success modal displays reference number
- [ ] Responsive design works on mobile devices
- [ ] All links navigate correctly
- [ ] No console errors in browser developer tools

---

## 📚 Additional Resources

- [HTML5 Specification](https://html.spec.whatwg.org/)
- [CSS3 Documentation](https://www.w3.org/Style/CSS/)
- [JavaScript MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/)
- [Responsive Design Principles](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## 📞 Support & Questions

For questions or support:
1. Check the FAQ section (coming soon)
2. Review existing GitHub issues
3. Contact support@sekelela.zm
4. Create a new GitHub issue

---

**Last Updated**: September 7, 2026  
**Repository**: [github.com/mstembo127-ai/sekelela-loans](https://github.com/mstembo127-ai/sekelela-loans)  
**License**: MIT  

---

*Made with ❤️ for Zambian financial inclusion*
