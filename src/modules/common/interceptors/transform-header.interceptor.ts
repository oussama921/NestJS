import { Observable } from 'rxjs';

@Injectable()
export class TransformHeadersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    // Get request headers, e.g.
    const userAgent = context.switchToHttp().getRequest().headers['user-agent'];
    const apiKey = context.switchToHttp().getRequest().headers['x-api-key'];

    // TODO: verif API KEY

    return call$;
  }
}
