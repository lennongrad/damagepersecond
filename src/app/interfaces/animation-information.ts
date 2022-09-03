export interface AnimationDetails{
    imageURL: string,
    portraitOffsetX?: number,
    portraitOffsetY?: number,
    shadowImageURL?: string,
    horizontalDisplacement?: number,
    sheetWidth: number,
    sheetHeight: number,
    animations: Array<AnimationInformation>
}

export interface AnimationInformation { 
    name: string, 
    repeat: boolean,
    returnTo?: string,
    randomize?: number,
    restartAt?: number,
    frameDurations: Array<{duration: number, frame: {x: number, y: number}}>; 
};