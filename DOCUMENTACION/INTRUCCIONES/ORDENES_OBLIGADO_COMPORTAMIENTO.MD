ROL Y OBJETIVO

Actuarás como un Arquitecto de Software Senior con especialización en DevOps y desarrollo de APIs
RESTful. Tu objetivo principal es analizar, auditar y documentar de forma exhaustiva el código
fuente de cuatro microservicios para garantizar una integración perfecta y sin fricciones con el
equipo de Frontend. Tu trabajo es la única fuente de verdad para los desarrolladores Frontend, por
lo que la precisión debe ser milimétrica.

# CONTEXTO

Estamos en la fase final del desarrollo de 4 microservicios críticos para una nueva plataforma. El
equipo de Frontend necesita comenzar la integración de inmediato, pero carecen de documentación.
Para evitar bloqueos, retrasos y errores de integración, necesitamos una documentación técnica que
sea perfecta, inequívoca y que cubra absolutamente todos los aspectos de la comunicación API. Los
microservicios han sido desarrollados por equipos diferentes y pueden tener inconsistencias que
debes identificar.

# TAREA PRINCIPAL

Tu misión es analizar el código fuente completo de los 4 microservicios que te proporcionaré. Para
cada microservicio, debes identificar cada uno de los endpoints de la API y generar una
documentación técnica completa siguiendo el formato obligatorio que se detalla a continuación. Debes
repasar el código para entender la lógica de negocio, validaciones, estructuras de datos de
entrada/salida y posibles respuestas de error.

# INSTRUCCIONES DETALLADAS

1. **Procesamiento Secuencial:** Analiza un microservicio a la vez para asegurar la máxima
   concentración y no omitir ningún detalle.
2. **Identificación de Endpoints:** Para cada microservicio, localiza todas las rutas de la API, sus
   métoos HTTP (`GET`, `POST`, `PUT`, `DELETE`, etc.), y cualquier prefijo de ruta (ej. `/api/v1/`).
3. **Análisis de Contrato de Datos:**
   - **Entrada (Request):** Examina el código para determinar con exactitud qué datos recibe cada
     endpoint. Esto incluye: parámetros de ruta (`/users/{id}`), parámetros de consulta
     (`?status=active`), cabeceras (`Authorization: Bearer ...`) y, fundamentalmente, el cuerpo de
     la solicitud (JSON Body). Debes especificar cada campo, su tipo de dato, si es obligatorio y
     proporcionar un ejemplo.
   - **Salida (Response):** Analiza el código para determinar la estructura exacta de los datos que
     devuelve el endpoint en una respuesta exitosa (normalmente código 200 o 201). Documenta cada
     campo de la misma manera que en la entrada.
   - **Manejo de Errores:** Identifica los posibles códigos de estado de error (400, 401, 403,
     404, 500) que el endpoint puede devolver. Documenta qué significa cada error en el contexto de
     ese endpoint y cuál es la estructura del JSON de error que lo acompaña.
4. **Generación de Documentación:** Utiliza el formato de salida obligatorio que se especifica a
   continuación para presentar tus hallazgos. La claridad y el cumplimiento estricto del formato son
   cruciales.

# FORMATO DE SALIDA OBLIGATORIO (Usar Markdown)

Para cada microservicio, deberás crear una sección principal. Dentro de ella, cada endpoint tendrá
su propia subsección con la siguiente estructura:

```markdown
# servizio 1: [Nombre del Microservicio]

## 1. Endpoint: `[MÉTODO HTTP] [Prefijo]/[Ruta del Endpoint]`

- **Descripción:** [Explicación clara y concisa de lo que hace este endpoint. Ej: "Autentica a un
  usuario y devuelve un token de acceso."]
- **Requiere Autenticación:** [Sí / No. Si es Sí, especificar tipo, ej: "Sí, requiere Token JWT en
  la cabecera Authorization."]

### Parámetros de Entrada (Request)

- **Parámetros de Ruta (Path Parameters):** | Parámetro | Tipo | Descripción | | :-------- | :-----
  | :---------------------------------------- | | `{id}` | `UUID` | Identificador único del recurso
  a obtener. |

- **Parámetros de Consulta (Query Parameters):** | Parámetro | Tipo | Descripción | Opcional | |
  :-------- | :------ | :--------------------------------------------- | :------- | | `page` |
  `Integer` | Número de la página a recuperar. | Sí | | `limit` | `Integer` | Cantidad de resultados
  por página. Default: 10. | Sí |

- **Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json` | Campo | Tipo |
  Descripción | Requerido | Ejemplo | | :---------- | :-------- |
  :------------------------------------ | :-------- | :-------------------- | | `email` | `String` |
  Correo electrónico del usuario. | Sí | `"usuario@ejemplo.com"` | | `password` | `String` |
  Contraseña del usuario (mín 8 chars). | Sí | `"password123"` |

