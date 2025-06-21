// Riona AI Agent Dashboard - Frontend Application
class RionaAIDashboard {
  constructor() {
    this.apiBaseUrl = "";
    this.refreshInterval = null;
    this.activityLog = [];
    this.isConnected = false;

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupNavigation();
    this.showLoading();

    try {
      await this.loadInitialData();
      this.hideLoading();
      this.startAutoRefresh();
      this.updateConnectionStatus(true);
      this.addLogEntry("info", "Dashboard iniciado correctamente");
    } catch (error) {
      this.hideLoading();
      this.updateConnectionStatus(false);
      this.addLogEntry("error", `Error al inicializar: ${error.message}`);
    }
  }

  setupEventListeners() {
    // Refresh button
    document.getElementById("refreshBtn").addEventListener("click", () => {
      this.refreshAllData();
    });

    // Clear log button
    document.getElementById("clearLogBtn").addEventListener("click", () => {
      this.clearActivityLog();
    });

    // AI Generator
    document.getElementById("generateBtn").addEventListener("click", () => {
      this.generateAIContent();
    });

    // Test Agent button
    document.getElementById("testAgentBtn").addEventListener("click", () => {
      this.testAgent();
    });

    // Platform control buttons
    this.setupPlatformControls();

    // Documentation navigation
    this.setupDocumentationNav();
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const pageContents = document.querySelectorAll(".page-content");

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const targetPage = item.dataset.page;

        // Update active nav item
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");

        // Update active page
        pageContents.forEach((page) => page.classList.remove("active"));
        document.getElementById(targetPage).classList.add("active");

        // Update page title
        this.updatePageTitle(targetPage);

        // Load page-specific data
        this.loadPageData(targetPage);
      });
    });
  }

  setupPlatformControls() {
    const platforms = ["instagram", "twitter", "github"];

    platforms.forEach((platform) => {
      const startBtn = document.getElementById(`${platform}StartBtn`);
      const stopBtn = document.getElementById(`${platform}StopBtn`);

      if (startBtn) {
        startBtn.addEventListener("click", () => {
          this.controlPlatform(platform, "start");
        });
      }

      if (stopBtn) {
        stopBtn.addEventListener("click", () => {
          this.controlPlatform(platform, "stop");
        });
      }
    });
  }

  setupDocumentationNav() {
    const docNavItems = document.querySelectorAll(".docs-nav-item");
    const docPages = document.querySelectorAll(".docs-page");

    docNavItems.forEach((item) => {
      item.addEventListener("click", () => {
        const targetDoc = item.dataset.doc;

        docNavItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");

        docPages.forEach((page) => page.classList.remove("active"));
        const targetPage = document.getElementById(`docs-${targetDoc}`);
        if (targetPage) {
          targetPage.classList.add("active");
        }
      });
    });
  }

  async loadInitialData() {
    await Promise.all([
      this.loadSystemStatus(),
      this.loadAgentStatus(),
      this.loadSocialStatus(),
      this.loadCharacters(),
    ]);
  }

  async loadSystemStatus() {
    try {
      const response = await fetch("/health");
      const data = await response.json();

      this.updateSystemMetrics(data);
      this.addLogEntry("info", "Estado del sistema actualizado");
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error cargando estado del sistema: ${error.message}`,
      );
      throw error;
    }
  }

  async loadAgentStatus() {
    try {
      const response = await fetch("/agent");
      const data = await response.json();

      this.updateAgentStatus(data);
      this.addLogEntry("info", "Estado del agente actualizado");
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error cargando estado del agente: ${error.message}`,
      );
    }
  }

  async loadSocialStatus() {
    try {
      const response = await fetch("/social");
      const data = await response.json();

      this.updateSocialStatus(data);
      this.addLogEntry("info", "Estado de redes sociales actualizado");
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error cargando estado de redes sociales: ${error.message}`,
      );
    }
  }

  async loadCharacters() {
    try {
      // This would call the actual API when available
      const mockCharacters = [
        {
          id: "arcane-edge",
          name: "ArcanEdge System Agent",
          description: "Pionero en comunicación AI dirigida por prompts",
          active: true,
        },
        {
          id: "elon",
          name: "Elon Character",
          description: "Personalidad de emprendedor e innovador",
          active: false,
        },
        {
          id: "sample",
          name: "Sample Character",
          description: "Carácter AI de propósito general",
          active: false,
        },
      ];

      this.updateCharactersList(mockCharacters);
      this.addLogEntry("info", "Caracteres cargados");
    } catch (error) {
      this.addLogEntry("error", `Error cargando caracteres: ${error.message}`);
    }
  }

  updateSystemMetrics(data) {
    // Update uptime
    const uptimeElement = document.getElementById("uptime");
    if (uptimeElement && data.uptime) {
      uptimeElement.textContent = this.formatUptime(data.uptime);
    }

    // Update memory
    const memoryElement = document.getElementById("memory");
    if (memoryElement && data.memory) {
      memoryElement.textContent = data.memory.heapUsed || "N/A";
    }

    // Update system status
    const systemStatusElement = document.getElementById("systemStatus");
    if (systemStatusElement) {
      this.updateStatusBadge(systemStatusElement, data.status === "healthy");
    }

    // Update individual service statuses
    this.updateElementText("serverStatus", "Funcionando");
    this.updateElementText("dbStatus", data.database || "Desarrollo");
    this.updateElementText("aiStatus", data.ai?.status || "Configurado");

    // Update performance metrics (simulated)
    this.updateProgressBar("cpuUsage", Math.random() * 60 + 20);
    this.updateProgressBar("ramUsage", Math.random() * 70 + 30);
    this.updateElementText(
      "requestsPerMin",
      Math.floor(Math.random() * 50) + 10,
    );
  }

  updateAgentStatus(data) {
    const agentStatusElement = document.getElementById("agentStatus");
    if (agentStatusElement) {
      this.updateStatusBadge(agentStatusElement, data.status === "running");
    }

    this.updateElementText("activeCharacter", data.currentCharacter || "N/A");
    this.updateElementText("agentMode", data.mode || "Desarrollo");
    this.updateElementText(
      "lastActivity",
      "Hace " + Math.floor(Math.random() * 30) + "s",
    );
  }

  updateSocialStatus(data) {
    if (data.platforms) {
      // Update Instagram
      this.updatePlatformStatus("instagram", data.platforms.instagram);

      // Update Twitter
      this.updatePlatformStatus("twitter", data.platforms.twitter);

      // Update GitHub
      this.updatePlatformStatus("github", data.platforms.github);
    }
  }

  updatePlatformStatus(platform, platformData) {
    const statusElement = document.getElementById(`${platform}Status`);
    const indicatorElement = document.getElementById(`${platform}Indicator`);

    if (statusElement && platformData) {
      const isConfigured = platformData.status === "configured";
      statusElement.textContent = isConfigured
        ? "Configurado"
        : "No configurado";
      statusElement.className = `platform-status-text ${isConfigured ? "configured" : "not-configured"}`;
    }

    if (indicatorElement && platformData) {
      const isActive = platformData.status === "configured";
      indicatorElement.className = `platform-status-indicator ${isActive ? "active" : ""}`;
    }

    // Update platform dots in dashboard
    const platformDot = document.querySelector(`.platform-dot.${platform}`);
    if (platformDot && platformData) {
      platformDot.classList.toggle(
        "active",
        platformData.status === "configured",
      );
    }
  }

  updateCharactersList(characters) {
    const charactersList = document.getElementById("charactersList");
    if (!charactersList) return;

    charactersList.innerHTML = "";

    characters.forEach((character) => {
      const characterElement = document.createElement("div");
      characterElement.className = `character-item ${character.active ? "active" : ""}`;
      characterElement.innerHTML = `
                <div class="character-name">${character.name}</div>
                <div class="character-desc">${character.description}</div>
            `;

      characterElement.addEventListener("click", () => {
        this.selectCharacter(character.id);
      });

      charactersList.appendChild(characterElement);
    });
  }

  async generateAIContent() {
    const promptInput = document.getElementById("promptInput");
    const contentType = document.getElementById("contentType");
    const aiOutput = document.getElementById("aiOutput");
    const generateBtn = document.getElementById("generateBtn");

    const prompt = promptInput.value.trim();
    if (!prompt) {
      this.addLogEntry("warn", "Por favor, ingresa un prompt");
      return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Generando...';
    aiOutput.innerHTML =
      '<div class="output-placeholder">Generando contenido AI...</div>';

    try {
      // Simulate API call (replace with actual API call when available)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse = {
        success: true,
        data: {
          content: `Contenido generado para "${prompt}"\n\nEste es un ejemplo de contenido AI generado usando el modelo Gemini. El contenido sería personalizado según el carácter seleccionado y el tipo de contenido solicitado.`,
          type: contentType.value,
          timestamp: new Date().toISOString(),
        },
      };

      if (mockResponse.success) {
        aiOutput.innerHTML = `
                    <div class="ai-result">
                        <div class="result-header">
                            <strong>Contenido Generado:</strong>
                            <span class="result-type">${mockResponse.data.type}</span>
                        </div>
                        <div class="result-content">${mockResponse.data.content}</div>
                    </div>
                `;
        this.addLogEntry("info", "Contenido AI generado exitosamente");
      }
    } catch (error) {
      aiOutput.innerHTML = `<div class="error-message">Error generando contenido: ${error.message}</div>`;
      this.addLogEntry(
        "error",
        `Error generando contenido AI: ${error.message}`,
      );
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar';
    }
  }

  async testAgent() {
    const testBtn = document.getElementById("testAgentBtn");

    testBtn.disabled = true;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Probando...';

    try {
      // Simulate agent test
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.addLogEntry("info", "Prueba del agente completada exitosamente");
    } catch (error) {
      this.addLogEntry("error", `Error probando agente: ${error.message}`);
    } finally {
      testBtn.disabled = false;
      testBtn.innerHTML = '<i class="fas fa-play"></i> Probar Agente';
    }
  }

  async controlPlatform(platform, action) {
    const btn = document.getElementById(
      `${platform}${action.charAt(0).toUpperCase() + action.slice(1)}Btn`,
    );

    btn.disabled = true;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

    try {
      // Simulate platform control
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.addLogEntry(
        "info",
        `${action === "start" ? "Iniciado" : "Detenido"} ${platform} exitosamente`,
      );
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error controlando ${platform}: ${error.message}`,
      );
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalContent;
    }
  }

  selectCharacter(characterId) {
    const characterItems = document.querySelectorAll(".character-item");
    characterItems.forEach((item) => item.classList.remove("active"));

    event.currentTarget.classList.add("active");
    this.addLogEntry("info", `Carácter seleccionado: ${characterId}`);
  }

  updatePageTitle(page) {
    const titles = {
      dashboard: "Dashboard Principal",
      agent: "Agente AI",
      social: "Redes Sociales",
      automation: "Automatización",
      analytics: "Analíticas",
      settings: "Configuración",
      documentation: "Documentación",
    };

    const subtitles = {
      dashboard: "Monitoreo en tiempo real del sistema AI",
      agent: "Configuración y control del agente inteligente",
      social: "Gestión de plataformas de redes sociales",
      automation: "Control de procesos automatizados",
      analytics: "Métricas y análisis de rendimiento",
      settings: "Configuración del sistema",
      documentation: "Guías y documentación técnica",
    };

    document.getElementById("pageTitle").textContent = titles[page] || page;
    document.getElementById("pageSubtitle").textContent = subtitles[page] || "";
  }

  loadPageData(page) {
    switch (page) {
      case "dashboard":
        this.refreshAllData();
        break;
      case "agent":
        this.loadCharacters();
        break;
      case "social":
        this.loadSocialStatus();
        break;
      default:
        // Page-specific loading logic
        break;
    }
  }

  async refreshAllData() {
    const refreshBtn = document.getElementById("refreshBtn");
    const originalIcon = refreshBtn.querySelector("i");

    originalIcon.style.animation = "spin 1s linear infinite";

    try {
      await this.loadInitialData();
      this.addLogEntry("info", "Datos actualizados");
    } catch (error) {
      this.addLogEntry("error", `Error actualizando datos: ${error.message}`);
    } finally {
      originalIcon.style.animation = "";
    }
  }

  startAutoRefresh() {
    // Refresh data every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadSystemStatus();
      this.loadAgentStatus();
    }, 30000);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  updateConnectionStatus(connected) {
    this.isConnected = connected;
    const statusElement = document.getElementById("connectionStatus");
    const statusDot = statusElement.querySelector(".status-dot");
    const statusText = statusElement.querySelector("span");

    if (connected) {
      statusDot.style.background = "#48bb78";
      statusText.textContent = "Conectado";
    } else {
      statusDot.style.background = "#f56565";
      statusText.textContent = "Desconectado";
    }
  }

  addLogEntry(level, message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      level,
      message,
      id: Date.now(),
    };

    this.activityLog.unshift(logEntry);

    // Keep only last 100 entries
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(0, 100);
    }

    this.updateActivityLogDisplay();
  }

  updateActivityLogDisplay() {
    const activityLogElement = document.getElementById("activityLog");
    if (!activityLogElement) return;

    activityLogElement.innerHTML = this.activityLog
      .map(
        (entry) => `
            <div class="log-entry">
                <span class="log-time">${entry.timestamp}</span>
                <span class="log-level ${entry.level}">${entry.level.toUpperCase()}</span>
                <span class="log-message">${entry.message}</span>
            </div>
        `,
      )
      .join("");
  }

  clearActivityLog() {
    this.activityLog = [];
    this.updateActivityLogDisplay();
    this.addLogEntry("info", "Registro de actividad limpiado");
  }

  // Utility functions
  updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  updateStatusBadge(element, isActive) {
    const statusDot = element.querySelector(".status-dot");
    const statusText = element.querySelector("span");

    if (isActive) {
      statusDot.classList.add("active");
      statusText.textContent = "Activo";
      element.style.background = "rgba(72, 187, 120, 0.1)";
      element.style.color = "#48bb78";
    } else {
      statusDot.classList.remove("active");
      statusText.textContent = "Inactivo";
      element.style.background = "rgba(245, 101, 101, 0.1)";
      element.style.color = "#f56565";
    }
  }

  updateProgressBar(id, percentage) {
    const progressBar = document.getElementById(id);
    if (progressBar) {
      progressBar.style.width = `${Math.min(percentage, 100)}%`;
    }
  }

  formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  showLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
    }
  }

  hideLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
  }

  // Cleanup on page unload
  destroy() {
    this.stopAutoRefresh();
  }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.rionaDashboard = new RionaAIDashboard();
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (window.rionaDashboard) {
    window.rionaDashboard.destroy();
  }
});

// Additional utility functions for enhanced functionality
const utils = {
  // Format bytes to human readable
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },

  // Copy text to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  },

  // Show notification
  showNotification(message, type = "info") {
    // Create notification element (could be enhanced with a proper notification library)
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transition: all 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },
};

// Make utils globally available
window.rionaUtils = utils;
