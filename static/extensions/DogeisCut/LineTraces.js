// Name: Line Traces
// ID: dogeiscutlinetraces
// Description: Cast line traces and gain multiple things of sprite information from them, filter the trace out for no unwanted results.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Line Traces\' must run unsandboxed!');
    }

    const lastTraceData = []
    const traceFilter = []

    class LineTraces {
        getInfo() {
            return {
                id: 'dogeiscutlinetraces',
                name: 'Line Traces',
                color1: "#ee4983",
                blocks: [
                    {
                        opcode: 'castLineTraceXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'cast line trace from x: [X] y: [Y] to x: [X2] y: [Y2]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                            Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
                        }
                    },
                    {
                        opcode: 'castLineTraceDistance',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'cast line trace from x: [X] y: [Y] to distance: [DIST] direction: [DIR]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                            DIR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 }
                        }
                    },
                    {
                        opcode: 'castLineTraceSprites',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'cast line trace from [SPRITE] to [OTHER_SPRITE]',
                        arguments: {
                            SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteListMyself' },
                            OTHER_SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteList' }
                        }
                    },
                    {
                        opcode: 'repeatLastTrace',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'repeat last trace'
                    },
                    '---',
                    {
                        opcode: 'getLastTraceHitData',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get last trace hit [HIT]\'s [DATA]',
                        arguments: {
                            HIT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            DATA: { type: Scratch.ArgumentType.STRING, menu: 'traceData'}
                        }
                    },
                    {
                        opcode: 'lastTraceHitCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'last trace hit count'
                    },
                    {
                        opcode: 'lastTraceHitAnything',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'last trace hit anything?'
                    },
                    '---',
                    {
                        opcode: 'addToTraceFilter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add [SPRITE] to next trace\'s filter',
                        arguments: {
                            SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteListMyself' }
                        }
                    },
                    {
                        opcode: 'setTraceFilter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set next trace filter to [ARRAY]',
                        arguments: {
                            ARRAY: { type: Scratch.ArgumentType.STRING, defaultValue: '[edge, Sprite1, Sprite2]' }
                        }
                    },
                    {
                        opcode: 'setTraceFilterStyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set next trace\'s filter to be treated as a [LISTTYPE]',
                        arguments: {
                            LISTTYPE: { type: Scratch.ArgumentType.STRING, menu: 'listTypes' }
                        }
                    },
                    {
                        opcode: 'filterSpriteByVariable',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'filter [SPRITE] from next trace if it\'s [VARIABLE] is [VALUE]',
                        arguments: {
                            SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteListMyself' },
                            VARIABLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'health' },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
                        }
                    }
                ],
                menus: {
                    traceData: {
                        acceptReporters: false,
                        items: [
                            { text: 'hit x', value: 'hitX' },
                            { text: 'hit y', value: 'hitY' },
                            { text: 'hit direction', value: 'hitDirection' },
                            { text: 'hit distance', value: 'hitDistance' },
                            { text: 'hit sprite name', value: 'hitSpriteName' },
                            { text: 'hit sprite iD', value: 'hitSpriteID' },
                            { text: 'start x', value: 'startX' },
                            { text: 'start y', value: 'startY' },
                            { text: 'end x', value: 'endX' },
                            { text: 'end y', value: 'endY' },
                            { text: 'start direction', value: 'startDirection' },
                            { text: 'start distance', value: 'startDistance' },
                            { text: 'filter ids', value: 'filterIDs' },
                            { text: 'filter names', value: 'filter' },
                            
                        ]
                    },
                    listTypes: {
                        acceptReporters: false,
                        items: [
                            { text: 'blacklist', value: 'blacklist' },
                            { text: 'whitelist', value: 'whitelist' }
                        ]
                    },
                    spriteListMyself: {
                        acceptReporters: true,
                        items: 'getSpriteListMyself'
                    },
                    spriteList: {
                        acceptReporters: true,
                        items: 'getSpriteList'
                    }
                }
            }
        }

        getSpriteListMyself() {
            const menu = [{text: "myself", value: "_myself_"}, {text: "mouse-pointer", value: "_mouse_"}, {text: "edge", value: "_edge_"}]
            for (const target of Scratch.vm.runtime.targets) {
                if (target.isStage) continue;
                menu.push({ text: target.getName(), value: target.id });
            }
            return menu
        }

        getSpriteList() {
            const menu = [{text: "mouse-pointer", value: "_mouse_"}, {text: "edge", value: "_edge_"}]
            for (const target of Scratch.vm.runtime.targets) {
                if (target.isStage) continue;
                menu.push({ text: target.getName(), value: target.id });
            }
            return menu
        }


    }

    Scratch.extensions.register(new LineTraces());
})(Scratch);