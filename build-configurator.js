class ProductConfigurator {
  constructor(container) {
    this.container = container;
    this.currentStep = 1;
    this.steps = CONFIGURATOR_DATA.steps;
    this.totalSteps = this.steps.length;
    this.totalPrice = 0;
    this.totalWeight = 0;
    this.configuration = {
      vehicle: null,
      buildType: null,
      awnings: null,
      serviceBody: null,
      workBodyInternalFitOuts: null,
      tray: null,
      trayBonus: [],
      canopy: null,
      traySides: null,
      passengerFitout: null,
      passengerInternalAccessories: [],
      driverFitout: null,
      driverInternalAccessories: [],
      dogBoxConversion: null,
      voltAndOven: null,
      fridges: null,
      lightingSound: [],
      centralLocking: null,
      colourCoding: null,
      accessories: [],
      roofRackPlatforms: null,
      brackets: [],
      rooftopTentAwnings: null,
      freight: [],
      currentSelect: null,
      roofRackType: null
    };

    this.init();
  }

  init() {
    this.generateStepHTML();
    this.setupEventListeners();
    this.renderCurrentStep();
    this.updateProgress();
    this.updateTotalPrice();
    this.updateTotalWeight();
  }

  async handleQuoteSubmit(event) {
    event.preventDefault();
    document.getElementById('loader-wrapper').classList.add('active');
    const formData = {
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById('lastName').value,
      email: document.getElementById("email").value,
      phone: document.getElementById('phone').value,
      state: document.getElementById('state').value,
      message: document.getElementById("vehicleDetails").value,
      vehicle_information: document.getElementById('vehicleDetailsHidden').value,
      car_year: document.getElementById('vehicleYear').value,
      date: new Date()
    };



    console.log('form data!s:', formData);


    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxoJa6DTdTwbLAhiGGd0BcBDX4OsE_FBGpb8kSz1wWwbliFV_F9Wux8OuQCZN1o6LPuWg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      // Check the response

      document.getElementById('thankyou').classList.add('active');
      document.getElementById('loader').classList.add('hide');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error("Error sending data:", error);
      document.getElementById('thankyou').classList.add('active');
      document.getElementById('loader').classList.add('hide');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }







  generateStepHTML() {
    const container = this.container.querySelector('.configurator-container');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    this.steps.forEach(step => {
      const stepElement = document.createElement('div');
      stepElement.className = 'configurator-step';
      stepElement.setAttribute('data-step', step.id);

      stepElement.innerHTML = `
        <div class="step-header">
          <h5>${step.name}</h5>
          ${step.name === "Installation & Freight" ? `<span class="display-freight-cost"></span><span class="display-installation-cost"></span>` : ''}
          ${step.description ? `<p class="step-description">${step.description}</p>` : ''}
        </div>
        ${this.getStepContent(step)}
        <div class="step-navigation">
          ${step.id > 1 ? '<button class="button button--secondary" data-prev-step>Previous</button>' : ''}
          ${step.id < this.totalSteps ? '<button class="button" data-next-step>Next</button>' : ''}
          ${step.id === this.totalSteps ? '<button class="button" data-get-quote>Get Quote</button>' : ''}
        </div>
      `;

      container.appendChild(stepElement);
    });
  }




  getStepContent(step) {
    switch (step.template) {
      case 'vehicle-select':
        return `
         <div class="vehicle-selection">
          <svg class="carrot" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F"></path>
          </svg>
          <select class="vehicle-select" data-vehicle-select>
            <option value="">Select a vehicle</option>
          </select>
          <div data-vehicle-details></div>
          </div>
        `;
      case 'build-type':
        return '<div class="build-type-options" data-build-type-options></div>';
      case 'service-body':
        return '<div class="option-grid option-grid-2" data-service-body-options></div>';
      case 'tray':
        return `
        <div class="tray-selection tray-selection-wrapper">
          <div class="option-grid tray-selection" data-tray-options></div>
          <div class="tray-bonus-section">
            <h5 style="color: #fff;width: 100%;text-align: right;text-transform: uppercase;font-size: 14px;">Tray Options</h5>
            <div class="option-grid" data-tray-bonus-options></div>
          </div>
        </div>`;
      case 'canopy':
        return '<div class="option-grid" data-canopy-options></div>';
      case 'tray-sides':
        return '<div class="option-grid" data-tray-sides-options></div>';
      case 'freight':
        return '<div class="option-grid-flex" data-freight-options></div>';
      case 'work-body-internal-fit-outs':
        return '<div class="option-grid" data-work-body-internal-fit-outs-options></div>';
      case 'passenger-fitout':
        return '<div class="option-grid" data-passenger-fitout-options></div>';
      case 'passenger-internal-accessories':
        return '<div class="option-grid" data-passenger-internal-accessories-options></div>';
      case 'driver-fitout':
        return '<div class="option-grid" data-driver-fitout-options></div>';
      case 'driver-internal-accessories':
        return '<div class="option-grid" data-driver-internal-accessories-options></div>';
      case 'dog-box':
        return '<div class="option-grid" data-dog-box-options></div>';
      case 'volt-oven':
        return '<div class="option-grid" data-volt-oven-options></div>';
      case 'fridges':
        return '<div class="option-grid" data-fridges-options></div>';
      case 'lighting-sound':
        return '<div class="option-grid" data-lighting-sound-options></div>';
      case 'central-locking':
        return '<div class="option-grid option-grid-1" data-central-locking-options></div>';
      case 'colour-coding':
        return '<div class="option-grid" data-colour-coding-options></div>';
      case 'external-accessories':
        return '<div class="accessories-grid" data-external-accessories-options></div>';
      case 'roof-rack':
        return `
        <div class="select-type">
          <label for="roof-rack-type">Is this for a Vehicle or Canopy?</label>
          <select id="roof-rack-type" name="roof-rack-type">
            <option value="vehicle" ${this.configuration.roofRackType === 'vehicle' ? 'selected' : ''}>Vehicle</option>
            <option value="canopy" ${this.configuration.roofRackType === 'canopy' ? 'selected' : ''}>Canopy</option>
          </select>
        </div>
        <div class="option-grid" data-roof-rack-options></div> `;
      case 'brackets':
        return '<div class="option-grid" data-brackets-options></div>';
      case 'awnings':
        return '<div class="option-grid" data-awnings-options></div>';
      case 'rooftop-tent':
        return '<div class="option-grid" data-rooftop-tent-options></div>';
      case 'accessories':
        return '<div class="accessories-grid" data-accessories-options></div>';
      case 'summary':
        return '<div class="summary-container" data-summary></div>';
      default:
        return '';
    }
  }

  setupEventListeners() {
    // Generic event delegation for all option selections
    this.container.addEventListener('click', (e) => {
      console.log('clicked!');
      const optionCard = e.target.closest('.option-card');
      if (optionCard) {
        const currentStep = this.steps.find(s => s.id === this.currentStep);
        if (currentStep) {
          this.updateConfiguration(currentStep.id, optionCard.dataset.optionId, optionCard);
        }
      }
    });

    // Vehicle selection
    const vehicleSelect = this.container.querySelector('[data-vehicle-select]');
    if (vehicleSelect) {
      vehicleSelect.addEventListener('change', (e) => {
        const selectedVehicle = CONFIGURATOR_DATA.vehicles.find(v => v.id === Number(e.target.value));
        if (selectedVehicle) {
          // Clear tray selection if it doesn't match the new vehicle's tray size
          if (this.configuration.tray && this.configuration.tray.traySize !== selectedVehicle.traySize) {
            this.configuration.tray = null;
          }
          this.configuration.vehicle = selectedVehicle;
          this.renderVehicleDetails(selectedVehicle);
          this.updateStepTitles();
          this.updateTotalPrice();
          this.updateTotalWeight();
          this.nextStep();
        }
      });
    }

    // Capture roof-rack-type selection
    const roofRackTypeSelect = this.container.querySelector('select[name="roof-rack-type"]');
    if (roofRackTypeSelect) {
      roofRackTypeSelect.addEventListener('change', (e) => {
        this.configuration.roofRackType = e.target.value;
        console.log(this.configuration.roofRackType);
        this.updateSummary();
      });
    }


    // Navigation buttons
    this.container.addEventListener('click', (e) => {
      if (e.target.matches('[data-prev-step]')) {
        this.scrollTop();
        this.prevStep();
      } else if (e.target.matches('[data-next-step]')) {
        this.scrollTop();
        this.nextStep();
      } else if (e.target.matches('[data-get-quote]')) {
        this.scrollTop();
        this.handleGetQuote();
      }
    });

    // Restart button
    const restartButton = this.container.querySelector('[data-restart]');
    if (restartButton) {
      restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.restart();
      });
    }

    // Add event listener for form submission
    const form = document.getElementById("quoteForm");
    if (form) {
      form.addEventListener("submit", this.handleQuoteSubmit.bind(this));
    }
  }


  scrollTop() {
    document.querySelector('.product-configurator').scrollTo({ top: 75, behavior: 'smooth' });
  }

  updateStepTitles() {
    if (this.configuration.vehicle) {
      const buildTypeStep = this.container.querySelector('[data-step="2"] h5');
      if (buildTypeStep) {
        // Split the vehicle name and take first two words
        const vehicleName = this.configuration.vehicle.name.split(' ').slice(0, 4).join(' ');
        buildTypeStep.textContent = `Let's Select the Build Type for your ${vehicleName}`;
      }
    }
  }

  getVisibleSteps() {
    return this.steps.filter(step => {
      if (!step.showIf) return true;
      return step.showIf(this.configuration);
    });
  }

  getNextVisibleStep(currentStep) {
    const visibleSteps = this.getVisibleSteps();
    const currentIndex = visibleSteps.findIndex(step => step.id === currentStep);
    return visibleSteps[currentIndex + 1]?.id;
  }

  getPrevVisibleStep(currentStep) {
    const visibleSteps = this.getVisibleSteps();
    const currentIndex = visibleSteps.findIndex(step => step.id === currentStep);
    return visibleSteps[currentIndex - 1]?.id;
  }

  nextStep() {
    const nextStep = this.getNextVisibleStep(this.currentStep);
    if (nextStep) {
      this.currentStep = nextStep;
      this.renderCurrentStep();
      this.updateProgress();
    }
  }

  prevStep() {
    const prevStep = this.getPrevVisibleStep(this.currentStep);
    if (prevStep) {
      this.currentStep = prevStep;
      this.renderCurrentStep();
      this.updateProgress();
    }
  }

  updateProgress() {
    const progress = (this.currentStep - 1) / (this.totalSteps - 1) * 100;
    const progressBar = this.container.querySelector('[data-progress]');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Update step counter position and text
    const stepCounter = this.container.querySelector('[data-step-counter]');
    if (stepCounter) {
      stepCounter.textContent = `${this.currentStep}/${this.totalSteps}`;
      stepCounter.style.left = `${progress}%`;
    }

    this.updateNavigationButtons();
  }

  updateStepIndicators() {
    const indicators = this.container.querySelector('[data-step-indicators]');
    if (!indicators) return;

    // Clear existing indicators
    indicators.innerHTML = '';

    // Create new indicators
    for (let i = 1; i <= this.totalSteps; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('step-indicator');
      if (i < this.currentStep) {
        indicator.classList.add('completed');
      } else if (i === this.currentStep) {
        indicator.classList.add('active');
      }
      indicator.textContent = i;
      indicators.appendChild(indicator);
    }
  }

  updateNavigationButtons() {
    const prevBtn = this.container.querySelector('[data-prev-step]');
    const nextBtn = this.container.querySelector('[data-next-step]');
    const getQuoteBtn = this.container.querySelector('[data-get-quote]');

    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
    }

    if (getQuoteBtn) {
      getQuoteBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
    }
  }
  disableEnableNextButton(template) {
    const nextButtons = this.container.querySelectorAll('[data-next-step]');
    console.log('next buttons:', nextButtons);
    console.log('steps', this.steps);
    // Find the current step object
    const currentStep = this.steps.find(s => s.template === template);
    if (!currentStep) {
      console.warn("Current step not found for template:", template);
      return;
    }

    nextButtons.forEach(button => {
      if (currentStep.template === template) {
        button.classList.add('active');
        if (currentStep.required === true) {
          button.setAttribute('disabled', 'true');
        } else {
          button.removeAttribute('disabled');
        }
      }
    });
  }



  renderCurrentStep() {
    const steps = this.container.querySelectorAll('.configurator-step');
    steps.forEach(step => step.style.display = 'none');

    const currentStep = this.steps.find(s => s.id === this.currentStep);
    if (!currentStep) return;

    const stepElement = this.container.querySelector(`[data-step="${this.currentStep}"]`);
    if (!stepElement) return;

    stepElement.style.display = 'block';


    // Render step-specific content
    switch (currentStep.template) {
      case 'vehicle-select':
        this.renderVehicles();
        break;
      case 'build-type':
        this.renderBuildTypes();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'service-body':
        this.renderServiceBody();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'tray':
        this.renderTrays();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'canopy':
        this.renderCanopies();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'tray-sides':
        this.renderTraySideOptions();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'freight':
        this.renderFreight();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'passenger-fitout':
        this.renderPassengerFitout();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'work-body-internal-fit-outs':
        this.renderWorkBodyInternalFitOuts();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'passenger-internal-accessories':
        this.renderPassengerInternalAccessories();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'driver-fitout':
        this.renderDriverFitout();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'driver-internal-accessories':
        this.renderDriverInternalAccessories();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'dog-box':
        this.renderDogBox();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'volt-oven':
        this.renderVoltAndOven();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'fridges':
        this.renderFridges();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'lighting-sound':
        this.renderLightingSound();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'central-locking':
        this.renderCentralLocking();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'colour-coding':
        this.renderColourCoding();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'external-accessories':
        this.renderExternalAccessories();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'roof-rack':
        this.renderRoofRack();
        this.disableEnableNextButton(currentStep.template);
      case 'brackets':
        this.renderBrackets();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'awnings':
        this.renderAwnings();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'rooftop-tent':
        this.renderRoofTopTent();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'accessories':
        this.renderAccessories();
        this.disableEnableNextButton(currentStep.template);
        break;
      case 'summary':
        this.renderSummary();
        break;
    }
  }

  renderVehicles() {
    const select = this.container.querySelector('[data-vehicle-select]');
    const detailsContainer = this.container.querySelector('[data-vehicle-details]');

    if (!select) return;

    // Populate select options
    const options = CONFIGURATOR_DATA.vehicles.map(vehicle =>
      `<option value="${vehicle.id}">${vehicle.name}</option>`
    ).join('');

    select.innerHTML = '<option value="">Choose a vehicle...</option>' + options;

    // Set selected value if there's a selected vehicle
    if (this.configuration.vehicle) {
      select.value = this.configuration.vehicle.id;
      this.renderVehicleDetails(this.configuration.vehicle);
    } else {
      detailsContainer.innerHTML = '';
    }
  }

  renderBuildTypes() {
    const container = this.container.querySelector('[data-build-type-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.buildTypes
      .map(buildType => `
        <div class="option-card ${this.configuration.buildType?.id === buildType.id ? 'selected' : ''}" 
             data-option-id="${buildType.id}">
          <div class="option-image">
            <img src="${buildType.image}" alt="${buildType.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${buildType.name}</h3>
            ${buildType.description ? `<p>${buildType.description}</p>` : ''}
            ${buildType.price > 0 ? `<div class="option-price">$${buildType.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderServiceBody() {
    const container = this.container.querySelector('[data-service-body-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.serviceBody.map(option => this.createOptionCard(option)).join('');
  }

  renderAwnings() {
    const container = this.container.querySelector('[data-awnings-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.awnings.map(option => this.createOptionCard(option)).join('');
  }

  renderTrays() {
    const container = this.container.querySelector('[data-tray-options]');
    const bonusContainer = this.container.querySelector('[data-tray-bonus-options]');

    if (!container || !bonusContainer) return;

    if (!this.configuration.vehicle) {
      container.innerHTML = '<div class="no-options-message">Please select a vehicle first.</div>';
      bonusContainer.innerHTML = '';
      return;
    }

    const compatibleTrays = CONFIGURATOR_DATA.trays.filter(
      tray => tray.traySize === this.configuration.vehicle.traySize || tray.selected
    );

    if (compatibleTrays.length === 0) {
      container.innerHTML = '<div class="no-options-message">No compatible trays available for this vehicle.</div>';
      bonusContainer.innerHTML = '';
      return;
    }

    container.innerHTML = compatibleTrays
      .map(tray => `
            <div class="option-card ${this.configuration.tray?.id === tray.id ? 'selected' : ''}" 
                 data-option-id="${tray.id}">
              <div class="option-image">
                <img src="${tray.image}" alt="${tray.name}" loading="lazy">
              </div>
              <div class="option-details">
                <h3>${tray.name}</h3>
                ${tray.description ? `<p>${tray.description}</p>` : ''}
                ${tray.price > 0 ? `<div class="option-price">$${tray.price.toLocaleString()}</div>` : ''}
              </div>
            </div>
        `)
      .join('');

    // Set default selected tray bonuses if not already set
    if (!this.configuration.trayBonus) {
      this.configuration.trayBonus = CONFIGURATOR_DATA.traysBonus.filter(bonus => bonus.selected);
    }

    // Update total price based on default selected tray bonuses
    this.updateTotalPrice();

    // Render tray bonuses
    const trayBonuses = CONFIGURATOR_DATA.traysBonus;
    bonusContainer.innerHTML = trayBonuses
      .map(bonus => `
            <div class="option-card ${bonus.placeholder ? "placeholder" : ""} ${this.configuration.trayBonus.some(b => b.id === bonus.id) ? 'selected' : ''}" 
                 data-option-id="${bonus.id}">
              <div class="option-image ">
                <img src="${bonus.image}" alt="${bonus.name}" loading="lazy">
              </div>
              <div class="option-details">
                <h3>${bonus.name}</h3>
                ${bonus.description ? `<p>${bonus.description}</p>` : ''}
                ${bonus.price > 0 ? `<div class="option-price">$${bonus.price.toLocaleString()}</div>` : ''}
              </div>
             
            </div>
        `)
      .join('');
  }






  renderFreight() {
    const container = this.container.querySelector('[data-freight-options]');
    const shopLocations = CONFIGURATOR_DATA.states || [];

    if (!container) return;

    let selected_build = this.configuration.buildType?.id || "";
    let freightData = CONFIGURATOR_DATA?.freight || [];

    function getStateFromTimezone() {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const timezoneToStateMap = {
        "Australia/Sydney": "NSW",
        "Australia/Melbourne": "VIC",
        "Australia/Brisbane": "QLD",
        "Australia/Perth": "WA",
        "Australia/Adelaide": "SA",
        "Australia/Hobart": "TAS",
        "Australia/Darwin": "NT",
        "Australia/Canberra": "ACT"
      };

      const state = timezoneToStateMap[timeZone] || ""; // Default to empty if not found
      return state;
    }

    const state = getStateFromTimezone();
    console.log("Detected state from time zone:", state);

    function renderLocations(selectedState) {
      const filteredLocations = shopLocations.filter(location => location.state === selectedState);
      return filteredLocations.length > 0
        ? filteredLocations.map(location => `
                <div class="available-shops">
                    <div class="company"><span>${location.company}</span></div>
                    <div class="street"><span>${location.street}</span></div>
                    <div class="state"><span>${location.state}</span></div>
                </div>
            `).join('')
        : `<p class="no-locations">No locations found for ${selectedState}</p>`;
    }


    // Create the select box for states of Australia
    const states = [
      { value: "ACT", label: "Australian Capital Territory" },
      { value: "NSW", label: "New South Wales" },
      { value: "NT", label: "Northern Territory" },
      { value: "QLD", label: "Queensland" },
      { value: "SA", label: "South Australia" },
      { value: "TAS", label: "Tasmania" },
      { value: "VIC", label: "Victoria" },
      { value: "WA", label: "Western Australia" }
    ];

    const stateOptions = states
      .map(stateOption => {
        // Set the default state based on the detected state (from time zone)
        const isSelected = (this.configuration.state === stateOption.value) || (stateOption.value === state);
        return `<option value="${stateOption.value}" ${isSelected ? 'selected' : ''}>${stateOption.label}</option>`;
      })
      .join('');

    // Render the select box for states
    container.innerHTML = `
      <div class="state-selection">
        <svg class="carrot" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F"/>
        </svg>
        <label for="state">Where are you located?</label>
        <select id="state" name="state">
          <option value="">Please select your nearest location for installation</option>
          ${stateOptions}
        </select>
        <div class="location-heading">
          <h4>Our Locations</h4>
          <div class="sub-headings">
            <div class="name">Shop Name</div>
            <div class="street">Street Address</div>
            <div class="state">State</div>
          </div>
        </div>
        <div id="shop-locations" class="shop-locations">
        ${renderLocations(state)}
        </div<
      </div>
    `;

    setTimeout(() => {
      const stateSelect = document.getElementById('state');
      if (!stateSelect) return;

      let selectedState = stateSelect.value || "Not selected";
      sessionStorage.setItem("location", state);
      stateSelect.addEventListener('change', (event) => {
        selectedState = event.target.value;
        document.getElementById('shop-locations').innerHTML = renderLocations(selectedState);

        sessionStorage.setItem("location", selectedState);
        if (selectedState === "WA" || selectedState === "NSW") {
          document.querySelector('.pickup').classList.remove('hide');
        } else {
          document.querySelector('.pickup').classList.add('hide');
        }
        console.log("Saved to sessionStorage:", sessionStorage.getItem("location"));
      });

    }, 0);

    setTimeout(() => {
      const shopLocationsContainer = document.getElementById('shop-locations');
      if (shopLocationsContainer) {
        shopLocationsContainer.addEventListener('click', (e) => {
          if (e.target.closest('.available-shops')) {
            const chosenAddress = e.target.closest('.available-shops').textContent.trim();

            // Remove 'active' class from all .available-shops elements
            document.querySelectorAll('.available-shops').forEach(shop => {
              shop.classList.remove('active');
            });

            // Add 'active' class to the clicked .available-shops element
            e.target.closest('.available-shops').classList.add('active');

            console.log('Chosen Address:', chosenAddress);

            // Save to sessionStorage to include in message submission
            sessionStorage.setItem('address', chosenAddress);
          }
        });
      }
    }, 0);
    setTimeout(() => {
      // Get labour cost from sessionStorage and ensure it's a valid number
      const labourCost = parseFloat(sessionStorage.getItem('labourCost')) || 0;

      // Find all elements with class "installation-price" and update them
      document.querySelectorAll('.installation-price').forEach(installationPriceEl => {
        installationPriceEl.textContent = `$${labourCost.toFixed(2)}`;
      });
    }, 0);

    setTimeout(() => {
      // Get freight cost from sessionStorage and ensure it's a valid number
      const freightCost = parseFloat(sessionStorage.getItem('freightCost')) || 0;

      // Find all elements with class "installation-price" and update them
      document.querySelectorAll('.freight-price').forEach(freightPriceEl => {
        freightPriceEl.textContent = `$${freightCost.toFixed(2)}`;
      });
    }, 0);






    // List of freight IDs that should always be visible
    const alwaysVisibleFreightIds = [
      'eligible-for-pickup',
      'tub-tray-removed',
      'also-need-tub-disposal',
      'adblue-relocation',
      'reverse-camera-relocation',
      'reverse-sensor-relocation',
      'blind-spot-sensor-relocation',
      'quote-is-estimate'
    ];

    // Render freight options including custom checkbox for specific items
    const freightOptionsHTML = freightData
      .map(freight => {
        const isSelected = Array.isArray(this.configuration.freight) &&
          this.configuration.freight.some(a => a.id === freight.id);

        const isActive =
          (selected_build === 'tray-only' && ['tray-only-cost-freight', 'tray-only-cost-installation'].includes(freight.id)) ||
            (selected_build === 'tray-canopy' && ['tray-canopy-cost-freight', 'tray-canopy-cost-installation'].includes(freight.id))
            ? 'active disabled'
            : 'hide';

        // Always show specific freight options (based on their ID)
        const isVisible = alwaysVisibleFreightIds.includes(freight.id) ? '' : isActive;

        // Check if this freight option has a checkbox
        const isCheckbox = freight.checkbox ?
          `<div class="toggle">
             <input type="checkbox" id="${freight.id}" name="${freight.id}" ${isSelected ? 'checked' : ''} />
             <label for="${freight.id}">
               <span class="thumb"></span>
             </label>
             <div class="light"></div>
           </div>`
          : '';

        // List of freight IDs that should have active disabled classes
        const disabledFreightIds = ['tray-only-cost-freight', 'tray-only-cost-installation', 'tray-canopy-cost-freight', 'tray-canopy-cost-installation', 'quote-is-estimate'];

        // Only render the image if the option is not always visible and not in the disabled list
        const optionImage = (alwaysVisibleFreightIds.includes(freight.id) || disabledFreightIds.includes(freight.id)) ? '' : `
          <div class="option-image">
            <img src="${freight.image}" alt="${freight.name}" loading="lazy">
          </div>
        `;
        console.log('freight id:', freight.id)
        // Add the "special" class if the option has a toggle (checkbox)
        const specialClass = freight.checkbox ? 'special' : '';
        const freePickup = freight.pickup ? 'pickup hide' : '';
        const isQuoteEstimateMessage = freight.id === 'quote-is-estimate' ? 'estimate-message' : '';

        // Add the "message" class if the checkbox is false (not selected)
        const messageClass = freight.checkbox === false ? 'message' : '';

        return `
          <div class="option-card ${isQuoteEstimateMessage} ${isSelected ? 'selected' : ''} ${freePickup} ${isVisible} ${specialClass} ${messageClass}" data-option-id="${freight.id}">
            ${optionImage}
            <div class="option-details">
              <h3>${freight.name}</h3>
              ${freight.description ? `<p>${freight.description}</p>` : ''}
               ${freight.price && freight.price > 0 ? `<div class="option-price ${freight.id === "tray-only-cost-installation" || freight.id === "tray-canopy-cost-installation" ? "installation-price" : ""} ${freight.id === "tray-canopy-cost-freight" || freight.id === "tray-only-cost-freight" ? "freight-price" : ""}">$${freight.price.toLocaleString()}</div>` : ''}


              ${isCheckbox} <!-- Custom checkbox instead of regular label -->
            </div>
          </div>
        `;
      })
      .join(''); // Fix missing join

    container.innerHTML += freightOptionsHTML; // Append correctly formatted options
    // if state is wa or nsw then local pickup is available
    if (state === "WA" || state === "NSW") {
      document.querySelector('.pickup').classList.remove('hide');
    } else {
      document.querySelector('.pickup').classList.add('hide');
    }

    // Setup event listeners after rendering
    this.setupFreightEventListeners();
  }


  renderCanopies() {
    const container = this.container.querySelector('[data-canopy-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.canopies
      .map(canopy => `
        <div class="option-card ${this.configuration.canopy?.id === canopy.id ? 'selected' : ''}" 
             data-option-id="${canopy.id}">
          <div class="option-image">
            <img src="${canopy.image}" alt="${canopy.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${canopy.name}</h3>
            ${canopy.description ? `<p>${canopy.description}</p>` : ''}
            ${canopy.price > 0 ? `<div class="option-price">$${canopy.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderTraySideOptions() {
    const container = this.container.querySelector('[data-tray-sides-options]');
    if (!container) return;

    let traySides = CONFIGURATOR_DATA.traySides;

    if (this.configuration.buildType?.id === "tray-only") {
      // Ensure traySize is a number before filtering
      const traySize = Number(this.configuration.tray.traySize);
      traySides = traySides.filter(side => Number(side.size) === traySize);
    } else if (this.configuration.buildType?.id === "tray-canopy" && this.configuration.canopy) {
      // Ensure traySize and canopy.size are numbers before filtering
      const traySize = Number(this.configuration.tray.traySize);
      const canopySize = Number(this.configuration.canopy.size);
      const remainingSize = traySize - canopySize;

      traySides = traySides.filter(side => Number(side.size) === remainingSize);
    }

    // Check if traySides is empty after filtering
    if (traySides.length === 0) {
      container.innerHTML = '<div class="no-options-message">No compatible tray sides available for this vehicle.</div>';
    } else {
      container.innerHTML = traySides
        .map(side => `
          <div class="option-card ${this.configuration.traySides?.id === side.id ? 'selected' : ''}" 
               data-option-id="${side.id}">
            <div class="option-image">
              <img src="${side.image}" alt="${side.name}" loading="lazy">
            </div>
            <div class="option-details">
              <h3>${side.name}</h3>
              ${side.description ? `<p>${side.description}</p>` : ''}
              ${side.price > 0 ? `<div class="option-price">$${side.price.toLocaleString()}</div>` : ''}
            </div>
          </div>
        `)
        .join('');
    }
  }






  renderPassengerFitout() {
    const container = this.container.querySelector('[data-passenger-fitout-options]');
    if (!container) return;
    console.log(this.configuration)
    // define chosen canopy size to determine which driver fitouts to display
    const compatiblePassengerFitouts = CONFIGURATOR_DATA.passengerFitout.filter(
      fitout => fitout.size === this.configuration.canopy.size || fitout.id === "empty-fitout"
    );

    container.innerHTML = compatiblePassengerFitouts
      .map(fitout => `
        <div class="option-card ${fitout.placeholder ? "placeholder" : ""} ${this.configuration.driverFitout?.id === fitout.id ? 'selected' : ''}" 
             data-option-id="${fitout.id}">
          <div class="option-image">
            <img src="${fitout.image}" alt="${fitout.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${fitout.name}</h3>
            ${fitout.description ? `<p>${fitout.description}</p>` : ''}
            <div class="option-price">$${fitout.price.toLocaleString()}</div>
          </div>
        </div>
      `)
      .join('');
  }

  renderWorkBodyInternalFitOuts() {
    const container = this.container.querySelector('[data-work-body-internal-fit-outs-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.workBodyInternalFitOuts.map(option => this.createOptionCard(option)).join('');
  }

  renderPassengerInternalAccessories() {
    const container = this.container.querySelector('[data-passenger-internal-accessories-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.passengerInternalAccessories.map(option => this.createOptionCard(option)).join('');
  }

  renderDriverFitout() {
    const container = this.container.querySelector('[data-driver-fitout-options]');
    if (!container) return;
    // define chosen canopy size to determine which driver fitouts to display
    const compatibleDriverFitouts = CONFIGURATOR_DATA.driverFitout.filter(
      fitout => fitout.size === this.configuration.canopy.size || fitout.id === "empty-fitout"
    );

    container.innerHTML = compatibleDriverFitouts
      .map(fitout => `
        <div class="option-card ${fitout.placeholder ? "placeholder" : ""} ${this.configuration.driverFitout?.id === fitout.id ? 'selected' : ''}" 
             data-option-id="${fitout.id}">
          <div class="option-image">
            <img src="${fitout.image}" alt="${fitout.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${fitout.name}</h3>
            ${fitout.description ? `<p>${fitout.description}</p>` : ''}
            <div class="option-price">$${fitout.price.toLocaleString()}</div>
          </div>
        </div>
      `)
      .join('');
  }

  renderDriverInternalAccessories() {
    const container = this.container.querySelector('[data-driver-internal-accessories-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.driverInternalAccessories.map(option => this.createOptionCard(option)).join('');
  }

  renderDogBox() {
    const container = this.container.querySelector('[data-dog-box-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.dogBoxConversion.map(option => this.createOptionCard(option)).join('');
  }


  renderVoltAndOven() {
    const container = this.container.querySelector('[data-volt-oven-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.voltAndOven.map(option => this.createOptionCard(option)).join('');
  }

  renderFridges() {
    const container = this.container.querySelector('[data-fridges-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.fridges.map(option => this.createOptionCard(option)).join('');
  }

  renderLightingSound() {
    const container = this.container.querySelector('[data-lighting-sound-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.lightingSound.map(option => this.createOptionCard(option)).join('');
  }

  renderCentralLocking() {
    const container = this.container.querySelector('[data-central-locking-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.centralLocking.map(option => this.createOptionCard(option)).join('');
  }

  renderColourCoding() {
    const container = this.container.querySelector('[data-colour-coding-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.colourCoding.map(option => this.createOptionCard(option)).join('');
  }

  renderExternalAccessories() {
    const container = this.container.querySelector('[data-external-accessories-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.accessories.map(option => this.createOptionCard(option)).join('');
  }

  renderInstallationFreight() {
    const container = this.container.querySelector('[data-installation-freight-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.installationFreight.map(option => this.createOptionCard(option)).join('');
  }

  renderRoofRack() {
    const container = this.container.querySelector('[data-roof-rack-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.roofRackPlatforms.map(option => this.createOptionCard(option)).join('');
  }
renderBrackets() {
    const container = this.container.querySelector('[data-brackets-options]');
    if (!container) return;

    if (!this.configuration.vehicle?.name) {
        container.innerHTML = '<p>Please select a vehicle first.</p>';
        return;
    }

    const selectedVehicleName = this.configuration.vehicle.name.toLowerCase();
    const compatibleBrackets = CONFIGURATOR_DATA.brackets.filter(bracket => 
        bracket.name.toLowerCase().includes(selectedVehicleName)
    );

    container.innerHTML = compatibleBrackets.length > 0
        ? compatibleBrackets.map(bracket => `
            <div class="option-card ${this.configuration.brackets.some(b => b.id === bracket.id) ? 'selected' : ''}" 
                 data-option-id="${bracket.id}">
              <div class="option-image">
                <img src="${bracket.image}" alt="${bracket.name}" loading="lazy">
              </div>
              <div class="option-details">
                <h3>${bracket.name}</h3>
                ${bracket.description ? `<p>${bracket.description}</p>` : ''}
                ${bracket.price > 0 ? `<div class="option-price">$${bracket.price.toLocaleString()}</div>` : ''}
              </div>
            </div>
        `).join('')
        : '<div class="no-options-message">Please select a vehicle first.</div>';
}



  renderRoofTopTent() {
    const container = this.container.querySelector('[data-rooftop-tent-options]');
    if (!container) return;
    container.innerHTML = CONFIGURATOR_DATA.rooftopTentAwnings.map(option => this.createOptionCard(option)).join('');
  }




  renderAccessories() {
    const container = this.container.querySelector('[data-accessories-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.accessories
      .map(accessory => {
        // Create checkbox HTML if accessory.checkbox is true
        const checkboxHTML = accessory.checkbox
          ? `
              <div class="toggle">
                <input type="checkbox" id="${accessory.id}" name="${accessory.id}" ${accessory.isSelected ? 'checked' : ''} />
                <label for="${accessory.id}">
                  <span class="thumb"></span>
                </label>
                <div class="light"></div>
              </div>
            `
          : ''; // If checkbox is not true, don't include the checkbox HTML

        return `
          <div class="option-card ${accessory.placeholder ? "placeholder" : ""} ${this.configuration.accessories.some(a => a.id === accessory.id) ? 'selected' : ''}" 
               data-option-id="${accessory.id}">
            <div class="option-image">
              <img src="${accessory.image}" alt="${accessory.name}" loading="lazy">
            </div>
            <div class="option-details">
              <h3>${accessory.name}</h3>
              ${accessory.description ? `<p>${accessory.description}</p>` : ''}
              ${accessory.price > 0 ? `<div class="option-price">$${accessory.price.toLocaleString()}</div>` : ''}
            </div>
            ${checkboxHTML}
          </div>
        `;
      })
      .join('');

    // Setup event listeners after rendering
    this.setupAccessoryEventListeners();
  }




  renderAc() {
    const container = this.container.querySelector('[data-accessories-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.accessories
      .map(accessory => `
        <div class="option-card ${this.configuration.accessories.some(a => a.id === accessory.id) ? 'selected' : ''}" 
             data-option-id="${accessory.id}">
          <div class="option-image">
            <img src="${accessory.image}" alt="${accessory.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${accessory.name}</h3>
            ${accessory.description ? `<p>${accessory.description}</p>` : ''}
            ${accessory.price > 0 ? `<div class="option-price">$${accessory.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');

    // Setup event listeners after rendering
    this.setupAccessoryEventListeners();
  }

  setupAccessoryEventListeners() {
    const accessoryCards = this.container.querySelectorAll('.option-card[data-option-id]');
    accessoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.optionId);
        const accessory = CONFIGURATOR_DATA.accessories.find(a => a.id === id);

        if (!accessory) return;

        // Toggle accessory selection
        if (this.configuration.accessories.some(a => a.id === id)) {
          this.configuration.accessories = this.configuration.accessories.filter(a => a.id !== id);
          card.classList.remove('selected');
        } else {
          this.configuration.accessories.push(accessory);
          card.classList.add('selected');
        }

        this.updateTotalPrice();
        this.updateCurrentTotal();
        this.updateTotalWeight();
      });
    });
  }

  setupFreightEventListeners() {
    const freightCards = this.container.querySelectorAll('.option-card[data-option-id]');
    freightCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.optionId);
        const freight = CONFIGURATOR_DATA.freight.find(a => a.id === id);

        if (!freight) return;

        // Toggle freight selection
        if (this.configuration.freight.some(a => a.id === id)) {
          this.configuration.freight = this.configuration.freight.filter(a => a.id !== id);
          card.classList.remove('selected');
        } else {
          this.configuration.freight.push(freight);
          card.classList.add('selected');
        }

        this.updateTotalPrice();
        this.updateCurrentTotal();
        this.updateTotalWeight();
      });
    });
  }

  // Ensure handleQuantityChange is a class method
  handleQuantityChange(e) {
    const optionIdQuantityId = e.target.closest('.quantity-selector').dataset.optionId;
    const quantity = parseInt(e.target.value, 10);

    // Early exit if quantity is invalid
    if (isNaN(quantity) || quantity < 0) {
      e.target.value = 0; // Reset input if invalid quantity
      return;
    }

    // Ensure `lightingSound` array exists
    if (!this.configuration.lightingSound) {
      this.configuration.lightingSound = [];
    }

    // Find or create the item for the specific optionId
    let lightingSoundItem = this.configuration.lightingSound.find(item => item.id === optionIdQuantityId);

    if (!lightingSoundItem) {
      // If the item doesn't exist yet, create it with name and price based on the DOM
      const optionElement = e.target.closest('.option-card');
      const name = optionElement.querySelector('h3').textContent.trim(); // Extract name from h3 tag
      const priceText = optionElement.querySelector('.option-price').textContent.trim();
      const price = parseFloat(priceText.replace('$', '').replace(',', '')); // Extract and clean price value

      lightingSoundItem = {
        id: optionIdQuantityId,
        name: name,
        price: price,
        quantity: quantity // Set quantity initially
      };

      this.configuration.lightingSound.push(lightingSoundItem);
    } else {
      // Update quantity if item exists
      lightingSoundItem.quantity = quantity;
    }

    // Update sessionStorage for this specific item (individual key per item)
    sessionStorage.setItem(optionIdQuantityId, JSON.stringify(lightingSoundItem));

    // Log the change for debugging
    console.log(`Updated quantity for ${lightingSoundItem.name}: ${quantity}, Price: $${lightingSoundItem.price}`);
    console.log('Updated configuration:', this.configuration.lightingSound);
  }

  requireAwning(e) {
    const cards = document.querySelectorAll('button.button.active')
    cards.forEach(function(e){
        e.classList.add('require')
    })
  }
  
  awningSelected(e) {
    const cards = document.querySelectorAll('button.button.active')
    cards.forEach(function(e){
        e.classList.remove('require')
    })
  }


updateConfiguration(stepId, optionId, element) {
    const step = this.steps.find(s => s.id === stepId);
    if (!step) return;

    const dataKey = step.dataKey;
    let configKey = step.configKey;

    console.log('configkey:', configKey);
    if (configKey === 'awnings') {
        if (optionId != 4) {
            this.requireAwning();  
            alert("You must order an AS Awning Bracket along with your awning purchase.");
        } else {
            this.awningSelected();
        }
    }

    // Ensure the quantity selectors are properly initialized
    this.initializeQuantitySelectors();

    // Enable next step when selecting an option
    const nextButton = this.container.querySelectorAll('[data-next-step]');
    nextButton.forEach(button => {
        button.removeAttribute('disabled');
    });

    // Check if the option is a tray bonus
    const isTrayBonus = CONFIGURATOR_DATA.traysBonus.some(bonus => bonus.id === optionId);
    if (isTrayBonus) {
        configKey = 'trayBonus'; // Override configKey for tray bonuses
    }

    // Multi-select handling
    if (
        configKey === 'accessories' ||
        configKey === 'freight' ||
        configKey === 'passengerInternalAccessories' ||
        configKey === 'driverInternalAccessories' ||
        configKey === 'trayBonus' ||
        configKey === 'lightingSound' ||
        configKey === 'awnings'
    ) {
        element.classList.toggle('selected');
        console.log('matches a multi-select for tray bonus or other items');

        const optionList = isTrayBonus ? CONFIGURATOR_DATA.traysBonus : CONFIGURATOR_DATA[dataKey];
        const option = optionList.find(a => a.id === optionId);

        if (!option) {
            console.error(`Option not found: ${optionId}`);
            return;
        }

        if (!this.configuration[configKey]) {
            this.configuration[configKey] = [];
        }

        if (element.classList.contains('selected')) {
            if (!this.configuration[configKey].some(a => a.id === option.id)) {
                this.configuration[configKey].push(option);
            }
        } else {
            this.configuration[configKey] = this.configuration[configKey].filter(a => a.id !== option.id);
        }
    } else {
        console.log('matches a single-select for other options');
        
        // Allow deselection for single-select options
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            this.configuration[configKey] = null; // Remove the selection
        } else {
            // Deselect all other options in the group
            const siblings = element.parentElement.querySelectorAll('.option-card');
            siblings.forEach(card => card.classList.remove('selected'));
            element.classList.add('selected');

            const selectedOption = CONFIGURATOR_DATA[dataKey].find(item => {
                if (typeof item.id === 'number') {
                    return item.id === Number(optionId);
                }
                return item.id === optionId;
            });

            this.configuration[configKey] = selectedOption;
        }
    }

    // Update prices and visibility
    this.updateTotalPrice();
    this.updateTotalWeight();
    this.updateStepVisibility();
}



  handleCustomUpDown(e) {
    const current = e.currentTarget;
    console.log('Clicked button:', current);

    // Get the closest quantity-selector
    const quantitySelector = current.closest('.quantity-selector');
    if (!quantitySelector) return console.error('No quantity-selector found');

    // Get the input field inside the quantity-selector
    const quantityInput = quantitySelector.querySelector('.qty-input');
    if (!quantityInput) return console.error('No quantity input found');

    // Get current quantity safely (prevent NaN issues)
    let quantVal = parseInt(quantityInput.value, 10);
    if (isNaN(quantVal)) quantVal = 0;

    // Check if increasing or decreasing
    if (current.classList.contains('qty-increase')) {
      quantVal += 1;
    } else if (current.classList.contains('qty-decrease')) {
      quantVal = Math.max(0, quantVal - 1); // Prevent negative values
    }

    // Set the updated quantity
    quantityInput.value = quantVal;

    // Call handleQuantityChange to update configuration
    this.handleQuantityChange({ target: quantityInput });
  }


  initializeQuantitySelectors() {
    const quantitySelectors = this.container.querySelectorAll('.quantity-selector');

    quantitySelectors.forEach(selector => {
      const decreaseButton = selector.querySelector('.qty-decrease');
      const increaseButton = selector.querySelector('.qty-increase');

      if (!decreaseButton || !increaseButton) return;

      // Remove existing event listeners before adding new ones
      decreaseButton.replaceWith(decreaseButton.cloneNode(true));
      increaseButton.replaceWith(increaseButton.cloneNode(true));

      // Re-select the newly cloned buttons
      const newDecreaseButton = selector.querySelector('.qty-decrease');
      const newIncreaseButton = selector.querySelector('.qty-increase');

      // Add event listeners to the new buttons
      newDecreaseButton.addEventListener('click', this.handleCustomUpDown.bind(this));
      newIncreaseButton.addEventListener('click', this.handleCustomUpDown.bind(this));
    });
  }






  renderVehicleDetails(vehicle) {
    const detailsContainer = this.container.querySelector('[data-vehicle-details]');
    if (!detailsContainer || !vehicle) return;

    detailsContainer.innerHTML = `
      <div class="vehicle-details-content">
        <div class="vehicle-details-info">
          <div class="vehicle-details-name">${vehicle.name}</div>
          <div class="vehicle-details-description">${vehicle.description}</div>
        </div>
        <div class="vehicle-details-price">$${vehicle.price.toLocaleString()}</div>
      </div>
    `;
  }

  updateTotalPrice() {
    let total = 0;
    let totalLabour = 0;
    let totalFreight = 0;

    const addPriceAndCosts = (item) => {
      if (item) {
        total += item.price || 0;
        totalLabour += item.labourCost || 0;
        totalFreight += item.freightCost || 0;
      }
    };

    const addArrayPriceAndCosts = (array) => {
      if (Array.isArray(array) && array.length > 0) {
        total += array.reduce((sum, acc) => sum + (acc.price || 0), 0);
        totalLabour += array.reduce((sum, acc) => sum + (acc.labourCost || 0), 0);
        totalFreight += array.reduce((sum, acc) => sum + (acc.freightCost || 0), 0);
      }
    };

    // Track if tray and canopy have been added to total
    let trayAdded = false;
    let canopyAdded = false;

    // Check if tray has a price and add it to the total
    if (this.configuration.tray && this.configuration.tray.price > 0) {
      console.log('Tray has a price:', this.configuration.tray.price);
      addPriceAndCosts(this.configuration.tray);
      trayAdded = true;  // Mark tray as added
    }

    // Check if canopy has a price and add it to the total
    if (this.configuration.canopy && this.configuration.canopy.price > 0) {
      console.log('Canopy has a price:', this.configuration.canopy.price);
      addPriceAndCosts(this.configuration.canopy);
      canopyAdded = true;  // Mark canopy as added
    }

    // Add the rest of the configurations
    addPriceAndCosts(this.configuration.vehicle);
    addPriceAndCosts(this.configuration.serviceBody);
    addArrayPriceAndCosts(this.configuration.trayBonus);
    addPriceAndCosts(this.configuration.awnings);
    addPriceAndCosts(this.configuration.traySides);
    addArrayPriceAndCosts(this.configuration.freight);
    addPriceAndCosts(this.configuration.workBodyInternalFitOuts);
    addPriceAndCosts(this.configuration.passengerFitout);
    addArrayPriceAndCosts(this.configuration.passengerInternalAccessories);
    addPriceAndCosts(this.configuration.driverFitout);
    addArrayPriceAndCosts(this.configuration.driverInternalAccessories);
    addPriceAndCosts(this.configuration.dogBoxConversion);
    addPriceAndCosts(this.configuration.voltAndOven);
    addPriceAndCosts(this.configuration.fridges);
    addPriceAndCosts(this.configuration.lightingSound);
    addPriceAndCosts(this.configuration.centralLocking);
    addPriceAndCosts(this.configuration.colourCoding);
    addArrayPriceAndCosts(this.configuration.accessories);
    addPriceAndCosts(this.configuration.roofRackPlatforms);
    addPriceAndCosts(this.configuration.brackets);
    addPriceAndCosts(this.configuration.rooftopTentAwnings);
    addArrayPriceAndCosts(this.configuration.brackets); // Changed from addPriceAndCosts


    // If tray or canopy was added, deduct an amount from totalLabour and totalFreight and give discount
    if (trayAdded && canopyAdded) {
      console.log('Deducting amount from totalLabour and totalFreight for tray');
      // discount is 780 + 520 - 1280 = 20
      totalLabour -= 20;
      // discount is 599 + 399 - 799
      totalFreight -= 199;
    }

    // Store the costs in sessionStorage
    sessionStorage.setItem('labourCost', totalLabour);
    sessionStorage.setItem('freightCost', totalFreight);

    // Set the total price
    this.totalPrice = total;
    this.updateCurrentTotal();
  }




  updateCurrentTotal() {
    const currentTotalElement = this.container.querySelector('[data-current-total]');
    if (currentTotalElement) {
      currentTotalElement.textContent = `$${this.totalPrice.toFixed(2)}`;
    }
  }

  updateTotalWeight() {
    this.totalWeight = 0;
    console.log('CONFIG:', this.configuration);
    // Add vehicle weight if selected
    if (this.configuration.vehicle) {
      this.totalWeight += this.configuration.vehicle.weight || 0;
    }

    // Add tray bonus weights if selected (iterate over trayBonus array)
    if (this.configuration.trayBonus && Array.isArray(this.configuration.trayBonus)) {

      // Sum up the weights of all accessories
      const totalTrayBonus = this.configuration.trayBonus.reduce((sum, tray) => sum + (tray.weight || 0), 0);

      // Add to totalWeight
      this.totalWeight += totalTrayBonus;
    }


    // Add service body weight if selected
    if (this.configuration.serviceBody) {
      this.totalWeight += this.configuration.serviceBody.weight || 0;
    }

    // Add build type weight if selected
    if (this.configuration.buildType) {
      this.totalWeight += this.configuration.buildType.weight || 0;
    }

    // Add tray weight
    if (this.configuration.tray) {
      this.totalWeight += this.configuration.tray.weight || 0;
    }

    //awnings
    if (this.configuration.awnings) {
      this.totalWeight += this.configuration.awnings.weight || 0;
    }
    // Add canopy weight
    if (this.configuration.canopy) {

      this.totalWeight += this.configuration.canopy.weight || 0;
    }

    // Add tray sides weight
    if (this.configuration.traySides) {
      this.totalWeight += this.configuration.traySides.weight || 0;
    }
    // add work body internal fitouts weight
    if (this.configuration.workBodyInternalFitOuts) {
      this.totalWeight += this.configuration.workBodyInternalFitOuts.weight || 0;
    }
    // Add passenger fitout weight
    if (this.configuration.passengerFitout) {
      this.totalWeight += this.configuration.passengerFitout.weight || 0;
    }

    if (this.configuration.passengerInternalAccessories && Array.isArray(this.configuration.passengerInternalAccessories)) {

      // Sum up the weights of all accessories
      const totalpassengerInternalAccessoriesWeight = this.configuration.passengerInternalAccessories.reduce((sum, accessory) => sum + (accessory.weight || 0), 0);

      // Add to totalWeight
      this.totalWeight += totalpassengerInternalAccessoriesWeight;
    }

    // Add driver fitout weight
    if (this.configuration.driverFitout) {
      this.totalWeight += this.configuration.driverFitout.weight || 0;
    }

    // Add driver internal accessories weight
    if (this.configuration.driverInternalAccessories && Array.isArray(this.configuration.driverInternalAccessories)) {
      console.log('weight!');
      // Sum up the weights of all accessories
      const totaldriverInternalAccessoriesWeight = this.configuration.driverInternalAccessories.reduce((sum, accessory) => sum + (accessory.weight || 0), 0);

      // Add to totalWeight
      this.totalWeight += totaldriverInternalAccessoriesWeight;
    }

    // Add dog box conversion weight
    if (this.configuration.dogBoxConversion) {
      this.totalWeight += this.configuration.dogBoxConversion.weight || 0;
    }

    // Add volt and oven weight
    if (this.configuration.voltAndOven) {
      this.totalWeight += this.configuration.voltAndOven.weight || 0;
    }

    // Add fridges weight
    if (this.configuration.fridges) {
      this.totalWeight += this.configuration.fridges.weight || 0;
    }

    // Add lighting and sound weight
    if (this.configuration.lightingSound) {
      this.totalWeight += this.configuration.lightingSound.weight || 0;
    }

    // Add central locking weight
    if (this.configuration.centralLocking) {
      this.totalWeight += this.configuration.centralLocking.weight || 0;
    }

    // Add colour coding weight
    if (this.configuration.colourCoding) {
      this.totalWeight += this.configuration.colourCoding.weight || 0;
    }

    // Add external accessories weight
    if (this.configuration.accessories && Array.isArray(this.configuration.accessories)) {

      // Sum up the weights of all accessories
      const totalAccessoriesWeight = this.configuration.accessories.reduce((sum, accessory) => sum + (accessory.weight || 0), 0);

      // Add to totalWeight
      this.totalWeight += totalAccessoriesWeight;
    }

    
    // Add roof rack platforms weight
    if (this.configuration.roofRackPlatforms) {
      this.totalWeight += this.configuration.roofRackPlatforms.weight || 0;
    }

   // In updateTotalWeight()
    if (this.configuration.brackets.length > 0) {
        const totalBracketsWeight = this.configuration.brackets.reduce((sum, b) => sum + (b.weight || 0), 0);
        this.totalWeight += totalBracketsWeight;
    }

    // Add rooftop tent awnings weight
    if (this.configuration.rooftopTentAwnings) {
      this.totalWeight += this.configuration.rooftopTentAwnings.weight || 0;
    }


    this.updateWeightDisplay();
  }

  updateWeightDisplay() {
    const weightInfo = this.container.querySelector('[data-weight-info]');
    if (!weightInfo) return;

    const weightValue = weightInfo.querySelector('.weight-value');
    const gvmValue = weightInfo.querySelector('.gvm-value');

    // Update current weight
    weightValue.textContent = this.totalWeight.toFixed(2);

    // Update GVM limit if vehicle is selected
    if (this.configuration.vehicle && this.configuration.vehicle.gvm) {
      // gvmValue.textContent = this.configuration.vehicle.gvm;

      // Add warning class if weight exceeds GVM
      if (this.totalWeight > this.configuration.vehicle.gvm) {
        weightValue.classList.add('exceeded');
      } else {
        weightValue.classList.remove('exceeded');
      }
    } else {
      // gvmValue.textContent = '--';
      weightValue.classList.remove('exceeded');
    }
  }

  renderSummary() {
    const summaryContainer = this.container.querySelector('[data-summary]');
    if (!summaryContainer) return;
    console.log('summary config', this.configuration);
    let summaryHtml = '';

    // Vehicle
    if (this.configuration.vehicle) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Vehicle</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.vehicle.name}</div>
              <div class="summary-item-description">${this.configuration.vehicle.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.vehicle.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Build Type
    if (this.configuration.buildType) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Build Type</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.buildType.name}</div>
              <div class="summary-item-description">${this.configuration.buildType.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.buildType.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }
    // Service Body
    if (this.configuration.serviceBody) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Service Body</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.serviceBody.name}</div>
              <div class="summary-item-description">${this.configuration.serviceBody.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.serviceBody.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Tray
    if (this.configuration.tray) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Tray</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.tray.name}</div>
              <div class="summary-item-description">${this.configuration.tray.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.tray.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Tray Bonuses
    if (this.configuration.trayBonus && this.configuration.trayBonus.length > 0) {
      summaryHtml += '<div class="summary-section"><h3>Tray</h3>';
      this.configuration.trayBonus.forEach(bonus => {
        summaryHtml += `
                <div class="summary-item">
                    <div class="summary-item-details">
                        <div class="summary-item-name">${bonus.name}</div>
                        <div class="summary-item-description">${bonus.description}</div>
                    </div>
                    <div class="summary-item-price">$${(bonus.price || 0).toLocaleString()}</div>
                </div>
            `;
      });
      summaryHtml += '</div>';
    }

    // Canopy
    if (this.configuration.canopy) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Canopy</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.canopy.name}</div>
              <div class="summary-item-description">${this.configuration.canopy.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.canopy.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    //dogBoxConversion
    if (this.configuration.dogBoxConversion) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Dogbox</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.dogBoxConversion.name}</div>
              <div class="summary-item-description">${this.configuration.dogBoxConversion.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.dogBoxConversion.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Tray Sides
    if (this.configuration.traySides) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Tray Sides</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.traySides.name}</div>
              <div class="summary-item-description">${this.configuration.traySides.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.traySides.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Passenger Fitout
    if (this.configuration.passengerFitout) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Passenger Fitout</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.passengerFitout.name}</div>
              <div class="summary-item-description">${this.configuration.passengerFitout.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.passengerFitout.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Work body internal Fitouts
    if (this.configuration.workBodyInternalFitOuts) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Work Body Internal Fit Outs</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.workBodyInternalFitOuts.name}</div>
              <div class="summary-item-description">${this.configuration.workBodyInternalFitOuts.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.workBodyInternalFitOuts.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }
    // Passenger Internal Accessories
    if (this.configuration.passengerInternalAccessories.length > 0) {
      summaryHtml += '<div class="summary-section"><h3>Passenger Internal Accessories</h3>';

      this.configuration.passengerInternalAccessories.forEach(accessory => {
        summaryHtml += `
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${accessory.name}</div>
              <div class="summary-item-description">${accessory.description}</div>
            </div>
            <div class="summary-item-price">$${(accessory.price || 0).toLocaleString()}</div>
          </div>
        `;
      });

      summaryHtml += '</div>';
    }

    // Driver Fitout
    if (this.configuration.driverFitout) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Driver Fitout</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.driverFitout.name}</div>
              <div class="summary-item-description">${this.configuration.driverFitout.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.driverFitout.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Driver Internal Accessories
    if (this.configuration.driverInternalAccessories.length > 0) {
      summaryHtml += '<div class="summary-section"><h3>Driver Internal Accessories</h3>';

      this.configuration.driverInternalAccessories.forEach(accessory => {
        summaryHtml += `
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${accessory.name}</div>
              <div class="summary-item-description">${accessory.description}</div>
            </div>
            <div class="summary-item-price">$${(accessory.price || 0).toLocaleString()}</div>
          </div>
        `;
      });

      summaryHtml += '</div>';
    }

    /*
    if (this.configuration.dogBoxConversion) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Dog Box Conversion</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.dogBoxConversion.name}</div>
              <div class="summary-item-description">${this.configuration.dogBoxConversion.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.dogBoxConversion.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    } */

    // Volt and Oven
    if (this.configuration.voltAndOven) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Volt and Oven</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.voltAndOven.name}</div>
              <div class="summary-item-description">${this.configuration.voltAndOven.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.voltAndOven.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Fridges
    if (this.configuration.fridges) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Fridges</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.fridges.name}</div>
              <div class="summary-item-description">${this.configuration.fridges.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.fridges.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Lighting and Sound
    if (this.configuration.lightingSound.length > 0) {
      summaryHtml += '<div class="summary-section"><h3>Lighting Sound</h3>';

      this.configuration.lightingSound.forEach(lighting => {
        summaryHtml += `
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${lighting.name ? lighting.name : 'N/A'}</div>
              <div class="summary-item-description">${lighting.description ? lighting.description : ''} - Quantity: ${lighting.quantity ? lighting.quantity : 'N/A'}</div>
            </div>
            <div class="summary-item-price">$${(lighting.price || 0).toLocaleString()}</div>
          </div>
        `;
      });

      summaryHtml += '</div>';
    }

    // Central Locking
    if (this.configuration.centralLocking) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Central Locking</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.centralLocking.name}</div>
              <div class="summary-item-description">${this.configuration.centralLocking.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.centralLocking.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Colour Coding
    if (this.configuration.colourCoding) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Colour Coding</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.colourCoding.name}</div>
              <div class="summary-item-description">${this.configuration.colourCoding.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.colourCoding.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // External Accessories
    if (this.configuration.accessories.length > 0) {
      summaryHtml += '<div class="summary-section"><h3>External Accessories</h3>';

      this.configuration.accessories.forEach(accessory => {
        summaryHtml += `
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${accessory.name}</div>
              <div class="summary-item-description">${accessory.description}</div>
            </div>
            <div class="summary-item-price">$${(accessory.price || 0).toLocaleString()}</div>
          </div>
        `;
      });

      summaryHtml += '</div>';
    }

    // Roof Rack Type (Vehicle or Canopy)
    if (this.configuration.roofRackType) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Roof Rack Type</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.roofRackType === 'vehicle' ? 'Vehicle' : 'Canopy'}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Roof Rack Platforms
    if (this.configuration.roofRackPlatforms) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Roof Rack Platforms</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.roofRackPlatforms.name}</div>
              <div class="summary-item-description">${this.configuration.roofRackPlatforms.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.roofRackPlatforms.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Brackets
    // In renderSummary() for brackets
    if (this.configuration.brackets.length > 0) {
        summaryHtml += '<div class="summary-section"><h3>Brackets</h3>';
        this.configuration.brackets.forEach(bracket => {
            summaryHtml += `
                <div class="summary-item">
                    <div class="summary-item-details">
                        <div class="summary-item-name">${bracket.name}</div>
                        <div class="summary-item-description">${bracket.description}</div>
                    </div>
                    <div class="summary-item-price">$${(bracket.price || 0).toLocaleString()}</div>
                </div>
            `;
        });
        summaryHtml += '</div>';
    }

    if (this.configuration.awnings) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Awnings</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.awnings.name}</div>
              <div class="summary-item-description labor-cost">${this.configuration.awnings.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.awnings.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Rooftop Ten
    if (this.configuration.rooftopTentAwnings) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Rooftop Tent</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.rooftopTentAwnings.name}</div>
              <div class="summary-item-description labor-cost">${this.configuration.rooftopTentAwnings.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.rooftopTentAwnings.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }
    // Total Labour cost
    if (this.configuration.freight) {
      // Calculate total cost of selected freight options
      const totalCost = this.configuration.freight.reduce((sum, freight) => sum + (freight.price || 0), 0);
      console.log(this.configuration.freight)
      summaryHtml += `
            <div class="summary-section">
              <h3>Rooftop Tent Awnings</h3>
              <div class="summary-item">
                <div class="summary-item-details">
                  <div class="summary-item-name">Install Cost</div>
                  <div class="summary-item-description"></div>
                </div>
                <div class="summary-item-price">$${sessionStorage.getItem('labourCost')}</div>
              </div>
            </div>
          `;
    }



    summaryContainer.innerHTML = summaryHtml || '<p>No items selected</p>';

    // Update the total price display
    const totalPriceContainer = this.container.querySelector('[data-total-price]');
    if (totalPriceContainer) {
      totalPriceContainer.textContent = `Total: $${this.totalPrice.toFixed(2)}`;
    }
  }

  initSummary() {
    const summaryContainer = this.container.querySelector('[data-summary]');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = this.generateSummaryHTML();

    // Add quote button click handler
    const quoteButton = summaryContainer.querySelector('[data-get-quote]');
    if (quoteButton) {
      quoteButton.addEventListener('click', this.openQuoteModal.bind(this));
    }
  }

  openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    const message = document.getElementById('vehicleDetailsHidden');

    const vehicleDetails = `
      VEHICLE: ${this.configuration.vehicle ? this.configuration.vehicle.name : "N/A"} 
      BUILD TYPE:  ${this.configuration.buildType ? this.configuration.buildType.name : "N/A"} 
      TRAY: ${this.configuration.tray ? this.configuration.tray.name : "N/A"} 
      TRAY BONUSES: ${this.configuration.trayBonus && this.configuration.trayBonus.length > 0 ? this.configuration.trayBonus.map(bonus => bonus.name).join(", ") : "N/A"}
      CANOPY: ${this.configuration.canopy ? this.configuration.canopy.name : "N/A"} 
      TRAY SIDES: ${this.configuration.traySides ? this.configuration.traySides.name : "N/A"} 
      PASSENGER FITOUT: ${this.configuration.passengerFitout ? this.configuration.passengerFitout.name : "N/A"} 
      PASSENGER INTERNAL ACC: ${this.configuration.passengerInternalAccessories && this.configuration.passengerInternalAccessories.length > 0 ? this.configuration.passengerInternalAccessories.map(bonus => bonus.name).join(", ") : "N/A"}
      DRIVER FITOUT: ${this.configuration.driverFitout ? this.configuration.driverFitout.name : "N/A"} 
      DRIVER INTERNAL ACC:  ${this.configuration.driverInternalAccessories && this.configuration.driverInternalAccessories.length > 0 ? this.configuration.driverInternalAccessories.map(bonus => bonus.name).join(", ") : "N/A"}
      VOLT & OVEN: ${this.configuration.voltAndOven ? this.configuration.voltAndOven.name : "N/A"} 
      FRIDGES: ${this.configuration.fridges ? this.configuration.fridges.name : "N/A"} 
      LIGHTING: ${this.configuration.lightingSound && this.configuration.lightingSound.length > 0 ? this.configuration.lightingSound.map(lighting => `${lighting.name} (${lighting.quantity})`).join(", ") : ""}
      CENTRAL LOCKING: ${this.configuration.centralLocking ? this.configuration.centralLocking.name : "N/A"} 
      COLOUR CODING: ${this.configuration.colourCoding ? this.configuration.colourCoding.name : "N/A"} 
      ACCESSORIES: ${(this.configuration.accessories ?? []).length ? this.configuration.accessories.map(acc => acc.name).join(", ") : "N/A"} 
      ROOF RACK TYPE: ${this.configuration.roofRackType ? this.configuration.roofRackType : "N/A"} 
      ROOF RACK PLATFORMS: ${this.configuration.roofRackPlatforms ? this.configuration.roofRackPlatforms.name : "N/A"} 
      BRACKETS: ${this.configuration.brackets ? this.configuration.brackets.name : "N/A"} 
      ROOFTOP TENT & AWNINGS: ${this.configuration.rooftopTentAwnings ? this.configuration.rooftopTentAwnings.name : "N/A"} 
      INSTALLATION & FREIGHT: ${this.configuration.freight ? this.configuration.freight.map(f => f.name).join(', ') : "N/A"}
      LOCATION: ${sessionStorage.getItem('location')}
      PICKUP LOCATION: ${sessionStorage.getItem('address') ? sessionStorage.getItem('address') : "N/A"}
    `;
    message.value = vehicleDetails;

    // Check for location in sessionStorage and set state
    const location = sessionStorage.getItem('location');
    const stateSelect = document.getElementById('state');

    if (location && stateSelect) {
      // Reset the "Select a state" option by removing the selected attribute
      const defaultOption = stateSelect.querySelector('option[value=""]');
      if (defaultOption) {
        defaultOption.selected = false;
      }

      // Now, find the option that matches the location value and set it as selected
      const option = stateSelect.querySelector(`option[value="${location}"]`);
      if (option) {
        option.selected = true;
        stateSelect.selectedIndex = 1
      }

      // Trigger the change event to update the select display
      const event = new Event('change');
      stateSelect.dispatchEvent(event);
    }

    if (!modal) return;

    // Add active class to trigger fade-in
    modal.classList.add('active');

    // Handle close button click
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeQuoteModal(modal));
    }

    // Handle overlay click
    const overlay = modal.querySelector('.quote-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeQuoteModal(modal));
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }




  closeQuoteModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }



  handleGetQuote() {
    this.openQuoteModal();
  }

  showStep(step) {
    this.container.querySelectorAll('.configurator-step').forEach(s => {
      if (parseInt(s.dataset.step) === step) {
        s.style.display = 'block';
        s.classList.add('active');
      } else {
        s.style.display = 'none';
        s.classList.remove('active');
      }
    });

    // Update data-current-step attribute on the container
    this.container.dataset.currentStep = step;

    // Update button visibility
    const prevButton = this.container.querySelector('[data-prev-step]');
    const nextButton = this.container.querySelector('[data-next-step]');
    const getQuoteButton = this.container.querySelector('[data-get-quote]');

    if (prevButton) prevButton.style.display = step > 1 ? 'block' : 'none';
    if (nextButton) nextButton.style.display = step < this.totalSteps ? 'block' : 'none';
    if (getQuoteButton) getQuoteButton.style.display = step === this.totalSteps ? 'block' : 'none';

    this.renderCurrentStep();
  }

  showSummaryModal() {
    const modal = document.createElement('div');
    modal.classList.add('configurator-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Configuration Summary</h2>
        <div class="modal-body">
          ${this.container.querySelector('[data-summary]').innerHTML}
          <div class="modal-total">
            ${this.container.querySelector('[data-total-price]').innerHTML}
          </div>
        </div>
        <button class="btn btn-primary" onclick="this.closest('.configurator-modal').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  restart() {
    // temp
    window.location.reload();
    // Ensure configuration is reset properly
    this.configuration = {
      vehicle: null,
      buildType: null,
      tray: null,
      canopy: null,
      traySides: null,
      passengerFitout: null,
      passengerInternalAccessories: null,
      driverFitout: null,
      driverInternalAccessories: null,
      dogBoxConversion: null,
      voltAndOven: null,
      fridges: null,
      lightingSound: null,
      centralLocking: null,
      colourCoding: null,
      accessories: [],
      roofRackPlatforms: null,
      brackets: null,
      rooftopTentAwnings: null,
      installationFreight: null
    };

    // Ensure container exists before querying elements
    if (this.container) {
      const optionCards = this.container.querySelectorAll('.option-card');
      if (optionCards.length) {
        optionCards.forEach(card => card.classList.remove('selected'));
      }

      const vehicleSelect = this.container.querySelector('[data-vehicle-select]');
      if (vehicleSelect) {
        vehicleSelect.value = '';
      }

      const detailsContainer = this.container.querySelector('[data-vehicle-details]');
      if (detailsContainer) {
        detailsContainer.innerHTML = '';
      }
    }

    // Reset totals
    this.totalPrice = 0;
    this.totalWeight = 0;

    // Ensure functions exist before calling them
    if (typeof this.updateTotalPrice === 'function') this.updateTotalPrice();
    if (typeof this.updateCurrentTotal === 'function') this.updateCurrentTotal();
    if (typeof this.updateTotalWeight === 'function') this.updateTotalWeight();

    // Go back to step 1 safely
    this.currentStep = 1;

    if (typeof this.renderCurrentStep === 'function') this.renderCurrentStep();
    if (typeof this.updateProgress === 'function') this.updateProgress();
  }


  createOptionCard(option) {
    // Define placeholder class
    const placeholder = option.placeholder ? "placeholder" : "";

    // Check if option.checkbox is true
    const checkboxHTML = option.checkbox
      ? `
        <div class="toggle">
          <input type="checkbox" id="${option.id}" name="${option.id}" ${option.isSelected ? 'checked' : ''} />
          <label for="${option.id}">
            <span class="thumb"></span>
          </label>
          <div class="light"></div>
        </div>
      `
      : ''; // If checkbox is not true, don't include the checkbox HTML

    // Check if option.quantitySelector is true
    const quantitySelectorHTML = option.quantitySelector
      ? `
        <div class="quantity-selector" data-option-id="${option.id}">
          <label>Pick Quantity</label>
          <div class="qty-controls">
            <button class="qty-decrease" type="button">
              <svg width="15px" height="15px" viewBox="0 -12 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                  <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-414.000000, -1049.000000)" fill="#000000">
                  <path d="M442,1049 L418,1049 C415.791,1049 414,1050.79 414,1053 C414,1055.21 415.791,1057 418,1057 L442,1057 C444.209,1057 446,1055.21 446,1053 C446,1050.79 444.209,1049 442,1049" id="minus" sketch:type="MSShapeGroup"></path></g></g>
               </svg>
            </button>
            <input type="number" class="qty-input" value="0" min="0" max="4" />
            <button class="qty-increase" type="button">
              <svg width="20px" height="20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg>
            </button>
          </div>
        </div>
      `
      : ''; // If quantitySelector is not true, don't include the quantity selector HTML

    // Create the option card HTML
    return `
    <div class="option-card ${placeholder}" data-option-id="${option.id}">
      <div class="option-image">
        <img src="${option.image}" alt="${option.name}">
      </div>
      <div class="option-details">
        <h3>${option.name}</h3>
        <p>${option.description}</p>
        <div class="option-price">$${option.price.toFixed(2)}</div>
      </div>
      ${quantitySelectorHTML} <!-- Include quantity selector HTML if applicable -->
      ${checkboxHTML} <!-- Include the checkbox HTML if applicable -->
    </div>
  `;
  }

  handleStepVisibility(step) {
    if (!step.showIf) return true;
    return step.showIf(this.configuration);
  }

  updateStepVisibility() {
    const steps = CONFIGURATOR_DATA.steps;
    steps.forEach(step => {
      const stepElement = document.querySelector(`[data-step-id="${step.id}"]`);
      if (stepElement) {
        const isVisible = this.handleStepVisibility(step);
        stepElement.style.display = isVisible ? 'block' : 'none';

        // If step becomes invisible, remove its configuration
        if (!isVisible && this.configuration[step.configKey]) {
          delete this.configuration[step.configKey];
          this.updateTotalPrice();
          this.updateTotalWeight();
        }
      }
    });
  }

  handleCustomFitoutSelection(side) {
    const config = this.configuration;
    const fitoutKey = `${side}Fitout`;
    const accessoriesKey = `${side}InternalAcc`;

    if (config[fitoutKey] && config[fitoutKey].id === 'custom') {
      // Show the internal accessories step
      this.updateStepVisibility();
    } else {
      // Remove internal accessories selection if not custom
      if (config[accessoriesKey]) {
        delete config[accessoriesKey];
        this.updateTotalPrice();
        this.updateTotalWeight();
      }
    }
  }

  handleOptionSelection(event) {
    const option = event.currentTarget;
    const stepId = option.closest('[data-step]').dataset.stepId;
    const step = CONFIGURATOR_DATA.steps.find(s => s.id === parseInt(stepId));

    if (!step) return;

    const selectedOption = CONFIGURATOR_DATA[step.dataKey].find(
      opt => opt.id === option.dataset.optionId
    );

    if (!selectedOption) return;

    this.configuration[step.configKey] = selectedOption;

    // Handle custom fitout selections
    if (step.configKey === 'passengerFitout' || step.configKey === 'driverFitout') {
      const side = step.configKey.replace('Fitout', '');
      this.handleCustomFitoutSelection(side);
    }

    // Handle roof rack dependent options
    if (step.configKey === 'roofRackPlatforms') {
      this.updateStepVisibility();
    }

    this.updateTotalPrice();
    this.updateTotalWeight();
    this.updateProgress();
    this.saveConfiguration();
  }
}

// Initialize the configurator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-configurator]');
  new ProductConfigurator(container);
});