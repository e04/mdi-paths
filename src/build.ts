import * as convert from "xml-js";
import {promises as fs} from "fs";
import {indexTsTemplate} from "./templates";
import jsKeywords from "./keywords";

const SVG_PATH =
    "node_modules/material-icons/iconfont/MaterialIcons-Regular.svg";
const INDEX_JS_PATH = "./src/index.ts";
const ICON_SCALE = 0.1;

type MaterialIconSVGStructure = {
    elements: {
        name: string;
        elements: {
            name: string;
            elements: {
                name: string;
                elements: Icon[];
            }[];
        }[];
    }[];
};

type Icon = {
    type: "element";
    name: "glyph";
    attributes: {
        "glyph-name": string;
        unicode: string;
        d: string;
    };
};

const pickElementInElementArray = (attrName: string, attrValue: string) => (
    item: any
) => attrName in item && item.name === attrValue;

const load = async () => {
    const xmlText = await fs.readFile(SVG_PATH, "utf-8");
    const jsonText = convert.xml2json(xmlText, {compact: false, spaces: 4});
    return JSON.parse(jsonText) as MaterialIconSVGStructure;
};

const parseIconArray = (svgObject: MaterialIconSVGStructure): Icon[] => {
    // the SVG file structure is like blow

    /*
        <?xml version="1.0" standalone="no"?>
            <!DOCTYPE>
            <svg>
              <metadata></metadata>
              <defs>
                <font id="MaterialIcons-Regular" horiz-adv-x="512">
                  <font-face/>
                  <missing-glyph/>
                  <glyph glyph-name="3d_rotation" unicode="&#x33;d_rotation"
                         d="
                         ...........
         */
    const svgElement = svgObject.elements.filter(
        pickElementInElementArray("name", "svg")
    )[0];
    const defsElement = svgElement.elements.filter(
        pickElementInElementArray("name", "defs")
    )[0];
    const fontElement = defsElement.elements.filter(
        pickElementInElementArray("name", "font")
    )[0];
    return fontElement.elements.filter(
        pickElementInElementArray("name", "glyph")
    ) as Icon[];
};

const convertToJSSafeString = (input: string): string => {
    if (input.match(/^\d/)) {
        input = "_" + input;
    }
    if (jsKeywords.some(keyword => keyword === input)) {
        input = input + "_";
    }
    return input
}

const numberRegex = /(\d|-|\.)/

const optimizePathForGoogleMapsAPI = (path: string): string => {
    return path.split('').flatMap((char, index, array) => {
        if (index + 1 === array.length) return [char]
        const isCurrentCharNumber = !!array[index].match(numberRegex)
        const isNextCharNumber = !!array[index + 1].match(numberRegex)
        const isEndOrStartOfNumber =
            (isCurrentCharNumber || isNextCharNumber) && !(isCurrentCharNumber && isNextCharNumber)

        if (isEndOrStartOfNumber) {
            return [char, ',']
        }
        return [char]
    }).join('')
        .split(',')
        .map(item => {
            const float = parseFloat(item)
            if (!isNaN(float)) {
                // reverse and minimize to fit Google Map
                const optimized = float * ICON_SCALE * -1;
                return optimized.toFixed()
            }
            return item
        })
        .join('');
}

const convertToSimpleTuple = (input: Icon): [string, string] => {
    const name = convertToJSSafeString(input.attributes["glyph-name"])
    const path = optimizePathForGoogleMapsAPI(input.attributes.d)
    return [name, path];
};

(async () => {
    const svgObject = await load();
    const icons = parseIconArray(svgObject);

    // create a simple name-path dictionary
    const paths = icons.reduce((a: { [key: string]: string }, c: Icon) => {
        const [name, path] = convertToSimpleTuple(c);
        a[name] = path.replace(/\n/g, "");
        return a;
    }, {});

    await fs.writeFile(INDEX_JS_PATH, indexTsTemplate(paths));
})();
