// Name: Bezier Paths
// ID: dogeiscutBezierPath
// Description: Create optionally curved paths for sprites to follow
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) { 
        throw new Error("'Bezier Paths' must run unsandboxed!");   
    }

    // You can remove these as needed.
    const BlockType = Scratch.BlockType
    const BlockShape = Scratch.BlockShape
    const ArgumentType = Scratch.ArgumentType
    const TargetType = Scratch.TargetType
    const Cast = Scratch.Cast
    const vm = Scratch.vm;
    const runtime = Scratch.vm.runtime;
    const SB = ScratchBlocks;

    class BezierPathType { }
    
    // load vectors extension?
    
    class Extension {
        getInfo() {
            return {
                id: "dogeiscutBezierPath",
                name: "Bezier Paths",
                color1: "#9500b3",
                blocks: [],
                menus: {}
            }
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);