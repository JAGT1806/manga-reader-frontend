# MangaReaderFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Manga-reader-Frontend

Con lo anterior es texto por default del Angular.
Este proyecto implementa el framework de Angular.

## Estructura del proyecto

A continuación se va a mostrar la estructura que se tiene dentro de los directorios:

```
manga-reader-frontend/
├── angular.json           // Configuración global de Angular, incluye la compilación y localización
├── package.json           // Definición de dependencias y scripts
├── tsconfig.json          // Configuración de TypeScript
├── README.md              // Documentación del proyecto
├── dist/                  // Carpeta generada al ejecutar `ng build --localize`
│   └── browser/           // Vistas generadas para cada idioma configurado en i18n
├── public/                // Archivos públicos (imágenes, archivos estáticos)
├── src/                   // Carpeta principal de código fuente
│   ├── app/               // Contenedor principal de la aplicación y sus subcomponentes
│   │   ├── components/    // Componentes reutilizables en diferentes partes de la app
│   │   ├── models/        // Interfaces, clases y enums utilizados en toda la aplicación
│   │   ├── pages/         // Componentes que representan vistas o páginas completas
│   │   ├── services/      // Servicios para la lógica y peticiones HTTP
│   │   ├── shared/        // Componentes y utilidades compartidos en varias partes de la app
│   │   ├── app.component.css    // Estilos del componente principal
│   │   ├── app.component.html   // Plantilla HTML del componente principal
│   │   ├── app.component.ts     // Lógica del componente principal
│   │   ├── app.config.ts        // Configuración principal de la aplicación y carga de componentes
│   │   └── app.route.ts         // Configuración de rutas de la aplicación
│   ├── assets/            // Elementos multimedia como imágenes, fuentes, etc.
│   ├── environments/      // Configuraciones de entorno (producción, desarrollo, etc.)
│   ├── locale/            // Archivos de localización (i18n) para cada idioma
│   ├── index.html         // Archivo HTML principal de la aplicación
│   ├── main.ts            // Punto de entrada de la aplicación donde se inicializa Angular
│   └── styles.css         // Estilos CSS globales

```

## Requisitos Previos

Para el uso adecuado o más optimo, usar estas versiones:
- Node.JS 10.8.2
- Angula 18.2.9

## Puertos del proyecto

Todos se van a basar en localhost, debido a la implementación de i18n, cada idioma se ejecutará en puertos diferentes, recuerda ejecutar primero `ng build --localize` para construir las otras vistas del i18n. Para arrancarlo se ingresa el comando `npm run serve:all`, lo cuál ejecutará el aplicativo por tres puertos, los cuales son:
- `4200`:  Este puerto es el por defecto, pero en este caso se ejecutará el idioma original o el idioma de "inglés".
- `4201`: Manejará el idioma de "español".
- `4202`: Manejará el idioma de "francés".

Todo esto fue configurado en el fichero `package.json`  ``
## Dependencias del proyecto

Para utilizar la versión más reciente (18.2.9), se ejecutó `npm install -g @angular/cli`, posteriormente se le añadió un paquete necesario para su ejecución, por lo cuál se ejecutará este comando: `ng add @angular/localize` para el i18n y se ejecutó `npm install --save-dev concurrently` para el tema de la ejecución de diversos serve de Angular.