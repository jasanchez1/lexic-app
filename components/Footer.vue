<template>
  <footer style="background-color: #f0f6fd; color: #1f2937; padding: 48px 16px; margin-top: auto; border-top: 1px solid #e5e7eb;">
    <div style="max-width: 1280px; margin: 0 auto;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Lexic</h3>
          <p style="color: #6b7280; line-height: 1.6;">
            Democratizando el acceso a la asesoría legal de calidad a través de nuestra plataforma digital segura y transparente.
          </p>
        </div>
        
        <div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Enlaces Rápidos</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><NuxtLink to="/lawyers" style="color: #6b7280; text-decoration: none;">Buscar Abogados</NuxtLink></li>
            <li style="margin-bottom: 8px;"><NuxtLink to="/questions/ask" style="color: #6b7280; text-decoration: none;">Hacer una Pregunta</NuxtLink></li>
            <li style="margin-bottom: 8px;"><NuxtLink to="/faq" style="color: #6b7280; text-decoration: none;">Preguntas Frecuentes</NuxtLink></li>
            <li style="margin-bottom: 8px;"><NuxtLink to="/about" style="color: #6b7280; text-decoration: none;">Acerca de Nosotros</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Legal</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><NuxtLink to="/legal/terms" style="color: #6b7280; text-decoration: none;">Términos y Condiciones</NuxtLink></li>
            <li style="margin-bottom: 8px;"><NuxtLink to="/legal/privacy" style="color: #6b7280; text-decoration: none;">Política de Privacidad</NuxtLink></li>
            <li style="margin-bottom: 8px;"><NuxtLink to="/legal/abuse-policy" style="color: #6b7280; text-decoration: none;">Políticas Anti-abuso</NuxtLink></li>
            <li style="margin-bottom: 8px;"><a href="/Consentimiento_Tratamiento_Datos.docx" download style="color: #6b7280; text-decoration: none;">Consentimiento de Datos</a></li>
          </ul>
        </div>
      </div>
      
      <div style="border-top: 1px solid #d1d5db; margin-top: 32px; padding-top: 32px; text-align: center;">
        <p style="color: #9ca3af; font-size: 14px;">© 2025 Lexic. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>