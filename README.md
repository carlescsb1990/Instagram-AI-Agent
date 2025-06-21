# 🤖 Riona AI Agent - Sistema Completo de Automatización IA

[![Estado](https://img.shields.io/badge/Estado-100%25%20Funcional-brightgreen)]()
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)]()
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.x-blue)]()

## 🎯 **¿Qué es Riona AI Agent?**

Riona AI Agent es un **sistema de automatización inteligente** que utiliza IA generativa para gestionar múltiples plataformas de redes sociales de forma autónoma. El sistema incluye:

- **🧠 Inteligencia Artificial**: Google Gemini 2.0 Flash
- **📱 Multi-Plataforma**: Instagram, Twitter, GitHub
- **🎭 Caracteres Personalizables**: Múltiples personalidades AI
- **📊 Dashboard Completo**: Interfaz web moderna y funcional
- **🔄 Automatización**: Procesos inteligentes en tiempo real

---

## 🚀 **Aplicación 100% Funcional**

### **✅ Backend API (Puerto 3000)**

- **Express.js + TypeScript**: Servidor robusto y escalable
- **Endpoints REST**: API completa para todas las funcionalidades
- **Sistema de Agentes**: IA con caracteres personalizables
- **Automatización**: Instagram, Twitter, GitHub
- **Logging**: Sistema completo con Winston
- **Seguridad**: Helmet, CORS, validaciones

### **✅ Frontend Dashboard**

- **Interfaz Moderna**: HTML5, CSS3, JavaScript ES6+
- **Dashboard en Tiempo Real**: Monitoreo completo del sistema
- **Panel de Control**: Gestión de agentes y automatización
- **Documentación Integrada**: Guías completas y troubleshooting
- **Responsive**: Optimizado para todos los dispositivos

---

## 🏗️ **Arquitectura del Sistema**

```
┌─ Frontend Dashboard (http://localhost:3000/)
│  ├─ Dashboard Principal
│  ├─ Gestión de Agentes AI
│  ├─ Control de Redes Sociales
│  ├─ Analíticas y Métricas
│  └─ Documentación Completa
│
├─ Backend API (Express + TypeScript)
│  ├─ Sistema de Agentes AI
│  │  ├─ Google Gemini 2.0 Flash
│  │  ├─ ArcanEdge System Agent
│  │  ├─ Elon Character
│  │  └─ Sample Character
│  │
│  ├─ Automatización de Redes Sociales
│  │  ├─ Instagram (Puppeteer + API)
│  │  ├─ Twitter (API v2)
│  │  └─ GitHub (API)
│  │
│  ├─ Procesamiento de Contenido
│  ├─ Base de Datos (MongoDB - Opcional)
│  └─ Sistema de Logging (Winston)
│
└─ Configuración y Variables de Entorno
```

---

## 📱 **Cómo Usar la Aplicación**

### **🌐 Acceso Web**

1. **Dashboard Principal**: `http://localhost:3000/`
2. **Estado de Salud**: `http://localhost:3000/health`
3. **API Status**: `http://localhost:3000/status`
4. **Agente AI**: `http://localhost:3000/agent`
5. **Redes Sociales**: `http://localhost:3000/social`

### **📊 Funcionalidades del Dashboard**

#### **🏠 Dashboard Principal**

- **Estado del Sistema**: Monitoreo en tiempo real
- **Métricas de Rendimiento**: CPU, RAM, uptime
- **Estado de Agentes**: IA y automatización
- **Plataformas Sociales**: Instagram, Twitter, GitHub
- **Registro de Actividad**: Logs en tiempo real

#### **🧠 Agente AI**

- **Caracteres Disponibles**: Selección y configuración
- **Generador de Contenido**: IA con prompts personalizados
- **Pruebas del Agente**: Testing en tiempo real
- **Configuración**: Parámetros y ajustes

#### **📱 Redes Sociales**

