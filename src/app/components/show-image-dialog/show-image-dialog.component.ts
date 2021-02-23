import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SecurePipe } from '../../services/http/secure-pipe';
import { ImageService } from 'src/app/services/image-service/image.service';
import { ImageFile } from 'src/app/model/image-file';
import { Image } from 'src/app/model/image';
import { ImageFileProcessingParameter } from 'src/app/model/image-file-processing-parameter';

export interface DialogData {
  imageFile: ImageFile;
  image: Image;
}

@Component({
  selector: 'app-show-image-dialog',
  templateUrl: './show-image-dialog.component.html',
  styleUrls: ['./show-image-dialog.component.css']
})
export class ShowImageDialogComponent implements OnInit {

  imageLoading: boolean = false;
  imageURL: string;

  processingPreviewMode: boolean = false;
  processingParameter_minH: number;
  processingParameter_minS: number;
  processingParameter_minV: number;
  processingParameter_maxH: number;
  processingParameter_maxS: number;
  processingParameter_maxV: number;

  constructor(public dialogRef: MatDialogRef<ShowImageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private imageService: ImageService) { }

  ngOnInit(): void {
    this.setSourceImageURL();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onProcessingParametersChange() {    
    this.localVariablesToImageFileProcessingParameters();

    this.imageService.updateImageFile(this.data.imageFile).subscribe( imageFile => {
      if( imageFile ) {
        this.data.imageFile = imageFile;
        this.imageFileProcessingParametersToLocalVariables();
        this.setImageURL(this.imageService.getImagePreviewURL(this.data.imageFile));
      }
    })
  }

  onBeginProcessingPreviewMode() {
    this.processingPreviewMode = true;

    this.imageService.findAllDefaultProcessingParameters().subscribe( defaultParameters => {
      if (defaultParameters)
        this.mergeDefaultAndCustomProcessingParameters(defaultParameters);

      this.imageFileProcessingParametersToLocalVariables();

      this.onProcessingParametersChange();
    });   
    
  }

  onEndProcessingPreviewMode() {
    this.processingPreviewMode = false;
    this.setSourceImageURL();
  }

  getImageName() {
    return  { imageName:  this.data.imageFile ? 
                          this.data.imageFile.name : 
                          this.data.image.name };
  }

  setSourceImageURL() {
    this.setImageURL( this.data.imageFile ? 
      this.imageService.getImageFileURL(this.data.imageFile) :
      this.imageService.getImageURL(this.data.image)  );
  }

  setImageURL(url: string) {
    this.imageLoading = true;
    this.imageURL = url;
  }

  onImageLoad() {
    this.imageLoading = false;
  }

  getImageURL(): string {
    return this.imageURL;
  }

  isImageLoading(): boolean {
    return this.imageLoading;
  }

  localVariablesToImageFileProcessingParameters() {
    var viableTissueAreaMinHSVInRange = JSON.stringify( { val: [this.processingParameter_minH,this.processingParameter_minS,this.processingParameter_minV,0.0] } );
    this.setProcessingParameterValue("ViableTissueAreaMinHSVInRange",viableTissueAreaMinHSVInRange);

    var viableTissueAreaMaxHSVInRange = JSON.stringify( { val: [this.processingParameter_maxH,this.processingParameter_maxS,this.processingParameter_maxV,0.0] } );
    this.setProcessingParameterValue("ViableTissueAreaMaxHSVInRange",viableTissueAreaMaxHSVInRange);
    
  }

  imageFileProcessingParametersToLocalVariables() {
    var viableTissueAreaMinHSVInRange = JSON.parse(this.getProcessingParameterValue("ViableTissueAreaMinHSVInRange")).val;
    this.processingParameter_minH = viableTissueAreaMinHSVInRange[0];
    this.processingParameter_minS = viableTissueAreaMinHSVInRange[1];
    this.processingParameter_minV = viableTissueAreaMinHSVInRange[2];
    
    var viableTissueAreaMaxHSVInRange = JSON.parse(this.getProcessingParameterValue("ViableTissueAreaMaxHSVInRange")).val;
    this.processingParameter_maxH = viableTissueAreaMaxHSVInRange[0];
    this.processingParameter_maxS = viableTissueAreaMaxHSVInRange[1];
    this.processingParameter_maxV = viableTissueAreaMaxHSVInRange[2];
  }

  mergeDefaultAndCustomProcessingParameters(defaultProcessingParameters) {
    if( !this.getProcessingParameter("ViableTissueAreaMinHSVInRange") &&
        defaultProcessingParameters.ViableTissueAreaMinHSVInRange )
        this.setProcessingParameterValue("ViableTissueAreaMinHSVInRange",defaultProcessingParameters.ViableTissueAreaMinHSVInRange);

    if( !this.getProcessingParameter("ViableTissueAreaMaxHSVInRange") &&
        defaultProcessingParameters.ViableTissueAreaMaxHSVInRange )
        this.setProcessingParameterValue("ViableTissueAreaMaxHSVInRange",defaultProcessingParameters.ViableTissueAreaMaxHSVInRange);
  }

   getProcessingParameterValue(name: string): string {
    var parameter = this.getProcessingParameter(name);
    return parameter ? parameter.value : null;
  }

  setProcessingParameterValue(name: string, value: string) {
    var parameter = this.getProcessingParameter(name);
    if(parameter) parameter.value = value;
    else          this.data.imageFile.customProcessingParameters.push({id:null, name: name, value: value});
  }

  getProcessingParameter(name: string): ImageFileProcessingParameter {
    return this.data.imageFile.customProcessingParameters.find( f => f.name==name );
  }

  isProcessinPreviewMode(): boolean {
    return this.processingPreviewMode==true;
  }


}
