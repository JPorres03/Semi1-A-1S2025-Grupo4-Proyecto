# **Manual de Usuario: LinguaVision**  

## **1. Objetivos del Manual**  
Este documento tiene como objetivo:  
- Explicar las funcionalidades de **LinguaVision**.  
- Guiar a los usuarios paso a paso en el uso de la plataforma.  
- Proporcionar capturas de pantalla para facilitar la navegación.  

---

## **2. Breve Descripción de la Aplicación**  
**LinguaVision** es una plataforma que permite:  
- **Traducir texto en imágenes** (carteles, menús, documentos) a múltiples idiomas.  
- **Convertir texto a voz** en el idioma deseado.  
- **Procesar archivos de audio** (grabaciones) para transcribirlos y traducirlos.  

**Público objetivo**:  
- Turistas, empresas multilingües, profesionales que trabajan con contenido internacional.  

---

## **3. Pasos para Utilizar la Aplicación**  

### **Paso 1: Registro e Inicio de Sesión**  
1. Accede a la página web de LinguaVision.  
2. Haz clic en **"Registrarse"** si eres nuevo o **"Iniciar Sesión"** si ya tienes una cuenta.  
3. Completa el formulario con tu correo y contraseña (o usa Google/Facebook con Amazon Cognito).  

![Captura: Pantalla de registro](https://ejemplo.com/registro.png)  

---

### **Paso 2: Subir Imagen o Audio**  
1. En el dashboard, selecciona **"Subir Archivo"**.  
2. Elige entre:  
   - **Imagen** (JPEG, PNG) para extraer texto.  
   - **Audio** (MP3, WAV) para transcribir y traducir.  
3. Haz clic en **"Procesar"**.  

![Captura: Selección de archivo](https://ejemplo.com/subir-archivo.png)  

---

### **Paso 3: Seleccionar Idioma de Destino**  
1. Elige el idioma al que deseas traducir el texto (ej: español → inglés).  
2. Opcional: Activa la opción **"Convertir a Voz"** si quieres un archivo de audio.  
3. Confirma con **"Traducir"**.  

![Captura: Selección de idioma](https://ejemplo.com/idioma.png)  

---

### **Paso 4: Ver y Descargar Resultados**  
1. En la sección **"Mis Traducciones"**, encontrarás:  
   - **Texto extraído** y su traducción.  
   - **Archivo de audio** (si se solicitó).  
2. Descarga los resultados en formato **TXT** o **MP3**.  

![Captura: Resultados](https://ejemplo.com/resultados.png)  

---

### **Funciones Adicionales**  
- **Historial**: Revisa traducciones anteriores en tu perfil.  
- **Personalización**: Ajusta la velocidad/tono de las voces de Polly.  
- **Seguridad**: Borra archivos manualmente desde S3.  

---

## **4. Soporte Técnico**  
Si encuentras problemas:  
- Contacta al equipo en: **soporte@linguavision.com**.  
- Consulta el **Manual Técnico** para detalles de integración con AWS.  

**¡Gracias por usar LinguaVision!** 🌍🔊  

--- 

**Nota**: Las capturas de pantalla son ilustrativas. En la implementación real, se incluirán imágenes reales de la interfaz.