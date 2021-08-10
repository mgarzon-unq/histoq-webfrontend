import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProcessJob } from 'src/app/model/process-job';
import { ProcessJobService } from 'src/app/services/process-job-service/process-job-service';

export interface ProcessJobComponentData {
  processJob: ProcessJob;
}

@Component({
  selector: 'app-process-job-status',
  templateUrl: './process-job-status.component.html',
  styleUrls: ['./process-job-status.component.css']
})
export class ProcessJobStatusComponent implements OnInit {

    private intervalTimer = interval(1000);    
    processJobFinished$: Subject<boolean> = new Subject<boolean>();
    processJobSteps: ProcessJob[];


    constructor(public dialogRef: MatDialogRef<ProcessJobStatusComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ProcessJobComponentData,
                private processJobService: ProcessJobService) { }

    ngOnInit() {
      this.refreshProcessJobStatus();

      this.intervalTimer.pipe(takeUntil(this.processJobFinished$)).subscribe(() => {
        this.refreshProcessJobStatus();
      });
    }

    ngOnDestroy() {
      this.processJobFinished$.next(true);
      this.processJobFinished$.unsubscribe();
    }

    getProcessJobGoal(): string {
      return this.data.processJob.goal+"...";
    }

    refreshProcessJobStatus() {      
      this.processJobService.findProcessJobById(this.data.processJob.id).subscribe( processJob => {
        if( processJob != null ) {          
          if( processJob.finished ) {
            this.processJobFinished$.next(true);
            this.dialogRef.close(!processJob.withErrors);
          }
          else
            this.processJobSteps = processJob.subProcesses;
        }
        else
          this.processJobSteps = [];
      });
    }

    showStepStatus(step: ProcessJob) : string {
      return "■ " + step.goal + (step.finished ? (step.withErrors ? " " : " ") : "...");
    }

    stepStatusIcon(step: ProcessJob) : string {
      return (step.finished ? (step.withErrors ? "exit" : "check") : "");
    }

}
