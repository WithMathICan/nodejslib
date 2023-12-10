'use strict'

const { CookiesStore } = require("./cookie-store")

class ServerContext {
   
   constructor(req, protocol) {
      this.cookieStore = new CookiesStore(req)
      this.protocol = protocol
   }

   writeHeaders(res) {
      let cookieHeaders = [
         ...Object.values(this.cookieStore.itemsToAdd).map(obj => this.#getCookieHeader(obj)),
         ...Object.keys(this.cookieStore.itemsToRemove).map(key => this.#getCookieHeader({key}))
      ]
      for (let h of cookieHeaders) res.setHeader('Set-Cookie', h)
   }

   #getCookieHeader({key, value = '0', maxAgeSeconds = 0, sameSite = 'Lax', httpOnly=true}) {
      //`session_id=${sessionObj.session_id}; SameSite=Lax; HttpOnly; Domain=localhost; Secure; Path=/api; Max-Age=${SESSION_DURATION / 1000};`
      let header = [
         `${key}=${value};`, 
         `SameSite=${sameSite};`, 
         // `Domain=${config.DOMAIN};`, 
         `Path=/;`, 
         `Max-Age=${maxAgeSeconds};`
      ]
      if (httpOnly) header.push('HttpOnly;')
      if (this.protocol === 'https') header.push('Secure;')
      return header.join(' ')
   }
}

module.exports = {ServerContext}
