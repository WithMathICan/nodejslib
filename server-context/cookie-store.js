'use strict'

class CookiesStore {
   /** @type {Record<string, string>} */
   items
   /** @type {Record<string, {key: string, maxAgeSeconds: number, value: any}>} */
   itemsToAdd
   /** @type {Record<string, string>} */
   itemsToRemove

   constructor(req) {
      this.items = parseCookies(req)
      this.itemsToAdd = {}
      this.itemsToRemove = {}
   }

   getItem(key) {
      if (key in this.items) return this.items[key]
      return null
   }

   removeItem(key) {
      delete this.itemsToAdd[key]
      this.itemsToRemove[key] = key
   }

   /** @param {{key: string, maxAgeSeconds: number, value: any}} params */
   addItem(params) {
      delete this.itemsToRemove[params.key]
      this.itemsToAdd[params.key] = params
   }
}

function parseCookies(req) {
   /** @type {Record<string, string>} */
   const list = {};
   const rc = req.headers.cookie;
   if (!rc) return list

   rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const key = parts.shift()
      if (key) list[key.trim()] = decodeURI(parts.join('='));
   });

   return list;
}



module.exports = {CookiesStore}
