
/**
 * An object that filters acceptable files from an array of files.
 */
export interface FileFilter {
    /**
     * Filter the files to acceptable files.
     * If acceptable(files) returns false this should return
     * an empty array.
     */
    filterFiles(files: File[]): File[];

    /**
     * A string suitable for use as the accept attribute
     * on a file input.
     */
    acceptString?: string;
}

/**
 * A file checker that accepts any file.
 */
export class NullFileFilter implements FileFilter {
    filterFiles(files: File[]): File[] {
        return files;
    }
}

export abstract class SimpleFileFilter implements FileFilter {
  filterFiles(files: File[]): File[] {
    return files.filter(this.checkFile, this);
  }

  abstract checkFile(file: File): boolean
}

/**
 * A file filter that filters files that match an array of file extensions.
 */
export class FileExtensionFilter extends SimpleFileFilter {
    constructor(validExtensions?: string[]) {
      super();
      this.extensions = validExtensions || [];
    }

  get acceptString(): string {
    return this.extensions.join(',');
  }

  extensions: string[];

  private extRE: RegExp = /\.([^.]+)$/;
  private checkExt(name: string): boolean {
    let m = this.extRE.exec(name);
    let ext = m && m[1];
    if (ext) {
      return this.extensions.some(e => ext == e);
    } else {
      return false;
    }
  }

  checkFile(f: File): boolean {
    return this.checkExt(f.name);
  }
}

export class MimeExtensionFilter extends SimpleFileFilter {
  constructor(mimeTypes: string[]) {
    super();
    this.mimeTypes = mimeTypes;
  }

  checkFile(f: File): boolean {
    return this.mimeTypes.some(mime => f.type == mime);
  }

  get acceptString(): string {
    return this.mimeTypes.join(',');
  }

  mimeTypes: string[];

}

export class AcceptFileFilter extends SimpleFileFilter {
  constructor(acceptStr: string) {
    super();
    this.acceptString = acceptStr;
  }

  get acceptString(): string {
    return this._acceptStr;
  }
  set acceptString(str: string) {
    let parts = str.split(',');
    let mimes: string[] = [];
    let exts: string[] = [];
    for(let part of parts) {
      if (part[0] == '.') {
        exts.push(part);
      } else {
        mimes.push(part);
      }
    }
    this.mime = new MimeExtensionFilter(mimes);
    this.ext = new FileExtensionFilter(exts);
  }

  checkFile(f: File): boolean {
    return this.mime.checkFile(f) || this.ext.checkFile(f);
  }

  private _acceptStr: string;
  private mime: MimeExtensionFilter;
  private ext: FileExtensionFilter;
}
