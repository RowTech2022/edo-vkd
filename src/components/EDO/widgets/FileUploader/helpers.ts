export const b64toBlob = (base64: any) => {
  try {
    console.log('Start')
    return fetch(base64).then((res) => res.blob())
  } catch {
    console.log('Catch')

    return null
  }
}
