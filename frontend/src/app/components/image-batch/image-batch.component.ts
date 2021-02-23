import { Component, OnInit, Inject } from '@angular/core';
import { ImageService } from 'src/app/services/image-service/image.service';
import { ProtocolService } from 'src/app/services/protocol-service/protocol.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Protocol } from 'src/app/model/protocol';
import { ExperimentalGroup } from 'src/app/model/experimental-group';
import { Individual } from 'src/app/model/individual';
import { MatSelectChange } from '@angular/material/select';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { formatDate } from '@angular/common';
import { ImageBatch } from 'src/app/model/image-batch';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface DialogData {
  imageBatch: ImageBatch;
}

@Component({
  selector: 'app-image-batch',
  templateUrl: './image-batch.component.html',
  styleUrls: ['./image-batch.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class ImageBatchComponent implements OnInit {
  
  protocols: Protocol[];  
  experimentalGroups: ExperimentalGroup[];
  individuals: Individual[];
  selectedProtocol: Protocol;
  selectedExperimentalGroup: ExperimentalGroup;
  selectedIndividual: Individual;
  protocolSearchKey: string;

  constructor(  private protocolService: ProtocolService,
                private imageService: ImageService,
                private translate: TranslateService,
                @Inject(MAT_DIALOG_DATA) public data: DialogData ) { }

  ngOnInit(): void {
      this.loadImageBatchData();
  }

  loadImageBatchData() {
    if( this.isNewImageBatch() ) {
      this.getImageBatch().applyStitching = false;
    }
    else {
      this.imageBatchToControls();
    }  
  }

  searchProtocols(searchKey: string) {
    if( searchKey && searchKey.length ) {
      this.protocolService.findAllProtocolsContaining(searchKey).subscribe( protocols => {
        this.protocols = protocols;
      });
    }
    else
      this.protocols = null;
  }

  imageBatchToControls() {
    let imageBatch = this.getImageBatch();
    this.protocols = [{id: 1, label: imageBatch.protocolLabel, title: imageBatch.protocolTitle, date:null, experimentalGroups:null}];
    this.selectedProtocol = this.protocols[0];
    this.experimentalGroups = [{id:1, label: imageBatch.experimentalGroupLabel, individuals:null}];
    this.selectedExperimentalGroup = this.experimentalGroups[0];
    this.individuals = [{id: imageBatch.individualId, label: imageBatch.individualLabel}];
    this.selectedIndividual = this.individuals[0];
  }

  getImageBatch(): ImageBatch {
    return this.data.imageBatch;
  }

  getImageBatchTitle(): string {
    var title;
    if( this.data.imageBatch.id )
      title = this.translate.instant( "ImageBatch.ExistingBatchTitleFormat",
                          {id: this.getImageBatch().id,
                           date: formatDate(this.getImageBatch().date,"dd/MM/yyyy HH:mm","en-US")});
    else
      title = this.translate.instant("ImageBatch.NewBatchTitle");
    return title;
  }

  formatProtocolSelect(protocolo: Protocol) {
    return protocolo ? protocolo.label.toUpperCase() + ' - ' + protocolo.title : null;
  }

  formatExperimentalGroupSelect(group: ExperimentalGroup): String {
    return this.translate.instant("ImageBatch.ExperimentalGroupFormat",
                                  {label: group.label.toUpperCase()});
  }

  formatIndividualSelect(individual: Individual): String {
    return this.translate.instant("ImageBatch.IndividualFormat",
                                  {label: individual.label.toUpperCase()});
  }

  onProtocolSelect(selectedProtocol: Protocol) {    
    this.resetSelections();
    this.experimentalGroups = selectedProtocol.experimentalGroups;    
  }
  
  onProtocolSearchTextChanged() {
    this.resetSelections();
    this.searchProtocols(this.protocolSearchKey);
  }

  onClearProtocolSearchKey() {
    this.protocolSearchKey = null;
    this.resetSelections();
  }

  resetSelections() {
    this.selectedProtocol = null;
    this.experimentalGroups = null;
    this.selectedExperimentalGroup = null;
    this.selectedIndividual = null;
    this.individuals = null;
  }

  onExperimentalGroupSelect(event: MatSelectChange) {
    this.selectedIndividual = null;
    this.individuals = this.experimentalGroups.find(g=>g.id==event.value.id).individuals;
  }

  onIndividualSelect(event: MatSelectChange) {
    this.selectedIndividual = event.value;
    this.getImageBatch().individualId = this.individuals.find(i=>i.id==event.value.id).id;
  }

  onCreateImageBatch() {    
    this.imageService.createImageBatch(this.getImageBatch()).subscribe( imageBatch => {
      this.data.imageBatch = imageBatch;
      this.imageBatchToControls();
    })
  }

  isNewImageBatch(): boolean {
    return (this.data.imageBatch.id==null);
  }

  isExistingImageBatch(): boolean {
    return !this.isNewImageBatch();
  }

}
