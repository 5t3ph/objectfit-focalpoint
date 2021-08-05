const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const sharp = require("sharp");
const fetch = require("node-fetch");

const imgPos = async (image, width, height) => {
  const input = await fetch(image).then((resp) => resp.buffer());

  return await sharp(input)
    .resize(width, height, {
      kernel: sharp.kernel.nearest,
      position: sharp.strategy.entropy,
    })
    .toBuffer({ resolveWithObject: true })
    .then(({ info }) => {
      return {
        x: info.cropOffsetLeft,
        y: info.cropOffsetTop,
      };
    });
};

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
      ratio = !ratio && !width && !height ? "5/3" : ratio;
      width = parseFloat(width) || 800;
      height = parseFloat(height) || 480;

      const baseWidth = width;
      const baseHeight = height;

      if (ratio && ratio !== "5/3") {
        const aspectRatio = ratio.split("/");
        width = aspectRatio[0] * 100;
        height = aspectRatio[1] * 100;
      }

      let { x, y } = await imgPos(image, width, height);
      x = x >= 0 ? x : x * -1;
      y = y >= 0 ? y : y * -1;

      let percentX = 0;
      let percentY = 0;

      if (x > 0) {
        percentX = x > width ? width / x : x / width;
        percentX = (percentX * 100).toFixed(2);
      }

      if (y > 0) {
        percentY = y > height ? height / y : y / height;
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
