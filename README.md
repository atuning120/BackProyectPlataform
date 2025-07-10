# BackProyectPlataform 

Backend RESTful para la gestión de pacientes, fichas clínicas y respuestas, con autenticación vía Firebase y JWT.  
Incluye soporte para despliegue con **Docker**.

---
## ⚙️ Ejemplo de `.env`

- `MONGO_URI`: URL de conexión a la base de datos MongoDB
- `PORT`: Puerto donde corre el servidor
- `EMAIL_USER`: Usuario/correo para el servicio de email
- `EMAIL_PASS`: Contraseña del servicio de email
- `JWT_SECRET`: Secreto para firmar los JWT74
  
---

## 🌐 Acceso

La API estará disponible en:  
`http://localhost:5000`

---

## 🛣️ Endpoints principales

### Pacientes

**Base URL:** `/api/patients`

| Método | Endpoint               | Descripción                            |
|--------|------------------------|----------------------------------------|
| GET    | `/`                    | Listar todos los pacientes             |
| GET    | `/:patientRun`         | Obtener paciente por RUN               |
| POST   | `/`                    | Crear paciente                         |
| DELETE | `/:id`                 | Eliminar paciente                      |


### Fichas Clínicas

**Base URL:** `/api/clinical-records`

| Método | Endpoint                       | Descripción                                   |
|--------|--------------------------------|-----------------------------------------------|
| GET    | `/`                            | Listar todas las fichas clínicas              |
| GET    | `/:clinicalRecordNumber`       | Obtener ficha clínica por número              |
| POST   | `/`                            | Crear ficha clínica                           |
| DELETE | `/:id`                         | Eliminar ficha clínica                        |


### Respuestas a Fichas Clínicas

**Base URL:** `/api/answered-clinical-records`

| Método | Endpoint           | Descripción                                         |
|--------|--------------------|-----------------------------------------------------|
| GET    | `/`                | Listar todas las respuestas                         |
| GET    | `/:email`          | Listar respuestas de un estudiante por email        |
| POST   | `/`                | Crear nueva respuesta                               |
| PUT    | `/:id`             | Agregar o actualizar retroalimentación              |
| DELETE | `/:id`             | Eliminar respuesta por ID                           |
| DELETE | `/`                | Eliminar respuestas masivamente (`body: { "ids": [...] }`) |


### Autenticación

**Base URL:** `/api/auth`

| Método | Endpoint     | Descripción                        |
|--------|--------------|------------------------------------|
| POST   | `/login`     | Autenticación con Firebase         |


---

> Todos los endpoints retornan datos en formato JSON.
