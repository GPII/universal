# Sublime Text

## Details

* __Name__: Sublime Text
* __Id__: com.sublimetext
* __Platform__: Windows
* __Contact__: Christophe Strobbe <strobbe@hdm-stuttgart.de>


## Description
__[# Sublime Text](http://www.sublimetext.com/)__ is a programming editor.
Some of its settings are relevant to accessibility.
Unlike many other applications, Sublime Text immediately responds to changes in the settings while it is running.


## Integration
Several settings in Sublime Text are available via the GPII personalization framework.
They can be adapted using the generic JSON settings handler. 

Settings:
* `color_scheme` (closest common terms: `highContrastEnabled` and `highContrastTheme`)
* `font_face` 
* `font_size` (pixels; common term `fontSize` uses points) 
* `line_numbers` 
* `gutter` 
* `spell_check` 
* `caret_style` 
* `caret_extra_top` 
* `caret_extra_bottom` 
* `caret_extra_width` 
* `show_encoding` 
* `show_line_endings` 

Information about value ranges and some mappings to common terms can be found [in the spreadsheet "SP3 Settings for 2nd pilots"](https://docs.google.com/spreadsheets/d/1uaZV4mBze4udTlEikT30ApmE7CaO46eM0GLT0HVUESg/edit#gid=372151024).
(Find the tab "SublimeText3".)
Note, however, that most of the application-specific terms for Sublime Text cannot yet be mapped to common terms, since the corresponding common terms still need to be defined.

The acceptance tests will be expanded when all application-specific terms can be mapped to common terms. 


## Testing
When using a NP set with settings for Sublime Text, the editor's should responded immediately to the settings included in that NP set.

### sublime_gert

Using this NP set in Sublime Text should have the following effects:

* font size increases to 32.


## Additional Info

### Themes
Sublime Text comes with a large set of themes. 
Many of these themes use a dark background; others use white or light-coloured background.
The following lists divide the themes into two categories. 
The additional information (in parentheses) refers to colours in plain text files
but the themes also cover code colouring, which is not covered here.
Many themes are low-contrast themes; the identification of low-contrast themes below is only a quick-and-dirty classification.

The following themes have a white (or light) background:
* "Packages/Color Scheme - Default/Dawn.tmTheme" (black on white)
* "Packages/Color Scheme - Default/Eiffel.tmTheme" (black on white)
* "Packages/Color Scheme - Default/IDLE.tmTheme" (black on white)
* "Packages/Color Scheme - Default/iPlastic.tmTheme" (black on light grey #EEEEEE)
* "Packages/Color Scheme - Default/LAZY.tmTheme" (black on white)
* "Packages/Color Scheme - Default/Mac Classic.tmTheme" (black on white)
* "Packages/Color Scheme - Default/MagicWB (Amiga).tmTheme" (black on grey #969696; some code colouring is white on a non-grey background; low contrast)
* "Packages/Color Scheme - Default/Slush & Poppies.tmTheme" (black on light grey #F1F1F1)
* "Packages/Color Scheme - Default/Solarized (Light).tmTheme" (grey #586E75 on off-white #FDF6E3; low contrast)

The following themes have a black or dark background:
* "Packages/Color Scheme - Default/All Hallow's Eve.tmTheme" (white #FFFFFF on black #000000; HTML code has grey background #434242)
* "Packages/Color Scheme - Default/Amy.tmTheme" (very pale blue #D0D0DD on dark #200020 background; low contrast)
* "Packages/Color Scheme - Default/Blackboard.tmTheme" (white #F8F8F8 on almost black #0C1021) 
* "Packages/Color Scheme - Default/Cobalt.tmTheme" (white #FFFFFF on blue #002240; rather low contrast)
* "Packages/Color Scheme - Default/Espresso Libre.tmTheme" (some pale colour #BDAE9D on someting brownish #2A211C; low contrast)
* "Packages/Color Scheme - Default/Monokai Bright.tmTheme" (white #F8F8F2 on on brownish black #272822)
* "Packages/Color Scheme - Default/Monokai.tmTheme" (white #F8F8F2 on on brownish black #272822)
* "Packages/Color Scheme - Default/Pastels on Dark.tmTheme" (pale greyish blue #DADADA on dark grey #211E1E; low contrast)
* "Packages/Color Scheme - Default/Solarized (Dark).tmTheme" (grey #839496 on dark blueish grey #042029; low contrast)
* "Packages/Color Scheme - Default/SpaceCadet.tmTheme" (blueish off-white #DDE6CF on almost black #0D0D0D; low contrast)
* "Packages/Color Scheme - Default/Sunburst.tmTheme" (off-white #F8F8F8 on black #000000)
* "Packages/Color Scheme - Default/Twilight.tmTheme" (off-white #F8F8F8 on dark grey #141414; low contrast)
* "Packages/Color Scheme - Default/Zenburnesque.tmTheme" (light grey #DEDEDE on grey #404040; low contrast)
