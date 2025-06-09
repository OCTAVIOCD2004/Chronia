import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';

// Carga variables desde backend/.env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  server:   process.env.DB_HOST,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  options: {
    // process.env.DB_ENCRYPT viene como string, lo convertimos a boolean
    encrypt:            process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
  }
};

// PoolPromise para reutilizar conexiones
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conexión a SQL Server exitosa');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión a SQL Server:', err);
    throw err;
  });

export { sql, poolPromise };
