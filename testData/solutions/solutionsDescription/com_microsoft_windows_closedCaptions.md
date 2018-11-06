# Windows Display Language

## Details

* __Name__: Windows Closed Captions
* __Id__: com.microsoft.windows.closedCaptions
* __Platform__: Windows
* __Contact__: JJ <jj@raisingthefloor.org>

## Description

Sets several options about how captions should be displayed by media players. This options are:

* BackgroundColor: Specifies which background color is going to be used for captions.

  Possible values are:
   - [ Default, White, Black, Red, Green, Blue, Yellow, Magenta, Cyan ].

* BackgroundOpacity: Captions are displayed in a virtual text box in the media player, originally this box
    is transparent. This property allows the user to change the transparency policy for that box.

    Possible values are:
    - [ Default, Opaque, Translucent, Semitransparent, Transparent ].

* CaptionColor: Determines the color in which captions are going to be draw.

    Possible values are:
    - [ Default, White, Black, Red, Green, Blue, Yellow, Magenta, Cyan ].

* CaptionEdgeEffect: Adds effects to the captions edge, currently this effects are not visible in the
    "Movies" application from Windows 10.

    Possible values are:
    - [ Default, None, Raised, Depressed, Uniform, Drop shadow ]

* CaptionFontStyle: Changes the font in which captions are displayed.

    Possible values are:
    - [ Default, Mono serif, Proportional serif, Mono sans serif, Proportional sans serif, Casual, Cursive, Small caps ].

* CaptionOpacity: Determines the transparency of the displayed captions.

    Possible values are:
    - [ Default, Opaque, Translucent, Semitransparent, Transparent ].

* CaptionSize: Determines the size of the displayed captions.

    Possible values are:
    - [ Default, 50%, 100%, 150%, 200%" ]


The following options dims video content using a virtual background to improve subtitle reading,
 by default, this virtual background is transparent.

* RegionColor: Determines the color of the region used to dim video content.

    Possible values are:
    - [ Default, White, Black, Red, Green, Blue, Yellow, Magenta, Cyan ].

* RegionOpacity: Determines the opacity of the region used to dim video content.

    Possible values are:
    - [ Default, Opaque, Translucent, Semitransparent, Transparent ].

    NOTE: Remind that if the region opacity is "Opaque" will be impossible to see the video.

## Testing

The following test users make use of the closed captions setting:
    - Catherine

The following steps allows checking the actual changes in the subtitles:

- Have a video with available subtitles tracks.
- Loging in the system with a user using this feature.
- Open the video with the windows player "Movies".
- Select a subtitle track in the ones available for the video.
- See the subtitles displayed with the selected options.

## Limitations

* Currently we are not able to trigger the subtitles because the system setting intended for that task isn't honored.
