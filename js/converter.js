document.addEventListener("DOMContentLoaded", () => {

    // ================= ELEMENTS =================

    const converterInput = document.getElementById("converterInput");
    const originalPreview = document.getElementById("originalPreview");
    const convertedPreview = document.getElementById("convertedPreview");
    const originalInfo = document.getElementById("originalInfo");
    const convertedInfo = document.getElementById("convertedInfo");
    const convertBtn = document.getElementById("convertBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const formatSelect = document.getElementById("formatSelect");
    const loader = document.getElementById("loader");
    const removeImage = document.getElementById("removeImage");

    // ================= VARIABLES =================

    let selectedFile = null;
    let convertedBlob = null;

    // ================= INITIAL STATE =================

    formatSelect.disabled = true;
    convertBtn.disabled = true;
    downloadBtn.disabled = true;
    downloadBtn.hidden = true;

    // ================= IMAGE SELECT =================

    converterInput.addEventListener("change", () => {

        selectedFile = converterInput.files[0];

        if (!selectedFile)
            return;

        originalPreview.src = URL.createObjectURL(selectedFile);

        originalInfo.innerHTML = `
            ${selectedFile.name}<br>
            ${(selectedFile.size / 1024).toFixed(2)} KB
        `;

        removeImage.hidden = false;

        formatSelect.disabled = false;
        convertBtn.disabled = false;

        downloadBtn.hidden = true;
        downloadBtn.disabled = true;

        convertedPreview.src = "";
        convertedInfo.innerHTML = "";
        convertedBlob = null;
    });

    // ================= REMOVE IMAGE =================

    removeImage.addEventListener("click", () => {

        converterInput.value = "";

        originalPreview.src = "";
        convertedPreview.src = "";

        originalInfo.innerHTML = "";
        convertedInfo.innerHTML = "";

        removeImage.hidden = true;

        formatSelect.disabled = true;
        convertBtn.disabled = true;

        downloadBtn.hidden = true;
        downloadBtn.disabled = true;

        loader.hidden = true;

        selectedFile = null;
        convertedBlob = null;
    });

    // ================= CONVERT =================

    convertBtn.addEventListener("click", async() => {

        if (!selectedFile)
            return;

        loader.hidden = false;

        convertBtn.disabled = true;
        formatSelect.disabled = true;

        const img = new Image();
        img.src = URL.createObjectURL(selectedFile);

        await img.decode();

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        convertedBlob = await new Promise(resolve => {

            canvas.toBlob(
                resolve,
                formatSelect.value,
                0.9);

        });

        convertedPreview.src = URL.createObjectURL(convertedBlob);

        convertedInfo.innerHTML = `
            Converted Size:<br>
            ${(convertedBlob.size / 1024).toFixed(2)} KB
        `;

        loader.hidden = true;

        convertBtn.disabled = false;
        formatSelect.disabled = false;

        downloadBtn.hidden = false;
        downloadBtn.disabled = false;

    });

    // ================= DOWNLOAD =================

    downloadBtn.addEventListener("click", () => {

        if (!convertedBlob)
            return;

        const extension = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp"
        }
        [formatSelect.value];

        const link = document.createElement("a");

        link.href = URL.createObjectURL(convertedBlob);
        link.download = `converted-image.${extension}`;

        link.click();
    });

});
