import {Component, ElementRef, ViewChild} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {FileInputComponent, FileDropZoneDirective} from 'ng-file-input/components';

@Component({
  selector: 'my-app',
  directives: [FileInputComponent, FileDropZoneDirective],
  template: `
<img [src]="imageUrl" />
<p>Name: {{fileName}}</p>
<div class="boxes">
  <file-input class="file-box" (fileUpload)="onUpload($event)">Click to Upload</file-input>
  <div class="file-box" fileDrop (fileUpload)="onUpload($event)"
(dragexit)="onExit($event, 'native exit')" (dragleave)="onExit($event, 'native leave')"
(fileDragExit)="onExit($event, 'my exit')">
     Drag to Upload </div>
</div>
`
})
export class AppComponent {
  onUpload(files: File[]) {
    let file = files[0];
    this.fileName = file.name;
    this.imageUrl = URL.createObjectURL(file);
  }

  onExit(event: DragEvent, kind: string) {
    console.log('Drag ended');
    console.log(kind);
  }

  imageUrl: string = '';
  fileName: string = '';

}

bootstrap(AppComponent)
