// Extended functionality for Riona AI Agent Dashboard
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
    this.setupExtendedEventListeners();
  }

  setupExtendedEventListeners() {
    // User management
    document.getElementById("addUserBtn").addEventListener("click", () => {
      this.showAddUserModal();
    });

    document.getElementById("addAccountBtn").addEventListener("click", () => {
      this.showAddAccountModal();
    });

    // Modal controls
    this.setupModalControls();

    // Form submissions
    document.getElementById("addUserForm").addEventListener("submit", (e) => {
      this.handleAddUser(e);
    });

    document
      .getElementById("addAccountForm")
      .addEventListener("submit", (e) => {
        this.handleAddAccount(e);
      });

    // Settings
    document.getElementById("saveSettingsBtn").addEventListener("click", () => {
      this.saveSettings();
    });

    // Analytics
    document
      .getElementById("analyticsTimeRange")
      .addEventListener("change", (e) => {
        this.loadAnalytics(e.target.value);
      });

    // Backup
    document.getElementById("backupNowBtn").addEventListener("click", () => {
      this.createBackup();
    });
  }

  setupModalControls() {
    // User modal
    const userModal = document.getElementById("addUserModal");
    const accountModal = document.getElementById("addAccountModal");

    document.getElementById("closeUserModal").addEventListener("click", () => {
      userModal.classList.remove("active");
    });

    document.getElementById("cancelUserBtn").addEventListener("click", () => {
      userModal.classList.remove("active");
    });

    document
      .getElementById("closeAccountModal")
      .addEventListener("click", () => {
        accountModal.classList.remove("active");
      });

    document
      .getElementById("cancelAccountBtn")
      .addEventListener("click", () => {
        accountModal.classList.remove("active");
      });

    // Close on outside click
    userModal.addEventListener("click", (e) => {
      if (e.target === userModal) {
        userModal.classList.remove("active");
      }
    });

    accountModal.addEventListener("click", (e) => {
      if (e.target === accountModal) {
        accountModal.classList.remove("active");
      }
    });
  }

  async loadPageData(page) {
    await super.loadPageData(page);

    switch (page) {
      case "automation":
        await this.loadUsers();
        await this.loadAccounts();
        break;
      case "analytics":
        await this.loadAnalytics("24h");
        break;
      case "settings":
        this.loadSettings();
        break;
    }
  }

  // User Management
  async loadUsers() {
    try {
      // Simulate API call - replace with actual endpoint
      const mockUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          subscription: { plan: "enterprise", accountsLimit: 999 },
          instagramAccounts: 2,
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          name: "Demo User",
          email: "demo@example.com",
          role: "user",
          subscription: { plan: "basic", accountsLimit: 5 },
          instagramAccounts: 1,
          createdAt: new Date("2024-01-20"),
        },
      ];

      this.users = mockUsers;
      this.renderUsers();
      this.updateUserSelect();
      this.addLogEntry("info", `Cargados ${mockUsers.length} usuarios`);
    } catch (error) {
      this.addLogEntry("error", `Error cargando usuarios: ${error.message}`);
    }
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
                        <span class="stat-number">${user.instagramAccounts}</span>
                        <span class="stat-label">Cuentas IG</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${user.subscription.accountsLimit}</span>
                        <span class="stat-label">Límite</span>
                    </div>
                </div>
                
                <div class="user-actions">
                    <button class="action-btn secondary" onclick="dashboard.editUser('${user.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="action-btn primary" onclick="dashboard.viewUserAccounts('${user.id}')">
                        <i class="fas fa-eye"></i> Ver Cuentas
                    </button>
                    <button class="action-btn danger" onclick="dashboard.deleteUser('${user.id}')">
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
            `<option value="${user.id}">${user.name} (${user.email})</option>`,
        )
        .join("");
  }

  // Account Management
  async loadAccounts() {
    try {
      // Simulate API call
      const mockAccounts = [
        {
          id: "1",
          username: "demo_account_1",
          userId: "1",
          isActive: true,
          stats: {
            followers: 1250,
            following: 890,
            posts: 45,
            engagement: 3.2,
          },
          settings: {
            autoLike: true,
            autoComment: true,
            autoFollow: false,
            maxLikesPerHour: 60,
            targetHashtags: ["technology", "ai"],
          },
          lastActivity: new Date(),
        },
        {
          id: "2",
          username: "demo_account_2",
          userId: "2",
          isActive: false,
          stats: {
            followers: 850,
            following: 420,
            posts: 23,
            engagement: 2.8,
          },
          settings: {
            autoLike: true,
            autoComment: false,
            autoFollow: false,
            maxLikesPerHour: 40,
            targetHashtags: ["startup", "business"],
          },
          lastActivity: new Date(Date.now() - 3600000),
        },
      ];

      this.accounts = mockAccounts;
      this.renderAccounts();
      this.addLogEntry(
        "info",
        `Cargadas ${mockAccounts.length} cuentas de Instagram`,
      );
    } catch (error) {
      this.addLogEntry("error", `Error cargando cuentas: ${error.message}`);
    }
  }

  renderAccounts() {
    const accountsGrid = document.getElementById("accountsGrid");
    if (!accountsGrid) return;

    accountsGrid.innerHTML = this.accounts
      .map((account) => {
        const user = this.users.find((u) => u.id === account.userId);
        return `
                <div class="account-card">
                    <div class="account-header">
                        <div class="account-info">
                            <h4>@${account.username}</h4>
                            <p>Propietario: ${user?.name || "N/A"}</p>
                        </div>
                        <div class="status-indicator ${account.isActive ? "active" : ""}"></div>
                    </div>
                    
                    <div class="account-stats">
                        <div class="stat-box">
                            <span class="stat-number">${this.formatNumber(account.stats.followers)}</span>
                            <span class="stat-label">Seguidores</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-number">${this.formatNumber(account.stats.following)}</span>
                            <span class="stat-label">Siguiendo</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-number">${account.stats.posts}</span>
                            <span class="stat-label">Posts</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-number">${account.stats.engagement}%</span>
                            <span class="stat-label">Engagement</span>
                        </div>
                    </div>
                    
                    <div class="account-features">
                        <div class="feature ${account.settings.autoLike ? "active" : ""}">
                            <i class="fas fa-heart"></i> Auto Like
                        </div>
                        <div class="feature ${account.settings.autoComment ? "active" : ""}">
                            <i class="fas fa-comment"></i> Auto Comment
                        </div>
                        <div class="feature ${account.settings.autoFollow ? "active" : ""}">
                            <i class="fas fa-user-plus"></i> Auto Follow
                        </div>
                    </div>
                    
                    <div class="account-actions">
                        <button class="action-btn ${account.isActive ? "danger" : "primary"}" 
                                onclick="dashboard.toggleAccount('${account.id}')">
                            <i class="fas fa-${account.isActive ? "stop" : "play"}"></i>
                            ${account.isActive ? "Detener" : "Iniciar"}
                        </button>
                        <button class="action-btn secondary" onclick="dashboard.editAccount('${account.id}')">
                            <i class="fas fa-cog"></i> Configurar
                        </button>
                        <button class="action-btn danger" onclick="dashboard.deleteAccount('${account.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  // Analytics
  async loadAnalytics(timeRange = "24h") {
    try {
      // Simulate analytics data
      const mockAnalytics = {
        totalLikes: Math.floor(Math.random() * 1000) + 500,
        totalComments: Math.floor(Math.random() * 200) + 100,
        totalFollows: Math.floor(Math.random() * 50) + 25,
        engagementRate: (Math.random() * 5 + 2).toFixed(1),
      };

      this.analyticsData = mockAnalytics;
      this.renderAnalytics();
      this.renderHourlyChart();
      this.renderHashtagAnalytics();
      this.renderAccountPerformance();

      this.addLogEntry("info", `Analíticas cargadas para ${timeRange}`);
    } catch (error) {
      this.addLogEntry("error", `Error cargando analíticas: ${error.message}`);
    }
  }

  renderAnalytics() {
    document.getElementById("totalLikes").textContent = this.formatNumber(
      this.analyticsData.totalLikes,
    );
    document.getElementById("totalComments").textContent = this.formatNumber(
      this.analyticsData.totalComments,
    );
    document.getElementById("totalFollows").textContent = this.formatNumber(
      this.analyticsData.totalFollows,
    );
    document.getElementById("engagementRate").textContent =
      this.analyticsData.engagementRate + "%";
  }

  renderHourlyChart() {
    const canvas = document.getElementById("hourlyActivityChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate mock hourly data
    const hours = 24;
    const data = Array.from({ length: hours }, () => Math.random() * 100);
    const maxValue = Math.max(...data);

    // Draw chart
    ctx.strokeStyle = "#667eea";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < hours; i++) {
      const x = (i / (hours - 1)) * width;
      const y = height - (data[i] / maxValue) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Add gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(102, 126, 234, 0.3)");
    gradient.addColorStop(1, "rgba(102, 126, 234, 0)");

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  renderHashtagAnalytics() {
    const container = document.getElementById("hashtagAnalytics");
    if (!container) return;

    const hashtags = [
      { name: "#technology", likes: 245, comments: 32 },
      { name: "#ai", likes: 189, comments: 28 },
      { name: "#programming", likes: 156, comments: 22 },
      { name: "#startup", likes: 134, comments: 18 },
    ];

    container.innerHTML = hashtags
      .map(
        (tag) => `
            <div class="hashtag-item">
                <span class="hashtag-name">${tag.name}</span>
                <div class="hashtag-stats">
                    <span>${tag.likes} likes</span>
                    <span>${tag.comments} comentarios</span>
                </div>
            </div>
        `,
      )
      .join("");
  }

  renderAccountPerformance() {
    const tbody = document.getElementById("performanceTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.accounts
      .map((account) => {
        const user = this.users.find((u) => u.id === account.userId);
        return `
                <tr>
                    <td>@${account.username}</td>
                    <td>${this.formatNumber(account.stats.followers)}</td>
                    <td>${Math.floor(Math.random() * 100)}</td>
                    <td>${Math.floor(Math.random() * 20)}</td>
                    <td>${account.stats.engagement}%</td>
                    <td>
                        <span class="status-badge ${account.isActive ? "active" : "inactive"}">
                            ${account.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                </tr>
            `;
      })
      .join("");
  }

  // Modal functions
  showAddUserModal() {
    document.getElementById("addUserModal").classList.add("active");
  }

  showAddAccountModal() {
    this.updateUserSelect();
    document.getElementById("addAccountModal").classList.add("active");
  }

  async handleAddUser(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      role: document.getElementById("userRole").value,
      subscription: {
        plan: document.getElementById("subscriptionPlan").value,
        accountsLimit: this.getAccountsLimit(
          document.getElementById("subscriptionPlan").value,
        ),
      },
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        instagramAccounts: 0,
        createdAt: new Date(),
      };

      this.users.push(newUser);
      this.renderUsers();
      this.updateUserSelect();

      document.getElementById("addUserModal").classList.remove("active");
      document.getElementById("addUserForm").reset();

      this.addLogEntry("info", `Usuario creado: ${userData.name}`);
      rionaUtils.showNotification("Usuario creado exitosamente", "success");
    } catch (error) {
      this.addLogEntry("error", `Error creando usuario: ${error.message}`);
      rionaUtils.showNotification("Error al crear usuario", "error");
    }
  }

  async handleAddAccount(e) {
    e.preventDefault();

    const accountData = {
      username: document.getElementById("igUsername").value,
      password: document.getElementById("igPassword").value,
      userId: document.getElementById("selectUser").value,
      settings: {
        autoLike: document.getElementById("enableAutoLike").checked,
        autoComment: document.getElementById("enableAutoComment").checked,
        autoFollow: document.getElementById("enableAutoFollow").checked,
        maxLikesPerHour: parseInt(
          document.getElementById("maxLikesInput").value,
        ),
        maxCommentsPerHour: parseInt(
          document.getElementById("maxCommentsInput").value,
        ),
        maxFollowsPerHour: parseInt(
          document.getElementById("maxFollowsInput").value,
        ),
        targetHashtags: document
          .getElementById("targetHashtagsInput")
          .value.split(",")
          .map((tag) => tag.trim()),
      },
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newAccount = {
        id: Date.now().toString(),
        ...accountData,
        isActive: false,
        stats: {
          followers: 0,
          following: 0,
          posts: 0,
          engagement: 0,
        },
        lastActivity: new Date(),
      };

      this.accounts.push(newAccount);
      this.renderAccounts();

      // Update user's account count
      const user = this.users.find((u) => u.id === accountData.userId);
      if (user) {
        user.instagramAccounts++;
        this.renderUsers();
      }

      document.getElementById("addAccountModal").classList.remove("active");
      document.getElementById("addAccountForm").reset();

      this.addLogEntry(
        "info",
        `Cuenta de Instagram agregada: @${accountData.username}`,
      );
      rionaUtils.showNotification("Cuenta agregada exitosamente", "success");
    } catch (error) {
      this.addLogEntry("error", `Error agregando cuenta: ${error.message}`);
      rionaUtils.showNotification("Error al agregar cuenta", "error");
    }
  }

  // Account management functions
  async toggleAccount(accountId) {
    const account = this.accounts.find((a) => a.id === accountId);
    if (!account) return;

    try {
      account.isActive = !account.isActive;
      this.renderAccounts();

      const action = account.isActive ? "iniciada" : "detenida";
      this.addLogEntry(
        "info",
        `Automatización ${action} para @${account.username}`,
      );
      rionaUtils.showNotification(`Automatización ${action}`, "success");
    } catch (error) {
      this.addLogEntry("error", `Error controlando cuenta: ${error.message}`);
      rionaUtils.showNotification("Error al controlar automatización", "error");
    }
  }

  async deleteAccount(accountId) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta cuenta?")) return;

    try {
      const accountIndex = this.accounts.findIndex((a) => a.id === accountId);
      if (accountIndex === -1) return;

      const account = this.accounts[accountIndex];
      this.accounts.splice(accountIndex, 1);
      this.renderAccounts();

      // Update user's account count
      const user = this.users.find((u) => u.id === account.userId);
      if (user) {
        user.instagramAccounts--;
        this.renderUsers();
      }

      this.addLogEntry("info", `Cuenta eliminada: @${account.username}`);
      rionaUtils.showNotification("Cuenta eliminada", "success");
    } catch (error) {
      this.addLogEntry("error", `Error eliminando cuenta: ${error.message}`);
      rionaUtils.showNotification("Error al eliminar cuenta", "error");
    }
  }

  async deleteUser(userId) {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar este usuario? Se eliminarán todas sus cuentas de Instagram.",
      )
    )
      return;

    try {
      const userIndex = this.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) return;

      const user = this.users[userIndex];

      // Remove user's accounts
      this.accounts = this.accounts.filter((a) => a.userId !== userId);
      this.renderAccounts();

      // Remove user
      this.users.splice(userIndex, 1);
      this.renderUsers();
      this.updateUserSelect();

      this.addLogEntry("info", `Usuario eliminado: ${user.name}`);
      rionaUtils.showNotification("Usuario eliminado", "success");
    } catch (error) {
      this.addLogEntry("error", `Error eliminando usuario: ${error.message}`);
      rionaUtils.showNotification("Error al eliminar usuario", "error");
    }
  }

  // Settings
  loadSettings() {
    // Load from localStorage or API
    const settings = JSON.parse(localStorage.getItem("rionaSettings") || "{}");

    // Apply settings to form
    Object.keys(settings).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === "checkbox") {
          element.checked = settings[key];
        } else {
          element.value = settings[key];
        }
      }
    });
  }

  async saveSettings() {
    const settings = {};
    const formElements = document.querySelectorAll(
      "#settings input, #settings select",
    );

    formElements.forEach((element) => {
      if (element.type === "checkbox") {
        settings[element.id] = element.checked;
      } else {
        settings[element.id] = element.value;
      }
    });

    try {
      // Save to localStorage
      localStorage.setItem("rionaSettings", JSON.stringify(settings));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.addLogEntry("info", "Configuración guardada exitosamente");
      rionaUtils.showNotification("Configuración guardada", "success");
    } catch (error) {
      this.addLogEntry(
        "error",
        `Error guardando configuración: ${error.message}`,
      );
      rionaUtils.showNotification("Error al guardar configuración", "error");
    }
  }

  async createBackup() {
    try {
      const backupBtn = document.getElementById("backupNowBtn");
      backupBtn.disabled = true;
      backupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

      // Simulate backup creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const backupData = {
        users: this.users,
        accounts: this.accounts.map((acc) => ({ ...acc, password: "***" })), // Remove passwords
        settings: JSON.parse(localStorage.getItem("rionaSettings") || "{}"),
        timestamp: new Date().toISOString(),
      };

      // Create and download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `riona-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.addLogEntry("info", "Respaldo creado exitosamente");
      rionaUtils.showNotification("Respaldo creado y descargado", "success");
    } catch (error) {
      this.addLogEntry("error", `Error creando respaldo: ${error.message}`);
      rionaUtils.showNotification("Error al crear respaldo", "error");
    } finally {
      const backupBtn = document.getElementById("backupNowBtn");
      backupBtn.disabled = false;
      backupBtn.innerHTML = '<i class="fas fa-download"></i> Respaldar Ahora';
    }
  }

  // Utility functions
  getAccountsLimit(plan) {
    const limits = {
      free: 1,
      basic: 5,
      premium: 20,
      enterprise: 999,
    };
    return limits[plan] || 1;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }
}

// Replace the original dashboard with extended version
document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new ExtendedDashboard();
});

