import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell } from "docx";

export const saveAlbumAsHTML = async (pages) => {
    const zip = new JSZip();
    const albumFolder = zip.folder("album");
    const imagesFolder = albumFolder.folder("zdjęcia");

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mój Album</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .album {
                width: 80%;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .cover {
                text-align: center;
                padding: 50px;
                background-color: #ff7f50;
                color: white;
                font-size: 2em;
                font-weight: bold;
                border-radius: 15px;
                margin-bottom: 20px;
            }
            .cover h2 {
                margin: 0;
            }
            .page {
                margin-bottom: 20px;
                padding: 20px;
                background-color: #fafafa;
                border-radius: 10px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .page h1 {
                font-size: 1.5em;
                margin-bottom: 10px;
            }
            .images {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .page-image {
                width: 100%;
                max-width: 300px;
                margin: 10px 0;
                border-radius: 8px;
            }
            .page-number {
                font-size: 1.2em;
                font-weight: bold;
                margin-top: 10px;
            }
            .page img {
                max-width: 100%;
                height: auto;
                margin: 10px 0;
            }
            .page .drop-zone {
                border: 2px dashed #ccc;
                padding: 20px;
                margin: 10px 0;
                text-align: center;
                border-radius: 8px;
                min-height: 100px;
            }
            .page .drop-text {
                color: #aaa;
                font-size: 1em;
            }
            .form-control {
                padding: 10px;
                font-size: 1em;
                margin: 5px 0;
                border-radius: 5px;
                border: 1px solid #ccc;
            }
            .btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                margin: 5px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .btn:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="album">
            <div class="cover">
                <h2>Wesele/placeholder</h2>
            </div>
    `;

    // Add each page with images
    for (const page of pages) {
        htmlContent += `
            <div class="page">
                <h1>${page.header}</h1>
                <div class="images">
                    ${page.imageLeft ? `<img src="zdjęcia/${page.imageLeft.split("/").pop()}" alt="Left" class="page-image"/>` : ""}
                    ${page.imageLeftBottom ? `<img src="zdjęcia/${page.imageLeftBottom.split("/").pop()}" alt="Left Bottom" class="page-image"/>` : ""}
                </div>
                <p class="page-number">Strona ${page.number}</p>
            </div>
        `;

        // Add images to ZIP (async inside the loop)
        if (page.imageLeft) {
            const imageLeftData = await fetch(page.imageLeft).then(res => res.blob());
            imagesFolder.file(page.imageLeft.split("/").pop(), imageLeftData);
        }
        if (page.imageLeftBottom) {
            const imageLeftBottomData = await fetch(page.imageLeftBottom).then(res => res.blob());
            imagesFolder.file(page.imageLeftBottom.split("/").pop(), imageLeftBottomData);
        }
    }

    // Add the back cover at the end
    htmlContent += `
            <div class="cover">
                <h2>Do zobaczenia na poprawinach</h2>
            </div>
        </div>
    </body>
    </html>
    `;

    // Add HTML file to ZIP
    albumFolder.file("album.html", htmlContent);

    // Generate the ZIP and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "album.zip");
    });
};

export const exportAlbumToPDF = async (coverFront, coverBack, staticPages) => {
    const pdf = new jsPDF("p", "mm", "a4");

    if (!coverFront || !coverBack || staticPages.length === 0) {
        console.error("Nie znaleziono wszystkich wymaganych elementów (okładek i stron).");
        return;
    }

    // Helper function to add pages to the PDF
    const addPageToPDF = async (element, isFirstPage = false) => {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        if (!isFirstPage) {
            pdf.addPage();
        }
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0); // Scale the image in the PDF
    };

    // Add the front cover
    await addPageToPDF(coverFront, true);

    // Add the static pages
    for (let i = 0; i < staticPages.length; i++) {
        await addPageToPDF(staticPages[i]);
    }

    // Add the back cover
    await addPageToPDF(coverBack);

    // Save the PDF
    pdf.save("album.pdf");
};

export const exportAlbumToDocx = async (pages) => {
    const frontCoverText = document.querySelector(".staticCoverStart")?.innerText || "Okładka przednia";
    const backCoverText = document.querySelector(".staticCoverBack")?.innerText || "Okładka tylna";

    const albumPages = pages.map((page) => ({
        header: page.header,
        images: page.images.map((image) => image.src), // Pobieramy tylko src każdego obrazka
        layout: page.layout,
    }));

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        background: {
                            color: "FFFF00", // Żółty kolor
                        },
                    },
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: frontCoverText,
                                bold: true,
                                size: 48,
                                color: "FF7F50",
                            }),
                        ],
                        alignment: "center",
                        spacing: { after: 400 },
                    }),
                ],
            },
            ...await Promise.all(albumPages.map(async (page) => {
                const imageBase64Promises = page.images.map((imageUrl) => toBase64(imageUrl));
                const imageBase64s = await Promise.all(imageBase64Promises);

                // Generowanie układu zdjęć w zależności od layoutu
                const layoutContent = generateLayout(imageBase64s, page.layout);

                return {
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: page.header,
                                    bold: true,
                                    size: 36,
                                }),
                            ],
                            alignment: "center",
                            spacing: { after: 400 },
                        }),
                        ...layoutContent,
                    ],
                };
            })),
            {
                properties: {
                    page: {
                        background: {
                            color: "FFFF00",
                        },
                    },
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: backCoverText,
                                bold: true,
                                size: 36,
                                color: "FF7F50",
                            }),
                        ],
                        alignment: "center",
                        spacing: { after: 400 },
                    }),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "album.docx");
    });
};

// Generowanie układu dla zdjęć
function generateLayout(images, layout) {
    switch (layout) {
        case "horizontal":
            // Dwa zdjęcia jeden pod drugim
            return images.map((base64Image) =>
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: base64Image,
                            transformation: { width: 600, height: 400 },
                        }),
                    ],
                    alignment: "center",
                })
            );

        case "vertical":
            // Dwa zdjęcia obok siebie
            return [
                new Table({
                    rows: [
                        new TableRow({
                            children: images.map((base64Image) =>
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new ImageRun({
                                                    data: base64Image,
                                                    transformation: { width: 300, height: 200 },
                                                }),
                                            ],
                                            alignment: "center",
                                        }),
                                    ],
                                })
                            ),
                        }),
                    ],
                }),
            ];

        case "grid-2x2": {
            // Siatka 2x2 dla maksymalnie 4 zdjęć
            const rows = [];
            for (let i = 0; i < images.length; i += 2) {
                const rowImages = images.slice(i, i + 2);
                rows.push(
                    new TableRow({
                        children: rowImages.map((base64Image) =>
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new ImageRun({
                                                data: base64Image,
                                                transformation: { width: 300, height: 200 },
                                            }),
                                        ],
                                        alignment: "center",
                                    }),
                                ],
                            })
                        ),
                    })
                );
            }
            return [
                new Table({
                    rows,
                }),
            ];
        }

        case "default":
        default:
            // Domyślnie jedno zdjęcie na środku
            return images.slice(0, 1).map((base64Image) =>
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: base64Image,
                            transformation: { width: 600, height: 450 },
                        }),
                    ],
                    alignment: "center",
                })
            );
    }
}

// Funkcja konwertująca obraz do Base64
async function toBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    resolve(base64data.split(",")[1]); // Usuwamy nagłówek Base64
                };
            });
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
}