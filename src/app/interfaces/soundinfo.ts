export interface SoundInfo {
    audioFilename: string,
    playbackRateMin: number,
    playbackRateMax: number,
    volume: number,
    concurrentMaximum: number;
    replacePrevious: boolean;
}