// ================= IMAGE TO PDF LOGIC =================

// ================= ELEMENTS =================

const pdfInput = document.getElementById("pdfInput");
const pdfGallery = document.getElementById("pdfGallery");

const createPdfBtn = document.getElementById("createPdfBtn");
const downloadBtn = document.getElementById("downloadBtn");
const removeAllBtn = document.getElementById("removeAllBtn");

const loader = document.getElementById("loader");

const pdfSize = document.getElementById("pdfSize");

const pdfInfo = document.getElementById("pdfInfo");

// ================= VARIABLES =================

let pdfImages = [];
let generatedPDF = null;

// ================= INITIAL STATE =================

pdfSize.disabled = true;

createPdfBtn.disabled = true;

removeAllBtn.disabled = true;
removeAllBtn.hidden = true;

downloadBtn.hidden = true;
downloadBtn.disabled = true;

// ================= SELECT IMAGES =================

pdfInput.addEventListener("change", () => {

    const files = Array.from(pdfInput.files);

    pdfImages.push(...files);

    showGallery();

    updateState();

});

// ================= SHOW GALLERY =================

function showGallery() {

    pdfGallery.innerHTML = "";

    pdfImages.forEach((file, index) => {

        const box = document.createElement("div");

        box.className = "pdf-item";

        box.innerHTML = `

<button
class="pdf-remove"
data-index="${index}">

<i class="fa-solid fa-xmark"></i>

</button>

<img
src="${URL.createObjectURL(file)}"
alt="Preview">

`;

        pdfGallery.appendChild(box);

    });

}

// ================= UPDATE STATE =================

function updateState() {

    const hasImages = pdfImages.length > 0;

    pdfSize.disabled = !hasImages;

    createPdfBtn.disabled = !hasImages;

    removeAllBtn.hidden = !hasImages;
    removeAllBtn.disabled = !hasImages;

    if (!hasImages) {

        generatedPDF = null;

        downloadBtn.hidden = true;
        downloadBtn.disabled = true;

        pdfInfo.innerHTML = "";

    }

}

// ================= REMOVE SINGLE IMAGE =================

pdfGallery.addEventListener("click", (e) => {

    const btn = e.target.closest(".pdf-remove");

    if (!btn)
        return;

    const index = Number(btn.dataset.index);

    pdfImages.splice(index, 1);

    showGallery();

    updateState();

});

// ================= REMOVE ALL =================

removeAllBtn.addEventListener("click", () => {

    pdfImages = [];

    pdfGallery.innerHTML = "";

    pdfInput.value = "";

    generatedPDF = null;

    updateState();

});

// ================= CREATE PDF =================

createPdfBtn.addEventListener("click", async() => {

    if (!pdfImages.length)
        return;

    loader.hidden = false;

    createPdfBtn.disabled = true;

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({

        orientation: "portrait",
        unit: "mm",
        format: pdfSize.value

    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pdfImages.length; i++) {

        const imgData = await fileToDataURL(pdfImages[i]);

        const img = await loadImage(imgData);

        if (i > 0) {

            pdf.addPage();

        }

        const margin = 10;

        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        let width = img.width;
        let height = img.height;

        const ratio = Math.min(maxWidth / width, maxHeight / height);

        width *= ratio;
        height *= ratio;

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        const format = pdfImages[i].type.includes("png") ? "PNG" : "JPEG";

        pdf.addImage(

            imgData,
            format,
            x,
            y,
            width,
            height);

    }

    generatedPDF = pdf;

    loader.hidden = true;

    createPdfBtn.disabled = false;

    downloadBtn.hidden = false;
    downloadBtn.disabled = false;

    pdfInfo.innerHTML = `
Total Images: ${pdfImages.length}
<br>
Page Size: ${pdfSize.value.toUpperCase()}
`;

});

// ================= FILE TO DATA URL =================

function fileToDataURL(file) {

    return new Promise((resolve) => {

        const reader = new FileReader();

        reader.onload = (e) => resolve(e.target.result);

        reader.readAsDataURL(file);

    });

}

// ================= LOAD IMAGE =================

function loadImage(src) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.src = src;

    });

}

// ================= DOWNLOAD =================

downloadBtn.addEventListener("click", () => {

    if (!generatedPDF)
        return;

    generatedPDF.save("BS-Image-Tools.pdf");

});
