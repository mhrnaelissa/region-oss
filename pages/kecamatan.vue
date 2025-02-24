<template>
  <div>
    <h2>Data Kecamatan Kabupaten/Kota Indonesia</h2>
    <!-- 🔍 Filter -->
    <center>
      <div><input v-model="searchKabKota" @input="fetchData" placeholder="🔍 Search Here..." /> <button @click="resetFilter">❌ Reset</button></div>
    </center>

    <!-- Judul Tabel -->
    <div v-if="regions.length > 0">
      <h3>Daftar Kecamatan: {{ searchKabKota }}</h3>
    </div>

    <!-- 📊 Table -->
    <div v-if="regions.length > 0">
      <table>
        <thead>
          <tr>
            <th v-for="(column, index) in tableColumns" :key="index">
              {{ column.replace("_", " ").toUpperCase() }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(region, index) in uniqueRegions" :key="index">
            <td v-for="(column, index) in tableColumns" :key="index">
              {{ region[column] || "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>❌ Tidak ada data ditemukan.</div>

    <!-- 📤 Export Buttons -->
    <center>
      <div style="margin: 7px"><button @click="exportToPDF">📄 Export PDF</button> <button @click="exportToCSV">📊 Export CSV</button></div>
    </center>

    <!-- 🔄 Pagination -->
    <p>
      <center>
        <div>
          <button style="margin-right: 7px" @click="prevPage" :disabled="!prevPageNumber">◀ Prev</button>

          <span>Hal. {{ currentPage }} dari {{ totalPages }}</span> <button style="margin-left: 7px" @click="nextPage" :disabled="!nextPageNumber">Next ▶</button>
        </div>
      </center>
    </p>

    <!-- Tombol Kembali -->
    <button><NuxtLink to="/"> 🔙 Kembali ke Beranda </NuxtLink></button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import "~/assets/css/global.css";

const regions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const nextPageNumber = ref(null);
const prevPageNumber = ref(null);
const searchKabKota = ref("");
const searchKecamatan = ref("");

// **Kolom yang akan ditampilkan**
const tableColumns = computed(() => {
  return ["kab_kota", "kecamatan"];
});

const fetchData = async () => {
  try {
    const response = await fetch(`http://localhost:5001/api/regions?page=${currentPage.value}&limit=350&kab_kota=${searchKabKota.value}&kecamatan=${searchKecamatan.value}`);
    const data = await response.json();

    regions.value = data.data;
    totalPages.value = data.totalPages;
    nextPageNumber.value = data.nextPage;
    prevPageNumber.value = data.prevPage;
  } catch (err) {
    console.error("Error:", err);
  }
};

const uniqueRegions = computed(() => {
  const map = new Map();
  regions.value.forEach((region) => {
    const key = `${region.kab_kota}-${region.kecamatan}`;
    if (!map.has(key)) {
      map.set(key, region);
    }
  });
  return Array.from(map.values());
});

const prevPage = () => {
  if (prevPageNumber.value) {
    currentPage.value = prevPageNumber.value;
    fetchData();
  }
};

const nextPage = () => {
  if (nextPageNumber.value) {
    currentPage.value = nextPageNumber.value;
    fetchData();
  }
};

const resetFilter = () => {
  searchKabKota.value = "";
  searchKecamatan.value = "";
  fetchData();
};

// PDF
const exportToPDF = () => {
  const doc = new jsPDF();

  const title = `Daftar Kecamatan ${searchKabKota.value}`;
  doc.text(title, 105, 15, { align: "center" });

  // Tabel PDF
  autoTable(doc, {
    head: [["No", "Kabupaten/Kota", "Kecamatan"]],
    body: uniqueRegions.value.map((region, index) => [index + 1, region.kab_kota, region.kecamatan]),
    startY: 30,
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`${i} / ${pageCount}`, 105, 285, { align: "center" });
  }

  doc.save(`${title}.pdf`);
};

// CSV
const exportToCSV = () => {
  const csv = Papa.unparse({
    fields: ["No", "Kabupaten/Kota", "Kecamatan"],
    data: uniqueRegions.value.map((region, index) => [index + 1, region.kab_kota, region.kecamatan]),
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Daftar_Kecamatan_${searchKabKota.value}.csv`;
  link.click();
};

onMounted(fetchData);
</script>
