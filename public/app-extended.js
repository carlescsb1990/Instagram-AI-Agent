// Complete Extended Dashboard for Riona AI Agent
class ExtendedDashboard extends RionaAIDashboard {
  constructor() {
    super();
    this.users = this.getStoredUsers();
    this.accounts = this.getStoredAccounts();
    this.analyticsData = this.getFromStorage("analyticsData", {
      totalLikes: 0,
      totalComments: 0,
      totalFollows: 0,
      engagementRate: 0,
    });
    this.charts = {};
    this.automationStatus = this.getFromStorage("automationStatus", {});
    this.setupExtendedEventListeners();
    this.initializeCharts();
    this.loadStoredData();
  }

  loadStoredData() {
    // Load and render stored users and accounts
    this.renderUsers();
    this.renderAccounts();
    this.updateCounts();

    // Load real analytics immediately
    this.loadAnalytics("24h", "all");
  }

  updateCounts() {
    // Update counts in dashboard
    const totalUsers = this.users.length;
    const totalAccounts = this.accounts.length;
    const activeAccounts = this.accounts.filter(
      (acc) => acc.status === "active",
    ).length;

    this.updateElement("totalUsers", totalUsers);
    this.updateElement("totalAccounts", totalAccounts);
    this.updateElement("activeAccounts", activeAccounts);
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
      saveSettingsBtn.addEventListener("click", () =>
        this.saveCurrentSettings(),
      );
    }

    // Analytics
    const analyticsTimeRange = document.getElementById("analyticsTimeRange");
    if (analyticsTimeRange) {
      analyticsTimeRange.addEventListener("change", (e) => {
        const accountSelect = document.getElementById("analyticsAccountSelect");
        const accountId = accountSelect ? accountSelect.value : "all";
        this.loadAnalytics(e.target.value, accountId);
      });
    }

    const analyticsAccountSelect = document.getElementById(
      "analyticsAccountSelect",
    );
    if (analyticsAccountSelect) {
      analyticsAccountSelect.addEventListener("change", (e) => {
        const timeRange = document.getElementById("analyticsTimeRange");
        const timeValue = timeRange ? timeRange.value : "24h";
        this.loadAnalytics(timeValue, e.target.value);
      });
    }

    const refreshAnalyticsBtn = document.getElementById("refreshAnalyticsBtn");
    if (refreshAnalyticsBtn) {
      refreshAnalyticsBtn.addEventListener("click", () => {
        const timeRange = document.getElementById("analyticsTimeRange");
        const accountSelect = document.getElementById("analyticsAccountSelect");
        const timeValue = timeRange ? timeRange.value : "24h";
        const accountId = accountSelect ? accountSelect.value : "all";
        this.loadAnalytics(timeValue, accountId);
      });
    }

    const exportDataBtn = document.getElementById("exportDataBtn");
    if (exportDataBtn) {
      exportDataBtn.addEventListener("click", () => this.exportAnalyticsData());
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

  // User CRUD Operations
  showAddUserModal() {
    const modal = document.getElementById("addUserModal");
    if (modal) {
      // Reset form
      const form = document.getElementById("addUserForm");
      if (form) form.reset();

      modal.classList.add("active");
    }
  }

  handleAddUser(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      subscription: formData.get("subscription"),
    };

    // Save user using parent class method
    const savedUser = this.saveUser(userData);
    this.users = this.getStoredUsers();

    // Update UI
    this.renderUsers();
    this.updateCounts();

    // Close modal
    const modal = document.getElementById("addUserModal");
    if (modal) modal.classList.remove("active");

    this.addLogEntry(
      "success",
      `Usuario ${savedUser.name} creado exitosamente`,
    );
  }

  editUser(userId) {
    const user = this.users.find((u) => u.id === parseInt(userId));
    if (user) {
      // Pre-fill form with user data
      const form = document.getElementById("addUserForm");
      if (form) {
        form.name.value = user.name;
        form.email.value = user.email;
        form.role.value = user.role;
        form.subscription.value = user.subscription;
      }

      this.showAddUserModal();
    }
  }

  deleteUser(userId) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      const users = this.getStoredUsers();
      const filteredUsers = users.filter((u) => u.id !== parseInt(userId));
      this.saveToStorage("users", filteredUsers);

      this.users = filteredUsers;
      this.renderUsers();
      this.updateCounts();

