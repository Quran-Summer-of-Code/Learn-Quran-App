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


