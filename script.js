// Function to create custom select lists
function createCustomSelect(containerId, selectedId, optionsId, data, type) {
    const selectedElement = document.getElementById(selectedId);
    const optionsContainer = document.getElementById(optionsId);
    
    // Clear previous content
    optionsContainer.innerHTML = '';
    
    // Create list items
    data.forEach(item => {
        const optionElement = document.createElement('div');
        optionElement.className = 'select-item';
        optionElement.setAttribute('data-value', item.code);
        optionElement.textContent = item.name;
        
        optionElement.addEventListener('click', function() {
            // Remove previous selection
            document.querySelectorAll(`#${optionsId} .select-item.selected`).forEach(item => {
                item.classList.remove('selected');
            });
            
            // Select new item
            this.classList.add('selected');
            selectedElement.textContent = this.textContent;
            selectedElement.setAttribute('data-value', this.getAttribute('data-value'));
            
            // Close list
            optionsContainer.classList.remove('open');
            selectedElement.classList.remove('select-arrow-active');
            
            // Update state and final code
            updateStateFromCustomSelect(type, this.getAttribute('data-value'));
            updateFinalCode();
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Click event to open/close list
    selectedElement.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Close all other lists
        closeAllSelect(this);
        
        // Open or close current list
        optionsContainer.classList.toggle('open');
        this.classList.toggle('select-arrow-active');
    });
}

// Function to close all open lists
function closeAllSelect(exceptElement) {
    const allSelectItems = document.querySelectorAll('.select-items');
    const allSelectedElements = document.querySelectorAll('.select-selected');
    
    allSelectItems.forEach(item => {
        if (exceptElement && item !== exceptElement.nextElementSibling) {
            item.classList.remove('open');
        }
    });
    
    allSelectedElements.forEach(element => {
        if (exceptElement && element !== exceptElement) {
            element.classList.remove('select-arrow-active');
        }
    });
}

// Function to update state from custom select
function updateStateFromCustomSelect(type, value) {
    switch(type) {
        case 'company':
            state.company = value;
            break;
        case 'department':
            state.department = value;
            break;
        case 'contentType':
            state.contentType = value;
            break;
        case 'status':
            state.status = value;
            break;
    }
}

// Function to populate custom selects
function populateCustomSelects() {
    if (!state.optionsData) return;
    
    createCustomSelect('company-container', 'company-selected', 'company-options', state.optionsData.companies, 'company');
    createCustomSelect('department-container', 'department-selected', 'department-options', state.optionsData.departments, 'department');
    createCustomSelect('content-type-container', 'content-type-selected', 'content-type-options', state.optionsData.contentTypes, 'contentType');
    createCustomSelect('status-container', 'status-selected', 'status-options', state.optionsData.statuses, 'status');
}

// Add populateCustomSelects function to populateSelectOptions function
function populateSelectOptions() {
    if (!state.optionsData) return;
    
    populateCustomSelects();
}

// Close lists by clicking anywhere on the page
document.addEventListener('click', function(e) {
    if (!e.target.matches('.select-selected') && !e.target.matches('.select-item')) {
        closeAllSelect();
    }
});

// Modify isFormValid function to match new lists
function isFormValid() {
    return state.date &&
           state.projectName && 
           state.description && 
           state.company && 
           state.department && 
           state.contentType && 
           state.status;
}

// Modify updateFinalCode function to match new lists
function updateFinalCode() {
    const finalCodeInput = document.getElementById('final-code');
    const copyButton = document.getElementById('copy-btn');
    const saveButton = document.getElementById('save-btn');
    
    if (isFormValid()) {
        const finalCode = `${state.company}-${state.department}-${state.projectName}-${state.description}-${state.contentType}-${state.status}-${state.date}`;
        finalCodeInput.value = finalCode;
        copyButton.disabled = false;
        saveButton.disabled = false;
    } else {
        finalCodeInput.value = "";
        copyButton.disabled = true;
    }
}        

// Application state
const state = {
    date: null,
    projectName: "",
    description: "",
    company: null,
    department: null,
    contentType: null,
    status: null,
    savedFiles: [],
    optionsData: null,
    calendar: {
        currentYear: null,
        currentMonth: null,
        selectedDate: null
    }
};

// Function to convert English numbers to Persian
function toPersianNumbers(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, digit => persianDigits[parseInt(digit)]);
}

// Function to convert Persian numbers to English
function toEnglishNumbers(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, digit => persianDigits.indexOf(digit));
}

