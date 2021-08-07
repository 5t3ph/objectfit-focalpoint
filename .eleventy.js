const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const sharp = require("sharp");
const fetch = require("node-fetch");

const imgPos = async (image, width, height) => {
  const input = await fetch(image).then((resp) => resp.buffer());

  const baseImage = sharp(input);
  const imageInfo = {};

  return await baseImage.metadata().then(function (metadata) {
    imageInfo["trueHeight"] = metadata.height;
    imageInfo["trueWidth"] = metadata.width;

    return baseImage
      .resize(width, height, {
        position: sharp.strategy.entropy,
      })
      .toBuffer({ resolveWithObject: true })
      .then(({ info }) => {
        imageInfo["x"] = info.cropOffsetLeft;
        imageInfo["y"] = info.cropOffsetTop;

        return imageInfo;
      });
  });
};

const defaultAspectRatio = "5/3";
const defaultWidth = 800;
const defaultHeight = 480;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/style.css");
  eleventyConfig.addPassthroughCopy("./src/img/");
  eleventyConfig.addWatchTarget("./src/style.css");

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "focalpoint",
    inputDir: "./src/",
    functionsDir: "./netlify/functions/",
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "focusedAspectRatioImg",
    async function (image, width, height, ratio) {
      ratio = !ratio && !width && !height ? defaultAspectRatio : ratio;
      width = parseFloat(width) || defaultWidth;
      height = parseFloat(height) || defaultHeight;

      const baseWidth = width;
      const baseHeight = height;

      if (ratio) {
        const aspectRatio = ratio.split("/");
        width = aspectRatio[0] * 100;
        height = aspectRatio[1] * 100;
      }

      let { x, y, trueWidth, trueHeight } = await imgPos(image, width, height);

      x = x >= 0 ? x : x * -1;
      y = y >= 0 ? y : y * -1;

      let percentX = 0;
      let percentY = 0;

      if (x > 0) {
        percentX =
          x > width ? ((baseWidth / trueWidth) * x) / baseWidth : x / width;
        percentX = (percentX * 100).toFixed(2);
      }

      if (y > 0) {
        percentY =
          y > height
            ? ((baseHeight / trueHeight) * y) / baseHeight
            : y / height;
        percentY = (percentY * 100).toFixed(2);
      }

      const focalPoint = `object-position: ${percentX}% ${percentY}%;`;
      const ratioProps = ratio ? `height: auto; aspect-ratio: ${ratio};` : "";

      return `<img class="image" src="${image}" width="${baseWidth}" height="${baseHeight}" style="${focalPoint} ${ratioProps}" >
<div class="meta">
<figure>
<img class="reference" src="${image}" alt="reference for original image">
<figcaption><a href="${image}">View full original image</a></figcaption>
</figure>

${"```css"}
.image {
  max-width: 100%;${ratio ? `\n  height: auto;\n  aspect-ratio: ${ratio};` : ""}
  object-fit: cover;
  ${focalPoint}
}
${"```"}
</div>`;
    }
  );

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
