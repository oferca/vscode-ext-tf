const path = require('path');
const appRoot = path.resolve(__dirname);

class Logger {
    uniqueId

    async getDb () {
        if (!this._db) this._db = await this.initFireBase()
        return this._db 
    }
    
    async log (rec) {
        try{
            const { collection: fsCollection , addDoc } = require("firebase/firestore");
            var pjson = require(appRoot + '/../../package.json');
            rec.version = pjson.version;    
            const collection = fsCollection(await this.getDb(), "tfh")
            rec.uniqueId = this.uniqueId
            rec.ts = Date.now()
            rec.platform = os.platform()

            try {
                await addDoc(collection, rec);
            } catch (e) {
                console.log(e)
            }
        }
        catch(e){}
        return true
    }
    
    constructor() {
        this.uniqueId = new Date().valueOf()
    }
}

module.exports = { Logger }