// Name: MetaBlocks
// ID: dogeiscutmetablocks
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

// TODO:
// - Block: get input () from block {}
// - Block: get [color... or whatever v] from opcode ()

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'MetaBlocks\' must run unsandboxed!');
    }

    class MetaBlocks {
        getInfo() {
            return {
                id: 'dogeiscutmetablocks',
                name: 'MetaBlocks',
                color1: "#907f7f",
                blocks: [
                    {
                        opcode: 'getscriptasjson',
                        text: ['get script', 'as json'],
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        disableMonitor: true,
                        branches: [
                            {}
                        ],
                    },
                    // Returns things like the hex color, category, etc. of each block.
                    // although maybe i can just put that in the above block or as a seperate "get [ v] from opcode [OPCODE]"
                    {
                        opcode: 'getscriptblockinfo',
                        text: ['get script block info', 'as json'],
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        hideFromPalette: true,
                        disableMonitor: true,
                        branches: [
                          {}
                        ],
                    },
                    {
                        opcode: 'asreporter',
                        text: 'as reporter [REPORTER]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            REPORTER: {
                                type: null,
                            },
                        }
                    },
                    '---',
                    {
                        opcode: 'runblockfromopcode',
                        text: 'run block from opcode [OPCODE] with args [ARGS]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            OPCODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "motion_movesteps"
                            },
                            ARGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "{\"STEPS\": 10}"
                            }
                        }
                    },
                    {
                        opcode: 'runblockfromopcodereporter',
                        text: 'run block from opcode [OPCODE] with args [ARGS]',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        arguments: {
                            OPCODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "operator_random"
                            },
                            ARGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "{\"FROM\": 1, \"TO\": 10}"
                            }
                        }
                    },
                ]
            }
        }

        /* helper functions */

        getBlockContents(util) {
            const firstBlockInStackID = util.thread.blockContainer.getBranch(util.thread.peekStack(), 0);
            const functionData = [];
            let currentBlockId = firstBlockInStackID;

            while (currentBlockId) {
            const block = util.target.blocks.getBlock(currentBlockId);

            if (block.opcode === 'dogeiscutmetablocks_asreporter') {
                for (const inputName in block.inputs) {
                const input = this.getInputData(block.inputs[inputName], util);
                if (input) {
                    functionData.push(input);
                }
                }
            } else {
                const blockData = { "opcode": block.opcode, "inputs": {}, "id": block.id };

                for (const inputName in block.inputs) {
                const input = block.inputs[inputName];
                blockData.inputs[inputName] = this.getInputData(input, util);
                }

                functionData.push(blockData);
            }

            currentBlockId = block.next;
            }

            return functionData;
        }
      
          getInputData(input, util) {
            if (input.block) {
              const block = util.target.blocks.getBlock(input.block);
            if (block.shadow) {
              return this.getShadowValue(block);
            } else {
              return {
              opcode: block.opcode,
              inputs: this.getBlockInputs(block, util),
              id: block.id
              };
            }
            } else if (input.shadow) {
            return this.getShadowValue(util.target.blocks.getBlock(input.shadow));
            } else {
            return null;
            }
          }
      
          getShadowValue(block) {
            return block.fields ? block.fields[Object.keys(block.fields)[0]].value : null;
          }
      
          getBlockInputs(block, util) {
            const inputs = {};
            for (const inputName in block.inputs) {
            const input = block.inputs[inputName];
            inputs[inputName] = this.getInputData(input, util);
            }
            return inputs;
          }
      
          call(util, definition, originalDefinition = definition) {
            if (typeof definition === 'string') {
            definition = JSON.parse(definition);
            }
            for (let blockData of definition["functionData"]) {
            const inputs = {};
            for (let [inputName, input] of Object.entries(blockData.inputs)) {
              if (input.opcode) {
              inputs[inputName] = this.call(util, { functionData: [input], arguments: definition.arguments, prototype: definition.prototype  }, originalDefinition);
              } else {
              inputs[inputName] = input;
              }
            }
            if (blockData.opcode === "procedures_return") {
              return inputs.return;
              }
              if (blockData.opcode === "dogeiscutfirstclassdefines_argument") {
              return definition.arguments[blockData.inputs.NAME] || "";
              }
              if (blockData.opcode === "dogeiscutfirstclassdefines_this") {
                return originalDefinition;
              }
            const opcodeFunction = Scratch.vm.runtime.getOpcodeFunction(blockData.opcode);
            if (opcodeFunction) {
              const output = opcodeFunction(inputs, util);
              if (output) {
              return output;
              }
            }
            }
        }

        /* blocks */
        
        getscriptasjson(args, util) {
            return JSON.stringify(this.getBlockContents(util));
        }
        
        getscriptblockinfo(args, util) {
        }

        runblockfromopcode(args, util) {
            Scratch.vm.runtime.getOpcodeFunction(args.OPCODE)(JSON.parse(args.ARGS), util)
        }

        runblockfromopcodereporter(args, util) {
            return Scratch.vm.runtime.getOpcodeFunction(args.OPCODE)(JSON.parse(args.ARGS), util)
        }

        asreporter(args, util) {
            
        }
    }

    Scratch.extensions.register(new MetaBlocks());
})(Scratch);