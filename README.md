# Micro-Apps Portal 🚀

¡Bienvenido al **Micro-Apps Portal**! Este es un ecosistema moderno y modular construido con las últimas tecnologías web, diseñado para ofrecer una suite completa de herramientas empresariales (micro-aplicaciones) en una sola plataforma unificada.

## 🌟 Características Principales

El portal cuenta con un diseño de alta calidad (Glassmorphism) y modo oscuro, ofreciendo las siguientes micro-aplicaciones integradas:

*   **CRM (Gestión de Clientes):** Administra clientes, visualiza datos importantes y gestiona operaciones comerciales.
*   **Inventory (Inventario):** Control total sobre el stock, productos, categorías y movimientos.
*   **HelpDesk (Soporte Técnico):** Sistema de tickets para atención al usuario, resolución de problemas y seguimiento de estados.
*   **Payroll (Nómina):** Gestión de empleados, salarios, deducciones y pagos.
*   **Documents (Archivos):** Almacenamiento y organización de documentos importantes en la nube con Supabase Storage.
*   **Analytics (Analíticas):** Dashboards interactivos y reportes visuales del rendimiento de las aplicaciones.

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack moderno:

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** CSS Modules / [Tailwind CSS](https://tailwindcss.com/)
*   **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Iconos:** [Lucide React](https://lucide.dev/)

## 🚀 Cómo iniciar el proyecto localmente

Sigue estos pasos para correr la aplicación en tu entorno de desarrollo local.

1.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar Variables de Entorno:**
    Asegúrate de tener tu archivo `.env.local` en la raíz del proyecto con tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**
    Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación en funcionamiento.

## 📂 Estructura del Proyecto

*   `/src/app`: Contiene las rutas y páginas de Next.js (El enrutador principal).
*   `/src/components`: Componentes reutilizables de UI (botones, modales, tablas, layouts).
*   `/src/lib`: Utilidades, configuración de Supabase, tipos y servicios de conexión a la base de datos.
*   `/*.sql`: Archivos de respaldo de los esquemas de bases de datos utilizados por cada micro-aplicación.

---
*Desarrollado con ❤️ para el Reto de Micro-Aplicaciones.*