// Load data from JSON file
async function loadOptionsData() {
  try {
    // Load data from JSON file
    const response = await fetch('options.json');
    
    // Check response status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Convert response to JSON
    state.optionsData = await response.json();
    
    populateSelectOptions();
  } catch (error) {
    console.error('Error loading options:', error);
    
    // Use fallback data in case of error
    console.log('Using fallback data...');
    state.optionsData = {
      companies: [
        { name: "Robin Tejarat", code: "RT" },
        { name: "Robin Fanavari", code: "RF" },
        { name: "Moshtarak", code: "MS" }
      ],
      departments: [
        { name: "Financial", code: "FIN" },
        { name: "Administrative", code: "ADM" },
        { name: "Legal", code: "LEG" },
        { name: "Sales and Marketing", code: "SAL" },
        { name: "Human Resources", code: "HR" },
        { name: "Public Relations and Advertising", code: "PR" },
        { name: "Technical and Engineering", code: "TEC" },
        { name: "Customers", code: "CS" },
        { name: "Research and Development", code: "RND" },
        { name: "Representation", code: "REP" },
        { name: "Park", code: "PRK" },
        { name: "Leadership", code: "LDR" },
        { name: "Artificial Intelligence", code: "AI" }
      ],
      contentTypes: [
        { name: "Regulations and Policies", code: "POL" },
        { name: "Procedures", code: "PRO" },
        { name: "Photo", code: "IMG" },
        { name: "General Text File", code: "TXT" },
        { name: "Map, Plan", code: "MAP" },
        { name: "Meeting Minutes, Notes", code: "MNT" },
        { name: "Programming and Algorithms", code: "ALG" },
        { name: "Report", code: "RPT" },
        { name: "Video", code: "VID" },
        { name: "Contract", code: "CNT" },
        { name: "Design", code: "DES" },
        { name: "Invoice", code: "INV" },
        { name: "File", code: "FIL" }
      ],
      statuses: [
        { name: "Final", code: "FIN" },
        { name: "Approved", code: "APR" }
      ]
    };
    populateSelectOptions();
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Load data from JSON
    await loadOptionsData();
    
    // Set today's date
    setTodayDate();
    
    // Set up events
    setupEventListeners();
    
    // Load saved files
    loadSavedFiles();
    
    // Set up theme
    setupTheme();
    
    // Initialize calendar
    initCalendar();
}

// Function to convert Gregorian date to Jalali
function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * (parseInt(days / 12053));
    days %= 12053;
    jy += 4 * (parseInt(days / 1461));
    days %= 1461;
    jy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
}

