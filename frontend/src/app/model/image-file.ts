import { ImageFileProcessingParameter } from './image-file-processing-parameter';

export class ImageFile {
    id: number;
    name: string;
    stitched: boolean;
    customProcessingParameters: ImageFileProcessingParameter[];
}