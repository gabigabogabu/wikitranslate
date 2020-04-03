import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    console.log(webkitURL);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
