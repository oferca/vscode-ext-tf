const appRoot = path.resolve(__dirname);

class Logger {
    uniqueId

    async getDb () {
        if (!this._db) this._db = await this.initFireBase()
        return this._db 
    }
    
    log = async (rec) => {
        try{
            const { collection: fsCollection , addDoc } = require("firebase/firestore");
            var pjson = require(appRoot + '/../../package.json');
            rec.version = pjson.version;    
            const collection = fsCollection(await this.getDb(), "tfh")
            rec.uniqueId = this.uniqueId
            
            try {
                await addDoc(collection, rec);
            } catch (e) {
                console.log(e)
            }
        }
        catch(e){}
        return true
    }
    
    constructor(uniqueId) {
        this.uniqueId = uniqueId
    }
}

module.exports = { Logger }