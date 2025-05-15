const { createClient } = require('@supabase/supabase-js');

// Environment variables are injected by Vercel ➜  Settings ▸ Environment Variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      /* 🔍 GET all user_data */
      const { data, error } = await supabase.from('user_data').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      /* ➕ POST new listing */
      const { title, description, location } = req.body || {};
      const { data, error } = await supabase
        .from('user_data')
        .insert([{ title, description, location }])
        .select();
      if (error) throw error;
      return res.status(201).json(data);
    }

    // Unsupported verb
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
