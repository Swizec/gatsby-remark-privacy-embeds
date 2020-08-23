import visit from "unist-util-visit";

type PluginOptions = {};

function cacheKey(search) {
    return `giphy-result:${search}`;
}

export default async function (
    { cache, markdownAST },
    pluginOptions: PluginOptions
) {
    const transformations = [];

    console.log("--------");
    console.log(require("util").inspect(markdownAST, false, null, true));
    console.log("-------");

    // await Promise.all(transformations.map((t) => t()));

    return markdownAST;
}
