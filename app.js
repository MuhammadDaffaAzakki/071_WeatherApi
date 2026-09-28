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

        