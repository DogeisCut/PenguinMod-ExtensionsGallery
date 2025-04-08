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

        static toDataDisplaysType(data) {
            if (data instanceof dogeiscutDataDisplays.Type) {
                return data;
            }
            return new dogeiscutDataDisplays.Type(Cast.toString(data));
        }
    }

    const dogeiscutDataDisplays = {
        Type: dogeiscutDataDisplaysType,
        Block: {
            STYLED: {
                blockType: Scratch.BlockType.REPORTER,
                forceOutputType: "Data Display Styled",
                disableMonitor: true
            },
            IMAGE: {
                blockType: Scratch.BlockType.REPORTER,
                forceOutputType: "Data Display Image",
                disableMonitor: true
            },
        },
        Argument: {
            STYLED: {
                check: ["Data Display Styled"]
            },
            IMAGE: {
                check: ["Data Display Image"]
            },
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
                        hideFromPalette: true, // this is a useless block...
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `Hello!`
                            }
                        }
                    },
                    //'---',
                    {
                        opcode: 'asimage',
                        text: '[DATA] as image',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'images'
                            }
                        }
                    },
                    {
                        opcode: 'imageeditantialiasing',
                        text: 'set anti-aliasing on [IMAGE] to [BOOL]',
                        hideFromPalette: true,
                        ...dogeiscutDataDisplays.Block.IMAGE,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.IMAGE,
                            BOOL: {
                                type: Scratch.ArgumentType.BOOLEAN
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        xml: `
                        <block type="dogeiscutDataDisplays_imageeditantialiasing">
                            <value name="BOOL">
                                <shadow type="dogeiscutDataDisplays_menu_boolean">
                                    <field name="BOOL">false</field>
                                </shadow>
                            </value>
                        </block>`
                    },
                    {
                        opcode: 'imageeditwidth',
                        text: 'set width of [IMAGE] to [WIDTH]',
                        ...dogeiscutDataDisplays.Block.IMAGE,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.IMAGE,
                            WIDTH: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '150px'
                            },
                        }
                    },
                    {
                        opcode: 'imageeditheight',
                        text: 'set height of [IMAGE] to [HEIGHT]',
                        ...dogeiscutDataDisplays.Block.IMAGE,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.IMAGE,
                            HEIGHT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '150px'
                            },
                        }
                    },
                    '---',
                    {
                        opcode: 'asstyled',
                        text: '[DATA] as styleable',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `styled text~`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitcolor',
                        text: 'set color of [STYLE] to [COLOR]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `cyan`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitsize',
                        text: 'set size of [STYLE] to [SIZE]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            SIZE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `32px`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitfontweight',
                        text: 'set font weight of [STYLE] to [WEIGHT]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            WEIGHT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `bold`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitfontstyle',
                        text: 'set font style of [STYLE] to [STYLETYPE]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            STYLETYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `italic`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitbackground',
                        text: 'set background color of [STYLE] to [COLOR]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `yellow`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitpadding',
                        text: 'set padding of [STYLE] to [PADDING]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            PADDING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `10px`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitmargin',
                        text: 'set margin of [STYLE] to [MARGIN]',
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            MARGIN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `5px`
                            },
                        }
                    },
                    {
                        opcode: 'stylededitfontfamily',
                        text: 'set font family of [STYLE] to [FONT]',
                        hideFromPalette: true,
                        ...dogeiscutDataDisplays.Block.STYLED,
                        arguments: {
                            ...dogeiscutDataDisplays.Argument.STYLED,
                            FONT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: `Arial`
                            },
                        }
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        xml:
                        `<block type="dogeiscutDataDisplays_stylededitfontfamily" >
                            <value name="FONT">
                                <shadow type="pen_menu_FONT" >
                                    <field name="FONT">Arial</field>
                                </shadow>
                            </value>
                        </block>`  
                    },
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        opcode: 'menu_boolean',
                        text: '[BOOL]',
                        hideFromPalette: true,
                        disableMonitor: true,
                        arguments: {
                            BOOL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'boolean',
                            }
                        },
                    },
                ],
                menus: {
                    boolean: {
                        acceptReporters: false,
                        items: [
                            { text: Scratch.translate('true'), value: 'true' },
                            { text: Scratch.translate('false'), value: 'false' },
                        ]
                    },
                    images: {
                        isTypeable: true,
                        items: [
                            {
                                text: 'Smiley Face',
                                value: `Smiley Face`
                            },
                            {
                                text: 'Any DataURI',
                                value: `data:image/png;base64, ...`
                            }
                        ]
                    }
                }
            }
        }

        /* menus */

        menu_boolean({ BOOL }) {
            return Scratch.Cast.toBoolean(BOOL);
        }

        /* blocks */

        astext({ DATA }) {
            return new dogeiscutDataDisplays.Type(Cast.toString(DATA), DisplayTypes.BASIC)
        }

        asimage({ DATA }) {
            if (DATA === "Smiley Face") {
                return new dogeiscutDataDisplays.Type(
                    `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuNBLfpoMAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAADHcBAOgDAAAMdwEA6AMAAFBhaW50Lk5FVCA1LjEuNAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADQ2WABsfAzzAAAAGVJREFUKFNtj8sNgDAMQx3m4MI4DMJUDMIq3LiwR7DdD0XiSUmcTxM1UMkDaXHbIza4Z+fmIkUu2jhUX6Y5GWk935GTJikVOmMemsJM9XNCeEOsdGp87794C8NotVZ+IVqhUb4JPM6EOAxRw9XmAAAAAElFTkSuQmCC`,
                    DisplayTypes.IMAGE
                )
            }
            return new dogeiscutDataDisplays.Type(Cast.toString(DATA), DisplayTypes.IMAGE)
        }

        asstyled({ DATA }) {
            return new dogeiscutDataDisplays.Type(
            Cast.toString(DATA),
            DisplayTypes.STYLED,
            {}
            );
        }

        stylededitcolor({ STYLE, COLOR }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE)
            STYLE.displayType = DisplayTypes.STYLED
            STYLE.extra.color = Cast.toString(COLOR)
            return STYLE
        }

        stylededitsize({ STYLE, SIZE }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE)
            STYLE.displayType = DisplayTypes.STYLED
            STYLE.extra.fontSize = Cast.toString(SIZE)
            return STYLE
        }

        stylededitfontweight({ STYLE, WEIGHT }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE);
            STYLE.displayType = DisplayTypes.STYLED;
            STYLE.extra.fontWeight = Cast.toString(WEIGHT);
            return STYLE;
        }

        stylededitfontstyle({ STYLE, STYLETYPE }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE);
            STYLE.displayType = DisplayTypes.STYLED;
            STYLE.extra.fontStyle = Cast.toString(STYLETYPE);
            return STYLE;
        }

        stylededitbackground({ STYLE, COLOR }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE);
            STYLE.displayType = DisplayTypes.STYLED;
            STYLE.extra.backgroundColor = Cast.toString(COLOR);
            return STYLE;
        }

        stylededitpadding({ STYLE, PADDING }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE);
            STYLE.displayType = DisplayTypes.STYLED;
            STYLE.extra.padding = Cast.toString(PADDING);
            return STYLE;
        }

        stylededitmargin({ STYLE, MARGIN }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE);
            STYLE.displayType = DisplayTypes.STYLED;
            STYLE.extra.margin = Cast.toString(MARGIN);
            return STYLE;
        }

        stylededitfontfamily({ STYLE, FONT }) {
            STYLE = dogeiscutDataDisplays.Type.toDataDisplaysType(STYLE);
            STYLE.displayType = DisplayTypes.STYLED;
            STYLE.extra.fontFamily = Cast.toString(FONT);
            return STYLE;
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);