export const dict = {
  es: {
    login: "Iniciar Sesión",
    signup: "Crear Cuenta",
    logout: "Cerrar Sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    firstName: "Nombre",
    lastName: "Apellido",
    forgotPassword: "¿Olvidaste tu contraseña?",
    sendRecoveryToken: "Enviar enlace de recuperación",
    welcomeTitle: "¡Bienvenido a AdminSmart 369!",
    welcomeSubtitle: "Estamos preparando algo increíble para ti.",
    comingSoon: "Próximamente",
    noAccount: "¿No tienes cuenta? Regístrate",
    hasAccount: "¿Ya tienes cuenta? Inicia sesión",
    backToLogin: "← Volver a iniciar sesión",
    tagline: "Tu portal de micro aplicaciones",
    notifyReady: "Te notificaremos cuando todo esté listo.",
    emailConfirmed: "¡Email Confirmado! Tu cuenta ha sido verificada.",
    checkEmail: "Revisa tu correo para verificar tu cuenta.",
    recoverySent: "Enlace de recuperación enviado.",
    authLinkFailed: "El enlace de autenticación falló o ha expirado.",
    loginError: "Credenciales inválidas."
  },
  en: {
    login: "Log In",
    signup: "Sign Up",
    logout: "Log Out",
    email: "Email",
    password: "Password",
    firstName: "First Name",
    lastName: "Last Name",
    forgotPassword: "Forgot password?",
    sendRecoveryToken: "Send recovery link",
    welcomeTitle: "Welcome to AdminSmart 369!",
    welcomeSubtitle: "We are preparing something amazing for you.",
    comingSoon: "Coming Soon",
    noAccount: "Don't have an account? Sign up",
    hasAccount: "Already have an account? Log in",
    backToLogin: "← Back to log in",
    tagline: "Your micro applications portal",
    notifyReady: "We will notify you when everything is ready.",
    emailConfirmed: "Email Confirmed! Your account has been verified.",
    checkEmail: "Check your email to verify your account.",
    recoverySent: "Recovery link sent.",
    authLinkFailed: "Authentication link failed or expired.",
    loginError: "Invalid credentials."
  }
};

export function t(key: keyof typeof dict.es, lang: 'es' | 'en' = 'es') {
  return dict[lang][key] || dict['es'][key];
}