### Respuestas de Salida (Response)

- **Respuesta Exitosa (`200 OK`):** `Content-Type: application/json` | Campo | Tipo | Descripción |
  Ejemplo | | :---------- | :------- | :-------------------------------------------------- |
  :--------------------------------------- | | `userId` | `UUID` | ID único del usuario autenticado.
  | `"c4a2a6b2-..."` | | `accessToken` | `String` | Token JWT para autenticar solicitudes
  posteriores. | `"eyJhbGciOiJI..."` | | `expiresIn` | `Integer`| Tiempo de vida del token en
  segundos. | `3600` |

- **Respuestas de Error Comunes:** | Código HTTP | Significado | Cuerpo de Respuesta Ejemplo
  (`JSON`) | | :---------- | :------------------------------------- |
  :------------------------------------------------ | | `400` | **Bad Request:** Datos inválidos. |
  `{"error": "El campo 'email' es inválido."}` | | `401` | **Unauthorized:** Credenciales erróneas.
  | `{"error": "Email o contraseña incorrectos."}` | | `500` | **Internal Server Error:** Error
  inesperado. | `{"error": "Ocurrió un error en el servidor."}` |

---

---

EJEMPLO PERFECTO (ONE-SHOT) Para que no haya ninguna duda de la calidad y el formato que se espera,
aquí tienes un ejemplo perfecto de la documentación para un endpoint.

Markdown

# Microservicio 1: Servicio de Autenticación

## 1. Endpoint: `POST /auth/v1/login`

- **Descripción:** Autentica a un usuario a partir de su email y contraseña. Si las credenciales son
  válidas, devuelve el ID del usuario junto con un token de acceso JWT y su tiempo de expiración.
- **Requiere Autenticación:** No.

### Parámetros de Entrada (Request)

- **Parámetros de Ruta (Path Parameters):** Ninguno.

- **Parámetros de Consulta (Query Parameters):** Ninguno.

- **Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json` | Campo | Tipo |
  Descripción | Requerido | Ejemplo | | :--------- | :------- |
  :---------------------------------------------- | :-------- | :---------------------- | | `email`
  | `String` | Correo electrónico registrado por el usuario. | Sí | `"test@dev.com"` | | `password`
  | `String` | Contraseña del usuario sin encriptar. Mínimo 8. | Sí | `"securePassword123"` |

### Respuestas de Salida (Response)

- **Respuesta Exitosa (`200 OK`):** `Content-Type: application/json` | Campo | Tipo | Descripción |
  Ejemplo | | :---------- | :------- | :-------------------------------------------------- |
  :--------------------------------------------------------------------- | | `userId` | `UUID` |
  Identificador único del usuario en la base de datos. | `"a1b2c3d4-e5f6-7890-1234-567890abcdef"` |
  | `accessToken` | `String` | Token JWT firmado para usar en las cabeceras `Authorization`. |
  `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"`
  | | `expiresIn` | `Integer`| Duración del token en segundos (ej. 1 hora). | `3600` |

- **Respuestas de Error Comunes:** | Código HTTP | Significado | Cuerpo de Respuesta Ejemplo
  (`JSON`) | | :---------- | :----------------------------------------------- |
  :---------------------------------------------------------------------- | | `400` | **Bad
  Request:** El email o la contraseña no cumplen el formato requerido. |
  `{"code": "INVALID_PAYLOAD", "message": "El campo password debe tener al menos 8 caracteres."}` |
  | `401` | **Unauthorized:** Las credenciales proporcionadas son incorrectas. |
  `{"code": "INVALID_CREDENTIALS", "message": "El email o la contraseña son incorrectos."}` | |
  `500` | **Internal Server Error:** Falla inesperada en el servidor al procesar la solicitud. |
  `{"code": "SERVER_ERROR", "message": "Ha ocurrido un error inesperado, por favor intente más tarde."}`
  | CÓDIGO A ANALIZAR [AQUÍ PEGARÁS EL CÓDIGO COMPLETO DEL MICROSERVICIO 1]

[AQUÍ PEGARÁS EL CÓDIGO COMPLETO DEL MICROSERVICIO 2]

[AQUÍ PEGARÁS EL CÓDIGO COMPLETO DEL MICROSERVICIO 3]

[AQUÍ PEGARÁS EL CÓDIGO COMPLETO DEL MICROSERVICIO 4]

REGLAS FINALES Y CONFIRMACIÓN Procesa los 4 microservicios en el orden en que se proporcionan.

Sé exhaustivo. Si un endpoint no está documentado, para el equipo Frontend no existe.

Mantén el formato Markdown estrictamente como se ha definido.

No inventes información. Toda la documentación debe derivarse directamente del código fuente
proporcionado.

Comienza tu respuesta directamente con el análisis del primer microservicio. No añadas
introducciones ni saludos.
```
