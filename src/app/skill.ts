export interface Skill {
    id?: number;
    icon: string;
    name: string;
    flavour: string;
    effect: () => void;
    description: () => string;
}