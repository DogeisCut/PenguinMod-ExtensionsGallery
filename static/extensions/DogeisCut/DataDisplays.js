// Name: Data Displays
// ID: dogeiscutDataDisplays
// Description: Fun ways to report and monitor data in your projects!
// By: dogeiscut <https://scratch.mit.edu/users/dogeiscut/>

// TODO: fix monitors not always updating

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Data Displays\' must run unsandboxed!');
    }

    const vm = Scratch.vm;
    const runtime = Scratch.vm.runtime;
    const Cast = Scratch.Cast;

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'wrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    function img(src) {
        let img = document.createElement('img')
        img.style.maxWidth = `150px`
        img.style.maxHeight = `150px`
        img.style.width = '100%'
        img.style.margin = 'auto'
        img.style.display = 'block'
        img.style.pointerEvents = 'none';
        img.src = src

        return img
    }

    function br() {
        let el = document.createElement('br');
        return el;
    }

    /**
     * @typedef {(data: any, extra: object) => HTMLElement} ContentFunction
     */

    class DisplayType {
        /**
         * @param {ContentFunction} toMonitorContent - Function to generate monitor content
         * @param {ContentFunction} toReporterContent - Function to generate reporter content
         * @param {string} [name=""] - The name of the display type, used for the `toString` method.
         */
        constructor(toMonitorContent, toReporterContent, name = "") {
            if (typeof toMonitorContent !== 'function' || typeof toReporterContent !== 'function') {
                throw new TypeError('toMonitorContent and toReporterContent must be functions');
            }
            this.toMonitorContent = toMonitorContent;
            this.toReporterContent = toReporterContent;
            this.name = name;
        }

        toString() {
            return this.name;
        }
    }

    const DisplayTypes = {
        ERROR: new DisplayType(
            function(data, extra) {
                const root = document.createElement('div');

                const redTextContainer = document.createElement('div');
                redTextContainer.style.color = 'red';
                redTextContainer.style.textAlign = 'center';
                root.appendChild(redTextContainer);

                const errorText = span(`ERROR: Failed to make display!`);//: ${Cast.toString(extra.error)}`);
                errorText.style.fontWeight = 'bold';
                redTextContainer.appendChild(errorText);

                root.appendChild(br());
                const dataText = span('Data:')
                dataText.style.fontWeight = 'bold';
                root.appendChild(dataText);
                root.appendChild(br());

                root.appendChild(span(Cast.toString(data)));

                return root;
            },
            function(data, extra) {
                return this.toMonitorContent(data, extra);
            },
            "ERROR"
        ),
        BASIC: new DisplayType(
            function(data, extra) {
                return span(Cast.toString(data));
            },
            function(data, extra) {
                return span(Cast.toString(data));
            },
            "BASIC"
        ),
        IMAGE: new DisplayType(
            function (data, extra) {
                const pngMagicNumber = '\x89PNG\r\n\x1a\n';
                if (!Cast.toString(data).startsWith('data:image/')) {
                    try {
                        if (data.trim().startsWith('<svg')) {
                            data = `data:image/svg+xml;base64,${btoa(data)}`;
                        } else {
                            if (data.startsWith(pngMagicNumber)) {
                                data = `data:image/png;base64,${btoa(data)}`;
                            } else {
                                throw new Error('Unsupported image format or invalid data');
                            }
                        }
                    } catch (e) {
                        throw new Error(`Failed to convert data to a valid data URI for an image: ${e}`);
                    }
                }
                if (!Cast.toString(data).startsWith('data:image/')) {
                    throw new Error('Data must be a valid data URI for an image');
                }

                if (Cast.toString(data).startsWith('data:image/png;base64,')) {
                    const base64Data = Cast.toString(data).split(',')[1];
                    const binaryData = atob(base64Data);
                    if (!binaryData.startsWith(pngMagicNumber)) {
                        throw new Error('Invalid PNG data: Magic number mismatch');
                    }
                }

                let root = document.createElement('div');
                root.style.display = 'flex';
                root.style.flexDirection = 'column';
                root.style.justifyContent = 'center';

                const image = img(Cast.toString(data));
                root.appendChild(image);

                return root;
            },
            function(data, extra) {
                return this.toMonitorContent(data);
            },
            "IMAGE"
        ),
        STYLED: new DisplayType(
            function(data, extra) {
                const root = document.createElement('div');
                root.style.textAlign = extra.textAlign || 'center';
                root.style.color = extra.color || 'black';
                root.style.fontSize = extra.fontSize || '16px';
                root.style.fontWeight = extra.fontWeight || 'normal';
                root.style.fontStyle = extra.fontStyle || 'normal';
                root.style.backgroundColor = extra.backgroundColor || 'transparent';
                root.style.padding = extra.padding || '0';
                root.style.margin = extra.margin || '0';
                root.style.fontFamily = extra.fontFamily || 'inherit';

                const content = span(Cast.toString(data));
                root.appendChild(content);

                return root;
            },
            function(data, extra) {
                return this.toMonitorContent(data, extra);
            },
            "STYLED"
        ),
    };

    class dogeiscutDataDisplaysType {
        customId = "dogeiscutDataDisplays";
        data;
        displayType;
        extra;

        /**
         * @param {any} data - The data to be displayed
         * @param {DisplayType} displayType - The display type to use
         */
        constructor(data, displayType = DisplayTypes.BASIC, extra = {}) {
            this.data = data;
            this.displayType = displayType;
            this.extra = extra;
        }
        toString() {
            return Cast.toString(this.data);
        }
        toMonitorContent() {
            try {
                return this.displayType.toMonitorContent(this.data, this.extra);
            } catch(e) {
                return DisplayTypes.ERROR.toMonitorContent(this.data, { error: Cast.toString(e) });
            }
        }
        toReporterContent() {
            try {
                return this.displayType.toReporterContent(this.data, this.extra);
            } catch(e) {
                return DisplayTypes.ERROR.toReporterContent(this.data, { error: Cast.toString(e) });
            }
        }
    }

    const dogeiscutDataDisplays = {
        Type: dogeiscutDataDisplaysType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            //forceOutputType: "",
            disableMonitor: true
        },
        Argument: {
            //check: [""]
        }
    }

    class Extension {
        constructor() {
            Scratch.vm.dogeiscutDataDisplays = dogeiscutDataDisplays
            Scratch.vm.runtime.registerSerializer(
                "dogeiscutDataDisplays",
                v => {
                    if (v instanceof dogeiscutDataDisplaysType) {
                        return {
                            data: v.data,
                            displayType: Object.keys(DisplayTypes).find(key => DisplayTypes[key] === v.displayType) || 'BASIC',
                            extra: v.extra || {}
                        };
                    }
                    return null;
                },
                v => {
                    if (v && typeof v === 'object') {
                        const displayType = DisplayTypes[v.displayType] || DisplayTypes.BASIC;
                        return new dogeiscutDataDisplaysType(v.data, displayType, v.extra || {});
                    }
                    return null;
                }
            );
        }

        getInfo() {
            return {
                id: 'dogeiscutDataDisplays',
                name: 'Data Displays',
                color1: "#969696",
                blocks: [
                    {
                        opcode: 'astext',
                        text: '[DATA] as text',
                        ...dogeiscutDataDisplays.Block,
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `Hello!`
                            }
                        }
                    },
                    {
                        opcode: 'asimage',
                        text: '[DATA] as image',
                        ...dogeiscutDataDisplays.Block,
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `data:image/png;base64,...`
                            }
                        }
                    },
                    {
                        opcode: 'asstyled',
                        text: '[DATA] as styled text with color [COLOR] and size [SIZE]',
                        ...dogeiscutDataDisplays.Block,
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `styled text~`
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `black`
                            },
                            SIZE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `16px`
                            }
                        }
                    }
                ]
            }
        }

        /* blocks */

        astext({ DATA }) {
            return new dogeiscutDataDisplays.Type(Cast.toString(DATA), DisplayTypes.BASIC)
        }

        asimage({ DATA }) {
            return new dogeiscutDataDisplays.Type(Cast.toString(DATA), DisplayTypes.IMAGE)
        }

        asstyled({ DATA, COLOR, SIZE }) {
            return new dogeiscutDataDisplays.Type(
            Cast.toString(DATA),
            DisplayTypes.STYLED,
            {
                color: Cast.toString(COLOR),
                fontSize: Cast.toString(SIZE)
            }
            );
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);