/* ============================================
   SEKELELA LOANS - APPLICATION JAVASCRIPT
   Handles calculator, form navigation, and validation
   ============================================ */

// Global Variables
let currentStep = 1;
const totalSteps = 4;
let applicationData = {};
let selectedFiles = {
    nrcFile: null,
    photoFile: null
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    initializeFormListeners();
    setMinRepaymentDays();
});

// ============================================
// LOAN CALCULATOR FUNCTIONS
// ============================================

function updateCalculator() {
    // Get loan amount
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const loanSlider = document.getElementById('loanSlider');
    const repaymentDays = parseInt(document.getElementById('repaymentDays').value) || 7;
    const daysSlider = document.getElementById('daysSlider');
    
    // Sync inputs with sliders
    document.getElementById('loanAmount').value = loanSlider.value;
    document.getElementById('repaymentDays').value = daysSlider.value;
    
    const updatedAmount = parseFloat(loanSlider.value) || 0;
    const updatedDays = parseInt(daysSlider.value) || 7;
    
    // Get selected term
    const selectedTerm = document.querySelector('input[name="term"]:checked').value;
    let interestRate = selectedTerm === 'short' ? 20 : 30;
    
    // Validate repayment days against term
    validateRepaymentDays(updatedDays, selectedTerm);
    
    // Calculate interest
    const interestAmount = (updatedAmount * interestRate) / 100;
    const totalRepay = updatedAmount + interestAmount;
    const dueDate = calculateDueDate(updatedDays);
    
    // Display results
    displayCalculationResults(updatedAmount, interestRate, interestAmount, totalRepay, dueDate);
    
    // Store calculator data
    applicationData.loanAmount = updatedAmount;
    applicationData.interestRate = interestRate;
    applicationData.repaymentDays = updatedDays;
}

function initializeCalculator() {
    // Initial calculation
    updateCalculator();
    
    // Add listeners for real-time updates
    document.getElementById('loanAmount').addEventListener('change', updateCalculator);
    document.getElementById('loanSlider').addEventListener('input', updateCalculator);
    document.getElementById('repaymentDays').addEventListener('change', updateCalculator);
    document.getElementById('daysSlider').addEventListener('input', updateCalculator);
    document.querySelectorAll('input[name="term"]').forEach(radio => {
        radio.addEventListener('change', updateCalculator);
    });
}

function setMinRepaymentDays() {
    const daysInput = document.getElementById('repaymentDays');
    const daysSlider = document.getElementById('daysSlider');
    const selectedTerm = document.querySelector('input[name="term"]:checked').value;
    
    if (selectedTerm === 'short') {
        daysInput.min = 7;
        daysSlider.min = 7;
        daysInput.max = 30;
        daysSlider.max = 30;
        if (parseInt(daysInput.value) > 30) {
            daysInput.value = 30;
            daysSlider.value = 30;
        }
    } else {
        daysInput.min = 60;
        daysSlider.min = 60;
        daysInput.max = 90;
        daysSlider.max = 90;
        if (parseInt(daysInput.value) < 60) {
            daysInput.value = 60;
            daysSlider.value = 60;
        }
    }
}

function validateRepaymentDays(days, term) {
    const min = term === 'short' ? 7 : 60;
    const max = term === 'short' ? 30 : 90;
    
    if (days < min || days > max) {
        const daysInput = document.getElementById('repaymentDays');
        const daysSlider = document.getElementById('daysSlider');
        daysInput.value = Math.min(Math.max(days, min), max);
        daysSlider.value = daysInput.value;
    }
}

function displayCalculationResults(principal, rate, interestAmount, totalRepay, dueDate) {
    document.getElementById('principalDisplay').textContent = formatCurrency(principal);
    document.getElementById('interestRateDisplay').textContent = rate + '%';
    document.getElementById('interestAmountDisplay').textContent = formatCurrency(interestAmount);
    document.getElementById('totalRepayDisplay').textContent = formatCurrency(totalRepay);
    document.getElementById('dueDateDisplay').textContent = dueDate;
}

