module.exports = class RenderError extends Error {
  constructor(message) {
    super("Unable to Render: " + message)
    this.name = "RenderError"
  }
}
