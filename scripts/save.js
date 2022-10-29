const defaultSave = {
    player: {
        name: "『 』",
        color: [240, 240, 120]
    }
}

window.save = JSON.parse(JSON.stringify(defaultSave));