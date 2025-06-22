// Sidebar Debug Tool
console.log("🔧 Sidebar Debug Tool Loading...");

function debugSidebar() {
  console.log("=".repeat(50));
  console.log("🔧 SIDEBAR DEBUG REPORT");
  console.log("=".repeat(50));

  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (!sidebar) {
    console.error("❌ Sidebar element not found!");
    return;
  }

  const computedStyle = window.getComputedStyle(sidebar);
  const rect = sidebar.getBoundingClientRect();

  console.log("📐 Window Info:", {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    isDesktop: window.innerWidth > 1024,
  });

  console.log("📦 Sidebar Element:", {
    exists: !!sidebar,
    classList: Array.from(sidebar.classList),
    id: sidebar.id,
  });

  console.log("🎨 Sidebar Inline Styles:", {
    transform: sidebar.style.transform,
    position: sidebar.style.position,
    left: sidebar.style.left,
    top: sidebar.style.top,
    display: sidebar.style.display,
    zIndex: sidebar.style.zIndex,
  });

  console.log("🎨 Sidebar Computed Styles:", {
    transform: computedStyle.transform,
    position: computedStyle.position,
    left: computedStyle.left,
    top: computedStyle.top,
    display: computedStyle.display,
    zIndex: computedStyle.zIndex,
    width: computedStyle.width,
    height: computedStyle.height,
  });

  console.log("📍 Sidebar Position:", {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    isVisible: rect.left >= 0 && rect.right > 0,
  });

  if (mainContent) {
    const mainRect = mainContent.getBoundingClientRect();
    const mainComputed = window.getComputedStyle(mainContent);

    console.log("📄 Main Content:", {
      marginLeft: mainComputed.marginLeft,
      left: mainRect.left,
      width: mainRect.width,
    });
  }

  // Check for any CSS media queries affecting the sidebar
  const mediaQueries = [
    "(min-width: 1025px)",
    "(max-width: 1024px)",
    "(max-width: 768px)",
    "(max-width: 480px)",
  ];

  console.log("📱 Media Query Matches:");
  mediaQueries.forEach((query) => {
    console.log(`  ${query}: ${window.matchMedia(query).matches}`);
  });

  console.log("=".repeat(50));
}

// Auto-run debug when script loads
debugSidebar();

// Also run after a delay
setTimeout(debugSidebar, 1000);

// Expose function globally
window.debugSidebar = debugSidebar;

// Add a button to manually run debug
const debugButton = document.createElement("button");
debugButton.textContent = "🔧 Debug Sidebar";
debugButton.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: red;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
`;
debugButton.onclick = debugSidebar;

// Add button when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(debugButton);
  });
} else {
  document.body.appendChild(debugButton);
}

console.log("✅ Sidebar Debug Tool Ready");
