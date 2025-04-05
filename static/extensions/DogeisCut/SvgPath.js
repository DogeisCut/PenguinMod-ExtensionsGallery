// Name: Svg Paths
// ID: dogeiscutsvgpath
// Description: Allows you to create and manipulate SVG paths. You can create paths, add lines, and check if a path is valid, etc. This extension is useful for creating custom graphics and animations in projects.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

// TODO: Append arguments to existing commands if they are the same type or support each other instead of adding a new command. (e.g. coordinates for move and line commands)
// TODO: Validation for commands that have specific requirements (e.g. a shorhand curve command must follow a quadratic bezier curve command or additional shorthand curve)
// TODO: jwArray Support
// TODO: cast all arguments
// TODO: make translation blocks actually work properly :sobbing:
// TODO: look into using https://github.com/Yqnn/svg-path-editor

(function (Scratch) {
    'use strict';

    //const COLOR = "#d1b0e3"
    const COLOR = "#cc44aa"

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'wrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    function pathImage(pathData, fill = COLOR, stroke = "black", strokeWidth = 0.1, padding = 4, maxDimensions = 150) {
        let path = pathData
        let img = document.createElement('img')
        img.style.maxWidth = `${maxDimensions}px`
        img.style.maxHeight = `${maxDimensions}px`
        img.style.width = '100%'
        img.style.margin = 'auto'
        img.style.display = 'block'
        img.style.pointerEvents = 'none';

        var svgXMLNoViewBox = `
        <svg xmlns="http://www.w3.org/2000/svg" >
            <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` 

        function calculateViewBox(svgString, padding = 4) {
            let d = document.createElement("div")
            d.innerHTML = svgString
            document.body.appendChild(d)
            let r = d.firstElementChild.getBBox() 
            document.body.removeChild(d);
            return `${r.x - padding} ${r.y - padding} ${r.width + padding * 2} ${r.height + padding * 2}`
        }

        var svgXML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${calculateViewBox(svgXMLNoViewBox, padding)}" >
            <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` 
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXML)

        return img
    }

    // Thanks to https://javascript.plainenglish.io/june-3-parsing-and-validating-svg-paths-with-regex-7bd0e245115 for this parser code
    const validFlagEx = /^[01]/;
    const commaEx = /^(([\t\n\f\r\s]+,?[\t\n\f\r\s]*)|(,[\t\n\f\r\s]*))/;
    const validCommandEx = /^[\t\n\f\r\s]*([achlmqstvz])[\t\n\f\r\s]*/i;
    const validCoordinateEx = /^[+-]?((\d*\.\d+)|(\d+\.)|(\d+))(e[+-]?\d+)?/i;
    class SvgPathParser {
        static validCommand = /^[\t\n\f\r\s]*([achlmqstvz])[\t\n\f\r\s]*/i;
        static validFlag = /^[01]/;
        static validCoordinate = /^[+-]?((\d*\.\d+)|(\d+\.)|(\d+))(e[+-]?\d+)?/i;
        static validComma = /^(([\t\n\f\r\s]+,?[\t\n\f\r\s]*)|(,[\t\n\f\r\s]*))/;
        static pathGrammar = {
              z: [],
              h: [ validCoordinateEx ],
              v: [ validCoordinateEx ],
              m: [ validCoordinateEx, validCoordinateEx ],
              l: [ validCoordinateEx, validCoordinateEx ],
              t: [ validCoordinateEx, validCoordinateEx ],
              s: [ validCoordinateEx, validCoordinateEx, validCoordinateEx, validCoordinateEx ],
              q: [ validCoordinateEx, validCoordinateEx, validCoordinateEx, validCoordinateEx ],
              c: [ validCoordinateEx, validCoordinateEx, validCoordinateEx, validCoordinateEx, validCoordinateEx, validCoordinateEx ],
              a: [ validCoordinateEx, validCoordinateEx, validCoordinateEx, validFlagEx, validFlagEx, validCoordinateEx, validCoordinateEx ],
        };
           static parseRaw( path ) {
            let cursor = 0, parsedComponents = [];
            while ( cursor < path.length ) {
         const match = path.slice( cursor ).match( this.validCommand );
               if ( match !== null ) {
                  const command = match[ 1 ];
                  cursor += match[ 0 ].length;
                  const componentList = SvgPathParser.parseComponents( command, path, cursor );
                  cursor = componentList[ 0 ];
                  parsedComponents = [ ...parsedComponents, ...componentList[1] ];
               } else {
         throw new Error(  `Invalid path: first error at char ${ cursor }`  );
               }
            }
            return parsedComponents;
         }
         static parseComponents( type, path, cursor ) {
            const expectedCommands = this.pathGrammar[ type.toLowerCase() ];
            const components = [];
            while ( cursor <= path.length ) {
               const component = [ type ];
               for ( const regex of expectedCommands ) {
                  const match = path.slice( cursor ).match( regex );
                  if ( match !== null ) {
                     component.push( parseInt( match[ 0 ] ) );
                     cursor += match[ 0 ].length;
                     const nextSlice = path.slice( cursor ).match( this.validComma );
                     if ( nextSlice !== null ) cursor += nextSlice[ 0 ].length;
                  } else if ( component.length === 1 ) {
                     return [ cursor, components ];
                  } else {
                     throw new Error( `Invalid path: first error at char ${ cursor }` );
                  }
               }
               components.push( component );
               if ( expectedCommands.length === 0 ) return [ cursor, components ];
               if ( type === 'm' ) type = 'l';
               if ( type === 'M' ) type = 'L';
            }
            throw new Error( `Invalid path: first error at char ${ cursor }` );
         }
    }

    class dogeiscutSvgPathType {
        customId = "dogeiscutsvgpath";

        path = 'M0 0';

        constructor(path = 'M0 0') {
            this.path = path;
            path = path.trim().replace(/,/g, ' ')
            if (!dogeiscutSvgPathType.isValidSVGPath(path)) {
                this.path = 'M0 0'
            }
        }

        static isValidSVGPath(pathString) {
            try {
                let path = pathString.trim().replace(/,/g, ' ')
                let parsedPath = SvgPathParser.parseRaw(path)
                return parsedPath.length > 0
            } catch (e) {
                return false
            }
        }

        static toSvgPath(pathString) {
            if (pathString instanceof dogeiscutSvgPathType) {
                return pathString
            }
            if (dogeiscutSvgPathType.isValidSVGPath(pathString)) {
                return new dogeiscutSvgPathType(pathString.trim().replace(/,/g, ' '))
            }
            return new dogeiscutSvgPathType('M0 0');
        }

        toString() {
            return this.path;
        }
        toMonitorContent() {
            try {
                let path = this.path

                let root = document.createElement('div')
                root.style.display = 'flex'
                root.style.flexDirection = 'column'
                root.style.justifyContent = 'center'
    
                const img = pathImage(path, "transparent", "white", 2, 2, 150/3)
                root.appendChild(img)

                return root
            } catch {
                console.error('Error creating path')
                console.error(e)
                return span("Bad Path")
            }
        }
        toReporterContent() {
            try {
                // const svgns = "http://www.w3.org/2000/svg";
                let path = this.path

                let root = document.createElement('div')
                root.style.display = 'flex'
                root.style.flexDirection = 'column'
                root.style.justifyContent = 'center'

                // let svg = document.createElement('svg')

                // svg.setAttribute('xmlns', svgns)
                // svg.style.height = '150px'
                // svg.style.width = '150px'
                // svg.style.margin = 'auto'
                // svg.style.display = 'block'

                // root.appendChild(svg)

                // let pathEl = document.createElementNS(svgns, 'path')

                // pathEl.setAttribute('d', path)
                // pathEl.setAttribute('fill', '#d1b0e3')
                // pathEl.setAttribute('stroke', 'black')
                // pathEl.setAttribute('stroke-width', '1')
                // pathEl.setAttribute('stroke-linecap', 'round')
                // pathEl.setAttribute('stroke-linejoin', 'round')

                // svg.appendChild(pathEl)
                // let pathBoundingBox = pathEl.getBBox()
                // console.log(pathBoundingBox)
                // let padding = 4
                // let viewBoxWidth = pathBoundingBox.width + padding * 2
                // let viewBoxHeight = pathBoundingBox.height + padding * 2
                // let viewBoxX = pathBoundingBox.x - padding
                // let viewBoxY = pathBoundingBox.y - padding
                // svg.setAttribute('viewbox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`)


                // using elements was giving me some troubles, so we are using this method instead

                const img = pathImage(path)
                root.appendChild(img)

                root.appendChild(span(`Path: ${this.path}`))

                return root
            } catch {
                console.error('Error creating path')
                console.error(e)
                return span("Bad Path")
            }
        }

        get path() {
            return this.path;
        }

        set path(path) {
            if (dogeiscutSvgPathType.isValidSVGPath(path)) {
                this.path = path.trim().replace(/,/g, ' ')
            } else {
                this.path = 'M0 0'
            }
        }
    }

    const dogeiscutSvgPath = {
        Type: dogeiscutSvgPathType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            forceOutputType: "Svg Path",
            disableMonitor: true
        },
        Argument: {
            check: ["Svg Path"]
        }
    }

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Svg Paths\' must run unsandboxed!');
    }

    class Extension {
        constructor() {
            Scratch.vm.dogeiscutSvgPath = dogeiscutSvgPath
            Scratch.vm.runtime.registerSerializer(
                "dogeiscutsvgpath",
                v => v.path,
                v => new dogeiscutSvgPathType(v)
            );
        }

        getInfo() {
            return {
                id: 'dogeiscutsvgpath',
                name: 'Svg Paths',
                color1: COLOR,
                blocks: [
                    {
                        opcode: 'empty',
                        text: 'empty path',
                        ...dogeiscutSvgPath.Block,
                    },
                    {
                        opcode: 'emptyat',
                        text: 'empty path starting at x: [X] y: [Y]',
                        ...dogeiscutSvgPath.Block,
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            }
                        }
                    },
                    {
                        opcode: 'fromstring',
                        text: '[STRING] as path',
                        arguments: {
                            STRING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'M 0 10 L 10 20 L 20 10 L 10 0 Z',
                            }
                        },
                        ...dogeiscutSvgPath.Block,
                    },
                    '---',
                    {
                        opcode: 'preset',
                        text: 'preset [DROPDOWN]',
                        ...dogeiscutSvgPath.Block,
                        arguments: {
                            DROPDOWN: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'presets',
                            }
                        }
                    },
                    {
                        opcode: 'generatepolygon',
                        text: 'polygon with [SIDES] sides and radius [RADIUS]',
                        ...dogeiscutSvgPath.Block,
                        arguments: {
                            SIDES: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            },
                            RADIUS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        }
                    },
                    '---',
                    {
                        opcode: 'isvalid',
                        text: 'is [STRING] a path?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            STRING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'M 0 10 L 10 20 L 20 10 L 10 0 Z',
                            }
                        },
                    },
                    {
                        opcode: 'tostring',
                        text: '[PATH] as string',
                        hideFromPalette: true, // turns out this block is not needed 
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    '---',
                    {
                        opcode: 'addonecoordinate',
                        text: 'add [ABSREL] [HV] line to pos: [TO] in [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            ABSREL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'absoluteorrelative',
                            },
                            HV: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'horizontalorvertical',
                            },
                            TO: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        opcode: 'addtwocoordinate',
                        text: 'add [ABSREL] [MLT] to x: [X] y: [Y] in [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            ABSREL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'absoluteorrelative',
                            },
                            MLT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'moveorlineorshorthandquadraticbeziercurve',
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        opcode: 'addfourcoordinate',
                        text: 'add [ABSREL] [SQ] curve to curve x: [CURVEX] curve y: [CURVEY] x: [X] y: [Y] in [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            ABSREL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'absoluteorrelative',
                            },
                            SQ: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'shorthandcurveorquadraticbeziercurve',
                            },
                            CURVEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            CURVEY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        opcode: 'addsixcoordinate',
                        text: 'add [ABSREL] curve to start curve x: [CURVEX] start curve y: [CURVEY] end curve x: [ENDCURVEX] end curve y: [ENDCURVEY] x: [X] y: [Y] in [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            ABSREL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'absoluteorrelative',
                            },
                            CURVEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            CURVEY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            ENDCURVEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            ENDCURVEY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        opcode: 'addelipticalarc',
                        text: 'add [ABSREL] elliptical arc x: [X] y: [Y] radius x: [RX] radius y: [RY] rotation: [ROTATION] large arc: [LARGEARC] sweep: [SWEEP] in [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            ABSREL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'absoluteorrelative',
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            RX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            RY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            ROTATION: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            LARGEARC: {
                                type: Scratch.ArgumentType.BOOLEAN
                            },
                            SWEEP: {
                                type: Scratch.ArgumentType.BOOLEAN
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        xml: `
                        <block type="dogeiscutsvgpath_addonecoordinate">
                            <value name="ABSREL">
                                <shadow type="dogeiscutsvgpath_menu_absoluteorrelative">
                                    <field name="absoluteorrelative">absolute</field>
                                </shadow>
                            </value>
                            <value name="HV">
                                <shadow type="dogeiscutsvgpath_menu_horizontalorvertical">
                                    <field name="horizontalorvertical">horizontal</field>
                                </shadow>
                            </value>
                            <value name="TO">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_addtwocoordinate">
                            <value name="ABSREL">
                                <shadow type="dogeiscutsvgpath_menu_absoluteorrelative">
                                    <field name="absoluteorrelative">absolute</field>
                                </shadow>
                            </value>
                            <value name="MLT">
                                <shadow type="dogeiscutsvgpath_menu_moveorlineorshorthandquadraticbeziercurve">
                                    <field name="moveorlineorshorthandquadraticbeziercurve">move</field>
                                </shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_addfourcoordinate">
                            <value name="ABSREL">
                                <shadow type="dogeiscutsvgpath_menu_absoluteorrelative">
                                    <field name="absoluteorrelative">absolute</field>
                                </shadow>
                            </value>
                            <value name="SQ">
                                <shadow type="dogeiscutsvgpath_menu_shorthandcurveorquadraticbeziercurve">
                                    <field name="shorthandcurveorquadraticbeziercurve">shorthand</field>
                                </shadow>
                            </value>
                            <value name="CURVEX">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="CURVEY">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_addsixcoordinate">
                            <value name="ABSREL">
                                <shadow type="dogeiscutsvgpath_menu_absoluteorrelative">
                                    <field name="absoluteorrelative">absolute</field>
                                </shadow>
                            </value>
                            <value name="CURVEX">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="CURVEY">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="ENDCURVEX">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="ENDCURVEY">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_addelipticalarc">
                            <value name="ABSREL">
                                <shadow type="dogeiscutsvgpath_menu_absoluteorrelative">
                                    <field name="absoluteorrelative">absolute</field>
                                </shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="RX">
                                <shadow type="math_number">
                                    <field name="NUM">1</field>
                                </shadow>
                            </value>
                            <value name="RY">
                                <shadow type="math_number">
                                    <field name="NUM">1</field>
                                </shadow>
                            </value>
                            <value name="ROTATION">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="LARGEARC">
                                <shadow type="dogeiscutsvgpath_menu_trueorfalse">
                                    <field name="TRUEFALSE">false</field>
                                </shadow>
                            </value>
                            <value name="SWEEP">
                                <shadow type="dogeiscutsvgpath_menu_trueorfalse">
                                    <field name="TRUEFALSE">false</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                        </block>`
                    },
                    '---',
                    {
                        opcode: 'commands',
                        text: 'command amount in [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        opcode: 'commandatindex',
                        text: 'command at position [INDEX] in [PATH]',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        opcode: 'removecommand',
                        text: 'remove command at position [INDEX] from [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        }
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        hideFromPalette: true, // kinda useless tbh
                        xml: `
                        <block type="dogeiscutsvgpath_commands">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_commandatindex">
                            <value name="INDEX">
                                <shadow type="math_number">
                                    <field name="NUM">1</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_removecommand">
                            <value name="INDEX">
                                <shadow type="math_number">
                                    <field name="NUM">1</field>
                                </shadow>
                            </value>
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                        </block>`
                    },
                    //'---',
                    {
                        opcode: 'translate',
                        text: 'translate [PATH] by x: [X] y: [Y]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true, // unfinished block
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            }
                        }
                    },
                    {
                        opcode: 'rotateclockwise',
                        text: 'rotate [PATH] [IMG] [ROT] degrees around x: [X] y: [Y]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true, // unfinished block
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                            IMG: {
                                type: Scratch.ArgumentType.IMAGE,
                                dataURI: `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMS4yNjE4MSIgaGVpZ2h0PSIyMC4wMzE0NSIgdmlld0JveD0iMCwwLDIxLjI2MTgxLDIwLjAzMTQ1Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI5Ljc0MDMzLC0xNzAuMjI5OTkpIj48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTI1MC42OCwxODAuMmMtMC4zMDIxMiwwLjM5NjMyIC0wLjc3MTY2LDAuNjI5MjQgLTEuMjcsMC42M2gtNy42OWMtMC41OTUyNywtMC4wMzA5MiAtMS4xMjMyNSwtMC4zOTIxOSAtMS4zNjc2OSwtMC45MzU4NWMtMC4yNDQ0MywtMC41NDM2NSAtMC4xNjQyNiwtMS4xNzgzNiAwLjIwNzY5LC0xLjY0NDE1bDEuMTIsLTEuNDFjLTAuOTI2ODEsLTAuNjEwNTEgLTIuMDM1OSwtMC44ODI0OCAtMy4xNCwtMC43N2MtMC43MjM2MywwLjA5MzA5IC0xLjQxMTc5LDAuMzY4MzUgLTIsMC44Yy0wLjU5MDAxLDAuNDQ5ODIgLTEuMDUxOTksMS4wNDYyNiAtMS4zNCwxLjczYy0wLjU4MDQ0LDEuNTM2MzggLTAuMzc5MTEsMy4yNTg5IDAuNTQsNC42MmMwLjk0OTQsMS40NTgyOCAyLjUyNDc1LDIuMzkwMTggNC4yNiwyLjUydjBjMS4yNDgxNiwwLjA0NDE4IDIuMjI0MTgsMS4wOTE4NCAyLjE4LDIuMzRjLTAuMDQ0MTgsMS4yNDgxNiAtMS4wOTE4NCwyLjIyNDE4IC0yLjM0LDIuMThjLTMuMjE5MjUsLTAuMDY4ODkgLTYuMjE5MDEsLTEuNjQ2NTQgLTguMSwtNC4yNmMtMS45NjY3MiwtMi42NDgwNSAtMi41MjI1MiwtNi4wODcyNSAtMS40OSwtOS4yMmMwLjU2NDEzLC0xLjYwNDIxIDEuNTQwMDgsLTMuMDMxOTIgMi44MywtNC4xNGMxLjMxNjI0LC0xLjA5Njg5IDIuODk0MTQsLTEuODM0MTYgNC41OCwtMi4xNGMyLjY5MzUzLC0wLjQ0OTQ5IDUuNDU2ODQsMC4xNTE4NSA3LjcyLDEuNjhsMS4wOCwtMS4zNWMwLjI5ODg0LC0wLjM4MDMzIDAuNzU2MzEsLTAuNjAxNjkgMS4yNCwtMC42YzAuNzI5MDYsMC4wMDUzNiAxLjM2MjMxLDAuNTAyOSAxLjU0LDEuMjFsMS43LDcuMzdjMC4xMzg3MSwwLjQ3ODM1IDAuMDQyMjQsMC45OTQxMyAtMC4yNiwxLjM5eiIgZmlsbC1vcGFjaXR5PSIwLjIiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMjQ5LjM4LDE3OS44M2gtNy42MWMtMC4yMzc4NCwwLjAwMjMyIC0wLjQ1MzgyLC0wLjEzODQgLTAuNTQ3NzgsLTAuMzU2OTFjLTAuMDkzOTYsLTAuMjE4NTEgLTAuMDQ3NTIsLTAuNDcyMDcgMC4xMTc3OCwtMC42NDMwOWwxLjc1LC0yLjE5Yy0xLjI1ODU4LC0xLjE5MTM4IC0yLjk3NzMyLC0xLjc2OTE3IC00LjcsLTEuNThjLTEuODQ4MDMsMC4yMjIxMSAtMy40MjU3NiwxLjQzOSAtNC4xMSwzLjE3Yy0wLjY4Njc5LDEuODUyNTggLTAuNDE3NTEsMy45MjQ1MiAwLjcyLDUuNTRjMS4xMTgyNiwxLjcwMTc1IDIuOTY4MzgsMi43ODIyMiA1LDIuOTJjMC43MjM0OSwwLjAyMjA5IDEuMjkyMDksMC42MjY1MSAxLjI3LDEuMzVjLTAuMDIyMDksMC43MjM0OSAtMC42MjY1MSwxLjI5MjA5IC0xLjM1LDEuMjdjLTIuOTEzMTIsLTAuMDUxNyAtNS42MzM2NCwtMS40NjU2MyAtNy4zNSwtMy44MmMtMS44MDg4NiwtMi4zOTI1MyAtMi4zMzE4MiwtNS41MTkwNiAtMS40LC04LjM3YzAuNDk3MTcsLTEuNDQ1NjMgMS4zNzQ1NywtMi43MzA2NSAyLjU0LC0zLjcyYzEuMTc3NjUsLTAuOTg5NzggMi41OTUxOCwtMS42NTE5OCA0LjExLC0xLjkyYzIuNzYwOTMsLTAuNDU5MiA1LjU4NTczLDAuMjk1MyA3Ljc1LDIuMDdsMS42NywtMi4xYzAuMTQwNjYsLTAuMTU2OTQgMC4zNTQzNiwtMC4yMjY5MyAwLjU2MDYxLC0wLjE4MzYyYzAuMjA2MjUsMC4wNDMzMSAwLjM3Mzc0LDAuMTkzMzUgMC40MzkzOSwwLjM5MzYybDEuNzYsNy40MmMwLjA1MzUzLDAuMTg3IDAuMDExNDUsMC4zODgzNyAtMC4xMTI0OCwwLjUzODI4Yy0wLjEyMzkzLDAuMTQ5OTIgLTAuMzEzNzksMC4yMjkxMiAtMC41MDc1MiwwLjIxMTcyeiIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjEwLjI1OTY3MTE5MDUzMzc2Njo5Ljc3MDAwOTYxNzc0ODA4Ny0tPg==`
                            },
                            ROT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 15,
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            }
                        }
                    },
                    {
                        opcode: 'rotatecounterclockwise',
                        text: 'rotate [PATH] [IMG] [ROT] degrees around x: [X] y: [Y]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true, // unfinished block
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                            IMG: {
                                type: Scratch.ArgumentType.IMAGE,
                                dataURI: `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMS4yNjE4MSIgaGVpZ2h0PSIyMC4wMzE0NSIgdmlld0JveD0iMCwwLDIxLjI2MTgxLDIwLjAzMTQ1Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI5Ljc0MDMzLC0xNzAuMjI5OTkpIj48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIyOS44MDI0NiwxNzguODFsMS43LC03LjM3YzAuMTc3NjksLTAuNzA3MSAwLjgxMDk0LC0xLjIwNDY0IDEuNTQsLTEuMjFjMC40ODM2OSwtMC4wMDE2OSAwLjk0MTE2LDAuMjE5NjcgMS4yNCwwLjZsMS4wOCwxLjM1YzIuMjYzMTYsLTEuNTI4MTUgNS4wMjY0NywtMi4xMjk0OSA3LjcyLC0xLjY4YzEuNjg1ODYsMC4zMDU4NCAzLjI2Mzc2LDEuMDQzMTEgNC41OCwyLjE0YzEuMjg5OTIsMS4xMDgwOCAyLjI2NTg3LDIuNTM1NzkgMi44Myw0LjE0YzEuMDMyNTIsMy4xMzI3NSAwLjQ3NjcyLDYuNTcxOTUgLTEuNDksOS4yMmMtMS44ODA5OSwyLjYxMzQ2IC00Ljg4MDc1LDQuMTkxMTEgLTguMSw0LjI2Yy0xLjI0ODE2LDAuMDQ0MTggLTIuMjk1ODIsLTAuOTMxODQgLTIuMzQsLTIuMThjLTAuMDQ0MTgsLTEuMjQ4MTYgMC45MzE4NCwtMi4yOTU4MiAyLjE4LC0yLjM0djBjMS43MzUyNSwtMC4xMjk4MiAzLjMxMDYsLTEuMDYxNzIgNC4yNiwtMi41MmMwLjkxOTExLC0xLjM2MTEgMS4xMjA0NCwtMy4wODM2MiAwLjU0LC00LjYyYy0wLjI4ODAxLC0wLjY4Mzc0IC0wLjc0OTk5LC0xLjI4MDE4IC0xLjM0LC0xLjczYy0wLjU4ODIxLC0wLjQzMTY1IC0xLjI3NjM3LC0wLjcwNjkxIC0yLC0wLjhjLTEuMTA0MSwtMC4xMTI0OCAtMi4yMTMxOSwwLjE1OTQ5IC0zLjE0LDAuNzdsMS4xMiwxLjQxYzAuMzcxOTQsMC40NjU3OSAwLjQ1MjEyLDEuMTAwNSAwLjIwNzY5LDEuNjQ0MTVjLTAuMjQ0NDMsMC41NDM2NSAtMC43NzI0MSwwLjkwNDkzIC0xLjM2NzY5LDAuOTM1ODVoLTcuNjljLTAuNDk4MzQsLTAuMDAwNzYgLTAuOTY3ODgsLTAuMjMzNjggLTEuMjcsLTAuNjNjLTAuMzAyMjQsLTAuMzk1ODcgLTAuMzk4NzEsLTAuOTExNjUgLTAuMjYsLTEuMzl6IiBmaWxsLW9wYWNpdHk9IjAuMiIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik0yMzAuODU0OTUsMTc5LjYxODI4Yy0wLjEyMzkzLC0wLjE0OTkyIC0wLjE2NjAxLC0wLjM1MTI4IC0wLjExMjQ4LC0wLjUzODI4bDEuNzYsLTcuNDJjMC4wNjU2NSwtMC4yMDAyNyAwLjIzMzE0LC0wLjM1MDMxIDAuNDM5MzksLTAuMzkzNjJjMC4yMDYyNSwtMC4wNDMzMSAwLjQxOTk1LDAuMDI2NjggMC41NjA2MSwwLjE4MzYybDEuNjcsMi4xYzIuMTY0MjcsLTEuNzc0NyA0Ljk4OTA3LC0yLjUyOTIgNy43NSwtMi4wN2MxLjUxNDgyLDAuMjY4MDIgMi45MzIzNSwwLjkzMDIyIDQuMTEsMS45MmMxLjE2NTQzLDAuOTg5MzUgMi4wNDI4MywyLjI3NDM3IDIuNTQsMy43MmMwLjkzMTgyLDIuODUwOTQgMC40MDg4Niw1Ljk3NzQ3IC0xLjQsOC4zN2MtMS43MTYzNiwyLjM1NDM3IC00LjQzNjg4LDMuNzY4MyAtNy4zNSwzLjgyYy0wLjcyMzQ5LDAuMDIyMDkgLTEuMzI3OTEsLTAuNTQ2NTEgLTEuMzUsLTEuMjdjLTAuMDIyMDksLTAuNzIzNDkgMC41NDY1MSwtMS4zMjc5MSAxLjI3LC0xLjM1YzIuMDMxNjIsLTAuMTM3NzggMy44ODE3NCwtMS4yMTgyNSA1LC0yLjkyYzEuMTM3NTEsLTEuNjE1NDggMS40MDY3OSwtMy42ODc0MiAwLjcyLC01LjU0Yy0wLjY4NDI0LC0xLjczMSAtMi4yNjE5NywtMi45NDc4OSAtNC4xMSwtMy4xN2MtMS43MjI2OCwtMC4xODkxNyAtMy40NDE0MiwwLjM4ODYyIC00LjcsMS41OGwxLjc1LDIuMTljMC4xNjUzLDAuMTcxMDMgMC4yMTE3NCwwLjQyNDU5IDAuMTE3NzgsMC42NDMwOWMtMC4wOTM5NiwwLjIxODUxIC0wLjMwOTk0LDAuMzU5MjMgLTAuNTQ3NzgsMC4zNTY5MWgtNy42MWMtMC4xOTM3MywwLjAxNzQgLTAuMzgzNTksLTAuMDYxOCAtMC41MDc1MiwtMC4yMTE3MnoiIGZpbGw9IiNmZmZmZmYiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxMC4yNTk2NzExOTA1MzM3MDk6OS43NzAwMDk2MTc3NDgwNTktLT4=`
                            },
                            ROT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 15,
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            }
                        }
                    },
                    {
                        opcode: 'scale',
                        text: 'scale [PATH] times [SCALE]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            },
                        },
                    },
                    {
                        opcode: 'round',
                        text: 'round [PATH] to [DECIMALS] decimals',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                            DECIMALS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            },
                        },
                    },
                    {
                        opcode: 'convertrelativity',
                        text: 'convert [PATH] to [ABSREL]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                            ABSREL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'absoluteorrelative',
                            },
                        },
                    },
                    {
                        opcode: 'reverse',
                        text: 'reverse [PATH]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            PATH: dogeiscutSvgPath.Argument,
                        },
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        xml: `
                        <block type="dogeiscutsvgpath_translate">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_rotateclockwise">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                            <value name="ROT">
                                <shadow type="math_number">
                                    <field name="NUM">15</field>
                                </shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_rotatecounterclockwise">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                            <value name="ROT">
                                <shadow type="math_number">
                                    <field name="NUM">15</field>
                                </shadow>
                            </value>
                            <value name="X">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                            <value name="Y">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_scale">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                            <value name="SCALE">
                                <shadow type="math_number">
                                    <field name="NUM">1</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_round">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                            <value name="DECIMALS">
                                <shadow type="math_number">
                                    <field name="NUM">2</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_convertrelativity">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                            <value name="ABSREL">
                                <shadow type="dogeiscutsvgpath_menu_absoluteorrelative">
                                    <field name="absoluteorrelative">absolute</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dogeiscutsvgpath_reverse">
                            <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty"></shadow>
                            </value>
                        </block>`
                    },
                    '---',
                    {
                        opcode: 'merge',
                        text: 'merge [PATH1] [PATH2]',
                        ...dogeiscutSvgPath.Block,
                        hideFromPalette: true,
                        arguments: {
                            PATH1: dogeiscutSvgPath.Argument,
                            PATH2: dogeiscutSvgPath.Argument
                        }
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        xml: `
                        <block type="dogeiscutsvgpath_merge">
                            <value name="PATH1">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                            <value name="PATH2">
                                <shadow type="dogeiscutsvgpath_empty">
                                </shadow>
                            </value>
                        </block>`
                    },
                    '---',
                    {
                        opcode: 'forindex',
                        text: 'index',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        canDragDuplicate: true,
                    },
                    {
                        opcode: 'forvalue',
                        text: 'command',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        canDragDuplicate: true,
                    },
                    {
                        opcode: 'asarray',
                        text: 'get [PATH] commands as array',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true, // replace with jwArray version if extension is active
                    },
                    {
                        opcode: 'for',
                        text: 'for [INDEX] [VALUE] in [PATH]',
                        blockType: Scratch.BlockType.LOOP,
                        hideFromPalette: true,
                        arguments: {
                            INDEX: {
                                fillIn: 'forindex'
                            },
                            VALUE: {
                                fillIn: 'forvalue'
                            },
                            PATH: dogeiscutSvgPath.Argument,
                        },
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        hideFromPalette: true, // kinda useless tbh
                        xml: `
                        <block type="dogeiscutsvgpath_for">
                            <value name="INDEX">
                                <shadow type="dogeiscutsvgpath_forindex" />
                            </value>
                            <value name="VALUE">
                                <shadow type="dogeiscutsvgpath_forvalue" />
                            </value>
                             <value name="PATH">
                                <shadow type="dogeiscutsvgpath_empty" />
                            </value>
                        </block>`
                    },
                    '---',
                    {
                        opcode: 'pen_drawpath',
                        text: 'draw path [PATH]',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: true, // unfinished block
                    },
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        opcode: 'menu_trueorfalse',
                        text: '[TRUEFALSE]',
                        hideFromPalette: true,
                        arguments: {
                            TRUEFALSE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'trueorfalse',
                            }
                        },
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'test',
                        text: 'test [BOOL]',
                        hideFromPalette: true,
                        arguments: {
                            BOOL: {
                                type: Scratch.ArgumentType.BOOLEAN,
                            }
                        }
                    },
                    // {
                    //     blockType: Scratch.BlockType.XML,
                    //     xml: `
                    //     <block type="dogeiscutsvgpath_test">
                    //         <value name="BOOL">
                    //             <shadow type="dogeiscutsvgpath_menu_trueorfalse">
                    //                 <field name="trueorfalse">true</field>
                    //             </shadow>
                    //         </value>
                    //     </block>`
                    // },
                ],
                menus: {
                    absoluteorrelative: {
                        acceptReporters: true,
                        items: [
                            { text: 'absolute', value: 'absolute' },
                            { text: 'relative', value: 'relative' },
                        ]
                    },
                    horizontalorvertical: {
                        acceptReporters: true,
                        items: [
                            { text: 'horizontal', value: 'horizontal' },
                            { text: 'vertical', value: 'vertical' },
                        ]
                    },
                    moveorlineorshorthandquadraticbeziercurve: {
                        acceptReporters: true,
                        items: [
                            { text: 'move', value: 'move' },
                            { text: 'line', value: 'line' },
                            { text: 'shorthand quadratic bezier curve', value: 'shorthand quadratic bezier curve' },
                        ]
                    },
                    shorthandcurveorquadraticbeziercurve: {
                        acceptReporters: true,
                        items: [
                            { text: 'shorthand', value: 'shorthand' },
                            { text: 'quadratic bezier', value: 'quadratic bezier' },
                        ]
                    },
                    presets: {
                        acceptReporters: false,
                        items: [
                            { text: 'star', value: 'm13 16-5-3-5 3 1-6L0 6l5-1 3-5 3 5 5 1-4 4 1 6z' },
                            { text: 'circle', value: 'm5 0a1 1 1 000 10 1 1 0 000-10z' },
                            { text: 'trapezoid', value: 'M -2 -2 L 2 -2 L 3 2 L -3 2 Z' },
                            { text: 'sword', value: 'M 4 8 L 10 1 L 13 0 L 12 3 L 5 9 C 6 10 6 11 7 10 C 7 11 8 12 7 12 A 1.42 1.42 0 0 1 6 13 A 5 5 0 0 0 4 10 Q 3.5 9.9 3.5 10.5 T 2 11.8 T 1.2 11 T 2.5 9.5 T 3 9 A 5 5 90 0 0 0 7 A 1.42 1.42 0 0 1 1 6 C 1 5 2 6 3 6 C 2 7 3 7 4 8 M 10 1 L 10 3 L 12 3 L 10.2 2.8 L 10 1' },
                        ]
                    },
                    trueorfalse: {
                        acceptReporters: false,
                        items: [
                            { text: 'true', value: 'true' },
                            { text: 'false', value: 'false' },
                        ]
                    },
                }
            }
        }

        empty() {
            return new dogeiscutSvgPathType('M0 0')
        }
        emptyat({X, Y}) {
            return new dogeiscutSvgPathType(`M${X} ${Y}`)
        }

        fromstring(args) {
            let path = args.STRING.trim().replace(/,/g, ' ')
            if (dogeiscutSvgPathType.isValidSVGPath(path)) {
                return new dogeiscutSvgPathType(path)
            } else {
                return new dogeiscutSvgPathType('M0 0')
            }
        }

        isvalid(args) {
            let path = args.STRING
            if (path instanceof dogeiscutSvgPathType) {
                return dogeiscutSvgPathType.isValidSVGPath(path.path)
            } else if (typeof path === 'string') {
                return dogeiscutSvgPathType.isValidSVGPath(path)
            } else {
                return false
            }
        }

        tostring(args) {
            let path = args.PATH
            if (path instanceof dogeiscutSvgPathType) {
                return path.toString()
            } else {
                return 'M0 0'
            }
        }

        addonecoordinate({PATH, ABSREL, HV, TO}) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)

            if (ABSREL === 'relative') {
                PATH.path += ` ${HV === 'horizontal' ? 'h' : 'v'} ${TO}`;
            } else {
                PATH.path += ` ${HV === 'horizontal' ? 'H' : 'V'} ${TO}`;
            }

            return PATH;
        }

        addtwocoordinate({PATH, ABSREL, MLT, X, Y}) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)

            if (ABSREL === 'relative') {
                PATH.path += ` ${MLT === 'move' ? 'm' : MLT === 'line' ? 'l' : 'q'} ${X} ${Y}`;
            } else {
                PATH.path += ` ${MLT === 'move' ? 'M' : MLT === 'line' ? 'L' : 'Q'} ${X} ${Y}`;
            }

            return PATH;
        }

        addfourcoordinate({PATH, ABSREL, SQ, CURVEX, CURVEY, X, Y}) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)

            if (ABSREL === 'relative') {
                PATH.path += ` ${SQ === 'shorthand' ? 's' : 'c'} ${CURVEX} ${CURVEY} ${X} ${Y}`;
            } else {
                PATH.path += ` ${SQ === 'shorthand' ? 'S' : 'C'} ${CURVEX} ${CURVEY} ${X} ${Y}`;
            }

            return PATH;
        }

        addsixcoordinate({PATH, ABSREL, CURVEX, CURVEY, ENDCURVEX, ENDCURVEY, X, Y}) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)

            if (ABSREL === 'relative') {
                PATH.path += ` c ${CURVEX} ${CURVEY} ${ENDCURVEX} ${ENDCURVEY} ${X} ${Y}`;
            } else {
                PATH.path += ` C ${CURVEX} ${CURVEY} ${ENDCURVEX} ${ENDCURVEY} ${X} ${Y}`;
            }

            return PATH;
        }

        addelipticalarc({PATH, ABSREL, X, Y, RX, RY, ROTATION, LARGEARC, SWEEP}) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)

            if (ABSREL === 'relative') {
                PATH.path += ` a ${RX} ${RY} ${ROTATION} ${LARGEARC ? 1 : 0} ${SWEEP ? 1 : 0} ${X} ${Y}`;
            } else {
                PATH.path += ` A ${RX} ${RY} ${ROTATION} ${LARGEARC ? 1 : 0} ${SWEEP ? 1 : 0} ${X} ${Y}`;
            }

            return PATH;
        }

        commands({ PATH }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);

            const pathComponents = PATH.path.split(/(?=[a-zA-Z])/);
            return pathComponents.length;
        }

        commandatindex({ PATH, INDEX }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)

            if (INDEX < 0 || INDEX >= PATH.path.length) {
                return 'M0 0'
            } else {
                let path = PATH.path.split(/(?=[a-zA-Z])/)
                return path[INDEX-1]
            }
        }

        removecommand({ PATH, INDEX }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);

            const pathComponents = PATH.path.split(/(?=[a-zA-Z])/);
            if (INDEX < 1 || INDEX > pathComponents.length) {
            return PATH; // Return the original path if the index is out of bounds
            }

            pathComponents.splice(INDEX - 1, 1); // Remove the command at the specified index
            PATH.path = pathComponents.join(''); // Reconstruct the path

            return PATH;
        }

        preset({DROPDOWN}) {
            return new dogeiscutSvgPathType(DROPDOWN)
        }

        generatepolygon({ SIDES, RADIUS }) {
            const X = 0
            const Y = 0
            if (SIDES < 3) {
                SIDES = 3;
            } else if (SIDES > 100) {
                SIDES = 100;
            }
            let path = `M${parseFloat((X + RADIUS).toFixed(3))} ${parseFloat((Y).toFixed(3))}`;
            for (let i = 1; i < SIDES; i++) {
                let angle = (i * 2 * Math.PI) / SIDES;
                path += ` L${parseFloat((X + RADIUS * Math.cos(angle)).toFixed(3))} ${parseFloat((Y + RADIUS * Math.sin(angle)).toFixed(3))}`;
            }
            path += ' Z';
            return new dogeiscutSvgPathType(path);
        }

        merge({ PATH1, PATH2 }) {
            PATH1 = dogeiscutSvgPath.Type.toSvgPath(PATH1);
            PATH2 = dogeiscutSvgPath.Type.toSvgPath(PATH2);

            return new dogeiscutSvgPathType(`${PATH1.path} ${PATH2.path}`);
        }

        forindex({}, util) {
            const index = util.thread.stackFrames[0].dogeiscutSvgPathIndex
            return index ? index : 0
        }
    
        forvalue({}, util) {
            const path = util.thread.stackFrames[0].dogeiscutSvgPath
            return path ? path : ""
        }
    
        for({PATH}, util) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH)
            const pathComponents = PATH.path.split(/(?=[a-zA-Z])/);

            console.log(pathComponents)
    
            if (util.stackFrame.execute) {
                util.stackFrame.index++;
                console.log("stack frame")
                const { index, entry } = util.stackFrame;
                if (index > entry.length - 1) return;
                util.thread.stackFrames[0].dogeiscutSvgPath = new dogeiscutSvgPathType(entry[index]);
                util.thread.stackFrames[0].dogeiscutSvgPathIndex = index;
            } else {
                if (pathComponents.length === 0) return;
                console.log("stack frame non exec?")
                util.stackFrame.entry = pathComponents;
                util.stackFrame.execute = true;
                util.stackFrame.index = 0;
                util.thread.stackFrames[0].dogeiscutSvgPath = new dogeiscutSvgPathType(pathComponents[0]);
                util.thread.stackFrames[0].dogeiscutSvgPathIndex = 0
            }
            util.startBranch(1, true);
        }

        translate({ PATH, X, Y }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);
            const commands = SvgPathParser.parseRaw(PATH.path);
            const translatedCommands = commands.map(command => {
            const type = command[0];
            const args = command.slice(1);
            if (type.toLowerCase() === 'z') return command; // Close path, no translation needed
            if (type.toLowerCase() === 'h') {
                args[0] += X;
            } else if (type.toLowerCase() === 'v') {
                args[0] += Y;
            } else {
                for (let i = 0; i < args.length; i += 2) {
                args[i] += X;
                args[i + 1] += Y;
                }
            }
            return [type, ...args];
            });
            PATH.path = translatedCommands.map(cmd => cmd.join(' ')).join(' ');
            return PATH;
        }

        rotateclockwise({ PATH, ROT, X, Y }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);
            const angle = (ROT * Math.PI) / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const commands = SvgPathParser.parseRaw(PATH.path);
            const rotatedCommands = commands.map(command => {
            const type = command[0];
            const args = command.slice(1);
            if (type.toLowerCase() === 'z') return command; // Close path, no rotation needed
            for (let i = 0; i < args.length; i += 2) {
                const dx = args[i] - X;
                const dy = args[i + 1] - Y;
                args[i] = cos * dx - sin * dy + X;
                args[i + 1] = sin * dx + cos * dy + Y;
            }
            return [type, ...args];
            });
            PATH.path = rotatedCommands.map(cmd => cmd.join(' ')).join(' ');
            return PATH;
        }

        rotatecounterclockwise({ PATH, ROT, X, Y }) {
            return this.rotateclockwise({ PATH, ROT: -ROT, X, Y });
        }

        scale({ PATH, SCALE }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);
            const commands = SvgPathParser.parseRaw(PATH.path);
            const scaledCommands = commands.map(command => {
            const type = command[0];
            const args = command.slice(1);
            if (type.toLowerCase() === 'z') return command; // Close path, no scaling needed
            for (let i = 0; i < args.length; i++) {
                args[i] *= SCALE;
            }
            return [type, ...args];
            });
            PATH.path = scaledCommands.map(cmd => cmd.join(' ')).join(' ');
            return PATH;
        }

        round({ PATH, DECIMALS }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);
            const factor = Math.pow(10, DECIMALS);
            const commands = SvgPathParser.parseRaw(PATH.path);
            const roundedCommands = commands.map(command => {
            const type = command[0];
            const args = command.slice(1).map(arg => Math.round(arg * factor) / factor);
            return [type, ...args];
            });
            PATH.path = roundedCommands.map(cmd => cmd.join(' ')).join(' ');
            return PATH;
        }

        convertrelativity({ PATH, ABSREL }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);
            const commands = SvgPathParser.parseRaw(PATH.path);
            let currentX = 0, currentY = 0;
            const convertedCommands = commands.map(command => {
            const type = command[0];
            const args = command.slice(1);
            if (type.toLowerCase() === 'z') return command; // Close path, no conversion needed
            if (ABSREL === 'absolute' && type === type.toLowerCase()) {
                for (let i = 0; i < args.length; i += 2) {
                args[i] += currentX;
                args[i + 1] += currentY;
                }
                currentX = args[args.length - 2];
                currentY = args[args.length - 1];
                return [type.toUpperCase(), ...args];
            } else if (ABSREL === 'relative' && type === type.toUpperCase()) {
                for (let i = 0; i < args.length; i += 2) {
                args[i] -= currentX;
                args[i + 1] -= currentY;
                }
                currentX += args[args.length - 2];
                currentY += args[args.length - 1];
                return [type.toLowerCase(), ...args];
            }
            return command;
            });
            PATH.path = convertedCommands.map(cmd => cmd.join(' ')).join(' ');
            return PATH;
        }

        reverse({ PATH }) {
            PATH = dogeiscutSvgPath.Type.toSvgPath(PATH);
            const commands = SvgPathParser.parseRaw(PATH.path);
            const reversedCommands = commands.reverse().map(command => {
            const type = command[0];
            const args = command.slice(1);
            if (type.toLowerCase() === 'z') return command; // Close path, no reversal needed
            if (args.length > 1) {
                for (let i = 0; i < args.length / 2; i += 2) {
                const tempX = args[i];
                const tempY = args[i + 1];
                args[i] = args[args.length - 2 - i];
                args[i + 1] = args[args.length - 1 - i];
                args[args.length - 2 - i] = tempX;
                args[args.length - 1 - i] = tempY;
                }
            }
            return [type, ...args];
            });
            PATH.path = reversedCommands.map(cmd => cmd.join(' ')).join(' ');
            return PATH;
        }

        menu_trueorfalse({TRUEFALSE}) {
            return Scratch.Cast.toBoolean(TRUEFALSE);
        }

        test({BOOL}) {
            return Scratch.Cast.toBoolean(BOOL);
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);