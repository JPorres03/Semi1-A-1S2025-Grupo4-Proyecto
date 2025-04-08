### 1. Autenticación (Cognito)
| Método | Endpoint           | Descripción                              | Body Requerido                     |
|--------|--------------------|------------------------------------------|------------------------------------|
| POST   | `/auth/register`   | Registra un nuevo usuario                | `{email, password, username}`     |
| POST   | `/auth/login`      | Inicia sesión y obtiene tokens           | `{username, password}`            |
| POST   | `/auth/refresh`    | Renueva el token de acceso               | `{refreshToken}`                  |
| POST   | `/auth/logout`     | Cierra la sesión                         | `{accessToken}`                   |

### 2. Procesamiento de Contenido
| Método | Endpoint               | Descripción                              | Body Requerido                                     |
|--------|------------------------|------------------------------------------|---------------------------------------------------|
| POST   | `/process/image`       | Procesa imágenes (texto → traducción)    | `{imageUrl, targetLanguage, [voiceId]}`          |
| POST   | `/process/audio`       | Procesa audio (voz → texto → traducción) | `{audioUrl, sourceLanguage, targetLanguage}`     |
| POST   | `/process/combined`    | Procesa imagen+audio en un solo request  | `{imageUrl?, audioUrl?, targetLanguage, sourceLanguage?}` |

### 3. Gestión de Audio (Polly)
| Método | Endpoint               | Descripción                              | Body Requerido                     |
|--------|------------------------|------------------------------------------|------------------------------------|
| POST   | `/audio/generate`      | Convierte texto a voz                    | `{text, voiceId, languageCode}`    |
| GET    | `/audio/voices`        | Lista voces disponibles en Polly         | -                                  |

### 4. Historial y Datos (RDS)
| Método | Endpoint               | Descripción                              | Parámetros                         |
|--------|------------------------|------------------------------------------|------------------------------------|
| GET    | `/history`             | Obtiene el historial del usuario         | `?limit=10&offset=0`              |
| GET    | `/history/{id}`        | Obtiene un item específico               | -                                  |
| DELETE | `/history/{id}`        | Elimina un item del historial            | -                                  |
| GET    | `/history/stats`       | Obtiene estadísticas de uso              | `?timeRange=last30days`           |

### 5. Configuración de Usuario
| Método | Endpoint               | Descripción                              | Body Requerido                     |
|--------|------------------------|------------------------------------------|------------------------------------|
| GET    | `/user/profile`        | Obtiene perfil del usuario               | -                                  |
| PUT    | `/user/profile`        | Actualiza perfil                         | `{preferredLanguage, defaultVoice}`|
| GET    | `/user/settings`       | Obtiene configuraciones                  | -                                  |
| PUT    | `/user/settings`       | Actualiza configuraciones                | `{autoPlayAudio, darkMode, etc.}` |

### 6. Gestión de Archivos (S3)
| Método | Endpoint               | Descripción                              | Body Requerido                     |
|--------|------------------------|------------------------------------------|------------------------------------|
| POST   | `/upload/sign`         | Genera URL firmada para subida           | `{fileType, fileName}`            |
| GET    | `/download/{fileKey}`  | Genera URL temporal para descarga        | -                                  |
