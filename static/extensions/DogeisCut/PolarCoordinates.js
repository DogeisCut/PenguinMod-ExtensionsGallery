// Name: Polar Coordinates
// ID: dogeiscutpolarcoordinates
// Description: Use the polar coordinates instead of the cartesian coordinate system for sprites and location.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

// Version V.0.1.0

// Currently very broken

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Polar Coordinates\' must run unsandboxed!');
    }

    class PolarCoordinates {
        getInfo() {
            return {
                id: 'dogeiscutpolarcoordinates',
                name: 'Polar Coordinates',
                color1: "#337fd1",
                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Motion"
                    },
                    {
                        opcode: "motion_gotorθ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "go to r: [r] θ: [θ]",
                        extensions: ["colours_motion"],
                        arguments: {
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "motion_changebyrθ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change by r: [r] θ: [θ]",
                        extensions: ["colours_motion"],
                        arguments: {
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    '---',
                    {
                        opcode: "motion_glidesecstorθ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "glide [SECS] secs to r: [r] θ: [θ]",
                        extensions: ["colours_motion"],
                        arguments: {
                            SECS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    '---',
                    {
                        opcode: "motion_pointtowardsrθ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "point towards r: [r] θ: [θ]",
                        extensions: ["colours_motion"],
                        arguments: {
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    '---',
                    {
                        opcode: "motion_changerby",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change r by [r]",
                        extensions: ["colours_motion"],
                        arguments: {
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                        }
                    },
                    {
                        opcode: "motion_setr",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set r to [r]",
                        extensions: ["colours_motion"],
                        arguments: {
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                        }
                    },
                    {
                        opcode: "motion_changeθby",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change θ by [θ]",
                        extensions: ["colours_motion"],
                        arguments: {
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                        }
                    },
                    {
                        opcode: "motion_setθ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set θ to [θ]",
                        extensions: ["colours_motion"],
                        arguments: {
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                        }
                    },
                    '---',
                    {
                        opcode: "motion_rposition",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "r position",
                        extensions: ["colours_motion"]
                    },
                    {
                        opcode: "motion_θposition",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "θ position",
                        extensions: ["colours_motion"]
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Sensing"
                    },
                    {
                        opcode: "sensing_mouser",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "mouse r",
                        extensions: ["colours_sensing"]
                    },
                    {
                        opcode: "sensing_mouseθ",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "mouse θ",
                        extensions: ["colours_sensing"]
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Operators"
                    },
                    {
                        opcode: "operator_convertxytor",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "convert x: [X] y: [Y] to [AXIS]",
                        extensions: ["colours_operators"],
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "polarcoordinateslist",
                            },
                        }
                    },
                    {
                        opcode: "operator_convertxytoθ",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "convert r: [r] θ: [θ] to [AXIS]",
                        extensions: ["colours_operators"],
                        arguments: {
                            r: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            θ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "cartesiancoordinateslist",
                            },
                        }
                    },
                ],
                menus: {
                    polarcoordinateslist: {
                        acceptReporters: false,
                        items: [
                        {
                            text: "r",
                            value: "radius",
                        },
                        {
                            text: "θ",
                            value: "theta",
                        },
                        ],
                    },
                    cartesiancoordinateslist: {
                        acceptReporters: false,
                        items: [
                        {
                            text: "x",
                            value: "x",
                        },
                        {
                            text: "y",
                            value: "y",
                        },
                        ],
                    },
                }
            }
        }

        /* helper functions */
        _polarToCartesian(r, θ) {
            const radians = (((θ*-1)+90) * Math.PI) / 180;
            return {
            x: r * Math.cos(radians),
            y: r * Math.sin(radians)
            };
        }

        _cartesianToPolar(x, y) {
            return {
            r: Math.sqrt(x ** 2 + y ** 2),
            θ: (((Math.atan2(y, x) * 180) / Math.PI) * -1) - 90
            };
        }

        /* blocks */

        motion_gotorθ(args, util) {
            const r = Scratch.Cast.toNumber(args.r);
            const θ = Scratch.Cast.toNumber(args.θ);
            const { x, y } = this._polarToCartesian(r, θ);
            util.target.setXY(x, y);
        }

        motion_changebyrθ(args, util) {
            const r = Scratch.Cast.toNumber(args.r);
            const θ = Scratch.Cast.toNumber(args.θ);
            const { x: deltaX, y: deltaY } = this._polarToCartesian(r, θ);
            util.target.setXY(util.target.x + deltaX, util.target.y + deltaY);
        }

        motion_glidesecstorθ(args, util) {
            const secs = args.SECS;
            const r = Scratch.Cast.toNumber(args.r);
            const θ = Scratch.Cast.toNumber(args.θ);
            const { x, y } = this._polarToCartesian(r, θ);

            if (util.stackFrame.timer) {
            const elapsed = util.stackFrame.timer.timeElapsed();
            if (elapsed < 1e3 * util.stackFrame.duration) {
                const progress = elapsed / (1e3 * util.stackFrame.duration);
                const deltaX = progress * (util.stackFrame.endX - util.stackFrame.startX);
                const deltaY = progress * (util.stackFrame.endY - util.stackFrame.startY);
                util.target.setXY(util.stackFrame.startX + deltaX, util.stackFrame.startY + deltaY);
                util.yield();
            } else {
                util.target.setXY(util.stackFrame.endX, util.stackFrame.endY);
            }
            } else {
            util.stackFrame.timer = new Scratch.Timer();
            util.stackFrame.timer.start();
            util.stackFrame.duration = secs;
            util.stackFrame.startX = util.target.x;
            util.stackFrame.startY = util.target.y;
            util.stackFrame.endX = x;
            util.stackFrame.endY = y;
            if (util.stackFrame.duration <= 0) {
                util.target.setXY(util.stackFrame.endX, util.stackFrame.endY);
            } else {
                util.yield();
            }
            }
            return util.target.glide(secs, x, y);
        }

        motion_pointtowardsrθ(args, util) {
            const r = Scratch.Cast.toNumber(args.r);
            const θ = Scratch.Cast.toNumber(args.θ);
            const { x, y } = this._polarToCartesian(r, θ);
            const dx = x - util.target.x;
            const dy = y - util.target.y;
            const direction = (Math.atan2(dy, dx) * 180) / Math.PI;
            util.target.setDirection(direction);
        }

        motion_changerby(args, util) {
            const r = Scratch.Cast.toNumber(args.r);
            const { r: currentR, θ: currentθ } = this._cartesianToPolar(util.target.x, util.target.y);
            const newR = currentR + r;
            const { x, y } = this._polarToCartesian(newR, currentθ);
            util.target.setXY(x, y);
        }

        motion_setr(args, util) {
            const r = Scratch.Cast.toNumber(args.r);
            const { θ: currentθ } = this._cartesianToPolar(util.target.x, util.target.y);
            const { x, y } = this._polarToCartesian(r, currentθ);
            util.target.setXY(x, y);
        }

        motion_changeθby(args, util) {
            const θ = Scratch.Cast.toNumber(args.θ);
            const { r: currentR, θ: currentθ } = this._cartesianToPolar(util.target.x, util.target.y);
            const newθ = currentθ + θ;
            const { x, y } = this._polarToCartesian(currentR, newθ);
            util.target.setXY(x, y);
        }

        motion_setθ(args, util) {
            const θ = Scratch.Cast.toNumber(args.θ);
            const { r: currentR } = this._cartesianToPolar(util.target.x, util.target.y);
            const { x, y } = this._polarToCartesian(currentR, θ);
            util.target.setXY(x, y);
        }

        motion_rposition(args, util) {
            const { r } = this._cartesianToPolar(util.target.x, util.target.y);
            return r;
        }

        motion_θposition(args, util) {
            const { θ } = this._cartesianToPolar(util.target.x, util.target.y);
            return θ;
        }

        sensing_mouser(args, util) {
            const mouseX = Scratch.vm.runtime.ioDevices.mouse.getScratchX();
            const mouseY = Scratch.vm.runtime.ioDevices.mouse.getScratchY();
            const { r } = this._cartesianToPolar(mouseX, mouseY);
            return r;
        }

        sensing_mouseθ(args, util) {
            const mouseX = Scratch.vm.runtime.ioDevices.mouse.getScratchX();
            const mouseY = Scratch.vm.runtime.ioDevices.mouse.getScratchY();
            const { θ } = this._cartesianToPolar(mouseX, mouseY);
            return θ;
        }

        operator_convertxytor(args) {
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            if (args.AXIS === 'radius') {
            return this._cartesianToPolar(x, y).r;
            } else if (args.AXIS === 'theta') {
            return this._cartesianToPolar(x, y).θ;
            }
            return 0;
        }

        operator_convertxytoθ(args) {
            const r = Scratch.Cast.toNumber(args.r);
            const θ = Scratch.Cast.toNumber(args.θ);
            const { x, y } = this._polarToCartesian(r, θ);
            if (args.AXIS === 'x') {
            return x;
            } else if (args.AXIS === 'y') {
            return y;
            }
            return 0;
        }
    }

    Scratch.extensions.register(new PolarCoordinates());
})(Scratch);