// Function to convert Jalali date to Gregorian
function jalaliToGregorian(jy, jm, jd) {
    jy += 1595;
    let days = -355668 + (365 * jy) + (parseInt(jy / 33) * 8) + parseInt(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    let gy = 400 * parseInt(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * parseInt(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * parseInt(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += parseInt((days - 1) / 365);
    }
    let gd = days + 1;
    const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm;
    for (gm = 0; gm < 13; gm++) {
        let v = sal_a[gm];
        if (gd <= v) break;
        gd -= v;
    }
    return [gy, gm, gd];
}

function setTodayDate() {
    const today = new Date();
    const jalaliDate = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const formattedDate = `${jalaliDate[0]}/${String(jalaliDate[1]).padStart(2, '0')}/${String(jalaliDate[2]).padStart(2, '0')}`;
    document.getElementById('date').value = toPersianNumbers(formattedDate);
    state.date = formattedDate.replace(/\//g, '');
}

function populateSelectOptions() {
    if (!state.optionsData) return;
    
    // Populate companies
    const companyItems = document.getElementById('company-items');
    state.optionsData.companies.forEach(company => {
        const item = document.createElement('div');
        item.className = 'select-item';
        item.setAttribute('data-value', company.code);
        item.textContent = company.name;
        companyItems.appendChild(item);
    });
    
    // Populate departments
    const departmentItems = document.getElementById('department-items');
    state.optionsData.departments.forEach(dept => {
        const item = document.createElement('div');
        item.className = 'select-item';
        item.setAttribute('data-value', dept.code);
        item.textContent = dept.name;
        departmentItems.appendChild(item);
    });
    
    // Populate content types
    const contentTypeItems = document.getElementById('content-type-items');
    state.optionsData.contentTypes.forEach(type => {
        const item = document.createElement('div');
        item.className = 'select-item';
        item.setAttribute('data-value', type.code);
        item.textContent = type.name;
        contentTypeItems.appendChild(item);
    });
    
    // Populate statuses
    const statusItems = document.getElementById('status-items');
    state.optionsData.statuses.forEach(status => {
        const item = document.createElement('div');
        item.className = 'select-item';
        item.setAttribute('data-value', status.code);
        item.textContent = status.name;
        statusItems.appendChild(item);
    });
}

function setupEventListeners() {
    // Theme change event
    document.getElementById('theme-toggle-checkbox').addEventListener('change', toggleTheme);
    
    // Validation events
    document.getElementById('date').addEventListener('input', validateDate);
    document.getElementById('project-name').addEventListener('input', validateProjectName);
    document.getElementById('description').addEventListener('input', validateDescription);
    
    // Custom dropdown events
    setupCustomDropdowns();
    
    // Copy event
    document.getElementById('copy-btn').addEventListener('click', copyFinalCode);
    
    // Form submission event
    document.getElementById('document-form').addEventListener('submit', saveFile);
    
    // Calendar events
    document.getElementById('date').addEventListener('click', openCalendar);
    document.getElementById('prev-month').addEventListener('click', () => navigateCalendar('prev-month'));
    document.getElementById('next-month').addEventListener('click', () => navigateCalendar('next-month'));
    document.getElementById('prev-year').addEventListener('click', () => navigateCalendar('prev-year'));
    document.getElementById('next-year').addEventListener('click', () => navigateCalendar('next-year'));
    
    // Close dropdowns by clicking outside of them
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.select-items');
        dropdowns.forEach(dropdown => {
            if (!dropdown.parentElement.contains(e.target) && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                dropdown.previousElementSibling.classList.remove('select-arrow-active');
            }
        });
    });
}

function setupCustomDropdowns() {
    // Company
    const companySelect = document.getElementById('company-select');
    const companySelected = document.getElementById('company-selected');
    const companyItems = document.getElementById('company-items');
    
    companySelect.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(companyItems, companySelected);
    });
    
    companyItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-item')) {
            selectDropdownItem(e.target, companySelected, 'company');
            companyItems.classList.remove('active');
            companySelected.classList.remove('select-arrow-active');
            toggleDropdown(companyItems, companySelected);
        }
    });
    
    // Department
    const departmentSelect = document.getElementById('department-select');
    const departmentSelected = document.getElementById('department-selected');
    const departmentItems = document.getElementById('department-items');
    
    departmentSelect.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(departmentItems, departmentSelected);
    });
    
    departmentItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-item')) {
            selectDropdownItem(e.target, departmentSelected, 'department');
            departmentItems.classList.remove('active');
            departmentSelected.classList.remove('select-arrow-active');
            toggleDropdown(departmentItems, departmentSelected);
        }
    });
    
    // Content type
    const contentTypeSelect = document.getElementById('content-type-select');
    const contentTypeSelected = document.getElementById('content-type-selected');
    const contentTypeItems = document.getElementById('content-type-items');
    
    contentTypeSelect.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(contentTypeItems, contentTypeSelected);
    });
    
    contentTypeItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-item')) {
            selectDropdownItem(e.target, contentTypeSelected, 'content-type');
            contentTypeItems.classList.remove('active');
            contentTypeSelected.classList.remove('select-arrow-active');
            toggleDropdown(contentTypeItems, contentTypeSelected);
        }
    });
    
    // Status
    const statusSelect = document.getElementById('status-select');
    const statusSelected = document.getElementById('status-selected');
    const statusItems = document.getElementById('status-items');
    
    statusSelect.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(statusItems, statusSelected);
    });
    
    statusItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-item')) {
            selectDropdownItem(e.target, statusSelected, 'status');
            statusItems.classList.remove('active');
            statusSelected.classList.remove('select-arrow-active');
            toggleDropdown(statusItems, statusSelected);
        }
    });
}