function calculateDueDate(days) {
    const today = new Date();
    const dueDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return dueDate.toLocaleDateString('en-ZM', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: 'ZMW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// ============================================
// FORM FUNCTIONS
// ============================================

function initializeFormListeners() {
    const form = document.getElementById('loanApplicationForm');
    
    // Add listeners for term changes to update min/max days
    document.querySelectorAll('input[name="term"]').forEach(radio => {
        radio.addEventListener('change', setMinRepaymentDays);
    });
}

function changeStep(direction) {
    // Validate current step before moving
    if (direction === 1) {
        if (!validateCurrentStep()) {
            return;
        }
        
        // Save current step data
        saveStepData();
    }
    
    // Update step
    currentStep += direction;
    
    // Ensure within bounds
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;
    
    // Update UI
    updateFormUI();
}

function validateCurrentStep() {
    const step = currentStep;
    let isValid = true;
    const errorMessages = [];
    
    if (step === 1) {
        // Step 1: Personal Details
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const nrc = document.getElementById('nrcNumber').value.trim();
        const mobile = document.getElementById('mobileNumber').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        
        if (!firstName) {
            errorMessages.push('First Name is required');
            isValid = false;
        }
        if (!lastName) {
            errorMessages.push('Last Name is required');
            isValid = false;
        }
        if (!nrc || !validateNRC(nrc)) {
            errorMessages.push('NRC Number must be in format XXXXXX/XX/X');
            isValid = false;
        }
        if (!mobile || !validateMobileNumber(mobile)) {
            errorMessages.push('Please enter a valid mobile number');
            isValid = false;
        }
        if (!address) {
            errorMessages.push('Residential Address is required');
            isValid = false;
        }
        if (!city) {
            errorMessages.push('City/Town is required');
            isValid = false;
        }
    } 
    else if (step === 2) {
        // Step 2: Next of Kin
        const nokName = document.getElementById('nextOfKinName').value.trim();
        const relationship = document.getElementById('relationship').value;
        const nokPhone = document.getElementById('nextOfKinPhone').value.trim();
        
        if (!nokName) {
            errorMessages.push('Relative\'s Full Name is required');
            isValid = false;
        }
        if (!relationship) {
            errorMessages.push('Please select a relationship');
            isValid = false;
        }
        if (!nokPhone || !validateMobileNumber(nokPhone)) {
            errorMessages.push('Please enter a valid phone number for your relative');
            isValid = false;
        }
    } 
    else if (step === 3) {
        // Step 3: Document Uploads
        if (!selectedFiles.nrcFile) {
            errorMessages.push('Please upload your NRC scan');
            isValid = false;
        }
        if (!selectedFiles.photoFile) {
            errorMessages.push('Please upload your photo/selfie');
            isValid = false;
        }
    } 
    else if (step === 4) {
        // Step 4: Terms Agreement
        const termsCheckbox = document.getElementById('termsCheckbox').checked;
        
        if (!termsCheckbox) {
            errorMessages.push('You must agree to the Terms & Conditions to proceed');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showValidationError(errorMessages);
    }
    
    return isValid;
}

function validateNRC(nrc) {
    const nrcPattern = /^\d{6}\/\d{2}\/\d{1}$/;
    return nrcPattern.test(nrc);
}

function validateMobileNumber(phone) {
    // Accept both +260 format and 0 format
    const phonePattern = /^(\+260\s\d{2}\s\d{3}\s\d{4}|0\d{9})$/;
    return phonePattern.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function saveStepData() {
    if (currentStep === 1) {
        applicationData.firstName = document.getElementById('firstName').value;
        applicationData.middleName = document.getElementById('middleName').value;
        applicationData.lastName = document.getElementById('lastName').value;
        applicationData.nrcNumber = document.getElementById('nrcNumber').value;
        applicationData.mobileNumber = document.getElementById('mobileNumber').value;
        applicationData.address = document.getElementById('address').value;
        applicationData.city = document.getElementById('city').value;
    } 
    else if (currentStep === 2) {
        applicationData.nextOfKinName = document.getElementById('nextOfKinName').value;
        applicationData.relationship = document.getElementById('relationship').value;
        applicationData.nextOfKinPhone = document.getElementById('nextOfKinPhone').value;
    } 
    else if (currentStep === 3) {
        // Files already saved in handleFileSelect
    } 
    else if (currentStep === 4) {
        // Summary will be populated
    }
}

function updateFormUI() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Update buttons
    updateFormButtons();
    
    // Update summary if on final step
    if (currentStep === 4) {
        updateApplicationSummary();
    }
    
    // Scroll to form
    document.querySelector('.application-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

function updateFormButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    // Show/hide next button and submit button
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function updateApplicationSummary() {
    document.getElementById('summaryName').textContent = 
        `${applicationData.firstName || ''} ${applicationData.lastName || ''}`.trim();
    document.getElementById('summaryNRC').textContent = applicationData.nrcNumber || '-';
    document.getElementById('summaryPhone').textContent = applicationData.mobileNumber || '-';
    document.getElementById('summaryCity').textContent = applicationData.city || '-';
    document.getElementById('summaryNOK').textContent = 
        `${applicationData.nextOfKinName || ''} (${applicationData.relationship || ''})`.trim();
}

function handleFileSelect(input, displayElementId) {
    const file = input.files[0];
    
    if (file) {
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showValidationError(['File size must not exceed 5MB']);
            input.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        const isPhotoInput = displayElementId === 'photoFileName';
        if (isPhotoInput) {
            // Photo only allows image types
            if (!['image/png', 'image/jpeg'].includes(file.type)) {
                showValidationError(['Only PNG and JPG formats are allowed for photos']);
                input.value = '';
                return;
            }
        }
        
        // Store file reference
        if (displayElementId === 'nrcFileName') {
            selectedFiles.nrcFile = file;
        } else if (displayElementId === 'photoFileName') {
            selectedFiles.photoFile = file;
        }
        
        // Display filename
        document.getElementById(displayElementId).textContent = `✓ ${file.name}`;
    }
}

function showValidationError(messages) {
    alert('Please fix the following errors:\n\n' + messages.join('\n'));
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    // Final validation
    if (!validateCurrentStep()) {
        return;
    }
    
    // Save final step data
    saveStepData();
    
    // Generate reference number
    const referenceNumber = generateReferenceNumber();
    
    // Log application data (in production, this would be sent to backend)
    console.log('Application Data:', {
        ...applicationData,
        referenceNumber: referenceNumber,
        submittedAt: new Date().toISOString()
    });
    
    // Show success modal
    showSuccessModal(referenceNumber);
    
    // Reset form (optional)
    // document.getElementById('loanApplicationForm').reset();
    // currentStep = 1;
    // updateFormUI();
}

function generateReferenceNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SEK-${timestamp}-${random}`;
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showTermsModal(event) {
    event.preventDefault();
    const modal = document.getElementById('termsModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showSuccessModal(referenceNumber) {
    document.getElementById('referenceNumber').textContent = referenceNumber;
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    resetApplicationForm();
}

function resetApplicationForm() {
    document.getElementById('loanApplicationForm').reset();
    currentStep = 1;
    applicationData = {};
    selectedFiles = { nrcFile: null, photoFile: null };
    document.getElementById('nrcFileName').textContent = '';
    document.getElementById('photoFileName').textContent = '';
    updateFormUI();
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const termsModal = document.getElementById('termsModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === termsModal) {
        closeTermsModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTermsModal();
        closeSuccessModal();
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !href.includes('javascript')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize mobile menu
setupMobileMenu();

// ============================================
// FORM AUTO-FORMATTING
// ============================================

// Auto-format NRC input
document.getElementById('nrcNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) {
        value = value.substring(0, 6) + '/' + value.substring(6);
    }
    if (value.length > 9) {
        value = value.substring(0, 9) + '/' + value.substring(9, 10);
    }
    e.target.value = value;
});

// Auto-format mobile number
document.getElementById('mobileNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('260')) {
        value = '+260 ' + value.substring(3);
    } else if (value.startsWith('0')) {
        // Convert to +260 format
        value = '+260 ' + value.substring(1);
    }
    
    // Format as +260 XY XXX XXXX
    if (value.startsWith('+260')) {
        const digits = value.replace(/\D/g, '');
        if (digits.length > 3) {
            value = '+260 ' + digits.substring(3, 5) + ' ' + digits.substring(5, 8) + ' ' + digits.substring(8, 12);
        }
    }
    
    e.target.value = value;
});

// ============================================
// DEBUGGING / TESTING (Comment out in production)
// ============================================

// Function to populate form with test data
function populateTestData() {
    document.getElementById('firstName').value = 'John';
    document.getElementById('middleName').value = 'James';
    document.getElementById('lastName').value = 'Phiri';
    document.getElementById('nrcNumber').value = '123456/78/9';
    document.getElementById('mobileNumber').value = '+260 97 123 4567';
    document.getElementById('address').value = '123 Main Street, Kabulonga';
    document.getElementById('city').value = 'Lusaka';
    document.getElementById('nextOfKinName').value = 'Jane Phiri';
    document.getElementById('relationship').value = 'spouse';
    document.getElementById('nextOfKinPhone').value = '+260 96 987 6543';
    console.log('Test data populated');
}

// Uncomment to test: populateTestData();

console.log('Sekelela Loans Application Script Loaded');
