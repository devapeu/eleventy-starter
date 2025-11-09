import * as sass from 'sass';
import * as path from 'path';

export default function (eleventyConfig) {
  const timestamp = Date.now();

  // Styles
  eleventyConfig.addTemplateFormats("sass");
	eleventyConfig.addExtension("sass", {
		outputFileExtension: "css",
		compile: async function (inputContent, inputPath) {
      // Skips files that start with an underscore, i.e. partials
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }

      // Compile with indented syntax, unlike the default SCSS
			let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        syntax: "indented"
      });

      // Allow Eleventy to watch for changes to these files
      this.addDependencies(inputPath, result.loadedUrls);

			return async () => {
				return result.css;
			};
		},
	});

  // Append a build timestamp so assets ignore cache on new builds.
  eleventyConfig.addFilter('asset', function (assetPath) {
    return `${assetPath}?v=${timestamp}`;
  });

  // Scripts
  eleventyConfig.addPassthroughCopy("src/**/*.js");

  // Public assets
  eleventyConfig.addPassthroughCopy({ "public/": "./" });

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
