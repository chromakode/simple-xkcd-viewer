import fetchJSONP from './fetchJSONP'

const BASE_URL = 'https://dynamic.xkcd.com/api-0/jsonp/comic'

export function fetchComicInfo(num) {
  return fetchJSONP(`${BASE_URL}/${num}`)
}

export function fetchLatestComicInfo() {
  return fetchJSONP(`${BASE_URL}/info.0.json`)
}
