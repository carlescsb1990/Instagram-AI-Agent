// Debug script para probar la visibilidad del sidebar
console.log("🔧 Debug Script - Probando Sidebar");

function debugSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  console.log("📊 Estado actual:", {
    sidebar: !!sidebar,
    sidebarComputed: sidebar ? window.getComputedStyle(sidebar) : null,
    sidebarTransform: sidebar
      ? window.getComputedStyle(sidebar).transform
      : null,
    sidebarDisplay: sidebar ? window.getComputedStyle(sidebar).display : null,
    sidebarLeft: sidebar ? window.getComputedStyle(sidebar).left : null,
    mainContentMarginLeft: mainContent
      ? window.getComputedStyle(mainContent).marginLeft
      : null,
    windowWidth: window.innerWidth,
  });

  if (sidebar) {
    console.log("🔧 Forzando visibilidad del sidebar...");
    sidebar.style.transform = "translateX(0) !important";
    sidebar.style.left = "0";
    sidebar.style.display = "flex";
    sidebar.style.position = "fixed";
    sidebar.style.zIndex = "100";

    if (mainContent) {
      mainContent.style.marginLeft = "280px";
    }

    console.log("✅ Sidebar debería estar visible ahora");
  } else {
    console.error("❌ Sidebar no encontrado");
  }
}

function toggleSidebarDebug() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
    console.log(
      "Toggle sidebar, active:",
      sidebar.classList.contains("active"),
    );
  }
}

// Ejecutar automáticamente
document.addEventListener("DOMContentLoaded", debugSidebar);

// También ejecutar ahora si el DOM ya está listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", debugSidebar);
} else {
  debugSidebar();
}

// Funciones globales para probar en consola
window.debugSidebar = debugSidebar;
window.toggleSidebarDebug = toggleSidebarDebug;

console.log(
  "🔧 Script de debug cargado. Usa debugSidebar() en la consola para probar.",
);
