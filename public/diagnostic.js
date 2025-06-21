// Comprehensive Diagnostic Script for Sidebar Issues

(function () {
  "use strict";

  console.log("🔧 INICIANDO DIAGNÓSTICO COMPLETO DEL SIDEBAR");
  console.log("==========================================");

  function createDebugPanel() {
    const debugPanel = document.createElement("div");
    debugPanel.className = "debug-info";
    debugPanel.innerHTML = `
            <h4>🔧 Debug Panel</h4>
            <div id="debug-content">Cargando...</div>
            <button onclick="window.forceSidebarFix()" style="margin-top: 10px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">
                🔨 Forzar Corrección
            </button>
        `;
    document.body.appendChild(debugPanel);
    return debugPanel;
  }

  function updateDebugInfo() {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const debugContent = document.getElementById("debug-content");

    if (debugContent) {
      const sidebarStyles = sidebar ? window.getComputedStyle(sidebar) : null;
      const mainStyles = mainContent
        ? window.getComputedStyle(mainContent)
        : null;

      debugContent.innerHTML = `
                <strong>Sidebar:</strong> ${sidebar ? "✅ Existe" : "❌ No existe"}<br>
                <strong>Transform:</strong> ${sidebarStyles?.transform || "N/A"}<br>
                <strong>Left:</strong> ${sidebarStyles?.left || "N/A"}<br>
                <strong>Display:</strong> ${sidebarStyles?.display || "N/A"}<br>
                <strong>Position:</strong> ${sidebarStyles?.position || "N/A"}<br>
                <strong>Width:</strong> ${sidebarStyles?.width || "N/A"}<br>
                <strong>Z-Index:</strong> ${sidebarStyles?.zIndex || "N/A"}<br>
                <hr>
                <strong>Main Margin:</strong> ${mainStyles?.marginLeft || "N/A"}<br>
                <strong>Window Width:</strong> ${window.innerWidth}px<br>
                <strong>Viewport:</strong> ${window.innerWidth > 1024 ? "Desktop" : "Mobile"}
            `;
    }
  }

  function forceSidebarFix() {
    console.log("🔨 APLICANDO CORRECCIÓN FORZADA");

    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    if (sidebar) {
      // Forzar estilos directamente
      sidebar.style.cssText = `
                transform: translateX(0px) !important;
                left: 0px !important;
                position: fixed !important;
                display: flex !important;
                width: 280px !important;
                min-height: 100vh !important;
                background: #1e293b !important;
                color: white !important;
                z-index: 100 !important;
                flex-direction: column !important;
                top: 0px !important;
            `;

      console.log("✅ Estilos de sidebar aplicados");
    }

    if (mainContent) {
      mainContent.style.cssText = `
                margin-left: 280px !important;
                min-height: 100vh !important;
                display: flex !important;
                flex-direction: column !important;
            `;

      console.log("✅ Estilos de main-content aplicados");
    }

    // Verificar que los elementos de navegación sean clickeables
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item, index) => {
      item.style.cssText = `
                display: flex !important;
                align-items: center !important;
                gap: 1rem !important;
                padding: 1rem 1.5rem !important;
                color: rgba(255, 255, 255, 0.8) !important;
                text-decoration: none !important;
                transition: all 0.15s ease-in-out !important;
                position: relative !important;
                cursor: pointer !important;
            `;

      // Agregar event listener si no existe
      if (!item.hasAttribute("data-fixed")) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const page = this.getAttribute("data-page");
          console.log("🔗 Navegando a:", page);
          if (window.dashboard && window.dashboard.showPage) {
            window.dashboard.showPage(page);
          }
        });
        item.setAttribute("data-fixed", "true");
      }
    });

    console.log("✅ Navegación reparada");
    updateDebugInfo();
  }

  function runDiagnostic() {
    console.log("📊 Ejecutando diagnóstico...");

    // Verificar elementos DOM
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const navItems = document.querySelectorAll(".nav-item");

    console.log("DOM Elements:", {
      sidebar: !!sidebar,
      mainContent: !!mainContent,
      navItems: navItems.length,
    });

    if (sidebar) {
      const rect = sidebar.getBoundingClientRect();
      const styles = window.getComputedStyle(sidebar);

      console.log("Sidebar Analysis:", {
        boundingRect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          visible: rect.left >= -280 && rect.left <= 0,
        },
        computedStyles: {
          transform: styles.transform,
          left: styles.left,
          position: styles.position,
          display: styles.display,
          width: styles.width,
          zIndex: styles.zIndex,
        },
      });

      if (rect.left < -200) {
        console.warn("⚠️ PROBLEMA DETECTADO: Sidebar está fuera de pantalla");
        setTimeout(forceSidebarFix, 100);
      }
    } else {
      console.error("❌ PROBLEMA CRÍTICO: Sidebar no encontrado en DOM");
    }

    updateDebugInfo();
  }

  // Exponer funciones globalmente para debug
  window.forceSidebarFix = forceSidebarFix;
  window.updateDebugInfo = updateDebugInfo;
  window.runDiagnostic = runDiagnostic;

  // Crear panel de debug
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      createDebugPanel();
      setTimeout(runDiagnostic, 500);
    });
  } else {
    createDebugPanel();
    setTimeout(runDiagnostic, 100);
  }

  // Monitor cambios en el sidebar
  const observer = new MutationObserver(() => {
    setTimeout(updateDebugInfo, 100);
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  console.log(
    "🔧 Script de diagnóstico cargado. Usa forceSidebarFix() para corregir.",
  );
})();
