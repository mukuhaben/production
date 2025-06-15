import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Prefer DATABASE_URL for production (like on Render)
const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "firstcraft_ecommerce",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully to:", client.database);
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};

// Query function with error handling
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text: text.substring(0, 100), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Transaction function
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get client for manual transaction management
export const getClient = async () => {
  return await pool.connect();
};

// Close pool
export const closePool = async () => {
  await pool.end();
};

export default pool;
