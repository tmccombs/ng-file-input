import {Component, Directive, Input, Output, EventEmitter, ViewChild,
        HostListener, HostBinding, ElementRef} from 'angular2/core';

@Component({
    selector: 'file-input, file-select',
    template: `<form #form>
      <input type="file" title=" " [accept]="acceptStr" [attr.multiple]="multiple" [attr.disabled]="disabled" />
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
    }
    `]
})
export class FileInput {

    /**
     * An array of extensions to allow in the file picker. (For example: [".jpg", ".png"])
     */
    @Input() set accept(a: string | string[]) {
        if (typeof a == 'string') {
            this._accept = <string>a;
        } else {
            this._accept = (<string[]>a).join(',');
        }
    };
    get accept() {
        return this._accept;
    }

    @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();

    @HostListener('change', ['$event.target']) onChange(input: HTMLInputElement) {
        let files = input.files;
        if (files.length > 0) {
            this.fileUpload.emit(Array.from(files));
            this.reset();
        }

    }

    @Input() multiple: boolean = false;
    @Input() disabled: boolean = false;

    reset() {
        this._form.nativeElement.reset();
    }

    private _accept: string = '';

    @ViewChild('form')
    private _form: ElementRef;
}

@Directive({
    selector: "[fileDrop]"
})
export class FileDropZone {
    @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();
    @Output() fileDragOver: EventEmitter<DragEvent> = new EventEmitter();
    @Output() fileDragLeave: EventEmitter<DragEvent> = new EventEmitter();

    //TODO: add support for accept

    @HostListener('drop', ['$event.dataTransfer']) onDrop(transfer: DataTransfer) {
        if (transfer.files.length > 0) {
            this.fileUpload.emit(Array.from(transfer.files));
            this._dragging = false;
        }
    }

    @HostListener('dragover', ['$event']) onEnter(event: DragEvent) {
        if (event.dataTransfer.files.length > 0) {
            this._dragging = true;
            this.fileDragOver.emit(event);
        }
    }

    @HostListener('dragleave', ['$event']) onLeave(event: DragEvent) {
        if (this._dragging) {
            this._dragging = false;
            this.fileDragLeave.emit(event);
        }
    }

    @HostBinding('class.file-dragging')
    get draggingFile() {
        return this._dragging;
    }

    private _dragging: boolean = false;
}
