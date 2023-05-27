const path = require('path');
const appRoot = path.resolve(__dirname);

class Logger {
    uniqueId
    _db
    async initFireBase () {
        try {
            const { initializeApp } = require("firebase/app");
            const { getFirestore } = require("firebase/firestore");
            const firebaseConfig = {
                apiKey: "AIzaSyBbqdFYxRvKPRkjoAaQjOCNc00_6f2o3Xc",
                authDomain: "terraform-progress-bar.firebaseapp.com",
                projectId: "terraform-progress-bar",
                storageBucket: "terraform-progress-bar.appspot.com",
                messagingSenderId: "664142118300",
                appId: "1:664142118300:web:7ed9790fdd1d201bed5c59",
                measurementId: "G-B74CDMSJMH"
            };
            const app = await initializeApp(firebaseConfig);
            const db = getFirestore(app);
            return db
        } catch (e) { }
    }

    async getDb () {
        if (!this._db) this._db = await this.initFireBase()
        return this._db 
    }
    
    async log (rec) {
        if (this.disabled) return
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
    
    constructor(disabled = false) {
        this.disabled = disabled
        this.uniqueId = new Date().valueOf()
    }
}

module.exports = { Logger }