function toggleDropdown(items, selected) {
    // Close all other dropdowns
    const allDropdowns = document.querySelectorAll('.select-items');
    const allSelected = document.querySelectorAll('.select-selected');
    
    allDropdowns.forEach(dropdown => {
        if (dropdown !== items && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    });
    
    allSelected.forEach(sel => {
        if (sel !== selected && sel.classList.contains('select-arrow-active')) {
            sel.classList.remove('select-arrow-active');
        }
    });
    
    // Open/close current dropdown
    items.classList.toggle('active');
    selected.classList.toggle('select-arrow-active');
}

function selectDropdownItem(item, selectedElement, field) {
    // Remove previous selection
    const previouslySelected = selectedElement.parentElement.querySelector('.select-item.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }
    
    // Select new option
    item.classList.add('selected');
    selectedElement.textContent = item.textContent;
    
    // Update state and hidden field
    state[field] = item.getAttribute('data-value');
    document.getElementById(field).value = state[field];

    const companySelected = document.getElementById('company-selected');
    const companyItems = document.getElementById('company-items');
    toggleDropdown(companyItems, companySelected);

    const allDropdowns = document.querySelectorAll('.select-items');
    const allSelected = document.querySelectorAll('.select-selected');
    
    allDropdowns.forEach(dropdown => {
        if (dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    });
    
    allSelected.forEach(sel => {
        if (sel.classList.contains('select-arrow-active')) {
            sel.classList.remove('select-arrow-active');
        }
    });
    item.parentElement.classList.remove('active');
    item.parentElement.classList.add('notactive');
    item.parentElement.parentElement.classList.remove('active');
    item.classList.remove('select-arrow-active');

    // Update final code
    updateFinalCode();
    updateSaveButton();
}

function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-toggle-checkbox').checked = savedTheme === 'dark';
}

function toggleTheme() {
    const isDarkMode = document.getElementById('theme-toggle-checkbox').checked;
    const newTheme = isDarkMode ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function validateDate() {
    const dateInput = document.getElementById('date');
    const errorElement = document.getElementById('date-error');
    const englishDate = toEnglishNumbers(dateInput.value);
    const pattern = /^\d{4}\/\d{2}\/\d{2}$/;
    
    if (!pattern.test(englishDate)) {
        errorElement.style.display = 'block';
        state.date = null;
    } else {
        errorElement.style.display = 'none';
        state.date = englishDate.replace(/\//g, '');
    }
    
    updateFinalCode();
    updateSaveButton();
}

function validateProjectName() {
    const projectNameInput = document.getElementById('project-name');
    const errorElement = document.getElementById('project-name-error');
    const pattern = /^[A-Za-z0-9_\s-]+$/;
    
    // Only show error if value is entered
    if (projectNameInput.value && !pattern.test(projectNameInput.value)) {
        errorElement.style.display = 'block';
        state.projectName = "";
    } else {
        errorElement.style.display = 'none';
        // Trim spaces and replace spaces with _
        const trimmedValue = projectNameInput.value.trim();
        state.projectName = trimmedValue.toUpperCase().replace(/\s+/g, '_');
    }
    
    updateFinalCode();
    updateSaveButton();
}

function validateDescription() {
    const descriptionInput = document.getElementById('description');
    const errorElement = document.getElementById('description-error');
    const pattern = /^[A-Za-z0-9_\s-]+$/;
    
    // Only show error if value is entered
    if (descriptionInput.value && !pattern.test(descriptionInput.value)) {
        errorElement.style.display = 'block';
        state.description = "";
    } else {
        errorElement.style.display = 'none';
        // Trim spaces and replace spaces with _
        const trimmedValue = descriptionInput.value.trim();
        state.description = trimmedValue.toUpperCase().replace(/\s+/g, '_');
    }
    
    updateFinalCode();
    updateSaveButton();
}

function updateFinalCode() {
    const finalCodeInput = document.getElementById('final-code');
    const copyButton = document.getElementById('copy-btn');
    const saveButton = document.getElementById('save-btn');
    
    if (isFormValid()) {
        const companyCode = document.getElementById('company').value;
        const departmentCode = document.getElementById('department').value;
        const contentTypeCode = document.getElementById('content-type').value;
        const statusCode = document.getElementById('status').value;
        
        const finalCode = `${state.date}-${companyCode}-${departmentCode}-${state.projectName}-${state.description}-${contentTypeCode}-${statusCode}`;
        finalCodeInput.value = finalCode;
        copyButton.disabled = false;
        saveButton.disabled = false;
    } else {
        finalCodeInput.value = "";
        copyButton.disabled = true;
    }
}

function isFormValid() {
    return state.date &&
           state.projectName && 
           state.description && 
           document.getElementById('company').value && 
           document.getElementById('department').value && 
           document.getElementById('content-type').value && 
           document.getElementById('status').value;
}

function updateSaveButton() {
    document.getElementById('save-btn').disabled = !isFormValid();
}

function copyFinalCode() {
    const finalCodeInput = document.getElementById('final-code');
    
    if (finalCodeInput.value) {
        finalCodeInput.select();
        document.execCommand('copy');
        
        // Show notification in center of page
        const notification = document.getElementById('copy-notification');
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

function saveFile(e) {
    e.preventDefault();
    
    if (isFormValid()) {
        const finalCode = document.getElementById('final-code').value;
        
        // Add to list
        state.savedFiles.push(finalCode);
        
        // Save to localStorage
        localStorage.setItem('savedFiles', JSON.stringify(state.savedFiles));
        
        // Update display
        displaySavedFiles();
        
        // Show notification in center of page
        const notification = document.getElementById('save-notification');
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
        
    } else {
        // Revalidate date in case of error
        validateDate();
    }
}

function loadSavedFiles() {
    const savedFiles = localStorage.getItem('savedFiles');
    if (savedFiles) {
        state.savedFiles = JSON.parse(savedFiles);
        displaySavedFiles();
    }
}

function displaySavedFiles() {
    const filesList = document.getElementById('files-list');
    
    if (state.savedFiles.length === 0) {
        filesList.innerHTML = '<p class="no-files">No files saved</p>';
        return;
    }
    
    filesList.innerHTML = '';
    state.savedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-name">${file}</span>
            <button class="delete-btn" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        filesList.appendChild(fileItem);
    });
    
    // Add delete event
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteFile(index);
        });
    });
}

