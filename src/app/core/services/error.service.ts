import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ErrorResponse } from '../../models/interfaces/error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private router: Router) {}

  handleError = (error: HttpErrorResponse): Observable<never> => {
    // Si ya es un string, significa que ya fue procesado
    if (typeof error === 'string') {
      return throwError(() => error);
    }

    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Error de cliente (problemas de red)
      errorMessage = 'Error de conexión: ' + error.error.message;
      console.error('Error de cliente:', error.error.message);
    } else {
      // Error de servidor
      try {
        // Intentar obtener el mensaje del error response
        if (error.error && typeof error.error === 'object') {
          const errorResponse = error.error as ErrorResponse;
          errorMessage = errorResponse.message;
        } else {
          errorMessage = error.error;
        }

        // Si el mensaje está vacío, usar un mensaje por defecto
        if (!errorMessage) {
          errorMessage = 'Ha ocurrido un error inesperado';
        }

        // Manejar casos específicos por status
        switch (error.status) {
          case 401:
            if (!errorMessage || errorMessage === 'null') {
              errorMessage = 'No autorizado';
            }
            break;
          case 403:
            errorMessage = errorMessage || 'Acceso denegado';
            break;
          case 404:
            errorMessage = errorMessage || 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = errorMessage || 'Error interno del servidor';
            break;
        }

      } catch (e) {
        console.error('Error al procesar la respuesta de error:', e);
        errorMessage = 'Ha ocurrido un error inesperado';
      }
    }

    // Log para debugging
    console.error('Error original:', error);
    console.error('Mensaje final:', errorMessage);

     // Solo log del error original y mensaje final
     console.error('Error completo:', {
      status: error.status,
      statusText: error.statusText,
      message: errorMessage,
      error: error.error
    });

    return throwError(() => errorMessage);
  };

}