// Add CSS for additional features
const additionalStyles = `
    .role-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .role-badge.admin {
        background: rgba(245, 101, 101, 0.1);
        color: #f56565;
    }
    
    .role-badge.user {
        background: rgba(72, 187, 120, 0.1);
        color: #48bb78;
    }
    
    .subscription-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .subscription-badge.free {
        background: rgba(160, 174, 192, 0.1);
        color: #a0aec0;
    }
    
    .subscription-badge.basic {
        background: rgba(66, 153, 225, 0.1);
        color: #4299e1;
    }
    
    .subscription-badge.premium {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
    }
    
    .subscription-badge.enterprise {
        background: rgba(245, 101, 101, 0.1);
        color: #f56565;
    }
    
    .account-features {
        display: flex;
        gap: 0.5rem;
        margin: 1rem 0;
        flex-wrap: wrap;
    }
    
    .feature {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        background: rgba(160, 174, 192, 0.1);
        color: #a0aec0;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .feature.active {
        background: rgba(72, 187, 120, 0.1);
        color: #48bb78;
    }
    
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-badge.active {
        background: rgba(72, 187, 120, 0.1);
        color: #48bb78;
    }
    
    .status-badge.inactive {
        background: rgba(245, 101, 101, 0.1);
        color: #f56565;
    }
`;

const extendedStyleSheet = document.createElement("style");
extendedStyleSheet.textContent = additionalStyles;
document.head.appendChild(extendedStyleSheet);
