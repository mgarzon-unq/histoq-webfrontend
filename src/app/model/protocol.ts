import { ExperimentalGroup } from './experimental-group';

export class Protocol {
    id: number;    
    label: string;
    title: string;
    date: Date;
    experimentalGroups: ExperimentalGroup[];    
}
