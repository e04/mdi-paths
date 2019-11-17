# mdi-paths

This library is a collection of SVG paths, sourced from [the MaterialDesign project](https://github.com/google/material-design-icons). In particular, this was created for Google Maps API v3 markers.

# Usage

`npm i mdi-paths`

## import each icons

```js
import {library_books} from 'mdi-paths'

const marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(0, 0),
    icon: {
                fillColor: '#FFFFFF',
                fillOpacity: 1,
                path: library_books,
                strokeColor: '#000000',
                strokeWeight: 2,
    },
})

// Names that begin with a number must begin with an underscore.
import {_3d_rotation} from 'mdi-paths'

// Names that are JavaScript's keywords must end with an underscore.
import {delete_} from 'mdi-paths'
```

## import all icon paths

```js
import mdiPaths from 'mdi-paths'

const marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(0, 0),
    icon: {
        fillColor: '#FF0000',
        fillOpacity: 1,
        path: mdiPaths.library_books,
        scale: 1,
        strokeColor: '#FF0000',
        strokeWeight: 1,
    },
})
```
