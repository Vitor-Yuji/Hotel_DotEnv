const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e ANON KEY são obrigatórios');
}

// Cliente Supabase para operações públicas
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente Supabase para operações administrativas (com service role key)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

module.exports = {
  supabase,
  supabaseAdmin
};
