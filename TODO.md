# To-Do List - Blog

Aquí tienes una lista de tareas para comenzar con tu proyecto de "Blog".

### 1. Configuración Inicial del Proyecto
- [x] Inicializar un nuevo proyecto con Next.js.
- [x] Estructurar las carpetas del proyecto (componentes, páginas, api, etc.).

### 2. Base de Datos (Firestore)
- [x] Crear un nuevo proyecto en Firebase.
- [x] Configurar Firestore y obtener las credenciales de servicio.
- [x] Instalar el SDK de Firebase en el proyecto Next.js.
- [x] Crear un archivo de configuración para inicializar Firebase en la aplicación.

### 3. API Backend
- [x] Diseñar la estructura de datos para las recetas en Firestore.
- [x] Crear el endpoint `POST /api/posts` para recibir datos de n8n.
- [x] Crear el endpoint `GET /api/posts` para obtener todas las recetas.
- [x] Crear el endpoint `GET /api/posts/[id]` para obtener una receta específica.

### 4. Documentación de la API (Swagger)
- [ ] Instalar y configurar una librería para generar documentación OpenAPI/Swagger (como `next-swagger-doc`).
- [ ] Documentar los endpoints de la API usando JSDoc o similar.
- [ ] Crear una página en la aplicación para visualizar la documentación de Swagger UI.

### 5. Frontend
- [x] Crear la página principal para listar todas las recetas.
- [x] Buscar svg o modelo 3d para implementar de fondo
- [x] Crear una página dinámica para mostrar el detalle de una receta.
- [x] Implementar la lógica para obtener los datos de Firestore y mostrarlos en las páginas.

### 6. Manejo de Imágenes (URLs)
- [x] Las imágenes vienen como URLs desde n8n (campo `img` en cada recipe).
- [x] Implementar lazy loading y optimización con Next.js Image.
- [x] Crear componente optimizado para mostrar imágenes de recetas.
- [x] Agregar fallback para imágenes que no cargan.

### 7. Despliegue
- [ ] Elegir una plataforma de despliegue (Vercel, Netlify, etc.).
- [ ] Configurar el despliegue continuo. 