// Test admin endpoint for Vercel
export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ 
      message: "Admin add-product endpoint reached",
      body: req.body, 
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
