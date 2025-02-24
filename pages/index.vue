<template>
  <div>
    <h2>Data Wilayah</h2>

    <!-- 🔍 Filter -->
    <center>
      <div>
        <input v-model="searchPropinsi" @input="fetchData" placeholder="🔍 Cari Provinsi..." />
        <button style="margin-left: 10px" @click="resetFilter">❌ Reset</button>
      </div>
    </center>

    <button style="margin: 10px"><NuxtLink to="/kecamatan"> 🔍 Daftar Kecamatan </NuxtLink></button>

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
          <tr v-for="(region, index) in regions" :key="index">
            <td v-for="(column, index) in tableColumns" :key="index">
              {{ region[column] || "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>❌ Tidak ada data ditemukan.</div>

    <p></p>
    <!-- 🔄 Pagination -->
    <center>
      <div>
        <button style="margin-right: 7px" @click="prevPage" :disabled="prevPageNumber === null">◀ Prev</button>
        <span>Hal. {{ currentPage }} dari {{ totalPages }}</span>
        <button style="margin-left: 7px" @click="nextPage" :disabled="nextPageNumber === null">Next ▶</button>
      </div>
    </center>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import "~/assets/css/global.css";

const regions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const nextPageNumber = ref(null);
const prevPageNumber = ref(null);
const searchPropinsi = ref("");
const searchKabKota = ref("");
const searchKecamatan = ref("");

const tableColumns = computed(() => {
  return searchPropinsi.value || searchKabKota.value || searchKecamatan.value ? ["region_id","propinsi", "kab_kota", "kecamatan", "kelurahan"] : ["region_id", "propinsi", "kab_kota", "kecamatan", "kelurahan"];
});

const fetchData = async () => {
  try {
    console.log("🚀 Fetching data for Page:", currentPage.value);
    const response = await fetch(
      `http://localhost:5001/api/regions?page=${currentPage.value}&limit=10&propinsi=${encodeURIComponent(searchPropinsi.value)}&kab_kota=${encodeURIComponent(searchKabKota.value)}&kecamatan=${encodeURIComponent(searchKecamatan.value)}`
    );
    const data = await response.json();
    console.log("📌 API Response:", data);

    regions.value = data.data;
    totalPages.value = data.totalPages;
    currentPage.value = data.currentPage;
    nextPageNumber.value = data.nextPage;
    prevPageNumber.value = data.prevPage;
  } catch (err) {
    console.error("❌ Error Fetching Data:", err);
  }
};

const prevPage = () => {
  if (prevPageNumber.value !== null) {
    currentPage.value = prevPageNumber.value;
    fetchData();
  }
};

const nextPage = () => {
  if (nextPageNumber.value !== null) {
    currentPage.value = nextPageNumber.value;
    fetchData();
  }
};

const resetFilter = () => {
  searchPropinsi.value = "";
  searchKabKota.value = "";
  searchKecamatan.value = "";
  currentPage.value = 1;
  fetchData();
};

onMounted(fetchData);
</script>
