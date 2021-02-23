import { ImageFile } from './image-file';

export class Image {
    id: number;
    name: string;
    totalArea: number;
    totalTissueArea: number;
    viableTissueArea: number;
    necroticTissueArea: number;
    imageFiles: ImageFile[];
    measurementUnit: string;
    scaleValue: number;
    scalePixles: number;
    measurementFactor: number;
}