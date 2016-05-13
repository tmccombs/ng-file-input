import {Directive, EventEmitter, HostBinding, HostListener,
        Input, OnInit, Output} from '@angular/core';

import {FileValidator, NullFileValidator} from './file-validator';

@Directive({
  selector: '[fileDrop]'
})
export class FileDropZoneDirective implements OnInit {
  @Input("fileValidator") validator: FileValidator;

  @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();
  @Output() fileDragEnter: EventEmitter<DragEvent> = new EventEmitter();
  @Output() fileDragExit: EventEmitter<DragEvent> = new EventEmitter();

  @HostListener('drop', ['$event.dataTransfer']) onDrop(transfer: DataTransfer) {
    let files = this.validator.filterFiles(Array.from(transfer.files));
    if (files.length > 0) {
      this.fileUpload.emit(files);
      this.dragging = false;
    }
  }

  @HostListener('dragenter', ['$event']) onEnter(event: DragEvent) {
    if (this.acceptable(event.dataTransfer)) {
      this.dragging = true;
      this.fileDragEnter.emit(event);
    }
  }

  @HostListener('dragexit', ['$event']) onExit(event: DragEvent) {
    if (this.dragging) {
      this.dragging = false;
      this.fileDragExit.emit(event);
    }
  }

  @HostListener('dragover', ['$event']) onOver(event: DragEvent) {
    if (this.acceptable(event.dataTransfer)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostBinding('class.file-zone-dragging')
  get draggingFile() {
    return this.dragging;
  }

  ngOnInit() {
    if (!this.validator) {
      this.validator = new NullFileValidator();
    }
  }

  private acceptable(transfer: DataTransfer): boolean {
    return this.validator.validate(Array.from(transfer.files));
  }
  private dragging: boolean = false;
}
