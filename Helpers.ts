// @ts-nocheck
import surasList from "./Quran/surasList.json";
import suras from "./Quran/suras.json";

// sheikh URL handles and their names
export const sheiksDict: { [key: string]: string } = {
    "ar.alafasy": "مشاري العفاسي",
    "ar.husarymujawwad": "محمود خليل الحصري",
    "ar.abdulsamad": "عبدالباسط عبدالصمد",   // will require bitrate 64
    "ar.shaatree": "أبو بكر الشاطري",
    "ar.hudhaify": "علي بن عبدالرحمن الحذيفي",
    "ar.mahermuaiqly": "ماهر المعيقلي",
    "ar.muhammadjibreel": "محمد جبريل",
    "ar.minshawi": "محمد صديق المنشاوي",
  };

// After calling this audioList state will have an audio object for each ayah in Quran (interface below)
export const prepareAudio = async (baseUrl: string, author: string, img: NodeRequire, setAudioList: CallableFunction) => {
    interface AudioObject {
        title: string;
        url: string;
        artist: string;
        artwork: NodeRequire;
    }

    try {
        let audioObjs: AudioObject[] = [];
        // Loop over all 6236 ayahs of the Quran
        // Skips the Bismillah in Fatiha (align with moshaf numbering of Ayat)
        for (let i = 2; i <= 6236; i++) {
            let url = `${baseUrl}/${i}.mp3`;
            let title = suras[getSurahIndGivenAyah(i - 2)][getLocalAyahInd(i - 2)].ayah;
            // subtracted 2 to account for zero indexing and the Bismillah
            let obj: AudioObject = {
                title: title,
                url: url,
                artist: author,
                artwork: img,
            };
            audioObjs.push(obj);
        }
        // for each surah in surasList add bismillah (`${baseUrl}/${0}.mp3`) with skips of numAyas
        // num_ayas_so_far = 0
        // for (let i = 0; i < surasList.length; i++) {
        //     let url = `${baseUrl}/${1}.mp3`;
        //     let title = surasList[i].name;
        //     let obj: AudioObject = {
        //         title: title,
        //         url: url,
        //         artist: author,
        //         artwork: img,
        //     };
        //     // insert in at num_ayas_so_far
        //     audioObjs.splice(num_ayas_so_far, 0, obj);
        //     num_ayas_so_far += parseInt(surasList[i].numAyas);
        //     console.log(num_ayas_so_far);
        //     console.log("\n");
        // }

        setAudioList(audioObjs);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Converts English number to Arabic number
export function englishToArabicNumber(englishNumber: number): string {
    const arabicNumbers: { [key: string]: string } = {
        '0': '٠', '1': '١', '2': '٢', '3': '٣',
        '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };

    const englishDigits: string[] = englishNumber.toString().split('');
    let arabicNumber: string = '';

    for (let i = 0; i < englishDigits.length; i++) {
        arabicNumber += arabicNumbers[englishDigits[i]] || englishDigits[i];
    }
    return arabicNumber;
}


// Given a global ayahNum (i.e., < 6235), return the corresponding surah index (0-113)
export function getSurahIndGivenAyah(ayahNum: number) {
    const firstAyahs = surasList.map((sura: any) => sura.firstAyah);     // indices of first ayah of each surah
    for (let i = 0; i < firstAyahs.length - 1; i++) {
        if (ayahNum >= firstAyahs[i] && ayahNum < firstAyahs[i + 1]) {
            return i;
        }
    }

    return 113;       // return last surah (must be >= firstAyah[113])
}

// Given a global ayahNum (i.e., < 6235), return the corresponding local ayah index (0-lastAyahInSurah-1)
export function getLocalAyahInd(ayahNum: number) {
    return ayahNum - surasList[getSurahIndGivenAyah(ayahNum)].firstAyah
}

// Given a global surah index (0-113) and its local ayah index (0-lastAyahInSurah-1), return the global ayah index (i.e., < 6235)
export function getGlobalAyahInd(surahInd: number, ayahNum: number) {
    return surasList[surahInd].firstAyah + ayahNum
}

// Given x and [min, max], return true if x ∈ [min, max]
export function isWithinRange(x: number, range: number[]) {
    try {
        return x >= range[0] && x <= range[1];
    } catch {
        return false;
    }
}

// Given index of a word in some Surah and index os some ayah in the same surah see if the word exists in the Ayah
export function isWordInAyah(wordInd:number, ayahInd:number, currentSurahByWords:any) {
    return  isWithinRange(wordInd, currentSurahByWords.ayahRanges[ayahInd])
}


// get the index of juz given the surahInd and its local ayahInd
export function findJuzSurahAyahIndex(juzData:any, surahIndex:number, ayahIndex:number) {
    for (let i = 0; i < juzData.length; i++) {
        const juz = juzData[i];
        if (juz.juzSuras.includes(surahIndex)) {
            const surahSplitIndex = juz.juzSuras.indexOf(surahIndex);
            const correspondingSplit = juz.splits[surahSplitIndex];
            if (correspondingSplit && correspondingSplit[1] <= ayahIndex && ayahIndex <= correspondingSplit[0]) {
                return i;
            }
        }
    }
    return null;
}


// Copied from https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
// Helps brighten or darken a given color (and more stuff) which is used for styling
export const colorize=(p,c0,c1=null,l=null)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return "";
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return "";
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return "";
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return "";
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}


// Custom sort for section indices while handling supertopics (ayah index ends with S)
export const customSort = (a: string, b: string): number => {
    // Function to parse each part of the keys
    const parsePart = (part: string): number | string => {
      const num = parseInt(part);
      return isNaN(num) ? part : num;
    };
  
    // Split keys into parts and parse them
    const partsA: (number | string)[] = a.match(/\d+|\D+/g)!.map(parsePart);
    const partsB: (number | string)[] = b.match(/\d+|\D+/g)!.map(parsePart);
  
    // Compare each part of the keys
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i];
      const partB = partsB[i];
  
      // If one part exists and the other doesn't, prioritize the existing one
      if (partA !== undefined && partB === undefined) return -1;
      if (partA === undefined && partB !== undefined) return 1;
  
      // Compare parts
      if (partA !== partB) return partA < partB ? -1 : 1;
    }
  
    return 0; // Keys are equal
  };

  // To get length of bookmarks array (list of litsts)
  export function getTotalLength(arr: number[][]) {
    let totalElements = 0;
    for (let i = 0; i < arr.length; i++) {
      totalElements += arr[i].length;
    }
    return totalElements;
  }
  
  // To be able to index its corresponding flattened list
  export function getFlattenedIndex(
    arr: number[][],
    outerIndex: number,
    innerIndex: number
  ) {
    let flattenedIndex = 0;
    for (let i = 0; i < outerIndex; i++) {
      flattenedIndex += arr[i].length;
    }
    flattenedIndex += innerIndex;
    return flattenedIndex;
  }

/*
This file has helper functions used throughout the app (e.g., mapping words, juzs, ayahs together).
*/