- **Instagram**: Automatización de comentarios e interacciones
- **Twitter**: Gestión de tweets y engagement
- **GitHub**: Monitoreo de repositorios (en desarrollo)
- **Controles**: Iniciar/detener automatización por plataforma

#### **📚 Documentación**

- **Guía Completa**: Arquitectura y funcionalidades
- **API Reference**: Endpoints y ejemplos
- **Troubleshooting**: Solución de problemas
- **Configuración**: Variables de entorno

---

## 🔧 **Configuración Completa**

### **📋 Requisitos**

- **Node.js**: 22.x o superior
- **npm**: 10.x o superior
- **TypeScript**: 5.7.x (incluido)

### **⚙️ Variables de Entorno**

Crear archivo `.env` en la raíz del proyecto:

```bash
# Configuración del Sistema
NODE_ENV=development

# Base de Datos (Opcional en desarrollo)
MONGODB_URI=mongodb://localhost:27017/riona-ai-agent

# Instagram (Opcional)
IGusername=tu_usuario_instagram
IGpassword=tu_contraseña_instagram

# Twitter API (Opcional)
TWITTER_API_KEY=tu_api_key
TWITTER_API_SECRET=tu_api_secret
TWITTER_ACCESS_TOKEN=tu_access_token
TWITTER_ACCESS_SECRET=tu_access_secret
TWITTER_BEARER_TOKEN=tu_bearer_token

# Google Gemini API Keys (Ya incluidas - 50 keys)
GEMINI_API_KEY_1=AIzaSyBwOdDKvtandLwzPhtGS_nqFYzkWY0_RQE
# ... (más keys disponibles en .env.example)
```

### **🚀 Instalación y Ejecución**

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar TypeScript
npm run build

# 3. Iniciar servidor
npm run start

# ✅ La aplicación estará disponible en http://localhost:3000/
```

---

## 🎯 **Funcionalidades Principales**

### **🤖 Sistema de IA**

- **Google Gemini 2.0 Flash**: Modelo de IA de última generación
- **50 API Keys**: Configuradas para alta disponibilidad
- **Caracteres Personalizables**: Múltiples personalidades
- **Generación de Contenido**: Posts, comentarios, tweets

### **📱 Automatización de Redes Sociales**

#### **📸 Instagram**

- ✅ **Automatización de Comentarios**: IA contextual
- ✅ **Interacción con Posts**: Likes y engagement
- ✅ **Gestión de Sesiones**: Cookies y autenticación
- ✅ **Modo Headless**: Funcionamiento en servidor

#### **🐦 Twitter**

- ✅ **API v2 Integrada**: Autenticación completa
- ✅ **Publicación Automática**: Tweets programados
- ✅ **Límites de Rate**: Gestión inteligente
- ✅ **Engagement Automation**: Respuestas automáticas

#### **🐙 GitHub**

- 🔄 **En Desarrollo**: Monitoreo de repositorios
- 🔄 **Issues Automation**: Respuestas automáticas
- 🔄 **Code Analysis**: Análisis de código

### **📊 Monitoreo y Métricas**

- **Tiempo Real**: Actualizaciones cada 30 segundos
- **Métricas del Sistema**: CPU, RAM, uptime
- **Estado de Servicios**: Base de datos, IA, APIs
- **Logs Estructurados**: Winston con rotación diaria
- **Health Checks**: Endpoints de salud

---

## 📡 **API Endpoints Completos**

### **🏠 Endpoints Principales**

| Método | Endpoint  | Descripción                         |
| ------ | --------- | ----------------------------------- |
| `GET`  | `/`       | Información del sistema y endpoints |
| `GET`  | `/health` | Estado de salud con métricas        |
| `GET`  | `/status` | Estado del servidor                 |
| `GET`  | `/agent`  | Estado del agente AI                |
| `GET`  | `/social` | Estado de redes sociales            |

### **🤖 Endpoints de IA**

| Método | Endpoint          | Descripción          |
| ------ | ----------------- | -------------------- |
| `POST` | `/api/generate`   | Generar contenido AI |
| `GET`  | `/api/characters` | Lista de caracteres  |

#### **Ejemplo de Generación AI:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crea un comentario motivacional",
    "type": "comment"
  }'
```

