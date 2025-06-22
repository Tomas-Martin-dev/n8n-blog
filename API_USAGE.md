# Documentación de la API del Blog

## 🔐 Autenticación

Para crear nuevos posts, **n8n debe enviar un Bearer token** en el header de autorización.

### Token actual:
```
n8n-blog-token-2024-secure
```

### Formato de autenticación:
```
Authorization: Bearer n8n-blog-token-2024-secure
```

---

## 📝 Endpoints disponibles

### **POST /api/posts** - Crear nuevo post (REQUIERE TOKEN)

**URL:** `https://tu-dominio.com/api/posts`

**Método:** `POST`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer n8n-blog-token-2024-secure
```

**Body (JSON):**
```json
{
  "title": "Recetas para la semana del 15 de Enero",
  "description": "7 deliciosas recetas para planificar tu semana completa",
  "recipes": [
    {
      "id": "lunes-pasta",
      "recipeText": "Pasta con tomate: Hervir 200g de pasta, calentar salsa de tomate con ajo y albahaca. Mezclar y servir con queso parmesano.",
      "img": "https://example.com/pasta-tomate.jpg"
    },
    {
      "id": "martes-ensalada",
      "recipeText": "Ensalada César: Lechuga romana, pollo a la plancha, crutones, queso parmesano y aderezo césar casero.",
      "img": "https://example.com/ensalada-cesar.jpg"
    }
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "title": "Recetas para la semana del 15 de Enero",
    "description": "7 deliciosas recetas para planificar tu semana completa",
    "recipes": [
      {
        "id": "lunes-pasta",
        "recipeText": "Pasta con tomate: Hervir 200g de pasta...",
        "img": "https://example.com/pasta-tomate.jpg"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "slug": "recetas-para-la-semana-del-15-de-enero"
  },
  "message": "Post creado exitosamente"
}
```

**Errores posibles:**
- **401:** Token faltante o inválido
- **403:** Token sin permisos
- **400:** Campos requeridos faltantes (title, description, recipes)

---

### **GET /api/posts** - Obtener todos los posts (SIN TOKEN)

**URL:** `https://tu-dominio.com/api/posts`

**Método:** `GET`

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123def456",
      "title": "Recetas para la semana del 15 de Enero",
      "description": "7 deliciosas recetas para planificar tu semana completa",
      "recipes": [
        {
          "id": "lunes-pasta",
          "recipeText": "Pasta con tomate...",
          "img": "https://example.com/pasta-tomate.jpg"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "slug": "recetas-para-la-semana-del-15-de-enero"
    }
  ]
}
```

---

### **GET /api/posts/[id]** - Obtener un post específico (SIN TOKEN)

**URL:** `https://tu-dominio.com/api/posts/abc123def456`

**Método:** `GET`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "title": "Recetas para la semana del 15 de Enero",
    "description": "7 deliciosas recetas para planificar tu semana completa",
    "recipes": [
      {
        "id": "lunes-pasta",
        "recipeText": "Pasta con tomate...",
        "img": "https://example.com/pasta-tomate.jpg"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "slug": "recetas-para-la-semana-del-15-de-enero"
  }
}
```

---

## 🔒 Seguridad

### Qué está protegido:
- ✅ **Crear posts** - Requiere Bearer token válido en headers
- ✅ **Validación de campos** - Todos los campos requeridos se validan

### Qué es público:
- 📖 **Leer posts** - Cualquiera puede ver los posts publicados
- 📖 **Leer post individual** - Acceso público para el blog

---

## 🛠 Configuración en n8n

En tu workflow de n8n, configura el nodo HTTP Request así:

**Method:** `POST`
**URL:** `https://tu-dominio.com/api/posts`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer n8n-blog-token-2024-secure
```

**Body:**
```json
{
  "title": "{{ $json.title }}",
  "description": "{{ $json.description }}",
  "recipes": {{ $json.recipes }}
}
```

### Ejemplo completo para n8n:
```json
{
  "title": "Menú semanal saludable",
  "description": "Recetas nutritivas para toda la semana",
  "recipes": [
    {
      "id": "day1-breakfast",
      "recipeText": "Avena con frutas: Mezclar 1/2 taza de avena con leche, agregar frutas frescas y miel.",
      "img": "https://example.com/avena-frutas.jpg"
    },
    {
      "id": "day1-lunch", 
      "recipeText": "Ensalada de quinoa: Quinoa cocida con vegetales frescos, aguacate y vinagreta de limón.",
      "img": "https://example.com/quinoa-salad.jpg"
    }
  ]
}
``` 