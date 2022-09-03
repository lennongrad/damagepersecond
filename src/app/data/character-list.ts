import { CharacterFeature, CharacterInformation } from "../interfaces/unit-information";
import { SKILLS } from "./skill-list";
import { TRAITS } from "./trait-list";


export const CHARACTERS: { [id: string]: CharacterInformation } = {
    "eirika": {
        id: "eirika", name: "Eirika", baseMaxHP: 10, baseMaxFP: 10,
        defaultSkills: [SKILLS["strike"]],
        characterFeatures: [
            { expCost: 40, skillUnlocked: SKILLS["slash"] },
            { expCost: 60, skillUnlocked: SKILLS["slice"]},
            { expCost: 120, skillUnlocked: SKILLS["heavySwing"] },
            { expCost: 180, skillUnlocked: SKILLS["cleave"] },
            { expCost: 230, skillUnlocked: SKILLS["enflameBlade"] },
            { expCost: 500, skillUnlocked: SKILLS["bladeFlourish"] },
            { expCost: 1100, skillUnlocked: SKILLS["bladesong"] },
        ],
        animation: {
            portraitOffsetX: -52,
            portraitOffsetY: -60,
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
    }, "archer": {
        id: "archer", name: "Archer", baseMaxHP: 8, baseMaxFP: 8,
        defaultSkills: [SKILLS["strike"]],
        characterFeatures: [

        ],
        animation: {
            portraitOffsetX: -48,
            portraitOffsetY: -62,
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
    }, "wizard": {
        id: "wizard", name: "Wizard", baseMaxHP: 5, baseMaxFP: 13,
        defaultSkills: [SKILLS["strike"]],
        characterFeatures: [

        ],
        animation: {
            portraitOffsetX: -76,
            portraitOffsetY: -58,
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
}

export const GENERIC_FEATURES: Array<CharacterFeature> = [
    { expCost: 30, isGeneric: true, skillUnlocked: SKILLS["infuse"]},
    { expCost: 100, isGeneric: true, skillUnlocked: SKILLS["recklessAttack"]},
    { expCost: 100, isGeneric: true, skillUnlocked: SKILLS["legSweep"]},
    { expCost: 250, isGeneric: true, skillUnlocked: SKILLS["flurryOfBlows"]},
    { expCost: 500, isGeneric: true, skillUnlocked: SKILLS["rage"]},
    { expCost: 350, isGeneric: true, skillUnlocked: SKILLS["replenishingStrike"]},
    { expCost: 400, isGeneric: true, skillUnlocked: SKILLS["turningKick"]},
    { expCost: 650, isGeneric: true, skillUnlocked: SKILLS["lightningKicks"]},
    { expCost: 1000, isGeneric: true, skillUnlocked: SKILLS["concentrate"]}
]