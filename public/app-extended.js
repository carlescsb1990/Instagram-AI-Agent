// Complete Extended Dashboard for Riona AI Agent
class ExtendedDashboard extends RionaAIDashboard {
  constructor() {
    super();
    this.users = [];
    this.accounts = [];
    this.analyticsData = {
      totalLikes: 0,
      totalComments: 0,
      totalFollows: 0,
      engagementRate: 0,
    };
    this.charts = {};
    this.automationStatus = {};
    this.setupExtendedEventListeners();
    this.initializeCharts();
  }

  setupExtendedEventListeners() {
    // User management
    const addUserBtn = document.getElementById("addUserBtn");
    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => this.showAddUserModal());
    }

    const addAccountBtn = document.getElementById("addAccountBtn");
    if (addAccountBtn) {
      addAccountBtn.addEventListener("click", () => this.showAddAccountModal());
    }

    // Modal controls
    this.setupModalControls();

    // Form submissions
    const addUserForm = document.getElementById("addUserForm");
    if (addUserForm) {
      addUserForm.addEventListener("submit", (e) => this.handleAddUser(e));
    }

    const addAccountForm = document.getElementById("addAccountForm");
    if (addAccountForm) {
      addAccountForm.addEventListener("submit", (e) =>
        this.handleAddAccount(e),
      );
    }

    // Settings
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", () => this.saveSettings());
    }

    // Analytics
    const analyticsTimeRange = document.getElementById("analyticsTimeRange");
    if (analyticsTimeRange) {
      analyticsTimeRange.addEventListener("change", (e) =>
        this.loadAnalytics(e.target.value),
      );
    }

    // Backup
    const backupNowBtn = document.getElementById("backupNowBtn");
    if (backupNowBtn) {
      backupNowBtn.addEventListener("click", () => this.createBackup());
    }

    // Global automation controls
    const autoLikeGlobal = document.getElementById("autoLikeGlobal");
    if (autoLikeGlobal) {
      autoLikeGlobal.addEventListener("change", (e) =>
        this.updateGlobalSetting("autoLike", e.target.checked),
      );
    }

    const autoCommentGlobal = document.getElementById("autoCommentGlobal");
    if (autoCommentGlobal) {
      autoCommentGlobal.addEventListener("change", (e) =>
        this.updateGlobalSetting("autoComment", e.target.checked),
      );
    }

    const autoFollowGlobal = document.getElementById("autoFollowGlobal");
    if (autoFollowGlobal) {
      autoFollowGlobal.addEventListener("change", (e) =>
        this.updateGlobalSetting("autoFollow", e.target.checked),
      );
    }

    // Real-time updates
    setInterval(() => this.updateRealTimeData(), 30000); // Update every 30 seconds
  }

  setupModalControls() {
    // User modal
    const userModal = document.getElementById("addUserModal");
    const accountModal = document.getElementById("addAccountModal");

    if (userModal) {
      const closeUserModal = document.getElementById("closeUserModal");
      const cancelUserBtn = document.getElementById("cancelUserBtn");

      if (closeUserModal) {
        closeUserModal.addEventListener("click", () =>
          userModal.classList.remove("active"),
        );
      }
      if (cancelUserBtn) {
        cancelUserBtn.addEventListener("click", () =>
          userModal.classList.remove("active"),
        );
      }

      userModal.addEventListener("click", (e) => {
        if (e.target === userModal) {
          userModal.classList.remove("active");
        }
      });
    }

    if (accountModal) {
      const closeAccountModal = document.getElementById("closeAccountModal");
      const cancelAccountBtn = document.getElementById("cancelAccountBtn");

      if (closeAccountModal) {
        closeAccountModal.addEventListener("click", () =>
          accountModal.classList.remove("active"),
        );
      }
      if (cancelAccountBtn) {
        cancelAccountBtn.addEventListener("click", () =>
          accountModal.classList.remove("active"),
        );
      }

      accountModal.addEventListener("click", (e) => {
        if (e.target === accountModal) {
          accountModal.classList.remove("active");
        }
      });
    }
  }

  async loadPageData(page) {
    await super.loadPageData(page);

    switch (page) {
      case "automation":
        await this.loadUsers();
        await this.loadAccounts();
        this.loadAutomationSettings();
        break;
      case "analytics":
        await this.loadAnalytics("24h");
        break;
      case "settings":
        this.loadSettings();
        break;
      case "dashboard":
        await this.loadDashboardData();
        break;
      case "social":
        await this.loadSocialPlatforms();
        break;
    }
  }

  // User Management
  async loadUsers() {
    try {
      const response = await this.apiCall("/api/users");
      if (response.success) {
        this.users = response.data;
        this.renderUsers();
        this.updateUserSelect();
        this.addLogEntry("info", `Cargados ${response.data.length} usuarios`);
      }
    } catch (error) {
      this.addLogEntry("error", `Error cargando usuarios: ${error.message}`);
      // Use mock data if API fails
      this.users = this.getMockUsers();
      this.renderUsers();
      this.updateUserSelect();
    }
  }

  getMockUsers() {
    return [
      {
        _id: "1",
        name: "Admin User",
        email: "admin@riona.ai",
        role: "admin",
        subscription: { plan: "enterprise", accountsLimit: 999 },
        instagramAccounts: [],
        createdAt: new Date("2024-01-15"),
      },
      {
        _id: "2",
        name: "Demo User",
        email: "demo@riona.ai",
        role: "user",
        subscription: { plan: "basic", accountsLimit: 5 },
        instagramAccounts: [],
        createdAt: new Date("2024-01-20"),
      },
    ];
  }

  renderUsers() {
    const usersGrid = document.getElementById("usersGrid");
    if (!usersGrid) return;

    usersGrid.innerHTML = this.users
      .map(
        (user) => `
            <div class="user-card">
                <div class="user-header">
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                        <span class="role-badge ${user.role}">${user.role}</span>
                    </div>
                    <div class="subscription-badge ${user.subscription.plan}">
                        ${user.subscription.plan}
                    </div>
                </div>
                
                <div class="user-stats">
                    <div class="stat-box">
                        <span class="stat-number">${user.instagramAccounts ? user.instagramAccounts.length : 0}</span>
                        <span class="stat-label">Cuentas IG</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${user.subscription.accountsLimit}</span>
                        <span class="stat-label">Límite</span>
                    </div>
                </div>
                
                <div class="user-actions">
                    <button class="action-btn secondary" onclick="dashboard.editUser('${user._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="action-btn primary" onclick="dashboard.viewUserAccounts('${user._id}')">
                        <i class="fas fa-eye"></i> Ver Cuentas
                    </button>
                    <button class="action-btn danger" onclick="dashboard.deleteUser('${user._id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `,
      )
      .join("");
  }

  updateUserSelect() {
    const selectUser = document.getElementById("selectUser");
    if (!selectUser) return;

    selectUser.innerHTML =
      '<option value="">Seleccionar...</option>' +
      this.users
        .map(
          (user) =>
            `<option value="${user._id}">${user.name} (${user.email})</option>`,
        )
        .join("");
  }

  // Account Management
  async loadAccounts() {
    try {
      const response = await this.apiCall("/api/accounts");
      if (response.success) {
        this.accounts = response.data;
        this.renderAccounts();
        this.addLogEntry(
          "info",
          `Cargadas ${response.data.length} cuentas de Instagram`,
        );
      }
    } catch (error) {
      this.addLogEntry("error", `Error cargando cuentas: ${error.message}`);
      // Use mock data
      this.accounts = this.getMockAccounts();
      this.renderAccounts();
    }
  }

  getMockAccounts() {
    return [
      {
        _id: "1",
        username: "@demo_account_1",
        userName: "Demo User",
        isActive: true,
        stats: {
          followers: 1542,
          following: 823,
          posts: 156,
          engagement: 4.2,
        },
        settings: {
          autoLike: true,
          autoComment: true,
          autoFollow: false,
          maxLikesPerHour: 60,
          targetHashtags: ["technology", "AI"],
        },
        lastActivity: new Date(),
      },
      {
        _id: "2",
        username: "@growth_account",
        userName: "Admin User",
        isActive: true,
        stats: {
          followers: 3247,
          following: 1456,
          posts: 289,
          engagement: 6.8,
        },
        settings: {
          autoLike: true,
          autoComment: true,
          autoFollow: true,
          maxLikesPerHour: 90,
          targetHashtags: ["startup", "business", "marketing"],
        },
        lastActivity: new Date(Date.now() - 300000),
      },
    ];
  }

  renderAccounts() {
    const accountsGrid = document.getElementById("accountsGrid");
    if (!accountsGrid) return;

    accountsGrid.innerHTML = this.accounts
      .map(
        (account) => `
            <div class="account-card">
                <div class="account-header">
                    <div class="account-info">
                        <h4>${account.username}</h4>
                        <p>Usuario: ${account.userName}</p>
                        <div class="account-status ${account.isActive ? "active" : "inactive"}">
                            ${account.isActive ? "Activa" : "Inactiva"}
                        </div>
                    </div>
                    <div class="account-controls">
                        <button class="toggle-btn ${account.isActive ? "active" : ""}" 
                                onclick="dashboard.toggleAccount('${account._id}')">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                </div>

                <div class="account-stats">
                    <div class="stat-box">
                        <span class="stat-number">${account.stats.followers.toLocaleString()}</span>
                        <span class="stat-label">Seguidores</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${account.stats.engagement}%</span>
                        <span class="stat-label">Engagement</span>
                    </div>
                </div>

                <div class="automation-settings">
                    <div class="setting-row">
                        <label>
                            <input type="checkbox" ${account.settings.autoLike ? "checked" : ""} 
                                   onchange="dashboard.updateAccountSetting('${account._id}', 'autoLike', this.checked)">
                            Auto Likes (${account.settings.maxLikesPerHour}/h)
                        </label>
                    </div>
                    <div class="setting-row">
                        <label>
                            <input type="checkbox" ${account.settings.autoComment ? "checked" : ""} 
                                   onchange="dashboard.updateAccountSetting('${account._id}', 'autoComment', this.checked)">
                            Auto Comentarios
                        </label>
                    </div>
                    <div class="setting-row">
                        <label>
                            <input type="checkbox" ${account.settings.autoFollow ? "checked" : ""} 
                                   onchange="dashboard.updateAccountSetting('${account._id}', 'autoFollow', this.checked)">
                            Auto Follows
                        </label>
                    </div>
                </div>

                <div class="hashtags-display">
                    <small>Hashtags: ${account.settings.targetHashtags.join(", ") || "Ninguno"}</small>
                </div>

                <div class="account-actions">
                    <button class="action-btn primary" onclick="dashboard.runAutomation('${account._id}')">
                        <i class="fas fa-play"></i> Ejecutar
                    </button>
                    <button class="action-btn secondary" onclick="dashboard.editAccount('${account._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="action-btn info" onclick="dashboard.viewAccountStats('${account._id}')">
                        <i class="fas fa-chart-bar"></i> Stats
                    </button>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Analytics
  async loadAnalytics(timeRange = "24h") {
    try {
      const response = await this.apiCall(
        `/api/analytics?timeRange=${timeRange}`,
      );
      if (response.success) {
        this.analyticsData = response.data;
        this.updateAnalyticsDisplay();
        this.updateCharts();
        this.addLogEntry("info", `Analytics cargados para ${timeRange}`);
      }
    } catch (error) {
      this.addLogEntry("error", `Error cargando analytics: ${error.message}`);
      // Use mock data
      this.analyticsData = this.getMockAnalytics(timeRange);
      this.updateAnalyticsDisplay();
      this.updateCharts();
    }
  }

  getMockAnalytics(timeRange) {
    const multiplier = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30;
    return {
      timeRange,
      metrics: {
        totalLikes: Math.floor(Math.random() * 500 * multiplier) + 100,
        totalComments: Math.floor(Math.random() * 150 * multiplier) + 50,
        totalFollows: Math.floor(Math.random() * 100 * multiplier) + 20,
        engagementRate: (Math.random() * 5 + 3).toFixed(2),
      },
      hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        follows: Math.floor(Math.random() * 10),
      })),
      hashtagPerformance: [
        { hashtag: "technology", engagement: 85, posts: 45 },
        { hashtag: "AI", engagement: 92, posts: 38 },
        { hashtag: "programming", engagement: 78, posts: 52 },
        { hashtag: "startup", engagement: 67, posts: 29 },
        { hashtag: "business", engagement: 73, posts: 34 },
      ],
      accountPerformance: this.accounts.map((account) => ({
        username: account.username,
        followers: account.stats.followers,
        engagement: account.stats.engagement,
        isActive: account.isActive,
        lastActivity: account.lastActivity,
      })),
    };
  }

  updateAnalyticsDisplay() {
    // Update metric cards
    this.updateElement(
      "totalLikes",
      this.analyticsData.metrics.totalLikes.toLocaleString(),
    );
    this.updateElement(
      "totalComments",
      this.analyticsData.metrics.totalComments.toLocaleString(),
    );
    this.updateElement(
      "totalFollows",
      this.analyticsData.metrics.totalFollows.toLocaleString(),
    );
    this.updateElement(
      "engagementRate",
      this.analyticsData.metrics.engagementRate + "%",
    );

    // Update hashtag analytics
    this.updateHashtagAnalytics();

    // Update account performance table
    this.updateAccountPerformanceTable();
  }

  updateHashtagAnalytics() {
    const hashtagAnalytics = document.getElementById("hashtagAnalytics");
    if (!hashtagAnalytics || !this.analyticsData.hashtagPerformance) return;

    hashtagAnalytics.innerHTML = this.analyticsData.hashtagPerformance
      .map(
        (hashtag) => `
            <div class="hashtag-item">
                <div class="hashtag-info">
                    <span class="hashtag-name">#${hashtag.hashtag}</span>
                    <span class="hashtag-posts">${hashtag.posts} posts</span>
                </div>
                <div class="hashtag-engagement">
                    <div class="engagement-bar">
                        <div class="engagement-fill" style="width: ${hashtag.engagement}%"></div>
                    </div>
                    <span class="engagement-value">${hashtag.engagement}%</span>
                </div>
            </div>
        `,
      )
      .join("");
  }

  updateAccountPerformanceTable() {
    const tableBody = document.getElementById("performanceTableBody");
    if (!tableBody || !this.analyticsData.accountPerformance) return;

    tableBody.innerHTML = this.analyticsData.accountPerformance
      .map(
        (account) => `
            <tr>
                <td>${account.username}</td>
                <td>${account.followers?.toLocaleString() || 0}</td>
                <td>-</td>
                <td>-</td>
                <td>${account.engagement || 0}%</td>
                <td>
                    <span class="status-badge ${account.isActive ? "active" : "inactive"}">
                        ${account.isActive ? "Activa" : "Inactiva"}
                    </span>
                </td>
            </tr>
        `,
      )
      .join("");
  }

  // Charts
  initializeCharts() {
    // Initialize chart containers if they don't exist
    setTimeout(() => {
      this.setupHourlyChart();
    }, 1000);
  }

  setupHourlyChart() {
    const canvas = document.getElementById("hourlyActivityChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple chart implementation
    this.charts.hourlyActivity = {
      canvas: canvas,
      ctx: ctx,
      data: [],
    };

    this.updateCharts();
  }

  updateCharts() {
    this.updateHourlyChart();
  }

  updateHourlyChart() {
    const chart = this.charts.hourlyActivity;
    if (!chart || !chart.ctx || !this.analyticsData.hourlyActivity) return;

    const canvas = chart.canvas;
    const ctx = chart.ctx;
    const data = this.analyticsData.hourlyActivity;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Find max value
    const maxValue = Math.max(
      ...data.map((d) => Math.max(d.likes, d.comments, d.follows)),
    );

    // Draw grid lines
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    // Vertical lines (hours)
    for (let i = 0; i <= 24; i += 4) {
      const x = padding + (i / 24) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw data lines
    const drawLine = (dataKey, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding + (index / 23) * chartWidth;
        const y =
          padding + chartHeight - (point[dataKey] / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    drawLine("likes", "#ff6b6b");
    drawLine("comments", "#4ecdc4");
    drawLine("follows", "#45b7d1");

    // Draw labels
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // Hour labels
    for (let i = 0; i <= 24; i += 4) {
      const x = padding + (i / 24) * chartWidth;
      ctx.fillText(i + ":00", x, canvas.height - 10);
    }
  }

  // Modal Management
  showAddUserModal() {
    const modal = document.getElementById("addUserModal");
    if (modal) {
      modal.classList.add("active");
      // Reset form
      const form = document.getElementById("addUserForm");
      if (form) form.reset();
    }
  }

  showAddAccountModal() {
    const modal = document.getElementById("addAccountModal");
    if (modal) {
      modal.classList.add("active");
      // Reset form
      const form = document.getElementById("addAccountForm");
      if (form) form.reset();
    }
  }

  // Form Handlers
  async handleAddUser(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("userName"),
      email: formData.get("userEmail"),
      role: formData.get("userRole"),
      subscription: {
        plan: formData.get("subscriptionPlan"),
        accountsLimit: parseInt(formData.get("accountsLimit")) || 1,
      },
    };

    try {
      const response = await this.apiCall("/api/users", "POST", userData);
      if (response.success) {
        this.addLogEntry(
          "success",
          `Usuario ${userData.name} creado exitosamente`,
        );
        document.getElementById("addUserModal").classList.remove("active");
        await this.loadUsers();
      }
    } catch (error) {
      this.addLogEntry("error", `Error creando usuario: ${error.message}`);
    }
  }

  async handleAddAccount(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userId = formData.get("selectUser");
    const accountData = {
      username: formData.get("igUsername"),
      password: formData.get("igPassword"),
      settings: {
        autoLike: formData.get("autoLike") === "on",
        autoComment: formData.get("autoComment") === "on",
        autoFollow: formData.get("autoFollow") === "on",
        maxLikesPerHour: parseInt(formData.get("maxLikes")) || 60,
        maxCommentsPerHour: parseInt(formData.get("maxComments")) || 30,
        maxFollowsPerHour: parseInt(formData.get("maxFollows")) || 20,
        targetHashtags:
          formData
            .get("targetHashtags")
            ?.split(",")
            .map((tag) => tag.trim()) || [],
      },
    };

    try {
      const response = await this.apiCall(
        `/api/users/${userId}/accounts`,
        "POST",
        accountData,
      );
      if (response.success) {
        this.addLogEntry(
          "success",
          `Cuenta ${accountData.username} agregada exitosamente`,
        );
        document.getElementById("addAccountModal").classList.remove("active");
        await this.loadAccounts();
      }
    } catch (error) {
      this.addLogEntry("error", `Error agregando cuenta: ${error.message}`);
    }
  }

  // Account Actions
  async toggleAccount(accountId) {
    try {
      // Find account and toggle status
      const account = this.accounts.find((acc) => acc._id === accountId);
      if (account) {
        account.isActive = !account.isActive;
        this.renderAccounts();
        this.addLogEntry(
          "info",
          `Cuenta ${account.username} ${account.isActive ? "activada" : "desactivada"}`,
        );
      }
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error cambiando estado de cuenta: ${error.message}`,
      );
    }
  }

  async runAutomation(accountId) {
    try {
      this.addLogEntry(
        "info",
        `Iniciando automatización para cuenta ${accountId}`,
      );

      const response = await this.apiCall(
        `/api/social/instagram/automation`,
        "POST",
        { accountId },
      );
      if (response.success) {
        this.addLogEntry("success", "Automatización ejecutada exitosamente");
      }
    } catch (error) {
      this.addLogEntry("error", `Error en automatización: ${error.message}`);
    }
  }

  async updateAccountSetting(accountId, setting, value) {
    try {
      const account = this.accounts.find((acc) => acc._id === accountId);
      if (account) {
        account.settings[setting] = value;
        this.addLogEntry(
          "info",
          `Configuración ${setting} actualizada para ${account.username}`,
        );
      }
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error actualizando configuración: ${error.message}`,
      );
    }
  }

  // Settings Management
  loadSettings() {
    const settings = JSON.parse(localStorage.getItem("rionaSettings") || "{}");

    // Load AI settings
    this.updateElement("aiCharacter", settings.aiCharacter || "arcane-edge");
    this.updateElement("contentStyle", settings.contentStyle || "professional");
    this.updateElement("defaultLanguage", settings.defaultLanguage || "es");

    // Load automation settings
    this.updateElement("autoLikeGlobal", settings.autoLike, "checked");
    this.updateElement("autoCommentGlobal", settings.autoComment, "checked");
    this.updateElement("autoFollowGlobal", settings.autoFollow, "checked");

    this.addLogEntry("info", "Configuraciones cargadas");
  }

  saveSettings() {
    const settings = {
      aiCharacter: document.getElementById("aiCharacter")?.value,
      contentStyle: document.getElementById("contentStyle")?.value,
      defaultLanguage: document.getElementById("defaultLanguage")?.value,
      autoLike: document.getElementById("autoLikeGlobal")?.checked,
      autoComment: document.getElementById("autoCommentGlobal")?.checked,
      autoFollow: document.getElementById("autoFollowGlobal")?.checked,
      maxLikesGlobal: document.getElementById("maxLikesGlobal")?.value,
      maxCommentsGlobal: document.getElementById("maxCommentsGlobal")?.value,
      maxFollowsGlobal: document.getElementById("maxFollowsGlobal")?.value,
      targetHashtags: document.getElementById("targetHashtags")?.value,
    };

    localStorage.setItem("rionaSettings", JSON.stringify(settings));
    this.addLogEntry("success", "Configuraciones guardadas exitosamente");
  }

  // Backup Management
  async createBackup() {
    try {
      this.addLogEntry("info", "Creando backup del sistema...");

      const response = await this.apiCall("/api/backup", "POST");
      if (response.success) {
        // Download backup file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(dataBlob);
        link.download = `riona-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();

        this.addLogEntry("success", "Backup creado y descargado exitosamente");
      }
    } catch (error) {
      this.addLogEntry("error", `Error creando backup: ${error.message}`);
    }
  }

  // Real-time Updates
  async updateRealTimeData() {
    if (this.currentPage === "dashboard") {
      await this.loadDashboardData();
    } else if (this.currentPage === "analytics") {
      const timeRange =
        document.getElementById("analyticsTimeRange")?.value || "24h";
      await this.loadAnalytics(timeRange);
    }
  }

  async loadDashboardData() {
    try {
      // Update system metrics
      const healthResponse = await this.apiCall("/api/health");
      if (healthResponse) {
        this.updateElement(
          "systemUptime",
          this.formatUptime(healthResponse.uptime),
        );
        this.updateElement(
          "memoryUsage",
          healthResponse.memory?.heapUsed || "N/A",
        );
      }

      // Update activity metrics
      if (this.analyticsData.metrics) {
        this.updateElement("todayLikes", this.analyticsData.metrics.totalLikes);
        this.updateElement(
          "todayComments",
          this.analyticsData.metrics.totalComments,
        );
        this.updateElement(
          "todayFollows",
          this.analyticsData.metrics.totalFollows,
        );
      }

      // Update account status
      const activeAccounts = this.accounts.filter((acc) => acc.isActive).length;
      this.updateElement("activeAccounts", activeAccounts);
      this.updateElement("totalAccounts", this.accounts.length);
    } catch (error) {
      console.warn("Error updating real-time data:", error);
    }
  }

  async loadSocialPlatforms() {
    try {
      const response = await this.apiCall("/api/social");
      if (response.success) {
        this.updateSocialPlatformsDisplay(response.data);
      }
    } catch (error) {
      this.addLogEntry("error", `Error cargando plataformas: ${error.message}`);
    }
  }

  updateSocialPlatformsDisplay(data) {
    // Update Instagram platform status
    const instagramStatus = document.getElementById("instagramStatus");
    if (instagramStatus) {
      instagramStatus.innerHTML = `
                <div class="platform-card instagram">
                    <div class="platform-header">
                        <i class="fab fa-instagram"></i>
                        <h4>Instagram</h4>
                        <span class="status-badge ${data.platforms.instagram.status}">${data.platforms.instagram.status}</span>
                    </div>
                    <div class="platform-features">
                        ${data.platforms.instagram.features
                          .map(
                            (feature) =>
                              `<span class="feature-tag">${feature.replace(/_/g, " ")}</span>`,
                          )
                          .join("")}
                    </div>
                    <div class="platform-stats">
                        <span>Cuentas configuradas: ${this.accounts.length}</span>
                    </div>
                </div>
            `;
    }
  }

  // Utility Methods
  formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  updateElement(id, value, property = "textContent") {
    const element = document.getElementById(id);
    if (element) {
      if (property === "checked") {
        element.checked = value;
      } else {
        element[property] = value;
      }
    }
  }

  updateGlobalSetting(setting, value) {
    this.addLogEntry(
      "info",
      `Configuración global ${setting} ${value ? "activada" : "desactivada"}`,
    );

    // Apply to all accounts
    this.accounts.forEach((account) => {
      account.settings[setting] = value;
    });

    this.renderAccounts();
  }

  // User Actions
  editUser(userId) {
    this.addLogEntry("info", `Editando usuario ${userId}`);
    // Implement edit user functionality
  }

  viewUserAccounts(userId) {
    this.addLogEntry("info", `Viendo cuentas del usuario ${userId}`);
    // Filter accounts by user and show
  }

  async deleteUser(userId) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        const response = await this.apiCall(`/api/users/${userId}`, "DELETE");
        if (response.success) {
          this.addLogEntry("success", "Usuario eliminado exitosamente");
          await this.loadUsers();
        }
      } catch (error) {
        this.addLogEntry("error", `Error eliminando usuario: ${error.message}`);
      }
    }
  }

  editAccount(accountId) {
    this.addLogEntry("info", `Editando cuenta ${accountId}`);
    // Implement edit account functionality
  }

  viewAccountStats(accountId) {
    const account = this.accounts.find((acc) => acc._id === accountId);
    if (account) {
      this.addLogEntry(
        "info",
        `Stats de ${account.username}: ${account.stats.followers} seguidores, ${account.stats.engagement}% engagement`,
      );
    }
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new ExtendedDashboard();
  console.log("🚀 Riona AI Agent Dashboard completamente cargado");
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = ExtendedDashboard;
}
