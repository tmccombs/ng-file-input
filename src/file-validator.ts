import {Injectable} from '@angular/core';

export interface FileValidator {
    /**
     * Return true if the array of files is acceptable.
     */
    validate(files: File[]): boolean;

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
@Injectable()
export class NullFileValidator implements FileValidator {
    validate(files: File[]): boolean {
        return files.length > 0;
    }

    filterFiles(files: File[]): File[] {
        return files;
    }
}

@Injectable()
export class FileExtensionValidator implements FileValidator {
    constructor(validExtensions?: string[]) {
        this.extensions = validExtensions || [];
    }

    validate(files: File[]): boolean {
        return files.some(this.checkFile, this);
    }

    filterFiles(files: File[]): File[] {
        return files.filter(this.checkFile, this);
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
            return this._extensions.some(e => ext == e);
        } else {
            return false;
        }
    }

    private checkFile(f: File): boolean {
        return this.checkExt(f.name);
    }
}
