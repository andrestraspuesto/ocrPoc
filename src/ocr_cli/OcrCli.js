const OCR_URL = 'https://api.ocr.space/parse/image'

const imageToJson = async (base64, key) =>{
    const formData = new FormData();
    formData.append("base64image",  `data:image/jpg;base64,${base64}`);
    formData.append("language"   , "eng");
    formData.append("apikey"  , key);
    const options = {
        method: 'POST',
        body: formData,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    }
    try{
        console.log("asking...")
        const query = await fetch(OCR_URL , options)
        console.log("get json...")
        const json = await query.json();
        if(json.OCRExitCode === 1 && json.ParsedResults.length){
            return {success: true, text: json.ParsedResults[0].ParsedText}
        } else {
            return {success:false, text: json.ErrorDetails||'Empty text'}
        }
    } catch(err){
        console.error(err)
    }
    

}

export {imageToJson}