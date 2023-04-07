import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Components/FirebaseDb/Firebase";

export class ImageController {
    async uploadFile(file, id, naming) {
        var rtnVal;
        const imageRef = ref(storage, id+"-" + naming + "pic");
        await uploadBytes(imageRef, file);
        
        getDownloadURL(imageRef).then((url)=> {
            rtnVal = url;
        });
        return rtnVal;
    }
}