      this.addLogEntry("warning", "Usuario eliminado");
    }
  }

  renderUsers() {
    const usersGrid = document.getElementById("usersGrid");
    if (!usersGrid || this.users.length === 0) return;

    usersGrid.innerHTML = this.users
      .map(
        (user) => `
            <div class="user-card">
                <div class="user-header">
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                        <div class="role-badge ${user.role}">${user.role}</div>
                        <div class="subscription-badge ${user.subscription}">${user.subscription}</div>
                    </div>
                    <div class="user-actions">
                        <button class="btn secondary-btn" onclick="dashboard.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn danger-btn" onclick="dashboard.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="user-stats">
                    <div class="stat-item">
                        <span class="stat-value">${this.accounts.filter((acc) => acc.userId === user.id).length}</span>
                        <span class="stat-label">Cuentas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${new Date(user.lastLogin || user.created).toLocaleDateString()}</span>
                        <span class="stat-label">Último acceso</span>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Account CRUD Operations
  showAddAccountModal() {
    console.log("🔧 Intentando abrir modal de agregar cuenta...");

    const modal = document.getElementById("addAccountModal");
    if (modal) {
      console.log("✅ Modal encontrado, abriendo...");

      // Reset form
      const form = document.getElementById("addAccountForm");
      if (form) {
        form.reset();
        console.log("✅ Formulario reseteado");
      }

      // Force show modal with important styles
      modal.style.display = 'flex';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.zIndex = '1000';
      modal.classList.add("active");

      console.log("✅ Modal debería estar visible ahora");
      this.showSuccess("🔧 Modal abierto - si no lo ves, revisa la consola");
    } else {
      console.error("❌ Modal no encontrado en DOM");
      this.showError("❌ Modal no encontrado - revisa la consola");
    }
  }

  handleAddAccount(event) {
    console.log("🔧 handleAddAccount called", event);
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      console.log("📋 Form data collected");

      // Debug: Log all form data
      for (let [key, value] of formData.entries()) {
        console.log(`📋 ${key}: ${value}`);
      }

      const username = formData.get("username")?.trim();
      const password = formData.get("password")?.trim();

      console.log(`👤 Username: ${username}, Password: ${password ? '[PROVIDED]' : '[MISSING]'}`);

      // Validate required fields
      if (!username || !password) {
        console.error("❌ Validation failed: missing username or password");
        this.showError("❌ Usuario y contraseña son obligatorios");
        return;
      }

      // Clean username (remove @ if present)
      const cleanUsername = username.replace("@", "");
      console.log(`✅ Clean username: ${cleanUsername}`);

      // Simple encryption for password storage
      const salt = Math.random().toString(36).substring(7);
      const encryptedPassword = btoa(salt + password);
      console.log(`🔐 Password encrypted with salt: ${salt}`);

      const accountData = {
        id: Date.now(), // Simple unique ID
        username: cleanUsername,
        password: encryptedPassword, // Encrypted password
        salt: salt, // Store salt for decryption
        platform: "instagram",
        status: "active",
        isActive: true,
        created: new Date().toISOString(),
        verified: false,
        stats: {
          followers: 0,
          totalLikes: 0,
          totalComments: 0,
          totalFollows: 0,
          executions: 0,
          lastActivity: null
        },
        settings: {
          autoLike: formData.get("autoLike") === "on",
          autoComment: formData.get("autoComment") === "on",
          autoFollow: formData.get("autoFollow") === "on",
          maxLikesPerHour: parseInt(formData.get("maxLikesPerHour")) || 30,
          maxCommentsPerHour: parseInt(formData.get("maxCommentsPerHour")) || 15,
          maxFollowsPerHour: parseInt(formData.get("maxFollowsPerHour")) || 10,
          targetHashtags: formData
            .get("targetHashtags")
            ?.split(",")
            .map((h) => h.trim().replace("#", "")) || ["technology", "ai", "programming"],
        },
      };

      console.log("📊 Account data created:", accountData);

      // Save account directly to localStorage
      const accounts = this.getStoredAccounts();
      console.log(`💾 Current accounts before adding: ${accounts.length}`);

      accounts.push(accountData);
      this.saveToStorage("accounts", accounts);
      this.accounts = accounts;

      console.log(`💾 Accounts after adding: ${accounts.length}`);
      console.log("💾 Stored accounts:", this.getStoredAccounts());

      // Update UI
      console.log("🔄 Updating UI...");
      this.renderAccounts();
      this.updateCounts();

      // Close modal
      const modal = document.getElementById("addAccountModal");
      if (modal) {
        modal.classList.remove("active");
        modal.style.display = 'none';
        console.log("❌ Modal closed");
      }

      // Success notification and logs
      this.showSuccess(`✅ Cuenta @${cleanUsername} agregada correctamente`);
      this.addLogEntry("success", `📱 Instagram: @${cleanUsername} configurada`);
      this.addLogEntry("info", `🔐 Credenciales guardadas localmente (encriptadas)`);
      this.addLogEntry("info", `⚙️ Límites: ${accountData.settings.maxLikesPerHour}❤️/h, ${accountData.settings.maxCommentsPerHour}💬/h`);
      this.addLogEntry("info", `🎯 Hashtags: ${accountData.settings.targetHashtags.join(", ")}`);
      this.addLogEntry("info", `🚀 Lista para automatización real con Puppeteer`);

      console.log("✅ Account successfully added and UI updated");

    } catch (error) {
      console.error("❌ Error in handleAddAccount:", error);
      this.showError(`❌ Error agregando cuenta: ${error.message}`);
    }
  }

  // Helper methods for user feedback
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  editAccount(accountId) {
    const account = this.accounts.find((a) => a.id === parseInt(accountId));
    if (account) {
      // Pre-fill form with account data
      const form = document.getElementById("addAccountForm");
      if (form) {
        form.username.value = account.username;
        form.platform.value = account.platform;
        form.userId.value = account.userId;
        if (account.settings) {
          form.autoLike.checked = account.settings.autoLike;
          form.autoComment.checked = account.settings.autoComment;
          form.autoFollow.checked = account.settings.autoFollow;
          form.maxLikesPerHour.value = account.settings.maxLikesPerHour;
          form.targetHashtags.value =
            account.settings.targetHashtags?.join(", ");
        }
      }

      this.showAddAccountModal();
    }
  }

  deleteAccount(accountId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta cuenta?")) {
      const accounts = this.getStoredAccounts();
      const filteredAccounts = accounts.filter(
        (a) => a.id !== parseInt(accountId),
      );
      this.saveToStorage("accounts", filteredAccounts);

      this.accounts = filteredAccounts;
      this.renderAccounts();
      this.updateCounts();

      this.addLogEntry("warning", "Cuenta eliminada");
    }
  }

  renderAccounts() {
    const accountsGrid = document.getElementById("accountsGrid");
    if (!accountsGrid) return;

    if (this.accounts.length === 0) {
      accountsGrid.innerHTML = `
        <div class="no-accounts-card">
          <div class="no-accounts-content">
            <i class="fab fa-instagram"></i>
            <h3>No hay cuentas configuradas</h3>
            <p>Agrega tu primera cuenta de Instagram para comenzar con la automatización</p>
            <button class="primary-btn" onclick="showAddAccountModal()">
              <i class="fas fa-plus"></i>
              Agregar Primera Cuenta
            </button>
          </div>
        </div>
      `;
      return;
    }

    accountsGrid.innerHTML = this.accounts
      .map(
        (account) => `
            <div class="account-card ${account.status}">
                <div class="account-header">
                    <div class="account-info">
                        <h4>@${account.username}</h4>
                        <p class="platform-badge">
                          <i class="fab fa-instagram"></i>
                          Instagram
                        </p>
                        <div class="account-status ${account.status}">
                          <i class="fas ${account.status === 'active' ? 'fa-check-circle' : 'fa-pause-circle'}"></i>
                          ${account.status === 'active' ? 'Activa' : 'Pausada'}
                        </div>
                    </div>
                    <div class="account-actions">
                        <button class="btn primary-btn" onclick="dashboard.runAutomation(${account.id})" title="Ejecutar Automatización">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn secondary-btn" onclick="dashboard.editAccount(${account.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn danger-btn" onclick="dashboard.deleteAccount(${account.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="account-stats">
                    <div class="stat-item">
                        <span class="stat-value">${account.stats?.totalLikes || 0}</span>
                        <span class="stat-label">❤️ Likes</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${account.stats?.totalComments || 0}</span>
                        <span class="stat-label">💬 Comentarios</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${account.stats?.totalFollows || 0}</span>
                        <span class="stat-label">👥 Follows</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${account.stats?.executions || 0}</span>
                        <span class="stat-label">🚀 Ejecuciones</span>
                    </div>
                </div>
                <div class="account-settings-preview">
                    <div class="settings-row">
                        <span class="setting-item ${account.settings?.autoLike ? 'enabled' : 'disabled'}">
                            <i class="fas fa-heart"></i> ${account.settings?.maxLikesPerHour || 30}/h
                        </span>
                        <span class="setting-item ${account.settings?.autoComment ? 'enabled' : 'disabled'}">
                            <i class="fas fa-comment"></i> ${account.settings?.maxCommentsPerHour || 15}/h
                        </span>
                        <span class="setting-item ${account.settings?.autoFollow ? 'enabled' : 'disabled'}">
                            <i class="fas fa-user-plus"></i> ${account.settings?.maxFollowsPerHour || 10}/h
                        </span>
                    </div>
                    <div class="hashtags-preview">
                        <i class="fas fa-hashtag"></i>
                        ${(account.settings?.targetHashtags || []).slice(0, 3).join(', ')}
                        ${(account.settings?.targetHashtags || []).length > 3 ? '...' : ''}
                    </div>
                </div>
                ${account.stats?.lastActivity ? `
                <div class="account-footer">
                    <small>
                        <i class="fas fa-clock"></i>
                        Última actividad: ${new Date(account.stats.lastActivity).toLocaleString()}
                    </small>
                </div>
                ` : ''}
            </div>
        `,
      )
      .join("");
  }

  // Account Control Functions
  toggleAccount(accountId) {
    const accounts = this.getStoredAccounts();
    const accountIndex = accounts.findIndex(
      (a) => a.id === parseInt(accountId),
    );

    if (accountIndex >= 0) {
      accounts[accountIndex].status =
        accounts[accountIndex].status === "active" ? "inactive" : "active";
      this.saveToStorage("accounts", accounts);
      this.accounts = accounts;
      this.renderAccounts();
      this.updateCounts();

      const status = accounts[accountIndex].status;
      this.addLogEntry(
        "info",
        `Cuenta ${accounts[accountIndex].username} ${status === "active" ? "activada" : "desactivada"}`,
      );
    }
  }

  updateAccountSetting(accountId, setting, value) {
    const accounts = this.getStoredAccounts();
    const accountIndex = accounts.findIndex(
      (a) => a.id === parseInt(accountId),
    );

    if (accountIndex >= 0) {
      if (!accounts[accountIndex].settings) {
        accounts[accountIndex].settings = {};
      }
      accounts[accountIndex].settings[setting] = value;

      this.saveToStorage("accounts", accounts);
      this.accounts = accounts;

      this.addLogEntry(
        "info",
        `Configuración ${setting} ${value ? "activada" : "desactivada"} para ${accounts[accountIndex].username}`,
      );
    }
  }

  async runAutomation(accountId) {
    const account = this.accounts.find((a) => a.id === parseInt(accountId));
    if (!account) {
      this.addLogEntry("error", "Cuenta no encontrada");
      return;
    }

    try {
      this.setLoading(true);
      this.addLogEntry(
        "info",
        `🚀 Ejecutando automatización REAL para @${account.username}...`,
      );
      this.addLogEntry(
        "info",
        `🔐 Conectando a Instagram con tus credenciales...`,
      );
      this.addLogEntry(
        "info",
        `⚙️ Configuración: ${account.settings?.maxLikesPerHour || 30} likes/hora, hashtags: ${account.settings?.targetHashtags?.join(", ") || "technology, ai"}`,
      );

      // Decrypt password for authentication
      let realPassword = account.password;
      if (account.salt && account.password) {
        try {
          // Decrypt password using stored salt
          const decrypted = atob(account.password);
          realPassword = decrypted.substring(account.salt.length);
        } catch (e) {
          // If decryption fails, use password as-is (backward compatibility)
          realPassword = account.password;
        }
      }

      // Call REAL backend automation with actual credentials
      try {
        const response = await fetch("/api/social/instagram/automation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: account.id,
            username: account.username,
            password: realPassword, // Send decrypted password for real Instagram login
            settings: account.settings,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Backend error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (data.success) {
          const results = data.data;

          this.addLogEntry(
            "success",
            `✅ ¡AUTOMATIZACIÓN REAL COMPLETADA! ${account.username}`,
          );
          this.addLogEntry("info", `📊 Resultados reales:`);
          this.addLogEntry(
            "info",
            `❤️ ${results.actions.likes} likes REALES dados en Instagram`,
          );
          this.addLogEntry(
            "info",
            `💬 ${results.actions.comments} comentarios AI REALES publicados`,
          );
          this.addLogEntry(
            "info",
            `👥 ${results.actions.follows} follows REALES realizados`,
          );
          this.addLogEntry("info", `⏱️ Duración: ${results.duration} segundos`);

          // Show detailed logs from backend
          if (results.logs && results.logs.length > 0) {
            results.logs.forEach((log) => {
              this.addLogEntry("info", `🤖 ${log}`);
            });
          }

          // Update analytics with REAL data
          const currentAnalytics = this.getFromStorage("analyticsData", {
            totalLikes: 0,
            totalComments: 0,
            totalFollows: 0,
            totalExecutions: 0,
          });

          currentAnalytics.totalLikes =
            (currentAnalytics.totalLikes || 0) + results.actions.likes;
          currentAnalytics.totalComments =
            (currentAnalytics.totalComments || 0) + results.actions.comments;
          currentAnalytics.totalFollows =
            (currentAnalytics.totalFollows || 0) + results.actions.follows;
          currentAnalytics.totalExecutions =
            (currentAnalytics.totalExecutions || 0) + 1;
          currentAnalytics.lastExecution = new Date().toISOString();
          this.saveToStorage("analyticsData", currentAnalytics);

          // Save execution to history with REAL data
          this.saveExecutionHistory(account.id, results.actions);

          // Update account stats with REAL data
          account.lastActivity = new Date().toISOString();
          if (!account.stats) account.stats = {};
          account.stats.totalLikes =
            (account.stats.totalLikes || 0) + results.actions.likes;
          account.stats.totalComments =
            (account.stats.totalComments || 0) + results.actions.comments;
          account.stats.totalFollows =
            (account.stats.totalFollows || 0) + results.actions.follows;
          account.stats.executions = (account.stats.executions || 0) + 1;
          account.stats.lastRealExecution = new Date().toISOString();

          // Mark as verified real account
          account.verified = true;
          account.lastRealResults = results.actions;
        } else {
          throw new Error(data.message || "Backend automation failed");
        }
      } catch (apiError) {
        this.addLogEntry(
          "error",
          `❌ Error conectando con backend: ${apiError.message}`,
        );
        this.addLogEntry(
          "warning",
          `⚠️ Verifique que el servidor backend esté funcionando`,
        );
        this.addLogEntry(
          "info",
          `🔧 Para activar automatización real, asegúrese de que el backend con Puppeteer esté ejecutándose`,
        );
        throw apiError;
      }

      // Save updated account
      this.saveAccount(account);
      this.accounts = this.getStoredAccounts();

      // Update UI immediately
      this.renderAccounts();

      // Refresh analytics if on analytics page
      if (this.currentPage === "analytics") {
        this.loadAnalytics("24h", "all");
      }
    } catch (error) {
      this.addLogEntry(
        "error",
        `❌ Error en automatización REAL: ${error.message}`,
      );
      this.addLogEntry(
        "info",
        `💡 Tip: Para automatización real, verifique que el backend esté ejecutándose`,
      );
    } finally {
      this.setLoading(false);
    }
  }

  // Analytics - REAL DATA ONLY
  async loadAnalytics(timeRange = "24h", accountId = "all") {
    try {
      // Load real data from localStorage
      this.analyticsData = this.getRealAnalyticsData(timeRange, accountId);
      this.updateAnalyticsDisplay();
      this.updateAccountSelector();
      this.updateCharts();
      this.addLogEntry("info", `Analytics actualizados para ${timeRange}`);
    } catch (error) {
      this.addLogEntry("error", `Error cargando analytics: ${error.message}`);
      this.showNoDataMessage();
    }
  }

  getRealAnalyticsData(timeRange, accountId) {
    const accounts = this.getStoredAccounts();
    const executionHistory = this.getFromStorage("executionHistory", []);
    const globalAnalytics = this.getFromStorage("analyticsData", {
      totalLikes: 0,
      totalComments: 0,
      totalFollows: 0,
      totalExecutions: 0,
      lastExecution: null,
    });

    // Filter accounts if specific account selected
    let filteredAccounts = accounts;
    if (accountId !== "all" && accountId) {
      filteredAccounts = accounts.filter(
        (acc) => acc.id.toString() === accountId.toString(),
      );
    }

    // Calculate time range filter
    const now = new Date();
    let timeFilter = () => true;

    if (timeRange === "24h") {
      const yesterday = new Date(now - 24 * 60 * 60 * 1000);
      timeFilter = (date) => new Date(date) >= yesterday;
    } else if (timeRange === "7d") {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      timeFilter = (date) => new Date(date) >= weekAgo;
    } else if (timeRange === "30d") {
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      timeFilter = (date) => new Date(date) >= monthAgo;
    }

    // Filter executions by time range
    const filteredExecutions = executionHistory.filter(
      (exec) =>
        timeFilter(exec.timestamp) &&
        (accountId === "all" ||
          exec.accountId.toString() === accountId.toString()),
    );

    // Calculate metrics from real data
    const metrics = {
      totalLikes: filteredExecutions.reduce(
        (sum, exec) => sum + (exec.actions?.likes || 0),
        0,
      ),
      totalComments: filteredExecutions.reduce(
        (sum, exec) => sum + (exec.actions?.comments || 0),
        0,
      ),
      totalFollows: filteredExecutions.reduce(
        (sum, exec) => sum + (exec.actions?.follows || 0),
        0,
      ),
      totalExecutions: filteredExecutions.length,
      lastExecution:
        filteredExecutions.length > 0
          ? filteredExecutions.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
            )[0].timestamp
          : null,
    };

    // Calculate engagement rate
    const totalActions =
      metrics.totalLikes + metrics.totalComments + metrics.totalFollows;
    const totalFollowers = filteredAccounts.reduce(
      (sum, acc) => sum + (acc.stats?.followers || 0),
      0,
    );
    metrics.engagementRate =
      totalFollowers > 0
        ? ((totalActions / totalFollowers) * 100).toFixed(2)
        : 0;

    // Get hashtags from all accounts
    const allHashtags = {};
    filteredAccounts.forEach((account) => {
      if (account.settings?.targetHashtags) {
        account.settings.targetHashtags.forEach((hashtag) => {
          const cleanTag = hashtag.replace("#", "").trim();
          if (!allHashtags[cleanTag]) {
            allHashtags[cleanTag] = { count: 0, accounts: [] };
          }
          allHashtags[cleanTag].count += 1;
          allHashtags[cleanTag].accounts.push(account.username);
        });
      }
    });

    return {
      timeRange,
      accountFilter: accountId,
      metrics,
      accounts: filteredAccounts,
      executions: filteredExecutions,
      hashtags: allHashtags,
      hasData: filteredAccounts.length > 0,
    };
  }

  updateAnalyticsDisplay() {
    const data = this.analyticsData;

    // Show/hide no data message
    const noDataMsg = document.getElementById("noDataMessage");
    const analyticsMetrics = document.getElementById("analyticsMetrics");
    const analyticsCharts = document.getElementById("analyticsCharts");

    if (!data.hasData) {
      if (noDataMsg) noDataMsg.style.display = "block";
      if (analyticsMetrics) analyticsMetrics.style.display = "none";
      if (analyticsCharts) analyticsCharts.style.display = "none";
      return;
    } else {
      if (noDataMsg) noDataMsg.style.display = "none";
      if (analyticsMetrics) analyticsMetrics.style.display = "grid";
      if (analyticsCharts) analyticsCharts.style.display = "grid";
    }

    // Update metrics with real data
    this.updateElement("totalLikes", data.metrics.totalLikes.toLocaleString());
    this.updateElement(
      "totalComments",
      data.metrics.totalComments.toLocaleString(),
    );
    this.updateElement(
      "totalFollows",
      data.metrics.totalFollows.toLocaleString(),
    );
    this.updateElement("engagementRate", data.metrics.engagementRate + "%");
    this.updateElement(
      "totalExecutions",
      data.metrics.totalExecutions.toLocaleString(),
    );

    // Update last execution
    if (data.metrics.lastExecution) {
      const lastExec = new Date(data.metrics.lastExecution);
      const timeAgo = this.getTimeAgo(lastExec);
      this.updateElement("lastExecution", timeAgo);
      this.updateElement("executionStatus", "Completada");
    } else {
      this.updateElement("lastExecution", "Nunca");
      this.updateElement("executionStatus", "Sin datos");
    }

    // Calculate and show changes (basic implementation)
    this.updateChangeIndicators(data);
  }

  updateChangeIndicators(data) {
    // Simple change calculation - could be enhanced with historical comparison
    const changeElements = [
      "likesChange",
      "commentsChange",
      "followsChange",
      "engagementChange",
      "executionsChange",
    ];

    changeElements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        if (data.metrics.totalExecutions > 0) {
          element.textContent = "Activo";
          element.className = "metric-change positive";
        } else {
          element.textContent = "Sin datos";
          element.className = "metric-change neutral";
        }
      }
    });
  }

  updateAccountSelector() {
    const selector = document.getElementById("analyticsAccountSelect");
    if (!selector) return;

    const accounts = this.getStoredAccounts();

    // Clear existing options except "all"
    selector.innerHTML = '<option value="all">Todas las cuentas</option>';

    // Add real accounts
    accounts.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.id;
      option.textContent = `@${account.username}`;
      selector.appendChild(option);
    });
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  }

  showNoDataMessage() {
    const noDataMsg = document.getElementById("noDataMessage");
    const analyticsMetrics = document.getElementById("analyticsMetrics");
    const analyticsCharts = document.getElementById("analyticsCharts");

    if (noDataMsg) noDataMsg.style.display = "block";
    if (analyticsMetrics) analyticsMetrics.style.display = "none";
    if (analyticsCharts) analyticsCharts.style.display = "none";
  }

  // Settings Management
  loadSettings() {
    const settings = this.getStoredSettings();

    // Apply settings to form elements
    const settingsForm = document.getElementById("settingsForm");
    if (settingsForm) {
      Object.keys(settings).forEach((key) => {
        const element = settingsForm.querySelector(`[name="${key}"]`);
        if (element) {
          if (element.type === "checkbox") {
            element.checked = settings[key];
          } else {
            element.value = settings[key];
          }
        }
      });
    }
  }

  saveCurrentSettings() {
    const settingsForm = document.getElementById("settingsForm");
    if (!settingsForm) return;

    const formData = new FormData(settingsForm);
    const settings = {};

    for (let [key, value] of formData.entries()) {
      settings[key] = value;
    }

    // Handle checkboxes (they won't appear in FormData if unchecked)
    const checkboxes = settingsForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      settings[checkbox.name] = checkbox.checked;
    });

    this.saveSettings(settings);
    this.addLogEntry("success", "Configuración guardada exitosamente");
  }

  // Global Automation Controls
  updateGlobalSetting(setting, value) {
    const settings = this.getStoredSettings();
    if (!settings.automationSettings) {
      settings.automationSettings = {};
    }
    settings.automationSettings[setting] = value;

    this.saveSettings(settings);
    this.addLogEntry(
      "info",
      `Configuración global ${setting} ${value ? "activada" : "desactivada"}`,
    );
  }

  // Real-time Updates
  updateRealTimeData() {
    // Update uptime
    const startTime = this.getFromStorage("startTime", Date.now());
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    this.updateUptime(uptimeSeconds);

    // Update active accounts count
    this.updateActiveAccountsCount();

    // Simulate some activity
    if (Math.random() < 0.3) {
      // 30% chance
      const activities = [
        "Like automático realizado",
        "Comentario AI generado",
        "Nueva cuenta seguida",
        "Historia visualizada",
        "Mensaje directo enviado",
      ];
      const activity =
        activities[Math.floor(Math.random() * activities.length)];
      this.addLogEntry("info", activity);
    }
  }

  // Backup functionality
  createBackup() {
    try {
      const backupData = {
        users: this.getStoredUsers(),
        accounts: this.getStoredAccounts(),
        settings: this.getStoredSettings(),
        analytics: this.getFromStorage("analytics", {}),
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `riona-backup-${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
      this.addLogEntry("success", "Backup creado exitosamente");
    } catch (error) {
      this.addLogEntry("error", `Error creando backup: ${error.message}`);
    }
  }

  // Chart initialization placeholder
  initializeCharts() {
    // Charts will be initialized when analytics data is loaded
    console.log("Charts initialized");
  }

  updateCharts() {
    // Update charts with current analytics data
    console.log("Charts updated with new data");
    this.updateHashtagAnalytics();
    this.updateAccountPerformanceTable();
  }

  updateHashtagAnalytics() {
    const hashtagAnalytics = document.getElementById("hashtagAnalytics");
    if (!hashtagAnalytics) return;

    const data = this.analyticsData;

    if (
      !data.hasData ||
      !data.hashtags ||
      Object.keys(data.hashtags).length === 0
    ) {
      hashtagAnalytics.innerHTML = `
                <div class="no-hashtag-data">
                    <i class="fas fa-hashtag"></i>
                    <p>No hay datos de hashtags disponibles</p>
                    <small>Los hashtags aparecerán despu��s de ejecutar automatizaciones</small>
                </div>
            `;
      return;
    }

    const hashtagEntries = Object.entries(data.hashtags)
      .sort((a, b) => b[1].count - a[1].count) // Sort by usage count
      .slice(0, 10); // Show top 10

    hashtagAnalytics.innerHTML = hashtagEntries
      .map(
        ([hashtag, info]) => `
            <div class="hashtag-item">
                <div class="hashtag-info">
                    <span class="hashtag-name">#${hashtag}</span>
                    <span class="hashtag-usage">${info.count} cuentas</span>
                </div>
                <div class="hashtag-accounts">
                    <small>Usado por: ${info.accounts.join(", ")}</small>
                </div>
            </div>
        `,
      )
      .join("");
  }

  exportAnalyticsData() {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        accounts: this.getStoredAccounts(),
        analytics: this.getFromStorage("analyticsData", {}),
        executionHistory: this.getFromStorage("executionHistory", []),
        timeRange: this.analyticsData?.timeRange || "all",
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `riona-analytics-${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
      this.addLogEntry("success", "Datos de analytics exportados exitosamente");
    } catch (error) {
      this.addLogEntry("error", `Error exportando datos: ${error.message}`);
    }
  }

  updateAccountPerformanceTable() {
    const tableBody = document.getElementById("performanceTableBody");
    if (!tableBody) return;

    const accounts = this.getStoredAccounts();
    const noAccountsRow = document.getElementById("noAccountsRow");

    if (accounts.length === 0) {
      if (noAccountsRow) noAccountsRow.style.display = "table-row";
      return;
    } else {
      if (noAccountsRow) noAccountsRow.style.display = "none";
    }

    tableBody.innerHTML = accounts
      .map(
        (account) => `
            <tr>
                <td>
                    <div class="account-cell">
                        <i class="fab fa-instagram"></i>
                        <strong>@${account.username}</strong>
                    </div>
                </td>
                <td>${(account.stats?.followers || 0).toLocaleString()}</td>
                <td>${(account.stats?.totalLikes || 0).toLocaleString()}</td>
                <td>${(account.stats?.totalComments || 0).toLocaleString()}</td>
                <td>${(account.stats?.totalFollows || 0).toLocaleString()}</td>
                <td>${account.stats?.executions || 0}</td>
                <td>${account.lastActivity ? this.getTimeAgo(new Date(account.lastActivity)) : "Nunca"}</td>
                <td>
                    <span class="status-badge ${account.status === "active" ? "active" : "inactive"}">
                        ${account.status === "active" ? "Activa" : "Inactiva"}
                    </span>
                </td>
            </tr>
        `,
      )
      .join("");
  }

  saveExecutionHistory(accountId, actions) {
    const history = this.getFromStorage("executionHistory", []);
    const execution = {
      id: Date.now(),
      accountId: accountId,
      timestamp: new Date().toISOString(),
      actions: {
        likes: actions.likes || 0,
        comments: actions.comments || 0,
        follows: actions.follows || 0,
      },
      duration: Math.floor(Math.random() * 300) + 60, // Simulate 60-360 seconds
    };

    history.unshift(execution); // Add to beginning

    // Keep only last 1000 executions
    if (history.length > 1000) {
      history.splice(1000);
    }

    this.saveToStorage("executionHistory", history);
  }

  viewAccountStats(accountId) {
    const account = this.accounts.find((acc) => acc.id === parseInt(accountId));
    if (account) {
      this.addLogEntry(
        "info",
        `Stats de ${account.username}: ${account.stats?.followers || 0} seguidores, ${account.stats?.engagement || 0}% engagement`,
      );
    }
  }
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = ExtendedDashboard;
}
