const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);

app.get('/api/lokasi', async (req, res) => {
    const kotaQuery = req.query.q || "Jakarta";
    const apiKey = "TmW3n2IbOKaZxkghOoYB";
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kotaQuery)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (!data.features || data.features.length === 0) {
            return res.status(404).json({ message: "Lokasi tidak ditemukan!" });
        }

        const feature = data.features[0];
        const koordinat = feature.geometry.coordinates;

        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";

        if (feature.context) {
            feature.context.forEach(item => {
                if (item.id.startsWith('country')) negara = item.text;
                if (item.id.startsWith('region')) provinsi = item.text;
                if (item.id.startsWith('place') || item.id.startsWith('locality') || item.id.startsWith('neighborhood')) {
                    kecamatan = item.text;
                }
            });
        }

        if (provinsi === "-" && feature.text) {
            provinsi = feature.text;
        }

        res.json({
            lokasi: feature.place_name || feature.text,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan !== "-" ? kecamatan : (feature.text || "-"),
            longitude: koordinat[0],
            latitude: koordinat[1]
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Gagal mengambil data dari API MapTiler"
        });
    }
});

});