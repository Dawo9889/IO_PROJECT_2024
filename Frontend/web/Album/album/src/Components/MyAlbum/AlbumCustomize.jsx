﻿export const updateHeader = (pages, setPages, selectedPage, inputText, setInputText) => {
    setPages(pages.map(page =>
        page.number === selectedPage ? { ...page, header: inputText } : page
    ));
    setInputText("");
};

export const updateLayout = (pages, setPages, selectedPage, layout) => {
    setPages(pages.map(page =>
        page.number === selectedPage
            ? { ...page, layout, images: [] } // Reset zdjęć
            : page
    ));
};

export const handleJumpToPage = (page, flipBookRef) => {
    const pageIndex = page + 1;
    if (flipBookRef.current.pageFlip()) {
        flipBookRef.current.pageFlip().flip(pageIndex, "top");
    }
};

export const handleWeddingSelect = (weddingId, weddingName, setSelectedWedding, setSelectedWeddingName, setPages) => {
    setSelectedWedding(weddingId);
    setSelectedWeddingName(weddingName);

    localStorage.setItem("selectedWedding", weddingId);
    localStorage.setItem("selectedWeddingName", weddingName);

    setPages((prevPages) =>
        prevPages.map((page) => ({
            ...page,
            images: [],
        }))
    );
};



export const addPage = (pages, setPages, setBookKey) => {
    const maxNumber = Math.max(...pages.map(page => page.number), 0);
    const newPages = [
        {
        number: maxNumber + 1,
        header: `Main description ${maxNumber + 1}`,
        images: [],
        layout: "default",
        },
        {
            number: maxNumber + 2,
            header: `Main description ${maxNumber + 2}`,
            images: [],
            layout: "default",
        },
    ];
    setPages([...pages, ...newPages]);
    setBookKey(prevKey => prevKey + 1);
};

export const handleImageDrop = (pages, setPages, src, pageNumber, layout = "default", dropIndex = null, author, description) => {

    setPages(pages.map(page => {
        if (page.number === pageNumber) {
            let maxImages = 1;
            if (page.layout === "vertical") maxImages = 2;
            if (page.layout === "horizontal") maxImages = 2;
            if (page.layout === "grid-2x2") maxImages = 4;
            if (dropIndex != null) {
                const updatedImages = [...page.images];
                updatedImages[dropIndex] = { src, layout, author, description };
                return { ...page, images: updatedImages };
            }

            if (page.images.length < maxImages) {
                return {
                    ...page,
                    images: [...page.images, { src, layout, author, description }]
                };
            }
        }
        return page;
    }));
};
