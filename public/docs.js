// Riona AI Agent - Documentation System

class DocumentationSystem {
  constructor() {
    this.currentSection = "getting-started";
    this.setupEventListeners();
    this.loadDefaultContent();
  }

  setupEventListeners() {
    // Navigation items
    document.querySelectorAll(".docs-nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const section = item.getAttribute("href").substring(1);
        this.showSection(section);
      });
    });

    // Search functionality
    const searchInput = document.getElementById("docsSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchDocs(e.target.value);
      });
    }
  }

  showSection(sectionId) {
    // Update navigation
    document.querySelectorAll(".docs-nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    const activeItem = document.querySelector(`[href="#${sectionId}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
    }

    // Load content
    this.currentSection = sectionId;
    this.loadContent(sectionId);
  }

  loadContent(sectionId) {
    const docsMain = document.getElementById("docsMain");
    if (!docsMain) return;

    const content = this.getContentForSection(sectionId);
    docsMain.innerHTML = content;

    // Add syntax highlighting for code blocks
    this.highlightCode();
  }

  getContentForSection(sectionId) {
    const sections = {
      "getting-started": this.getGettingStartedContent(),
      "instagram-setup": this.getInstagramSetupContent(),
      "automation-guide": this.getAutomationGuideContent(),
      "ai-configuration": this.getAIConfigurationContent(),
      "best-practices": this.getBestPracticesContent(),
      troubleshooting: this.getTroubleshootingContent(),
      "api-reference": this.getAPIReferenceContent(),
    };

    return sections[sectionId] || this.getDefaultContent();
  }

  getGettingStartedContent() {
    return `
            <div class="docs-section">
                <h1>🚀 Primeros Pasos con Riona AI Agent</h1>
                
                <div class="docs-intro">
                    <p>Bienvenido a <strong>Riona AI Agent</strong>, el sistema más avanzado de automatización para redes sociales con inteligencia artificial integrada.</p>
                </div>

                <h2>¿Qué es Riona AI Agent?</h2>
                <p>Riona AI Agent es una plataforma completa que combina:</p>
                <ul>
                    <li><strong>Automatización de Instagram:</strong> Likes, comentarios, follows y DMs automáticos</li>
                    <li><strong>Inteligencia Artificial:</strong> Generación de contenido contextual usando Google Gemini 2.0</li>
                    <li><strong>Gestión Multi-Usuario:</strong> Soporte para múltiples usuarios y cuentas</li>
                    <li><strong>Analytics Avanzados:</strong> Métricas detalladas y reportes en tiempo real</li>
                    <li><strong>Anti-Detección:</strong> Técnicas profesionales para evitar restricciones</li>
                </ul>

                <h2>Características Principales</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>🤖 AI Generativa</h3>
                        <p>50 claves API de Google Gemini para generar comentarios contextualmente relevantes y naturales.</p>
                    </div>
                    
                    <div class="feature-card">
                        <h3>📱 Automatización Instagram</h3>
                        <p>Sistema completo de automatización: likes, comentarios, follows, unfollows, DMs y stories.</p>
                    </div>
                    
                    <div class="feature-card">
                        <h3>👥 Multi-Usuario</h3>
                        <p>Gestión de múltiples usuarios con roles, suscripciones y límites personalizados.</p>
                    </div>
                    
                    <div class="feature-card">
                        <h3>📊 Analytics Pro</h3>
                        <p>Métricas detalladas, gráficos en tiempo real y reportes de rendimiento.</p>
                    </div>
                </div>

                <h2>Instalación Rápida</h2>
                <div class="code-block">
                    <pre><code># Clonar el repositorio
git clone https://github.com/tu-usuario/riona-ai-agent.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar el servidor
npm start</code></pre>
                </div>

                <h2>Primeros Pasos</h2>
                <ol class="steps-list">
                    <li>
                        <strong>Configurar el Sistema:</strong>
                        <p>Ve a <strong>Configuración</strong> para ajustar las preferencias del AI y configuraciones de seguridad.</p>
                    </li>
                    
                    <li>
                        <strong>Agregar Usuario:</strong>
                        <p>En <strong>Automatización</strong>, crea tu primer usuario con el plan de suscripción apropiado.</p>
                    </li>
                    
                    <li>
                        <strong>Conectar Instagram:</strong>
                        <p>Agrega tu primera cuenta de Instagram con credenciales y configuraciones de automatización.</p>
                    </li>
                    
                    <li>
                        <strong>Configurar AI:</strong>
                        <p>En <strong>Agente AI</strong>, selecciona la personalidad y configura el estilo de contenido.</p>
                    </li>
                    
                    <li>
                        <strong>Ejecutar Automatización:</strong>
                        <p>Desde <strong>Redes Sociales</strong>, inicia las automatizaciones y monitorea en tiempo real.</p>
                    </li>
                </ol>

                <div class="warning-box">
                    <h3>⚠️ Importante</h3>
                    <p>Siempre empieza con configuraciones conservadoras (30-50 acciones/hora) y aumenta gradualmente para evitar restricciones de Instagram.</p>
                </div>

                <h2>Próximos Pasos</h2>
                <div class="next-steps">
                    <a href="#instagram-setup" class="step-link">📱 Configurar Instagram</a>
                    <a href="#ai-configuration" class="step-link">🤖 Configurar AI</a>
                    <a href="#automation-guide" class="step-link">⚡ Guía de Automatización</a>
                </div>
            </div>
        `;
  }

  getInstagramSetupContent() {
    return `
            <div class="docs-section">
                <h1>📱 Configuración de Instagram</h1>
                
                <p>Aprende a configurar y optimizar tus cuentas de Instagram para obtener los mejores resultados con Riona AI Agent.</p>

                <h2>Tipos de Cuenta Recomendados</h2>
                <div class="account-types">
                    <div class="account-type">
                        <h3>🆕 Cuenta Nueva</h3>
                        <ul>
                            <li>Ideal para pruebas iniciales</li>
                            <li>Permite configuraciones más agresivas</li>
                            <li>Menor riesgo para cuentas principales</li>
                        </ul>
                    </div>
                    
                    <div class="account-type">
                        <h3>🏢 Cuenta Business</h3>
                        <ul>
                            <li>Mejor para marcas y empresas</li>
                            <li>Acceso a estadísticas detalladas</li>
                            <li>Configuraciones conservadoras recomendadas</li>
                        </ul>
                    </div>
                    
                    <div class="account-type">
                        <h3>👤 Cuenta Personal</h3>
                        <ul>
                            <li>Para crecimiento personal</li>
                            <li>Configuraciones moderadas</li>
                            <li>Enfoque en engagement genuino</li>
                        </ul>
                    </div>
                </div>

                <h2>Paso a Paso: Agregar Cuenta</h2>
                <ol class="detailed-steps">
                    <li>
                        <h3>Acceder al Panel de Automatización</h3>
                        <p>Ve a <strong>Automatización</strong> → <strong>Agregar Cuenta</strong></p>
                    </li>
                    
                    <li>
                        <h3>Seleccionar Usuario</h3>
                        <p>Elige el usuario al que asociar la cuenta (o crea uno nuevo)</p>
                    </li>
                    
                    <li>
                        <h3>Credenciales de Instagram</h3>
                        <div class="code-block">
                            <pre><code>Usuario: @tu_usuario_instagram
Contraseña: tu_contraseña_segura</code></pre>
                        </div>
                        <div class="security-note">
                            <strong>🔒 Seguridad:</strong> Las credenciales se encriptan automáticamente
                        </div>
                    </li>
                    
                    <li>
                        <h3>Configurar Automatización</h3>
                        <table class="config-table">
                            <tr>
                                <th>Función</th>
                                <th>Principiante</th>
                                <th>Intermedio</th>
                                <th>Avanzado</th>
                            </tr>
                            <tr>
                                <td>Likes/hora</td>
                                <td>30-50</td>
                                <td>60-90</td>
                                <td>100-150</td>
                            </tr>
                            <tr>
                                <td>Comentarios/hora</td>
                                <td>10-20</td>
                                <td>25-40</td>
                                <td>50-80</td>
                            </tr>
                            <tr>
                                <td>Follows/hora</td>
                                <td>15-25</td>
                                <td>30-45</td>
                                <td>60-100</td>
                            </tr>
                        </table>
                    </li>
                    
                    <li>
                        <h3>Hashtags Objetivo</h3>
                        <p>Selecciona hashtags relevantes para tu nicho:</p>
                        <div class="hashtag-examples">
                            <div class="niche">
                                <h4>Tecnología:</h4>
                                <code>technology, AI, programming, startup, innovation</code>
                            </div>
                            <div class="niche">
                                <h4>Fitness:</h4>
                                <code>fitness, gym, workout, health, motivation</code>
                            </div>
                            <div class="niche">
                                <h4>Business:</h4>
                                <code>entrepreneur, business, marketing, success, leadership</code>
                            </div>
                        </div>
                    </li>
                </ol>

                <h2>Configuraciones Avanzadas</h2>
                
                <h3>Anti-Detección</h3>
                <ul>
                    <li><strong>Delays Aleatorios:</strong> Entre 2-8 segundos entre acciones</li>
                    <li><strong>Horarios Humanos:</strong> Actividad principalmente 9AM-11PM</li>
                    <li><strong>Pausas Naturales:</strong> Descansos de 15-30 minutos cada hora</li>
                    <li><strong>User Agent Rotation:</strong> Cambio automático de navegador</li>
                </ul>

                <h3>Mejores Prácticas</h3>
                <div class="best-practices">
                    <div class="practice">
                        <h4>✅ Hacer</h4>
                        <ul>
                            <li>Empezar con configuraciones bajas</li>
                            <li>Usar hashtags específicos de tu nicho</li>
                            <li>Monitorear métricas regularmente</li>
                            <li>Ajustar según resultados</li>
                        </ul>
                    </div>
                    
                    <div class="practice">
                        <h4>❌ Evitar</h4>
                        <ul>
                            <li>Configuraciones muy agresivas inicialmente</li>
                            <li>Hashtags genéricos o saturados</li>
                            <li>Ignorar señales de advertencia</li>
                            <li>Actividad 24/7 sin descansos</li>
                        </ul>
                    </div>
                </div>

                <div class="success-tip">
                    <h3>💡 Tip de Éxito</h3>
                    <p>El éxito en Instagram automation es 70% estrategia y 30% tecnología. Enfócate en contenido de calidad y engagement genuino.</p>
                </div>
            </div>
        `;
  }

  getAutomationGuideContent() {
    return `
            <div class="docs-section">
                <h1>⚡ Guía Completa de Automatización</h1>
                
                <p>Domina todos los aspectos de la automatización de Instagram con Riona AI Agent.</p>

                <h2>Funciones de Automatización</h2>

                <div class="automation-functions">
                    <div class="function-card">
                        <h3>❤️ Likes Automáticos</h3>
                        <p><strong>Función:</strong> Da likes automáticamente a posts basados en hashtags objetivo.</p>
                        <p><strong>Configuración Recomendada:</strong></p>
                        <ul>
                            <li>Principiantes: 30-50 likes/hora</li>
                            <li>Intermedio: 60-90 likes/hora</li>
                            <li>Avanzado: 100-150 likes/hora</li>
                        </ul>
                        <p><strong>Mejores Prácticas:</strong></p>
                        <ul>
                            <li>Usar hashtags específicos de tu nicho</li>
                            <li>Evitar hashtags muy populares (#love, #instagood)</li>
                            <li>Rotar hashtags cada semana</li>
                        </ul>
                    </div>

                    <div class="function-card">
                        <h3>💬 Comentarios AI</h3>
                        <p><strong>Función:</strong> Genera comentarios contextualmente relevantes usando AI.</p>
                        <p><strong>Características:</strong></p>
                        <ul>
                            <li>50 claves API de Google Gemini</li>
                            <li>Comentarios únicos y naturales</li>
                            <li>Contexto basado en el contenido del post</li>
                            <li>Múltiples personalidades AI</li>
                        </ul>
                        <div class="code-block">
                            <pre><code>Ejemplo de comentarios generados:
• "¡Increíble perspectiva sobre la innovación tecnológica! 🚀"
• "Me encanta cómo abordas este tema tan importante"
• "Contenido de calidad como siempre 👏"</code></pre>
                        </div>
                    </div>

                    <div class="function-card">
                        <h3>👥 Follows Inteligentes</h3>
                        <p><strong>Función:</strong> Sigue usuarios basados en hashtags y actividad.</p>
                        <p><strong>Estrategias:</strong></p>
                        <ul>
                            <li><strong>Hashtag Targeting:</strong> Usuarios que usan hashtags específicos</li>
                            <li><strong>Competitor Following:</strong> Seguidores de competidores</li>
                            <li><strong>Engagement Based:</strong> Usuarios activos en tu nicho</li>
                        </ul>
                        <p><strong>Límites Seguros:</strong></p>
                        <ul>
                            <li>Nuevas cuentas: 15-25 follows/hora</li>
                            <li>Cuentas establecidas: 30-50 follows/hora</li>
                            <li>Ratio follow/unfollow: 80/20</li>
                        </ul>
                    </div>

                    <div class="function-card">
                        <h3>📩 Mensajes Directos</h3>
                        <p><strong>Función:</strong> Envía DMs personalizados automáticamente.</p>
                        <p><strong>Casos de Uso:</strong></p>
                        <ul>
                            <li>Bienvenida a nuevos seguidores</li>
                            <li>Seguimiento de leads</li>
                            <li>Promoción de productos/servicios</li>
                        </ul>
                        <div class="warning-box">
                            <strong>⚠️ Cuidado:</strong> Los DMs automáticos tienen mayor riesgo. Usar con moderación.
                        </div>
                    </div>
                </div>

                <h2>Configuración por Tipo de Cuenta</h2>

                <div class="account-configs">
                    <div class="config-card">
                        <h3>🆕 Cuenta Nueva (0-1000 seguidores)</h3>
                        <table class="config-table">
                            <tr><td>Likes/hora</td><td>30-40</td></tr>
                            <tr><td>Comentarios/hora</td><td>10-15</td></tr>
                            <tr><td>Follows/hora</td><td>15-20</td></tr>
                            <tr><td>Unfollows/día</td><td>50-100</td></tr>
                            <tr><td>Horario activo</td><td>9AM-9PM</td></tr>
                        </table>
                    </div>

                    <div class="config-card">
                        <h3>📈 Cuenta en Crecimiento (1K-10K)</h3>
                        <table class="config-table">
                            <tr><td>Likes/hora</td><td>50-80</td></tr>
                            <tr><td>Comentarios/hora</td><td>20-30</td></tr>
                            <tr><td>Follows/hora</td><td>25-40</td></tr>
                            <tr><td>Unfollows/día</td><td>100-200</td></tr>
                            <tr><td>Horario activo</td><td>8AM-11PM</td></tr>
                        </table>
                    </div>

                    <div class="config-card">
                        <h3>🏆 Cuenta Establecida (10K+)</h3>
                        <table class="config-table">
                            <tr><td>Likes/hora</td><td>80-150</td></tr>
                            <tr><td>Comentarios/hora</td><td>30-60</td></tr>
                            <tr><td>Follows/hora</td><td>40-80</td></tr>
                            <tr><td>Unfollows/día</td><td>200-400</td></tr>
                            <tr><td>Horario activo</td><td>24/7 con pausas</td></tr>
                        </table>
                    </div>
                </div>

                <h2>Monitoreo y Optimización</h2>

                <h3>KPIs Importantes</h3>
                <ul>
                    <li><strong>Tasa de Follow-Back:</strong> >20% es excelente</li>
                    <li><strong>Engagement Rate:</strong> >3% es bueno</li>
                    <li><strong>Crecimiento de Seguidores:</strong> 5-10% mensual</li>
                    <li><strong>Reach Promedio:</strong> Aumentar mes a mes</li>
                </ul>

                <h3>Señales de Alerta</h3>
                <div class="alert-signals">
                    <div class="signal">
                        <h4>🚨 Alto Riesgo</h4>
                        <ul>
                            <li>Bloqueos de acción frecuentes</li>
                            <li>Verificaciones de seguridad constantes</li>
                            <li>Disminución brusca de reach</li>
                        </ul>
                    </div>
                    
                    <div class="signal">
                        <h4>⚠️ Riesgo Medio</h4>
                        <ul>
                            <li>Tasa de follow-back muy baja (<10%)</li>
                            <li>Muchos unfollows inmediatos</li>
                            <li>Comentarios reportados como spam</li>
                        </ul>
                    </div>
                </div>

                <h2>Estrategias Avanzadas</h2>

                <div class="advanced-strategies">
                    <h3>🎯 Targeting Preciso</h3>
                    <ul>
                        <li>Usar hashtags de nicho específico</li>
                        <li>Analizar competidores exitosos</li>
                        <li>Segmentar por ubicación geográfica</li>
                        <li>Horarios óptimos por audiencia</li>
                    </ul>

                    <h3>📊 A/B Testing</h3>
                    <ul>
                        <li>Probar diferentes tipos de comentarios</li>
                        <li>Variar horarios de actividad</li>
                        <li>Experimentar con hashtags</li>
                        <li>Medir resultados semanalmente</li>
                    </ul>
                </div>
            </div>
        `;
  }

  getAIConfigurationContent() {
    return `
            <div class="docs-section">
                <h1>🤖 Configuración de Inteligencia Artificial</h1>
                
                <p>Aprende a configurar y optimizar el sistema de AI de Riona para generar contenido de máxima calidad.</p>

                <h2>Sistema de Personalidades AI</h2>

                <div class="ai-personalities">
                    <div class="personality-card">
                        <h3>🚀 ArcanEdge System</h3>
                        <p><strong>Especialidad:</strong> Tecnología y innovación</p>
                        <p><strong>Tono:</strong> Profesional, técnico, visionario</p>
                        <p><strong>Ideal para:</strong></p>
                        <ul>
                            <li>Cuentas de tecnología</li>
                            <li>Startups y empresas tech</li>
                            <li>Contenido sobre AI e innovación</li>
                        </ul>
                        <div class="example-comment">
                            <strong>Ejemplo:</strong> "Excelente enfoque sobre la transformación digital. La AI está redefiniendo cómo interactuamos con la tecnología 🚀"
                        </div>
                    </div>

                    <div class="personality-card">
                        <h3>⚡ Elon Style</h3>
                        <p><strong>Especialidad:</strong> Emprendimiento disruptivo</p>
                        <p><strong>Tono:</strong> Directo, visionario, provocativo</p>
                        <p><strong>Ideal para:</strong></p>
                        <ul>
                            <li>Emprendedores</li>
                            <li>Innovadores</li>
                            <li>Cuentas de business</li>
                        </ul>
                        <div class="example-comment">
                            <strong>Ejemplo:</strong> "El futuro se construye hoy. Esta innovación cambiará las reglas del juego 💫"
                        </div>
                    </div>

                    <div class="personality-card">
                        <h3>🌟 General Purpose</h3>
                        <p><strong>Especialidad:</strong> Versatilidad</p>
                        <p><strong>Tono:</strong> Amigable, adaptable, equilibrado</p>
                        <p><strong>Ideal para:</strong></p>
                        <ul>
                            <li>Cuentas personales</li>
                            <li>Múltiples nichos</li>
                            <li>Contenido variado</li>
                        </ul>
                        <div class="example-comment">
                            <strong>Ejemplo:</strong> "¡Me encanta este contenido! Muy inspirador y bien explicado 👏"
                        </div>
                    </div>
                </div>

                <h2>Google Gemini 2.0 Integration</h2>

                <div class="gemini-info">
                    <h3>Características del Sistema</h3>
                    <ul>
                        <li><strong>50 API Keys:</strong> Distribución automática de carga</li>
                        <li><strong>Rate Limiting Inteligente:</strong> Evita límites de la API</li>
                        <li><strong>Failover Automático:</strong> Cambio automático entre keys</li>
                        <li><strong>Context Awareness:</strong> Análisis del contenido del post</li>
                    </ul>

                    <h3>Proceso de Generación</h3>
                    <ol class="generation-process">
                        <li><strong>Análisis del Post:</strong> Extrae contexto, hashtags, y contenido visual</li>
                        <li><strong>Selección de Personalidad:</strong> Aplica el carácter configurado</li>
                        <li><strong>Generación Contextual:</strong> Crea comentario relevante y natural</li>
                        <li><strong>Filtro de Calidad:</strong> Verifica autenticidad y apropiedad</li>
                        <li><strong>Entrega Final:</strong> Comentario listo para publicar</li>
                    </ol>
                </div>

                <h2>Configuración Avanzada</h2>

                <h3>Estilos de Contenido</h3>
                <div class="content-styles">
                    <div class="style-option">
                        <h4>📝 Profesional</h4>
                        <p>Comentarios formales, técnicos, orientados a business</p>
                        <div class="code-block">
                            <pre><code>Ejemplo:
"Excelente análisis sobre las tendencias del mercado. 
Los insights presentados son realmente valiosos para 
la toma de decisiones estratégicas."</code></pre>
                        </div>
                    </div>

                    <div class="style-option">
                        <h4>😊 Casual</h4>
                        <p>Comentarios relajados, naturales, conversacionales</p>
                        <div class="code-block">
                            <pre><code>Ejemplo:
"¡Me encanta este post! 😍 Justo lo que necesitaba 
leer hoy. Gracias por compartir esta perspectiva 
tan interesante 👏"</code></pre>
                        </div>
                    </div>

                    <div class="style-option">
                        <h4>🤝 Amigable</h4>
                        <p>Comentarios cálidos, supportivos, community-oriented</p>
                        <div class="code-block">
                            <pre><code>Ejemplo:
"¡Qué contenido tan inspirador! 🌟 Me encanta ver 
cómo compartes tu conocimiento con la comunidad. 
¡Sigue así! 💪"</code></pre>
                        </div>
                    </div>

                    <div class="style-option">
                        <h4>⚡ Técnico</h4>
                        <p>Comentarios específicos, detallados, expert-level</p>
                        <div class="code-block">
                            <pre><code>Ejemplo:
"Interesante implementación del algoritmo. 
¿Has considerado usar GraphQL para optimizar 
las queries? Podría mejorar el performance 
significativamente 🚀"</code></pre>
                        </div>
                    </div>
                </div>

                <h3>Configuración por Idioma</h3>
                <div class="language-config">
                    <div class="lang-option">
                        <h4>🇪🇸 Español</h4>
                        <ul>
                            <li>Expresiones naturales en español</li>
                            <li>Emojis culturalmente apropiados</li>
                            <li>Slang y modismos locales</li>
                        </ul>
                    </div>

                    <div class="lang-option">
                        <h4>🇺🇸 English</h4>
                        <ul>
                            <li>Native English expressions</li>
                            <li>Cultural context awareness</li>
                            <li>Business and casual registers</li>
                        </ul>
                    </div>

                    <div class="lang-option">
                        <h4>🇧🇷 Português</h4>
                        <ul>
                            <li>Expressões brasileiras autênticas</li>
                            <li>Contexto cultural apropriado</li>
                            <li>Gírias e regionalismos</li>
                        </ul>
                    </div>
                </div>

                <h2>Optimización de Performance</h2>

                <h3>Métricas de Calidad</h3>
                <table class="metrics-table">
                    <tr>
                        <th>Métrica</th>
                        <th>Objetivo</th>
                        <th>Excelente</th>
                    </tr>
                    <tr>
                        <td>Tasa de Respuesta</td>
                        <td>>5%</td>
                        <td>>15%</td>
                    </tr>
                    <tr>
                        <td>Likes en Comentarios</td>
                        <td>>3 por comentario</td>
                        <td>>10 por comentario</td>
                    </tr>
                    <tr>
                        <td>Engagement Generated</td>
                        <td>>2% aumento</td>
                        <td>>8% aumento</td>
                    </tr>
                    <tr>
                        <td>Reports/Spam</td>
                        <td><0.1%</td>
                        <td>0%</td>
                    </tr>
                </table>

                <h3>A/B Testing para AI</h3>
                <div class="ab-testing">
                    <h4>Variables a Testear</h4>
                    <ul>
                        <li><strong>Personalidades:</strong> Comparar diferentes caracteres</li>
                        <li><strong>Longitud:</strong> Comentarios cortos vs largos</li>
                        <li><strong>Emojis:</strong> Con y sin emojis</li>
                        <li><strong>Timing:</strong> Horarios de publicación</li>
                        <li><strong>Temas:</strong> Tipos de posts objetivo</li>
                    </ul>

                    <h4>Duración Recomendada</h4>
                    <p>Ejecutar tests por <strong>7-14 días</strong> con al menos <strong>100 comentarios</strong> por variante para obtener datos estadísticamente significativos.</p>
                </div>

                <div class="pro-tip">
                    <h3>💡 Pro Tip</h3>
                    <p>La clave del éxito en AI comments está en la <strong>relevancia contextual</strong>. Un comentario que demuestra que realmente "entendiste" el post genera 10x más engagement que un comentario genérico.</p>
                </div>
            </div>
        `;
  }

  getBestPracticesContent() {
    return `
            <div class="docs-section">
                <h1>⭐ Mejores Prácticas y Estrategias</h1>
                
                <p>Domina las estrategias avanzadas para maximizar resultados y minimizar riesgos con Riona AI Agent.</p>

                <h2>🛡️ Seguridad y Anti-Detección</h2>

                <div class="security-practices">
                    <div class="practice-card">
                        <h3>🕒 Gestión de Tiempo</h3>
                        <h4>Horarios Naturales</h4>
                        <ul>
                            <li><strong>Lunes-Viernes:</strong> 9AM - 11PM con pausas</li>
                            <li><strong>Fines de Semana:</strong> 10AM - 10PM actividad reducida</li>
                            <li><strong>Pausas Obligatorias:</strong> 15-30 min cada hora</li>
                            <li><strong>Pausa Nocturna:</strong> 11PM - 7AM sin actividad</li>
                        </ul>

                        <h4>Delays entre Acciones</h4>
                        <table class="delay-table">
                            <tr><th>Acción</th><th>Delay Mínimo</th><th>Delay Máximo</th></tr>
                            <tr><td>Like → Like</td><td>3s</td><td>8s</td></tr>
                            <tr><td>Comment → Comment</td><td>15s</td><td>45s</td></tr>
                            <tr><td>Follow → Follow</td><td>20s</td><td>60s</td></tr>
                            <tr><td>Like → Comment</td><td>10s</td><td>30s</td></tr>
                        </table>
                    </div>

                    <div class="practice-card">
                        <h3>🎭 Comportamiento Humano</h3>
                        <ul>
                            <li><strong>Variación de Actividad:</strong> No patrones fijos</li>
                            <li><strong>Errores Ocasionales:</strong> Likes accidentales</li>
                            <li><strong>Navegación Natural:</strong> Explorar perfiles completos</li>
                            <li><strong>Engagement Mixto:</strong> Combinar todas las acciones</li>
                        </ul>
                    </div>
                </div>

                <h2>📈 Estrategias de Crecimiento</h2>

                <div class="growth-strategies">
                    <div class="strategy-phase">
                        <h3>Fase 1: Fundación (0-1K seguidores)</h3>
                        <div class="phase-details">
                            <h4>Objetivos</h4>
                            <ul>
                                <li>Establecer presencia consistente</li>
                                <li>Construir base de seguidores genuinos</li>
                                <li>Definir nicho y audiencia</li>
                            </ul>

                            <h4>Configuración Recomendada</h4>
                            <div class="config-grid">
                                <div class="config-item">
                                    <strong>Likes:</strong> 30-40/hora<br>
                                    <strong>Comentarios:</strong> 10-15/hora<br>
                                    <strong>Follows:</strong> 15-20/hora
                                </div>
                                <div class="config-item">
                                    <strong>Hashtags:</strong> 5-8 específicos<br>
                                    <strong>Horario:</strong> 9AM-9PM<br>
                                    <strong>Enfoque:</strong> Calidad > Cantidad
                                </div>
                            </div>

                            <h4>KPIs Clave</h4>
                            <ul>
                                <li>Follow-back rate: >25%</li>
                                <li>Engagement rate: >5%</li>
                                <li>Crecimiento: 50-100 seguidores/semana</li>
                            </ul>
                        </div>
                    </div>

                    <div class="strategy-phase">
                        <h3>Fase 2: Crecimiento (1K-10K seguidores)</h3>
                        <div class="phase-details">
                            <h4>Objetivos</h4>
                            <ul>
                                <li>Escalar operaciones de manera segura</li>
                                <li>Optimizar targeting y contenido</li>
                                <li>Construir engagement rate sólido</li>
                            </ul>

                            <h4>Configuración Recomendada</h4>
                            <div class="config-grid">
                                <div class="config-item">
                                    <strong>Likes:</strong> 60-90/hora<br>
                                    <strong>Comentarios:</strong> 25-35/hora<br>
                                    <strong>Follows:</strong> 30-45/hora
                                </div>
                                <div class="config-item">
                                    <strong>Hashtags:</strong> 10-15 variados<br>
                                    <strong>Horario:</strong> 8AM-11PM<br>
                                    <strong>Enfoque:</strong> Expansión controlada
                                </div>
                            </div>

                            <h4>Estrategias Específicas</h4>
                            <ul>
                                <li><strong>Competitor Analysis:</strong> Estudiar cuentas similares exitosas</li>
                                <li><strong>Content Collaboration:</strong> Engagement con influencers de nicho</li>
                                <li><strong>Hashtag Research:</strong> Identificar hashtags emergentes</li>
                            </ul>
                        </div>
                    </div>

                    <div class="strategy-phase">
                        <h3>Fase 3: Consolidación (10K+ seguidores)</h3>
                        <div class="phase-details">
                            <h4>Objetivos</h4>
                            <ul>
                                <li>Mantener y aumentar engagement</li>
                                <li>Monetizar audiencia</li>
                                <li>Establecerse como autoridad</li>
                            </ul>

                            <h4>Configuración Avanzada</h4>
                            <div class="config-grid">
                                <div class="config-item">
                                    <strong>Likes:</strong> 100-150/hora<br>
                                    <strong>Comentarios:</strong> 40-60/hora<br>
                                    <strong>Follows:</strong> 50-80/hora
                                </div>
                                <div class="config-item">
                                    <strong>Hashtags:</strong> 15-25 estratégicos<br>
                                    <strong>Horario:</strong> 24/7 con pausas<br>
                                    <strong>Enfoque:</strong> Autoridad y monetización
                                </div>
                            </div>

                            <h4>Monetización</h4>
                            <ul>
                                <li><strong>Sponsored Posts:</strong> Colaboraciones pagadas</li>
                                <li><strong>Product Placement:</strong> Promoción de productos</li>
                                <li><strong>Course/Coaching:</strong> Venta de conocimiento</li>
                                <li><strong>Affiliate Marketing:</strong> Comisiones por ventas</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h2>🎯 Optimización por Nicho</h2>

                <div class="niche-strategies">
                    <div class="niche-card">
                        <h3>💻 Tecnología</h3>
                        <div class="niche-content">
                            <h4>Hashtags Top</h4>
                            <p><code>#tech #AI #programming #innovation #startup #coding #developer #techtrends</code></p>
                            
                            <h4>Mejor Timing</h4>
                            <p>Lunes-Viernes 9AM-6PM (horario laboral tech)</p>
                            
                            <h4>Tipo de Comentarios</h4>
                            <ul>
                                <li>Técnicos pero accesibles</li>
                                <li>Referencias a trends actuales</li>
                                <li>Preguntas sobre implementation</li>
                            </ul>
                        </div>
                    </div>

                    <div class="niche-card">
                        <h3>💼 Business</h3>
                        <div class="niche-content">
                            <h4>Hashtags Top</h4>
                            <p><code>#entrepreneur #business #leadership #marketing #success #growth #strategy</code></p>
                            
                            <h4>Mejor Timing</h4>
                            <p>Lunes-Viernes 7AM-9AM, 12PM-2PM, 5PM-7PM</p>
                            
                            <h4>Tipo de Comentarios</h4>
                            <ul>
                                <li>Experiencias personales</li>
                                <li>Insights de industria</li>
                                <li>Preguntas estratégicas</li>
                            </ul>
                        </div>
                    </div>

                    <div class="niche-card">
                        <h3>💪 Fitness</h3>
                        <div class="niche-content">
                            <h4>Hashtags Top</h4>
                            <p><code>#fitness #gym #workout #health #motivation #fit #training #wellness</code></p>
                            
                            <h4>Mejor Timing</h4>
                            <p>6AM-9AM, 6PM-9PM (horarios de gym)</p>
                            
                            <h4>Tipo de Comentarios</h4>
                            <ul>
                                <li>Motivacionales y supportivos</li>
                                <li>Consejos de entrenamiento</li>
                                <li>Experiencias personales</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h2>📊 Análisis y Optimización</h2>

                <div class="analysis-framework">
                    <h3>Weekly Review Process</h3>
                    <ol class="review-steps">
                        <li>
                            <strong>Métricas de Performance</strong>
                            <ul>
                                <li>Seguidores ganados/perdidos</li>
                                <li>Engagement rate promedio</li>
                                <li>Reach de posts</li>
                                <li>Tasa de follow-back</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong>Análisis de Contenido</strong>
                            <ul>
                                <li>Posts con mejor performance</li>
                                <li>Hashtags más efectivos</li>
                                <li>Horarios óptimos</li>
                                <li>Tipos de comentarios exitosos</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong>Optimización</strong>
                            <ul>
                                <li>Ajustar configuraciones</li>
                                <li>Actualizar hashtags</li>
                                <li>Refinar targeting</li>
                                <li>Mejorar AI prompts</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <h2>⚠️ Red Flags y Soluciones</h2>

                <div class="red-flags">
                    <div class="flag-item">
                        <h3>🚨 Bloqueos de Acción</h3>
                        <div class="flag-content">
                            <h4>Síntomas</h4>
                            <ul>
                                <li>Mensajes de "Try again later"</li>
                                <li>Acciones bloqueadas por horas/días</li>
                            </ul>
                            
                            <h4>Soluciones</h4>
                            <ul>
                                <li>Reducir actividad inmediatamente</li>
                                <li>Pausar automatización por 24-48h</li>
                                <li>Revisar y reducir limits permanentemente</li>
                            </ul>
                        </div>
                    </div>

                    <div class="flag-item">
                        <h3>📉 Drop de Engagement</h3>
                        <div class="flag-content">
                            <h4>Síntomas</h4>
                            <ul>
                                <li>Menos likes/comentarios en posts</li>
                                <li>Menor alcance orgánico</li>
                            </ul>
                            
                            <h4>Soluciones</h4>
                            <ul>
                                <li>Mejorar calidad de contenido</li>
                                <li>Revisar estrategia de hashtags</li>
                                <li>Aumentar engagement genuino</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="success-formula">
                    <h2>🏆 Fórmula del Éxito</h2>
                    <div class="formula-box">
                        <p><strong>Éxito = (Contenido de Calidad × Targeting Preciso × Automatización Inteligente × Paciencia) / Riesgo</strong></p>
                    </div>
                    
                    <h3>Factores Críticos</h3>
                    <ul>
                        <li><strong>70% Estrategia</strong> - Conocer tu audiencia y nicho</li>
                        <li><strong>20% Contenido</strong> - Posts que realmente aporten valor</li>
                        <li><strong>10% Automatización</strong> - Herramienta para escalar, no para compensar</li>
                    </ul>
                </div>
            </div>
        `;
  }

  getTroubleshootingContent() {
    return `
            <div class="docs-section">
                <h1>🔧 Solución de Problemas</h1>
                
                <p>Guía completa para resolver los problemas más comunes en Riona AI Agent.</p>

                <h2>🚨 Problemas Críticos</h2>

                <div class="critical-issues">
                    <div class="issue-card critical">
                        <h3>❌ Cuenta Bloqueada/Suspendida</h3>
                        <div class="issue-content">
                            <h4>Síntomas</h4>
                            <ul>
                                <li>No se puede hacer login</li>
                                <li>Mensaje de "Account temporarily locked"</li>
                                <li>Requiere verificación por teléfono</li>
                            </ul>

                            <h4>Causas Comunes</h4>
                            <ul>
                                <li>Actividad demasiado agresiva</li>
                                <li>Muchos reports de spam</li>
                                <li>Login desde múltiples IPs</li>
                                <li>Comportamiento no-humano detectado</li>
                            </ul>

                            <h4>Soluciones</h4>
                            <ol>
                                <li><strong>Inmediato:</strong> Detener toda automatización</li>
                                <li><strong>Verificación:</strong> Completar proceso de verificación si está disponible</li>
                                <li><strong>Espera:</strong> 24-72 horas antes de intentar login manual</li>
                                <li><strong>Cambio IP:</strong> Usar VPN diferente para futuros logins</li>
                                <li><strong>Reducción:</strong> Configuraciones 50% más conservadoras al reiniciar</li>
                            </ol>

                            <div class="prevention-box">
                                <h4>🛡️ Prevención</h4>
                                <ul>
                                    <li>Nunca exceder 200 acciones/día total</li>
                                    <li>Mantener delays mínimos de 3-5 segundos</li>
                                    <li>Usar proxies rotativos</li>
                                    <li>Actividad solo en horarios humanos</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="issue-card high">
                        <h3>⏸️ Action Blocks</h3>
                        <div class="issue-content">
                            <h4>Tipos de Bloqueos</h4>
                            <ul>
                                <li><strong>Like Block:</strong> No puedes dar likes</li>
                                <li><strong>Follow Block:</strong> No puedes seguir usuarios</li>
                                <li><strong>Comment Block:</strong> No puedes comentar</li>
                                <li><strong>DM Block:</strong> No puedes enviar mensajes</li>
                            </ul>

                            <h4>Duración Típica</h4>
                            <table class="duration-table">
                                <tr><th>Primer Bloqueo</th><td>2-4 horas</td></tr>
                                <tr><th>Segundo Bloqueo</th><td>8-12 horas</td></tr>
                                <tr><th>Tercer Bloqueo</th><td>24-48 horas</td></tr>
                                <tr><th>Bloqueos Recurrentes</th><td>1-7 días</td></tr>
                            </table>

                            <h4>Plan de Acción</h4>
                            <ol>
                                <li><strong>Detectar:</strong> Sistema debe pausar automáticamente</li>
                                <li><strong>Documentar:</strong> Hora, tipo de bloqueo, actividad previa</li>
                                <li><strong>Esperar:</strong> Duración completa + 2 horas extra</li>
                                <li><strong>Test Manual:</strong> Verificar que funciona manualmente</li>
                                <li><strong>Reiniciar:</strong> Con configuraciones reducidas 30-50%</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <h2>⚠️ Problemas Técnicos</h2>

                <div class="technical-issues">
                    <div class="tech-issue">
                        <h3>🔄 Login Failures</h3>
                        <div class="solutions">
                            <h4>Error: "Invalid Credentials"</h4>
                            <ul>
                                <li>Verificar username/password correctos</li>
                                <li>Intentar login manual en navegador</li>
                                <li>Revisar si cambió la contraseña</li>
                                <li>Verificar que no hay 2FA activado</li>
                            </ul>

                            <h4>Error: "Challenge Required"</h4>
                            <ul>
                                <li>Completar challenge manualmente</li>
                                <li>Guardar cookies después del challenge</li>
                                <li>Usar cookies guardadas para futuros logins</li>
                            </ul>

                            <h4>Error: "Rate Limited"</h4>
                            <ul>
                                <li>Esperar 30-60 minutos</li>
                                <li>Cambiar IP/proxy</li>
                                <li>Reducir frecuencia de intentos de login</li>
                            </ul>
                        </div>
                    </div>

                    <div class="tech-issue">
                        <h3>🌐 Network Issues</h3>
                        <div class="solutions">
                            <h4>Timeouts</h4>
                            <div class="code-block">
                                <pre><code>// Configuración de timeouts recomendada
page.setDefaultTimeout(30000);
page.setDefaultNavigationTimeout(60000);</code></pre>
                            </div>

                            <h4>Proxy Issues</h4>
                            <ul>
                                <li>Verificar conexión del proxy</li>
                                <li>Rotar a proxy diferente</li>
                                <li>Usar proxies residenciales</li>
                                <li>Verificar geolocalización del proxy</li>
                            </ul>

                            <h4>Memory Leaks</h4>
                            <ul>
                                <li>Reiniciar browser cada 2-3 horas</li>
                                <li>Cerrar tabs no utilizadas</li>
                                <li>Limpiar cookies periódicamente</li>
                                <li>Monitorear uso de RAM</li>
                            </ul>
                        </div>
                    </div>

                    <div class="tech-issue">
                        <h3>🤖 AI Generation Issues</h3>
                        <div class="solutions">
                            <h4>API Key Exhausted</h4>
                            <ul>
                                <li>Sistema debe rotar automáticamente</li>
                                <li>Verificar límites diarios de API</li>
                                <li>Agregar más API keys si necesario</li>
                                <li>Implementar fallback a comentarios estáticos</li>
                            </ul>

                            <h4>Poor Quality Comments</h4>
                            <ul>
                                <li>Revisar prompts del sistema</li>
                                <li>Ajustar personalidad AI</li>
                                <li>Mejorar contexto proporcionado</li>
                                <li>Implementar filtros de calidad</li>
                            </ul>

                            <h4>Context Extraction Fails</h4>
                            <ul>
                                <li>Verificar selectores CSS</li>
                                <li>Implementar múltiples métodos de extracción</li>
                                <li>Fallback a hashtags como contexto</li>
                                <li>Usar comentarios genéricos como último recurso</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h2>🛠️ Herramientas de Diagnóstico</h2>

                <div class="diagnostic-tools">
                    <div class="tool-card">
                        <h3>📊 Health Check Dashboard</h3>
                        <p>Monitorea el estado del sistema en tiempo real:</p>
                        <ul>
                            <li>Status de conexión por cuenta</li>
                            <li>Últimas acciones exitosas/fallidas</li>
                            <li>Rate limits actuales</li>
                            <li>Próximas acciones programadas</li>
                        </ul>
                        <div class="code-block">
                            <pre><code>// Acceder al health check
GET /api/health
GET /api/accounts/{id}/status</code></pre>
                        </div>
                    </div>

                    <div class="tool-card">
                        <h3>📝 Logs Detallados</h3>
                        <p>Sistema de logging completo para debugging:</p>
                        <ul>
                            <li><strong>Error Logs:</strong> Todos los errores con stack trace</li>
                            <li><strong>Action Logs:</strong> Cada acción realizada</li>
                            <li><strong>Performance Logs:</strong> Tiempos de respuesta</li>
                            <li><strong>Security Logs:</strong> Intentos de login, challenges</li>
                        </ul>
                        <div class="code-block">
                            <pre><code>// Niveles de log
ERROR: Errores críticos
WARN: Situaciones sospechosas
INFO: Actividad normal
DEBUG: Información detallada</code></pre>
                        </div>
                    </div>

                    <div class="tool-card">
                        <h3>🧪 Test Mode</h3>
                        <p>Modo de prueba para verificar configuraciones:</p>
                        <ul>
                            <li>Dry run de automatizaciones</li>
                            <li>Test de login sin acciones</li>
                            <li>Verificación de targeting</li>
                            <li>Test de generación AI</li>
                        </ul>
                        <div class="code-block">
                            <pre><code>// Activar test mode
POST /api/accounts/{id}/test
{
  "mode": "dry_run",
  "actions": ["like", "comment", "follow"]
}</code></pre>
                        </div>
                    </div>
                </div>

                <h2>📋 Checklist de Troubleshooting</h2>

                <div class="troubleshooting-checklist">
                    <h3>Antes de Reportar un Bug</h3>
                    <div class="checklist">
                        <label><input type="checkbox"> Verificar logs del sistema</label>
                        <label><input type="checkbox"> Reproducir el problema manualmente</label>
                        <label><input type="checkbox"> Probar con cuenta diferente</label>
                        <label><input type="checkbox"> Verificar configuración de red</label>
                        <label><input type="checkbox"> Comprobar límites de API</label>
                        <label><input type="checkbox"> Revisar configuraciones de automatización</label>
                        <label><input type="checkbox"> Verificar estado de Instagram (downdetector.com)</label>
                    </div>

                    <h3>Información para Reportes</h3>
                    <ul>
                        <li><strong>Timestamp exacto:</strong> Cuándo ocurrió el problema</li>
                        <li><strong>Cuenta afectada:</strong> Username (sin contraseña)</li>
                        <li><strong>Acción que falló:</strong> Like, comment, follow, etc.</li>
                        <li><strong>Error message:</strong> Mensaje exacto del error</li>
                        <li><strong>Configuración:</strong> Rates, hashtags, horarios</li>
                        <li><strong>Logs relevantes:</strong> Últimas 50 líneas de log</li>
                    </ul>
                </div>

                <h2>🆘 Soporte de Emergencia</h2>

                <div class="emergency-procedures">
                    <div class="emergency-card">
                        <h3>🔴 Procedimiento de Emergencia</h3>
                        <p>Si múltiples cuentas están siendo bloqueadas simultáneamente:</p>
                        <ol>
                            <li><strong>STOP ALL:</strong> Detener toda automatización inmediatamente</li>
                            <li><strong>ASSESS:</strong> Revisar qué cuentas están afectadas</li>
                            <li><strong>ISOLATE:</strong> Separar cuentas problemáticas</li>
                            <li><strong>INVESTIGATE:</strong> Identificar causa común</li>
                            <li><strong>ADJUST:</strong> Modificar configuraciones globalmente</li>
                            <li><strong>GRADUAL RESTART:</strong> Reiniciar una cuenta a la vez</li>
                        </ol>
                    </div>

                    <div class="emergency-contacts">
                        <h3>📞 Contactos de Soporte</h3>
                        <ul>
                            <li><strong>Email:</strong> support@riona.ai</li>
                            <li><strong>Telegram:</strong> @RionaSupportBot</li>
                            <li><strong>Discord:</strong> Riona AI Community</li>
                            <li><strong>Emergencias:</strong> emergency@riona.ai</li>
                        </ul>
                        
                        <p><strong>Tiempo de Respuesta:</strong></p>
                        <ul>
                            <li>Email: 2-4 horas</li>
                            <li>Telegram: 30-60 minutos</li>
                            <li>Emergencias: 15-30 minutos</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
  }

  getAPIReferenceContent() {
    return `
            <div class="docs-section">
                <h1>📚 API Reference</h1>
                
                <p>Documentación completa de la API REST de Riona AI Agent.</p>

                <div class="api-overview">
                    <h2>🌐 Base URL</h2>
                    <div class="code-block">
                        <pre><code>Base URL: http://localhost:3000/api
Content-Type: application/json</code></pre>
                    </div>

                    <h2>🔐 Autenticación</h2>
                    <p>Actualmente la API funciona sin autenticación para desarrollo. En producción se implementará JWT tokens.</p>
                </div>

                <h2>👥 Users API</h2>

                <div class="api-endpoint">
                    <h3>GET /api/users</h3>
                    <p>Obtener lista de todos los usuarios</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": [
    {
      "_id": "1",
      "name": "Admin User",
      "email": "admin@riona.ai",
      "role": "admin",
      "subscription": {
        "plan": "enterprise",
        "accountsLimit": 999
      },
      "instagramAccounts": [],
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "count": 1
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>POST /api/users</h3>
                    <p>Crear nuevo usuario</p>
                    
                    <h4>Request Body</h4>
                    <div class="code-block">
                        <pre><code>{
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "role": "user",
  "subscription": {
    "plan": "basic",
    "accountsLimit": 5
  }
}</code></pre>
                    </div>

                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "_id": "123456",
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "role": "user",
    "subscription": {
      "plan": "basic",
      "accountsLimit": 5
    },
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "message": "User created successfully"
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>GET /api/users/:id</h3>
                    <p>Obtener usuario específico por ID</p>
                    
                    <h4>Parameters</h4>
                    <ul>
                        <li><strong>id</strong> (string): ID del usuario</li>
                    </ul>
                </div>

                <div class="api-endpoint">
                    <h3>PUT /api/users/:id</h3>
                    <p>Actualizar usuario existente</p>
                    
                    <h4>Request Body</h4>
                    <div class="code-block">
                        <pre><code>{
  "name": "Nombre Actualizado",
  "subscription": {
    "plan": "premium",
    "accountsLimit": 15
  }
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>DELETE /api/users/:id</h3>
                    <p>Eliminar usuario</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "message": "User deleted successfully"
}</code></pre>
                    </div>
                </div>

                <h2>📱 Instagram Accounts API</h2>

                <div class="api-endpoint">
                    <h3>GET /api/accounts</h3>
                    <p>Obtener todas las cuentas de Instagram</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": [
    {
      "_id": "1",
      "username": "@demo_account_1",
      "userName": "Demo User",
      "userId": "1",
      "isActive": true,
      "stats": {
        "followers": 1542,
        "following": 823,
        "posts": 156,
        "engagement": 4.2
      },
      "settings": {
        "autoLike": true,
        "autoComment": true,
        "autoFollow": false,
        "maxLikesPerHour": 60,
        "targetHashtags": ["technology", "AI"]
      },
      "lastActivity": "2024-01-20T15:30:00.000Z"
    }
  ],
  "count": 1
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>POST /api/users/:userId/accounts</h3>
                    <p>Agregar cuenta de Instagram a usuario</p>
                    
                    <h4>Request Body</h4>
                    <div class="code-block">
                        <pre><code>{
  "username": "@mi_cuenta_instagram",
  "password": "mi_contraseña_segura",
  "settings": {
    "autoLike": true,
    "autoComment": true,
    "autoFollow": false,
    "maxLikesPerHour": 60,
    "maxCommentsPerHour": 30,
    "maxFollowsPerHour": 20,
    "targetHashtags": ["technology", "startup", "AI"]
  }
}</code></pre>
                    </div>

                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "_id": "new_account_id",
    "username": "@mi_cuenta_instagram",
    "isActive": true,
    "stats": {
      "followers": 0,
      "following": 0,
      "posts": 0,
      "engagement": 0
    },
    "settings": {
      "autoLike": true,
      "autoComment": true,
      "autoFollow": false,
      "maxLikesPerHour": 60,
      "maxCommentsPerHour": 30,
      "maxFollowsPerHour": 20,
      "targetHashtags": ["technology", "startup", "AI"]
    },
    "createdAt": "2024-01-20T16:00:00.000Z"
  },
  "message": "Instagram account added successfully"
}</code></pre>
                    </div>
                </div>

                <h2>🤖 AI Generation API</h2>

                <div class="api-endpoint">
                    <h3>POST /api/generate</h3>
                    <p>Generar contenido usando AI</p>
                    
                    <h4>Request Body</h4>
                    <div class="code-block">
                        <pre><code>{
  "type": "comment",
  "context": "Post sobre innovación tecnológica en startups",
  "character": "arcane-edge"
}</code></pre>
                    </div>

                    <h4>Parameters</h4>
                    <ul>
                        <li><strong>type</strong>: "comment", "caption", "reply", "dm"</li>
                        <li><strong>context</strong>: Descripción del contenido o hashtag</li>
                        <li><strong>character</strong>: "arcane-edge", "elon", "sample"</li>
                    </ul>

                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "content": "¡Increíble enfoque sobre la innovación! La tecnología está redefiniendo cómo las startups pueden escalar globalmente. 🚀",
    "type": "comment",
    "timestamp": "2024-01-20T16:15:00.000Z",
    "character": "arcane-edge"
  }
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>GET /api/characters</h3>
                    <p>Obtener lista de personalidades AI disponibles</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": [
    {
      "id": "arcane-edge",
      "name": "ArcanEdge System Agent",
      "description": "Pionero en comunicación AI dirigida por prompts",
      "active": true,
      "personality": "Profesional, innovador, técnico",
      "language": "Español/Inglés"
    },
    {
      "id": "elon",
      "name": "Elon Character",
      "description": "Personalidad de emprendedor e innovador",
      "active": false,
      "personality": "Visionario, directo, disruptivo",
      "language": "Inglés"
    }
  ]
}</code></pre>
                    </div>
                </div>

                <h2>📊 Analytics API</h2>

                <div class="api-endpoint">
                    <h3>GET /api/analytics</h3>
                    <p>Obtener métricas y analytics</p>
                    
                    <h4>Query Parameters</h4>
                    <ul>
                        <li><strong>timeRange</strong>: "24h", "7d", "30d" (default: "24h")</li>
                        <li><strong>userId</strong>: ID del usuario específico (opcional)</li>
                    </ul>

                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "timeRange": "24h",
    "startDate": "2024-01-19T16:30:00.000Z",
    "endDate": "2024-01-20T16:30:00.000Z",
    "metrics": {
      "totalLikes": 847,
      "totalComments": 156,
      "totalFollows": 73,
      "engagementRate": "6.2%"
    },
    "hourlyActivity": [
      {
        "hour": 9,
        "likes": 45,
        "comments": 12,
        "follows": 8
      }
    ],
    "hashtagPerformance": [
      {
        "hashtag": "technology",
        "engagement": 85,
        "posts": 45
      }
    ],
    "accountPerformance": [
      {
        "username": "@demo_account_1",
        "followers": 1542,
        "engagement": 4.2,
        "isActive": true,
        "lastActivity": "2024-01-20T16:00:00.000Z"
      }
    ]
  }
}</code></pre>
                    </div>
                </div>

                <h2>🔧 Social Automation API</h2>

                <div class="api-endpoint">
                    <h3>POST /api/social/:platform/:action</h3>
                    <p>Ejecutar acciones de automatización en plataformas sociales</p>
                    
                    <h4>Parameters</h4>
                    <ul>
                        <li><strong>platform</strong>: "instagram", "twitter" (solo Instagram actualmente)</li>
                        <li><strong>action</strong>: "like", "comment", "follow", "dm", "stats", "automation"</li>
                    </ul>

                    <h4>Request Body Examples</h4>
                    
                    <h5>Like Posts by Hashtag</h5>
                    <div class="code-block">
                        <pre><code>POST /api/social/instagram/like
{
  "accountId": "account_id",
  "hashtag": "technology",
  "count": 10
}</code></pre>
                    </div>

                    <h5>Comment on Posts</h5>
                    <div class="code-block">
                        <pre><code>POST /api/social/instagram/comment
{
  "accountId": "account_id",
  "hashtag": "startup",
  "count": 5
}</code></pre>
                    </div>

                    <h5>Send Direct Message</h5>
                    <div class="code-block">
                        <pre><code>POST /api/social/instagram/dm
{
  "accountId": "account_id",
  "username": "target_user",
  "message": "¡Hola! Me encanta tu contenido sobre tecnología."
}</code></pre>
                    </div>

                    <h5>Run Full Automation</h5>
                    <div class="code-block">
                        <pre><code>POST /api/social/instagram/automation
{
  "accountId": "account_id"
}</code></pre>
                    </div>

                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "likes": 10,
    "hashtag": "technology"
  },
  "message": "like executed successfully",
  "timestamp": "2024-01-20T16:45:00.000Z"
}</code></pre>
                    </div>
                </div>

                <h2>🔍 System API</h2>

                <div class="api-endpoint">
                    <h3>GET /api/health</h3>
                    <p>Verificar estado del sistema</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "status": "healthy",
  "timestamp": "2024-01-20T16:50:00.000Z",
  "uptime": 86400,
  "environment": "development",
  "memory": {
    "rss": "150 MB",
    "heapTotal": "120 MB",
    "heapUsed": "85 MB"
  },
  "database": "development mode",
  "ai": {
    "provider": "Google Gemini",
    "keys": 50,
    "status": "configured"
  }
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>GET /api/config</h3>
                    <p>Obtener configuración del sistema</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "system": {
      "environment": "development",
      "uptime": 86400,
      "version": "1.0.0"
    },
    "ai": {
      "provider": "Google Gemini",
      "availableKeys": 50,
      "defaultCharacter": "ArcanEdge.System.Agent"
    },
    "automation": {
      "enabled": true,
      "platforms": ["instagram"],
      "features": ["likes", "comments", "follows", "dms", "analytics"]
    }
  }
}</code></pre>
                    </div>
                </div>

                <div class="api-endpoint">
                    <h3>POST /api/backup</h3>
                    <p>Crear backup del sistema</p>
                    
                    <h4>Response</h4>
                    <div class="code-block">
                        <pre><code>{
  "success": true,
  "data": {
    "timestamp": "2024-01-20T17:00:00.000Z",
    "version": "1.0.0",
    "data": {
      "users": [...],
      "settings": {...}
    }
  },
  "message": "Backup created successfully"
}</code></pre>
                    </div>
                </div>

                <h2>❌ Error Codes</h2>

                <div class="error-codes">
                    <table class="error-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Description</th>
                                <th>Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>400</td>
                                <td>Bad Request</td>
                                <td>Invalid request parameters</td>
                            </tr>
                            <tr>
                                <td>404</td>
                                <td>Not Found</td>
                                <td>User or account not found</td>
                            </tr>
                            <tr>
                                <td>429</td>
                                <td>Rate Limited</td>
                                <td>Too many requests</td>
                            </tr>
                            <tr>
                                <td>500</td>
                                <td>Internal Error</td>
                                <td>Server error</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Error Response Format</h3>
                    <div class="code-block">
                        <pre><code>{
  "success": false,
  "error": "Error type",
  "message": "Detailed error description",
  "timestamp": "2024-01-20T17:05:00.000Z"
}</code></pre>
                    </div>
                </div>

                <h2>📝 Rate Limits</h2>

                <div class="rate-limits">
                    <table class="limits-table">
                        <thead>
                            <tr>
                                <th>Endpoint</th>
                                <th>Limit</th>
                                <th>Window</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>/api/generate</td>
                                <td>100 requests</td>
                                <td>15 minutes</td>
                            </tr>
                            <tr>
                                <td>/api/social/*</td>
                                <td>50 requests</td>
                                <td>15 minutes</td>
                            </tr>
                            <tr>
                                <td>/api/users</td>
                                <td>200 requests</td>
                                <td>15 minutes</td>
                            </tr>
                            <tr>
                                <td>All other endpoints</td>
                                <td>1000 requests</td>
                                <td>15 minutes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
  }

  getDefaultContent() {
    return `
            <div class="docs-section">
                <h1>📖 Documentación de Riona AI Agent</h1>
                
                <p>Selecciona una sección del menú lateral para ver la documentación específica.</p>

                <div class="docs-navigation">
                    <div class="nav-card" onclick="docsSystem.showSection('getting-started')">
                        <h3>🚀 Primeros Pasos</h3>
                        <p>Configuración inicial y conceptos básicos</p>
                    </div>

                    <div class="nav-card" onclick="docsSystem.showSection('instagram-setup')">
                        <h3>📱 Setup Instagram</h3>
                        <p>Configurar cuentas de Instagram paso a paso</p>
                    </div>

                    <div class="nav-card" onclick="docsSystem.showSection('automation-guide')">
                        <h3>⚡ Automatización</h3>
                        <p>Guía completa de automatización</p>
                    </div>

                    <div class="nav-card" onclick="docsSystem.showSection('ai-configuration')">
                        <h3>🤖 Configuración AI</h3>
                        <p>Setup y optimización del sistema AI</p>
                    </div>
                </div>
            </div>
        `;
  }

  loadDefaultContent() {
    this.loadContent("getting-started");
  }

  searchDocs(query) {
    if (!query.trim()) {
      this.loadContent(this.currentSection);
      return;
    }

    // Simple search implementation
    const docsMain = document.getElementById("docsMain");
    if (!docsMain) return;

    docsMain.innerHTML = `
            <div class="docs-section">
                <h1>🔍 Resultados de Búsqueda: "${query}"</h1>
                <p>Función de búsqueda en desarrollo. Por favor usa la navegación lateral.</p>
            </div>
        `;
  }

  highlightCode() {
    // Simple syntax highlighting for code blocks
    document.querySelectorAll("pre code").forEach((block) => {
      // Basic highlighting - can be enhanced with a proper library
      let content = block.innerHTML;

      // Highlight JSON keys
      content = content.replace(
        /"([^"]+)":/g,
        '<span class="json-key">"$1":</span>',
      );

      // Highlight strings
      content = content.replace(
        /"([^"]+)"/g,
        '<span class="json-string">"$1"</span>',
      );

      // Highlight numbers
      content = content.replace(
        /\b(\d+)\b/g,
        '<span class="json-number">$1</span>',
      );

      // Highlight booleans
      content = content.replace(
        /\b(true|false)\b/g,
        '<span class="json-boolean">$1</span>',
      );

      block.innerHTML = content;
    });
  }
}

// Initialize documentation system
document.addEventListener("DOMContentLoaded", () => {
  window.docsSystem = new DocumentationSystem();
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = DocumentationSystem;
}
