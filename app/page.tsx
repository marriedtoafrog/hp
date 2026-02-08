import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Fetch data from the captions table
  const { data, error } = await supabase
    .from('captions')
    .select('*')
    .limit(10)

  if (error) {
    return <div>Error loading data: {error.message}</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Captions from Supabase</h1>
      <div>
        {data?.map((caption, index) => (
          <div key={index} style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <pre>{JSON.stringify(caption, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}