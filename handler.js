const { nanoid } = require('nanoid');
const express = require('express');
const app = express();
app.use(express.json());

let books = [];

// POST /books
app.post('/books', (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

    if (!name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
    }

    const id = nanoid();

    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    res.status(201).json({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    });
});

// GET /books
app.get('/books', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            books: books.map(({ id, name, publisher }) => ({ id, name, publisher }))
        }
    });
});

// GET /books/:bookId
app.get('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    const book = books.find(book => book.id === bookId);

    if (!book) {
        return res.status(404).json({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    });
});

// PUT /books/:bookId
app.put('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

    if (!name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
    }

    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
    }

    const updatedAt = new Date().toISOString();

    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
    };

    res.status(200).json({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    });
});

// DELETE /books/:bookId
app.delete('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });
    }

    books.splice(bookIndex, 1);

    res.status(200).json({
        status: 'success',
        message: 'Buku berhasil dihapus'
    });
});

const PORT = 9000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
