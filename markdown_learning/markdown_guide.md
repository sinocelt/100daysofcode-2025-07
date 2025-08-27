In Linux, use CTRL + SHIFT + v to preview markdown in Visual Studio. And double click on the text area to go back to markdown.

You can also preview markdown to the side with CTRL + K (then release keys) + v. So CTRL + K + V together at the same time won't work, but CTRL + K then release the keys and type on "v" will have the markdown panel to the side.

Don't forget, you can also use CTRL + SHIFT + p, to open the command pallette, and search for markdown preview options in there.


Markdown roughly will convert to simple HTML, but it's simpler to type than HTML generally.

# Headers
# H1 tag (line starts with 1 '#')
## H2 tag (line starts with 2 '#')
### H3 tag (line starts with 3 '#')
#### H4 tag (line starts with 4 '#')
##### H5 tag (line starts with 5 '#')
###### H6 tag (line starts with 6 '#')

## Horizontal rule
It is composed of 3 '*' or 3  '-' or 3 '_'. As in:  
`***`
`---`
`___`  
An example of a horizontal rule is below:
***

# Bold and italics

## Bold
To make a single word or group of words bold, surround them with ** on the left side and ** on the right side

For example:

`Dogs are wonderful vs Dogs are ``**wonderful**`

Rendered below as
Dogs are wonderful vs Dogs are ``**wonderful**``

## Italics
To make a single word or group of words italic, surround them with a single underscore _ on the left side and a single underscore _ on the right.

For example:

He said what? versus He said _what?_


Note, if you were to add 2 underscores on each side, it would actually make it bold.

# Bold and Italics

You can combine bold and italics together for text. For example:

Qatar is VERY rich. I saw a Lamborghini in their Doha airport.

versus

Qatar is _**VERY**_ rich. I saw a Lamborghini in their Doha airport.  
versus


# Line Breaks
If you want a line break, there are a few caveats in Markdown. Often, if you type text and then hit enter meaning to do a new line, Markdown will render the 2 lines as 1 line.

You can either:

* Hit enter twice to get 2 new lines
* End the first line with 2 spaces
* use a break tag from HTML

- first
- second

# Lists

## Unordered, bulleted list.

Use either '*' or '-' at the start of each line and put a space, then put your text

```
**Shopping list:**
* oranges
* apples
* bananas
* water
* bread
* durian (if available)
```

**Shopping list:**
* oranges
* apples
* bananas
* water
* bread
* durian (if available)

## Ordered, numbered lists

Put a number at the start of each line, put a space, and then put your text.

<strong>My goals</strong>
1. Financial
2. Fitness
3. Social

# Links and images

## Links (non-images)
The general form of a link in Markdown is like below:  
jack-o-lantern emoji 🎃 [Alt text](the_url)

For example:
jack-o-lantern emoji 🎃 ```[jack-o-lantern emoji](https://emojipedia.org/jack-o-lantern)```

This part of markdown corresponds roughly to anchor tags in HTML

## Image links
The general form of an image n Markdown is like below:  
jack-o-lantern emoji 🎃 ```[Alt text](the_url)```

The main difference between a general link and an image link is that an image link starts with "!"

For example:
Image from Pexels:  
jack-o-lantern with image 🎃 ![jack-o-lantern emoji](https://images.pexels.com/photos/236277/pexels-photo-236277.jpeg)

This corresponds roughly to `<img>` tags in HTML


# Block Quotes

You just need to start a line or paragraph (without extra empty lines in between) with ">" symbol

For example
Quoting from Shakespeare's Hamlet:

>To be, or not to be, that is the question:
Whether ’tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles,
And by opposing end them? To die—to sleep,
No more; and by a sleep to say we end
The heart-ache, and the thousand natural shocks
That flesh is heir to: ’tis a consummation
Devoutly to be wish’d.









# Code

## Single backticks for inline code

You can display code or normal text unformatted, inline, with a backtick ` on the left side and a backtick on the right side

``` `print('hello world')` ```

`print('hello world')`


## Three backticks for multiline code (note there is no syntax highlighting)

If you have multiple lines of code or text that you want to unformat, you can start and end the block with 3 backticks.

In this special case, you would surround the inner 3 backtick pairs with 4 backticks.

````
```
def hello_world():  
    print("hello world")
```
````

Rendered as below:
```
def hello_world():  
    print("hello world")
```


## Syntax Highlighting
Add language name, such as python, right after the three backticks to add syntax highlighting

````
```python
def hello_world():
    print("hello world")
```
````

Rendered as below:
```python
def hello_world():
    print("hello world")
```

---


# Strikethrough

To strike through text, all you need to do is start and end the sentence with '~~', or two tildes on both the left and right sides of what you want to strike through.

Example:

~~My business failed~~  
Actually, my business succeeded





# BELOW ARE NOT RENDERING WELL

# Footnotes

was never able to get it to render


# Task Lists

Note: sometimes some markdown renderers don't support specific parts of Markdown.

# if it is finished, put an 'x' between the brackets. If the item is not done yet, then make sure you have 1 space between the left bracket and the right bracket.
- [ ] Walk dog
- [x] Exercise
- [ ] Eat dinner