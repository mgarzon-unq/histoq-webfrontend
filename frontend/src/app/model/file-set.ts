
export class FileSet extends Set<File> {
    add(file: File): this {
        let found = false;
        this.forEach(item => {
            if (file.name==item.name) {
                found = true;
            }
        });

        if (!found) {
            super.add(file);
        }

        return this;
    }

    addFiles(files: File[]): this {
        files.forEach(file => this.add(file));
        return this;
    }

    getAt(index: number): File {
        return Array.from(this)[index];
    }
}