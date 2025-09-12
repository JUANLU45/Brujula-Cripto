# 🗄️ PROYEC_PARTE3_FINAL_V3.MD (Backend)

## 2. Estructura de Carpetas (`packages/functions`) - **ACTUALIZADO**
```
/packages/functions/
├── src/
│   ├── admin/
│   │   ├── articleHandlers.ts
│   │   ├── setAdminRole.ts
│   │   ├── siteContentHandlers.ts   # Para gestionar el contenido de la home
│   │   └── serviceDirectoryHandlers.ts # Para gestionar el directorio
│   ├── payments/
│   ├── proxies/
│   ├── public/
│   │   └── handleContactForm.ts     # Para el formulario de contacto
│   └── lib/
...
```

## 3. Modelo de Datos (Firestore) - **ACTUALIZADO**
- **Colección `articles`:** (Sin cambios)
- **Colección `users`:** (Sin cambios)
- **Colección `professionalServices`:**
  - **ID:** Autogenerado
  - **Campos:** `name` (string), `website` (string), `description` (string), `logoUrl` (string), `specialties` (array), `isVerified` (boolean).
- **Colección `siteContent`:**
  - **ID del Documento:** `homepage`
  - **Campos:** `bannerImageUrl` (string), `bannerTitle_es` (string), `bannerTitle_en` (string), `bannerSubtitle_es` (string), `bannerSubtitle_en` (string), `bannerButtonText_es` (string), `bannerButtonText_en` (string), `bannerButtonLink` (string).
- **Colección `contactSubmissions`:**
  - **ID:** Autogenerado
  - **Campos:** `name` (string), `email` (string), `message` (string), `submittedAt` (timestamp), `status` ('new' | 'read').

## 4. Reglas de Seguridad (Firestore) - **ACTUALIZADO**
  ```diff
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /articles/{articleId} { ... }
      match /users/{userId} { ... }

+     // Cualquiera puede leer los servicios, solo los admins pueden escribir
+     match /professionalServices/{serviceId} {
+       allow read: if true;
+       allow write: if request.auth.token.admin == true;
+     }
+     // Cualquiera puede leer el contenido de la home, solo admins pueden escribir
+     match /siteContent/homepage {
+       allow read: if true;
+       allow write: if request.auth.token.admin == true;
+     }
+     // Cualquiera puede crear un envío de contacto, pero nadie puede leerlos
+     match /contactSubmissions/{submissionId} {
+       allow read, write: if false;
+       allow create: if true;
+     }
    }
  }
  ```