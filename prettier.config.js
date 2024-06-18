/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  endOfLine: 'auto',
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
}

export default config
