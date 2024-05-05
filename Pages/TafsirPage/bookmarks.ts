  // bookmarks is an array of arrays state

  export const addBookmark = (surahInd: number, ayahInd: number, bookmarks: any, setBookmarks: Function) => {
    // Copy the bookmarks array
    const newBookmarks = [...bookmarks];
    const newList = [...newBookmarks[surahInd]];
    newList.push(ayahInd);
    // Push the ayahInd into the specified surah's bookmarks array
    newBookmarks[surahInd] = newList
    // Update the state with the new bookmarks array
    setBookmarks(newBookmarks);
  };

  export function removeBookmark(surahInd: number, ayahInd: number, bookmarks: any, setBookmarks: Function) {
    // Copy the bookmarks array
    const newBookmarks = [...bookmarks];
    // Find the index of the ayahInd to remove
    const indexToRemove = newBookmarks[surahInd].indexOf(ayahInd);
    // If the ayahInd exists, remove it
    if (indexToRemove !== -1) {
      // Create a new array without the removed ayahInd
      const newSurahBookmarks = [
        ...newBookmarks[surahInd].slice(0, indexToRemove),
        ...newBookmarks[surahInd].slice(indexToRemove + 1)
      ];
      // Update the state with the new bookmarks array
      newBookmarks[surahInd] = newSurahBookmarks;
      setBookmarks(newBookmarks);
    }
  }

  export function checkBookmark(surahInd: number, ayahInd: number, bookmarks: any) {
    // Check if the ayahInd exists in the bookmarks array at the specified surahInd
    return bookmarks[surahInd].includes(ayahInd);
  }


/*
Has functions to add, remove or check the existence of bookmarks
*/
