import express, { Request, Response } from "express";
import { prisma } from "../index";
import { ApiError, UserResponse, UserDetailResponse } from "../types";

const router = express.Router();

const getAllUsers = async (
  _req: Request,
  res: Response<UserResponse[] | ApiError>
) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return res.json(users);
  } catch {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

const getUserById = async (
  req: Request,
  res: Response<UserDetailResponse | ApiError>
) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        currentBooks: true,
        borrowHistory: {
          where: { returnedAt: { not: null } },
          include: { book: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const userResponse: UserDetailResponse = {
      id: user.id,
      name: user.name,
      books: {
        present: user.currentBooks.map((book) => ({
          id: book.id,
          name: book.name,
        })),
        past: user.borrowHistory.map((history) => ({
          id: history.book.id,
          name: history.book.name,
          userScore: history.score || 0,
        })),
      },
    };

    return res.json(userResponse);
  } catch {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

interface BorrowParams {
  userId: string;
  bookId: string;
}

const borrowBook = async (
  req: Request<BorrowParams>,
  res: Response<void | ApiError>
) => {
  try {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);

    const [user, book] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.book.findUnique({ where: { id: bookId } }),
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.currentOwnerId)
      return res.status(400).json({ error: "Book is already borrowed" });

    await prisma.$transaction([
      prisma.borrowHistory.create({
        data: { userId, bookId, borrowedAt: new Date() },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { currentOwnerId: userId },
      }),
    ]);

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to borrow book" });
  }
};

interface ReturnBookBody {
  score?: number;
}

const returnBook = async (
  req: Request<BorrowParams, void, ReturnBookBody>,
  res: Response<void | ApiError>
) => {
  try {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);
    const { score } = req.body;

    if (score !== undefined && (score < 0 || score > 10)) {
      return res.status(400).json({ error: "Score must be between 0 and 10" });
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book?.currentOwnerId || book.currentOwnerId !== userId) {
      return res
        .status(400)
        .json({ error: "Book is not borrowed by this user" });
    }

    await prisma.$transaction([
      prisma.borrowHistory.updateMany({
        where: { userId, bookId, returnedAt: null },
        data: { returnedAt: new Date(), score },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { currentOwnerId: null },
      }),
    ]);

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Failed to return book" });
  }
};

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/:userId/borrow/:bookId", borrowBook);
router.post("/:userId/return/:bookId", returnBook);

export default router;
