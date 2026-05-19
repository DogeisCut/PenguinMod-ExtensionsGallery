// Name: Category Extension Expanders
// ID: dogeiscutCategoryExtensionExpanders
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

// Future Ideas
// - get (costume: string v) as svg xml: XML - only lists vector costumes, invalid input returns blank XML
// - get (costume: string v) as array buffer: Array Buffer - only lists bitmap costumes, invalid input returns blank buffer

// Currently Supported Custom Types
// - Arrays
// - Objects
// - Targets
// - Vector
// - Lambda
// - Regex

// TODO
// - make the blocks actually work
// - hide sub categorys with no blocks
// - add a message if there's no extensions added that have compat
// - add help page or button of some sort for list of supported ext
// - make all block compiled

// Blocks marked with a ⚠ are unimplemented

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) { 
        throw new Error("'Category Extension Expanders' must run unsandboxed!");   
    }

    const BlockType = Scratch.BlockType
    const BlockShape = Scratch.BlockShape
    const ArgumentType = Scratch.ArgumentType
    const TargetType = Scratch.TargetType
    const Cast = Scratch.Cast
    const vm = Scratch.vm;
    const runtime = Scratch.vm.runtime;
    const SB = ScratchBlocks;
    
    class Extension {
        getInfo() {
            return {
                id: "dogeiscutCategoryExtensionExpanders",
                name: "Category Extension Expanders",
                color1: "#f2f2f2",
                blocks: [
                    {
                        blockType: BlockType.BUTTON,
                        text: 'DEBUG: add supported extensions',
                        func: "addSupportedExtensions",
                        hideFromPalette: false,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Motion',
                    },
                    {
                        opcode: 'transformMatrix',
                        text: '⚠ transform matrix',
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'setTransformToMatrix',
                        text: '⚠ set transform to matrix [MATRIX]',
                        arguments: {
                            MATRIX: (vm.jwArray ? vm.jwArray.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwArray,
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'transform',
                        text: '⚠ transform',
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setTransformToTransform',
                        text: '⚠ set transform to [TRANSFORM]',
                        arguments: {
                            TRANSFORM: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.dogeiscutObject,
                    },
                    ...(vm.dogeiscutObject ? ['---'] : []),
                    {
                        opcode: 'changePositionByPosition',
                        text: 'change position by [POSITION]',
                        arguments: {
                            POSITION: (vm.jwVector ? vm.jwVector.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwVector,
                    },
                    {
                        
                        opcode: 'glideSecsToPosition',
                        text: '⚠ glide [SECS] secs to position [POSITION]',
                        arguments: {
                            SECS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            POSITION: (vm.jwVector ? vm.jwVector.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwVector,
                    },
                    ...(vm.jwVector ? ['---'] : []),
                    {
                        opcode: 'pointTowardsPosition',
                        text: '⚠ point towards position [POSITION]',
                        arguments: {
                            POSITION: (vm.jwVector ? vm.jwVector.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwVector,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Looks',
                    },
                    {
                        opcode: 'textBubbleOptions',
                        text: '⚠ text bubble options',
                        extensions: ["colours_looks"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setBubbleOptionsToObject',
                        text: '⚠ set bubble options to [OPTIONS]',
                        arguments: {
                            OPTIONS: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_looks"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.dogeiscutObject,
                    },
                    {
                        opcode: 'bubbleSize',
                        text: '⚠ bubble size',
                        extensions: ["colours_looks"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwVector,
                        ...(vm.jwVector ? vm.jwVector.Block : {}),
                    },
                    ...(vm.jwVector ? ['---'] : []),
                    {
                        opcode: 'costumeNames',
                        text: 'costume names',
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'graphicEffects',
                        text: 'graphic effects',
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setGraphicEffectsToObject',
                        text: '⚠ set graphic effects to [EFFECTS]',
                        arguments: {
                            EFFECTS: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.dogeiscutObject,
                    },
                    ...(vm.dogeiscutObject ? ['---'] : []),
                    {
                        opcode: 'changeStretchByVector',
                        text: 'change stretch by [VECTOR]',
                        arguments: {
                            VECTOR: (vm.jwVector ? vm.jwVector.Argument : {})
                        },
                        extensions: ["colours_looks"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwVector,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Sounds',
                    },
                    {
                        opcode: 'soundNames',
                        text: 'sound names',
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'soundsPlaying',
                        text: '⚠ sounds playing',
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'soundEffects',
                        text: '⚠ sound effects',
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setSoundEffectsToObject',
                        text: '⚠ set sound effects to [EFFECTS]',
                        arguments: {
                            EFFECTS: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.dogeiscutObject,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Events',
                    },
                    {
                        opcode: 'broadcastNames',
                        text: '⚠ broadcast names',
                        extensions: ["colours_event"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Control',
                    },
                    {
                        opcode: 'runningSprites',
                        text: '⚠ running sprites',
                        extensions: ["colours_control"],
                        hideFromPalette: !(vm.jwArray && vm.jwTargets),
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...((vm.jwArray && vm.jwTargets) ? ['---'] : []),
                    {
                        opcode: 'asSpriteReturn',
                        text: '⚠ as [TARGET] return [VALUE]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            TARGET: (vm.jwTargets ? vm.jwTargets.Argument : {}),
                            VALUE: {
                                type: null
                            }
                        },
                        extensions: ["colours_control"],
                        hideFromPalette: !vm.jwTargets,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Sensing',
                    },
                    {
                        opcode: 'touchedColors',
                        text: '⚠ touched colors',
                        extensions: ["colours_sensing"],
                        filter: [TargetType.SPRITE],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'keysDown',
                        text: '⚠ keys down',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'keysHit',
                        text: '⚠ keys hit',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'fingersDown',
                        text: '⚠ fingers down',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'fingersHit',
                        text: '⚠ fingers hit',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'fingerPositions',
                        text: '⚠ finger positions',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !(vm.jwArray && vm.jwVector),
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Operators',
                    },
                    {
                        opcode: 'identityTransform',
                        text: '⚠ identity transform',
                        extensions: ["colours_operators"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'arrayToVector',
                        text: '[ARRAY]',
                        arguments: {
                            ARRAY: (vm.jwArray ? vm.jwArray.Argument : {})
                        },
                        extensions: ["colours_operators"],
                        hideFromPalette: !(vm.jwVector && vm.jwArray),
                        ...(vm.jwVector ? vm.jwVector.Block : {}),
                    },
                    {
                        opcode: 'objectToVector',
                        text: '[OBJECT]',
                        arguments: {
                            OBJECT: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_operators"],
                        hideFromPalette: !(vm.jwVector && vm.dogeiscutObject),
                        ...(vm.jwVector ? vm.jwVector.Block : {}),
                    },
                    ...((vm.jwVector && vm.dogeiscutObject) ? ['---'] : []),
                    {
                        opcode: 'interpolateVectorToVectorByT',
                        text: 'interpolate [A] to [B] by [T]',
                        arguments: {
                            A: (vm.jwVector ? vm.jwVector.Argument : {}),
                            B: (vm.jwVector ? vm.jwVector.Argument : {}),
                            T: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0.5
                            }
                        },
                        extensions: ["colours_operators"],
                        hideFromPalette: !vm.jwVector,
                        ...(vm.jwVector ? vm.jwVector.Block : {}),
                    },
                    ...(vm.jwVector ? ['---'] : []),
                    {
                        opcode: 'vectorPreset',
                        text: 'vector for [PRESET]',
                        arguments: {
                            PRESET: {
                                menu: 'vectorPresets',
                            },
                        },
                        extensions: ["colours_operators"],
                        hideFromPalette: !vm.jwVector,
                        ...(vm.jwVector ? vm.jwVector.Block : {}),
                    },
                    ...(vm.jwVector ? ['---'] : []),
                    {
                        opcode: 'regexPreset',
                        text: 'regex for [PRESET] [FLAGS]',
                        arguments: {
                            PRESET: {
                                menu: 'regexPresets',
                            },
                            FLAGS: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        },
                        extensions: ["colours_operators"],
                        hideFromPalette: !vm.dogeiscutRegularExpression,
                        ...(vm.dogeiscutRegularExpression ? vm.dogeiscutRegularExpression.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Variables',
                    },
                    {
                        opcode: 'scopeVariables',
                        text: '⚠ [SCOPE] variables',
                        arguments: {
                            SCOPE: {
                                menu: 'variableScope',
                            },
                        },
                        extensions: ["colours_data"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'scopeVariableNames',
                        text: '⚠ [SCOPE] variable names',
                        arguments: {
                            SCOPE: {
                                menu: 'variableScope',
                            },
                        },
                        extensions: ["colours_data"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Lists',
                    },
                    {
                        opcode: 'scopeLists',
                        text: '⚠ [SCOPE] lists',
                         arguments: {
                            SCOPE: {
                                menu: 'variableScope',
                            },
                        },
                        extensions: ["colours_data_lists"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'scopeListNames',
                        text: '⚠ [SCOPE] list names',
                         arguments: {
                            SCOPE: {
                                menu: 'variableScope',
                            },
                        },
                        extensions: ["colours_data_lists"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'My Blocks',
                    },
                    {
                        opcode: 'arguments',
                        text: '⚠ arguments',
                        extensions: ["colours_more"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'branches',
                        text: '⚠ branches',
                        extensions: ["colours_more"],
                        hideFromPalette: !(vm.jwArray && vm.jwLambda),
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'More',
                    },
                    {
                        opcode: 'fontNames',
                        text: 'font names',
                        extensions: ["colours_pen"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'targetData',
                        text: '(DEBUG) target data',
                        extensions: ["colours_pen"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                ],
                menus: {
                    variableScope: {
                        acceptReporters: false,
                        items: [{
                                text: 'all',
                                value: 'all'
                            },
                            {
                                text: 'global',
                                value: 'global'
                            },
                            {
                                text: 'local',
                                value: 'local'
                            }
                        ]
                    },
                    vectorPresets: {
                        acceptReporters: false,
                        items: [{
                                text: 'zero',
                                value: 'zero'
                            },
                            {
                                text: 'one',
                                value: 'one'
                            },
                            {
                                text: 'infinity',
                                value: 'infinity'
                            },
                            {
                                text: 'left',
                                value: 'left'
                            },
                            {
                                text: 'right',
                                value: 'right'
                            },
                            {
                                text: 'up',
                                value: 'up'
                            },
                            {
                                text: 'down',
                                value: 'down'
                            }
                        ]
                    },
                    regexPresets: {
                        acceptReporters: false,
                        items: [{
                                text: 'email address',
                                value: String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
                            },
                            {
                                text: 'url',
                                value: String.raw`^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$`
                            },
                            {
                                text: 'phone number',
                                value: String.raw`^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$`
                            },
                            {
                                text: 'basic password',
                                value: String.raw`^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$`
                            },
                            {
                                text: 'strong password',
                                value: String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`
                            },
                            {
                                text: 'Date (YYYY-MM-DD)',
                                value: String.raw`^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
                            },
                            {
                                text: 'time (24-hour HH:MM)',
                                value: String.raw`^([01]\d|2[0-3]):([0-5]\d)$`
                            },
                            {
                                text: 'hex code',
                                value: String.raw`^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$`
                            },
                            {
                                text: 'IPv4 address',
                                value: String.raw`^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$`
                            },
                            {
                                text: 'alphanumeric',
                                value: String.raw`^[a-zA-Z0-9]+$`
                            },
                            {
                                text: 'xml tag contents',
                                value: String.raw`<([a-z]+)[^>]*>(.*?)<\/\1>`
                            },
                            {
                                text: 'trim',
                                value: String.raw`^\s+|\s+$`
                            },
                            {
                                text: 'duplicate words',
                                value: String.raw`\b(\w+)\s+\1\b`
                            }
                        ]
                    },
                }
            }
        }
        
        async addSupportedExtensions() {
            if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
            if (!vm.dogeiscutObject) await vm.extensionManager.loadExtensionURL("https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js")
            if (!vm.jwTargets) vm.extensionManager.loadExtensionIdSync('jwTargets')
            if (!vm.jwVector) vm.extensionManager.loadExtensionIdSync('jwVector')
            if (!vm.jwLambda) vm.extensionManager.loadExtensionIdSync('jwLambda')
            if (!vm.dogeiscutRegularExpression) await vm.extensionManager.loadExtensionURL("https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutRegularExpressions.js")
            vm.runtime.requestBlocksUpdate()
            vm.runtime.requestToolboxExtensionsUpdate()
            vm.emitWorkspaceUpdate()
        }

        transformMatrix({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        setTransformToMatrix({ MATRIX }, util) {
            MATRIX = vm.jwArray.Type.toArray(MATRIX)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        transform({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        setTransformToTransform({ TRANSFORM }, util) {
            TRANSFORM = vm.dogeiscutObject.Type.toObject(TRANSFORM)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        changePositionByPosition({ POSITION }, util) {
            POSITION = vm.jwVector.Type.toVector(POSITION)
            util.target.setXY(util.target.x + POSITION.x, util.target.y + POSITION.y)
        }

        glideSecsToPosition({ SECS, POSITION }, util) {
            SECS = Cast.toNumber(SECS)
            POSITION = vm.jwVector.Type.toVector(POSITION)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        pointTowardsPosition({ POSITION }, util) {
            POSITION = vm.jwVector.Type.toVector(POSITION)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        textBubbleOptions({ }, util) {
            //const props = util.target._customState.Scratch.looks.props;
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        setBubbleOptionsToObject({ OPTIONS }, util) {
            OPTIONS = vm.dogeiscutObject.Type.toObject(OPTIONS)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        bubbleSize({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        costumeNames({ }, util) {
            const costumes = util.target.getCostumes();
            return vm.jwArray.Type.toArray(costumes.map(costume => costume.name));
        }

        graphicEffects({  }, util) {
            return vm.dogeiscutObject.Type.toObject(util.target.effects);
        }

        setGraphicEffectsToObject({ EFFECTS }, util) {
            EFFECTS = vm.dogeiscutObject.Type.toObject(EFFECTS)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        changeStretchByVector({ VECTOR }, util) {
            VECTOR = vm.jwVector.Type.toVector(VECTOR)
            util.target.setStretch(util.target.stretch[0] + VECTOR.x, util.target.stretch[1] + VECTOR.y)
        }

        soundNames({ }, util) {
            const sounds = util.target.getSounds();
            return vm.jwArray.Type.toArray(sounds.map(sound => sound.name));
        }

        soundsPlaying({ }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        soundEffects({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        setSoundEffectsToObject({ EFFECTS }, util) {
            EFFECTS = vm.dogeiscutObject.Type.toObject(EFFECTS)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        broadcastNames({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        runningSprites({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        asSpriteReturn({ TARGET, VALUE }, util) { // will need to be compiled since VALUE needs to be evaluated on the TARGET
            TARGET = vm.dogeiscutObject.Type.toTarget(TARGET)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        touchedColors({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        keysDown({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        keysHit({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        fingersDown({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        fingersHit({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        fingerPositions({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        identityTransform({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        arrayToVector({ ARRAY }, util) {
            ARRAY = vm.jwArray.Type.toArray(ARRAY)
            const x = Cast.toNumber(ARRAY.array[0])
            const y = Cast.toNumber(ARRAY.array[1])
            return vm.jwVector.Type.toVector([x, y])
        }

        objectToVector({ OBJECT }, util) {
            OBJECT = vm.dogeiscutObject.Type.toObject(OBJECT)
            const x = Cast.toNumber(OBJECT.get("x"))
            const y = Cast.toNumber(OBJECT.get("y"))
            return vm.jwVector.Type.toVector([x, y])
        }

        interpolateVectorToVectorByT({ A, B, T }, util) {
            A = vm.jwVector.Type.toVector(A)
            B = vm.jwVector.Type.toVector(B)
            T = Cast.toNumber(T)
            T = Math.max(0, Math.min(1, T));
            const resultX = A.x + T * (B.x - A.x);
            const resultY = A.y + T * (B.y - A.y);
            return new vm.jwVector.Type(resultX, resultY);
        }

        vectorPreset({ PRESET }, util) {
            PRESET = Cast.toString(PRESET)
            switch (PRESET) {
                case "one":
                    return new vm.jwVector.Type(1, 1)
                case "infinity":
                    return new vm.jwVector.Type(Infinity, Infinity)
                case "left":
                    return new vm.jwVector.Type(-1, 0)
                case "right":
                    return new vm.jwVector.Type(1, 0)
                case "up":
                    return new vm.jwVector.Type(0, 1)
                case "down":
                    return new vm.jwVector.Type(0, -1)
                default:
                    return new vm.jwVector.Type(0, 0)
            }
        }

        regexPreset({ PRESET, FLAGS }, util) {
            const PATTERN = Cast.toString(PRESET)
            FLAGS = Cast.toString(FLAGS)
            return vm.dogeiscutRegularExpression.Type.toRegularExpression({ PATTERN, FLAGS })
        }

        scopeVariables({ SCOPE }, util) {
            SCOPE = Cast.toString(SCOPE)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        scopeVariableNames({ SCOPE }, util) {
            SCOPE = Cast.toString(SCOPE)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        scopeLists({ SCOPE }, util) {
            SCOPE = Cast.toString(SCOPE)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        scopeListNames({ SCOPE }, util) {
            SCOPE = Cast.toString(SCOPE)
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        arguments({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        branches({  }, util) {
            throw new Error("Not Implemented: Block functionality incomplete or non-existant")
        }

        fontNames({  }, util) {
            const fonts = runtime.fontManager.getFonts();
            return vm.jwArray.Type.toArray(fonts.map(font => font.name));
        }

        targetData({ }, util) {
            console.log(util.target)
            return vm.dogeiscutObject.Type.toObject(util.target);
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);