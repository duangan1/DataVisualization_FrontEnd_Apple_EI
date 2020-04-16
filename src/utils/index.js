const S4 = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

// Generate a pseudo-GUID by concatenating random hexadecimal.
export const guid = () =>
  S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()

export const timestamp = () => new Date().getTime()

export const ErrorLogger = (error) => console.error(error)
export const CommonLogger = (msg) => console.log(msg)
const baseURL = process.env.VUE_APP_BASE_API

export const exportFile = (url) => {
  window.open(baseURL + url)
}
