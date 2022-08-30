export interface SoundInformation {
    audioFilename: string,
    playbackRateMin: number,
    playbackRateMax: number,
    volume: number,
    concurrentMaximum: number;
    replacePrevious: boolean,
    timeSinceLast?: number
}