import { Request, Response } from 'express';
import pool from '../config/db';

export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                type AS action,       
                'INVENTARIO' AS module,
                reason AS description,  
                created_at,
                quantity,               
                cost_at_moment         
            FROM inventory_logs
            ORDER BY created_at DESC
                LIMIT 100
        `);
        res.json(result.rows);
    } catch (error: any) {
        console.error("Error SQL:", error.message);
        res.status(500).json({ message: "Error al obtener logs de inventario", error: error.message });
    }
};

export const insertLog = async (action: string, module: string, description: string) => {
    try {
        await pool.query(
            'INSERT INTO audit_logs (action, module, description) VALUES ($1, $2, $3)',
            [action, module, description]
        );
    } catch (err) {
        console.error("No se pudo guardar el log de auditoría:", err);
    }
};