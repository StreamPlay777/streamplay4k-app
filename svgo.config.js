/**
 * Network logo optimisation.
 *
 * The wall renders every mark in flat white (CSS `brightness(0) invert(1)`),
 * so colour data is dead weight — but it is left in the file rather than
 * stripped, in case a logo is later shown at full colour on a light surface.
 * viewBox is preserved because the wall scales marks to a fixed height.
 */
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,        // needed for height-based scaling
          cleanupIds: { minify: true },
        },
      },
    },
    'removeDimensions',                // let CSS drive size, not the file
    { name: 'convertPathData', params: { floatPrecision: 2 } },
    { name: 'cleanupNumericValues', params: { floatPrecision: 2 } },
  ],
}
