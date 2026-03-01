// Name: Waveforms
// ID: dogeiscutWaveforms
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) { 
        throw new Error("'Waveforms' must run unsandboxed!");   
    }

    // You can remove these as needed.
    const BlockType = Scratch.BlockType
    const BlockShape = Scratch.BlockShape
    const ArgumentType = Scratch.ArgumentType
    const TargetType = Scratch.TargetType
    const Cast = Scratch.Cast
    const vm = Scratch.vm;
    const runtime = Scratch.vm.runtime;
    const SB = ScratchBlocks;

    const arrowURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNS44OTMiIGhlaWdodD0iMTUuODkzIiB2aWV3Qm94PSIwIDAgMTUuODkzIDE1Ljg5MyI+PHBhdGggZD0iTTkuMDIxIDEyLjI5NHYtMi4xMDdsLTYuODM5LS45MDVDMS4zOTggOS4xODQuODQ2IDguNDg2Ljk2MiA3LjcyN2MuMDktLjYxMi42MDMtMS4wOSAxLjIyLTEuMTY0bDYuODM5LS45MDVWMy42YzAtLjU4Ni43MzItLjg2OSAxLjE1Ni0uNDY0bDQuNTc2IDQuMzQ1YS42NDMuNjQzIDAgMCAxIDAgLjkxOGwtNC41NzYgNC4zNmMtLjQyNC40MDQtMS4xNTYuMTEtMS4xNTYtLjQ2NSIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9Ii4xNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNzUiLz48cGF0aCBkPSJNOS4wMjEgMTIuMjk0di0yLjEwN2wtNi44MzktLjkwNUMxLjM5OCA5LjE4NC44NDYgOC40ODYuOTYyIDcuNzI3Yy4wOS0uNjEyLjYwMy0xLjA5IDEuMjItMS4xNjRsNi44MzktLjkwNVYzLjZjMC0uNTg2LjczMi0uODY5IDEuMTU2LS40NjRsNC41NzYgNC4zNDVhLjY0My42NDMgMCAwIDEgMCAuOTE4bC00LjU3NiA0LjM2Yy0uNDI0LjQwNC0xLjE1Ni4xMS0xLjE1Ni0uNDY1IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMCAxNS44OTJWMGgxNS44OTJ2MTUuODkyeiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==";

    class WaveformType {
        customId = "dogeiscutWaveform"

        samples = []
        range = 1
        preset = "custom"
        audioContext = new AudioContext()

        constructor(type = "custom", samples = []) {
            this.samples = null
            this.upperRange = null
            this.lowerRange = null
            this.type = type
            if (this.type === "custom") {
                this.samples = Array.from(samples).map(x => Number.parseFloat(x))
                this.range = Math.max(...this.samples.map(x => Math.abs(x)))
            }
        }

        play() {

        }
        
        stop() {
            
        }

        normalize() { // to -1 through 1
            this.samples = Array.from(samples).map(x => x / this.range)
            this.range = 1
        }
    }
    const dogeiscutWaveform = {
        Type: WaveformType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.SCRAPPED,
            forceOutputType: "Waveform",
            disableMonitor: true
        },
        Argument: {
            shape: Scratch.BlockShape.SCRAPPED,
            exemptFromNormalization: true,
            check: ["Waveform"]
        }
    }
    
    class Extension {
        constructor() {
            if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
        }
        getInfo() {
            return {
                id: "dogeiscutWaveforms",
                name: "Waveforms",
                color1: "#48b2cd",
                blocks: [
                    {
                        opcode: 'samples',
                        text: 'samples [ARRAY]',
                        ...dogeiscutWaveform.Block,
                        arguments: {
                            ARRAY: vm.jwArray.Argument
                        }
                    },
                    {
                        opcode: 'preset',
                        text: 'preset [PRESET]',
                        ...dogeiscutWaveform.Block,
                        arguments: {
                            PRESET: {
                                menu: "stringifyFormat",
                                defaultValue: "sine"
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'invert',
                        text: 'invert [WAVEFORM]',
                        ...dogeiscutWaveform.Block,
                        arguments: {
                            WAVEFORM: dogeiscutWaveform.Argument,
                        }
                    },
                    {
                        opcode: 'combine',
                        text: 'combine [A] and [B]',
                        ...dogeiscutWaveform.Block,
                        arguments: {
                            A: dogeiscutWaveform.Argument,
                            B: dogeiscutWaveform.Argument,
                        }
                    },
                    '---',
                    {
                        opcode: 'playAtRate',
                        text: 'play [WAVEFORM] at rate [RATE]',
                        arguments: {
                            WAVEFORM: dogeiscutWaveform.Argument,
                            RATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 440,
                            },
                        }
                    },
                    {
                        opcode: 'stop',
                        text: 'stop [WAVEFORM]',
                        arguments: {
                            WAVEFORM: dogeiscutWaveform.Argument,
                        }
                    },
                    '---',
                    {
                        opcode: 'playSampleAtRate',
                        text: 'play sample [IMG] [SAMPLE] at rate [RATE]',
                        isTerminal: true,
                        arguments: {
                            IMG: { type: Scratch.ArgumentType.IMAGE, dataURI: arrowURI },
                            SAMPLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            RATE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 440,
                            },
                        }
                    },
                ],
                menus: {
                    stringifyFormat: {
                        acceptReporters: false,
                        items: [
                            "sine",
                            "square",
                            "sawtooth",
                            "triangle"
                        ]
                    }
                }
            }
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);