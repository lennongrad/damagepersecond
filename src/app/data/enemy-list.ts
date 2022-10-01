import { AnimationInformation } from "../interfaces/animation-information"
import { EncounterInformation, EnemyInformation } from "../interfaces/unit-information"

const beastAnimations: Array<AnimationInformation> = [{
    name: "Idle", repeat: true, randomize: .1, frameDurations: [
        { duration: .6, frame: { x: 0, y: 0 } },
        { duration: .6, frame: { x: 1, y: 0 } },
        { duration: .6, frame: { x: 0, y: 0 } },
        { duration: .16, frame: { x: 1, y: 0 } },
        { duration: .1, frame: { x: 3, y: 0 } },
        { duration: .08, frame: { x: 4, y: 0 } },
        { duration: .2, frame: { x: 3, y: 0 } },
        { duration: .24, frame: { x: 2, y: 0 } },
        { duration: .28, frame: { x: 1, y: 0 } },
        { duration: .6, frame: { x: 0, y: 0 } },
        { duration: .6, frame: { x: 1, y: 0 } },
        { duration: .4, frame: { x: 5, y: 0 } },
        { duration: .3, frame: { x: 6, y: 0 } },
        { duration: .3, frame: { x: 7, y: 0 } },
        { duration: 2, frame: { x: 0, y: 1 } },
        { duration: .3, frame: { x: 7, y: 0 } },
        { duration: .3, frame: { x: 6, y: 0 } },
        { duration: .4, frame: { x: 5, y: 0 } },
    ]
}, {
    name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
        { duration: .04, frame: { x: 5, y: 0 } },
        { duration: .04, frame: { x: 1, y: 1 } },
        { duration: .2, frame: { x: 2, y: 1 } },
    ]
}
]

export const ENEMIES: { [id: string]: EnemyInformation } = {
    "dummy": {
        id: "dummy", name: "Training Dummy", baseMaxHP: 123 * Math.pow(10, 12), animation: {
            imageURL: "dummy-body.png",
            shadowImageURL: "dummy-shadow.png",
            sheetWidth: 1,
            sheetHeight: 1,
            animations: [{
                name: "Idle", repeat: true, frameDurations: [
                    { duration: 1, frame: { x: 0, y: 0 } }
                ]
            }]
        }
    },
    "beast": {
        id: "beast", name: "Beast", baseMaxHP: 50, animation: {
            imageURL: "beast-body.png",
            shadowImageURL: "beast-shadow.png",
            horizontalDisplacement: 12,
            sheetWidth: 8,
            sheetHeight: 8,
            animations: beastAnimations
        }
    },
    "beast2": {
        id: "beast2", name: "Beast2", baseMaxHP: 80, animation: {
            imageURL: "beast-2-body.png",
            shadowImageURL: "beast-shadow.png",
            horizontalDisplacement: 12,
            sheetWidth: 8,
            sheetHeight: 8,
            animations: beastAnimations
        }
    },
    "soldier": {
        id: "soldier", name: "Soldier", baseMaxHP: 50, animation: {
            imageURL: "enemy-body.png",
            shadowImageURL: "enemy-shadow.png",
            horizontalDisplacement: 22,
            sheetWidth: 8,
            sheetHeight: 8,
            animations: [{
                name: "Idle", repeat: true, randomize: .1, frameDurations: [

                    { duration: 8, frame: { x: 0, y: 0 } },
                    { duration: .1, frame: { x: 1, y: 0 } },
                    { duration: .2, frame: { x: 2, y: 0 } },
                    { duration: .1, frame: { x: 1, y: 0 } },
                    { duration: .06, frame: { x: 2, y: 2 } }
                ]
            }, {
                name: "Attack", repeat: false, returnTo: "Idle", frameDurations: [
                    { duration: .02, frame: { x: 0, y: 1 } },
                    { duration: .04, frame: { x: 1, y: 1 } },
                    { duration: .04, frame: { x: 2, y: 1 } },
                    { duration: .16, frame: { x: 3, y: 1 } },
                    { duration: .08, frame: { x: 4, y: 1 } },
                    { duration: .04, frame: { x: 5, y: 1 } },
                    { duration: .02, frame: { x: 0, y: 2 } },
                    { duration: .02, frame: { x: 1, y: 2 } },
                    { duration: .04, frame: { x: 2, y: 2 } }
                ]
            }, {
                name: "Damage", repeat: false, returnTo: "Idle", frameDurations: [
                    //{ duration: .02, frame: { x: 4, y: 0 } },
                    { duration: .3, frame: { x: 3, y: 0 } },
                ]
            }]
        }
    }
}

export const ENCOUNTERS: { [id: string]: EncounterInformation } = {
    "training":
    {
        id: "training", name: "Training", enemies: [ENEMIES["dummy"], ENEMIES["dummy"], ENEMIES["dummy"]],
        baseGold: 0, itemRates: {}
    },
    "soldiers":
    {
        id: "soldiers", name: "Soldiers", enemies: [ENEMIES["soldier"], ENEMIES["soldier"], ENEMIES["soldier"]],
        baseGold: 60, itemRates: {}
    },
    "beasts":
    {
        id: "beasts", name: "Beasts", enemies: [ENEMIES["beast"], ENEMIES["beast"], ENEMIES["beast"]],
        baseGold: 10, itemRates: {
            "claw": .2, "bone": .1, "skull": .001, "tooth": .05, "scale": .025, "wing": .05, "feather": .15
        }
    },
    "beasts2":
    {
        id: "beasts2", name: "Ultrabeasts", enemies: [ENEMIES["beast2"], ENEMIES["beast2"], ENEMIES["beast2"]],
        baseGold: 10, itemRates: {
            "claw": .2, "bone": .1, "fangs": .05, "scale": .025, "eye": .01, "eggs": .1, "feather": .15, "venom": .0005
        }
    }
}