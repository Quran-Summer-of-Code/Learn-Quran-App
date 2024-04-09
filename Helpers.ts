import surasList from "./Quran/surasList.json";

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


export function getSurahIndGivenAyah(ayahNum: number) {
    const firstAyahs = surasList.map((sura: any) => sura.firstAyah);     // indices of first ayah of each surah
    for (let i = 0; i < firstAyahs.length - 1; i++) {
        if (ayahNum >= firstAyahs[i] && ayahNum < firstAyahs[i + 1]) {
            return i;
        }
    }

    return 113;       // return last surah (must be >= firstAyah[113])
}

export function getLocalAyahInd(ayahNum: number) {
    return ayahNum - surasList[getSurahIndGivenAyah(ayahNum)].firstAyah
}

export function getGlobalAyahInd(surahInd: number, ayahNum: number) {
    return surasList[surahInd].firstAyah + ayahNum
}

export function isWithinRange(x: number, range: number[]) {
    try {
        return x >= range[0] && x <= range[1];
    } catch {
        return false;
    }
}

export function preprocessJuzData(juzList: any[]): Record<number, string> {
    const juzData: Record<number, string> = {};
    for (const juz of juzList) {
        juzData[juz.ind] = juz.name;
    }
    return juzData;
}

export function getJuzName(index: number, juzData: Record<number, string>): string {
//    if( juzData[index])
//     console.log(juzData[index])
    return juzData[index] || "";
}