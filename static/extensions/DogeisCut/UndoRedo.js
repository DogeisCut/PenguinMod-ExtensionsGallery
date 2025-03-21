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

    const ActionMergeModes = {
        DISABLED: "disabled",
        MERGE_ONLY_ENDS: "merge only ends",
        MERGE: "merge"
    }
    const BackwardsUndoOperationModes = {
        ENABLED: "true",
        DISABLED: "false"
    }

    var history = [];
    var current_action = {};
    var current_step = -1;
    var action_merge_mode = ActionMergeModes.MERGE
    var backwards_undo_operations_mode = BackwardsUndoOperationModes.ENABLED

    const vm = Scratch.vm
    const runtime = vm.runtime

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
                                menu: 'actionmergemodes',
                                defaultValue: ActionMergeModes.MERGE
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
                                value: ActionMergeModes.DISABLED,
                            },
                            {
                                text: 'merge only ends',
                                value: ActionMergeModes.MERGE_ONLY_ENDS,
                            },
                            {
                                text: 'merge',
                                value: ActionMergeModes.MERGE,
                            },
                        ]
                    },
                    truefalse: {
                        acceptReporters: true,
                        items: [
                            {
                                text: 'true',
                                value: BackwardsUndoOperationModes.ENABLED,
                            },
                            {
                                text: 'false',
                                value: BackwardsUndoOperationModes.DISABLED,
                            },
                        ]
                    }
                }
            }
        }

        createactionnamed(args, util) {
            current_action = {
                name: args.ACTION
            }
        }

        addasdodefinition(args, util) {
            current_action.doStartId = util.thread.blockContainer.getBranch(util.thread.peekStack(), 0)
        }

        addasundodefinition(args, util) {
            current_action.undoStartId = util.thread.blockContainer.getBranch(util.thread.peekStack(), 0)
        }

        commitaction(args, util) {
            if (Object.keys(current_action).length != 0) {
                history.push(current_action)
                current_step += 1
                runtime._pushThread(current_action.doStartId, util.target)
                current_action = {}
            }
        }

        undo(args, util) {
            if (current_step >= 0) {
                runtime._pushThread(history[current_step].undoStartId, util.target)
                current_step -= 1
            }
        }

        redo(args, util) {
            if (current_step+1 < history.length) {
                current_step += 1
                runtime._pushThread(history[current_step].doStartId, util.target)
            }
        }

        historycount(args, util) {
            return history.length;
        }

        clearhistory(args, util) {
            current_step = -1;
            history = [];
        }
    }

    Scratch.extensions.register(new UndoRedo());
})(Scratch);