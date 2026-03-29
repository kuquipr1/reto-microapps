"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const translations: Translations = {
  // Common
  "app.name": { es: "Micro-Apps Portal", en: "Micro-Apps Portal" },
  "app.tagline": { es: "Tu portal de micro aplicaciones", en: "Your micro applications portal" },
  "email.placeholder": { es: "Tu correo electrónico", en: "Your email address" },
  "password.placeholder": { es: "Tu contraseña", en: "Your password" },
  "loading": { es: "Cargando...", en: "Loading..." },
  "success": { es: "Éxito", en: "Success" },
  "error": { es: "Error", en: "Error" },

  // Login
  "login.title": { es: "Iniciar Sesión", en: "Sign In" },
  "login.forgot_password": { es: "¿Olvidaste tu contraseña?", en: "Forgot your password?" },
  "login.no_account": { es: "¿No tienes cuenta? Regístrate", en: "Don't have an account? Sign up" },
  "login.verified": { es: "¡Email Confirmado! Tu cuenta ha sido verificada.", en: "Email Confirmed! Your account has been verified." },
  "login.auth_failed": { es: "El enlace de autenticación ha fallado o expirado.", en: "The authentication link failed or expired." },

  // Signup
  "signup.title": { es: "Crear Cuenta", en: "Create Account" },
  "signup.first_name": { es: "Nombre", en: "First Name" },
  "signup.last_name": { es: "Apellido", en: "Last Name" },
  "signup.has_account": { es: "¿Ya tienes cuenta? Inicia sesión", en: "Already have an account? Sign in" },
  "signup.success_toast": { es: "Revisa tu correo para confirmar tu cuenta", en: "Check your email to confirm your account" },

  // Forgot Password
  "forgot.title": { es: "Enviar enlace de recuperación", en: "Send recovery link" },
  "forgot.back": { es: "← Volver a iniciar sesión", en: "← Back to sign in" },
  "forgot.success_toast": { es: "Enlace enviado a tu correo", en: "Link sent to your email" },

  // Welcome
  "welcome.greeting": { es: "¡Bienvenido al Portal de Micro-Apps!", en: "Welcome to the Micro-Apps Portal!" },
  "welcome.subheading": { es: "Estamos preparando algo increíble para ti.", en: "We are preparing something amazing for you." },
  "welcome.coming_soon": { es: "Próximamente", en: "Coming Soon" },
  "welcome.hello": { es: "Hola", en: "Hello" },
  "welcome.footer": { es: "Te notificaremos cuando todo esté listo.", en: "We'll notify you when everything is ready." },
  "welcome.logout": { es: "Cerrar Sesión", en: "Log Out" },

  // Dashboard
  "dashboard.search_placeholder": { es: "Buscar aplicaciones...", en: "Search applications..." },
  "dashboard.filter_all": { es: "Todas", en: "All" },
  "dashboard.filter_active": { es: "Activas", en: "Active" },
  "dashboard.filter_upcoming": { es: "Próximamente", en: "Coming Soon" },
  "dashboard.no_results": { es: "No se encontraron aplicaciones.", en: "No applications found." },
  "dashboard.apps_count": { es: "{count} aplicaciones disponibles", en: "{count} applications available" },

  // App Status
  "status.active": { es: "Activa", en: "Active" },
  "status.beta": { es: "Beta", en: "Beta" },
  "status.upcoming": { es: "Próximamente", en: "Upcoming" },
  "status.maintenance": { es: "Mantenimiento", en: "Maintenance" },

  // Apps
  "apps.crm.name": { es: "NexSync CRM", en: "NexSync CRM" },
  "apps.crm.description": { es: "Gestión avanzada de relaciones con clientes y prospectos.", en: "Advanced customer and prospect relationship management." },
  "apps.analytics.name": { es: "DataPulse Analytics", en: "DataPulse Analytics" },
  "apps.analytics.description": { es: "Visualiza tus datos con gráficos dinámicos e insights en vivo.", en: "Visualize your data with dynamic charts and live insights." },
  "apps.inventory.name": { es: "StockMaster", en: "StockMaster" },
  "apps.inventory.description": { es: "Control de inventario en tiempo real con alertas inteligentes.", en: "Real-time inventory control with smart alerts." },
  "apps.payroll.name": { es: "FinanzFlow Payroll", en: "FinanzFlow Payroll" },
  "apps.payroll.description": { es: "Gestión de nómina y beneficios automatizada.", en: "Automated payroll and benefits management." },
  "apps.documents.name": { es: "DocuVerse", en: "DocuVerse" },
  "apps.documents.description": { es: "Almacenamiento y edición colaborativa de documentos.", en: "Collaborative document storage and editing." },
  "apps.helpdesk.name": { es: "HelpDesk", en: "HelpDesk" },
  "apps.helpdesk.description": { es: "Gestión de tickets de soporte y atención al cliente.", en: "Support ticket management and customer service." },
  "apps.settings.name": { es: "Portal Config", en: "Portal Config" },
  "apps.settings.description": { es: "Personaliza tu experiencia y gestiona tu cuenta.", en: "Customize your experience and manage your account." },

  // Settings
  "settings.title": { es: "Configuración", en: "Settings" },
  "settings.profile.title": { es: "Perfil Público", en: "Public Profile" },
  "settings.profile.subtitle": { es: "Gestiona tu información personal y cómo otros te ven.", en: "Manage your personal information and how others see you." },
  "settings.account.title": { es: "Cuenta", en: "Account" },
  "settings.security.title": { es: "Seguridad", en: "Security" },
  "settings.notifications.title": { es: "Notificaciones", en: "Notifications" },
  "settings.update_success": { es: "Perfil actualizado con éxito.", en: "Profile updated successfully." },
  "settings.update_error": { es: "Error al actualizar el perfil.", en: "Error updating profile." },

  // CRM Specific
  "crm.dashboard": { es: "Panel de Control", en: "Dashboard" },
  "crm.customers": { es: "Clientes", en: "Customers" },
  "crm.stats.total": { es: "Total Clientes", en: "Total Customers" },
  "crm.stats.active": { es: "Clientes Activos", en: "Active Customers" },
  "crm.stats.leads": { es: "Leads", en: "Leads" },
  "crm.stats.prospects": { es: "Prospectos", en: "Prospects" },
  "crm.add_customer": { es: "Añadir Cliente", en: "Add Customer" },
  "crm.search_customer": { es: "Buscar por nombre, email o empresa...", en: "Search by name, email or company..." },
  "crm.form.first_name": { es: "Nombre", en: "First Name" },
  "crm.form.last_name": { es: "Apellido", en: "Last Name" },
  "crm.form.email": { es: "Correo Electrónico", en: "Email Address" },
  "crm.form.phone": { es: "Teléfono", en: "Phone Number" },
  "crm.form.company": { es: "Empresa", en: "Company" },
  "crm.form.status": { es: "Estado", en: "Status" },
  "crm.form.save": { es: "Guardar Cliente", en: "Save Customer" },
  "crm.form.cancel": { es: "Cancelar", en: "Cancel" },
  "crm.table.name": { es: "Nombre", en: "Name" },
  "crm.table.contact": { es: "Contacto", en: "Contact" },
  "crm.table.company": { es: "Empresa", en: "Company" },
  "crm.table.status": { es: "Estado", en: "Status" },
  "crm.table.actions": { es: "Acciones", en: "Actions" },

  // Analytics Specific
  "analytics.dashboard": { es: "Panel Analítico", en: "Analytics Dashboard" },
  "analytics.total_customers": { es: "Total de Clientes", en: "Total Customers" },
  "analytics.status_dist": { es: "Distribución de Estados", en: "Status Distribution" },
  "analytics.customer_growth": { es: "Crecimiento de Clientes", en: "Customer Growth" },
  "analytics.monthly_trend": { es: "Tendencia Mensual", en: "Monthly Trend" },
  "analytics.conversion_rate": { es: "Tasa de Conversión", en: "Conversion Rate" },

  // Inventory Specific
  "inventory.title": { es: "Inventario", en: "Inventory" },
  "inventory.add_product": { es: "Añadir Producto", en: "Add Product" },
  "inventory.search_product": { es: "Buscar por nombre, SKU o categoría...", en: "Search by name, SKU or category..." },
  "inventory.stock_status": { es: "Estado de Stock", en: "Stock Status" },
  "inventory.low_stock": { es: "Stock Bajo", en: "Low Stock" },
  "inventory.categories": { es: "Categorías", en: "Categories" },
  "inventory.form.name": { es: "Nombre del Producto", en: "Product Name" },
  "inventory.form.price": { es: "Precio", en: "Price" },
  "inventory.form.stock": { es: "Cantidad inicial", en: "Initial Stock" },

  // Payroll Specific
  "payroll.title": { es: "Nómina", en: "Payroll" },
  "payroll.employees": { es: "Empleados", en: "Employees" },
  "payroll.add_employee": { es: "Añadir Empleado", en: "Add Employee" },
  "payroll.total_monthly": { es: "Gasto Mensual", en: "Monthly Spending" },
  "payroll.form.salary": { es: "Salario Mensual", en: "Monthly Salary" },
  "payroll.form.role": { es: "Puesto / Cargo", en: "Role / Position" },

  // DocuVerse Specific
  "documents.title": { es: "Documentos", en: "Documents" },
  "documents.upload": { es: "Subir Archivo", en: "Upload File" },
  "documents.empty": { es: "No hay documentos", en: "No documents found" },

  // Landing
  "landing.title": { es: "Portal de Micro-Apps", en: "Micro-Apps Portal" },
  "landing.subtitle": { es: "Accede a todas tus herramientas desde un solo lugar con una experiencia premium.", en: "Access all your tools from one place with a premium experience." },
  "landing.get_started": { es: "Empezar ahora", en: "Get Started" },
  "landing.features.title": { es: "Características Principales", en: "Key Features" },
  "landing.features.1.title": { es: "Glassmorphism", en: "Glassmorphism" },
  "landing.features.1.desc": { es: "Interfaz moderna y elegante con efectos de desenfoque.", en: "Modern and elegant interface with blur effects." },
  "landing.features.2.title": { es: "Seguridad", en: "Security" },
  "landing.features.2.desc": { es: "Autenticación robusta con Supabase.", en: "Robust authentication with Supabase." },
  "landing.features.3.title": { es: "Multilenguaje", en: "Multi-language" },
  "landing.features.3.desc": { es: "Soporte completo para Español e Inglés.", en: "Full support for Spanish and English." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Language;
    if (saved && (saved === "es" || saved === "en")) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app_lang", lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
