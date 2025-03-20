// Name: UndoRedo
// ID: dogeiscutundoredo
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

// make sure history is cleared on green flag press since the blocks need to exist for this to work since we store the id of each stack

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'UndoRedo\' must run unsandboxed!');
    }

    class UndoRedo {
        getInfo() {
            return {
                id: 'dogeiscutundoredo',
                name: 'UndoRedo',
                color1: "#794ddb",
                blocks: [
                    {
                        opcode: "createactionnamed",
                        text: 'create action named: [ACTION]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            ACTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my action 1"
                            },
                        }
                    },
                    '---',
                    {
                        opcode: "addasdodefinition",
                        text: ['add', 'as do definition'],
                        blockType: Scratch.BlockType.COMMAND,
                        branchCount: 1
                    },
                    {
                        opcode: "addasundodefinition",
                        text: ['add', 'as undo definition'],
                        blockType: Scratch.BlockType.COMMAND,
                        branchCount: 1
                    },
                    '---',
                    {
                        opcode: "commitaction",
                        text: 'commit action',
                        blockType: Scratch.BlockType.COMMAND
                    },
                    '---',
                    {
                        opcode: "undo",
                        text: 'undo',
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: "redo",
                        text: 'redo',
                        blockType: Scratch.BlockType.COMMAND
                    },
                    '---',
                    {
                        opcode: "historycount",
                        text: 'history count',
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "clearhistory",
                        text: 'clear history',
                        blockType: Scratch.BlockType.COMMAND
                    },
                    '---',
                    {
                        opcode: "setactionmergemode",
                        text: 'set action merge mode to [MODE]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'actionmergemodes'
                            },
                        }
                    },
                    {
                        opcode: "setbackwardsundooperationsmode",
                        text: 'set backwards undo operations mode to [MODE]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'truefalse'
                            },
                        }
                    },
                    {
                        opcode: "actionmergemode",
                        text: 'action merge mode',
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "backwardsundooperationsmode",
                        text: 'backwards undo operations mode',
                        blockType: Scratch.BlockType.REPORTER
                    },
                ],
                menus: {
                    actionmergemodes: {
                        acceptReporters: false,
                        items: [
                            {
                                text: 'disabled',
                                value: 'disabled',
                            },
                            {
                                text: 'merge only ends',
                                value: 'onlyends',
                            },
                            {
                                text: 'merge',
                                value: 'merge',
                            },
                        ]
                    },
                    truefalse: {
                        acceptReporters: true,
                        items: [
                            {
                                text: 'true',
                                value: 'true',
                            },
                            {
                                text: 'false',
                                value: 'false',
                            },
                        ]
                    }
                }
            }
        }
    }

    Scratch.extensions.register(new UndoRedo());
})(Scratch);