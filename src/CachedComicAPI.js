import { fetchLatestComicInfo, fetchComicInfo } from './xkcdAPI'

export default class CachedComicAPI {
  constructor() {
    this._latestNum = null
    this.memory = new Map()
  }

  async initLatest() {
    const latestInfo = await fetchLatestComicInfo()
    this.memory.set(latestInfo.num, latestInfo)
    this._latestNum = latestInfo.num
    return latestInfo
  }

  async fetchNum(num) {
    if (this.memory.has(num)) {
      return this.memory.get(num)
    }
    const comicInfo = await fetchComicInfo(num)
    this.memory.set(comicInfo.num, comicInfo)
    return comicInfo
  }

  get latestNum() {
    return this._latestNum
  }
}
