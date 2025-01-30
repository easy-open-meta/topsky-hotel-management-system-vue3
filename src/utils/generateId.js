let idCache = {};
let lockTimeCode = {};

export function getListNewId(preCode = "", fillCount = 0, pCount = 1, separatorChar = "") {
  const idList = [];
  for (let i = 0; i < pCount; i++) {
    let sb = preCode;
    const now = new Date();
    const text = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    sb += text;
    sb += separatorChar;

    
    const lock = lockTimeCode;
    if(lock){
       
     if (!idCache[text]) {
       if (Object.keys(idCache).length > 10) {
         idCache = {};
       }
       idCache[text] = 1;
      } else {
        if (idCache[text] > 8998) {
          while (true) {
            const nowInner = new Date();
            const textInner = nowInner.getFullYear().toString() + String(nowInner.getMonth() + 1).padStart(2, '0') + String(nowInner.getDate()).padStart(2, '0');
            if (text === textInner) {
                continue;
            }
            break;
          }
          continue;
        }
        idCache[text]++;
      }
      const value = String(idCache[text]).padStart(fillCount, '0');
      sb += value;
      idList.push(sb);
    }
  }
  return idList;
}
