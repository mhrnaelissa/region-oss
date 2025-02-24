import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/regions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; // ✅ Default 10 data per halaman
    const offset = (page - 1) * limit;

    const filters = [];
    const values = [];
    let valueIndex = 1;

    if (req.query.kab_kota) {
      filters.push(`TRIM(kab_kota) ILIKE $${valueIndex}`);
      values.push(`%${req.query.kab_kota}%`);
      valueIndex++;
    }

    if (req.query.kecamatan) {
      filters.push(`TRIM(kecamatan) ILIKE $${valueIndex}`);
      values.push(`%${req.query.kecamatan}%`);
      valueIndex++;
    }

    if (req.query.propinsi) {
      filters.push(`TRIM(propinsi) ILIKE $${valueIndex}`);
      values.push(`%${req.query.propinsi}%`);
      valueIndex++;
    }

    const filterQuery = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    // ✅ Hitung total data tanpa LIMIT
    const countQuery = `SELECT COUNT(*) AS total FROM m_regions ${filterQuery}`;
    const countResult = await pool.query(countQuery, values);
    const totalData = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalData / limit);

    console.log("📌 Total Data:", totalData);
    console.log("📌 Total Pages:", totalPages);
    console.log("📌 Current Page:", page);

    // ✅ Ambil data dengan LIMIT dan OFFSET
    values.push(limit, offset);
    const dataQuery = `
      SELECT * FROM m_regions
      ${filterQuery}
      ORDER BY region_id
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1};
    `;

    const result = await pool.query(dataQuery, values);

    res.json({
      data: result.rows,
      currentPage: page,
      totalPages: totalPages,
      totalData: totalData,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    });
  } catch (error) {
    console.error("❌ ERROR Database:", error);
    res.status(500).json({ error: "Gagal mengambil data dari database" });
  }
});

export default router;
