# HexMapEditor
## The Dream
The plan is to make a tool for creating hex maps.  The map will be rendered using SVG.  Which will also include a separete hex map viewer.  The basic file representing a map will use JSON.
## Features
1. Ability to edit SVG attributes:
   1. viewBox width and height (user units).
   1. SVG width and height (pixels).
1. Ability to edit model attributes:
   1. Number of columns and rows.
   1. Colour of border.
   1. Default background colour of each hex.
   1. Background colour of map rectangle.
   1. Display toggle for map border.
1. Ability to edit hex attributes:
   1. Edit each edge.
   1. Edit content.
1. The hex map can either draw content of each hex or just be an overlay to an image.
1. Each hex will have a use data map to allow attaching data directly to the hex map model.
## Parts of a hex
+ The outline of hexagon is referred to as the border.
+ Each of the six sides of a hexagon is referred to as an edge.  The top most horizontal one is referred to as index 0 and then index 1 is the next side clockwise.
  + Each edge is a trapezoid with the short side being the side of the hexagon with a depth equal to 5% of the length of side.
  + The trapezoid does not go the full width - at the corners there is a rhombus.
  + The rhombus must support staying inside the hex and crossing over to the next hex or goin up into the next hex.
  + "Nibs" are currently not allowed - a nib is where one hex rhombus just grabs a tiny bit from the neighbouring hexes.
+ The entire interior of a hex is called the terrain.
+ Hexes can display units.
+ Support for decorations will be included.  The decorations can be applied to either an edge or the terrain.
## TODO
+ Should I want/need security in the future look at DOMPurify.
  + The editor is for game creators not game players so I don't see a need for security at this point.  If you can't trust yourself who can you trust?
+ Create a way to edit individual hexes.
  + Terrain, edges and borders.
+ Devise a way to easily draw borders and rivers
+ Devise a way to fill or something like that
+ Add support for customizing the following
  + Cursor
    + Colour
    + Rate - can be zero
  + Hex
    + Render hex id
    + Location of hex id - top, below top edge, middle, above bottom edge, bottom