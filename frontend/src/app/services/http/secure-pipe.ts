import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

    static forRoot() {
        return {
            ngModule: SecurePipe,
            providers: [],
        };
     }

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    transform(url): Observable<SafeUrl> {
        return this.http
            .get(url, { responseType: 'blob' })
            .pipe(map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
    }
    
}