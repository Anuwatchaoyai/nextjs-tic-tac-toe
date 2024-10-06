import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

interface UserSession {
    sub: string;
    name: string;
    email: string;
    auth0Id?: string;
}

interface Session {
    user?: UserSession;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getSession(req, res) as Session;

    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { scoreDelta, consecutiveWinsDelta } = req.body;

    if (typeof scoreDelta !== 'number' || typeof consecutiveWinsDelta !== 'number') {
        return res.status(400).json({ message: 'Invalid request body' });
    }

    const { sub } = session.user;

    try {
        // เรียกข้อมูลผู้ใช้ปัจจุบัน
        const user = await prisma.user.findUnique({
            where: { auth0Id: sub },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await prisma.user.update({
            where: { auth0Id: sub },
            data: {
                score: scoreDelta,
                consecutiveWins: consecutiveWinsDelta,
            },
        });

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
