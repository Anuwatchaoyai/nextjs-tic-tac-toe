import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../lib/prisma';

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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getSession(req, res) as Session;

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { sub, name, email } = session.user;

  try {
    let user = await prisma.user.findUnique({
      where: { auth0Id: sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id: sub,
          name: name || null,
          email: email || null,
        },
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
