// Documentation content for Riona AI Agent
const documentationContent = {
  overview: `
        <h2>🤖 Riona AI Agent - Guía Completa</h2>
        <p>Riona AI Agent es un sistema inteligente de automatización para redes sociales que utiliza IA generativa de Google Gemini.</p>
        
        <h3>🚀 Características Principales</h3>
        <ul>
            <li><strong>IA Generativa:</strong> Utiliza Google Gemini 2.0 Flash para generar contenido inteligente</li>
            <li><strong>Multi-Plataforma:</strong> Soporte completo para Instagram, Twitter y GitHub</li>
            <li><strong>Automatización Inteligente:</strong> Procesos automáticos de interacción y publicación</li>
            <li><strong>Caracteres Personalizables:</strong> Múltiples personalidades AI para diferentes contextos</li>
            <li><strong>Dashboard en Tiempo Real:</strong> Monitoreo completo con métricas detalladas</li>
            <li><strong>API REST:</strong> Endpoints completos para integración</li>
        </ul>
        
        <h3>🏗️ Arquitectura del Sistema</h3>
        <div class="code-block">
            <pre><code>┌─ Frontend Dashboard (HTML/CSS/JS)
├─ Backend API (Node.js + Express + TypeScript)
│  ├─ Sistema de Agentes AI (Google Gemini)
│  ├─ Automatización de Redes Sociales
│  │  ├─ Instagram (Puppeteer + Instagram API)
│  │  ├─ Twitter (Twitter API v2)
│  │  └─ GitHub (GitHub API)
│  ├─ Procesamiento de Contenido
│  ├─ Base de Datos (MongoDB - Opcional)
│  └─ Sistema de Logging (Winston)
└─ Configuración y Variables de Entorno</code></pre>
        </div>
        
        <h3>🔧 Tecnologías Utilizadas</h3>
        <ul>
            <li><strong>Backend:</strong> Node.js, Express.js, TypeScript</li>
            <li><strong>IA:</strong> Google Gemini API</li>
            <li><strong>Automatización:</strong> Puppeteer, Playwright</li>
            <li><strong>Base de Datos:</strong> MongoDB (opcional)</li>
            <li><strong>Frontend:</strong> HTML5, CSS3, JavaScript ES6+</li>
            <li><strong>Logging:</strong> Winston</li>
            <li><strong>Seguridad:</strong> Helmet, CORS</li>
        </ul>
    `,

  agent: `
        <h2>🧠 Sistema de Agentes AI</h2>
        <p>El sistema de agentes utiliza Google Gemini para generar contenido inteligente basado en caracteres personalizables.</p>
        
        <h3>🎭 Caracteres Disponibles</h3>
        <div class="docs-grid">
            <div class="docs-card">
                <h4>ArcanEdge System Agent</h4>
                <p>Especializado en prompt engineering y transformación digital</p>
                <ul>
                    <li>Comunicación AI dirigida por prompts</li>
                    <li>Soluciones empresariales</li>
                    <li>Estrategias de IA</li>
                </ul>
            </div>
            <div class="docs-card">
                <h4>Elon Character</h4>
                <p>Personalidad emprendedora e innovadora</p>
                <ul>
                    <li>Tecnología y innovación</li>
                    <li>Emprendimiento</li>
                    <li>Visión futurista</li>
                </ul>
            </div>
            <div class="docs-card">
                <h4>Sample Character</h4>
                <p>Carácter de propósito general</p>
                <ul>
                    <li>Conversación general</li>
                    <li>Creación de contenido</li>
                    <li>Interacciones básicas</li>
                </ul>
            </div>
        </div>
        
        <h3>⚙️ Configuración del Agente</h3>
        <div class="code-block">
            <pre><code>// Estructura de un carácter
{
  "name": "Nombre del Carácter",
  "clients": ["Instagram", "Twitter", "GitHub"],
  "bio": ["Descripción 1", "Descripción 2"],
  "lore": ["Historia 1", "Historia 2"],
  "knowledge": ["Conocimiento 1", "Conocimiento 2"],
  "style": {
    "all": ["friendly", "professional"],
    "chat": ["casual", "supportive"],
    "post": ["engaging", "informative"]
  },
  "topics": ["tema1", "tema2", "tema3"]
}</code></pre>
        </div>
        
        <h3>🔄 Flujo de Generación</h3>
        <ol>
            <li><strong>Entrada:</strong> Prompt del usuario + Tipo de contenido</li>
            <li><strong>Procesamiento:</strong> Selección de carácter + Contexto</li>
            <li><strong>IA:</strong> Generación con Google Gemini</li>
            <li><strong>Salida:</strong> Contenido optimizado para la plataforma</li>
        </ol>
    `,

  social: `
        <h2>📱 Gestión de Redes Sociales</h2>
        <p>Control centralizado de múltiples plataformas de redes sociales con automatización inteligente.</p>
        
        <h3>📸 Instagram</h3>
        <div class="platform-docs">
            <h4>Funcionalidades</h4>
            <ul>
                <li>Automatización de comentarios inteligentes</li>
                <li>Interacción con posts</li>
                <li>Generación de contenido contextual</li>
                <li>Gestión de cookies y sesiones</li>
            </ul>
            
            <h4>Configuración</h4>
            <div class="code-block">
                <pre><code># Variables de entorno requeridas
IGusername=tu_usuario_instagram
IGpassword=tu_contraseña_instagram</code></pre>
            </div>
            
            <h4>Estado de Automatización</h4>
            <ul>
                <li><span class="status-indicator active"></span> <strong>Configurado:</strong> Credenciales válidas</li>
                <li><span class="status-indicator"></span> <strong>No configurado:</strong> Faltan credenciales</li>
            </ul>
        </div>
        
        <h3>🐦 Twitter</h3>
        <div class="platform-docs">
            <h4>Funcionalidades</h4>
            <ul>
                <li>Publicación automática de tweets</li>
                <li>Respuestas automatizadas</li>
                <li>Análisis de engagement</li>
                <li>Límites de rate limiting</li>
            </ul>
            
            <h4>Configuración</h4>
            <div class="code-block">
                <pre><code># API Keys requeridas
TWITTER_API_KEY=tu_api_key
TWITTER_API_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_secret
TWITTER_BEARER_TOKEN=tu_bearer_token</code></pre>
            </div>
        </div>
        
        <h3>🐙 GitHub</h3>
        <div class="platform-docs">
            <h4>Funcionalidades (En Desarrollo)</h4>
            <ul>
                <li>Monitoreo de repositorios</li>
                <li>Automatización de issues</li>
                <li>Análisis de pull requests</li>
                <li>Generación de documentación</li>
            </ul>
        </div>
        
        <h3>🔄 Control de Automatización</h3>
        <p>Cada plataforma puede ser controlada independientemente:</p>
        <ul>
            <li><strong>Iniciar:</strong> Activa la automatización para la plataforma</li>
            <li><strong>Detener:</strong> Pausa la automatización temporalmente</li>
            <li><strong>Estado:</strong> Monitoreo en tiempo real del estado</li>
        </ul>
    `,

  api: `
        <h2>🔌 API Reference</h2>
        <p>Documentación completa de la API REST de Riona AI Agent.</p>
        
        <h3>🏠 Endpoints Principales</h3>
        
        <div class="api-endpoint">
            <h4><span class="method get">GET</span> /</h4>
            <p>Información general del sistema y endpoints disponibles</p>
            <div class="code-block">
                <pre><code>{
  "name": "Riona AI Agent",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {...}
}</code></pre>
            </div>
        </div>
        
        <div class="api-endpoint">
            <h4><span class="method get">GET</span> /health</h4>
            <p>Estado de salud del sistema con métricas detalladas</p>
            <div class="code-block">
                <pre><code>{
  "status": "healthy",
  "uptime": 3600,
  "memory": {...},
  "database": "configured",
  "ai": {...}
}</code></pre>
            </div>
        </div>
        
        <div class="api-endpoint">
            <h4><span class="method get">GET</span> /agent</h4>
            <p>Estado del agente AI y configuración actual</p>
            <div class="code-block">
                <pre><code>{
  "status": "running",
  "currentCharacter": "ArcanEdge.System.Agent",
  "automation": {...}
}</code></pre>
            </div>
        </div>
        
        <div class="api-endpoint">
            <h4><span class="method get">GET</span> /social</h4>
            <p>Estado de todas las plataformas sociales</p>
            <div class="code-block">
                <pre><code>{
  "platforms": {
    "instagram": {"status": "configured"},
    "twitter": {"status": "not_configured"},
    "github": {"status": "available"}
  }
}</code></pre>
            </div>
        </div>
        
        <h3>🤖 Endpoints de IA</h3>
        
        <div class="api-endpoint">
            <h4><span class="method post">POST</span> /api/generate</h4>
            <p>Genera contenido usando IA</p>
            <h5>Request Body:</h5>
            <div class="code-block">
                <pre><code>{
  "prompt": "Tu prompt aquí",
  "type": "comment|tweet|post"
}</code></pre>
            </div>
            <h5>Response:</h5>
            <div class="code-block">
                <pre><code>{
  "success": true,
  "data": {
    "content": "Contenido generado",
    "type": "comment",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}</code></pre>
            </div>
        </div>
        
        <div class="api-endpoint">
            <h4><span class="method get">GET</span> /api/characters</h4>
            <p>Lista de caracteres AI disponibles</p>
            <div class="code-block">
                <pre><code>{
  "success": true,
  "data": [
    {
      "id": "arcane-edge",
      "name": "ArcanEdge System Agent",
      "description": "...",
      "active": true
    }
  ]
}</code></pre>
            </div>
        </div>
        
        <h3>📱 Control de Plataformas</h3>
        
        <div class="api-endpoint">
            <h4><span class="method post">POST</span> /api/social/:platform/:action</h4>
            <p>Controla la automatización de plataformas</p>
            <ul>
                <li><strong>platform:</strong> instagram | twitter | github</li>
                <li><strong>action:</strong> start | stop</li>
            </ul>
            <div class="code-block">
                <pre><code>{
  "success": true,
  "message": "start action for instagram executed",
  "platform": "instagram",
  "action": "start"
}</code></pre>
            </div>
        </div>
        
        <h3>📊 Códigos de Estado</h3>
        <ul>
            <li><strong>200:</strong> Éxito</li>
            <li><strong>400:</strong> Error en la petición</li>
            <li><strong>404:</strong> Endpoint no encontrado</li>
            <li><strong>500:</strong> Error interno del servidor</li>
        </ul>
    `,

  troubleshooting: `
        <h2>🔧 Solución de Problemas</h2>
        <p>Guía para resolver problemas comunes en Riona AI Agent.</p>
        
        <h3>🚨 Problemas Comunes</h3>
        
        <div class="troubleshoot-item">
            <h4>❌ Error: "Cannot GET /"</h4>
            <div class="problem">
                <strong>Problema:</strong> El servidor no responde en la ruta principal
            </div>
            <div class="solution">
                <strong>Solución:</strong>
                <ol>
                    <li>Verificar que el servidor esté ejecutándose en puerto 3000</li>
                    <li>Comprobar logs del servidor</li>
                    <li>Reiniciar el servicio con <code>npm run start</code></li>
                </ol>
            </div>
        </div>
        
        <div class="troubleshoot-item">
            <h4>❌ Error de Compilación TypeScript</h4>
            <div class="problem">
                <strong>Problema:</strong> Errores de TypeScript al compilar
            </div>
            <div class="solution">
                <strong>Solución:</strong>
                <ol>
                    <li>Ejecutar <code>npm run build</code> para ver errores específicos</li>
                    <li>Verificar tipos y importaciones</li>
                    <li>Comprobar tsconfig.json</li>
                </ol>
            </div>
        </div>
        
        <div class="troubleshoot-item">
            <h4>❌ Instagram: "Credenciales no configuradas"</h4>
            <div class="problem">
                <strong>Problema:</strong> La automatización de Instagram está deshabilitada
            </div>
            <div class="solution">
                <strong>Solución:</strong>
                <ol>
                    <li>Configurar variables de entorno:
                        <div class="code-block">
                            <pre><code>IGusername=tu_usuario
IGpassword=tu_contraseña</code></pre>
                        </div>
                    </li>
                    <li>Reiniciar el servidor</li>
                    <li>Verificar en Dashboard > Redes Sociales</li>
                </ol>
            </div>
        </div>
        
        <div class="troubleshoot-item">
            <h4>❌ Error: "MongoDB URI not provided"</h4>
            <div class="problem">
                <strong>Problema:</strong> Base de datos no configurada
            </div>
            <div class="solution">
                <strong>Solución:</strong>
                <p>En modo desarrollo esto es normal. Para usar MongoDB:</p>
                <ol>
                    <li>Configurar MONGODB_URI en .env</li>
                    <li>O mantener modo desarrollo sin base de datos</li>
                </ol>
            </div>
        </div>
        
        <div class="troubleshoot-item">
            <h4>❌ Error: "Puppeteer browser failed to launch"</h4>
            <div class="problem">
                <strong>Problema:</strong> Puppeteer no puede lanzar el navegador
            </div>
            <div class="solution">
                <strong>Solución:</strong>
                <ol>
                    <li>Verificar configuración de Puppeteer</li>
                    <li>Asegurar modo headless en producción</li>
                    <li>Comprobar dependencias del sistema</li>
                </ol>
            </div>
        </div>
        
        <h3>📊 Logs y Monitoreo</h3>
        <div class="code-block">
            <pre><code># Ver logs en tiempo real
tail -f logs/application.log

# Comprobar estado del sistema
curl http://localhost:3000/health

# Verificar API
curl http://localhost:3000/agent</code></pre>
        </div>
        
        <h3>🔄 Comandos Útiles</h3>
        <div class="code-block">
            <pre><code># Reinstalar dependencias
npm install

# Compilar TypeScript
npm run build

# Iniciar servidor
npm run start

# Verificar tipos
npx tsc --noEmit</code></pre>
        </div>
        
        <h3>📞 Obtener Ayuda</h3>
        <ul>
            <li><strong>Logs del Sistema:</strong> Dashboard > Registro de Actividad</li>
            <li><strong>Estado de Salud:</strong> <code>GET /health</code></li>
            <li><strong>Documentación:</strong> Dashboard > Documentación</li>
            <li><strong>GitHub Issues:</strong> Reportar problemas en el repositorio</li>
        </ul>
    `,
};

