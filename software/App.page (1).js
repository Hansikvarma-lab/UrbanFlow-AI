document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on local storage or system preference
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.body.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.body.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const iconPath = theme === 'dark' 
      ? '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />' // Moon
      : '<path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />'; // Sun
    
    themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>`;
  }

  // Form Validation Logic
  const loginForm = document.getElementById('login-form');
  const nameInput = document.getElementById('name');
  const mobileNumberInput = document.getElementById('mobileNumber');
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');

  // Load preserved values if any
  if(sessionStorage.getItem('urbanflow_name')) nameInput.value = sessionStorage.getItem('urbanflow_name');
  if(sessionStorage.getItem('urbanflow_mobileNumber')) mobileNumberInput.value = sessionStorage.getItem('urbanflow_mobileNumber');
  if(sessionStorage.getItem('urbanflow_from')) fromInput.value = sessionStorage.getItem('urbanflow_from');
  if(sessionStorage.getItem('urbanflow_to')) toInput.value = sessionStorage.getItem('urbanflow_to');

  function validateInput(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const targetElement = inputElement.closest('.glass-input') || inputElement;
    
    let isValid = !!inputElement.value.trim();
    
    if (inputElement.id === 'mobileNumber') {
      const val = inputElement.value.replace(/[\s-]/g, '');
      isValid = /^\d{10}$/.test(val);
    }

    if (!isValid) {
      targetElement.classList.add('error');
      formGroup.classList.add('has-error');
      return false;
    } else {
      targetElement.classList.remove('error');
      formGroup.classList.remove('has-error');
      return true;
    }
  }

  // Clear error on input
  [nameInput, mobileNumberInput, fromInput, toInput].forEach(input => {
    input.addEventListener('input', () => {
      validateInput(input);
    });
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateInput(nameInput);
    const isMobileValid = validateInput(mobileNumberInput);
    const isFromValid = validateInput(fromInput);
    const isToValid = validateInput(toInput);

    if (isNameValid && isMobileValid && isFromValid && isToValid) {
      // Preserve values for next phase
      sessionStorage.setItem('urbanflow_name', nameInput.value.trim());
      sessionStorage.setItem('urbanflow_mobileNumber', mobileNumberInput.value.trim());
      sessionStorage.setItem('urbanflow_from', fromInput.value.trim());
      sessionStorage.setItem('urbanflow_to', toInput.value.trim());
      
      // Show Role Selection Modal
      const modalOverlay = document.getElementById('modal-overlay');
      modalOverlay.classList.remove('hidden');
      
      // Small delay to allow display:block to apply before adding opacity class for transition
      setTimeout(() => {
        modalOverlay.classList.add('active');
      }, 10);
      
    } else {
      // Shake animation on error
      const card = document.querySelector('.glass-card:not(.modal-card)');
      card.style.transform = 'translateX(5px)';
      setTimeout(() => card.style.transform = 'translateX(-5px)', 100);
      setTimeout(() => card.style.transform = 'translateX(5px)', 200);
      setTimeout(() => card.style.transform = 'translateX(0)', 300);
    }
  });

  // ===========================
  // Structured Hub Data (Phase 4 + Phase 5)
  // ===========================
  const hubsData = [
    {
      id: 'hub-alpha',
      name: 'Hub Alpha',
      location: 'North District',
      distance: '1.2 km',
      status: 'Available',
      acceptingOrders: true,
      recommended: true,
      estimatedDeliveryDays: 2
    },
    {
      id: 'hub-beta',
      name: 'Hub Beta',
      location: 'East Industrial',
      distance: '3.4 km',
      status: 'Available',
      acceptingOrders: true,
      recommended: true,
      estimatedDeliveryDays: 4
    },
    {
      id: 'hub-gamma',
      name: 'Hub Gamma',
      location: 'South Central',
      distance: '4.8 km',
      status: 'Busy',
      acceptingOrders: false,
      recommended: false,
      estimatedDeliveryDays: null
    },
    {
      id: 'hub-delta',
      name: 'Hub Delta',
      location: 'West Transit',
      distance: '6.1 km',
      status: 'Busy',
      acceptingOrders: false,
      recommended: false,
      estimatedDeliveryDays: null
    },
    {
      id: 'hub-epsilon',
      name: 'Hub Epsilon',
      location: 'Outer Ring',
      distance: '8.5 km',
      status: 'Available',
      acceptingOrders: true,
      recommended: false,
      estimatedDeliveryDays: 2
    }
  ];

  // ===========================
  // Recommendation Logic (Phase 5)
  // ===========================
  function isHubEligible(hub) {
    return hub.status === 'Available' && hub.acceptingOrders === true;
  }

  function getBestRecommendedHub() {
    const eligible = hubsData.filter(isHubEligible);
    if (eligible.length === 0) return null;
    // Among eligible hubs, prioritize the shortest estimated delivery time
    eligible.sort((a, b) => {
      const aTime = a.estimatedDeliveryDays ?? Infinity;
      const bTime = b.estimatedDeliveryDays ?? Infinity;
      return aTime - bTime;
    });
    return eligible[0];
  }

  // Role Selection Logic
  const roleButtons = document.querySelectorAll('.role-button');
  const modalOverlay = document.getElementById('modal-overlay');
  
  roleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const selectedRole = button.getAttribute('data-role');
      
      // Store selected role
      sessionStorage.setItem('urbanflow_role', selectedRole);
      console.log(`Role selected: ${selectedRole}`);
      
      // Add subtle visual response to the clicked button
      button.style.transform = 'scale(0.95)';
      button.style.background = 'var(--button-hover-bg)';
      button.style.borderColor = 'var(--accent-color)';
      
      setTimeout(() => {
        // Close modal smoothly
        modalOverlay.classList.remove('active');
        
        setTimeout(() => {
          modalOverlay.classList.add('hidden');
          
          if (selectedRole === 'Traveler') {
            // Hide login view
            const loginView = document.getElementById('login-view');
            loginView.classList.add('hidden');
            
            // Populate dashboard data
            document.getElementById('dashboard-welcome').textContent = `Welcome back, ${sessionStorage.getItem('urbanflow_name')}`;
            document.getElementById('route-from-value').textContent = sessionStorage.getItem('urbanflow_from');
            document.getElementById('route-to-value').textContent = sessionStorage.getItem('urbanflow_to');
            
            // Show Traveler Dashboard
            const dashboard = document.getElementById('traveler-dashboard');
            dashboard.classList.remove('hidden');
            document.body.classList.add('dashboard-active');
          } else if (selectedRole === 'Logistics') {
            showLogisticsHubs();
          }
        }, 400); // Wait for transition to finish
      }, 200);
    });
  });

  // ===========================
  // Show Logistics Hubs (Phase 4)
  // ===========================
  function showLogisticsHubs() {
    // Hide login view
    const loginView = document.getElementById('login-view');
    loginView.classList.add('hidden');
    
    // Hide hub details if visible
    document.getElementById('hub-details-view').classList.add('hidden');
    
    // Populate Destination
    const destValue = sessionStorage.getItem('urbanflow_to') || 'Unknown Location';
    document.getElementById('logistics-dest-value').textContent = destValue;
    
    const hubsContainer = document.getElementById('hubs-container');
    hubsContainer.innerHTML = ''; // clear any existing
    
    hubsData.forEach((hub, index) => {
      const isEligible = isHubEligible(hub) && hub.recommended;
      const cardClass = isEligible ? 'hub-card recommended' : (hub.status === 'Busy' ? 'hub-card busy' : 'hub-card');
      const badgeClass = hub.status === 'Available' ? 'badge-available' : 'badge-busy';
      const badgeText = hub.status === 'Available' ? 'Available' : 'Busy';
      const orderText = hub.acceptingOrders ? 'Accepting Orders' : 'Not Accepting';
      const isClickable = isHubEligible(hub);
      const buttonText = isClickable ? 'View Hub Details' : 'Unavailable';
      
      const hubHTML = `
        <div class="${cardClass}" data-hub-index="${index}">
          <div class="hub-header">
            <div class="hub-name">${hub.name}</div>
            <div class="hub-badge ${badgeClass}">${badgeText}</div>
          </div>
          <div class="hub-details">
            <div class="detail-row">
              <span class="detail-label">Location</span>
              <span class="detail-value">${hub.location}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Distance</span>
              <span class="detail-value">${hub.distance}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Orders</span>
              <span class="detail-value status-value">
                <span class="status-indicator ${hub.acceptingOrders ? 'status-good' : 'status-moderate'}"></span>
                ${orderText}
              </span>
            </div>
            ${isEligible ? '<div class="detail-row" style="margin-top: 0.5rem;"><span class="detail-label" style="color: var(--accent-color);">✓ Recommended Hub</span></div>' : ''}
          </div>
          <button class="glass-button hub-action hub-view-btn" data-hub-index="${index}" ${!isClickable ? 'disabled' : ''}>${buttonText}</button>
        </div>
      `;
      
      hubsContainer.insertAdjacentHTML('beforeend', hubHTML);
    });

    // Attach click handlers to hub action buttons
    document.querySelectorAll('.hub-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hubIndex = parseInt(btn.getAttribute('data-hub-index'));
        openHubDetails(hubsData[hubIndex]);
      });
    });
    
    // Show Logistics Dashboard
    const logisticsDashboard = document.getElementById('logistics-dashboard');
    logisticsDashboard.classList.remove('hidden');
    document.body.classList.add('dashboard-active');
    window.scrollTo(0, 0);
  }

  // ===========================
  // Phase 5: Open Hub Details
  // ===========================
  function openHubDetails(hub) {
    // Hide logistics hub list
    document.getElementById('logistics-dashboard').classList.add('hidden');
    
    // Populate header context
    const destination = sessionStorage.getItem('urbanflow_to') || 'Unknown';
    const origin = sessionStorage.getItem('urbanflow_from') || 'Unknown';
    document.getElementById('hub-detail-dest').textContent = destination;
    document.getElementById('hub-detail-name').textContent = hub.name;

    // Store selected hub for reference
    sessionStorage.setItem('urbanflow_selected_hub', JSON.stringify(hub));

    // Render all sub-sections
    renderHubSummary(hub);
    renderHubRecommendation(hub);
    renderHubRoute(origin, hub);
    renderHubDelivery(hub);
    renderHubSelectAction(hub);
    renderHubComparison(hub);

    // Show hub details view
    const hubDetailsView = document.getElementById('hub-details-view');
    hubDetailsView.classList.remove('hidden');
    document.body.classList.add('dashboard-active');
    window.scrollTo(0, 0);
  }

  // ===========================
  // Render: Hub Summary Card
  // ===========================
  function renderHubSummary(hub) {
    const statusClass = hub.status === 'Available' ? 'status-available' : 'status-busy';
    const orderStatusText = hub.acceptingOrders ? 'Accepting Orders' : 'Not Accepting Orders';
    const orderStatusClass = hub.acceptingOrders ? 'status-available' : 'status-busy';
    const eligible = isHubEligible(hub);
    const recText = eligible ? 'Recommended' : 'Not Recommended';
    const recClass = eligible ? 'status-available' : 'status-busy';
    const badgeClass = hub.status === 'Available' ? 'badge-available' : 'badge-busy';

    document.getElementById('hub-summary-card').innerHTML = `
      <div class="summary-header">
        <h3 class="summary-hub-name">${hub.name}</h3>
        <div class="hub-badge ${badgeClass}">${hub.status}</div>
      </div>
      <div class="summary-rows">
        <div class="summary-row">
          <span class="summary-row-label">Location</span>
          <span class="summary-row-value">${hub.location}</span>
        </div>
        <div class="summary-row">
          <span class="summary-row-label">Distance</span>
          <span class="summary-row-value">${hub.distance}</span>
        </div>
        <div class="summary-row">
          <span class="summary-row-label">Status</span>
          <span class="summary-row-value ${statusClass}">${hub.status}</span>
        </div>
        <div class="summary-row">
          <span class="summary-row-label">Orders</span>
          <span class="summary-row-value ${orderStatusClass}">${orderStatusText}</span>
        </div>
        <div class="summary-row">
          <span class="summary-row-label">Recommendation</span>
          <span class="summary-row-value ${recClass}">${recText}</span>
        </div>
      </div>
    `;
  }

  // ===========================
  // Render: Recommendation Card
  // ===========================
  function renderHubRecommendation(hub) {
    const eligible = isHubEligible(hub);
    const bestHub = getBestRecommendedHub();
    const isBest = bestHub && bestHub.id === hub.id;

    let badgeHTML, detailsHTML;

    if (eligible) {
      badgeHTML = `<div class="recommendation-badge recommended">${isBest ? '★ RECOMMENDED HUB' : '✓ ELIGIBLE HUB'}</div>`;
      detailsHTML = `
        <div class="recommendation-details">
          <div class="recommendation-detail-item">
            <span class="rec-icon positive">✓</span>
            <span>Available</span>
          </div>
          <div class="recommendation-detail-item">
            <span class="rec-icon positive">✓</span>
            <span>Accepting Orders</span>
          </div>
          ${hub.estimatedDeliveryDays !== null ? `
          <div class="recommendation-detail-item">
            <span class="rec-icon positive">✓</span>
            <span>Estimated Delivery: ${hub.estimatedDeliveryDays} Day${hub.estimatedDeliveryDays !== 1 ? 's' : ''}</span>
          </div>` : ''}
          ${isBest ? '<p style="margin-top:0.8rem; font-size:0.85rem; color: var(--text-secondary);"><em>This hub has the shortest estimated delivery time among eligible hubs.</em></p>' : ''}
        </div>
      `;
    } else {
      badgeHTML = `<div class="recommendation-badge not-recommended">✕ NOT RECOMMENDED</div>`;
      detailsHTML = `
        <div class="recommendation-details">
          <div class="recommendation-detail-item">
            <span class="rec-icon ${hub.status === 'Available' ? 'positive' : 'negative'}">${hub.status === 'Available' ? '✓' : '✕'}</span>
            <span>${hub.status}</span>
          </div>
          <div class="recommendation-detail-item">
            <span class="rec-icon ${hub.acceptingOrders ? 'positive' : 'negative'}">${hub.acceptingOrders ? '✓' : '✕'}</span>
            <span>${hub.acceptingOrders ? 'Accepting Orders' : 'Not Accepting Orders'}</span>
          </div>
          <p style="margin-top:0.8rem; font-size:0.85rem; color: var(--text-secondary);"><em>This hub is currently not eligible for selection.</em></p>
        </div>
      `;
    }

    document.getElementById('hub-recommendation-card').innerHTML = badgeHTML + detailsHTML;
  }

  // ===========================
  // Render: Route Visualization
  // ===========================
  function renderHubRoute(origin, hub) {
    document.getElementById('hub-route-viz').innerHTML = `
      <div class="route-node">
        <div class="route-node-marker origin"></div>
        <div class="route-node-info">
          <span class="route-node-label">Origin</span>
          <span class="route-node-name">${origin}</span>
        </div>
      </div>
      
      <div class="route-connector">
        <div class="route-connector-line">
          <div class="route-pulse"></div>
        </div>
      </div>

      <div class="route-node">
        <div class="route-node-marker waypoint"></div>
        <div class="route-node-info">
          <span class="route-node-label">En Route</span>
          <span class="route-node-name" style="color: var(--text-secondary); font-size: 0.9rem;">${hub.distance} via logistics corridor</span>
        </div>
      </div>

      <div class="route-connector short">
        <div class="route-connector-line">
          <div class="route-pulse" style="animation-delay: 0.7s;"></div>
        </div>
      </div>

      <div class="route-node">
        <div class="route-node-marker destination"></div>
        <div class="route-node-info">
          <span class="route-node-label">Hub Destination</span>
          <span class="route-node-name">${hub.name} — ${hub.location}</span>
        </div>
      </div>
    `;
  }

  // ===========================
  // Render: Estimated Delivery
  // ===========================
  function renderHubDelivery(hub) {
    let deliveryHTML;
    if (hub.estimatedDeliveryDays !== null) {
      deliveryHTML = `
        <p class="delivery-label">Estimated Delivery</p>
        <p class="delivery-value">${hub.estimatedDeliveryDays}</p>
        <p class="delivery-unit">Day${hub.estimatedDeliveryDays !== 1 ? 's' : ''}</p>
        <p class="delivery-note">Demo estimate — real data will be connected in future phases.</p>
      `;
    } else {
      deliveryHTML = `
        <p class="delivery-label">Estimated Delivery</p>
        <p class="delivery-unavailable">—</p>
        <p class="delivery-note">Delivery estimate unavailable for this hub.</p>
      `;
    }
    document.getElementById('hub-delivery-card').innerHTML = deliveryHTML;
  }

  // ===========================
  // Render: Select Hub Action
  // ===========================
  function renderHubSelectAction(hub) {
    const eligible = isHubEligible(hub);
    let html;
    if (eligible) {
      html = `
        <button class="glass-button select-hub-btn" id="select-hub-action">${'\u00A0'}Select Hub${'\u00A0'}</button>
      `;
    } else {
      html = `
        <button class="glass-button select-hub-btn" disabled>Selection Unavailable</button>
        <p class="select-disabled-reason">This hub is currently ${hub.status === 'Busy' ? 'busy' : 'not accepting orders'} and cannot be selected.</p>
      `;
    }
    document.getElementById('hub-select-card').innerHTML = html;

    // Bind select action
    if (eligible) {
      document.getElementById('select-hub-action').addEventListener('click', () => {
        confirmHubSelection(hub);
      });
    }
  }

  // ===========================
  // Render: Hub Comparison Table
  // ===========================
  function renderHubComparison(selectedHub) {
    let rows = '';
    hubsData.forEach(hub => {
      const isCurrent = hub.id === selectedHub.id;
      const eligible = isHubEligible(hub);
      const dotClass = hub.status === 'Available' ? 'green' : 'yellow';
      const deliveryText = hub.estimatedDeliveryDays !== null ? `${hub.estimatedDeliveryDays} Day${hub.estimatedDeliveryDays !== 1 ? 's' : ''}` : '—';
      const ordersText = hub.acceptingOrders ? 'Accepting' : 'Not Accepting';

      rows += `
        <tr class="${isCurrent ? 'current-hub' : ''}">
          <td>${hub.name}${isCurrent ? ' ←' : ''}</td>
          <td><span class="comp-status-dot ${dotClass}"></span>${hub.status}</td>
          <td>${ordersText}</td>
          <td>${deliveryText}</td>
        </tr>
      `;
    });

    document.getElementById('hub-comparison-table').innerHTML = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Hub</th>
            <th>Status</th>
            <th>Orders</th>
            <th>Est. Delivery</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // ===========================
  // Hub Selection Confirmation
  // ===========================
  function confirmHubSelection(hub) {
    // Store the selected hub data
    sessionStorage.setItem('urbanflow_selected_hub', JSON.stringify(hub));
    sessionStorage.setItem('urbanflow_selected_hub_name', hub.name);

    // Show confirmation modal
    document.getElementById('confirm-hub-name').textContent = hub.name;
    document.getElementById('confirm-hub-delivery').textContent = hub.estimatedDeliveryDays !== null
      ? `Estimated Delivery: ${hub.estimatedDeliveryDays} Day${hub.estimatedDeliveryDays !== 1 ? 's' : ''}`
      : 'Estimated Delivery: N/A';

    const overlay = document.getElementById('hub-confirm-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);
  }

  // Confirmation modal "Done" button
  document.getElementById('confirm-done-btn').addEventListener('click', () => {
    const overlay = document.getElementById('hub-confirm-overlay');
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 400);
  });

  // ===========================
  // Back to Hubs Navigation
  // ===========================
  document.getElementById('back-to-hubs').addEventListener('click', () => {
    document.getElementById('hub-details-view').classList.add('hidden');
    showLogisticsHubs();
  });
});

