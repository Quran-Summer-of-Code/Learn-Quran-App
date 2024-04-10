import surasList from "./Quran/surasList.json";
import suras from "./Quran/suras.json";

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

export function isWordInAyah(wordInd:number, ayahInd:number, currentSurahByWords:any) {
    return  isWithinRange(wordInd, currentSurahByWords.ayahRanges[ayahInd])
}

// Create a mapping from juz index to juz name given array of juz objects (as in juzInfo.json)
export function preprocessJuzData(juzList: any[]): Record<number, string> {
    const juzData: Record<number, string> = {};
    for (const juz of juzList) {
        juzData[juz.ind] = juz.name;
    }
    return juzData;
}

// Get juz name given juz index (assumes juzInfo is preprocessed with preprocessJuzData)
export function getJuzName(index: number, juzData: Record<number, string>): string {
    return juzData[index] || "";
}