import * as stageIndex from "./stages/stage_index.js";

export const Stages = {
    chapter1: {
        name: "Chapter 1: Mystical Showers",
        short: "C1",
        stages: [
            {
                key: "Lost Memory",
                obj: new stageIndex.C1_1(),
                short: "1"
            },
            {
                key: "MagiCatz",
                obj: new stageIndex.C1_2(),
                short: "2"
            },
            {
                key: "Altale",
                obj: new stageIndex.C1_3(),
                short: "3"
            },
            {
                key: "Kronos",
                obj: new stageIndex.C1_4(),
                short: "4"
            },
            {
                key: "Reprologue",
                obj: new stageIndex.C1_5(),
                short: "5"
            },
            {
                key: "Cyber Meteoroid",
                obj: new stageIndex.C1_B(),
                short: "B"
            },
        ]
    }
}