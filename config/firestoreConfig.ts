import { FirebaseConfig } from "./fbConfig";
import { getFirestore } from "firebase/firestore";


export class FirestoreConfig{
    private static instance:FirestoreConfig;
    private db;

    private constructor(){
        const instance=FirebaseConfig.getInstance()
        this.db=getFirestore(instance.getApp());
    }

    public static getInstance(){
        if(!this.instance){
            this.instance=new FirestoreConfig();
        }
        return this.instance;
    }

    getDb(){
        return this.db;
    }
}