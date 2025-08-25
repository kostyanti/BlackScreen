export interface SkipKey {
    name: string;
    start: string;
    end: string;
    active: boolean;
}

export const defaultSkipKey: SkipKey = {
    name: 'New key',
    start: '00:00',
    end: '00:00',
    active: true,
}