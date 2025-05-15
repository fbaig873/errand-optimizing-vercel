// /api/user_data/[id].js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  const { id } = req.query;       // dynamic route parameter
  if (!id) return res.status(400).json({ error: 'Missing listing id in URL' });

  try {
    if (req.method === 'GET') {
      /* 🔍 GET single listing */
      const { data, error } = await supabase.from('user_data').select('*').eq('id', id).single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      /* ✏️ UPDATE listing */
      const { title, description, location } = req.body || {};
      const { data, error } = await supabase
        .from('user_data')
        .update({ title, description, location })
        .eq('id', id)
        .select();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      /* ❌ DELETE listing */
      const { data, error } = await supabase.from('user_data').delete().eq('id', id).select();
      if (error) throw error;
      return res.status(200).json(data);
    }

    // Unsupported verb
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
