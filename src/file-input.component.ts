import {Attribute, Component, ElementRef, EventEmitter, HostListener, Input,
        Output, OnInit, Renderer, ViewChild} from '@angular/core'

import {AcceptFileFilter, FileFilter, NullFileFilter} from './file-filter'

@Component({
    selector: 'file-input, file-select',
    template: `
<ng-content></ng-content>
<form #form>
<input type="file" title=" " [accept]="acceptStr" [attr.multiple]="multiple || null" [attr.disabled]="disabled || null" />
</form>`,
    styles: [`
:host {
  display: block;
  position: relative;
}
input {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
} `]
})
export class FileInputComponent implements OnInit {

  constructor(
    private renderer: Renderer,
    @Attribute('accept') accept?: string
  ) {
    this.accept = accept || '';
  }

  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;

  @Input("fileFilter") filter: FileFilter;

  @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();

  @HostListener('change', ['$event.target']) onChange(input: HTMLInputElement) {
    let files = this.filter.filterFiles(Array.from(input.files));
    if (files.length > 0) {
      this.fileUpload.emit(files);
      this.reset();
    }
  }

  get acceptStr() {
    return this.filter.acceptString || this.accept;
  }

  ngOnInit() {
    if (!this.filter) {
      if (this.accept) {
        this.filter = new AcceptFileFilter(this.accept);
      } else {
        this.filter = new NullFileFilter();
      }
    }
  }

  reset() {
    this.renderer.invokeElementMethod(this.form.nativeElement, 'reset', []);
  }

  @ViewChild('form')
  private form: ElementRef;

  private accept: string;
}