// Initialize documentation when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeDocumentation();
});

function initializeDocumentation() {
  // Load initial documentation content
  loadDocumentationContent("overview");

  // Setup navigation
  const docNavItems = document.querySelectorAll(".docs-nav-item");
  docNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetDoc = item.dataset.doc;
      loadDocumentationContent(targetDoc);

      // Update active nav item
      docNavItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function loadDocumentationContent(section) {
  const content = documentationContent[section];
  if (content) {
    // Find the docs-overview element and update its content
    const docsContainer = document.querySelector(".docs-main");
    if (docsContainer) {
      docsContainer.innerHTML = `<div class="docs-page active">${content}</div>`;
    }
  }
}

// Add CSS for documentation styling
const docsStyles = `
    .docs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .docs-card {
        background: rgba(247, 250, 252, 0.8);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .docs-card h4 {
        color: #2d3748;
        margin-bottom: 0.5rem;
    }
    
    .platform-docs {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(247, 250, 252, 0.8);
        border-radius: 8px;
    }
    
    .api-endpoint {
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(247, 250, 252, 0.8);
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }
    
    .method {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-weight: bold;
        font-size: 0.75rem;
    }
    
    .method.get {
        background: rgba(72, 187, 120, 0.2);
        color: #48bb78;
    }
    
    .method.post {
        background: rgba(66, 153, 225, 0.2);
        color: #4299e1;
    }
    
    .troubleshoot-item {
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(247, 250, 252, 0.8);
        border-radius: 8px;
        border-left: 4px solid #f56565;
    }
    
    .problem {
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: rgba(245, 101, 101, 0.1);
        border-radius: 4px;
    }
    
    .solution {
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: rgba(72, 187, 120, 0.1);
        border-radius: 4px;
    }
    
    .status-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e2e8f0;
        margin-right: 0.5rem;
    }
    
    .status-indicator.active {
        background: #48bb78;
    }
`;

// Add styles to page
const styleSheet = document.createElement("style");
styleSheet.textContent = docsStyles;
document.head.appendChild(styleSheet);
