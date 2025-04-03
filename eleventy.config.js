import * as sass from 'sass';
import * as path from 'path';

export default function (eleventyConfig) {
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

  // Scripts
  eleventyConfig.addPassthroughCopy("src/**/*.js");

  // Layout config

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
