import {Attribute, Component, ElementRef, EventEmitter, HostListener, Input,
        Output, OnInit, Renderer, ViewChild} from '@angular/core'

import {FileExtensionValidator, FileValidator, NullFileValidator} from './file-validator'

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

  @Input("fileValidator") validator: FileValidator;

  @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();

  @HostListener('change', ['$event.target']) onChange(input: HTMLInputElement) {
    let files = this.validator.filterFiles(Array.from(input.files));
    if (files.length > 0) {
      this.fileUpload.emit(files);
      this.reset();
    }
  }

  get acceptStr() {
    return this.validator.acceptString || this.accept;
  }

  ngOnInit() {
    if (!this.validator) {
      if (this.accept) {
        this.validator = new FileExtensionValidator(this.accept.split(','));
      } else {
        this.validator = new NullFileValidator();
      }
    }
  }

  reset() {
    this.renderer.invokeElementMethod(this.form, 'reset', []);
  }

  @ViewChild('form')
  private form: ElementRef;

  private accept: string;
}
