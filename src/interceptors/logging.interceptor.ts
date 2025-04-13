import { Injectable, HttpException, ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
      }),
      catchError(async (error) => {
        const severity = error instanceof HttpException ? 'WARNING' : 'ERROR';
        let message: string = 'Erro desconhecido';

        if (error.response) {
          if (Array.isArray(error.response)) {
            message = error.response.join(' ');
          } else if (typeof error.response === 'object' && 'message' in error.response) {
            const errorMessage = error.response.message;
            message = Array.isArray(errorMessage) ? errorMessage.join(' ') : errorMessage;
          } else if (typeof error.response === 'string') {
            message = error.response;
          }
        } else if (typeof error.message === 'string') {
          message = error.message;
        }

        throw error;
      }),
    );
  }
}