// Name: Svg
// ID: dogeiscutsvg
// Description: Allows you to create and manipulate SVG.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function (Scratch) {
    'use strict';

    //const COLOR = "#d1b0e3"
    const COLOR = "#44ccaa"

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'wrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    class dogeiscutSvgType {
        customId = "dogeiscutsvg";

        svg = '<svg/ >';

        constructor(svg = '<svg/ >') {
            this.svg = svg;
        }

        static toSvg(pathString) {
        }

        toString() {
            return this.svg;
        }
        toMonitorContent() {
            try {
                let root = document.createElement('div')
                root.style.display = 'flex'
                root.style.flexDirection = 'column'
                root.style.justifyContent = 'center'
    
                const img = pathImage(path, "transparent", "white", 2, 2, 150/3)
                root.appendChild(img)

                return root
            } catch {
                console.error('Error creating svg')
                console.error(e)
                return span("Bad Svg")
            }
        }
        toReporterContent() {
            try {
                // const svgns = "http://www.w3.org/2000/svg";
                let root = document.createElement('div')
                root.style.display = 'flex'
                root.style.flexDirection = 'column'
                root.style.justifyContent = 'center'

                root.appendChild(span(`Svg: ${this.svg}`))

                return root
            } catch {
                console.error('Error creating svg')
                console.error(e)
                return span("Bad Svg")
            }
        }

        get svg() {
            return this.svg;
        }

        set svg(to) {
            this.svg = to
        }
    }

    const dogeiscutSvg = {
        Type: dogeiscutSvgType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            forceOutputType: "Svg",
            disableMonitor: true
        },
        Argument: {
            check: ["Svg"]
        }
    }

    let dogeiscutSvgPath = {
        Type: class {},
        Block: {},
        Argument: {}
    }

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Svg Paths\' must run unsandboxed!');
    }

    class Extension {
        constructor() {
            Scratch.vm.dogeiscutSvg = dogeiscutSvg
            Scratch.vm.runtime.registerSerializer(
                "dogeiscutsvg",
                v => v.path,
                v => new dogeiscutSvgType(v)
            );

            if (!vm.dogeiscutSvgPath) vm.extensionManager.loadExtensionURL(`https://raw.githubusercontent.com/DogeisCut/PenguinMod-ExtensionsGallery/refs/heads/extension-SVGPaths/static/extensions/DogeisCut/SvgPath.js`)
            dogeiscutSvgPath = vm.dogeiscutSvgPath
        }

        getInfo() {
            return {
                id: 'dogeiscutSvg',
                name: 'Svg',
                color1: COLOR,
                blocks: [
                    {
                        opcode: 'empty',
                        text: 'empty svg',
                        ...dogeiscutSvg.Block,
                    },
                ],
                menus: {
                }
            }
        }

        empty() {
            return new dogeiscutSvg.Type()
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);