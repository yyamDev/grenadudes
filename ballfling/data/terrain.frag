// fragment shader for rendering terrain

uniform sampler2D txtSolid;   // solid terrain image texture
uniform sampler2D txtKill;    // ^
uniform sampler2D txtBouncy;  // ^
uniform sampler2D txtSlow;    // ^
uniform sampler2D txtSticky;  // ^
uniform sampler2D txtFinish;  // ^
uniform sampler2D txtData;    // terrain data texture
uniform vec4 edgeColour;
uniform float sizeX;          // size of rendering space
uniform float sizeY;          // ^
uniform float screenWidth;    // width of the screen in pixels
uniform float screenHeight;   // ^
uniform float cameraX;
uniform float cameraY;

vec4 texture_coordinate(vec4 dataCoord) {
    return vec4(dataCoord.x / sizeX, (screenHeight - dataCoord.y) / sizeY, dataCoord.z, dataCoord.a);
}

bool edge(vec4 pos) {
    // Is pos near empty space?
    float rad = 3.0;
    for (float y = -rad; y < rad + 1.0; ++y) {
        for (float x = -rad; x < rad + 1.0; ++x) {
            vec4 probe;
            probe.x = pos.x + (x / sizeX);
            probe.y = pos.y + (y / sizeY);
            probe.z = pos.z;
            probe.a = pos.a;
            vec4 dataPixel = texture2D(txtData, probe.xy);
            dataPixel.x *= 255;
            dataPixel.y *= 255;
            dataPixel.z *= 255;
            dataPixel.a *= 255;
            if ((dataPixel.r == 0 && dataPixel.g == 128 && dataPixel.b == 128) ||
                (dataPixel.r == 0 && dataPixel.g == 0 && dataPixel.b == 0)) {
                // Probed empty space.
                return true;
            }
        }
    }
    return false;
}

void main() {
    // calculate texture lookup coordinates
    vec4 dataCoord;
    dataCoord.x = gl_FragCoord.x + cameraX;
    dataCoord.y = gl_FragCoord.y - cameraY;
    vec4 dataTexCoord = texture_coordinate(dataCoord);

    if (dataCoord.x >= cameraX && screenHeight - dataCoord.y >= cameraY && dataCoord.x < cameraX + screenWidth && screenHeight - dataCoord.y < cameraY + screenHeight) {
        // lookup terrain type in map file
        vec4 dataPixel = texture2D(txtData, dataTexCoord.xy);
        //vec4 dataPixel = vec4(0.0, 0.0, 0.0, 0.0);
        //dataPixel.xyza *= 255;
        dataPixel.x *= 255;
        dataPixel.y *= 255;
        dataPixel.z *= 255;
        dataPixel.a *= 255;
        vec4 pixel = vec4(0.0, 0.0, 0.0, 1.0);

        // sample from correct terrain texture
        if (dataPixel.r == 0 && dataPixel.g == 128 && dataPixel.b == 128) {
            pixel = texture2D(txtKill, gl_TexCoord[0].xy);
            gl_FragColor = gl_Color * pixel;
            //gl_FragColor.a = 0.5;
        }
        else if (dataPixel.r == 255 && dataPixel.g == 255 && dataPixel.b == 255) {
            if (edge(dataTexCoord))
                pixel = edgeColour;
            else
                pixel = texture2D(txtSolid, gl_TexCoord[0].xy);
            gl_FragColor = gl_Color * pixel;
        }
        else if (dataPixel.r == 67 && dataPixel.g == 191 && dataPixel.b == 6) {
            pixel = texture2D(txtBouncy, gl_TexCoord[0].xy);
            gl_FragColor = gl_Color * pixel;
        }
        else if (dataPixel.r == 210 && dataPixel.g == 176 && dataPixel.b == 60) {
            pixel = texture2D(txtSlow, gl_TexCoord[0].xy);
            gl_FragColor = gl_Color * pixel;
        }
        else if (dataPixel.r == 255 && dataPixel.g == 174 && dataPixel.b == 201) {
            pixel = texture2D(txtSticky, gl_TexCoord[0].xy);
            gl_FragColor = gl_Color * pixel;
        }
        else if (dataPixel.r == 237 && dataPixel.g == 28 && dataPixel.b == 36) {
            pixel = texture2D(txtFinish, gl_TexCoord[0].xy);
            gl_FragColor = gl_Color * pixel;
        }
        else
            gl_FragColor.a = 0;
    }
}