import { CharacterInformation } from "../interfaces/unit-information";

export const CHARACTERS: Array<CharacterInformation> = [
    {
        name: "Eirika", baseMaxHP: 10, baseMaxFP: 6, animation:
        {
            imageURL: "eirika-body.png",
            shadowImageURL: "eirika-shadow.png",
            sheetWidth: 8,
            sheetHeight: 8,
            animations: [{
                name: "Idle", repeat: true, randomize: .01, frameDurations: [
                    { duration: 12, frame: { x: 0, y: 0 } },
                    { duration: .1, frame: { x: 1, y: 0 } },
                    { duration: .3, frame: { x: 2, y: 0 } },
                    { duration: .6, frame: { x: 3, y: 0 } },
                    { duration: .2, frame: { x: 1, y: 0 } }
                ]
            }, {
                name: "Attack", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .04, frame: { x: 1, y: 0 } },
                    { duration: .04, frame: { x: 0, y: 1 } },
                    { duration: .08, frame: { x: 1, y: 1 } },
                    { duration: .1, frame: { x: 2, y: 1 } },
                    { duration: .04, frame: { x: 3, y: 1 } },
                    { duration: .04, frame: { x: 4, y: 1 } },
                    { duration: .04, frame: { x: 5, y: 1 } }
                ]
            }, {
                name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .02, frame: { x: 0, y: 2 } },
                    { duration: .04, frame: { x: 1, y: 2 } },
                    { duration: .04, frame: { x: 2, y: 2 } },
                    { duration: .08, frame: { x: 3, y: 2 } },
                    { duration: .08, frame: { x: 4, y: 2 } },
                    { duration: .01, frame: { x: 2, y: 3 } },
                    { duration: .02, frame: { x: 1, y: 3 } },
                    { duration: .04, frame: { x: 3, y: 0 } },
                    { duration: .04, frame: { x: 1, y: 0 } }
                ]
            }]
        }
    }, {
        name: "Archer", baseMaxHP: 8, baseMaxFP: 8, animation:
        {
            imageURL: "archer-body.png",
            shadowImageURL: "archer-shadow.png",
            sheetWidth: 8,
            sheetHeight: 8,
            animations: [{
                name: "Idle", repeat: true, randomize: .01, frameDurations: [
                    { duration: 10, frame: { x: 0, y: 0 } },
                    { duration: .2, frame: { x: 1, y: 0 } },
                    { duration: .2, frame: { x: 2, y: 0 } },
                    { duration: .2, frame: { x: 1, y: 0 } },
                    { duration: .4, frame: { x: 3, y: 0 } },
                    { duration: .1, frame: { x: 4, y: 0 } },
                    { duration: .1, frame: { x: 5, y: 0 } },
                    { duration: .1, frame: { x: 6, y: 0 } },
                    { duration: .1, frame: { x: 7, y: 0 } },
                    { duration: .1, frame: { x: 5, y: 0 } },
                    { duration: .1, frame: { x: 6, y: 0 } },
                    { duration: .1, frame: { x: 7, y: 0 } },
                    { duration: .1, frame: { x: 5, y: 0 } },
                    { duration: .1, frame: { x: 6, y: 0 } },
                    { duration: .1, frame: { x: 7, y: 0 } },
                    { duration: .2, frame: { x: 4, y: 0 } },
                    { duration: .4, frame: { x: 3, y: 0 } }
                ]
            }, {
                name: "Attack", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .01, frame: { x: 3, y: 1 } },
                    { duration: .01, frame: { x: 4, y: 1 } },
                    { duration: .01, frame: { x: 5, y: 1 } },
                    { duration: .01, frame: { x: 6, y: 1 } },
                    { duration: .01, frame: { x: 7, y: 1 } },
                    { duration: .08, frame: { x: 0, y: 2 } },
                    { duration: .02, frame: { x: 1, y: 2 } },
                    { duration: .4, frame: { x: 2, y: 2 } },
                    { duration: .04, frame: { x: 3, y: 2 } }
                ]
            }, {
                name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .04, frame: { x: 4, y: 2 } },
                    { duration: .3, frame: { x: 5, y: 2 } },
                    { duration: .04, frame: { x: 1, y: 0 } },
                ]
            }]
        }
    }, {
        name: "Wizard", baseMaxHP: 5, baseMaxFP: 13, animation:
        {
            imageURL: "wizard-body.png",
            shadowImageURL: "wizard-shadow.png",
            sheetWidth: 8,
            sheetHeight: 8,
            horizontalDisplacement: -35,
            animations: [{
                name: "Idle", repeat: true, randomize: .01, frameDurations: [
                    { duration: 4, frame: { x: 2, y: 0 } },
                    { duration: .1, frame: { x: 3, y: 0 } },
                    { duration: .2, frame: { x: 5, y: 0 } },
                    { duration: .3, frame: { x: 4, y: 0 } },
                    { duration: .2, frame: { x: 5, y: 0 } },
                    { duration: .2, frame: { x: 0, y: 0 } },
                    { duration: .1, frame: { x: 3, y: 0 } }
                ]
            }, {
                name: "Attack", repeat: false, returnTo: "Idle", restartAt: .11, frameDurations: [
                    { duration: .005, frame: { x: 0, y: 0 } },
                    { duration: .005, frame: { x: 1, y: 0 } },
                    { duration: .01, frame: { x: 0, y: 1 } },
                    { duration: .005, frame: { x: 1, y: 1 } },
                    { duration: .005, frame: { x: 3, y: 1 } },
                    { duration: .005, frame: { x: 4, y: 1 } },
                    { duration: .005, frame: { x: 5, y: 1 } },
                    { duration: .015, frame: { x: 6, y: 1 } },
                    { duration: .08, frame: { x: 7, y: 1 } },
                    { duration: .1, frame: { x: 4, y: 2 } },
                    { duration: .09, frame: { x: 5, y: 2 } },
                    { duration: .03, frame: { x: 6, y: 2 } },
                    { duration: .015, frame: { x: 7, y: 2 } },
                    { duration: .015, frame: { x: 0, y: 3 } },
                    { duration: .015, frame: { x: 1, y: 3 } },
                    { duration: .015, frame: { x: 2, y: 3 } },
                    { duration: .015, frame: { x: 2, y: 0 } },
                    { duration: .015, frame: { x: 3, y: 0 } },
                    { duration: .015, frame: { x: 4, y: 0 } },
                    { duration: .015, frame: { x: 5, y: 0 } },
                ]
            }, {
                name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .08, frame: { x: 3, y: 3 } },
                    { duration: .1, frame: { x: 4, y: 3 } },
                    { duration: .24, frame: { x: 5, y: 3 } },
                    { duration: .08, frame: { x: 4, y: 3 } },
                ]
            }]
        }
    }
]