function deleteFile(index) {
    state.savedFiles.splice(index, 1);
    localStorage.setItem('savedFiles', JSON.stringify(state.savedFiles));
    displaySavedFiles();
}

// Functions related to Jalali calendar
function initCalendar() {
    const today = new Date();
    const jalaliToday = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    state.calendar.currentYear = jalaliToday[0];
    state.calendar.currentMonth = jalaliToday[1];
    state.calendar.selectedDate = jalaliToday;
}

function openCalendar() {
    const modal = document.getElementById('calendar-modal');
    modal.style.display = 'block';
    renderCalendar();
}

function closeCalendar() {
    const modal = document.getElementById('calendar-modal');
    modal.style.display = 'none';
}

function renderCalendar() {
    const yearElement = document.getElementById('calendar-year');
    const monthElement = document.getElementById('calendar-month');
    const daysContainer = document.getElementById('calendar-days');
    
    yearElement.textContent = toPersianNumbers(state.calendar.currentYear.toString());
    monthElement.textContent = getMonthName(state.calendar.currentMonth);
    
    // Calculate first day of month and number of days in month
    const firstDay = getFirstDayOfMonth(state.calendar.currentYear, state.calendar.currentMonth);
    const daysInMonth = getDaysInMonth(state.calendar.currentYear, state.calendar.currentMonth);
    
    // Calculate days of previous month
    let prevMonthDays = [];
    if (firstDay > 0) {
        const prevMonth = state.calendar.currentMonth === 1 ? 12 : state.calendar.currentMonth - 1;
        const prevYear = state.calendar.currentMonth === 1 ? state.calendar.currentYear - 1 : state.calendar.currentYear;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
        
        for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
            prevMonthDays.push(i);
        }
    }
    
    // Calculate days of next month
    const totalCells = 42; // 6 rows * 7 columns
    const nextMonthDaysCount = totalCells - (prevMonthDays.length + daysInMonth);
    let nextMonthDays = [];
    for (let i = 1; i <= nextMonthDaysCount; i++) {
        nextMonthDays.push(i);
    }
    
    daysContainer.innerHTML = '';
    
    // Add days of previous month
    prevMonthDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = toPersianNumbers(day.toString());
        daysContainer.appendChild(dayElement);
    });
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = toPersianNumbers(day.toString());
        
        // Check if this day is selected
        if (state.calendar.selectedDate && 
            state.calendar.selectedDate[0] === state.calendar.currentYear &&
            state.calendar.selectedDate[1] === state.calendar.currentMonth &&
            state.calendar.selectedDate[2] === day) {
            dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', () => {
            selectDate(day);
        });
        
        daysContainer.appendChild(dayElement);
    };
    
    // Add days of next month
    nextMonthDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = toPersianNumbers(day.toString());
        daysContainer.appendChild(dayElement);
    });
}

