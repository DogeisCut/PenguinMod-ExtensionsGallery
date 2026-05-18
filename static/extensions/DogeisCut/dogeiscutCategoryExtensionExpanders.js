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

// TODO
// - make the blocks actually work
// - hide sub categorys with no blocks
// - add a message if there's no extensions added that have compat
// - add help page or button of some sort for list of supported ext

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
                        blockType: BlockType.LABEL,
                        text: 'Motion',
                    },
                    {
                        opcode: 'transformMatric',
                        text: 'transform matrix',
                        extensions: ["colours_motion"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'setTransformToMatrix',
                        text: 'set transform to matrix [MATRIX]',
                        arguments: {
                            MATRIX: (vm.jwArray ? vm.jwArray.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        hideFromPalette: !vm.jwArray,
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'transform',
                        text: 'transform',
                        extensions: ["colours_motion"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setTransformToTransform',
                        text: 'set transform to [TRANSFORM]',
                        arguments: {
                            TRANSFORM: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_motion"],
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
                        hideFromPalette: !vm.jwVector,
                    },
                    {
                        
                        opcode: 'glideSecsToPosition',
                        text: 'glide [SECS] secs to position [POSITION]',
                        arguments: {
                            SECS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            POSITION: (vm.jwVector ? vm.jwVector.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        hideFromPalette: !vm.jwVector,
                    },
                    ...(vm.jwVector ? ['---'] : []),
                    {
                        opcode: 'pointTowardsPosition',
                        text: 'point towards position [POSITION]',
                        arguments: {
                            POSITION: (vm.jwVector ? vm.jwVector.Argument : {})
                        },
                        extensions: ["colours_motion"],
                        hideFromPalette: !vm.jwVector,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Looks',
                    },
                    {
                        opcode: 'textBubbleOptions',
                        text: 'text bubble options',
                        arguments: {
                            SCOPE: {
                                menu: 'spriteScope',
                            },
                        },
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setBubbleOptionsToObject',
                        text: 'set bubble options to [OBJECT]',
                        arguments: {
                            OBJECT: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.dogeiscutObject,
                    },
                    {
                        opcode: 'bubbleSize',
                        text: 'bubble size',
                        arguments: {
                            SCOPE: {
                                menu: 'spriteScope',
                            },
                        },
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.jwVector,
                        ...(vm.jwVector ? vm.jwVector.Block : {}),
                    },
                    ...(vm.jwVector ? ['---'] : []),
                    {
                        opcode: 'costumeNamesInScope',
                        text: 'costume names in [SCOPE]',
                        arguments: {
                            SCOPE: {
                                menu: 'spriteScope',
                            },
                        },
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'spriteEffects',
                        text: 'sprite effects',
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'setSpriteEffectsToObject',
                        text: 'set sprite effects to [OBJECT]',
                        arguments: {
                            OBJECT: (vm.dogeiscutObject ? vm.dogeiscutObject.Argument : {})
                        },
                        extensions: ["colours_looks"],
                        hideFromPalette: !vm.dogeiscutObject,
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Sounds',
                    },
                    {
                        opcode: 'soundNamesInScope',
                        text: 'sound names in [SCOPE]',
                        arguments: {
                            SCOPE: {
                                menu: 'spriteScope',
                            },
                        },
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'soundsPlayingInScope',
                        text: 'sounds playing in [SCOPE]',
                        arguments: {
                            SCOPE: {
                                menu: 'spriteScope',
                            },
                        },
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'soundEffects',
                        text: 'sound effects',
                        extensions: ["colours_sounds"],
                        hideFromPalette: !vm.dogeiscutObject,
                        ...(vm.dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Events',
                    },
                    {
                        opcode: 'broadcastNames',
                        text: 'broadcast names',
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
                        text: 'running sprites',
                        extensions: ["colours_control"],
                        hideFromPalette: !(vm.jwArray && vm.jwTargets),
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'Sensing',
                    },
                    {
                        opcode: 'touchedColors',
                        text: 'touched colors',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'keysDowm',
                        text: 'keys down',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'keysHit',
                        text: 'keys hit',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    ...(vm.jwArray ? ['---'] : []),
                    {
                        opcode: 'fingersDown',
                        text: 'fingers down',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'fingersHit',
                        text: 'fingers hit',
                        extensions: ["colours_sensing"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'fingerPositions',
                        text: 'finger positions',
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
                        text: 'identity transform',
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
                    {
                        blockType: BlockType.LABEL,
                        text: 'Variables',
                    },
                    {
                        opcode: 'scopeVariables',
                        text: '[SCOPE] variables',
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
                        text: '[SCOPE] variable names',
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
                        text: '[SCOPE] lists',
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
                        text: '[SCOPE] list names',
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
                        text: 'arguments',
                        extensions: ["colours_more"],
                        hideFromPalette: !vm.jwArray,
                        ...(vm.jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'branches',
                        text: 'branches',
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
                    spriteScope: {
                        acceptReporters: false,
                        items: [{
                                text: 'sprite',
                                value: 'sprite'
                            },
                            {
                                text: 'project',
                                value: 'project'
                            }
                        ]
                    },
                }
            }
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);