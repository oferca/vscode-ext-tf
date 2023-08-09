const path = require('path');
const os = require('os');
const appRoot = path.resolve(__dirname);
const { runCountKey } = require("./constants")

class Logger {
    _db
    uniqueId
    stationId
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
    
    async log (_rec) {
        if (this.disabled) return
        const rec = typeof _rec === "string" ? { message : _rec } : _rec
        try{
            const { collection: fsCollection , addDoc } = require("firebase/firestore");
            var pjson = require(appRoot + '/../../package.json');
            rec.version = pjson.version;    
            const collection = fsCollection(await this.getDb(), "tfh")
            rec.uniqueId = this.uniqueId
            rec.stationId = this.stationId
            rec.ts = Date.now()
            rec.platform = os.platform()
            rec.date = new Date(Date.now())
            rec.runCount = this.stateManager.getState(runCountKey)

            // Remove credentials info in logs
            if (rec.credentials) try { 
                rec.credentials = rec.credentials.substring(0,15)
            }catch (e) {}

            try {
                await addDoc(collection, rec);
            } catch (e) {
                console.log(e)
            }
        }
        catch(e){}
        return true
    }
    
    logError(e) {
        const { message, stack } = e
		const errorObj = JSON.parse(JSON.stringify(e))
		errorObj.msg = message
		errorObj.stack = stack
		this.log(errorObj)
    }
    constructor(disabled = false, stateManager) {
        this.disabled = disabled
        this.stateManager = stateManager
    }
}

module.exports = { Logger }