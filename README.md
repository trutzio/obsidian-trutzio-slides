# Obsidian Slides Plugin

Create slides using markdown in [Obsidian](https://obsidian.md) and present them via [Reveal.js](https://revealjs.com) in your browser.

## Features

- Create beautiful slides using `---` as separator within Obsidian notes
- Highlight or incrementally reveal individual elements on a slide
- Create links between slides
- Embed code into your slides with line numbers
- Highlight and incrementally reveal individual lines in your embeded code
- Speaker notes and speaker notes window
- Mathematical formulas via [KateX](https://katex.org/)

## Manual Installation

1. Download the latest release from [GitHub](https://github.com/trutzio/obsidian-trutzio-slides/releases), you need only the file `trutzio-slides.zip`
2. In Obsidian, open your vault's root folder in your file explorer
3. Navigate to the `.obsidian/plugins` directory, if it doesn't exist, create it
4. Extract the contents of the downloaded `.zip` file into a new folder within the `plugins` directory.
5. Restart Obsidian or reload your vault
6. Go to `Settings` > `Community Plugins` and make sure "Safe Mode" is turned off
7. Click on `Browse` under `Community Plugins`, find `Slides`, and enable it

## Element and Slide Attributes

You can customize the slide appearence and the revealing of elements within slides by using

- `<!-- .slide: ... -->` and
- `<!-- .element: ... -->`

markups as described [here](https://revealjs.com/markdown/#element-attributes). The following example slide:

```md
---

<!-- .slide: data-background="#ff0000" -->

# My Title

- Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
- Item 2 <!-- .element: class="fragment" data-fragment-index="1" -->

---
```

has a red background and the bullet points will incrementally appear in reverse order. Please use the cursor keys to reveal the items. More on fragments attributes [here](https://revealjs.com/fragments/).

## Links between slides

You can directly navigate between slides by giving the target slide an id and using this id as a link in the source slide. Here two example slides demonstrating navigation:

```md
---
<!-- .slide: id="demo" -->
# Markdown Demo

This slide has id = "demo".

---

[go to slide with id "demo"](#/demo)

---
```

The first slide has id `demo` which is used as link `(#/demo)` from the second slide.

## Embedding Code

You can embed code from different languages like Python, Java, etc. The following slide

```md
---
# My Java Code

\`\`\`java [1|3-7]
class Main {
  public static void main(String[] args) {
    int first = 10;
    int second = 20;
    // add two numbers
    int sum = first + second;
    System.out.println(first + " + " + second + " = "  + sum);
  }
}
\`\`\`
---
```

contains Java code with line numbers. Plese also note the revealing of the first line of code and after that the focus on the lines 3-7.

## Speaker Notes

Within the presentation in browser press `S` to get an extra windows with actual and next slide containing also the speaker notes. At the end of a slide insert your speaker notes after `Note:` like in the example below:

```md
---

Slide with speaker notes.

Note: This notes are only visible in the speaker notes window. Please press S within a presentation to open the speaker notes window.
---
```

## Mathematical formulas with TeX

Within slides it is possible to use [KaTex](https://katex.org/) formulas between `$$` signs. Below an example:

```md
---
## Formulas with KaTex

$$F(x) = \int_{-\infty}^\infty f(x) e^{2 \pi i \xi} d\xi$$

---
```