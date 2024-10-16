## Requerimientos

Esta aplicación se ejecuta bajo Node 18.19.0

nvm use 18.19.0

## Configuración inicial

Modifica el archivo .env para que apunte a la ubicación de la base de datos.
Establece ENABLE_DB_SYNC=true
Ejecuta la aplicación. Esto creará la estructura de la base de datos.
Detén la aplicación.
Ejecuta npm run seed para sembrar los datos iniciales de la base de datos.
Establece ENABLE_DB_SYNC=false y guarda los cambios.
Termina.