### **📱 Control de Plataformas**

| Método | Endpoint                      | Descripción            |
| ------ | ----------------------------- | ---------------------- |
| `POST` | `/api/social/:platform/start` | Iniciar automatización |
| `POST` | `/api/social/:platform/stop`  | Detener automatización |

---

## 🎭 **Caracteres AI Disponibles**

### **1. ArcanEdge System Agent** ✅ _Activo_

- **Especialidad**: Prompt engineering y transformación digital
- **Estilo**: Profesional, innovador, técnico
- **Plataformas**: Instagram, Facebook, LinkedIn
- **Uso**: Contenido empresarial y tecnológico

### **2. Elon Character**

- **Especialidad**: Emprendimiento e innovación
- **Estilo**: Visionario, disruptivo, motivacional
- **Plataformas**: Twitter, Instagram
- **Uso**: Contenido de innovación y futuro

### **3. Sample Character**

- **Especialidad**: Propósito general
- **Estilo**: Amigable, conversacional
- **Plataformas**: Todas
- **Uso**: Contenido general y pruebas

---

## 🔄 **Flujo de Funcionamiento**

### **🚀 Al Iniciar**

1. **Compilación TypeScript**: Código fuente a JavaScript
2. **Inicialización del Agente**: Selección de carácter (ArcanEdge)
3. **Servidor Express**: Puerto 3000 disponible
4. **Conexión a Servicios**: IA, Base de datos (opcional)
5. **Automatización**: Ciclos cada 30 segundos

### **🔄 Ciclo de Automatización**

1. **Instagram Agent**: Ejecuta interacciones (si configurado)
2. **Twitter Agent**: Procesa tweets (si configurado)
3. **GitHub Agent**: Monitorea repos (en desarrollo)
4. **Espera**: 30 segundos hasta siguiente iteración

### **🧠 Generación de Contenido**

1. **Prompt del Usuario**: Entrada de texto
2. **Selección de Carácter**: Personalidad activa
3. **Procesamiento IA**: Google Gemini
4. **Contenido Optimizado**: Listo para publicar

---

## 🛡️ **Seguridad y Configuración**

### **🔒 Seguridad Implementada**

- **Helmet**: Headers de seguridad
- **CORS**: Control de acceso
- **Rate Limiting**: Prevención de spam
- **Validation**: Sanitización de inputs
- **Environment Variables**: Credenciales seguras

### **🌍 Modos de Operación**

#### **🔧 Desarrollo** (Actual)

- MongoDB opcional
- Logs detallados
- Recarga automática
- Modo no-interactivo

#### **🚀 Producción**

- MongoDB requerido
- Logs optimizados
- Rate limiting activo
- Modo headless completo

---

## 📊 **Métricas y Monitoreo**

### **📈 Métricas del Sistema**

- **Uptime**: Tiempo de funcionamiento
- **Memoria**: Uso de RAM en tiempo real
- **CPU**: Carga del procesador
- **Requests/min**: Tráfico API

### **🔍 Logs Estructurados**

- **Niveles**: INFO, WARN, ERROR
- **Timestamp**: Marca de tiempo precisa
- **Contexto**: Información detallada
- **Rotación**: Archivos diarios

### **⚡ Estado de Servicios**

- **Backend**: Estado del servidor
- **IA**: Conectividad con Gemini
- **Base de Datos**: MongoDB (opcional)
- **Plataformas**: Instagram, Twitter, GitHub

---

## 🔧 **Solución de Problemas**

### **❌ Problemas Comunes**

#### **Error: "Cannot GET /"**

