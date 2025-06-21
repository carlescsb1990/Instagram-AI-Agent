// Riona AI Agent - Core Dashboard JavaScript

class RionaAIDashboard {
  constructor() {
    this.currentPage = "dashboard";
    this.activityLog = [];
    this.isLoading = false;
    this.apiBaseUrl = "/api";

    // Initialize start time if not exists
    if (!this.getFromStorage("startTime")) {
      this.saveToStorage("startTime", Date.now());
    }

    this.setupEventListeners();
    this.loadInitialData();
    this.startAutoRefresh();
  }

  // Core Event Listeners
  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const page = item.getAttribute("data-page");
        this.showPage(page);
      });
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        this.toggleSidebar();
      });
    }

    // Header controls
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.refreshCurrentPage();
      });
    }

    const settingsQuickBtn = document.getElementById("settingsQuickBtn");
    if (settingsQuickBtn) {
      settingsQuickBtn.addEventListener("click", () => {
        this.showPage("settings");
      });
    }

    const debugBtn = document.getElementById("debugBtn");
    if (debugBtn) {
      debugBtn.addEventListener("click", () => {
        this.runDebugTest();
      });
    }

    // Character selection
    document.querySelectorAll(".character-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.selectCharacter(card.getAttribute("data-character"));
      });
    });

    // Platform toggles
    document.querySelectorAll(".feature-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        this.toggleFeature(toggle);
      });
    });

    // Content generation
    const generateBtn = document.querySelector(
      '[onclick="dashboard.generateAIContent()"]',
    );
    if (generateBtn) {
      generateBtn.onclick = () => this.generateAIContent();
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  // Page Navigation
  showPage(pageName) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add("active");
    }

    // Hide all pages
    document.querySelectorAll(".page-content").forEach((page) => {
      page.classList.remove("active");
    });

    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Update page info
    this.currentPage = pageName;
    this.updatePageTitle(pageName);
    this.updateBreadcrumb(pageName);

    // Load page-specific data
    this.loadPageData(pageName);

    // Add to activity log
    this.addLogEntry(
      "info",
      `Navegando a ${this.getPageDisplayName(pageName)}`,
    );
  }

  updatePageTitle(pageName) {
    const titles = {
      dashboard: "Dashboard Principal",
      agent: "Agente AI",
      social: "Redes Sociales",
      automation: "Automatización",
      analytics: "Analíticas",
      settings: "Configuración",
      documentation: "Documentación",
    };

    const titleElement = document.getElementById("pageTitle");
    if (titleElement) {
      titleElement.textContent = titles[pageName] || "Dashboard";
    }
  }

  updateBreadcrumb(pageName) {
    const breadcrumbs = {
      dashboard: "Inicio / Dashboard",
      agent: "Inicio / Agente AI",
      social: "Inicio / Redes Sociales",
      automation: "Inicio / Automatización",
      analytics: "Inicio / Analíticas",
      settings: "Inicio / Configuración",
      documentation: "Inicio / Documentación",
    };

    const breadcrumbElement = document.getElementById("breadcrumbText");
    if (breadcrumbElement) {
      breadcrumbElement.textContent = breadcrumbs[pageName] || "Inicio";
    }
  }

  getPageDisplayName(pageName) {
    const names = {
      dashboard: "Dashboard Principal",
      agent: "Agente AI",
      social: "Redes Sociales",
      automation: "Automatización",
      analytics: "Analíticas",
      settings: "Configuración",
      documentation: "Documentación",
    };
    return names[pageName] || pageName;
  }

  // Data Loading
  async loadInitialData() {
    try {
      this.setLoading(true);

      // Load system health
      await this.loadSystemHealth();

      // Load dashboard metrics
      await this.loadDashboardMetrics();

      // Load initial activity log
      this.initializeActivityLog();

      this.addLogEntry("success", "Sistema Riona AI iniciado correctamente");
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error cargando datos iniciales: ${error.message}`,
      );
    } finally {
      this.setLoading(false);
    }
  }

  async loadPageData(pageName) {
    try {
      this.setLoading(true);

      switch (pageName) {
        case "dashboard":
          await this.loadDashboardData();
          break;
        case "agent":
          await this.loadAgentData();
          break;
        case "social":
          await this.loadSocialData();
          break;
        case "analytics":
          await this.loadAnalyticsData();
          break;
        case "settings":
          this.loadSettingsData();
          break;
        case "documentation":
          this.loadDocumentationData();
          break;
      }
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error cargando datos de ${pageName}: ${error.message}`,
      );
    } finally {
      this.setLoading(false);
    }
  }

  async loadSystemHealth() {
    try {
      const response = await this.apiCall("/health");
      if (response) {
        // Update system status
        const statusElement = document.querySelector(".system-status");
        if (statusElement && response.status === "healthy") {
          statusElement.classList.add("active");
        }

        // Update uptime
        this.updateUptime(response.uptime);
      }
    } catch (error) {
      console.warn("Could not load system health:", error);
    }
  }

  async loadDashboardMetrics() {
    try {
      // Try to load from API first
      const response = await this.apiCall("/social");
      if (response && response.success) {
        // Update total accounts
        this.updateElement("totalAccounts", response.data.totalAccounts || 0);
        this.updateElement(
          "activeAccounts",
          response.data.activeAutomations || 0,
        );
      }
    } catch (error) {
      console.warn(
        "Could not load dashboard metrics from API, using localStorage:",
        error,
      );

      // Fallback to localStorage data
      const accounts = this.getStoredAccounts();
      const users = this.getStoredUsers();

      const totalAccounts = accounts.length;
      const activeAccounts = accounts.filter(
        (acc) => acc.status === "active",
      ).length;

      this.updateElement("totalAccounts", totalAccounts);
      this.updateElement("activeAccounts", activeAccounts);

      // Update uptime with stored data or default
      const settings = this.getStoredSettings();
      const startTime = this.getFromStorage("startTime", Date.now());
      const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
      this.updateUptime(uptimeSeconds);
    }
  }

  async loadDashboardData() {
    // Load real-time dashboard data
    await Promise.all([
      this.loadSystemHealth(),
      this.loadDashboardMetrics(),
      this.updateActivityFeed(),
    ]);
  }

  async loadAgentData() {
    try {
      const response = await this.apiCall("/characters");
      if (response && response.success) {
        this.renderCharacters(response.data);
      }
    } catch (error) {
      console.warn("Could not load agent data:", error);
    }
  }

  async loadSocialData() {
    try {
      const response = await this.apiCall("/social");
      if (response && response.success) {
        this.renderSocialPlatforms(response.data);
      }
    } catch (error) {
      console.warn("Could not load social data:", error);
    }
  }

  async loadAnalyticsData() {
    try {
      const response = await this.apiCall("/analytics?timeRange=24h");
      if (response && response.success) {
        this.renderAnalytics(response.data);
      }
    } catch (error) {
      console.warn("Could not load analytics data:", error);
    }
  }

  loadSettingsData() {
    // Load settings from localStorage
    const settings = this.getStoredSettings();
    this.applySettings(settings);
  }

  loadDocumentationData() {
    // Load documentation content
    this.renderDocumentation();
  }

  // Character Management
  selectCharacter(characterId) {
    // Update visual selection
    document.querySelectorAll(".character-card").forEach((card) => {
      card.classList.remove("active");
    });

    const selectedCard = document.querySelector(
      `[data-character="${characterId}"]`,
    );
    if (selectedCard) {
      selectedCard.classList.add("active");
    }

    // Save selection
    localStorage.setItem("selectedCharacter", characterId);

    this.addLogEntry("info", `Carácter AI cambiado a ${characterId}`);
  }

  renderCharacters(characters) {
    // Update character selection UI if needed
    characters.forEach((character) => {
      const card = document.querySelector(`[data-character="${character.id}"]`);
      if (card && character.active) {
        card.classList.add("active");
      }
    });
  }

  // Content Generation
  async generateAIContent() {
    try {
      const contentType =
        document.getElementById("contentType")?.value || "comment";
      const context = document.getElementById("contentContext")?.value || "";
      const character =
        localStorage.getItem("selectedCharacter") || "arcane-edge";

      if (!context.trim()) {
        this.addLogEntry(
          "warning",
          "Por favor proporciona un contexto para generar contenido",
        );
        return;
      }

      this.setLoading(true);
      this.addLogEntry("info", "Generando contenido con AI...");

      const response = await this.apiCall("/generate", "POST", {
        type: contentType,
        context: context,
        character: character,
      });

      if (response && response.success) {
        this.displayGeneratedContent(response.data.content);
        this.addLogEntry("success", "Contenido generado exitosamente");
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      this.addLogEntry("error", `Error generando contenido: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  displayGeneratedContent(content) {
    const contentOutput = document.getElementById("contentOutput");
    const generatedContentSection = document.getElementById("generatedContent");

    if (contentOutput && generatedContentSection) {
      contentOutput.textContent = content;
      generatedContentSection.style.display = "block";
    }
  }

  copyContent() {
    const contentOutput = document.getElementById("contentOutput");
    if (contentOutput) {
      navigator.clipboard
        .writeText(contentOutput.textContent)
        .then(() => {
          this.addLogEntry("success", "Contenido copiado al portapapeles");
        })
        .catch(() => {
          this.addLogEntry("error", "Error copiando contenido");
        });
    }
  }

  regenerateContent() {
    this.generateAIContent();
  }

  clearContentForm() {
    const contextField = document.getElementById("contentContext");
    if (contextField) {
      contextField.value = "";
    }

    const generatedSection = document.getElementById("generatedContent");
    if (generatedSection) {
      generatedSection.style.display = "none";
    }
  }

  // Platform Management
  toggleFeature(toggleElement) {
    toggleElement.classList.toggle("active");
    const isActive = toggleElement.classList.contains("active");

    // Find the feature name
    const featureItem = toggleElement.closest(".feature-item");
    const featureName = featureItem.querySelector("span").textContent;

    this.addLogEntry(
      "info",
      `${featureName} ${isActive ? "activado" : "desactivado"}`,
    );
  }

  renderSocialPlatforms(data) {
    // Update platform statistics
    if (data.platforms) {
      Object.keys(data.platforms).forEach((platform) => {
        const platformData = data.platforms[platform];
        // Update platform cards with real data
      });
    }
  }

  // Quick Actions
  generateContent() {
    this.showPage("agent");
    setTimeout(() => {
      const contextField = document.getElementById("contentContext");
      if (contextField) {
        contextField.focus();
      }
    }, 300);
  }

  async runAllAutomations() {
    try {
      this.setLoading(true);
      this.addLogEntry("info", "Ejecutando todas las automatizaciones...");

      // This would trigger all active automations
      const response = await this.apiCall(
        "/social/instagram/automation",
        "POST",
        {},
      );

      if (response && response.success) {
        this.addLogEntry("success", "Automatizaciones ejecutadas exitosamente");
      } else {
        throw new Error("Error ejecutando automatizaciones");
      }
    } catch (error) {
      this.addLogEntry("error", `Error en automatizaciones: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  // Analytics Rendering
  renderAnalytics(data) {
    if (data.metrics) {
      this.updateElement(
        "totalLikes",
        data.metrics.totalLikes?.toLocaleString() || "0",
      );
      this.updateElement(
        "totalComments",
        data.metrics.totalComments?.toLocaleString() || "0",
      );
      this.updateElement(
        "totalFollows",
        data.metrics.totalFollows?.toLocaleString() || "0",
      );
      this.updateElement("engagementRate", data.metrics.engagementRate || "0%");
    }
  }

  // Activity Log Management
  initializeActivityLog() {
    this.activityLog = [];
    this.addLogEntry("info", "Sistema Riona AI iniciado");
    this.addLogEntry("info", "Dashboard cargado completamente");
    this.updateActivityFeed();
  }

  addLogEntry(type, message) {
    const entry = {
      type: type,
      message: message,
      timestamp: new Date(),
    };

    this.activityLog.unshift(entry);

    // Keep only last 50 entries
    if (this.activityLog.length > 50) {
      this.activityLog = this.activityLog.slice(0, 50);
    }

    this.updateActivityFeed();
  }

  updateActivityFeed() {
    const feedElement = document.getElementById("activityFeed");
    if (!feedElement) return;

    if (this.activityLog.length === 0) {
      feedElement.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon info">
                        <i class="fas fa-info"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-message">No hay actividad reciente</div>
                        <div class="activity-time">Inicia una acción para ver la actividad</div>
                    </div>
                </div>
            `;
      return;
    }

    feedElement.innerHTML = this.activityLog
      .slice(0, 10)
      .map(
        (entry) => `
            <div class="activity-item">
                <div class="activity-icon ${entry.type}">
                    <i class="fas fa-${this.getActivityIcon(entry.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-message">${entry.message}</div>
                    <div class="activity-time">${this.formatTime(entry.timestamp)}</div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  getActivityIcon(type) {
    const icons = {
      info: "info-circle",
      success: "check-circle",
      warning: "exclamation-triangle",
      error: "times-circle",
    };
    return icons[type] || "info-circle";
  }

  formatTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;

    if (diff < 60000) return "Hace un momento";
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} minutos`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;

    return timestamp.toLocaleDateString();
  }

  // API Calls
  async apiCall(endpoint, method = "GET", data = null) {
    try {
      const url = `${this.apiBaseUrl}${endpoint}`;
      const options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(`Non-JSON response from ${endpoint}:`, text);
        throw new Error(
          `Expected JSON but got ${contentType || "unknown"} from ${endpoint}`,
        );
      }

      const text = await response.text();
      if (!text.trim()) {
        throw new Error(`Empty response from ${endpoint}`);
      }

      // Clean the response text - remove any trailing content after JSON
      let cleanText = text.trim();

      // Find the end of the JSON object/array
      let jsonEnd = -1;
      let braceCount = 0;
      let bracketCount = 0;
      let inString = false;
      let escaped = false;

      for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];

        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === "\\" && inString) {
          escaped = true;
          continue;
        }

        if (char === '"' && !escaped) {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === "{") braceCount++;
          else if (char === "}") braceCount--;
          else if (char === "[") bracketCount++;
          else if (char === "]") bracketCount--;

          if (
            braceCount === 0 &&
            bracketCount === 0 &&
            (char === "}" || char === "]")
          ) {
            jsonEnd = i + 1;
            break;
          }
        }
      }

      if (jsonEnd > 0 && jsonEnd < cleanText.length) {
        console.warn(
          `Trimming response from ${cleanText.length} to ${jsonEnd} characters`,
        );
        cleanText = cleanText.substring(0, jsonEnd);
      }

      try {
        return JSON.parse(cleanText);
      } catch (parseError) {
        // Try to find and extract just the JSON part
        const jsonMatch = cleanText.match(/\{.*\}|\[.*\]/);
        if (jsonMatch) {
          try {
            console.warn(`Using regex-extracted JSON for ${endpoint}`);
            return JSON.parse(jsonMatch[0]);
          } catch (regexParseError) {
            // Still failed, continue to error
          }
        }

        console.error(`JSON parse error for ${endpoint}:`, parseError);
        console.error("Response text length:", text.length);
        console.error("Cleaned text length:", cleanText.length);
        console.error(
          "Response text (first 200 chars):",
          text.substring(0, 200),
        );
        console.error(
          "Response text (last 50 chars):",
          text.substring(Math.max(0, text.length - 50)),
        );
        throw new Error(
          `Invalid JSON response from ${endpoint}: ${parseError.message}`,
        );
      }
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);

      // Only return mock data if server is not reachable
      if (
        error.message.includes("fetch") ||
        error.message.includes("NetworkError")
      ) {
        console.log(`Using mock data for ${endpoint} due to network error`);
        return this.getMockResponse(endpoint, method, data);
      }

      // Re-throw other errors
      throw error;
    }
  }

  getMockResponse(endpoint, method, data) {
    // Mock responses for development/offline mode
    const mockResponses = {
      "/health": {
        status: "healthy",
        uptime: Math.floor(Date.now() / 1000) % 86400,
        timestamp: new Date().toISOString(),
      },
      "/characters": {
        success: true,
        data: [
          { id: "arcane-edge", name: "ArcanEdge", active: true },
          { id: "elon", name: "Elon Style", active: false },
          { id: "sample", name: "General", active: false },
        ],
      },
      "/social": {
        success: true,
        data: {
          totalAccounts: 2,
          activeAutomations: 1,
          platforms: {
            instagram: { status: "active", configured: true },
          },
        },
      },
      "/analytics": {
        success: true,
        data: {
          metrics: {
            totalLikes: Math.floor(Math.random() * 1000) + 500,
            totalComments: Math.floor(Math.random() * 300) + 100,
            totalFollows: Math.floor(Math.random() * 200) + 50,
            engagementRate: (Math.random() * 5 + 3).toFixed(1),
          },
        },
      },
      "/generate": {
        success: true,
        data: {
          content:
            data?.type === "comment"
              ? `¡Increíble contenido! Me encanta este enfoque sobre ${data.context}. 🚀`
              : `Contenido generado para ${data.context} usando AI.`,
          type: data?.type || "comment",
          timestamp: new Date().toISOString(),
        },
      },
    };

    // Find matching mock response
    const mockKey = Object.keys(mockResponses).find((key) =>
      endpoint.includes(key),
    );
    return mockKey
      ? mockResponses[mockKey]
      : { success: false, error: "Mock endpoint not found" };
  }

  // Storage Management
  saveToStorage(key, data) {
    try {
      localStorage.setItem(`riona_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  getFromStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`riona_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  }

  // Users Management
  getStoredUsers() {
    return this.getFromStorage("users", [
      {
        id: 1,
        name: "Administrador",
        email: "admin@riona.ai",
        role: "admin",
        subscription: "enterprise",
        status: "active",
        created: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    ]);
  }

  saveUser(user) {
    const users = this.getStoredUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      user.id = Date.now();
      user.created = new Date().toISOString();
      users.push(user);
    }

    this.saveToStorage("users", users);
    return user;
  }

  // Accounts Management
  getStoredAccounts() {
    return this.getFromStorage("accounts", []);
  }

  saveAccount(account) {
    const accounts = this.getStoredAccounts();
    const existingIndex = accounts.findIndex((a) => a.id === account.id);

    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...accounts[existingIndex], ...account };
    } else {
      account.id = Date.now();
      account.created = new Date().toISOString();
      account.status = "active";
      accounts.push(account);
    }

    this.saveToStorage("accounts", accounts);
    this.updateActiveAccountsCount();
    return account;
  }

  updateActiveAccountsCount() {
    const accounts = this.getStoredAccounts();
    const activeCount = accounts.filter(
      (acc) => acc.status === "active",
    ).length;
    this.updateElement("activeAccounts", activeCount);
  }

  // Analytics Storage
  saveAnalyticsData(data) {
    const analytics = this.getFromStorage("analytics", {});
    const today = new Date().toISOString().split("T")[0];

    analytics[today] = {
      ...analytics[today],
      ...data,
      timestamp: new Date().toISOString(),
    };

    this.saveToStorage("analytics", analytics);
  }

  getAnalyticsData(days = 30) {
    const analytics = this.getFromStorage("analytics", {});
    const dates = Object.keys(analytics).sort().slice(-days);
    return dates.map((date) => analytics[date]);
  }

  // Settings Management
  getStoredSettings() {
    return this.getFromStorage("settings", this.getDefaultSettings());
  }

  saveSettings(settings) {
    const currentSettings = this.getStoredSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    this.saveToStorage("settings", updatedSettings);
    this.applySettings(updatedSettings);
    return updatedSettings;
  }

  getDefaultSettings() {
    return {
      selectedCharacter: "arcane-edge",
      theme: "light",
      autoRefresh: true,
      refreshInterval: 30000,
      notifications: true,
      language: "es",
      automationSettings: {
        likesPerHour: 30,
        commentsPerHour: 10,
        followsPerHour: 15,
        hashtags: ["#ai", "#technology", "#innovation"],
      },
    };
  }

  applySettings(settings) {
    // Apply character selection
    if (settings.selectedCharacter) {
      this.selectCharacter(settings.selectedCharacter);
    }

    // Apply other settings
    if (settings.autoRefresh && this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.startAutoRefresh(settings.refreshInterval);
    }
  }

  // Utility Functions
  updateElement(id, value, property = "textContent") {
    const element = document.getElementById(id);
    if (element) {
      if (property === "textContent") {
        element.textContent = value;
      } else {
        element[property] = value;
      }
    }
  }

  updateUptime(seconds) {
    if (!seconds || isNaN(seconds) || seconds < 0) {
      this.updateElement("systemUptime", "0h 0m");
      return;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    this.updateElement("systemUptime", `${hours}h ${minutes}m`);
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;

    // Update loading states in UI
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      const icon = refreshBtn.querySelector("i");
      if (icon) {
        if (isLoading) {
          icon.classList.add("fa-spin");
        } else {
          icon.classList.remove("fa-spin");
        }
      }
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (sidebar) {
      const isActive = sidebar.classList.toggle("active");

      // Create overlay if it doesn't exist
      if (!overlay && window.innerWidth <= 1024) {
        const newOverlay = document.createElement("div");
        newOverlay.className = "sidebar-overlay";
        newOverlay.addEventListener("click", () => this.closeSidebar());
        document.body.appendChild(newOverlay);
      }

      // Toggle overlay for mobile
      if (window.innerWidth <= 1024) {
        const currentOverlay = document.querySelector(".sidebar-overlay");
        if (currentOverlay) {
          currentOverlay.classList.toggle("active", isActive);
        }
      }
    }
  }

  closeSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    if (sidebar) {
      sidebar.classList.remove("active");
    }
    if (overlay) {
      overlay.classList.remove("active");
    }
  }

  refreshCurrentPage() {
    this.addLogEntry("info", "Actualizando datos...");
    this.loadPageData(this.currentPage);
  }

  // Auto-refresh functionality
  startAutoRefresh(interval = 30000) {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }

    this.autoRefreshInterval = setInterval(() => {
      if (this.currentPage === "dashboard") {
        this.loadDashboardMetrics();
      }
    }, interval);
  }

  // Keyboard shortcuts
  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "1":
          e.preventDefault();
          this.showPage("dashboard");
          break;
        case "2":
          e.preventDefault();
          this.showPage("agent");
          break;
        case "3":
          e.preventDefault();
          this.showPage("social");
          break;
        case "4":
          e.preventDefault();
          this.showPage("automation");
          break;
        case "5":
          e.preventDefault();
          this.showPage("analytics");
          break;
        case "r":
          e.preventDefault();
          this.refreshCurrentPage();
          break;
      }
    }
  }

  // Responsive handling
  handleResize() {
    const width = window.innerWidth;

    if (width <= 1024) {
      // Mobile/tablet adjustments
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && !sidebar.classList.contains("active")) {
        // Auto-hide sidebar on mobile
      }
    }
  }

  // Documentation rendering
  renderDocumentation() {
    const docsMain = document.getElementById("docsMain");
    if (docsMain) {
      docsMain.innerHTML = `
                <div class="docs-section">
                    <h2>Bienvenido a Riona AI Agent</h2>
                    <p>Sistema completo de automatización para redes sociales con inteligencia artificial.</p>

                    <h3>Características Principales</h3>
                    <ul>
                        <li><strong>Automatización de Instagram:</strong> Likes, comentarios, follows y mensajes directos automáticos</li>
                        <li><strong>AI Generativa:</strong> Contenido contextual usando Google Gemini 2.0</li>
                        <li><strong>Multi-Usuario:</strong> Gestión de múltiples usuarios y cuentas</li>
                        <li><strong>Analytics:</strong> Métricas detalladas y reportes en tiempo real</li>
                        <li><strong>Anti-Detección:</strong> Técnicas avanzadas para evitar restricciones</li>
                    </ul>

                    <h3>Primeros Pasos</h3>
                    <ol>
                        <li>Ve a <strong>Automatización</strong> para agregar tu primera cuenta de Instagram</li>
                        <li>Configura los hashtags objetivo en <strong>Configuración</strong></li>
                        <li>Ajusta la personalidad del AI en <strong>Agente AI</strong></li>
                        <li>Ejecuta las automatizaciones desde <strong>Redes Sociales</strong></li>
                        <li>Monitorea el rendimiento en <strong>Analíticas</strong></li>
                    </ol>

                    <h3>Seguridad</h3>
                    <p>Todas las credenciales se almacenan de forma segura y encriptada. El sistema respeta los límites de Instagram para evitar restricciones.</p>
                </div>
            `;
    }
  }

  // Debug functionality
  async runDebugTest() {
    console.log("🔧 Running API Debug Test...");
    this.addLogEntry("info", "Ejecutando test de debugging API...");

    const endpoints = [
      "/api/health",
      "/api/users",
      "/api/accounts",
      "/api/social",
    ];

    let successCount = 0;
    let totalCount = endpoints.length;

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint}...`);
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        console.log(
          `✅ ${endpoint}: Status ${response.status}, Length ${text.length}`,
        );

        // Try to parse JSON
        try {
          const parsed = JSON.parse(text);
          console.log(`Content preview:`, Object.keys(parsed));
          this.addLogEntry(
            "success",
            `${endpoint} - OK (${text.length} chars)`,
          );
          successCount++;
        } catch (parseError) {
          console.log(
            `Content (first 100 chars): ${text.substring(0, 100)}...`,
          );
          this.addLogEntry(
            "warning",
            `${endpoint} - Response not JSON: ${parseError.message}`,
          );
        }
      } catch (error) {
        console.error(`❌ ${endpoint}: ${error.message}`);
        this.addLogEntry("error", `${endpoint} - Error: ${error.message}`);
      }
    }

    const summary = `Test completado: ${successCount}/${totalCount} endpoints OK`;
    console.log(`🔧 ${summary}`);
    this.addLogEntry("info", summary);

    // Also test localStorage
    this.testLocalStorage();
  }

  testLocalStorage() {
    try {
      // Test localStorage functionality
      const testData = { test: "data", timestamp: Date.now() };
      this.saveToStorage("test", testData);
      const retrieved = this.getFromStorage("test");

      if (JSON.stringify(testData) === JSON.stringify(retrieved)) {
        this.addLogEntry("success", "LocalStorage funcionando correctamente");
      } else {
        this.addLogEntry("error", "LocalStorage error en datos");
      }

      // Clean up test data
      localStorage.removeItem("riona_test");

      // Show current data counts
      const users = this.getStoredUsers();
      const accounts = this.getStoredAccounts();
      this.addLogEntry(
        "info",
        `Datos: ${users.length} usuarios, ${accounts.length} cuentas`,
      );
    } catch (error) {
      this.addLogEntry("error", `Error en LocalStorage: ${error.message}`);
    }
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new RionaAIDashboard();
  console.log("🚀 Riona AI Agent Dashboard initialized successfully");
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = RionaAIDashboard;
}
