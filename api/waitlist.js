// Waitlist sign-ups for the landing page, stored as private JSON files in Vercel Blob.
// GET returns the sign-up count; POST adds or updates one sign-up.
import { createHash } from 'node:crypto';
import { list, put } from '@vercel/blob';

const PREFIX = 'waitlist/';
const ROLES = new Set(['student', 'staff', 'other']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function countSignups() {
  let count = 0;
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    count += page.blobs.length;
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return count;
}

function readBody(req) {
  if (typeof req.body !== 'string') return req.body || {};
  try { return JSON.parse(req.body || '{}'); } catch { return null; }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
      return res.status(200).json({ count: await countSignups() });
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    const body = readBody(req);
    if (!body) return res.status(400).json({ error: 'The form data could not be read.' });
    // Bots fill the hidden "website" field; accept quietly and store nothing.
    if (body.website) return res.status(201).json({ ok: true });

    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const role = String(body.role || '');
    if (email.length > 254 || !EMAIL.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (name.length > 80) return res.status(400).json({ error: 'Keep your name under 80 characters.' });
    if (!ROLES.has(role)) return res.status(400).json({ error: 'Choose student, staff or other.' });
    if (body.consent !== true) return res.status(400).json({ error: 'Tick the box to agree to the privacy notice.' });

    // One file per email address, so signing up twice updates the entry instead of adding a second one.
    const id = createHash('sha256').update(email).digest('hex');
    await put(`${PREFIX}${id}.json`, JSON.stringify({ name, email, role, joinedAt: new Date().toISOString() }), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('waitlist error', err);
    return res.status(500).json({ error: 'Something went wrong on our side. Try again in a minute.' });
  }
}
