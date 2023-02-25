class APIS {
    constructor(mastodon) {
        this.apiUrl = mastodon.apiUrl
        this.mastodon = mastodon
        this.account = new AccountAPI(this.mastodon)
        this.status = new StatusAPI(this.mastodon)
        this.media = new MediaAPI(this.mastodon)
    }
}

class Helper {
    static extractNextId(resp){
        const links = resp.headers.link && resp.headers.link.split(',')
        let max_id = ""
        let since_id = ""
        if(links.length) {
            if(links[0].indexOf("max_id=") >= 0){
                const fromIndex = links[0].indexOf("max_id=") + 7
                const toIndex = links[0].indexOf(">; rel=")
                max_id = links[0].substring(fromIndex, toIndex)
            }
            
            if(links[1].indexOf("since_id=") >= 0){
                const fromIndex = links[1].indexOf("since_id=") + 9
                const toIndex = links[1].indexOf(">; rel=")
                since_id = links[1].substring(fromIndex, toIndex)
            }
        }
        return {
            nextId: max_id,
            previousId: since_id
        }
    }
}
class AccountAPI {
    constructor(mastodon) {
        this.mastodon = mastodon
        this.apiUrl = `${mastodon.apiUrl}/accounts`
    }

    verifyAccountCredentials() {
        return this.mastodon.get(`${this.apiUrl}/verify_credentials`, {})
    }

    follow(accountId){
        if(!accountId) {
            return Promise.reject("Account id is required")
        }
        return this.mastodon.post(`${this.apiUrl}/${accountId}/follow`, {})
    }
    unfollow(accountId){
        if(!accountId) {
            return Promise.reject("Account id is required")
        }
        return this.mastodon.post(`${this.apiUrl}/${accountId}/unfollow`, {})
    }
    
    get(accountId) {
        if(!accountId) {
            return Promise.reject("Account id is required")
        }
        return this.mastodon.get(`${this.apiUrl}/${accountId}`, {})
    }

    followers(accountId, limit = 10, startId = null){
        if(!accountId) {
            return Promise.reject("Account id is required")
        }
        const data = {}
        if(limit){
            data.limit = limit
        }
        if(startId) {
            data.max_id = startId
        }
        return new Promise((resolve, reject) => {
            this.mastodon.get(`${this.apiUrl}/${accountId}/followers`, data)
                .then(data => {
                    const meta = Helper.extractNextId(data.resp)
                    if(meta){
                        data.meta = meta 
                    }
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    followings(accountId, limit = 10, startId = null){
        if(!accountId) {
            return Promise.reject("Account id is required")
        }
        const data = {}
        if(limit){
            data.limit = limit
        }
        if(startId) {
            data.max_id = startId
        }
        return new Promise((resolve, reject) => {
            this.mastodon.get(`${this.apiUrl}/${accountId}/following`, data)
                .then(data => {
                    const meta = Helper.extractNextId(data.resp)
                    if(meta){
                        data.meta = meta 
                    }
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    search(query, offset, limit, isExactMatch = false, isRaw = false){
        if(!query) {
            return Promise.reject("Query is required")
        }
        return new Promise((resolve, reject) => {
            this.mastodon.get(`${this.apiUrl}/search`, {q: query, offset, limit, resolve: isExactMatch})
                .then(data => {
                    if(isRaw){
                        return resolve(data)
                    }
                    const res = data.data.map(account => {
                        return {
                            id: account.id,
                            username: account.username,
                            url: account.url,
                            image: account.avatar_static
                        }
                    })
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

class StatusAPI {
    constructor(mastodon) {
        this.mastodon = mastodon
        this.apiUrl = `${mastodon.apiUrl}/statuses`
    }

    create(message, mediaIds, inReplyToId) {
        if(!message && (!mediaIds || mediaIds.length === 0)){
            return Promise.reject("Either message or media is required");
        }
        
        const data = {}
        if(message){
            data.status = message
        }
        if(mediaIds && Array.isArray(mediaIds) && mediaIds.length) {
            data.media_ids = mediaIds
        }
        if(inReplyToId){
            data.in_reply_to_id = inReplyToId
        }
        return this.mastodon.post(`${this.apiUrl}`, data)
    }

    get(statusId){
        if(!statusId) {
            return Promise.reject("Status id is required")
        }
        return this.mastodon.get(`${this.apiUrl}/${statusId}`, {})
    }
    remove(statusId){
        if(!statusId) {
            return Promise.reject("Status id is required")
        }
        return this.mastodon.delete(`${this.apiUrl}/${statusId}`, {})
    }
    
    markFavourite(statusId) {
        if(!statusId) {
            return Promise.reject("Status id is required")
        }
        return this.mastodon.post(`${this.apiUrl}/${statusId}/favourite`, {})
    }

    unmarkFavourite(statusId) {
        if(!statusId) {
            return Promise.reject("Status id is required")
        }
        return this.mastodon.post(`${this.apiUrl}/${statusId}/unfavourite`, {})
    }

    share(statusId) {
        if(!statusId) {
            return Promise.reject("Status id is required")
        }
        return this.mastodon.post(`${this.apiUrl}/${statusId}/reblog`, {})
    }

    update(statusId, message, mediaIds) {
        if(!statusId){
            return Promise.reject("Status id is required")
        }

        if(!message && (!mediaIds || mediaIds.length === 0)){
            return Promise.reject("Either message or media is required")
        }
        
        const data = {}
        if(message){
            data.status = message
        }
        if(mediaIds && Array.isArray(mediaIds) && mediaIds.length) {
            data.media_ids = mediaIds
        }
        return this.mastodon.put(`${this.apiUrl}/${statusId}`, data)
    }
}

class MediaAPI {
    constructor(mastodon) {
        this.mastodon = mastodon
        this.apiUrl = `${mastodon.apiUrlV2}/media`
    }

    upload(file, thumbnail) {
        if(!file){
            return Promise.reject("Media file is required")
        }
        
        const data = {
            file
        }
        if(thumbnail){
            data.thumbnail = thumbnail
        }
        
        return this.mastodon.post(`${this.apiUrl}`, data)
    }

    get(mediaId) {
        if(!mediaId){
            return Promise.reject("Media Id is required")
        }
        return this.mastodon.get(`${this.apiUrl}/${mediaId}`, data)
    }

    update(mediaId, thumbnail) {
        if(!mediaId){
            return Promise.reject("Media Id is required")
        }

        if(!thumbnail){
            return Promise.reject("Thumbnail is required")
        }
        const data = {
            thumbnail
        }
        return this.mastodon.put(`${this.apiUrl}/${mediaId}`, data)
    }
}
module.exports = APIS