This preference set changes the Windows 10 mouse preferences settings.

## Testing

This changes the following settings from the system:

+ ScrollLines: Now scrolling scrolls a whole page per wheel movement.
+ ScrollRouting: Scroll now is passed directly to the app that is under the mouse
+   even if that window is not currently focused. This behavior only
+   works with Windows Store Apps and with Microsoft applications.
+ DoubleClickTime: Increases double click detection to 5 seconds.
+ EnableCursorShadow: Enable the cursor shadows.
+ ScrollChars: Number of character for horizontal scroll changed to 10.
+ WindowsTrackingEnabled: Windows are now focused when mouse is overing over them.
+ AutoWinArrangement: Windows are not arranged when are dragged to the edge with the mouse.
+ SwapMouseButtons: Swaps right and left mouse buttons.
+ PointerSpeed: Increases system pointer speed to 15.
+ EnhancePrecision: Activates system setting 'Enhance pointer precision'.
+ SnapToDefaultButton: Makes the mouse move to the default menu option automatically.
+ HidePointer: Disables hiding pointer while typing text.
+ MouseSonar: Activates mouse sonar option.
+ DoubleClickHeight: Increases the mouse double-click rectangle height to 32 pixels.
   - Testing: Once this behavior is activated, making double click over an element should be
    possible even if mouse have been moved up to 32 pixels in the Y axis.
+ DoubleClickWidth: Increases the mouse double-click rectangle width to 32 pixels.
    - Testing: Once this behavior is activated, making double click over an element should be
    possible even if mouse have been moved up to 32 pixels in the X axis.