function navigateCalendar(direction) {
    switch (direction) {
        case 'prev-year':
            state.calendar.currentYear--;
            break;
        case 'next-year':
            state.calendar.currentYear++;
            break;
        case 'prev-month':
            state.calendar.currentMonth--;
            if (state.calendar.currentMonth < 1) {
                state.calendar.currentMonth = 12;
                state.calendar.currentYear--;
            }
            break;
        case 'next-month':
            state.calendar.currentMonth++;
            if (state.calendar.currentMonth > 12) {
                state.calendar.currentMonth = 1;
                state.calendar.currentYear++;
            }
            break;
    }
    renderCalendar();
}

function selectDate(day) {
    state.calendar.selectedDate = [state.calendar.currentYear, state.calendar.currentMonth, day];
    const formattedDate = `${state.calendar.selectedDate[0]}/${String(state.calendar.selectedDate[1]).padStart(2, '0')}/${String(state.calendar.selectedDate[2]).padStart(2, '0')}`;
    document.getElementById('date').value = toPersianNumbers(formattedDate);
    state.date = formattedDate.replace(/\//g, '');
    updateFinalCode();
    updateSaveButton();
    closeCalendar();
}

function getMonthName(month) {
    const months = [
        'فروردین', 'اردیبهشت', 'خرداد', 
        'تیر', 'مرداد', 'شهریور', 
        'مهر', 'آبان', 'آذر', 
        'دی', 'بهمن', 'اسفند'
    ];
    return months[month - 1];
}

function getFirstDayOfMonth(year, month) {
    // Calculate first day of Jalali month (simplified algorithm)
    // In reality, this calculation is more complex and requires a more precise algorithm
    const firstDay = (year * 12 + month) % 7;
    return (firstDay + 2) % 7; // Adjust for week starting from Saturday
}

function getDaysInMonth(year, month) {
    // Determine number of days in Jalali month (simplified algorithm)
    // In reality, this calculation is more complex and requires a more precise algorithm
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // Esfand: 29 days in normal year, 30 days in leap year
    return isLeapYear(year) ? 30 : 29;
}

function isLeapYear(year) {
    // Calculate Jalali leap year (simplified algorithm)
    const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
    return leapYears.includes(year % 33);
}

// Close calendar by clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('calendar-modal');
    if (event.target === modal) {
        closeCalendar();
    }
});