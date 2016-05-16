import {Directive, EventEmitter, HostBinding, HostListener,
        Input, OnInit, Output} from '@angular/core';

import {FileFilter, NullFileFilter} from './file-filter';

function defaultCanDrop(event: DragEvent): boolean {
  return Array.prototype.some.call(event.dataTransfer.items, function(item: DataTransferItem) {
    return item.kind == 'file';
  });
}

@Directive({
  selector: '[fileDrop]'
})
export class FileDropZoneDirective implements OnInit {
  @Input("fileFilter") filter: FileFilter;
  @Input() canDrop: (event:DragEvent) => boolean;

  @Output() fileUpload: EventEmitter<File[]> = new EventEmitter();
  @Output() fileDragEnter: EventEmitter<DragEvent> = new EventEmitter();
  @Output() fileDragExit: EventEmitter<DragEvent> = new EventEmitter();

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    let files = this.filter.filterFiles(Array.from(event.dataTransfer.files));
    if (files.length > 0) {
      this.fileUpload.emit(files);
      this.dragging = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('dragenter', ['$event']) onEnter(event: DragEvent) {
    if (this.canDrop(event)) {
      this.dragging = true;
      this.fileDragEnter.emit(event);
    }
  }

  @HostListener('dragleave', ['$event']) onExit(event: DragEvent) {
    if (this.dragging) {
      this.dragging = false;
      this.fileDragExit.emit(event);
    }
  }

  @HostListener('dragover', ['$event']) onOver(event: DragEvent) {
    if (this.canDrop(event)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostBinding('class.file-zone-dragging')
  get draggingFile() {
    return this.dragging;
  }

  ngOnInit() {
    if (!this.filter) {
      this.filter = new NullFileFilter();
    }
    if (!this.canDrop) {
      this.canDrop = defaultCanDrop;
    }
  }

  private dragging: boolean = false;
}
