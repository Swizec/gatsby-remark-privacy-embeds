import visit from "unist-util-visit";

type PluginOptions = {};

function cacheKey(search) {
    return `giphy-result:${search}`;
}

async function getThumbnail(targetUrl) {
    const url = `https://pifc233qp6.execute-api.us-east-1.amazonaws.com/dev/embed?url=${targetUrl}`;

    const res = await fetch(url).then((res) => res.json());

    return res.url;
}

async function embed(linkNode, embedType: "youtube") {
    const originalUrl = linkNode.url;
    const thumbnailUrl = await getThumbnail(originalUrl);

    if (thumbnailUrl) {
        linkNode.type = "image";
        linkNode.url = thumbnailUrl;
        linkNode.title = "A youtube video";
        linkNode.alt = "A youtube video";
        linkNode.children = null;
        linkNode.properties = {
            "data-embed-url": originalUrl,
            "data-embed-type": embedType,
        };

        console.log(require("util").inspect(linkNode, false, null, true));
    }

    return linkNode;
}

export default async function (
    { cache, markdownAST },
    pluginOptions: PluginOptions
) {
    const transformations = [];

    visit(markdownAST, "link", (linkNode) => {
        const url = linkNode.url as string;

        if (url.match(/^http(s)?:\/\/(www\.)?(youtube\.com|youtu\.be)/)) {
            transformations.push(async () => embed(linkNode, "youtube"));
        }
    });

    await Promise.all(transformations.map((t) => t()));

    return markdownAST;
}
