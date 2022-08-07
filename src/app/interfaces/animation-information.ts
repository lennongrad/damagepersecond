export interface AnimationDetails{
    imageURL: string,
    sheetWidth: number,
    sheetHeight: number,
    animations: Array<AnimationInformation>
}

export interface AnimationInformation { 
    name: string, 
    repeat: boolean,
    returnTo?: string,
    randomize?: number,
    frameDurations: Array<{duration: number, frame: {x: number, y: number}}>; 
};