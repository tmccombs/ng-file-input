import {Component, Directive, Input, Output, EventEmitter, ViewChild,
        HostListener, HostBinding, ElementRef, Injectable} from 'angular2/core';

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

    constructor(private extChecker: FileExtensionChecker) {}

    /**
     * An array of extensions to allow in the file picker. (For example: [".jpg", ".png"])
     */
    @Input() set accept(a: string[]) {
        this._accept = a;
        this._acceptStr = a.join(',');
    };
    get accept() {
        return this._accept;
    }
    get acceptStr() {
        return this._acceptStr;
    }

    @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();

    @HostListener('change', ['$event.target']) onChange(input: HTMLInputElement) {
        let files = this.extChecker.filterFiles(Array.from(input.files), this._accept);
        if (files.length > 0) {
            this.fileUpload.emit(files);
            this.reset();
        }

    }

    @Input() multiple: boolean = false;
    @Input() disabled: boolean = false;

    reset() {
        this._form.nativeElement.reset();
    }

    private _accept: string[] = [];
    private _acceptStr: string = '';

    @ViewChild('form')
    private _form: ElementRef;
}

@Directive({
    selector: "[fileDrop]"
})
export class FileDropZone {
    constructor(private extChecker: FileExtensionChecker) {}

    @Input() set accept(a: string[]) {
        this._accept = a;
    }
    @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();
    @Output() fileDragOver: EventEmitter<DragEvent> = new EventEmitter();
    @Output() fileDragLeave: EventEmitter<DragEvent> = new EventEmitter();

    @HostListener('drop', ['$event.dataTransfer']) onDrop(transfer: DataTransfer) {
        let files = this.transferFiles(transfer);
        if (files.length > 0) {
            this.fileUpload.emit(files);
            this._dragging = false;
        }
    }

    @HostListener('dragover', ['$event']) onEnter(event: DragEvent) {
        if (this.transferFiles(event.dataTransfer).length > 0) {
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

    private transferFiles(transfer: DataTransfer): File[] {
        return this.extChecker.filterFiles(Array.from(transfer.files), this._accept);
    }

    private _dragging: boolean = false;
    private _accept: string[] = [];
}

@Injectable()
export class FileExtensionChecker {

    private extRE: RegExp = /\.([^.]+)$/

    checkExtension(name: string, extensions: string[]): boolean {
        let m = this.extRE.exec(name);
        let ext = m && m[1];
        if (ext) {
            return extensions.some(e => ext == e);
        } else {
            return false;
        }
    }

    checkFileExtension(file: File, extensions: string[]): boolean {
        return this.checkExtension(file.name, extensions);
    }

    filterFiles(files: File[], extensions: string[]): File[] {
        return files.filter(file => this.checkFileExtension(file, extensions));
    }
}