```bash
# Verificar que el servidor esté ejecutándose
curl http://localhost:3000/health

# Reiniciar si es necesario
npm run start
```

#### **Error de Compilación TypeScript**

```bash
# Verificar errores específicos
npm run build

# Reinstalar dependencias si es necesario
rm -rf node_modules package-lock.json
npm install
```

#### **Instagram: "Credenciales no configuradas"**

```bash
# Agregar credenciales al archivo .env
IGusername=tu_usuario
IGpassword=tu_contraseña

# Reiniciar servidor
npm run start
```

### **🔍 Diagnóstico**

#### **Comandos Útiles**

```bash
# Estado de salud
curl http://localhost:3000/health

# Verificar agente AI
curl http://localhost:3000/agent

# Estado de redes sociales
curl http://localhost:3000/social

# Logs en tiempo real (si disponible)
tail -f logs/application.log
```

#### **Verificación del Sistema**

```bash
# Comprobar puerto 3000
netstat -tlnp | grep :3000

# Verificar procesos Node.js
ps aux | grep node

# Espacio en disco
df -h
```

---

## 🎯 **Roadmap y Mejoras Futuras**

### **🔄 En Desarrollo**

- [ ] **GitHub Integration**: Automatización completa
- [ ] **Analytics Dashboard**: Métricas avanzadas
- [ ] **Multi-Account Support**: Múltiples cuentas por plataforma
- [ ] **Scheduled Posts**: Publicaciones programadas
- [ ] **Content Calendar**: Calendario de contenido

### **🚀 Próximas Funcionalidades**

- [ ] **LinkedIn Integration**: Nueva plataforma
- [ ] **TikTok Support**: Contenido de video
- [ ] **AI Training**: Entrenamiento personalizado
- [ ] **Webhook Support**: Integraciones externas
- [ ] **Mobile App**: Aplicación móvil

### **⚡ Optimizaciones**

- [ ] **Performance**: Optimización de velocidad
- [ ] **Scalability**: Soporte para múltiples instancias
- [ ] **Monitoring**: Métricas avanzadas
- [ ] **Security**: Autenticación y autorización
- [ ] **Documentation**: API docs automática

---

## 📞 **Soporte y Contacto**

### **🛟 Obtener Ayuda**

- **Dashboard**: Logs en tiempo real
- **Health Endpoint**: `GET /health`
- **Status Endpoint**: `GET /status`
- **Documentation**: Panel integrado

### **🐛 Reportar Problemas**

- **GitHub Issues**: Reportar bugs
- **Feature Requests**: Nuevas funcionalidades
- **Pull Requests**: Contribuciones

### **📚 Recursos**

- **Documentación**: Dashboard integrado
- **API Reference**: Endpoints completos
- **Examples**: Casos de uso
- **Troubleshooting**: Solución de problemas

---

## 📄 **Licencia**

Este proyecto está bajo la licencia ISC.

---

## ✨ **Resumen - Estado Actual**

### **✅ 100% FUNCIONAL**

- ✅ **Backend API**: Express + TypeScript funcionando
- ✅ **Frontend Dashboard**: Interfaz web completa
- ✅ **Sistema de IA**: Google Gemini integrado
- ✅ **Automatización**: Instagram configurado
- ✅ **Monitoreo**: Métricas en tiempo real
- ✅ **Documentación**: Guías completas
- ✅ **API Endpoints**: Todos funcionando
- ✅ **Logs**: Sistema completo
- ✅ **Seguridad**: Implementada

### **🚀 Listo para Uso**

El sistema está completamente operativo y listo para:

- Monitorear el estado del sistema
- Generar contenido con IA
- Automatizar redes sociales
- Analizar métricas en tiempo real
- Gestionar configuraciones

**Accede al dashboard en: `http://localhost:3000/`**

---

_🤖 Desarrollado con ❤️ usando IA y tecnologías modernas_
