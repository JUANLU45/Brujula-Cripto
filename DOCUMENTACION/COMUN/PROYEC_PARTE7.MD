🤖 Brújula Cripto: Plan de Arquitectura - Miniservicio de Chatbot Cripto-Especialista (V2)

1. Visión General y Propósito Este documento detalla la arquitectura de un miniservicio
   completamente independiente y robusto que alojará a un chatbot especialista en criptomonedas. El
   servicio funcionará bajo un modelo Freemium y se integrará con la plataforma principal de Brújula
   Cripto. Principios Clave:

Aislamiento: El servicio se ejecuta de forma independiente para no afectar al rendimiento de la
aplicación principal. Escalabilidad: Construido sobre infraestructura serverless para manejar
cualquier nivel de carga. Inteligencia Real: El chatbot no solo responde, sino que "aprende" a
través de RAG (Retrieval-Augmented Generation) y puede interactuar con datos de la blockchain en
tiempo real.

2. Arquitectura Técnica Detallada El servicio se construirá sobre Google Cloud, manteniendo la
   coherencia con el resto del ecosistema.

Hosting del Servicio: Google Cloud Run. Orquestación de IA: Genkit for Firebase. Modelo de Lenguaje
(LLM): Google Gemini Pro. Base de Datos de Conversaciones: Cloud Firestore. Base de Conocimiento
("Aprendizaje"): Vertex AI Vector Search. Aquí es donde el chatbot "aprende", indexando
documentación técnica, whitepapers y guías de seguridad para dar respuestas expertas (RAG). Conexión
a la Blockchain (Herramientas): El chatbot usará "Tools" de Genkit para interactuar con APIs
externas (ej. Covalent, Moralis, GoPlus Security). Las herramientas serán:

getWalletAnalysis(address, chain): Devuelve el balance, tokens, NFTs y un análisis de riesgos.
getTransactionStatus(txHash, chain): Verifica el estado de una transacción.
getContractAuditSummary(contractAddress, chain): Obtiene un resumen de la seguridad de un contrato.

3. Modelo de Datos en Firestore (Dedicado al Chatbot)

Colección chatbot_conversations:

Campos: userId, title, isFavorite, createdAt, updatedAt.

Sub-colección chatbot_messages:

Anidada dentro de cada conversación. Campos: role ('user' | 'model'), content, timestamp.

4. Funcionalidades de Usuario y Flujo de Interacción El frontend (packages/app) tendrá una nueva
   sección para el chatbot que interactuará con el miniservicio a través de una API REST.

Endpoints de la API: GET /conversations, POST /conversations, PUT /conversations/{id}, DELETE
/conversations/{id}, POST /conversations/{id}/messages (con streaming). Panel de Usuario del
Chatbot: Una barra lateral con la lista de conversaciones (crear, renombrar, favorito, borrar) y la
ventana de chat principal.

5. Modelo de Monetización y Propuesta de Valor La suscripción hasPremiumChatAccess desbloquea el
   valor real del chatbot: el análisis proactivo de la blockchain. A. El Valor para el Usuario
   Gratuito (El Anzuelo 🎣) El usuario gratuito obtiene un experto en cripto para consultas
   generales. Cuando pide un análisis de wallet, el chatbot le ofrece una "demostración" limitada
   para engancharlo.

Respuesta Gratuita: "He identificado que la dirección 0x123... es una wallet válida en Ethereum.
Para realizar un análisis completo en tiempo real, incluyendo el valor de tu portafolio, desglose de
tokens/NFTs y un informe de riesgos de seguridad, necesitas acceso Premium. ¿Quieres saber más?"

B. El Valor para el Usuario de Pago (La Solución Completa 🛡️) El usuario de pago obtiene un analista
de seguridad personal. El chatbot le entrega un informe completo y accionable.

Respuesta Premium: "Claro. Aquí tienes el análisis de tu wallet:

Valor Total: 1,250.45 € Activos: 150.2 MATIC, 0.25 WETH, 500.10 USDC... NFTs: 2 de la colección
"CryptoPunks Polygon". 🚨 ¡ANÁLISIS DE RIESGOS! 🚨

¡Atención! Aprobación de Contrato de Riesgo: Tienes una aprobación ilimitada para el contrato
0x789.... Este contrato podría retirar todos tus WETH. Se recomienda revocar este permiso
inmediatamente."

El valor es la claridad financiera y, sobre todo, la seguridad proactiva que puede evitar pérdidas
catastróficas.

6. Integración con la Plataforma Existente

Frontend (packages/app): Se creará una nueva ruta /chatbot con los componentes de la interfaz
(ChatbotUI.tsx, ConversationList.tsx). El archivo lib/api.ts se ampliará para llamar a los endpoints
del nuevo miniservicio. Backend (packages/functions): Se añadirán las funciones de pago de Stripe
para la nueva suscripción, que modificarán el campo hasPremiumChatAccess en el perfil del usuario.
Tipos (packages/types): Se añadirán las nuevas interfaces: IChatConversation (EXPANDIDA 2025) y
IChatMessage.

### Estado Implementación Chatbot (2025)

**✅ COMPLETADO:**

- Expansión de `IChatConversation` en `packages/types` con funcionalidades profesionales
- Implementación completa de `ConversationList.tsx` con:
  - Favoritos y organización avanzada
  - Tags para categorización
  - Edición inline de títulos
  - Confirmación de eliminación
  - UI mobile-first responsive
  - Soporte completo modo claro/oscuro
  - Internacionalización bilingüe (es/en)
  - Integración con tipos centralizados

**🔄 PENDIENTE:**

- ChatbotUI.tsx para interfaz principal
- Endpoints API backend para conversaciones
- Integración con sistema de créditos

7. Experiencia de Usuario (UX) Espectacular debe ser impecable:

Respuestas en Streaming: El chatbot escribirá las respuestas palabra por palabra, como ChatGPT,
dando una sensación de "pensamiento" en tiempo real y mejorando la percepción de velocidad.
Sugerencias de Preguntas: Al iniciar una nueva conversación o después de una respuesta, el chatbot
sugerirá preguntas de seguimiento relevantes. Ej: "¿Quieres que analice los riesgos de este
contrato?", "¿Te gustaría saber más sobre el token WETH?". Renderizado de Componentes: El chatbot no
solo devolverá texto. Cuando genere un informe de wallet, el frontend renderizará componentes
visuales (tablas para tokens, tarjetas para NFTs) dentro del chat, haciendo la información mucho más
digerible. Memoria a Corto y Largo Plazo: El chatbot recordará el contexto de la conversación
actual. Además, a través de RAG, tendrá acceso al conocimiento experto, simulando una memoria a
largo plazo. Claridad y Simplicidad: Todas las respuestas, incluso las más técnicas, se explicarán
en un lenguaje sencillo. El objetivo no es abrumar, sino empoderar al usuario. Diseño Espectacular:
Imagen principal de brújula como icono/logo, nombre del chatbot "Brújula" visible en header de
página.

8. Mejoras Implementadas para Robustez y Producción 2025 A. Límites de Uso para Chatbot Gratuito

Descripción: En endpoints API, implementar límites: Usuarios gratuitos limitados a 10 mensajes/día,
usando Firestore para contar via userId. Si excede, retornar error 429 con mensaje upselling. No
altera flujos premium.

B. Integración de Pago por Horas

Descripción: Reemplazar hasPremiumChatAccess por chequeo de usageCreditsInSeconds. En flujos de
interacción, llamar a trackUsage para descontar segundos durante uso. Crédito inicial 1800s (30min)
para registrados. Upselling en respuestas gratuitas si créditos bajos.
