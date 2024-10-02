const path = require("path");
const fs = require("fs");

const reverseBlockMappings = require("./mappings/reverse/blocks.json")
const reverseItemMappings = require("./mappings/reverse/item.json")

if(process.argv.length < 3){
    console.log("Usage: node index <inPath>");
    process.exit(1);
}

const inPath = process.argv[2];

const dir = fs.readdirSync(inPath);

if(!dir.includes("assets")) {
    console.log("Error: assets folder not found, is this an unzipped pack?");
    process.exit(1);
}

const blocksPath = path.join(inPath, "assets", "minecraft", "textures", "block");
const itemsPath = path.join(inPath, "assets", "minecraft", "textures", "item");

const blocksDir = fs.readdirSync(blocksPath);
const itemsDir = fs.readdirSync(itemsPath);

let remappedCount = 0;

for(let i = 0; i < blocksDir.length; i++){
    const block = blocksDir[i];
    const blockName = block.split(".")[0];

    if(reverseBlockMappings[blockName]) {
        const newBlockName = reverseBlockMappings[blockName];
        const newBlockPath = path.join(blocksPath, newBlockName + ".png");

        fs.copyFileSync(path.join(blocksPath, block), newBlockPath);
        fs.unlinkSync(path.join(blocksPath, block));
        remappedCount++;
    }
}

for(let i = 0; i < itemsDir.length; i++){
    const item = itemsDir[i];
    const itemName = item.split(".")[0];

    if(reverseItemMappings[itemName]) {
        const newItemName = reverseItemMappings[itemName];
        const newItemPath = path.join(itemsPath, newItemName + ".png");

        fs.copyFileSync(path.join(itemsPath, item), newItemPath);
        fs.unlinkSync(path.join(itemsPath, item));
        remappedCount++;
    }
}

console.log(`Remapped ${remappedCount} textures! Reformatting pack...`);

let packMeta = fs.readFileSync(path.join(inPath, "pack.mcmeta"))
packMeta = packMeta.toString().replace(/"pack_format":\s*\d+/, '"pack_format": 1');
fs.writeFileSync(path.join(inPath, "pack.mcmeta"), packMeta);

fs.renameSync(path.join(inPath, "assets", "minecraft", "textures", "item"), path.join(inPath, "assets", "minecraft", "textures", "items"));
fs.renameSync(path.join(inPath, "assets", "minecraft", "textures", "block"), path.join(inPath, "assets", "minecraft", "textures", "blocks"));