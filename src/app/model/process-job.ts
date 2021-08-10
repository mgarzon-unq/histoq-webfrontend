export class ProcessJob {
    id: number;
    begin: Date;
    end: Date;
    goal: string;
    finished: boolean;
    withErrors: boolean;
    errorsDescription: string;
    subProcesses: ProcessJob[];
}