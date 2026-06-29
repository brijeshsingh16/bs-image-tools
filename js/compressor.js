document.addEventListener("DOMContentLoaded", () => {

    // ================= IMAGE COMPRESSOR LOGIC =================


    // ================= ELEMENTS =================


    const compressInput =
        document.getElementById("compressInput");

    const originalPreview =
        document.getElementById("originalPreview");

    const compressPreview =
        document.getElementById("compressPreview");

    const compressOriginalInfo =
        document.getElementById("compressOriginalInfo");

    const compressInfo =
        document.getElementById("compressInfo");

    const qualityRange =
        document.getElementById("qualityRange");

    const qualityValue =
        document.getElementById("qualityValue");

    const compressSizeRange =
        document.getElementById("compressSizeRange");

    const compressSizeInput =
        document.getElementById("compressSizeInput");

    const compressBtn =
        document.getElementById("compressBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const compressLoader =
        document.getElementById("compressLoader");

    const removeImage =
        document.getElementById("removeImage");

    // ================= VARIABLES =================


    let compressorFile = null;

    let compressedFile = null;

    // ================= INITIAL STATE =================


    qualityRange.disabled = true;

    compressSizeRange.disabled = true;

    compressSizeInput.disabled = true;

    compressBtn.disabled = true;

    downloadBtn.disabled = true;

    downloadBtn.hidden = true;

    // ================= QUALITY RANGE =================


    qualityRange.addEventListener(
        "input",
        () => {

        qualityValue.innerText =
            qualityRange.value + "%";

    });

    // ================= SIZE RANGE =================


    compressSizeRange.addEventListener(
        "input",
        () => {

        compressSizeInput.value =
            compressSizeRange.value;

    });

    compressSizeInput.addEventListener(
        "input",
        () => {

        compressSizeRange.value =
            compressSizeInput.value;

    });

    // ================= SELECT IMAGE =================


    compressInput.addEventListener(
        "change",
        () => {

        compressorFile =
            compressInput.files[0];

        if (!compressorFile)
            return;

        // Original Preview

        originalPreview.src =

            URL.createObjectURL(
                compressorFile);

        // Original Info

        compressOriginalInfo.innerHTML =

            `
${compressorFile.name}
<br>
Original Size:
<br>
${(compressorFile.size / 1024).toFixed(2)} KB
`;

        // Enable Controls


        qualityRange.disabled = false;

        compressSizeRange.disabled = false;

        compressSizeInput.disabled = false;

        compressBtn.disabled = false;

        // Show Remove Button

        removeImage.hidden = false;

        // Clear Old Result


        compressPreview.src = "";

        compressInfo.innerHTML = "";

        compressedFile = null;

        downloadBtn.hidden = true;

        downloadBtn.disabled = true;

    });

    // ================= REMOVE IMAGE =================


    removeImage.addEventListener(
        "click",
        () => {

        compressInput.value = "";

        originalPreview.src = "";

        compressPreview.src = "";

        compressOriginalInfo.innerHTML = "";

        compressInfo.innerHTML = "";

        compressorFile = null;

        compressedFile = null;

        removeImage.hidden = true;

        qualityRange.disabled = true;

        compressSizeRange.disabled = true;

        compressSizeInput.disabled = true;

        compressBtn.disabled = true;

        downloadBtn.hidden = true;

        downloadBtn.disabled = true;

    });

    // ================= COMPRESS IMAGE =================


    compressBtn.addEventListener(
        "click",
        async() => {

        if (!compressorFile)
            return;

        compressLoader.hidden = false;

        compressBtn.disabled = true;

        try {

            const options = {

                maxSizeMB:

                Number(compressSizeInput.value) / 1024,

                maxWidthOrHeight:

                1920,

                useWebWorker: true,

                initialQuality:

                Number(qualityRange.value) / 100

            };

            compressedFile =

                await imageCompression(

                    compressorFile,

                    options);

            // Show Compressed Preview


            compressPreview.src =

                URL.createObjectURL(
                    compressedFile);

            // Calculate Reduction


            const reduced =

                100 -

                Math.round(

                    (compressedFile.size /

                        compressorFile.size)

                     * 100);

            // Show Info


            compressInfo.innerHTML =

                `
Compressed Size:
<br>

${(compressedFile.size / 1024).toFixed(2)} KB

<br>

Reduced:
${reduced}%

`;

            // Enable Download


            downloadBtn.hidden = false;

            downloadBtn.disabled = false;

        } catch (error) {

            console.log(
                "Compression Error:",
                error);

        }

        compressLoader.hidden = true;

        compressBtn.disabled = false;

    });

    // ================= DOWNLOAD =================


    downloadBtn.addEventListener(
        "click",
        () => {

        if (!compressedFile)
            return;

        const link =

            document.createElement("a");

        link.href =

            URL.createObjectURL(
                compressedFile);

        link.download =

            "compressed-image";

        link.click();

    });

});
