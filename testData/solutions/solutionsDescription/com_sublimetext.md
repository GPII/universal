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

