import { Request, Response } from 'express';
import pool from '../config/db';

export const createCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
        const query = `
            INSERT INTO categories (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(query, [name, description]);

        res.status(201).json({
            message: 'Categoría creada con éxito',
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error en createCategory:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }

        res.status(500).json({ error: 'Error interno al crear la categoría' });
    }
};

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getCategories:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};